/* Types for various Twitter API objects.
   Note that a lot of these are not actually complete types. Many unused values may be missing.*/

type TimelineContent = {
  item?: {
    content?: {
      tombstone?: {
        timestoneInfo: {
          richText: {
            text: string;
          };
        };
      };
    };
  };
};

type TimelineInstruction = {
  addEntries?: {
    entries: {
      content: TimelineContent;
      entryId: string;
    }[];
  };
};

type TwitterAPIError = {
  code: number;
  message: string;
};

type TimelineBlobPartial = {
  globalObjects: {
    tweets: {
      [tweetId: string]: TweetPartial;
    };
    users: {
      [userId: string]: UserPartial;
    };
  };
  timeline: {
    instructions: TimelineInstruction[];
  };
  errors?: TwitterAPIError[];
  guestToken?: string;
};

type TweetMediaSize = {
  w: number;
  h: number;
  resize: 'crop' | 'fit';
};

type TweetMediaFormat = {
  bitrate: number;
  content_type: string;
  url: string;
};

type TcoExpansion = {
  display_url: string;
  expanded_url: string;
  indices: [number, number];
  url: string;
};

type TweetMedia = {
  additional_media_info: { monetizable: boolean };
  display_url: string;
  expanded_url: string;
  ext_media_color?: {
    palette?: MediaPlaceholderColor[];
  };
  ext_alt_text?: string;
  id_str: string;
  indices: [number, number];
  media_key: string;
  media_url: string;
  media_url_https: string;
  original_info: { width: number; height: number };
  sizes: {
    thumb: TweetMediaSize;
    large: TweetMediaSize;
    medium: TweetMediaSize;
    small: TweetMediaSize;
  };
  type: 'photo' | 'video' | 'animated_gif';
  url: string;
  video_info?: {
    aspect_ratio: [number, number];
    duration_millis: number;
    variants: TweetMediaFormat[];
  };
};

type CardValue = {
  type: 'BOOLEAN' | 'STRING';
  boolean_value: boolean;
  string_value: string;
};

type TweetCardBindingValues = {
  card_url: CardValue;
  choice1_count?: CardValue;
  choice2_count?: CardValue;
  choice3_count?: CardValue;
  choice4_count?: CardValue;
  choice1_label?: CardValue;
  choice2_label?: CardValue;
  choice3_label?: CardValue;
  choice4_label?: CardValue;
  counts_are_final?: CardValue;
  duration_minutes?: CardValue;
  end_datetime_utc?: CardValue;

  player_url?: CardValue;
  player_width?: CardValue;
  player_height?: CardValue;
  title?: CardValue;
};

type TweetCard = {
  binding_values: TweetCardBindingValues;
  name: string;
};

type TweetEntities = {
  urls?: TcoExpansion[];
  media?: TweetMedia[];
};

/* TODO: Are there more states for ext_views?
   Legacy Tweets use Enabled but have no count, while newer tweets have EnabledWithCount
   and count is populated with a string. */
type ExtViews = {
  state: 'Enabled' | 'EnabledWithCount';
  count?: string;
};

type TweetPartial = {
  card?: TweetCard;
  conversation_id_str: string;
  created_at: string; // date string
  display_text_range: [number, number];
  entities: TweetEntities;
  extended_entities: TweetEntities;
  ext_views?: ExtViews;
  favorite_count: number;
  in_reply_to_screen_name?: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  id_str: string;
  lang: string;
  possibly_sensitive: boolean;
  possibly_sensitive_editable: boolean;
  retweet_count: number;
  quote_count: number;
  quoted_status_id_str: string;
  reply_count: number;
  source: string;
  full_text: string;
  user_id_str: string;
  retweeted_status_id: number;
  retweeted_status_id_str: string;
  user?: UserPartial;
};

type UserPartial = {
  id_str: string;
  name: string;
  screen_name: string;
  profile_image_url_https: string;
  profile_banner_url: string;
  profile_image_extensions_media_color?: {
    palette?: MediaPlaceholderColor[];
  };
};

type MediaPlaceholderColor = {
  rgb: {
    red: number;
    green: number;
    blue: number;
  };
};

type TranslationPartial = {
  id_str: string;
  translationState: 'Success'; // TODO: figure out other values
  sourceLanguage: string;
  localizedSourceLanguage: string;
  destinationLanguage: string;
  translationSource: 'Google';
  translation: string;
  entities: TweetEntities;
};

type GraphQLUserResponse = {
  data: {
    user: {
      result: GraphQLUser;
    };
  };
};

type GraphQLUser = {
  __typename: 'User';
  id: string; // "VXNlcjo3ODMyMTQ="
  rest_id: string; // "783214",
  affiliates_highlighted_label: {
    label?: {
      badge?: {
        url?: string; // "https://pbs.twimg.com/semantic_core_img/1290392753013002240/mWq1iE5L?format=png&name=orig"
      };
      description?: string; // "United States government organization"
      url?: {
        url?: string; // "https://help.twitter.com/rules-and-policies/state-affiliated"
        urlType: string; // "DeepLink"
      };
    };
  };
  business_account: {
    affiliates_count?: 20;
  };
  is_blue_verified: boolean; // false,
  profile_image_shape: 'Circle' | 'Square' | 'Hexagon'; // "Circle",
  has_nft_avatar: boolean; // false,
  legacy: {
    created_at: string; // "Tue Feb 20 14:35:54 +0000 2007",
    default_profile: boolean; // false,
    default_profile_image: boolean; // false,
    description: string; // "What's happening?!",
    entities: {
      description?: {
        urls?: {
          display_url: string; // "about.twitter.com",
          expanded_url: string; // "https://about.twitter.com/",
          url: string; // "https://t.co/DAtOo6uuHk",
          indices: [0, 23];
        }[];
      };
    };
    fast_followers_count: 0;
    favourites_count: number; // 126708,
    followers_count: number; // 4996,
    friends_count: number; // 2125,
    has_custom_timelines: boolean; // true,
    is_translator: boolean; // false,
    listed_count: number; // 88165,
    location: string; // "everywhere",
    media_count: number; // 20839,
    name: string; // "Twitter",
    normal_followers_count: number; // 65669107,
    pinned_tweet_ids_str: string[]; // Array of tweet ids, usually one. Empty if no pinned tweet
    possibly_sensitive: boolean; // false,
    profile_banner_url: string; // "https://pbs.twimg.com/profile_banners/783214/1646075315",
    profile_image_url_https: string; // "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_normal.jpg",
    profile_interstitial_type: string; // "",
    screen_name: string; // "Twitter",
    statuses_count: number; // 15047
    translator_type: string; // "regular"
    verified: boolean; // false
    verified_type: 'Business' | 'Government';
    withheld_in_countries: [];
  };
  professional: {
    rest_id: string; // "1503055759638159366",
    professional_type: string; // "Creator",
    category: [
      {
        id: number; // 354,
        name: string; // "Community",
        icon_name: string; // "IconBriefcaseStroke"
      }
    ];
  };
  legacy_extended_profile: {
    birthdate?: {
      day: number; // 7,
      month: number; // 1,
      visibility: string; // "Public"
      year: number; // 2000
      year_visibility: string; // "Public"
    };
    profile_image_shape: string; // "Circle",
    rest_id: string; // "783214",
  };
  is_profile_translatable: false;
  verification_info: {
    reason: {
      description: {
        entities: {
          from_index: number; // 98,
          ref: {
            url: string; // "https://help.twitter.com/managing-your-account/about-twitter-verified-accounts",
            url_type: string; // "ExternalUrl"
          };
          to_index: number; // 108
        }[];
        text?:
          | 'This account is verified because it’s subscribed to Twitter Blue or is a legacy verified account. Learn more'
          | "This account is verified because it's an official organisation on Twitter. Learn more";
      };
    };
  };
};

type GraphQLTweet = {
  __typename: 'Tweet';
  rest_id: string; // "1674824189176590336",
  has_birdwatch_notes: false,
  core: {
    user_results: {
      result: GraphQLUser;
    }
  }
  edit_control: unknown,
  edit_perspective: unknown,
  is_translatable: false,
  views: {
    count: string; // "562"
    state: string; // "EnabledWithCount"
  }
  source: string; // "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>"
  quoted_status_result?: GraphQLTweet;
  legacy: {
    created_at: string; // "Tue Sep 14 20:00:00 +0000 2021"
    conversation_id_str: string; // "1674824189176590336"
    bookmark_count: number; // 0
    bookmarked: boolean; // false
    favorite_count: number; // 28
    full_text: string; // "This is a test tweet"
    in_reply_to_screen_name: string; // "username"
    in_reply_to_status_id_str: string; // "1674824189176590336"
    in_reply_to_user_id_str: string; // "783214"
    is_quote_status: boolean; // false
    quote_count: number; // 39
    quoted_status_id_str: string; // "1674824189176590336"
    quoted_status_permalink: {
      url: string; // "https://t.co/aBcDeFgHiJ"
      expanded: string; // "https://twitter.com/username/status/1674824189176590336"
      display: string; // "twitter.com/username/statu…"
    };
    reply_count: number; // 1
    retweet_count: number; // 4
    lang: string; // "en"
    possibly_sensitive: boolean; // false
    possibly_sensitive_editable: boolean; // false
    entities: {
      media: {
        display_url: string; // "pic.twitter.com/1X2X3X4X5X"
        expanded_url: string; // "https://twitter.com/username/status/1674824189176590336/photo/1" "https://twitter.com/username/status/1674824189176590336/video/1"
        id_str: string; // "1674824189176590336"
        indices: [number, number]; // [number, number]
        media_url_https: string; // "https://pbs.twimg.com/media/FAKESCREENSHOT.jpg" With videos appears to be the thumbnail
        type: string; // "photo" Seems to be photo even with videos
      }[]
      user_mentions: unknown[];
      urls: TcoExpansion[];
      hashtags: unknown[];
      symbols: unknown[];
    }
    extended_entities: {
      media: TweetMedia[]
    }
  }
  card: {
    rest_id: string; // "card://1674824189176590336",
    legacy: {
      binding_values: {
        key: `choice${1|2|3|4}_label`|'counts_are_final'|`choice${1|2|3|4}_count`|'last_updated_datetime_utc'|'duration_minutes'|'api'|'card_url'
        value: {
          string_value: string; // "Option text"
          type: 'STRING'
        }|{
          boolean_value: boolean; // true
          type: 'BOOLEAN'
        }
      }[]
    }
  }
}
type TweetTombstone = {
  __typename: 'TweetTombstone';
  tombstone: {
    __typename: 'TextTombstone';
    text: {
      rtl: boolean; // false;
      text: string; // "You’re unable to view this Tweet because this account owner limits who can view their Tweets. Learn more"
      entities: unknown[];
    }
  }
}
type GraphQLTimelineTweetEntry = {
  /** The entryID contains the tweet ID */
  entryId: `tweet-${number}`; // "tweet-1674824189176590336"
  sortIndex: string;
  content: {
    entryType: 'TimelineTimelineItem',
    __typename: 'TimelineTimelineItem',
    itemContent: {
      item: 'TimelineTweet',
      __typename: 'TimelineTweet',
      tweet_results: {
        result: GraphQLTweet|TweetTombstone;
      }
    }
  }
}
type GraphQLConversationThread = {
  entryId: `conversationthread-${number}`; // "conversationthread-1674824189176590336"
  sortIndex: string;
}

type GraphQLTimelineEntry = GraphQLTimelineTweetEntry|GraphQLConversationThread|unknown;

type V2ThreadInstruction = TimeLineAddEntriesInstruction | TimeLineTerminateTimelineInstruction;

type TimeLineAddEntriesInstruction = {
  type: 'TimelineAddEntries';
  entries: GraphQLTimelineEntry[];
}

type TimeLineTerminateTimelineInstruction = {
  type: 'TimelineTerminateTimeline';
  direction: 'Top';
}
type GraphQLTweetNotFoundResponse = {
  errors: [{
    message: string; // "_Missing: No status found with that ID"
    locations: unknown[];
    path: string[]; // ["threaded_conversation_with_injections_v2"]
    extensions: {
      name: string; // "GenericError"
      source: string; // "Server"
      code: number; // 144
      kind: string; // "NonFatal"
      tracing: {
        trace_id: string; // "2e39ff747de237db"
      }
    }
    code: number; // 144
    kind: string; // "NonFatal"
    name: string; // "GenericError"
    source: string; // "Server"
    tracing: {
      trace_id: string; // "2e39ff747de237db"
    }
  }]
  data: Record<string, never>;
}
type GraphQLTweetFoundResponse = {
  data: {
    threaded_conversation_with_injections_v2: {
      instructions: V2ThreadInstruction[]
    }
  }
}
type GraphQLTweetDetailResponse = GraphQLTweetFoundResponse | GraphQLTweetNotFoundResponse;


type SyndicationTweet = {
  __typename: "Tweet",
  in_reply_to_screen_name: string; // "TitterDaily",
  in_reply_to_user_id_str: string; // "752567226",
  in_reply_to_status_id_str: string; // "1674765247255654400",
  lang: string; // "en"
  favorite_count: number; // 15343,
  created_at: string; // "2023-06-30T19:41:22.000Z",
  display_text_range: [
    number, number
  ],
  entities: TweetEntities;
  id_str: string; // "1674865731136020505",
  text: string; // "@TitterDaily Temporary emergency measure. We were getting data pillaged so much that it was degrading service for normal users!",
  user: {
    id_str: string; // "44196397",
    name: string; // "Elon Musk",
    profile_image_url_https: string; // "https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_normal.jpg",
    screen_name: string; // "elonmusk",
    verified: false,
    highlighted_label: {
      description: "Twitter",
      badge: {
        url: "https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_bigger.jpg"
      },
      url: {
        url: "https://twitter.com/Twitter",
        url_type: "DeepLink"
      },
      user_label_type: "BusinessLabel",
      user_label_display_type: "Badge"
    },
    is_blue_verified: true
  },
  edit_control: {
    edit_tweet_ids: [
      string // "1674865731136020505"
    ],
    editable_until_msecs: string; // "1688157682000",
    is_edit_eligible: boolean; // false,
    edits_remaining: string; // "5"
  },
  mediaDetails?: TweetMedia[]
  conversation_count: number; // 993,
  news_action_type: string; // "conversation",
  card?: TweetCard;
  "parent": {
    "lang": "en",
    "reply_count": 242,
    "retweet_count": 1151,
    "favorite_count": 5294,
    "possibly_sensitive": false,
    "created_at": "2023-06-30T13:02:05.000Z",
    "display_text_range": [
      0,
      259
    ],
    "entities": {
      "hashtags": [
        
      ],
      "urls": [
        
      ],
      "user_mentions": [
        
      ],
      "symbols": [
        
      ],
      "media": [
        {
          "display_url": "pic.twitter.com/DbfuAWwS4p",
          "expanded_url": "https://twitter.com/TitterDaily/status/1674765247255654400/photo/1",
          "indices": [
            260,
            283
          ],
          "url": "https://t.co/DbfuAWwS4p"
        }
      ]
    },
    "id_str": "1674765247255654400",
    "text": "NEWS: Twitter's web version no longer allows users to browse without logging in. All urls redirect to the signup page. \n\nThis is believed to be a measure to make it harder for scrapers to take Twitter's data, like ChatGPT's web browsing plugin has been doing. https://t.co/DbfuAWwS4p",
    "user": {
      "id_str": "752567226",
      "name": "T(w)itter Daily News ",
      "profile_image_url_https": "https://pbs.twimg.com/profile_images/1515124606583152648/4bZaW28-_normal.jpg",
      "screen_name": "TitterDaily",
      "verified": false,
      "is_blue_verified": true,
      "profile_image_shape": "Circle"
    },
    "edit_control": {
      "edit_tweet_ids": [
        "1674765247255654400"
      ],
      "editable_until_msecs": "1688133725000",
      "is_edit_eligible": false,
      "edits_remaining": "5"
    },
    "mediaDetails": TweetMedia[],
    "photos": [
      {
        "backgroundColor": {
          "red": 204,
          "green": 214,
          "blue": 221
        },
        "cropCandidates": [
          {
            "x": 0,
            "y": 0,
            "w": 1069,
            "h": 599
          },
          {
            "x": 110,
            "y": 0,
            "w": 901,
            "h": 901
          },
          {
            "x": 165,
            "y": 0,
            "w": 790,
            "h": 901
          },
          {
            "x": 335,
            "y": 0,
            "w": 451,
            "h": 901
          },
          {
            "x": 0,
            "y": 0,
            "w": 1069,
            "h": 901
          }
        ],
        "expandedUrl": "https://twitter.com/TitterDaily/status/1674765247255654400/photo/1",
        "url": "https://pbs.twimg.com/media/Fz30u9eWcAMVqNe.jpg",
        "width": 1069,
        "height": 901
      }
    ],
    "isEdited": false,
    "isStaleEdit": false
  },
  isEdited: false,
  isStaleEdit: false
}