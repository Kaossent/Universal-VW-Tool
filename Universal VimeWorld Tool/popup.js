document.addEventListener("DOMContentLoaded", () => {
  // Переключатели
  const toggleSwitch  = document.getElementById("toggleSwitch");
  const toggleSwitch2 = document.getElementById("toggleSwitch2");
  const toggleSwitch3 = document.getElementById("toggleSwitch3");

  // Кнопки
  const resetButtons = document.getElementById("resetButtons");
  const resetState   = document.getElementById("resetState");

  // Загрузка состояний
  chrome.storage.sync.get(
    { isEnabled: false, isEnabled2: false, isEnabled3: false },
    (data) => {
      if (toggleSwitch)  toggleSwitch.checked  = data.isEnabled;
      if (toggleSwitch2) toggleSwitch2.checked = data.isEnabled2;
      if (toggleSwitch3) toggleSwitch3.checked = data.isEnabled3;
    }
  );

  // Сохранение состояний
  if (toggleSwitch) {
    toggleSwitch.addEventListener("change", () => {
      chrome.storage.sync.set({ isEnabled: toggleSwitch.checked });
    });
  }

  if (toggleSwitch2) {
    toggleSwitch2.addEventListener("change", () => {
      chrome.storage.sync.set({ isEnabled2: toggleSwitch2.checked });
    });
  }

  if (toggleSwitch3) {
    toggleSwitch3.addEventListener("change", () => {
      chrome.storage.sync.set({ isEnabled3: toggleSwitch3.checked });
    });
  }

  // Для выполнения кода в активной вкладке
  function runInActiveTab(fn) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs?.[0]?.id;
      if (!tabId) return;

      if (chrome.scripting && chrome.scripting.executeScript) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: fn,
        });
      } else if (chrome.tabs.executeScript) {
        chrome.tabs.executeScript(tabId, { code: `(${fn})();` });
      }
    });
  }

  // Кнопки сброса
  if (resetButtons) {
    resetButtons.addEventListener("click", () => {
      runInActiveTab(() => {
        localStorage.removeItem("muteCalcButtonsOrder");
        location.reload();
      });
    });
  }

  if (resetState) {
    resetState.addEventListener("click", () => {
      runInActiveTab(() => {
        localStorage.removeItem("muteCalcState");
        location.reload();
      });
    });
  }
});
