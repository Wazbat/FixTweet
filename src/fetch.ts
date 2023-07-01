import { Constants } from './constants';
import { generateUserAgent } from './helpers/useragent';
import { isGraphQLTweetNotFoundResponse } from './utils/graphql';

const API_ATTEMPTS = 16;

export const twitterFetch = async (
  url: string,
  event: FetchEvent,
  useElongator = false,
  validateFunction: (response: unknown) => boolean
): Promise<unknown> => {
  let apiAttempts = 0;
  let newTokenGenerated = false;

  const [userAgent, secChUa] = generateUserAgent();
  console.log(`Outgoing useragent for this request:`, userAgent);

  const tokenHeaders: { [header: string]: string } = {
    'Authorization': Constants.GUEST_BEARER_TOKEN,
    'User-Agent': userAgent,
    'sec-ch-ua': secChUa,
    ...Constants.BASE_HEADERS
  };

  const guestTokenRequest = new Request(
    `${Constants.TWITTER_API_ROOT}/1.1/guest/activate.json`,
    {
      method: 'POST',
      headers: tokenHeaders,
      cf: {
        cacheEverything: true,
        cacheTtl: Constants.GUEST_TOKEN_MAX_AGE
      },
      body: ''
    }
  );

  /* A dummy version of the request only used for Cloudflare caching purposes.
     The reason it exists at all is because Cloudflare won't cache POST requests. */
  const guestTokenRequestCacheDummy = new Request(
    `${Constants.TWITTER_API_ROOT}/1.1/guest/activate.json`,
    {
      method: 'GET',
      cf: {
        cacheEverything: true,
        cacheTtl: Constants.GUEST_TOKEN_MAX_AGE
      }
    }
  );

  const cache = caches.default;

  while (apiAttempts < API_ATTEMPTS) {
    const csrfToken = crypto
      .randomUUID()
      .replace(
        /-/g,
        ''
      ); /* Generate a random CSRF token, this doesn't matter, Twitter just cares that header and cookie match */

    const headers: { [header: string]: string } = {
      Authorization: Constants.GUEST_BEARER_TOKEN,
      ...Constants.BASE_HEADERS
    };

    apiAttempts++;

    let activate: Response | null = null;

    if (!newTokenGenerated) {
      const cachedResponse = await cache.match(guestTokenRequestCacheDummy.clone());

      if (cachedResponse) {
        console.log('Token cache hit');
        activate = cachedResponse;
      } else {
        console.log('Token cache miss');
        newTokenGenerated = true;
      }
    }

    if (newTokenGenerated || activate === null) {
      /* If all goes according to plan, we have a guest token we can use to call API
        AFAIK there is no limit to how many guest tokens you can request.

        This can effectively mean virtually unlimited (read) access to Twitter's API,
        which is very funny. */
      activate = await fetch(guestTokenRequest.clone());
    }

    /* Let's grab that guest_token so we can use it */
    let activateJson: { guest_token: string };

    try {
      activateJson = (await activate?.clone().json()) as { guest_token: string };
    } catch (e: unknown) {
      continue;
    }

    const guestToken = activateJson.guest_token;

    console.log(newTokenGenerated ? 'Activated guest:' : 'Using guest:', activateJson);
    console.log('Guest token:', guestToken);

    /* Just some cookies to mimick what the Twitter Web App would send */
    headers['Cookie'] = [
      `guest_id_ads=v1%3A${guestToken}`,
      `guest_id_marketing=v1%3A${guestToken}`,
      `guest_id=v1%3A${guestToken}`,
      `ct0=${csrfToken};`
    ].join('; ');

    headers['x-csrf-token'] = csrfToken;
    headers['x-twitter-active-user'] = 'yes';
    headers['x-guest-token'] = guestToken;

    let response: unknown;
    let apiRequest;

    try {
      if (useElongator && typeof TwitterProxy !== 'undefined') {
        console.log('Fetching using elongator');
        apiRequest = await TwitterProxy.fetch(url, {
          method: 'GET',
          headers: headers
        });
      } else {
        apiRequest = await fetch(url, {
          method: 'GET',
          headers: headers
        });
      }

      response = await apiRequest?.json();
    } catch (e: unknown) {
      /* We'll usually only hit this if we get an invalid response from Twitter.
         It's uncommon, but it happens */
      console.error('Unknown error while fetching from API', e);
      event &&
        event.waitUntil(
          cache.delete(guestTokenRequestCacheDummy.clone(), { ignoreMethod: true })
        );
      newTokenGenerated = true;
      continue;
    }

    const remainingRateLimit = parseInt(
      apiRequest.headers.get('x-rate-limit-remaining') || '0'
    );
    console.log(`Remaining rate limit: ${remainingRateLimit} requests`);
    /* Running out of requests within our rate limit, let's purge the cache */
    if (remainingRateLimit < 10) {
      console.log(`Purging token on this edge due to low rate limit remaining`);
      event &&
        event.waitUntil(
          cache.delete(guestTokenRequestCacheDummy.clone(), { ignoreMethod: true })
        );
    }

    if (!validateFunction(response)) {
      console.log('Failed to fetch response, got', response);
      newTokenGenerated = true;
      continue;
    }
    /* If we've generated a new token, we'll cache it */
    if (event && newTokenGenerated) {
      const cachingResponse = new Response(await activate.clone().text(), {
        headers: {
          ...tokenHeaders,
          'cache-control': `max-age=${Constants.GUEST_TOKEN_MAX_AGE}`
        }
      });
      console.log('Caching guest token');
      event.waitUntil(cache.put(guestTokenRequestCacheDummy.clone(), cachingResponse));
    }

    // @ts-expect-error - We'll pin the guest token to whatever response we have
    response.guestToken = guestToken;
    return response;
  }

  console.log('Twitter has repeatedly denied our requests, so we give up now');

  return {};
};

const syndicationFetchStatus = async (status: string) => {
  try {
    const [userAgent] = generateUserAgent();
    const response = await fetch(
      `https://cdn.syndication.twimg.com/tweet-result?id=${status}&lang=en`,
      {
        method: 'GET',
        headers: {
          'User-Agent': userAgent
        }
      }
    );
    return response.json();
  } catch (e: unknown) {
    console.log('Failed to fetch tweet via syndication', e);
    return {};
  }
};

export const fetchConversation = async (
  status: string,
  event: FetchEvent,
  useElongator = false
): Promise<SyndicationTweet> => {
  return (
    await syndicationFetchStatus(status)
    /*await twitterFetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${status}&lang=en`,
    event,
    useElongator,
    (_conversation: unknown) => {
      const conversation = _conversation as GraphQLTweetDetailResponse;
      // If we get a not found error it's still a valid response
      if (isGraphQLTweetNotFoundResponse(conversation)) return true;
      const instructions = conversation?.data?.threaded_conversation_with_injections_v2?.instructions;
      if (!Array.isArray(instructions)) return false;
      const timelineAddEntries = instructions.find((e): e is TimeLineAddEntriesInstruction => e?.type === 'TimelineAddEntries');
      if (!timelineAddEntries) return false;
      const graphQLTimelineTweetEntry = timelineAddEntries.entries
      .find((e): e is GraphQLTimelineTweetEntry =>
      // TODO Fix this idk what's up with the typings
      !!(e && typeof e === 'object' && ('entryId' in e) && e?.entryId === `tweet-${status}`));
      if (!graphQLTimelineTweetEntry) return false;
      const tweet = graphQLTimelineTweetEntry?.content?.itemContent?.tweet_results?.result;
      return !!tweet;
      
    }
  )*/) as SyndicationTweet;
};


export const fetchUser = async (
  username: string,
  event: FetchEvent,
  useElongator = false
): Promise<GraphQLUserResponse> => {
  return (await twitterFetch(
    `${
      Constants.TWITTER_ROOT
    }/i/api/graphql/sLVLhk0bGj3MVFEKTdax1w/UserByScreenName?variables=${encodeURIComponent(
      JSON.stringify({
        screen_name: username,
        withSafetyModeUserFields: true
      })
    )}&features=${encodeURIComponent(
      JSON.stringify({
        blue_business_profile_image_shape_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        responsive_web_graphql_timeline_navigation_enabled: false,
        verified_phone_label_enabled: true
      })
    )}`,
    event,
    useElongator,
    // Validator function
    (_res: unknown) => {
      const response = _res as GraphQLUserResponse;
      // If _res.data is an empty object, we have no user
      if (!Object.keys(response?.data).length) {
        return false;
      }
      return !(
        response?.data?.user?.result?.__typename !== 'User' ||
        typeof response.data.user.result.legacy === 'undefined'
      );
      /*
      return !(
        typeof conversation.globalObjects === 'undefined' &&
        (typeof conversation.errors === 'undefined' ||
          conversation.errors?.[0]?.code === 239)
      );
      */
    }
  )) as GraphQLUserResponse;
};
