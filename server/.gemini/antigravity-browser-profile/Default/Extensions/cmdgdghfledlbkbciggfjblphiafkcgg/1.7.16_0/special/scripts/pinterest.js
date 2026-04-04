export function pinterestScript(isBlockerOn) {
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
    PLATFORM: 'pinterest',
    FETCH_PIN_HEADERS: new Headers({
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json, text/javascript, */*, q=0.01',
      'X-Pinterest-PWS-Handler': 'www/pin/[id].js',
    }),
    SLEEP_TIME: 5_000,
  };

  function ExceptionHandler() {
    class PinterestScriptException extends Error {
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
        exception = new PinterestScriptException({
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

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  }

  function matchFirstGroup(str, regex) {
    try {
      return str.match(regex)[1];
    } catch {}
  }

  async function customFetch(url, init = {}, json = false) {
    let response, responseText;
    try {
      response = await fetch(url, init);
      responseText = await response.text();
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      if (json) {
        return JSON.parse(responseText);
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

  function Blocker() {
    const filterObject = (obj, predicate) => Object.fromEntries(Object.entries(obj).filter(predicate));
    const firstObjectValue = (obj) => Object.values(obj)[0];

    function mockXHRPrototype(name, callBack) {
      const get = Object.getOwnPropertyDescriptor(window.XMLHttpRequest.prototype, name).get;
      Object.defineProperty(window.XMLHttpRequest.prototype, name, {
        get: function () {
          const response = get.apply(this, arguments);
          try {
            if (this.responseURL.includes('/get/') && this.responseURL.includes('/resource/')) {
              return JSON.stringify(callBack(JSON.parse(response)));
            }
          } catch {}
          return response;
        },
      });
    }

    function mockGetTextContent(callback) {
      const get = Object.getOwnPropertyDescriptor(window.Node.prototype, 'textContent').get;
      Object.defineProperty(window.Node.prototype, 'textContent', {
        get: function () {
          let content = get.apply(this, arguments);
          try {
            if (this.tagName === 'SCRIPT' && this.type === 'application/json') {
              return JSON.stringify(callback(JSON.parse(content)));
            }
          } catch {}
          return content;
        },
      });
    }

    function filterAndPushAds(data, metadata) {
      return data.filter((pin) => {
        if (pin?.is_promoted !== true) return true;
        context.adsList.push({ ad: pin, metadata });
        if (!isBlockerOn) return true;
      });
    }

    function changeData(res, metadata) {
      if (res?.data?.length) {
        res.data = filterAndPushAds(res.data, metadata);
      } else if (res?.data?.results?.length) {
        res.data.results = filterAndPushAds(res.data.results, metadata);
      }
    }

    function removeAndPushRequestAds(data) {
      try {
        if (debugMode) console.log({ data: { ...data } });
        const metadata = adaptMetadata(data.client_context);
        changeData(data.resource_response, metadata);
      } catch {}
      adsQueue();
      return data;
    }

    function removeAndPushIndexAds(data) {
      try {
        if (debugMode) console.log({ data: { ...data } });
        const outsidePins = data.props.initialReduxState;
        const outsideData = firstObjectValue(firstObjectValue(data.props.initialReduxState.resources));
        const metadata = adaptMetadata(data.props.context);
        outsidePins.pins = filterObject(outsidePins.pins, ([, pin]) => pin.is_promoted !== true || !isBlockerOn);
        changeData(outsideData, metadata);
      } catch {}
      adsQueue();
      return data;
    }

    return () => {
      mockGetTextContent(removeAndPushIndexAds);
      mockXHRPrototype('responseText', removeAndPushRequestAds);
      mockXHRPrototype('response', removeAndPushRequestAds);
    };
  }

  function adaptMetadata(context) {
    const metadata = { ...context };
    delete metadata.user;
    delete metadata.enabled_advertiser_countries;
    return metadata;
  }

  async function getPinId(ad) {
    let id;
    if (ad?.root_pin_id) {
      id = ad.root_pin_id;
    } else if (ad?.comments?.uri) {
      id = matchFirstGroup(ad.comments.uri, /pins\/(\d+)\//);
    } else if (ad?.id) {
      const pin = await customFetch(`https://${window.location.host}/pin/${ad.id}/`, { credentials: 'omit' });
      id = matchFirstGroup(pin, /window\.location\s?=\s?"\/pin\/(\d+)\/"/);
    }
    if (id) return id;
    throw new Error('Not found pin id');
  }

  async function getPinData(id) {
    const url = `https://${
      window.location.host
    }/resource/PinResource/get/?source_url=%2Fpin%2F${id}%2F&data=%7B%22options%22%3A%7B%22id%22%3A%22${id}%22%2C%22field_set_key%22%3A%22auth_web_main_pin%22%2C%22noCache%22%3Atrue%2C%22fetch_visual_search_objects%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D&_=${Date.now()}`;
    const pin = await customFetch(url, { headers: config.FETCH_PIN_HEADERS }, true);
    return pin.resource_response.data;
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
    ad.root_pin_id = await getPinId(ad);
    const pin = await getPinData(ad.id);
    context.adsDone.add(ad.id);
    sendAd({ ad, metadata, pin });
  }

  const context = {
    adsList: [],
    adsDone: new Set(),
    isAdsQueueInProcess: false,
    exceptionHandler: ExceptionHandler(),
    adsBlocker: Blocker(),
  };

  function start() {
    context.adsBlocker();
    sendAnalytics();
  }

  start();
  return true;
}
