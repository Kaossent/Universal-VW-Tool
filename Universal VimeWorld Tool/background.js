chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.isEnabled || changes.isEnabled2 || changes.isEnabled3) {
    // Получаем активную вкладку и перезагружаем ее
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.tabs.reload(tabId);
    });
  }
});
