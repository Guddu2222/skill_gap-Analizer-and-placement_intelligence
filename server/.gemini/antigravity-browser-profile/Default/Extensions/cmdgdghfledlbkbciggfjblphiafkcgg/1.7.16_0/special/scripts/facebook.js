export function facebookScript(isBlockerOn) {
  const debugMode = false;
  if (debugMode) console.log(`Code Injected Before ${!!window?.sBlockAdAnalyzerInjected}`);
  if (window.sBlockAdAnalyzerInjected) return true;
  window.sBlockAdAnalyzerInjected = true;

  const config = {
    serviceName: 'chrome-extension',
    RELATIONSHIPS: [
      {
        id: 1,
        name: 'Single',
      },
      {
        id: 2,
        name: 'In a relationship',
      },
      {
        id: 3,
        name: 'Married',
      },
      {
        id: 4,
        name: 'Engaged',
      },
      {
        id: 6,
        name: 'Unspecified',
      },
      {
        id: 7,
        name: 'Civil Union',
      },
      {
        id: 8,
        name: 'Domestic Partnership',
      },
      {
        id: 9,
        name: 'Open Relationship',
      },
      {
        id: 10,
        name: 'Complicated',
      },
      {
        id: 11,
        name: 'Separated',
      },
      {
        id: 12,
        name: 'Divorced',
      },
      {
        id: 13,
        name: 'Widowed',
      },
    ],
    EDUCATIONS: [
      {
        id: 1,
        name: 'In high school',
      },
      {
        id: 2,
        name: 'In college',
      },
      {
        id: 3,
        name: 'College grad',
      },
      {
        id: 4,
        name: 'High school grad',
      },
      {
        id: 5,
        name: 'Some college',
      },
      {
        id: 6,
        name: 'Associate degree',
      },
      {
        id: 7,
        name: 'In grad school',
      },
      {
        id: 8,
        name: 'Some grad school',
      },
      {
        id: 9,
        name: "Master's degree",
      },
      {
        id: 10,
        name: 'Professional degree',
      },
      {
        id: 11,
        name: 'Doctorate degree',
      },
      {
        id: 12,
        name: 'Unspecified',
      },
      {
        id: 13,
        name: 'Some high school',
      },
    ],
    PLACEMENTS: {
      FEED: 'feed',
      SIDE_FEED: 'side_feed',
      VIDEO_FEED: 'video_feed',
      MARKETPLACE: 'marketplace',
      SEARCH: 'search',
      IN_STREAM: 'in_stream',
    },
    REQUEST_NAMES: {
      get CometNewsFeedPaginationQuery() {
        return config.PLACEMENTS.FEED;
      },
      get CometModernHomeFeedQuery() {
        return config.PLACEMENTS.FEED;
      },
      get SearchCometResultsPaginatedResultsQuery() {
        return config.PLACEMENTS.SEARCH;
      },
      get SearchCometResultsInitialResultsQuery() {
        return config.PLACEMENTS.SEARCH;
      },
      get CometHomeRightSideEgoRefetchQuery() {
        return config.PLACEMENTS.SIDE_FEED;
      },
      get CometRightSideHeaderCardsQuery() {
        return config.PLACEMENTS.SIDE_FEED;
      },
      get MarketplaceCometBrowseFeedLightPaginationQuery() {
        return config.PLACEMENTS.MARKETPLACE;
      },
      get MarketplaceCometBrowseFeedLightContainerQuery() {
        return config.PLACEMENTS.MARKETPLACE;
      },
      get CometVideoHomeFeedSectionPaginationQuery() {
        return config.PLACEMENTS.VIDEO_FEED;
      },
      get useInstreamAdsFetcherQuery() {
        return config.PLACEMENTS.IN_STREAM;
      },
    },
    FACEBOOK_DEFAULT_AGE_START: 12,
    WAIST_KEYS_DEFAULT_VALUE: 'UNKNOWN',
    WAIST_UI_TYPE_COMPONENT_NAMES: {
      ACTIONABLE_INSIGHTS: 'CometAdPrefsWAISTActionableInsightsRow_targetingData.graphql',
      AGE_GENDER: 'CometAdPrefsWAIST30AgeGenderRow_targetingData.graphql',
      BCT: 'CometAdPrefsWAISTBCTRow_targetingData.graphql',
      BRANDED_CONTENT_PAGE: 'CometAdPrefsWAISTBrandedContentWithPageRow_targetingData.graphql',
      COLLABORATIVE_AD: 'CometAdPrefsWAISTCollaborativeAdRow_targetingData.graphql',
      COLLABORATIVE_ADS_CATEGORY_TARGETING: 'CometAdPrefsWAISTCollaborativeAdsCategoryTargetingRow_targetingData.graphql',
      COLLABORATIVE_ADS_STORE_SALES: 'CometAdPrefsWAISTCollaborativeAdsStoreSalesRow_targetingData.graphql',
      COLLABORATIVE_ADS_STORE_VISITS: 'CometAdPrefsWAISTCollaborativeAdsStoreVisitsRow_targetingData.graphql',
      CONNECTION: 'CometAdPrefsWAISTConnectionRow_targetingData.graphql',
      CUSTOM_AUDIENCES_DATAFILE: 'CometAdPrefsWAISTCustomAudienceDataFileRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_CANVAS: 'CometAdPrefsWAISTEngagementEventRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_EVENT: 'CometAdPrefsWAISTEngagementEventRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_IG: 'CometAdPrefsWAISTEngagementIGProfileRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_LEAD_GEN: 'CometAdPrefsWAISTEngagementLeadGenRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_PAGE: 'CometAdPrefsWAISTEngagementPageRow_targetingData.graphql',
      CUSTOM_AUDIENCES_ENGAGEMENT_VIDEO: 'CometAdPrefsWAISTEngagementVideoRow_targetingData.graphql',
      CUSTOM_AUDIENCES_FACEBOOK_WIFI: 'CometAdPrefsWAISTCustomAudienceFacebookWifiRow_targetingData.graphql',
      CUSTOM_AUDIENCES_FANTASY_GAMES: 'CometAdPrefsWAISTCustomAudienceFantasyGamesRow_targetingData.graphql',
      CUSTOM_AUDIENCES_LOOKALIKE: 'CometAdPrefsWAISTCustomAudienceLookalikeRow_targetingData.graphql',
      CUSTOM_AUDIENCES_MOBILE_APP: 'CometAdPrefsWAISTCustomAudienceMobileAppRow_targetingData.graphql',
      CUSTOM_AUDIENCES_OFFLINE: 'CometAdPrefsWAISTCustomAudienceOfflineConversionRow_targetingData.graphql',
      CUSTOM_AUDIENCES_QR_CODE: 'CometAdPrefsWAISTCustomAudienceQRCodeRow_targetingData.graphql',
      CUSTOM_AUDIENCES_SHOPPING_IG: 'CometAdPrefsWAISTCustomAudienceFantasyGamesRow_targetingData.graphql',
      CUSTOM_AUDIENCES_SHOPPING_PAGE: 'CometAdPrefsWAISTCustomAudienceFantasyGamesRow_targetingData.graphql',
      CUSTOM_AUDIENCES_STORE_VISITS: 'CometAdPrefsWAISTCustomAudienceUnresolvedRow_targetingData.graphql',
      CUSTOM_AUDIENCES_UNRESOLVED: 'CometAdPrefsWAISTCustomAudienceUnresolvedRow_targetingData.graphql',
      CUSTOM_AUDIENCES_WEBSITE: 'CometAdPrefsWAISTCustomAudienceWebsiteRow_targetingData.graphql',
      DYNAMIC_RULE: 'CometAdPrefsWAISTDynamicRuleRow_targetingData.graphql',
      EDU_SCHOOLS: 'CometAdPrefsWAISTEduSchoolsRow_targetingData.graphql',
      ED_STATUS: 'CometAdPrefsWAISTEduStatusRow_targetingData.graphql',
      FRIENDS_OF_CONNECTION: 'CometAdPrefsWAISTFriendsOfConnectionRow_targetingData.graphql',
      INTERESTS: 'CometAdPrefsWAISTInterestsRow_targetingData.graphql',
      INTERNAL_RANK_BASED_EXPLANATION: null,
      LOCALE: 'CometAdPrefsWAISTLocaleRow_targetingData.graphql',
      LOCAL_REACH: 'CometAdPrefsWAISTLocalReachRow_targetingData.graphql',
      LOCATION: 'CometAdPrefsWAIST30LocationRow_targetingData.graphql',
      LOYALTY_LINKED_ACCOUNT: 'CometAdPrefsWAISTLoyaltyLinkedAccountRow_targetingData.graphql',
      MARKETPLACE_BOOSTED_LISTING: 'CometAdPrefsWAISTWorkJobTitleRow_targetingData.graphql',
      OFFSITE_SIGNALS_USER_EVENTS: 'CometAdPrefsWAISTCollaborativeAdsCategoryTargetingRow_targetingData.graphql',
      ONSITE_SIGNALS_USER_EVENTS: 'CometAdPrefsWAISTCollaborativeAdsCategoryTargetingRow_targetingData.graphql',
      RANKING_USER_EVENTS: 'CometAdPrefsWAISTSearchAdRow_targetingData.graphql',
      RELATIONSHIP_STATUS: 'CometAdPrefsWAISTRelationshipStatusRow_targetingData.graphql',
      SEARCH_AD: 'CometAdPrefsWAISTSearchAdRow_targetingData.graphql',
      WORK_EMPLOYERS: 'CometAdPrefsWAISTWorkEmployerRow_targetingData.graphql',
      WORK_JOB_TITLES: 'CometAdPrefsWAISTWorkJobTitleRow_targetingData.graphql',
    },
    REGEX_BOOK: {
      getJsonScriptContent: /<script[^>]*?>(\{"require"[\w\W]+?)<\/script>/gm,
      validPostId: /^\d{5,}$/,
      getInStreamPostId: /ca(\d{5,});/,
      getLocationUrl: /location\.replace\("([^"]+)"\)/,
    },
    SPECIAL_CTA_TYPES: {
      LikePageActionLink: 'LIKE_PAGE',
      DonateFundraiserActionLink: 'DONATE',
      MessagePageActionLink: 'MESSAGE_PAGE',
      MMEMessengerActionLink: 'MESSAGE_PAGE',
      SaveActionLink: 'SAVE',
    },
    EVENTS: {
      AD_GET_DONE: 'ad.get.done',
      CAUGHT_ERROR: 'caught.error',
      ANALYTICS_GET_DONE: 'analytics.get.done',
      EXTENSION_SITE_OPEN: 'extension_site_open',
    },
    FANPAGE_VERIFICATION_STATUSES: {
      blue_verified: true,
      gray_verified: true,
      not_verified: false,
    },
    PAGE_ACCEPT_HEADERS: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    RELAY_EF_NEED: 'CometVideoHomeFeedRootQuery',
    MODULES_NEED: {
      MARKETPLACE: ['CometMarketplaceHomeRoot.react', 'CometMarketplaceFeedAdDropdownMenu.react'],
      VIDEO: [
        'CometVideoHomeRoot.react',
        'CometVideoHomeFeedRoot.react',
        'CometVideoHomeFeedRoot.entrypoint',
        'CometVideoHomeVideoContextMenuContents.react',
        'CometFeedStoryMenu.react',
      ],
      SIDE_FEED: ['CometHomeRightSideEgoMenu.react'],
      WAIST: ['CometAdPrefsWAIST30DialogRoot.react'],
    },
    PART_KEYS: {
      ATTACHMENT: {
        file_url: [
          'progressive_urls.1.progressive_url',
          'progressive_urls.0.progressive_url',
          'media.image.uri',
          'media.media_image.uri',
          'media.photo_image.uri',
          'media.imageFlexible.uri',
          'media.flexible_height_share_image.uri',
          'media.imageLargeAspect.uri',
          'media.large_share_image.uri',
          'media.square_media_image.uri',
          'media.slideshow_images.0.uri',
        ],
        file_thumbnail: ['.thumbnailImage.uri', '.preferred_thumbnail.image.uri'],
        target_url: [
          '.target_url',
          '.action_link.followUpActionUri',
          '.target.external_url',
          '.actionLink.url',
          '.action_link.url',
          '.action_links.0.url',
          '.web_link.url',
        ],
        subtitle: ['.link_title', '.title_with_entities.text', '.card_title.text', '.action_link.title', '.subtitle'],
        description: ['.link_description', '.description.text', '.card_description.text', '.description'],
      },
      SUB_ATTACHMENT: ['.all_subattachments.nodes.', '.all_subattachments.', '.subattachments.', 'attachments.'],
      FEED: {
        id: ['.story.id'],
        ad_id: ['ad_id'],
        post_id: ['post_id'],
        client_token: ['client_token'],
        cta: ['action_link.link_type'],
        cta_title: ['action_link.title'],
        title: ['message.story.message.text'],
        reaction_count: ['reaction_count.count'],
        share_count: ['share_count.count'],
        comments_count: ['comment_count', 'comments.total_count'],
        display_link: ['link_display'],
      },
      VIDEO_FEED: {
        id: ['.story.id'],
        ad_id: ['ad_id'],
        post_id: ['post_id'],
        client_token: ['client_token'],
        cta: ['action_link.link_type'],
        cta_title: ['action_link.title'],
        title: ['message.text'],
        reaction_count: ['reaction_count.count'],
        comments_count: ['comment_count', 'comments.total_count'],
        display_link: ['link_display'],
      },
      IN_STREAM: {
        ad_id: ['ad_id'],
        client_token: ['client_token'],
        cta: ['action_link.link_type'],
        cta_title: ['action_link.title'],
        title: ['message.text'],
        display_link: ['link_display'],
      },
      SEARCH: {
        id: ['.story.id'],
        ad_id: ['ad_id'],
        post_id: ['subscription_target_id', 'feedback.share_fbid'],
        client_token: ['client_token'],
        cta: ['action_link.link_type'],
        cta_title: ['action_link.title'],
        title: ['message.story.message.text'],
        reaction_count: ['reaction_count.count'],
        share_count: ['share_count.count'],
        comments_count: ['comment_count', 'comments.total_count'],
        display_link: ['link_display'],
        fallback_post_id: ['feedback_target_with_context.id'],
      },
      MARKETPLACE: {
        ad_id: ['ad_id'],
        client_token: ['client_token'],
        display_link: ['link_display'],
      },
      POST: {
        posted_at: ['.publish_time', '.creation_time'],
        title: ['story.message.text'],
        view_count: ['.play_count', '.video_view_count'],
        reaction_count: ['reaction_count.count'],
        share_count: ['share_count.count'],
        comments_count: [
          'comments.total_count',
          'total_comment_count',
          'comment_count_unfiltered',
          'comment_list_renderer.feedback.comment_count.total_count',
          'top_level_comments.totalCountIncludingReplies',
        ],
        source_language: ['source_dialect'],
        cta: ['action_link.link_type', 'action_links.0.link_type'],
        ctaType: ['action_link.__typename', 'action_links.0.__typename'],
        cta_title: ['action_link.title', 'action_links.0.title'],
        fanpage_verified: ['comet_sections.badge.is_prod_eligible'],
        display_link: ['link_display', 'source.text'],
        target_url: ['action_link.url', 'action_links.0.url'],
      },
    },
    ADS_MANAGER_LINK: 'https://adsmanager.facebook.com/adsmanager/manage/accounts/',
    SLEEP_TIME: 5_000,
    MODULES_LOAD_TIMEOUT: 60_000,
    BLOCKED_SLEEP_TIME: 600_000,
    PLATFORM: 'facebook',
  };

  function regexTest(regex, text) {
    regex.lastIndex = 0;
    const result = regex.test(text);
    regex.lastIndex = 0;
    return result;
  }

  function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  function getCookieByName(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  async function customFetch(url, init = {}) {
    let response, responseText;
    try {
      response = await fetch(url, init);
      responseText = await response.text();
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      try {
        return JSON.parse(responseText);
      } catch {
        return responseText;
      }
    } catch (error) {
      throw context.exceptionHandler(error, {
        url,
        status: response?.status ?? 0,
        responseText: responseText ?? '',
      });
    }
  }

  function generateRandomCharacters(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }

  function generateRandomString() {
    const length = 55;
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = 'IwAR' + generateRandomCharacters(characters.substring(52, 56));
    for (let i = 0; i < length; i++) {
      result += generateRandomCharacters(characters);
    }
    return result + generateRandomCharacters(characters.substring(0, 62));
  }

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  }

  function ExceptionHandler() {
    class FacebookScriptException extends Error {
      constructor({ message, data, cause }) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.service = config.serviceName;
        this.cause = cause;
        this.data = data;
        this.isExclusive = true;
        this.time = new Date().toISOString();
      }
    }

    function replaceCyclic() {
      const seen = new WeakSet();
      return (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return;
          seen.add(value);
        }
        return value;
      };
    }

    function getErrorDetail(error) {
      const errorKeys = Object.getOwnPropertyNames(error);
      const errorData = {};
      for (const key of errorKeys) errorData[key] = error[key];
      return JSON.parse(JSON.stringify(errorData, replaceCyclic()));
    }

    return (error, data = {}) => {
      let exception = error;
      if (!error?.isExclusive) {
        exception = new FacebookScriptException({
          message: error?.message ?? 'Unknown error.',
          data,
          cause: error,
        });
      } else {
        exception.data = { ...exception.data, ...data };
      }
      if (exception?.cause) exception.cause = getErrorDetail(exception.cause);
      return getErrorDetail(exception);
    };
  }

  function iDB(name) {
    const tableName = 'data';
    let currentDB;
    const createDB = new Promise((resolve, reject) => {
      const db = window.indexedDB.open(name, 1);
      db.onerror = function () {
        reject(context.exceptionHandler(new Error('Failed to open IndexedDB instance.'), { indexedDBName: name }));
      };
      db.onsuccess = function (event) {
        currentDB = event.target.result;
        resolve({ db: currentDB });
        currentDB.onerror = function (event) {
          reject(
            context.exceptionHandler(new Error('IndexedDB Error'), {
              indexedDBName: name,
              message: event?.target?.error?.message,
            }),
          );
        };
      };
      db.onupgradeneeded = function (event) {
        event = event.currentTarget.result;
        if (event.objectStoreNames && event.objectStoreNames.contains(tableName)) return;
        event.createObjectStore(tableName, { keyPath: 'key' });
      };
    });

    function handelWait(res, rej) {
      if (currentDB) {
        try {
          res();
        } catch (e) {
          rej(e);
        }
      } else {
        createDB
          .then(function () {
            handelWait(res, rej);
          })
          .catch(function (e) {
            rej(e);
          });
      }
    }

    return {
      setItem: function (key, value) {
        return new Promise((resolve, reject) => {
          function addUpdateHandle(result) {
            result.onsuccess = resolve;
            result.onerror = reject;
          }

          handelWait(function () {
            let transaction = currentDB.transaction([tableName], 'readwrite');
            let table = transaction.objectStore(tableName);
            let tableCursor = table.openCursor();
            tableCursor.onsuccess = function (event) {
              const result = event.target.result;
              if (result?.key === key) {
                let newVal = result.value;
                newVal.value = value;
                addUpdateHandle(result.update(newVal));
                return;
              }
              try {
                result.continue(key);
              } catch (e) {
                addUpdateHandle(table.add({ key, value }));
              }
            };
            transaction.onerror = reject;
          }, reject);
        });
      },
      getItem: function (key) {
        return new Promise((resolve, reject) => {
          handelWait(function () {
            let transaction = currentDB.transaction([tableName], 'readonly');
            let table = transaction.objectStore(tableName);
            let tableCursor = table.openCursor();
            tableCursor.onsuccess = function (event) {
              const result = event.target.result;
              if (result?.key === key) {
                return resolve(result.value.value);
              }
              try {
                result.continue(key);
              } catch (e) {
                resolve();
              }
            };
            transaction.onerror = reject;
          }, reject);
        });
      },
    };
  }

  async function getStoredToken() {
    let token, expiry, userId;
    try {
      [token, expiry, userId] = await Promise.all([context.iDB.getItem('token'), context.iDB.getItem('expiry'), context.iDB.getItem('userId')]);
    } catch {}
    return { token, expiry, userId };
  }

  async function setStoredToken({ token, expiry, userId }) {
    try {
      await Promise.all([context.iDB.setItem('expiry', expiry), context.iDB.setItem('token', token), context.iDB.setItem('userId', userId)]);
      return true;
    } catch {
      return false;
    }
  }

  function safeParseJson(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function isNullOrUndefined(value) {
    return value === null || value === undefined;
  }

  function findArrayByKey(obj, targetKey) {
    let found = null;
    function recurse(current) {
      if (found) return;
      if (Array.isArray(current)) {
        for (const item of current) {
          if (item?.[targetKey]) {
            found = current;
            return;
          }
        }
        for (const item of current) {
          recurse(item);
        }
      } else if (typeof current === 'object' && current !== null) {
        for (const key in current) {
          recurse(current[key]);
          if (found) return;
        }
      }
    }
    recurse(obj);
    return found;
  }

  function flattenObj(obj, parent = null, res = {}) {
    for (let key in obj) {
      let propName = parent ? parent + '.' + key : key;
      if (typeof obj[key] === 'object') {
        flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  function validateUrlAndHostname(link) {
    try {
      const url = new URL(link);
      // Check if url actually has a valid domain too
      url.hostname.includes('.');
      return true;
    } catch (error) {
      return false;
    }
  }

  function isValidDisplayLink(displayLink) {
    if (!displayLink) return false;
    const link = displayLink.startsWith('http://') || displayLink.startsWith('https://') ? displayLink : `https://${displayLink}`;
    return validateUrlAndHostname(link);
  }

  function getConsoleErrors(log) {
    if (log.startsWith('Error')) sendError(new Error('Console Error'), { log });
  }

  function mockConsoleError() {
    console.stdlog = console.error.bind(console);
    console.error = function () {
      getConsoleErrors(arguments?.[0]);
      console.stdlog.apply(console, arguments);
    };
  }

  function Blocker() {
    const requestNames = Object.keys(config.REQUEST_NAMES);

    function parseGraphData(content) {
      let graphData = typeof content === 'object' ? content : safeParseJson(content);
      if (!graphData) return content?.split('\n')?.map((content) => safeParseJson(content));
      return graphData;
    }

    function mockXHRPrototype() {
      const send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.send = function () {
        this.addEventListener('load', () => {
          try {
            if (this.responseURL.includes('graphql')) {
              if (!(this.status === 200 && typeof arguments?.[0]?.match === 'function')) return;
              let friendlyName = arguments[0].match(/fb_api_req_friendly_name=([a-zA-Z]+?)&/);
              if (!(friendlyName && friendlyName[1] && config.REQUEST_NAMES[friendlyName[1]])) return;
              const data = parseGraphData(this.responseText);
              const placement = config.REQUEST_NAMES[friendlyName[1]];
              context.adapters.adaptAdsByPlacement({ data, placement });
            } else if (this.responseURL.includes('ajax/route-definition/')) {
              ajax(this.responseText);
            }
          } catch (error) {
            sendError(error);
          }
        });
        send.apply(this, arguments);
      };
    }

    function ajax(res) {
      const results = res.split('\r\n');
      for (const result of results) {
        const json = JSON.parse(result.trim().substring(9));
        const placement = requestNames.find((requestName) => json?.id?.includes(requestName));
        if (placement) context.adapters.adaptAdsByPlacement({ data: json.result.result, placement: config.REQUEST_NAMES[placement] });
      }
    }

    function parseIndexAds(res) {
      try {
        const json = JSON.parse(res);
        const require = json?.require;
        if (!(require?.[0]?.[3] instanceof Array && require?.[0]?.[3]?.length)) return;
        for (const requireData of require[0][3]) {
          if (!(requireData?.__bbox?.require instanceof Array && requireData.__bbox.require?.length)) continue;
          for (const bboxItem of requireData.__bbox.require) {
            const name = bboxItem?.[3]?.[0];
            const placement = requestNames.find((requestName) => name?.includes(requestName));
            if (!placement) continue;
            const data = bboxItem[3]?.[1]?.__bbox?.result;
            if (data) context.adapters.adaptAdsByPlacement({ data, placement: config.REQUEST_NAMES[placement] });
          }
        }
      } catch {}
    }

    return async () => {
      mockXHRPrototype();
      await asyncPageLoad();
      const scriptEls = [...document.querySelectorAll('script[type="application/json"]')];
      scriptEls.map((el) => {
        parseIndexAds(el.textContent);
      });
    };
  }

  function asyncPageLoad() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        resolve();
      }
      document.addEventListener('readystatechange', (event) => {
        if (event.target.readyState === 'complete') {
          resolve();
        }
      });
    });
  }

  function isValidText(text) {
    return !(text && text.trim().startsWith('{{') && text.trim().endsWith('}}'));
  }

  async function sleep() {
    const time = config.SLEEP_TIME + (Math.floor(Math.random() * (2 * 500 + 1)) - 500);
    await wait(time);
  }

  function removeInvalidData(ad) {
    //remove Zero Reactions
    if (!Number(ad?.view_count)) delete ad.view_count;
    if (!Number(ad?.reaction_count)) delete ad.reaction_count;
    if (!Number(ad?.share_count)) delete ad.share_count;
    if (!Number(ad?.comments_count)) delete ad.comments_count;

    //remove wrong title
    if (!isValidText(ad?.title)) delete ad.title;

    //remove invalid Display Link
    if (!isValidDisplayLink(ad?.display_link)) delete ad.display_link;
    return ad;
  }

  function goToGraphBlockedMode() {
    context.isGraphBlocked = true;
    setTimeout(() => {
      context.isGraphBlocked = false;
      adsQueue();
    }, config.BLOCKED_SLEEP_TIME);
  }

  function requireModuleRequestWAIST() {
    __d(
      'EasyUseFragment' + context.modulesAddition,
      ['CometRelayEnvironmentFactory', 'react-relay/relay-hooks/legacy/FragmentResource', 'relay-runtime'],
      function (a, b, c, d) {
        'use strict';
        const defaultEnvironment = d('CometRelayEnvironmentFactory').CometRelayEnvironmentFactory.defaultEnvironment;
        const getFragmentResource = b('react-relay/relay-hooks/legacy/FragmentResource').getFragmentResourceForEnvironment;
        const getFragmentIdentifier = b('relay-runtime').getFragmentIdentifier;
        return function useFragment(fragment, data) {
          const fragmentResource = getFragmentResource(defaultEnvironment);
          const identifier = getFragmentIdentifier(fragment, data);
          return fragmentResource.readWithIdentifier(fragment, data, identifier, 'useFragment()').data;
        };
      },
      98,
    );
    __d(
      'ParseWAIST' + context.modulesAddition,
      [
        'EasyUseFragment' + context.modulesAddition,
        'CometAdPrefsWAIST30DialogFrame_advertiserData.graphql',
        'CometAdPrefsWAIST30DialogFrame_targetingData.graphql',
        'CometAdPrefsWAIST30DialogContent_targetingData.graphql',
        'CometAdPrefsWAIST30DataSection_targetingData.graphql',
        'CometAdPrefsWAIST30DataSectionRow_targetingData.graphql',
        'getJSEnumSafe',
      ],
      function (a, b, c, d) {
        'use strict';
        var useFragment = d('EasyUseFragment' + context.modulesAddition);
        return function (waist) {
          waist.waist_advertiser_info = useFragment(b('CometAdPrefsWAIST30DialogFrame_advertiserData.graphql'), waist.waist_advertiser_info);
          let result = {
            ad_preview: waist.waist_ad_preview,
            advertiser: {
              id: waist.waist_advertiser_info.advertiser_id,
              name: waist.waist_advertiser_info.name,
              avatar_url: waist.waist_advertiser_info.profile_picture_url,
            },
            targeting: [],
            is_marketplace_boosted: waist.waist_is_marketplace_boosted_listing,
          };
          waist.waist_targeting_data = useFragment(b('CometAdPrefsWAIST30DialogFrame_targetingData.graphql'), waist.waist_targeting_data);
          waist.waist_targeting_data = useFragment(b('CometAdPrefsWAIST30DialogContent_targetingData.graphql'), waist.waist_targeting_data);
          waist.waist_targeting_data = useFragment(b('CometAdPrefsWAIST30DataSection_targetingData.graphql'), waist.waist_targeting_data);
          waist.waist_targeting_data.map((value) => {
            value = useFragment(b('CometAdPrefsWAIST30DataSectionRow_targetingData.graphql'), value);
            let typeName = value.waist_ui_type,
              moduleName = config.WAIST_UI_TYPE_COMPONENT_NAMES[typeName];
            if (!moduleName) return;
            result.targeting.push({
              typeName,
              serialized_data: value?.serialized_data,
              ...(useFragment(b(moduleName), value) ?? {}),
            });
          });
          return result;
        };
      },
      98,
    );
    __d(
      'RequestWAIST' + context.modulesAddition,
      ['ParseWAIST' + context.modulesAddition, 'CometRelay', 'CometRelayEnvironment', 'CometAdPrefsWAIST30DialogRootQuery.graphql', 'guid'],
      function (a, b, c, d) {
        'use strict';
        const parse = d('ParseWAIST' + context.modulesAddition);
        return function (ad_id, client_token) {
          return new Promise((resolve, reject) => {
            const entrypoint = client_token ? 'NOT_SET' : 'MARKETPLACE_FEED';
            d('CometRelay')
              .fetchQuery(c('CometRelayEnvironment'), b('CometAdPrefsWAIST30DialogRootQuery.graphql'), {
                adId: ad_id,
                fields: {
                  ad_id: ad_id,
                  client_token: client_token,
                  entrypoint: entrypoint,
                  request_id: c('guid')() + '_' + ad_id,
                },
              })
              .toPromise()
              .then((result) => {
                resolve(parse(result));
              })
              .catch((reason) => {
                reject(reason);
              });
          });
        };
      },
      98,
    );
    return require('RequestWAIST' + context.modulesAddition);
  }

  function requireModulesLoader() {
    __d(
      'ModulesLoader' + context.modulesAddition,
      ['Bootloader'],
      function (a, b) {
        'use strict';
        return function (modules) {
          return new Promise(async (resolve, reject) => {
            const loadedModules = [];
            const timeout = setTimeout(() => {
              reject(
                context.exceptionHandler(new Error('Modules Not Loaded'), {
                  modules,
                  loadedModules,
                  pageURL: window.location.href,
                }),
              );
            }, config.MODULES_LOAD_TIMEOUT);
            function loadModule(module) {
              return new Promise((resolve) => {
                b('Bootloader').loadModules([module], resolve);
              });
            }
            for (const module of modules) {
              await loadModule(module);
              loadedModules.push(module);
            }
            clearTimeout(timeout);
            resolve();
          });
        };
      },
      null,
    );
    return require('ModulesLoader' + context.modulesAddition);
  }

  function requireFetchRouteDefinition() {
    __d(
      'fetchRouteDefinition' + context.modulesAddition,
      ['PHPQuerySerializer', 'Env', 'cometAsyncRequestHeaders', 'XHRRequest', 'getAsyncParams', 'CSRFGuard'],
      function (a, b, c, d) {
        'use strict';
        let querySerializer = c('PHPQuerySerializer');
        let env = c('Env');
        let route = '/ajax/route-definition/';
        function responseParser(response) {
          const allResponses = response.split('\n');
          const result = {};
          for (const el of allResponses) {
            if (d('CSRFGuard').exists(el)) {
              const parsedEl = JSON.parse(d('CSRFGuard').clean(el));
              if (parsedEl?.result?.result?.data) Object.assign(result, parsedEl.result.result.data);
            }
          }
          return result;
        }
        return function (a) {
          return new Promise(function (resolve, reject) {
            let k = d('cometAsyncRequestHeaders').getHeaders();
            Object.keys(k)
              .reduce(function (a, b) {
                return a.setRequestHeader(b, k[b]);
              }, new (c('XHRRequest'))(route))
              .setMethod('POST')
              .setData(
                babelHelpers['extends'](
                  {
                    route_url: a,
                    routing_namespace: env.routing_namespace,
                  },
                  c('getAsyncParams')('POST'),
                ),
              )
              .setResponseHandler((response) => {
                resolve(responseParser(response));
              })
              .setErrorHandler(function (a) {
                reject(a);
              })
              .setDataSerializer(querySerializer.serialize)
              .send();
          });
        };
      },
      98,
    );
    return require('fetchRouteDefinition' + context.modulesAddition);
  }

  function requireMenuRequest() {
    __d(
      'MenuRequest' + context.modulesAddition,
      ['CometRelay', 'CometRelayEnvironment'],
      function (a, b, c, d) {
        'use strict';
        return function (menuModuleName, data) {
          return new Promise((resolve, reject) => {
            const menuQuery = b(menuModuleName);
            const requestArguments = menuQuery?.fragment?.argumentDefinitions;
            if (!requestArguments.length)
              return reject(
                context.exceptionHandler(new Error('Menu request arguments not found!'), {
                  menuModuleName,
                  requestParams: data,
                  pageURL: window.location.href,
                }),
              );
            for (const argument of requestArguments) {
              if (!(argument.name in data))
                return reject(
                  context.exceptionHandler(new Error('Menu request arguments have changed!'), {
                    menuModuleName,
                    requestParams: data,
                    pageURL: window.location.href,
                  }),
                );
            }
            d('CometRelay')
              .fetchQuery(c('CometRelayEnvironment'), menuQuery, data)
              .toPromise()
              .then((result) => {
                resolve(result);
              })
              .catch((reason) => {
                reject(reason);
              });
          });
        };
      },
      98,
    );
    return require('MenuRequest' + context.modulesAddition);
  }

  function requireRelayEf() {
    __d(
      'RelayEfRequest' + context.modulesAddition,
      ['Bootloader', 'cometAsyncFetch'],
      function (a, b, c) {
        'use strict';
        return function (query) {
          return new Promise((resolve, reject) => {
            c('cometAsyncFetch')('/ajax/relay-ef/', {
              data: {
                queries: [query],
              },
              method: 'POST',
            }).then(function (res) {
              c('Bootloader').loadPredictedResourceMap(res.predictions[query], {
                onLog: function (a) {
                  if (typeof a === 'object') resolve();
                },
                onBlocking: function (a) {
                  if (a) reject();
                },
              });
            });
          });
        };
      },
      98,
    );
    return require('RelayEfRequest' + context.modulesAddition);
  }

  async function registerWAIST({ id, placement }) {
    const queryParams = {
      feed: [
        'CometFeedStoryMenuQuery.graphql',
        {
          feed_location: 'NEWSFEED',
          feed_menu_icon_variant: 'FILLED',
          id,
          renderLocation: undefined,
          scale: 1,
          serialized_frtp_identifiers: null,
          story_debug_info: null,
        },
      ],
      video_feed: [
        'CometFeedStoryMenuQuery.graphql',
        {
          feed_location: 'VIDEO_HOME_FEED',
          feed_menu_icon_variant: 'FILLED',
          id,
          renderLocation: undefined,
          scale: 1,
          serialized_frtp_identifiers: null,
          story_debug_info: null,
        },
      ],
      search: [
        'CometFeedStoryMenuQuery.graphql',
        {
          feed_location: 'GENERAL_SEARCH_DESKTOP_ADS',
          feed_menu_icon_variant: 'FILLED',
          id,
          renderLocation: undefined,
          scale: 1,
          serialized_frtp_identifiers: null,
          story_debug_info: null,
        },
      ],
      side_feed: [
        'CometHomeRightSideEgoMenuQuery.graphql',
        {
          id,
        },
      ],
    };
    try {
      await context.modulesLoader(config.MODULES_NEED.MARKETPLACE);
      if (placement === config.PLACEMENTS.MARKETPLACE) {
        if (!context.relayEfRequest) context.relayEfRequest = requireRelayEf();
        await context.relayEfRequest(config.RELAY_EF_NEED);
        await sleep();
      }
    } catch (e) {
      if (!(id && queryParams[placement])) {
        throw context.exceptionHandler(e);
      }
      if (placement === config.PLACEMENTS.SIDE_FEED) {
        await context.modulesLoader(config.MODULES_NEED.SIDE_FEED);
      } else {
        await context.modulesLoader(config.MODULES_NEED.VIDEO);
      }
      if (!context.menuRequest) context.menuRequest = requireMenuRequest();
      await context.menuRequest(...queryParams[placement]);
    }
    await context.modulesLoader(config.MODULES_NEED.WAIST);
    await sleep();
    context.requestWAIST = requireModuleRequestWAIST();
  }

  function validateAccessToken({ token, expiry, userId }) {
    return token && expiry && userId && typeof token === 'string' && token.length > 10 && Date.now() < expiry && getCookieByName('c_user') === userId;
  }

  async function getAccessToken() {
    const data = await getStoredToken();
    if (validateAccessToken(data)) return data.token;
    const pageLevelOne = await customFetch(config.ADS_MANAGER_LINK, {
      credentials: 'include',
    });
    data.token = pageLevelOne.match(/__accessToken="(\w{100,})"/)[1];
    data.expiry = Date.now() + pageLevelOne.match(/__accessTokenExpirySecondsRemaining=(\d+)/)[1] * 1000;
    data.userId = getCookieByName('c_user');
    await setStoredToken(data);
    return data.token;
  }

  async function getGraph(link) {
    const token = await getAccessToken();
    const result = await customFetch(`${link}&access_token=${token}`, {
      credentials: 'include',
    });
    if (result.error) throw new Error();
    return result;
  }

  async function getFanpage(fanpage, fanpageVerified) {
    try {
      const data = await getGraph(
        `https://graph.facebook.com/${fanpage.id}?fields=category_list,call_to_actions.status(ACTIVE){id,web_url,type},checkins,engagement,followers_count,global_brand_page_name,has_added_app,has_transitioned_to_new_page_experience,id,instagram_business_account,is_always_open,is_permanently_closed,link,name,page_token,picture.type(large),start_info,supports_donate_button_in_live_video,talking_about_count,verification_status,voip_info,were_here_count,about,app_id,can_checkin,connected_instagram_account,contact_address,country_page_likes,current_location,description,description_html,differently_open_offerings,display_subtext,emails,featured_video,general_info,global_brand_root_id,hours,impressum,location,overall_star_rating,parking,phone,price_range,privacy_info_url,single_line_address,store_code,store_location_descriptor,store_number,temporary_status,username,website&locale=en-US`,
      );
      return context.adapters.adaptFanpage({ id: fanpage.id, data });
    } catch (e) {
      fanpage.is_verified = fanpageVerified ?? false;
      if (debugMode) console.log({ fallbackFanpage: fanpage });
      return fanpage;
    }
  }

  async function getInterests(interests) {
    const objIds = [];
    const ids = [];
    for (let interest of interests) {
      if (interest?.id) {
        objIds.push({
          id: interest.id,
        });
        ids.push(interest.id);
      }
    }
    try {
      return (await getGraph(`https://graph.facebook.com/search?type=adinterestvalid&fields=id,name&interest_fbid_list=[${ids.join(',')}]&locale=en-US`)).data;
    } catch (e) {
      return objIds;
    }
  }

  async function getWAIST({ ad_id, client_token }) {
    let data;
    try {
      data = await context.requestWAIST(ad_id, client_token);
    } catch (error) {
      goToGraphBlockedMode();
      throw context.exceptionHandler(new Error('WAIST Request Error'), {
        WaistResponse: error,
      });
    }
    return context.adapters.adaptWaist(data);
  }

  async function getPost(id) {
    const result = await context.fetchRouteDefinition(`/${id}`);
    delete result?.video_channel;
    if (debugMode) console.log({ getPost: result });
    return context.adapters.adaptPost(result);
  }

  function mergeAdAndPost({ ad, post }) {
    for (let postKey in post) {
      if (postKey in ad) {
        if (!isNullOrUndefined(ad[postKey])) continue;
      }
      ad[postKey] = post[postKey];
    }
    return ad;
  }

  function adValidator(ad) {
    const adKeys = [
      'ad_id',
      'post_id',
      'client_token',
      'posted_at',
      'title',
      'view_count',
      'reaction_count',
      'share_count',
      'comments_count',
      'source_language',
      'cta',
      'fanpage_verified',
      'display_link',
      'target_url',
    ];
    for (let adKey of adKeys) {
      if (adKey in ad && ad[adKey]) continue;
      console.log(adKey);
    }
    console.log({ target_url: ad.target_url });
  }

  function AdapterService() {
    function getFlatAd(ad) {
      const flatObj = flattenObj(ad);
      if (debugMode) console.log({ flatObj });
      return { flatObj, flatObjKeys: Object.keys(flatObj) };
    }

    function getDataByEndPartKey({ flatObj, flatObjKeys }, partKeys) {
      const finds = {};
      for (const partKeysKey in partKeys) {
        let key;
        for (const val of partKeys[partKeysKey]) {
          key = flatObjKeys.find((key) => {
            return key.endsWith(val);
          });
          if (key && flatObj[key] !== null) break;
        }
        if (!key) continue;
        finds[partKeysKey] = flatObj[key];
      }
      return finds;
    }

    function findBetween(str, start, end) {
      return str.split(start)?.[1]?.split(end)?.[0];
    }

    function adaptAttachments(attachments) {
      return attachments.map((attachment) => {
        return {
          file: {
            url: attachment.file_url,
            thumbnail: attachment.file_thumbnail,
          },
          subtitle: attachment.subtitle,
          description: attachment.description?.trim(),
          target_url: attachment.target_url,
        };
      });
    }

    function getSubAttachments({ flatObj, flatObjKeys }, partKeys) {
      if (!partKeys.length) return [];
      let attachments = [];
      const jsonFlatObjKeys = JSON.stringify(flatObjKeys);
      for (const partKey of partKeys) {
        if (jsonFlatObjKeys.includes(partKey)) {
          for (const key in flatObj) {
            const num = findBetween(key, partKey, '.');
            if (!(num >= 0)) continue;
            if (!attachments[num]) attachments[num] = {};
            attachments[num][key] = flatObj[key];
          }
          break;
        }
      }
      if (Object.keys(attachments?.[0] ?? {}).length < 5) {
        return getSubAttachments({ flatObj, flatObjKeys }, partKeys.slice(1));
      }
      return attachments;
    }

    function getAttachments({ flatObj, flatObjKeys }) {
      const subAttachments = getSubAttachments({ flatObj, flatObjKeys }, config.PART_KEYS.SUB_ATTACHMENT);
      return subAttachments.map((attachment) => {
        return getDataByEndPartKey({ flatObj: attachment, flatObjKeys: Object.keys(attachment) }, config.PART_KEYS.ATTACHMENT);
      });
    }

    function isFeedNodeAd(edge) {
      return (
        edge?.category === 'SPONSORED' ||
        edge?.node?.th_dat_spo ||
        edge?.node?.sponsored_data ||
        edge?.node?.the_spons_data ||
        edge?.node?.data_spon_lbl ||
        edge?.node?.lbl_sp_data ||
        edge?.node?.data_spon?.ad_id ||
        edge?.node?.sp_data?.__typename === 'SponsoredData' ||
        edge?.node?.ads_data?.__typename === 'SponsoredData'
      );
    }

    function detectFeedAds(items) {
      if (!Array.isArray(items)) items = [items];
      const ads = [];
      items.map((item) => {
        if (isFeedNodeAd(item?.data)) return ads.push(item.data.node);
        else if (item?.data?.viewer?.news_feed?.edges) {
          item.data.viewer.news_feed.edges.map((edge) => {
            if (isFeedNodeAd(edge)) {
              return ads.push(edge.node);
            }
          });
        }
      });
      return ads;
    }

    function detectInStreamAds(items) {
      if (!Array.isArray(items)) items = [items];
      const ads = [];
      items.map((item) => {
        const edges = item.data?.viewer?.instream_video_ads?.edges;
        if (!edges?.length) return;
        edges.map((edge) => {
          if (!edge?.node?.sponsored_data) return;
          return ads.push(edge.node);
        });
      });
      return ads;
    }

    function isValidPostId(id) {
      return regexTest(config.REGEX_BOOK.validPostId, id);
    }

    function getMarketplacePostId(id) {
      try {
        const decoded = atob(id);
        const [, , stringContainingID] = decoded?.split(':');
        const [, , postId, alternatePostId] = stringContainingID?.split('ca');
        if (isValidPostId(postId)) return postId;
        else if (isValidPostId(alternatePostId)) return alternatePostId;
        return null;
      } catch (error) {
        return null;
      }
    }

    function getInStreamPostId(id) {
      try {
        const decoded = atob(id);
        return decoded.match(config.REGEX_BOOK.getInStreamPostId)?.[1];
      } catch (error) {
        return null;
      }
    }

    function detectMarketplaceAds(items) {
      if (!Array.isArray(items)) items = [items];
      const ads = [];
      items.map((item) => {
        if (item?.data?.node?.story && item?.data?.node?.story_type === 'AD') {
          ads.push(item.data.node.story);
        } else if (item?.data?.marketplace_home_feed?.edges?.length) {
          item.data.marketplace_home_feed.edges.map((edge) => {
            if (edge?.node?.story && edge?.node?.story_type === 'AD') ads.push(edge?.node?.story);
          });
        }
      });
      return ads;
    }

    function detectSideFeedAds(item) {
      return findArrayByKey(item, 'rhc_ad') ?? [];
    }

    function decryptPostId(id) {
      try {
        const decryptedId = atob(id);
        if (!decryptedId) return null;
        const [, postId] = decryptedId.split(':');
        if (isValidPostId(postId)) return postId;
        return null;
      } catch {
        return null;
      }
    }

    function detectSearchAds(items) {
      if (!Array.isArray(items)) items = [items];
      const ads = [];
      items.map((item) => {
        const data = item?.data;
        if (data?.node?.role === 'SEARCH_ADS' && data?.relay_rendering_strategy?.view_model) {
          ads.push(data.relay_rendering_strategy.view_model);
        } else if (data?.serpResponse?.results?.edges) {
          data?.serpResponse?.results?.edges?.map((subItem) => {
            if (subItem?.node?.role === 'SEARCH_ADS') {
              if (subItem?.rendering_strategy?.view_model) {
                ads.push(subItem.rendering_strategy.view_model);
              } else if (subItem?.relay_rendering_strategy?.view_model) {
                ads.push(subItem.relay_rendering_strategy.view_model);
              }
            }
          });
        }
      });
      return ads;
    }

    function getSideFeedAdSubAttachmentItems(attachment) {
      if (attachment?.all_subattachments?.length) return attachment;
      if (attachment?.all_subattachments?.nodes?.length) return attachment.all_subattachments.nodes;
      return [];
    }

    function adaptSideFeedAd(ad) {
      let attachments;
      let subAttachments;
      if (ad.rhc_ad?.attachments?.length) {
        subAttachments = ad.rhc_ad.attachments.map(getSideFeedAdSubAttachmentItems).flat();
      } else {
        subAttachments = getSideFeedAdSubAttachmentItems(ad.rhc_ad?.attachments);
      }
      if (subAttachments.length) {
        attachments = subAttachments.map((attachment) => {
          const media = attachment?.media ?? attachment?.multi_share_media_card_renderer?.attachment?.media;
          return {
            file: {
              url: media?.image?.uri,
            },
            target_url: attachment?.url,
            subtitle: attachment?.card_title?.text,
            description: attachment?.card_description?.text,
          };
        });
      } else {
        attachments = [
          {
            file: {
              url: ad.rhc_ad?.image?.uri,
            },
            target_url: ad.rhc_ad?.target_url ?? ad.rhc_ad?.web_link?.url,
            subtitle: '',
            description: ad.rhc_ad?.description,
          },
        ];
      }

      return {
        id: ad.id,
        ad_id: ad.sponsored_data?.ad_id,
        client_token: ad.sponsored_data?.client_token,
        display_link: ad.rhc_ad?.subtitle,
        attachments,
        title: ad.rhc_ad?.title,
        cta_title: ad.rhc_ad?.cta_label,
      };
    }

    function detectVideoFeedAds(items) {
      if (!Array.isArray(items)) items = [items];
      const ads = [];
      items.map((item) => {
        const data = item.data?.node?.section_components?.edges[0]?.node ? item.data?.node?.section_components?.edges[0]?.node : item.data.node;
        if (!data?.feed_unit?.sponsored_data) return;
        return ads.push(data.feed_unit);
      });
      return ads;
    }

    function getTargetUrlContainerAttachment(attachments) {
      return attachments?.find((attachment) => attachment.target_url)?.target_url;
    }

    function getLocationData(data) {
      const location = safeParseJson(data?.serialized_data);
      return {
        code: location?.location_code,
        name: data?.location_name,
        granularity: location?.location_granularity ?? 'country',
      };
    }

    function getLocales(data) {
      const localeCodes = safeParseJson(data?.serialized_data);
      return localeCodes.locales.map((code, index) => ({
        code,
        name: data?.locales[index],
      }));
    }

    function calculateAge(age) {
      const parsedAge = parseInt(age);
      if (Number.isNaN(parsedAge)) return null;
      return parsedAge + config.FACEBOOK_DEFAULT_AGE_START;
    }

    function getRelationship(data) {
      const relationshipData = safeParseJson(data?.serialized_data);
      const { relationship_status: relationshipId } = relationshipData;
      return config.RELATIONSHIPS.find((relation) => relation.id === relationshipId);
    }

    function getEducation(data) {
      const parsedData = safeParseJson(data?.serialized_data);
      const { edu_status: educationStatusId } = parsedData;
      return config.EDUCATIONS.find((education) => education.id === educationStatusId);
    }

    function composeInitialWaistData() {
      return {
        fanpage: {},
        locations: [],
        locales: [],
        targeting: {
          interests: [],
          demographics: {
            relationships: [],
            educations: [],
          },
          behaviors: [],
          audience_count: 0,
        },
        min_age: config.WAIST_KEYS_DEFAULT_VALUE,
        max_age: config.WAIST_KEYS_DEFAULT_VALUE,
        gender: config.WAIST_KEYS_DEFAULT_VALUE,
        is_marketplace_boosted: false,
      };
    }

    function adaptWAISTTargeting({ waist, targeting }) {
      for (const item of targeting) {
        try {
          switch (item.typeName) {
            case 'LOCALE':
              waist.locales.push(...getLocales(item));
              break;
            case 'INTERESTS':
              waist.targeting.interests.push(...item.interests);
              break;
            case 'AGE_GENDER':
              waist.gender = item.gender ?? waist.gender;
              waist.min_age = calculateAge(item.age_min) ?? waist.min_age;
              waist.max_age = calculateAge(item.age_max) ?? waist.max_age;
              break;
            case 'LOCATION':
              waist.locations.push(getLocationData(item));
              break;
            case 'ED_STATUS':
              const education = getEducation(item);
              if (education) waist.targeting.demographics.educations.push(education);
              break;
            case 'RELATIONSHIP_STATUS':
              const relationship = getRelationship(item);
              if (relationship) waist.targeting.demographics.relationships.push(relationship);
              break;
            case 'BCT':
              waist.targeting.behaviors.push({
                id: item.bct_id,
                name: item.name,
              });
              break;
            case 'DYNAMIC_RULE':
            case 'CUSTOM_AUDIENCES_DATAFILE':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_CANVAS':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_EVENT':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_IG':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_LEAD_GEN':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_PAGE':
            case 'CUSTOM_AUDIENCES_ENGAGEMENT_VIDEO':
            case 'CUSTOM_AUDIENCES_FACEBOOK_WIFI':
            case 'CUSTOM_AUDIENCES_FANTASY_GAMES':
            case 'CUSTOM_AUDIENCES_LOOKALIKE':
            case 'CUSTOM_AUDIENCES_MOBILE_APP':
            case 'CUSTOM_AUDIENCES_OFFLINE':
            case 'CUSTOM_AUDIENCES_QR_CODE':
            case 'CUSTOM_AUDIENCES_SHOPPING_IG':
            case 'CUSTOM_AUDIENCES_SHOPPING_PAGE':
            case 'CUSTOM_AUDIENCES_STORE_VISITS':
            case 'CUSTOM_AUDIENCES_UNRESOLVED':
            case 'CUSTOM_AUDIENCES_WEBSITE':
              waist.targeting.audience_count++;
              break;
            case 'SEARCH_AD':
              break;
            default:
              if (debugMode) console.log({ waistItemNotProcess: item });
          }
        } catch (error) {
          sendError(error, { item });
        }
      }
      return waist;
    }

    async function decodeTargetUrl(url) {
      const html = await customFetch(url);
      const decodedHtml = decodeHtml(html);
      const findUrl = decodedHtml.match(config.REGEX_BOOK.getLocationUrl)[1].replace(/\\\//g, '/');
      return JSON.parse(`"${findUrl}"`);
    }

    async function removeFBFromUrl(url) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.host.endsWith('doubleclick.net')) {
          if (parsedUrl.pathname.startsWith('/ddm/clk/')) return url;
          return;
        }
        if (parsedUrl.host.endsWith('fb.me')) throw context.exceptionHandler(new Error('hostname equal to fb.me'), { url });
        if (!parsedUrl.host.endsWith('l.facebook.com')) return url;
        if (parsedUrl.searchParams.get('enc')) {
          await sleep();
          const decodedUrl = await decodeTargetUrl(url);
          if (debugMode) console.log({ decodedUrl });
          return decodedUrl;
        }
        const targetUrl = new URL(parsedUrl.searchParams.get('u'));
        targetUrl.searchParams.set('fbclid', generateRandomString());
        return targetUrl.toString();
      } catch {}
    }

    const adsAdapters = {
      feed({ placement, data }) {
        detectFeedAds(data).map((findAd) => {
          const flatAd = getFlatAd(findAd);
          const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.FEED);
          pushAdToQueue({
            ad: {
              ...finds,
              attachments: adaptAttachments(getAttachments(flatAd)),
            },
            placement,
          });
        });
      },
      in_stream({ placement, data }) {
        detectInStreamAds(data).map((findAd) => {
          const flatAd = getFlatAd(findAd);
          const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.IN_STREAM);
          pushAdToQueue({
            ad: {
              ...finds,
              post_id: getInStreamPostId(findAd?.id),
              attachments: adaptAttachments(getAttachments(flatAd)),
            },
            placement,
          });
        });
      },
      video_feed({ placement, data }) {
        detectVideoFeedAds(data).map((findAd) => {
          const flatAd = getFlatAd(findAd);
          const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.VIDEO_FEED);
          pushAdToQueue({
            ad: {
              ...finds,
              attachments: adaptAttachments(getAttachments(flatAd)),
            },
            placement,
          });
        });
      },
      search({ placement, data }) {
        detectSearchAds(data).map((findAd) => {
          const flatAd = getFlatAd(findAd);
          const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.SEARCH);
          if (!finds?.post_id) {
            if (!finds?.fallback_post_id) return;
            finds.post_id = decryptPostId(finds.fallback_post_id);
            if (!finds.post_id) return;
          }
          delete finds.fallback_post_id;
          pushAdToQueue({
            ad: {
              ...finds,
              attachments: adaptAttachments(getAttachments(flatAd)),
            },
            placement,
          });
        });
      },
      marketplace({ placement, data }) {
        detectMarketplaceAds(data).map((findAd) => {
          const flatAd = getFlatAd(findAd);
          const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.MARKETPLACE);
          pushAdToQueue({
            ad: {
              ...finds,
              post_id: getMarketplacePostId(findAd?.id),
              attachments: adaptAttachments(getAttachments(flatAd)),
            },
            placement,
          });
        });
      },
      side_feed({ placement, data }) {
        detectSideFeedAds(data).map((findAd) => {
          const adaptAd = { ad: adaptSideFeedAd(findAd), placement };
          if (debugMode) console.log(adaptAd);
          pushAdToQueue(adaptAd);
        });
      },
    };
    return {
      adaptAdsByPlacement({ placement, data }) {
        if (debugMode) console.log({ placement, data });
        adsAdapters[placement]({ placement, data });
      },
      adaptPost(postData) {
        const flatAd = getFlatAd(postData);
        const finds = getDataByEndPartKey(flatAd, config.PART_KEYS.POST);
        if (finds?.posted_at) {
          finds.posted_at *= 1000;
        }
        if (!finds?.cta && finds?.ctaType && config.SPECIAL_CTA_TYPES[finds.ctaType]) {
          finds.cta = config.SPECIAL_CTA_TYPES[finds.ctaType];
        }
        delete finds.ctaType;
        return finds;
      },
      adaptWaist(response) {
        if (debugMode) console.log({ waist_before_adapt: response });
        const waist = composeInitialWaistData();
        waist.is_marketplace_boosted = response?.is_marketplace_boosted ?? waist.is_marketplace_boosted;
        waist.fanpage = response?.advertiser ?? waist.fanpage;
        return adaptWAISTTargeting({ waist, targeting: response.targeting });
      },
      async adaptTargetUrl(ad, page_id) {
        if (ad?.cta === 'MESSAGE_PAGE') return `https://www.facebook.com/msg/${page_id}`;
        const targetUrl = getTargetUrlContainerAttachment(ad.attachments);
        if (!targetUrl && !ad?.target_url) throw context.exceptionHandler(new Error('Not Found Target Url'));
        const adaptedTargetUrl = (await removeFBFromUrl(targetUrl)) ?? (await removeFBFromUrl(ad.target_url));
        if (!adaptedTargetUrl)
          throw context.exceptionHandler(new Error('No Result from Target Urls'), {
            urls: [targetUrl, ad?.target_url],
          });
        return adaptedTargetUrl;
      },
      adaptFanpage({ id, data }) {
        const result = {
          id,
          name: data.name,
          likes: data?.engagement?.count,
          followers: data.followers_count,
          location: data.location,
          website: data.website,
          address: data.single_line_address,
          is_verified: config?.FANPAGE_VERIFICATION_STATUSES?.[data?.verification_status] || false,
          checked_ins: data.checkins,
          has_added_app: data.has_added_app,
          has_transitioned_to_new_page_experience: data.has_transitioned_to_new_page_experience,
          avatar_url: data?.picture?.data?.url,
          email: data.emails?.[0],
          phone: data.phone,
          more_info: {
            about: data.about,
            description: data.description,
            impressum: data.impressum,
            privacyPolicy: data.privacy_info_url,
          },
          categories: data.category_list,
          call_to_actions: data?.call_to_actions?.data || [],
        };
        if (!(result.id && result.name && result.avatar_url && typeof result.is_verified === 'boolean'))
          throw context.exceptionHandler(new Error('validation Fanpage failed'));
        return result;
      },
    };
  }

  function pushAdToQueue({ ad, placement }) {
    context.adsList.push({
      ...ad,
      device: 'desktop',
      placement,
      showed_at: new Date(),
    });
    adsQueue();
  }

  async function adsQueue() {
    while (context.adsList.length > 0) {
      if (context.isAdsQueueInProcess || !context.adsQueueCanBeProcess || context.isGraphBlocked) return;
      context.isAdsQueueInProcess = true;
      let ad;
      try {
        ad = context.adsList.shift();
        if (!ad) throw new Error('Invalid Ad');
        await adsProcess(ad);
      } catch (error) {
        sendError(error, { ad });
      }
      await sleep();
      context.isAdsQueueInProcess = false;
    }
  }

  function sendAd(ad) {
    if (debugMode) return console.log({ sendAd: ad });
    window.postMessage({ sender: 'sblock', eventName: config.EVENTS.AD_GET_DONE, params: { messageData: { data: ad, platform: config.PLATFORM } } });
  }

  function sendAnalytics() {
    if (debugMode) return console.log({ name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM });
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.ANALYTICS_GET_DONE,
      params: { messageData: { name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM } },
    });
  }

  function sendError(error, data) {
    if (debugMode) return console.log(context.exceptionHandler(error, data));
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.CAUGHT_ERROR,
      params: { error: context.exceptionHandler(error, data) },
    });
  }

  function validator(ad) {
    if (ad?.placement !== config.PLACEMENTS.SIDE_FEED && !ad?.post_id) throw context.exceptionHandler(new Error('Not Found ad.post_id'));
    if (!ad?.ad_id) throw context.exceptionHandler(new Error('Not Found ad.ad_id'));
    if (!ad?.attachments?.length) throw context.exceptionHandler(new Error('Not Found ad.attachments'));
    for (let i = 0; i < 10; i++) {
      if (ad.attachments[i] && !ad.attachments[i]?.file?.url) throw context.exceptionHandler(new Error(`Not Found ad.attachments[${i}].file.url`));
    }
    if (ad.attachments.length > 10) throw context.exceptionHandler(new Error('Ad attachment field is greater than 10.'));
  }

  async function adsProcess(ad) {
    //check ad
    let adDone;
    context.adsDone.has(ad.ad_id) ? (adDone = context.adsDone.get(ad.ad_id)) : context.adsDone.set(ad.ad_id, (adDone = new Set()));
    if (adDone.has(ad.placement)) return;
    validator(ad);

    if (!context.requestWAIST) await registerWAIST(ad);

    if (ad.post_id) {
      //getPost
      const post = await getPost(ad.post_id);

      //merge Ad & Post
      ad = removeInvalidData(ad);
      ad = mergeAdAndPost({ post, ad });
    }
    ad = removeInvalidData(ad);

    //getWAIST
    const waistData = await getWAIST({
      ad_id: ad.ad_id,
      client_token: ad?.client_token ?? null,
    });
    if (!waistData?.fanpage?.id) throw context.exceptionHandler(new Error('Not Found waistData.fanpage.id'));

    //getFanpage
    const pageData = await getFanpage(waistData.fanpage, ad?.fanpage_verified);

    //targetUrl
    ad.target_url = await context.adapters.adaptTargetUrl(ad, pageData.id);

    //getInterests
    if (waistData?.targeting?.interests?.length) {
      waistData.targeting.interests = await getInterests(waistData.targeting.interests);
    }

    if (debugMode) adValidator(ad);
    delete ad.id;
    delete ad.client_token;
    delete ad.fanpage_verified;
    delete waistData.fanpage;

    sendAd({
      ad,
      page: pageData,
      waist: waistData,
    });

    adDone.add(ad.placement);
    return true;
  }

  const context = {
    adapters: AdapterService(),
    iDB: iDB('mooz'),
    modulesLoader: null,
    requestWAIST: null,
    menuRequest: null,
    fetchRouteDefinition: null,
    relayEfRequest: null,
    adsList: [],
    adsDone: new Map(),
    isAdsQueueInProcess: false,
    adsQueueCanBeProcess: false,
    isGraphBlocked: false,
    modulesAddition: Date.now(),
    exceptionHandler: ExceptionHandler(),
    adsBlocker: Blocker(),
  };

  async function start() {
    mockConsoleError();
    sendAnalytics();
    await context.adsBlocker();
    await sleep();
    try {
      await getAccessToken();
      context.modulesLoader = requireModulesLoader();
      context.fetchRouteDefinition = requireFetchRouteDefinition();
      context.adsQueueCanBeProcess = true;
      await adsQueue();
    } catch (error) {
      sendError(error);
    }
  }

  start().then();
  return true;
}
