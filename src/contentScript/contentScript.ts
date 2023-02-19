chrome.runtime.sendMessage('Hello from content script!', (response) => {
  console.log('Response from background script: ', response);
});
