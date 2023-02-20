chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    console.log(details);
  },
  {
    urls: ['<all_urls>'],
  },
  ['blocking']
);
