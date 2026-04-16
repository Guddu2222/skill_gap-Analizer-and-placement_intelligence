export function tiktokScript(isBlockerOn) {
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
    PLATFORM: 'tiktok',
    SLEEP_TIME: 5_000,
  };

  function ExceptionHandler() {
    class TiktokScriptException extends Error {
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
        exception = new TiktokScriptException({
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

  function sendAd(ad) {
    if (debugMode) return console.log({ sendAd: ad });
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.AD_GET_DONE,
      params: { messageData: { data: ad, platform: config.PLATFORM } },
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

  function sendAnalytics() {
    if (debugMode) return console.log({ name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM });
    window.postMessage({
      sender: 'sblock',
      eventName: config.EVENTS.ANALYTICS_GET_DONE,
      params: { messageData: { name: config.EVENTS.EXTENSION_SITE_OPEN, site: config.PLATFORM } },
    });
  }

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  }

  function Blocker() {
    function replaceValue(target, property, handler) {
      let prototype = target.prototype ?? Object.getPrototypeOf(target);
      if (!prototype[property]) prototype = target;
      const original = prototype[property];
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property) ?? {};
      const dummyObject = {
        [property](...args) {
          /*Injected by SBlock!*/
          return handler(original, this, args);
        },
      };
      Object.defineProperty(prototype, property, {
        ...descriptor,
        value: dummyObject[property],
      });
    }

    function checkAdUrl(url) {
      return url?.includes('/preload/item_list') || url?.includes('/recommend/item_list');
    }

    function getMetadataFromUrl(url) {
      if (!url) return {};
      const params = new URL(url).searchParams;
      return Object.fromEntries(Array.from(params).filter(([key]) => !key.toLowerCase().startsWith('x-')));
    }

    function mockResponse(obj, name, callBack) {
      replaceValue(obj.Response, name, (target, ctx, args) => {
        return new Promise(async (resolve, reject) => {
          let response;
          try {
            response = await target.apply(ctx, args);
          } catch (e) {
            reject(e);
            return;
          }
          try {
            if (ctx.ok && checkAdUrl(ctx?.url)) {
              if (!context.metadata) context.metadata = getMetadataFromUrl(ctx.url);
              if (name === 'json') {
                resolve(callBack({ response }));
              } else {
                resolve(JSON.stringify(callBack({ response: JSON.parse(response) })));
              }
            }
          } catch (e) {
            sendError(e);
          }
          resolve(response);
        });
      });
    }

    function filterAndPushAds(data) {
      return data.filter((listItem) => {
        if (listItem?.isAd !== true) return true;
        context.adsList.push({ ad: listItem, metadata: context.metadata });
        if (!isBlockerOn) return true;
      });
    }

    function removeAndPushRequestAds({ response }) {
      try {
        if (debugMode) console.log({ data: { ...response } });
        response.itemList = filterAndPushAds(response.itemList);
      } catch (e) {
        if (debugMode) console.log('removeAndPushRequestAds => ', e);
      }
      adsQueue();
      return response;
    }

    return () => {
      mockResponse(window, 'text', removeAndPushRequestAds);
      mockResponse(window, 'json', removeAndPushRequestAds);
    };
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
      await wait(config.SLEEP_TIME);
    }
    context.isAdsQueueInProcess = false;
  }

  async function adProcess(data) {
    const { ad, metadata } = data;
    if (!ad?.id) throw new Error('Not Found Ad Id');
    if (context.adsDone.has(ad.id)) return;
    context.adsDone.add(ad.id);
    sendAd({ ad, metadata });
  }

  const context = {
    adsList: [],
    adsDone: new Set(),
    isAdsQueueInProcess: false,
    exceptionHandler: ExceptionHandler(),
    adsBlocker: Blocker(),
    metadata: null,
  };

  function start() {
    context.adsBlocker();
    sendAnalytics();
  }

  start();
  return true;
}
