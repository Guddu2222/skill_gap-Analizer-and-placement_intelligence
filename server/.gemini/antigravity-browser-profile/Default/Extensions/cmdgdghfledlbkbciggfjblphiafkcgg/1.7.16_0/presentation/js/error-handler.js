function sendError(error) {
  sendMessage('popup.error', {
    error: getErrorDetail(error),
  });
}
window.addEventListener('error', (event) => {
  sendError(event.error);
});
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  sendError(event.reason);
});
