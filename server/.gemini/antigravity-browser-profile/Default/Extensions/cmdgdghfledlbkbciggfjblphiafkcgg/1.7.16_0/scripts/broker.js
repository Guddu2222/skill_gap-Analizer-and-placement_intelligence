const browser = self.browser instanceof Object && self.browser instanceof Element ? self.browser : self.chrome;
const runtime = browser.runtime;
window.addEventListener('message', (message) => {
  if (!runtime?.id || message.data?.sender !== 'sblock' || !message.data?.eventName) return;
  runtime.sendMessage({
    eventName: message.data.eventName,
    params: message.data.params,
  });
});
runtime.onMessage.addListener((message) => {
  window.postMessage({ sender: 'sblock', message }, '*');
});
