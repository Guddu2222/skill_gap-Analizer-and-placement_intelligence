const browser = self.browser instanceof Object && self.browser instanceof Element ? self.browser : self.chrome;
const i18n = browser.i18n;
const tabs = browser.tabs;
const runtime = browser.runtime;
const action = browser.action;

function sendMessage(eventName, params) {
  return new Promise((resolve, reject) => {
    let i = 50;
    const send = () => {
      if (!runtime?.id) return;
      runtime
        .sendMessage({ eventName, params })
        .then((response) => {
          if (!response) throw 'no response';
          if (response?.error) throw response?.error;
          resolve(response);
        })
        .catch((reason) => {
          i -= 1;
          if (i <= 0) {
            reject(reason);
          } else {
            setTimeout(send, 100);
          }
        });
    };
    send();
  });
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

function waitForSeconds(seconds = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1_000);
  });
}

function addZeroTime(a) {
  return a < 10 ? `0${a}` : a;
}
