const informationLayer = qs$('#informationLayer');
const donateMenuIcon = qs$('#donateMenuIcon');
const refreshMenuIcon = qs$('#refreshMenuIcon');
const offMenuIcon = qs$('#offMenuIcon');
const offMenu = qs$('#offMenu');
const adsBlockCount = qs$('#adsBlockCount');
const thisPageUrl = qs$('#thisPageUrl');
const thisWebsiteCheckbox = qs$('#thisWebsiteCheckbox');
const thisPageCheckbox = qs$('#thisPageCheckbox');
const filteringModeCheckbox = qs$('#filteringModeCheckbox');
const timeDuration = qs$('#timeDuration');
const dataSaved = qs$('#dataSaved');
const loadFasterPercent = qs$('#loadFasterPercent');
const blockManuallyOpenBtn = qs$('#blockManuallyOpenBtn');
const optionPopupsCookie = qs$('#optionPopupsCookie');
const optionBlockLocal = qs$('#optionBlockLocal');
const optionPopupsSocial = qs$('#optionPopupsSocial');
const optionBlockTracker = qs$('#optionBlockTracker');
const darkModeCheckbox = qs$('#darkModeCheckbox');
const reportIssueButton = qs$('#reportIssueButton');
const reviewButton = qs$('#reviewButton');
const facebookShare = qs$('#facebookShare');
const xShare = qs$('#xShare');
const changeLog = qs$('#changeLog');
const offLayer = qs$('#offLayer');
const offLayerIcon = qs$('#offLayerIcon');
const offTimer = qs$('#offTimer');
const disableLayer = qs$('#disableLayer');
const loadingLayer = qs$('#loadingLayer');
const blockManuallySelector = qs$('#blockManuallySelector');
const blockManuallyResetBtn = qs$('#blockManuallyResetBtn');

let currentTab, data, countdownTimer;

async function getCurrentTab() {
  const [currentTab] = await tabs.query({
    active: true,
    currentWindow: true,
  });
  return currentTab;
}

async function getCurrentCompletedTab() {
  while (true) {
    const currentTab = await getCurrentTab();
    if (currentTab.status === 'complete' || currentTab.url) return currentTab;
    await waitForSeconds(0.1);
  }
}

async function init() {
  if (localStorage.getItem('dark-mode') === '1') {
    darkModeCheckbox.checked = true;
    dom.cl.add(dom.body, 'dark-mode');
  }

  showLoadingAnimation();
  currentTab = await getCurrentCompletedTab();

  try {
    let url = new URL(currentTab.url);
    currentTab.hostname = url.hostname.replace(/^(www\.)/, '') || '';
    currentTab.path = url.pathname || '';
  } catch (e) {
    return false;
  }

  if (currentTab.url.startsWith('chrome') || currentTab.url.startsWith('https://chromewebstore.google.com') || currentTab.url.startsWith('edge') || currentTab.url.startsWith('https://microsoftedge.microsoft.com')) {
    dom.cl.remove(disableLayer, 'd-none');
    dom.cl.add(informationLayer, 'no-scroll');
    hideLoadingAnimation();
    return false;
  }

  await updateData();
  const actionCount = await calculateActionCount();
  dom.on(thisWebsiteCheckbox, 'change', async (e) => {
    await sendMessage('blocker.updateStatus', {
      subject: currentTab.url,
      isUrl: false,
      status: { off: !e.target.checked, super: data.hostnameStatus.super },
    });
    await updateData();
  });

  dom.on(thisPageCheckbox, 'change', async (e) => {
    await sendMessage('blocker.updateStatus', {
      subject: currentTab.url,
      isUrl: true,
      status: { off: !e.target.checked, super: data.urlStatus.super },
    });
    await updateData();
  });

  dom.on(filteringModeCheckbox, 'change', async (e) => {
    await sendMessage('blocker.updateStatus', {
      subject: currentTab.url,
      isUrl: false,
      status: { off: data.hostnameStatus.off, super: e.target.checked },
    });
    await updateData();
  });

  dom.on(optionPopupsCookie, 'change', async () => {
    await sendMessage('blocker.toggleBlockCookiePopups', {});
    await updateData();
  });

  dom.on(darkModeCheckbox, 'change', async () => {
    const isDarkMode = dom.cl.toggle(dom.body, 'dark-mode');
    localStorage.setItem('dark-mode', isDarkMode ? '1' : '0');
  });

  dom.on(optionPopupsSocial, 'change', async () => {
    await sendMessage('blocker.toggleBlockSocial', {});
    await updateData();
  });

  dom.on(optionBlockTracker, 'change', async () => {
    await sendMessage('blocker.toggleBlockTrackerPopups', {});
    await updateData();
  });

  dom.on(optionBlockLocal, 'change', async () => {
    await sendMessage('blocker.toggleRegionsBlocking', {});
    await updateData();
  });

  dom.on(blockManuallyResetBtn, 'click', async () => {
    await sendMessage('blocker.clearAllSelectors', { hostname: currentTab.hostname });
    reload(currentTab.id, true);
    await updateData();
  });

  dom.on(window, 'click', (e) => {
    if (!offMenuIcon.parentElement.contains(e.target)) {
      dom.cl.add(offMenu, 'd-none');
    }
  });

  dom.on(refreshMenuIcon, 'click', () => {
    reload(currentTab.id, true);
  });

  dom.on(donateMenuIcon, 'click', () => {
    window.open(POPUP_CONFIG.URLS.DONATE);
  });

  dom.on(facebookShare, 'click', () => {
    window.open(POPUP_CONFIG.URLS.FACEBOOK);
  });

  dom.on(xShare, 'click', () => {
    window.open(POPUP_CONFIG.URLS.X);
  });

  dom.on(offMenuIcon, 'click', () => {
    dom.cl.toggle(offMenu, 'd-none');
  });

  dom.on(offMenu, 'click', (e) => {
    let time = dom.attr(e.target, 'data-time-min');
    if (!time) return;
    sendMessage('blocker.startScheduledTurnOff', { time });
    setCountdownTimer(time * 60_000 + Date.now());
  });

  dom.on(blockManuallyOpenBtn, 'click', () => {
    sendMessage('blocker.startElementBlocker', {});
    window.close();
  });

  dom.on(offLayerIcon, 'click', async () => {
    await sendMessage('blocker.clearScheduledTurnOff', {});
    toggleOffLayer();
    removeCountdownTimer();
    await updateData();
  });

  dom.on(reportIssueButton, 'click', () => {
    window.open(POPUP_CONFIG.URLS.REPORT);
  });

  dom.on(reviewButton, 'click', () => {
    window.open(POPUP_CONFIG.URLS.REVIEW);
  });

  dom.on(changeLog, 'click', () => {
    window.open(POPUP_CONFIG.URLS.CHANGE_LOG);
  });
  executeTimingScript(actionCount);
}

async function calculateActionCount() {
  let actionCount = await action.getBadgeText({ tabId: currentTab.id });
  actionCount = Number(actionCount);
  actionCount = actionCount > 0 ? actionCount : 0;
  return actionCount;
}

function toggleOffLayer() {
  if (dom.cl.has(offLayer, 'd-none')) return showOffLayer();
  return hideOffLayer();
}

function showOffLayer() {
  dom.cl.remove(offLayer, 'd-none');
  dom.cl.add(informationLayer, 'no-scroll');
  dom.cl.add(offMenu, 'd-none');
}

function hideOffLayer() {
  dom.cl.add(offLayer, 'd-none');
  dom.cl.remove(informationLayer, 'no-scroll');
}

function showLoadingAnimation() {
  dom.cl.add(loadingLayer, 'd-flex');
  dom.cl.remove(loadingLayer, 'd-none');
  dom.cl.add(informationLayer, 'd-none');
}

function hideLoadingAnimation() {
  dom.cl.remove(loadingLayer, 'd-flex');
  dom.cl.add(loadingLayer, 'd-none');
  dom.cl.remove(informationLayer, 'd-none');
}

async function updateData() {
  data = await sendMessage('blocker.getPopupData', { url: currentTab.url });
  const actionCount = await calculateActionCount();
  adsBlockCount.innerText = actionCount;
  thisPageUrl.innerText = currentTab.path;
  filteringModeCheckbox.checked = data.hostnameStatus.super;
  thisWebsiteCheckbox.checked = !data.hostnameStatus.off;
  thisPageCheckbox.checked = !data.urlStatus.off;
  optionBlockLocal.checked = data.hasDisabledRegions;
  optionPopupsSocial.checked = data.hasDisabledSocial;
  optionPopupsCookie.checked = data.hasDisabledCookiePopups;
  optionBlockTracker.checked = data.hasDisabledTracker;
  blockManuallySelector.innerText = data.blockedElementsCount;
  executeTimingScript(actionCount);
  if (data.scheduledOff.timestamp === null) {
    hideOffLayer();
  } else {
    setCountdownTimer(Number(data.scheduledOff.timestamp));
  }
  hideLoadingAnimation();
}

function getTimingSavedInfo(actionCount) {
  if (window.getTimingSavedInfoResult) return window.getTimingSavedInfoResult;
  let time = 0,
    data = 0,
    load = 0,
    success = false;
  const result = () => JSON.stringify({ time, data, load, success });
  if (document.readyState !== 'complete') return result();
  success = true;
  if (actionCount <= 0) return result();
  const speedNetworks = {
    'slow-2g': 10,
    '2g': 50,
    '3g': 300,
    '4g': 1500,
  };
  const randomBetweenTwoNumbers = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  const percentageChange = (a, b) => (b / a) * 100 - 100;
  const delay = randomBetweenTwoNumbers(400, 600);
  const kb = randomBetweenTwoNumbers(30, 60);
  const userNetworkSpeed = speedNetworks[navigator.connection.effectiveType] ?? 1000;
  const domComplete = performance.getEntriesByType('navigation')[0].domComplete;
  data = actionCount * kb + randomBetweenTwoNumbers(50, 200);
  time = ((kb / userNetworkSpeed) * 1000 + delay) * actionCount;
  load = percentageChange(domComplete, time + domComplete);
  return (window.getTimingSavedInfoResult = result());
}

function setTimingSavedInfo({ time, data, load }) {
  data = data < 1 ? 0 : data > 9999 ? '+9999' : Math.floor(data);
  load = load < 1 ? 0 : load > 1000 ? '+1000' : Math.floor(load);
  time = time / 100;
  time = time < 1 ? 0 : time > 60 ? `+60` : Math.floor(time);
  timeDuration.innerHTML = `${time} ${i18n$('secDuration')}`;
  dataSaved.innerHTML = `${data} KB`;
  loadFasterPercent.innerHTML = `${load}%`;
}

function executeTimingScript(actionCount) {
  browser.scripting.executeScript(
    {
      args: [actionCount],
      target: { tabId: currentTab.id },
      func: getTimingSavedInfo,
    },
    (bundleInfo) => {
      try {
        const { time, data, load, success } = JSON.parse(bundleInfo[0].result);
        if (success) return setTimingSavedInfo({ time, data, load });
      } catch {}
      setTimeout(() => {
        executeTimingScript(actionCount);
      }, 500);
    },
  );
}

function reload(id, enable) {
  if (enable) tabs.reload(id);
}

function updateCountdownTimer(timestamp) {
  let distance = timestamp - Date.now();
  let hours = addZeroTime(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  let minutes = addZeroTime(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  let seconds = addZeroTime(Math.floor((distance % (1000 * 60)) / 1000));
  offTimer.innerHTML = `${hours}:${minutes}:${seconds}`;
  if (distance < 0) removeCountdownTimer();
}

function setCountdownTimer(timestamp) {
  toggleOffLayer();
  updateCountdownTimer(timestamp);
  countdownTimer = setInterval(() => updateCountdownTimer(timestamp), 1000);
}

function removeCountdownTimer() {
  updateData();
  clearInterval(countdownTimer);
  offTimer.innerHTML = '00:00:00';
}

init();
