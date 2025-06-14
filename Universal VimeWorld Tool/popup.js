document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const toggleSwitch2 = document.getElementById("toggleSwitch2");
  const toggleSwitch3 = document.getElementById("toggleSwitch3");

  // Загрузка сохраненного состояния тумблера из chrome.storage
  chrome.storage.sync.get("isEnabled", (data) => {
    toggleSwitch.checked = data.isEnabled || false;
  });

  chrome.storage.sync.get("isEnabled2", (data) => {
    toggleSwitch2.checked = data.isEnabled2 || false;
  });

  chrome.storage.sync.get("isEnabled3", (data) => {
    toggleSwitch3.checked = data.isEnabled3 || false;
  });

  // Сохранение состояния тумблера при переключении
  toggleSwitch.addEventListener("change", () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ isEnabled });
  });

  toggleSwitch2.addEventListener("change", () => {
    const isEnabled2 = toggleSwitch2.checked;
    chrome.storage.sync.set({ isEnabled2 });
  });


  toggleSwitch3.addEventListener("change", () => {
    const isEnabled3 = toggleSwitch3.checked;
    chrome.storage.sync.set({ isEnabled3 });
  });
});