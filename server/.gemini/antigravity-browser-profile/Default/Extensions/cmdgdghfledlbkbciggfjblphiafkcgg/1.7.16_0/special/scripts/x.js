export function xScript(isBlockerOn) {
  const debugMode = false;
  if (debugMode) console.log(`Code Injected Before ${!!window?.sBlockAdAnalyzerInjected}`);
  if (window.sBlockAdAnalyzerInjected) return true;
  window.sBlockAdAnalyzerInjected = true;

  const config = {
    serviceName: 'chrome-extension',
    EVENTS: {
      AD_GET_DONE: 'ad.get.done',
      CAUGHT_ERROR: 'caught.error',
      ANALYTICS_GET_DONE: 'analytics.get.done',
      EXTENSION_SITE_OPEN: 'extension_site_open',
    },
    PLATFORM: 'x',
    REGEX_BOOK: {
      AD_ID: /^[a-z-]+-\d{3,}-([0-9a-f]{3,})$/,
      COUNTRY_CODE: /"country":"([A-Z]{2})"/,
    },
    WAIT_WAIST_REQUEST: 4000,
  };

  const context = {
    isAdsQueueInProcess: false,
    adsQueueCanBeProcess: false,
    adsList: [],
    adsDone: new Set(),
    metadata: null,
    exceptionHandler: ExceptionHandler(),
    adsBlocker: Blocker(),
  };

  function sendAd(ad) {
    if (debugMode) return console.log({ sendAd: ad });
    window.postMessage({ sender: 'sblock', eventName: config.EVENTS.AD_GET_DONE, params: { messageData: { data: ad, platform: config.PLATFORM } } });
  }

  function sendError(error, data) {
    if (debugMode) return console.log(context.exceptionHandler(error, data));
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.CAUGHT_ERROR,
      params: { error: context.exceptionHandler(error, data) },
    });
  }

  function sendAnalytics() {
    if (debugMode) return console.log({ name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM });
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.ANALYTICS_GET_DONE,
      params: { messageData: { name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM } },
    });
  }

  function ExceptionHandler() {
    class TwitterScriptException extends Error {
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
        exception = new TwitterScriptException({
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

  function getMetadata() {
    if (!context.metadata) {
      let country;
      try {
        country = window.document.body.innerHTML.match(config.REGEX_BOOK.COUNTRY_CODE)[1];
      } catch {}
      context.metadata = {
        ua: window.navigator.userAgent,
        lang: window.navigator.language,
        country,
      };
    }
    return context.metadata;
  }

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  }

  async function customFetch(url, init = {}) {
    let response, responseText;
    try {
      response = await fetch(url, init);
      responseText = await response.text();
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return responseText;
    } catch (error) {
      throw context.exceptionHandler(error, {
        url,
        status: response?.status ?? 0,
        responseText: responseText?.slice(0, 1000) ?? '',
      });
    }
  }

  async function getWAIST(adId) {
    try {
      const result = await customFetch(`https://${window.location.host}/about-ads?aid=${adId}&lang=en`);
      const el = document.createElement('div');
      el.innerHTML = result;
      return el.querySelector('.targetingMessage').innerHTML.replaceAll('\n', '').replaceAll('  ', '');
    } catch {}
    return '__ERROR__';
  }

  function Blocker() {
    function findPlacement(url) {
      if (url.includes('/HomeTimeline')) return 'feed';
      if (url.includes('/TweetDetail')) return 'detail';
      if (url.includes('/SearchTimeline')) return 'search';
      if (url.includes('/HomeLatestTimeline')) return 'following';
      return false;
    }

    function mockXHRPrototype(name, callBack) {
      const get = Object.getOwnPropertyDescriptor(window.XMLHttpRequest.prototype, name).get;
      Object.defineProperty(window.XMLHttpRequest.prototype, name, {
        get: function () {
          const response = get.apply(this, arguments);
          const placement = findPlacement(this?.responseURL);
          if (placement) {
            try {
              return JSON.stringify(callBack(JSON.parse(response), placement));
            } catch {}
          }
          return response;
        },
      });
    }

    function getEntries(data) {
      if (data?.data?.home?.home_timeline_urt?.instructions?.[0]?.entries) {
        return data.data.home.home_timeline_urt.instructions[0].entries;
      }
      if (data?.data?.threaded_conversation_with_injections_v2?.instructions?.[0]?.entries) {
        return data.data.threaded_conversation_with_injections_v2.instructions[0].entries;
      }
      if (data?.data?.search_by_raw_query?.search_timeline?.timeline?.instructions?.[0]?.entries) {
        return data.data.search_by_raw_query.search_timeline.timeline.instructions[0].entries;
      }
    }

    function removeAndPushAdProperties(data, placement) {
      const entries = getEntries(data);
      if (!entries?.length) return data;
      for (const key in entries) {
        const adId = entries[key]?.entryId?.match(config.REGEX_BOOK.AD_ID)?.[1];
        if (!adId) continue;
        const ad = { ...entries[key], placement };
        pushAd(adId, ad);
        if (isBlockerOn) entries.splice(key, 1);
      }
      if (isBlockerOn) entries.filter(Boolean);
      return data;
    }

    return () => {
      mockXHRPrototype('responseText', removeAndPushAdProperties);
      mockXHRPrototype('response', removeAndPushAdProperties);
    };
  }

  function pushAd(id, ad) {
    context.adsList.push({ id, ad });
    adsQueue();
  }

  async function adsQueue() {
    if (context.isAdsQueueInProcess) return;
    context.isAdsQueueInProcess = true;
    while (context.adsList.length > 0) {
      let ad;
      try {
        ad = context.adsList.shift();
        if (!ad) throw new Error('Invalid Ad');
        await adProcess(ad);
      } catch (error) {
        sendError(error, { ad });
      }
      await wait(config.WAIT_WAIST_REQUEST + Math.round(Math.random() * 2000));
    }
    context.isAdsQueueInProcess = false;
  }

  async function adProcess({ id, ad }) {
    if (context.adsDone.has(id)) return;
    const waist = await getWAIST(id);
    ad.id = id
    context.adsDone.add(id);
    sendAd({ ad, metadata: getMetadata(), waist });
  }

  function start() {
    context.adsBlocker();
    sendAnalytics();
  }

  start();
  return true;
}
