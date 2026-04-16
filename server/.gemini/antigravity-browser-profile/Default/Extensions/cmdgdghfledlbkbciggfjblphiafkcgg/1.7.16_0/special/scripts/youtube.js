export function youtubeScript(isBlockerOn) {
  const debugMode = false;
  const debugModeBlocker = false;
  if (debugMode) console.log(`Code Injected Before ${!!window?.sBlockAdAnalyzerInjected}`);
  if (window.sBlockAdAnalyzerInjected) return true;
  window.sBlockAdAnalyzerInjected = true;

  const config = {
    serviceName: 'chrome-extension',
    EVENTS: {
      AD_GET_DONE: 'ad.get.done',
      RESOURCE_REQUEST: 'resource.request',
      RESOURCE_RESPONSE: 'resource.response',
      CAUGHT_ERROR: 'caught.error',
      ANALYTICS_GET_DONE: 'analytics.get.done',
      EXTENSION_SITE_OPEN: 'extension_site_open',
      PING: 'ping',
    },
    REGEX_BOOK: {
      findVideoId: /"adVideoId":"(\w{5,})"/g,
    },
    PLATFORM: 'youtube',
    SLEEP_TIME: 5000,
    DEEP_SLEEP_TIME: 10000,
  };

  function wait(time) {
    return new Promise((res) => {
      setTimeout(res, time);
    });
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

  function ExceptionHandler() {
    class YoutubeScriptException extends Error {
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
        exception = new YoutubeScriptException({
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

  async function customFetch(url, init = {}) {
    let response;
    let responseText;
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

  function sendPing() {
    window.postMessage({ sender: 'sblock', eventName: config.EVENTS.PING, params: { ping: true } });
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

  function requestResource() {
    window.postMessage({ sender: 'sblock', eventName: config.EVENTS.RESOURCE_REQUEST, params: { messageData: { platform: config.PLATFORM } } });
  }

  function pushAds(ads, type, isReel = false) {
    if (debugMode) console.log('pushAds', { ads, type, isReel });
    if (!canProcessAdsQueue() && context.adsList.length > 10) return;
    if (!Array.isArray(ads)) ads = [ads];
    for (const ad of ads) {
      context.adsList.push({ adsData: ad, type, isReel });
    }
  }

  function flattenObj(obj, parent = null, res = {}) {
    for (const key in obj) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object') {
        flattenObj(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  function getDataByEndPartKey(obj, partKeys) {
    const finds = {};
    const flattened = flattenObj(obj);
    const flattenedKeys = Object.keys(flattened);
    if (debugMode) console.log({ Length: flattenedKeys.length, flattened });
    for (const partKeysKey in partKeys) {
      let key;
      for (const val of partKeys[partKeysKey]) {
        key = flattenedKeys.find((key) => key.endsWith(val));
        if (key) break;
      }
      if (!key) continue;
      finds[partKeysKey] = flattened[key];
    }
    return finds;
  }

  function blocker() {
    function checkAdUrl(url) {
      return url?.includes('youtubei/v1/') && !url?.includes('youtubei/v1/reel/reel_item_watch');
    }

    function coverRemover(results) {
      for (let i = 0; i < results.length; i++) {
        if (results[i]?.searchPyvRenderer?.ads?.[0]?.adSlotRenderer) {
          pushAds(results[i].searchPyvRenderer.ads, 'cover');
          if (isBlockerOn) results[i].searchPyvRenderer.ads = [];
        } else if (results[i]?.adSlotRenderer) {
          pushAds(results[i].adSlotRenderer, 'cover');
          if (isBlockerOn) results[i] = {};
        } else if (results[i]?.richItemRenderer?.content?.adSlotRenderer) {
          pushAds(results[i].richItemRenderer.content, 'cover');
          if (isBlockerOn) results[i] = {};
        }
      }
    }

    function multiCoverRemover(results) {
      for (let i = 0; i < results.length; i++) {
        if (results[i]?.itemSectionRenderer?.contents?.length) {
          coverRemover(results[i].itemSectionRenderer.contents);
        } else if (results[i]?.length) {
          coverRemover(results[i]);
        } else if (results[i]?.appendContinuationItemsAction?.continuationItems?.length) {
          coverRemover(results[i].appendContinuationItemsAction.continuationItems);
        } else if (results[i]?.adSlotRenderer) {
          pushAds(results[i].adSlotRenderer, 'cover');
          if (isBlockerOn) results[i] = {};
        }
      }
    }

    function removerFromEntries(entries) {
      return entries.filter((val) => {
        if (val?.command?.reelWatchEndpoint?.adClientParams?.isAd !== true) {
          return true;
        }
        pushAds(val, 'video', true);
        return !isBlockerOn;
      });
    }

    function removeAdProperties(data) {
      if (data?.continuationEndpoint && data?.entries) data.entries = removerFromEntries(data.entries);
      if (data?.onResponseReceivedActions?.length) {
        multiCoverRemover(data.onResponseReceivedActions);
      }
      const contents = data?.watchNextResponse?.contents ?? data?.contents;
      const playerResponse = data?.playerResponse ?? data;
      if (contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.richGridRenderer?.masthead?.adSlotRenderer) {
        pushAds(contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.masthead, 'cover');
        if (isBlockerOn) delete contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.masthead;
      }
      if (contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.richGridRenderer?.contents?.length) {
        coverRemover(contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.richGridRenderer.contents);
      }
      if (contents?.twoColumnWatchNextResults?.secondaryResults?.secondaryResults?.results?.length) {
        multiCoverRemover(contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results);
      }
      if (contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents) {
        multiCoverRemover(contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents);
      }
      if (playerResponse?.playerAds) {
        pushAds(
          {
            playerAds: playerResponse?.playerAds,
            adPlacements: playerResponse?.adPlacements,
            adSlots: playerResponse?.adSlots,
            publishedVideoDetails: data?.microformat?.playerMicroformatRenderer,
          },
          'video',
        );
      }
      if (isBlockerOn) {
        // delete playerResponse?.streamingData?.serverAbrStreamingUrl; // Probably ineffective.
        delete playerResponse?.playerConfig?.ssapConfig;
        delete playerResponse?.adPlacements;
        delete playerResponse?.playerAds;
        delete playerResponse?.adSlots;
      }
      adsQueue();
    }

    function fixErrorStack(errorStr) {
      const lines = errorStr.split(/\r?\n/);
      lines.splice(1, 4);
      return lines.join('\n');
    }

    function checkValidRequest(ctx) {
      return ctx.ok && checkAdUrl(ctx.url) && ctx.headers.get('content-type').includes('application/json');
    }

    // mocks
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

    function replaceGetter(target, property, handler) {
      const prototype = target.prototype ?? Object.getPrototypeOf(target);
      const descriptor = Object.getOwnPropertyDescriptor(prototype, property);
      const original = descriptor.get;
      const dummyObject = {
        get [property]() {
          /*Injected by SBlock!*/
          if (prototype.isPrototypeOf(this)) return handler(original, this);
          throw new TypeError('Illegal invocation');
        },
      };
      const dummyDescriptor = Object.getOwnPropertyDescriptor(dummyObject, property);
      Object.defineProperty(prototype, property, {
        ...descriptor,
        get: dummyDescriptor?.get,
      });
    }

    function mockProperty(name, callBack) {
      let customProperty;
      try {
        Object.defineProperty(window, name, {
          get: function () {
            return customProperty;
          },
          set: function (val) {
            customProperty = callBack(val, 'mockProperty');
          },
        });
      } catch (e) {
        sendError(e);
      }
    }

    function mockXHRPrototype(name, callBack) {
      try {
        replaceGetter(XMLHttpRequest, name, function (target, ctx) {
          const response = target.apply(ctx, arguments);
          if (checkAdUrl(ctx?.responseURL)) {
            try {
              return JSON.stringify(callBack(JSON.parse(response), `mockXHRPrototype - ${name}`));
            } catch (e) {
              sendError(e, { responseURL: ctx?.responseURL });
            }
          }
          return response;
        });
      } catch (e) {
        sendError(e, { XMLHttpRequestPrototypeKeys: Object.keys(XMLHttpRequest?.prototype ?? {}) });
      }
    }

    function mockResponse(obj, name, callBack) {
      replaceValue(obj.Response, name, (target, ctx, args) => {
        return new Promise(async (resolve, reject) => {
          let response;
          try {
            response = await target.apply(ctx, args);
          } catch (e) {
            e.stack = fixErrorStack(e.stack);
            if (debugMode) console.log(e);
            reject(e);
            return;
          }
          try {
            if (checkValidRequest(ctx)) {
              if (name === 'json') {
                resolve(callBack(response, 'mockResponse - json'));
              } else {
                resolve(JSON.stringify(callBack(JSON.parse(response), 'mockResponse - text')));
              }
            }
          } catch (e) {
            if (debugMode) console.log(e);
          }
          resolve(response);
        });
      });
    }

    function mockResponseBody(obj) {
      replaceGetter(obj.Response, 'body', (target, ctx) => {
        const org = target.apply(ctx, arguments);
        if (!checkValidRequest(ctx)) return org;
        if (!ctx.read) {
          ctx.read = new ReadableStream({
            async start(controller) {
              const mockedText = await ctx.text();
              controller.enqueue(new TextEncoder().encode(mockedText));
              controller.close();
            },
          });
        }
        return ctx.read;
      });
    }

    function mockResponseBuffer(obj, name, callBack) {
      replaceValue(obj.Response, name, (target, ctx, args) => {
        return new Promise(async (resolve, reject) => {
          let buffer;
          try {
            buffer = await target.apply(ctx, args);
          } catch (e) {
            e.stack = fixErrorStack(e.stack);
            if (debugMode) console.log(e);
            reject(e);
            return;
          }
          try {
            if (checkValidRequest(ctx)) {
              const resText = new TextDecoder().decode(buffer);
              const mockedText = JSON.stringify(callBack(JSON.parse(resText), `mockResponseBuffer - ${name}`));
              if (name === 'arrayBuffer') return resolve(new TextEncoder().encode(mockedText).buffer);
              return resolve(new TextEncoder().encode(mockedText));
            }
          } catch (e) {
            if (debugMode) console.log(e);
          }
          resolve(buffer);
        });
      });
    }

    function mockToString() {
      replaceValue(Function, 'toString', (target, ctx) => {
        if (ctx === Function.prototype.toString) return 'function toString() { [native code] }';
        const result = target.apply(ctx);
        if (result.includes('Injected by SBlock!')) return `function ${ctx.name}() { [native code] }`;
        if (result.includes('function ${') && result.includes('[native code]')) return 'function toString() { [native code] }';
        return result;
      });
    }

    function mockAppendChild() {
      replaceValue(Node, 'appendChild', (target, ctx, args) => {
        const el = target.apply(ctx, args);
        try {
          if (el instanceof HTMLIFrameElement && el.contentWindow) mockAllResponseMethods(el.contentWindow);
        } catch (e) {
          if (debugMode) console.log(e);
        }
        return el;
      });
    }

    function multiRemoveAdProperties(data, caller) {
      if (debugMode && debugModeBlocker) console.log({ caller, data: { ...JSON.parse(JSON.stringify(data)) } });
      if (Array.isArray(data)) {
        data.forEach((el) => {
          removeAdProperties(el);
        });
      } else {
        removeAdProperties(data);
      }
      return data;
    }

    function mockAllResponseMethods(win) {
      mockResponse(win, 'json', multiRemoveAdProperties);
      mockResponse(win, 'text', multiRemoveAdProperties);
      mockResponseBody(win);
      mockResponseBuffer(win, 'arrayBuffer', multiRemoveAdProperties);
      mockResponseBuffer(win, 'bytes', multiRemoveAdProperties);
    }

    mockToString();
    mockAppendChild();
    mockProperty('ytInitialData', multiRemoveAdProperties);
    mockProperty('ytInitialPlayerResponse', multiRemoveAdProperties);
    mockProperty('ytInitialReelWatchSequenceResponse', multiRemoveAdProperties);
    mockXHRPrototype('responseText', multiRemoveAdProperties);
    mockXHRPrototype('response', multiRemoveAdProperties);
    mockAllResponseMethods(window);
  }

  function setMetadata() {
    const client = ytcfg.data_.INNERTUBE_CONTEXT.client;
    context.metadata = {
      country: client.gl,
      language: client.hl,
      timezone: client.timeZone,
      device: {
        os: {
          name: client.osName,
          version: client.osVersion.replace('_', '.'),
        },
        browser: {
          name: client.browserName,
          version: client.browserVersion,
        },
        userAgent: client.userAgent,
      },
    };
  }

  function apiRequestWeb(url, data) {
    return customFetch(url, {
      method: 'POST',
      headers: context.requestData.headers,
      body: JSON.stringify({
        context: context.requestData.context,
        ...data,
      }),
      credentials: 'same-origin',
      mode: 'same-origin',
    });
  }

  function getReelAdRequestParams(data) {
    if (!data?.command?.reelWatchEndpoint?.videoId) throw context.exceptionHandler(new Error('Not found Reel videoId'));
    return {
      videoId: data.command.reelWatchEndpoint.videoId,
      playerParams: data.command.reelWatchEndpoint.playerParams,
      params: data.command.reelWatchEndpoint.params,
    };
  }

  async function getReelAd(requestParams) {
    const res = await apiRequestWeb(`https://www.youtube.com/youtubei/v1/reel/reel_item_watch?prettyPrint=false`, {
      playerRequest: {
        videoId: requestParams.videoId,
        params: requestParams.playerParams,
      },
      params: requestParams.params,
      disablePlayerResponse: true,
    });
    const adData = JSON.parse(res);
    if (debugMode) console.log({ getReelAd: adData });
    return removeTrashData(adData);
  }

  function removeTrashData(obj) {
    if (typeof obj !== 'object' || obj === null) return obj;
    const newObj = { ...obj };
    delete newObj?.responseContext;
    delete newObj?.onResponseReceivedEndpoints;
    delete newObj?.engagementPanels;
    delete newObj?.topbar;
    delete newObj?.pageVisualEffects;
    delete newObj?.frameworkUpdates;
    delete newObj?.playabilityStatus;
    delete newObj?.streamingData;
    delete newObj?.playbackTracking;
    delete newObj?.endscreen;
    delete newObj?.captions;
    return newObj;
  }

  function canProcessAdsQueue() {
    return (
      !context.adsQueueCanBeProcess.inProcess &&
      !context.adsQueueCanBeProcess.isBlock &&
      context.adsQueueCanBeProcess.contextReady &&
      context.adsQueueCanBeProcess.dynamicAdapterResource &&
      context.adsQueueCanBeProcess.asyncStart
    );
  }

  function mockRequest() {
    const OriginalRequest = Request;
    window.Request = function (...args) {
      try {
        if (!context.adsQueueCanBeProcess.contextReady && args?.[0]?.startsWith('/youtubei/v1/') && args?.[1]?.body && args[1].headers) {
          const body = JSON.parse(args[1].body);
          if (body?.context) {
            context.requestData.headers = args[1].headers;
            context.requestData.context = body.context;
            context.requestData.context.client.hl = 'en';
            if (debugMode) console.log({ requestData: context.requestData });
            context.adsQueueCanBeProcess.contextReady = true;
            adsQueue();
          }
        }
      } catch (e) {
        if (debugMode) console.log(e);
      }
      return new OriginalRequest(...args);
    };
    window.Request.prototype = OriginalRequest.prototype;
  }

  function getDynamicAdapterResource() {
    window.addEventListener('message', (event) => {
      if (event?.source !== window) return;
      if (event?.data?.sender === 'sblock') {
        const message = event.data?.message;
        if (message?.eventName === config.EVENTS.RESOURCE_RESPONSE && message?.data) {
          context.dynamicAdapterResource = message.data;
          context.adsQueueCanBeProcess.dynamicAdapterResource = true;
          adsQueue();
        }
      }
    });
    requestResource();
  }

  async function getVideoData(videoId) {
    const urlPlayer = `https://www.youtube.com/youtubei/v1/player?prettyPrint=false`;
    const urlNext = `https://www.youtube.com/youtubei/v1/next?prettyPrint=false`;
    const responsePlayer = await apiRequestWeb(urlPlayer, { videoId });
    const responseNext = await apiRequestWeb(urlNext, { videoId });
    const playerJSON = JSON.parse(responsePlayer);
    const nextJSON = JSON.parse(responseNext);
    if (playerJSON?.playabilityStatus?.status && playerJSON?.playabilityStatus?.status !== 'OK') {
      context.adsQueueCanBeProcess.isBlock = false;
      throw context.exceptionHandler(new Error('invalid player playability status'), {
        status: playerJSON?.playabilityStatus?.status,
        next: nextJSON,
        player: playerJSON,
      });
    }
    const adaptedNext = getDataByEndPartKey(nextJSON, context.dynamicAdapterResource);
    if (!Object.keys(adaptedNext).length) {
      throw context.exceptionHandler(new Error('invalid adapted next'), {
        next: nextJSON,
        adaptedNext,
      });
    }
    if (debugMode) console.log(videoId, { playerJSON, adaptedNext, nextJSON });
    await wait(config.SLEEP_TIME);
    return {
      player: removeTrashData(playerJSON),
      adaptedNext,
    };
  }

  function getVideoIds(ad) {
    const adText = JSON.stringify(ad);
    const videoIds = [...adText.matchAll(config.REGEX_BOOK.findVideoId)].map((match) => match[1]);
    return [...new Set(videoIds)];
  }

  async function adsQueue() {
    if (!canProcessAdsQueue()) return;
    context.adsQueueCanBeProcess.inProcess = true;
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
    context.adsQueueCanBeProcess.inProcess = false;
  }

  async function adProcess(ad) {
    if (debugMode) console.log({ ad });
    let videoIds = [];
    if (ad.isReel) {
      const requestParams = getReelAdRequestParams(ad.adsData);
      if (context.adsDone.has(requestParams.videoId)) return;
      ad.adsData = await getReelAd(requestParams);
      videoIds = [requestParams.videoId];
    } else {
      videoIds = getVideoIds(ad.adsData);
    }
    if (debugMode) console.log({ videoIds });
    ad.videosData = {};
    for (const videoId of videoIds) {
      if (context.adsDone.has(ad.videoId)) continue;
      ad.videosData[videoId] = await getVideoData(videoId);
      context.adsDone.add(videoId);
    }
    if (!Object.keys(ad.videosData).length) return;
    sendAd({ ad, metadata: context.metadata });
  }

  const context = {
    adsQueueCanBeProcess: {},
    requestData: {},
    dynamicAdapterResource: null,
    metadata: null,
    exceptionHandler: ExceptionHandler(),
    adsList: [],
    adsDone: new Set(),
  };

  async function asyncStart() {
    try {
      await asyncPageLoad();
      await wait(config.DEEP_SLEEP_TIME);
      setMetadata();
      context.adsQueueCanBeProcess.asyncStart = true;
      adsQueue();
    } catch (error) {
      sendError(error);
    }
  }

  function syncStart() {
    try {
      blocker();
      mockRequest();
      getDynamicAdapterResource();
      sendAnalytics();
      setInterval(sendPing, 1000);
    } catch (error) {
      sendError(error);
    }
  }

  syncStart();
  asyncStart();
  return true;
}
