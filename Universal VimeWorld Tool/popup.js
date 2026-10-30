document.addEventListener("DOMContentLoaded", () => {

  const tokenInput = document.getElementById("tokenInput");
  const saveTokenBtn = document.getElementById("saveToken");
  const tokenStatus = document.getElementById("tokenStatus");
  const toggleVisibilityBtn = document.getElementById("toggleTokenVisibility"); 

  async function validateToken(rawValue, save = false) {
    if (!rawValue) {
      showStatus("Введите токен", "red");
      return;
    }

    let token = rawValue;
    if (rawValue.includes("/token/")) {
      token = rawValue.split("/token/")[1].split("/")[0].split("?")[0];
    }

    showStatus("Проверка...", "gray");

    try {
      const response = await fetch(`https://api.vimeworld.com/misc/token/${token}`);
      const data = await response.json();

      if (data.valid && data.type === "DEV") {
        if (save) {
          chrome.storage.sync.set({ "developerToken": token }, () => {
            tokenInput.value = token;
            showStatus("Токен DEV сохранен!", "#4caf50");
          });
        } else {
          showStatus("Токен активен и валиден!", "#4caf50");
        }
      } else if (data.valid && data.type !== "DEV") {
        showStatus("❌ Ошибка: Нужен тип DEV, а не " + data.type, "orange");
      } else {
        showStatus("❌ Невалидный токен", "red");
      }
    } catch (e) {
      showStatus("Ошибка подключения к API", "red");
    }
  }

  if (toggleVisibilityBtn) {
    toggleVisibilityBtn.addEventListener("click", () => {
      if (tokenInput.type === "password") {
        tokenInput.type = "text";
        toggleVisibilityBtn.textContent = "🙈"; 
        toggleVisibilityBtn.style.opacity = "1";
      } else {
        tokenInput.type = "password";
        toggleVisibilityBtn.textContent = "👁️"; 
        toggleVisibilityBtn.style.opacity = "0.7";
      }
      
      validateToken(tokenInput.value.trim(), false);
    });
  }

  // Сохранение токена
  if (saveTokenBtn) {
    saveTokenBtn.addEventListener("click", () => {
      validateToken(tokenInput.value.trim(), true);
    });
  }

  // Загрузка текущего токена из памяти
  chrome.storage.sync.get("developerToken", (data) => {
    if (data.developerToken) {
      tokenInput.value = data.developerToken;
    }
  });

  function showStatus(text, color) {
    tokenStatus.textContent = text;
    tokenStatus.style.color = color;
  }

  // Элементы интерфейса
  const toggleSwitch  = document.getElementById("toggleSwitch");
  const toggleSwitch2 = document.getElementById("toggleSwitch2");
  const toggleSwitch3 = document.getElementById("toggleSwitch3");
  const toggleNotifs  = document.getElementById("toggleNotifications");
  const toggleAutoReload = document.getElementById("toggleAutoReload"); 
  const volumeSlider  = document.getElementById("volumeSlider");

  const toggleUnmuteTime = document.getElementById("toggleUnmuteTime");
  const toggleServerInfo = document.getElementById("toggleServerInfo");
  const toggleCompactMode = document.getElementById("toggleCompactMode");
  const toggleOnlineStatus = document.getElementById("toggleOnlineStatus");
  const toggleDictHighlight = document.getElementById("toggleDictHighlight"); 
  const toggleHeads = document.getElementById("toggleHeads");
  const dictFuzzyDepthInput = document.getElementById("dictFuzzyDepth"); 

  // Кнопки сброса
  const resetButtons = document.getElementById("resetButtons");
  const resetState   = document.getElementById("resetState");

  function updateDependentControls(isNotifsEnabled) {
    const autoReloadContainer = document.getElementById("autoReloadContainer");
    const volumeContainer = document.getElementById("volumeContainer");

    if (toggleAutoReload) toggleAutoReload.disabled = !isNotifsEnabled;
    if (volumeSlider) volumeSlider.disabled = !isNotifsEnabled;

    if (autoReloadContainer) {
      autoReloadContainer.style.opacity = isNotifsEnabled ? "1" : "0.5";
      autoReloadContainer.style.pointerEvents = isNotifsEnabled ? "auto" : "none";
    }
    if (volumeContainer) {
      volumeContainer.style.opacity = isNotifsEnabled ? "1" : "0.5";
      volumeContainer.style.pointerEvents = isNotifsEnabled ? "auto" : "none";
    }
  }

  // Загрузка состояний из хранилища
  chrome.storage.sync.get(
    { 
      isEnabled: false, 
      isEnabled2: true, 
      isEnabled3: true,
      isNotifsEnabled: false,
      isAutoReloadEnabled: false, 
      volumeLevel: 30,
      isUnmuteTimeEnabled: true,
      isServerInfoEnabled: true,
      isCompactModeEnabled: true,
      isOnlineStatusEnabled: true,
      isDictHighlightEnabled: true,
      isHeadsEnabled: true,
      isDictFuzzyDepth: 3
    },
    (data) => {
      if (toggleSwitch)   toggleSwitch.checked  = data.isEnabled;
      if (toggleSwitch2)  toggleSwitch2.checked = data.isEnabled2;
      if (toggleSwitch3)  toggleSwitch3.checked = data.isEnabled3;
      
      if (toggleNotifs) {
        toggleNotifs.checked = data.isNotifsEnabled;
        updateDependentControls(data.isNotifsEnabled);
      }
      
      if (toggleAutoReload) toggleAutoReload.checked = data.isAutoReloadEnabled; 
      if (volumeSlider)   volumeSlider.value    = data.volumeLevel;
      if (toggleUnmuteTime) toggleUnmuteTime.checked = data.isUnmuteTimeEnabled;
      if (toggleServerInfo) toggleServerInfo.checked = data.isServerInfoEnabled;
      if (toggleCompactMode) toggleCompactMode.checked = data.isCompactModeEnabled;
      if (toggleOnlineStatus) toggleOnlineStatus.checked = data.isOnlineStatusEnabled;
      if (toggleDictHighlight) toggleDictHighlight.checked = data.isDictHighlightEnabled;
      if (toggleHeads) toggleHeads.checked = data.isHeadsEnabled;
      if (dictFuzzyDepthInput) dictFuzzyDepthInput.value = data.isDictFuzzyDepth; 
    }
  );

  // Слушатели для сохранения изменений
  const setupToggle = (element, key) => {
    if (element) {
      element.addEventListener("change", () => {
        chrome.storage.sync.set({ [key]: element.checked });
      });
    }
  };

  setupToggle(toggleSwitch, "isEnabled");
  setupToggle(toggleSwitch2, "isEnabled2");
  setupToggle(toggleSwitch3, "isEnabled3");
  setupToggle(toggleAutoReload, "isAutoReloadEnabled");
  setupToggle(toggleUnmuteTime, "isUnmuteTimeEnabled");
  setupToggle(toggleServerInfo, "isServerInfoEnabled");
  setupToggle(toggleCompactMode, "isCompactModeEnabled");
  setupToggle(toggleOnlineStatus, "isOnlineStatusEnabled");
  setupToggle(toggleDictHighlight, "isDictHighlightEnabled");
  setupToggle(toggleHeads, "isHeadsEnabled");
  
  if (toggleNotifs) {
    toggleNotifs.addEventListener("change", () => {
      chrome.storage.sync.set({ isNotifsEnabled: toggleNotifs.checked });
      updateDependentControls(toggleNotifs.checked);
    });
  }

  const previewAudio = new Audio(chrome.runtime.getURL("notification.mp3"));

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      chrome.storage.sync.set({ volumeLevel: parseInt(volumeSlider.value, 10) });
    });

    volumeSlider.addEventListener("change", () => {
      const volumeValue = parseInt(volumeSlider.value, 10) / 100;
      
      previewAudio.volume = volumeValue;
      previewAudio.currentTime = 0;  
      
      previewAudio.play().catch(e => console.error("Ошибка превью звука:", e));
    });
  }

  // Слушатель для числового инпута глубины поиска
  if (dictFuzzyDepthInput) {
    dictFuzzyDepthInput.addEventListener("change", () => {
      let val = parseInt(dictFuzzyDepthInput.value, 10);
      if (isNaN(val) || val < 0) val = 0;
      if (val > 10) val = 10;
      dictFuzzyDepthInput.value = val; 
      chrome.storage.sync.set({ isDictFuzzyDepth: val });
    });
  }

  function runInActiveTab(fn) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs?.[0]?.id;
      if (!tabId) return;
      chrome.scripting.executeScript({
        target: { tabId },
        func: fn,
      });
    });
  }

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

  // Логика кастомного фона
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const resetCustomBgBtn = document.getElementById("resetCustomBg");
  const bgStatus = document.getElementById("bgStatus");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      if (fileInput) fileInput.click();
    });
  }

  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 20 * 1024 * 1024) {
        if (bgStatus) {
          bgStatus.textContent = "Файл слишком большой! (Макс. 20МБ)";
          bgStatus.style.color = "#ff6969";
        }
        fileInput.value = "";
        return;
      }

      if (bgStatus) {
        bgStatus.textContent = "Загрузка...";
        bgStatus.style.color = "gray";
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        
        chrome.storage.local.set({ "customLocalBg": base64Image }, () => {
          if (bgStatus) {
            bgStatus.textContent = "Файл успешно загружен!";
            bgStatus.style.color = "#4caf50";
          }
        });
      };
      reader.readAsDataURL(file); 
    });
  }

  // Удаление фона
  if (resetCustomBgBtn) {
    resetCustomBgBtn.addEventListener("click", () => {
      chrome.storage.local.remove("customLocalBg", () => {
        if (fileInput) fileInput.value = "";
        if (bgStatus) {
          bgStatus.textContent = "Фон удален";
          bgStatus.style.color = "#1ecc35";
        }
      });
    });
  }
});