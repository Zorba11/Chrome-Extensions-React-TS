chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Message from content script: ', msg);
  console.log(sender);
  sendResponse('From the background script');
});
