export const Constants = {
  /* These constants are populated by variables in .env, then set by Webpack */
  BRANDING_NAME: BRANDING_NAME,
  DIRECT_MEDIA_DOMAINS: DIRECT_MEDIA_DOMAINS.split(','),
  TEXT_ONLY_DOMAINS: TEXT_ONLY_DOMAINS.split(','),
  DEPRECATED_DOMAIN_LIST: DEPRECATED_DOMAIN_LIST.split(','),
  DEPRECATED_DOMAIN_EPOCH: BigInt(DEPRECATED_DOMAIN_EPOCH),
  MOSAIC_DOMAIN_LIST: MOSAIC_DOMAIN_LIST.split(','),
  API_HOST_LIST: API_HOST_LIST.split(','),
  HOST_URL: HOST_URL,
  EMBED_URL: EMBED_URL,
  REDIRECT_URL: REDIRECT_URL,
  RELEASE_NAME: RELEASE_NAME,
  API_DOCS_URL: `https://github.com/dangeredwolf/FixTweet/wiki/API-Home`,
  TWITTER_ROOT: 'https://twitter.com',
  TWITTER_API_ROOT: 'https://api.twitter.com',
  BOT_UA_REGEX:
    /bot|facebook|embed|got|firefox\/92|firefox\/38|curl|wget|go-http|yahoo|generator|whatsapp|preview|link|proxy|vkshare|images|analyzer|index|crawl|spider|python|cfnetwork|node/gi,
  /* 3 hours */
  GUEST_TOKEN_MAX_AGE: 3 * 60 * 60,
  /* Twitter Web App actually uses Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA
     instead, but accounts marked as 18+ wouldn't show up then */
  GUEST_BEARER_TOKEN: `Bearer AAAAAAAAAAAAAAAAAAAAAPYXBAAAAAAACLXUNDekMxqa8h%2F40K4moUkGsoc%3DTYfbDKbT3jJPCEVnMYqilB28NHfOPqkca3qaAxGfsyKCs0wRbw`,
  GUEST_FETCH_PARAMETERS: [
    'cards_platform=Web-12',
    'include_cards=1',
    'include_ext_alt_text=true',
    'include_ext_views=true',
    'include_quote_count=true',
    'include_reply_count=1',
    'tweet_mode=extended',
    'include_entities=true',
    'include_ext_media_color=true',
    'include_ext_media_availability=true',
    'include_ext_sensitive_media_warning=true',
    'include_ext_has_birdwatch_notes=true',
    'simple_quoted_tweet=true',
    'ext=mediaStats%2ChighlightedLabel'
  ].join('&'),
  BASE_HEADERS: {
    'authority': 'twitter.com',
    'DNT': `1`,
    'x-twitter-client-language': `en`,
    'sec-ch-ua-mobile': `?0`,
    'content-type': `application/json`,
    'x-twitter-active-user': `yes`,
    'sec-ch-ua-platform': `"Windows"`,
    'Accept': `*/*`,
    'Origin': `https://twitter.com`,
    'Sec-Fetch-Site': `same-site`,
    'Sec-Fetch-Mode': `cors`,
    'Sec-Fetch-Dest': `empty`,
    'Referer': `https://twitter.com/`,
    'Accept-Encoding': `gzip, deflate`,
    'Accept-Language': `en`
  },
  RESPONSE_HEADERS: {
    'allow': 'OPTIONS, GET, PURGE, HEAD',
    'content-type': 'text/html;charset=UTF-8',
    'x-powered-by': '🏳️‍⚧️ Trans Rights',
    'cache-control': 'max-age=3600' // Can be overriden in some cases, like poll tweets
  },
  API_RESPONSE_HEADERS: {
    'access-control-allow-origin': '*',
    'content-type': 'application/json'
  },
  POLL_TWEET_CACHE: 'max-age=60',
  DEFAULT_COLOR: '#10A3FF'
};

if (typeof TEST !== 'undefined') {
  /* Undici gets angry about unicode headers, this is a workaround. */
  Constants.RESPONSE_HEADERS['x-powered-by'] = 'Trans Rights';
}
