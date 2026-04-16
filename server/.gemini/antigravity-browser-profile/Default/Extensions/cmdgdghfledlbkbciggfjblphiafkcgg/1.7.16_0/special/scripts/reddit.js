export function redditScript(isBlockerOn) {
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
    PLATFORM: 'reddit',
    FAKE_AD_ID: 't3_7w17su',
    SLEEP_TIME: 5_000,
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

  function getMetadata() {
    return {
      ua: window.navigator.userAgent,
      lang: window.navigator.language,
    };
  }

  function ExceptionHandler() {
    class RedditScriptException extends Error {
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
        exception = new RedditScriptException({
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

  function Blocker() {
    function removeAdsWhenAddNode() {
      const observer = new MutationObserver((mutations) => {
        if (mutations.find((v) => v.addedNodes.length)) removeAndPushAds();
      });
      observer.observe(document.body, { childList: true, subtree: true });
      removeAndPushAds();
    }

    function removeAndPushAds() {
      try {
        const noneLoginAdElements = [...document.querySelectorAll('shreddit-ad-post,shreddit-comments-page-ad,shreddit-sidebar-ad')];
        if (noneLoginAdElements.length) {
          for (const element of noneLoginAdElements) {
            pushAd(element);
            if (isBlockerOn) element.remove();
          }
        }
      } catch {}
      try {
        const loginAdElements = [...document.querySelectorAll('div.promotedlink')];
        if (loginAdElements.length) {
          for (const element of loginAdElements) {
            if (element.style.height === '' && isBlockerOn) element.style.display = 'none';
          }
        }
      } catch {}
    }

    return () => {
      document.addEventListener('DOMContentLoaded', () => {
        removeAdsWhenAddNode();
        context.adsQueueCanBeProcess = true;
        adsQueue();
      });
    };
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

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
  }

  async function getOwner(username) {
    if (!username) return null;
    const res = await customFetch(`https://www.reddit.com/user/${username}/about.json`);
    return JSON.parse(res).data;
  }

  function pushAd(ad) {
    context.adsList.push(ad);
    adsQueue();
  }

  async function adsQueue() {
    if (context.isAdsQueueInProcess || !context.adsQueueCanBeProcess) return;
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
    }
    context.isAdsQueueInProcess = false;
  }

  async function adProcess(ad) {
    const id = ad.getAttribute('id');
    const user = ad.getAttribute('author');
    ad.removeAttribute('ad-events');
    ad = ad.outerHTML;
    if (!id) throw new Error('Not Found Ad Id');
    if (context.adsDone.has(id)) return;
    if (!user) throw new Error('Not Found User Id');
    await wait(config.SLEEP_TIME);
    const owner = await getOwner(user);
    context.adsDone.add(id);
    sendAd({ ad, owner, metadata: getMetadata() });
  }

  const context = {
    metadata: {},
    adsQueueCanBeProcess: false,
    isAdsQueueInProcess: false,
    adsList: [],
    adsDone: new Set(),
    exceptionHandler: ExceptionHandler(),
    adsBlocker: Blocker(),
  };

  function start() {
    context.adsDone.add(config.FAKE_AD_ID);
    context.adsBlocker();
    sendAnalytics();
  }

  start();
  return true;
}
