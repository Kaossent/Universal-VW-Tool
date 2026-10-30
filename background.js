chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.isEnabled || changes.isEnabled2) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
         chrome.tabs.reload(tabs[0].id);
      }
    });
  }
});

const CP_API_URL = "https://cp.vimeworld.com/api/staff/reports?onlyOpen=true";
const LEGACY_URL = "https://legacy-cp.vimeworld.com/moder/reports";
const LEGACY_HEADERS = {
    "Accept": "*/*",
    "Referer": "https://legacy-cp.vimeworld.com/moder/reports",
    "Origin": "https://legacy-cp.vimeworld.com",
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
};

async function getAuthToken() {
    try {
        if (chrome.cookies) {
            const cookie = await chrome.cookies.get({ url: "https://cp.vimeworld.com", name: "vw-auth-token" });
            if (cookie && cookie.value) return cookie.value;
        }
    } catch (e) {
        // cookies api fallback
    }
    return null;
}

async function fetchReportIds() {
    console.log("-> 1. Вызов fetchReportIds...");
    // 1. Попытка запроса через актуальный JSON API личного кабинета cp.vimeworld.com
    try {
        const token = await getAuthToken();
        const headers = { "Accept": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await fetch(CP_API_URL, {
            method: 'GET',
            headers,
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.success && data.response && Array.isArray(data.response.items)) {
                const ids = data.response.items.map(item => String(item.id));
                console.log(`-> JSON API cp.vimeworld.com вернул ${ids.length} репортов.`);
                return new Set(ids);
            }
        }
        console.warn(`-> JSON API вернул статус ${response.status}, пробую резервный метод...`);
    } catch (apiError) {
        console.warn("-> Ошибка при обращении к cp.vimeworld.com/api:", apiError);
    }

    // 2. Резервный запрос (legacy CP)
    try {
        const response = await fetch(LEGACY_URL, {
            method: 'GET',
            headers: LEGACY_HEADERS,
            credentials: 'include' 
        });
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const htmlText = await response.text();
        console.log("-> 3. HTML получен, отправляю на парсинг...");

        if (!(await chrome.offscreen.hasDocument())) {
            console.log("-> 4. Offscreen-документ не найден, создаю...");
            await chrome.offscreen.createDocument({
                url: 'offscreen.html',
                reasons: ['AUDIO_PLAYBACK', 'DOM_PARSER'],
                justification: 'Парсинг HTML и воспроизведение звука'
            });
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const ids = await chrome.runtime.sendMessage({
            type: "PARSE_HTML",
            html: htmlText
        });
        if (!Array.isArray(ids)) throw new Error("Offscreen-документ вернул не массив.");

        console.log(`-> 5. Offscreen-документ вернул ${ids.length} ID.`);
        return new Set(ids);

    } catch (error) {
        console.error("--- КРИТИЧЕСКАЯ ОШИБКА (fetchReportIds) ---", error.message);
        return null;
    }
}

async function checkReports() {
    console.log("START: Проверка репортов...");

    const settings = await chrome.storage.sync.get({ 
        isNotifsEnabled: false,
        volumeLevel: 30,
        isAutoReloadEnabled: false
    });

    if (!settings.isNotifsEnabled) {
        console.log("END: Уведомления отключены. Фоновые запросы остановлены.");
        return;
    }

    const currentReportsSet = await fetchReportIds();
    if (currentReportsSet === null) {
        console.log("END: Проверка не удалась (fetchReportIds вернул null).");
        return; 
    }

    const data = await chrome.storage.local.get('knownReports');
    const knownReportsSet = new Set(data.knownReports || []);
    
    const newReports = [];
    currentReportsSet.forEach(id => {
        if (!knownReportsSet.has(id)) {
            newReports.push(id);
        }
    });

    if (newReports.length > 0) {
        console.log(`END: Найдены новые репорты (${newReports.length} шт.):`, newReports);
        
        console.log(`Проигрываю звук (Громкость: ${settings.volumeLevel}%)`);
        await playNotificationSound(settings.volumeLevel);

        if (settings.isAutoReloadEnabled) {
            console.log("Авто-перезагрузка включена. Перезагружаю вкладку...");
            await reloadVimeWorldTab();
        }

        await chrome.storage.local.set({ knownReports: Array.from(currentReportsSet) });
    
    } else {
        console.log("END: Новых репортов нет.");
        await chrome.storage.local.set({ knownReports: Array.from(currentReportsSet) });
    }
}

async function playNotificationSound(volumeLevel) {
    const volumeValue = parseFloat(volumeLevel) / 100;
    if (!(await chrome.offscreen.hasDocument())) {
         await chrome.offscreen.createDocument({
            url: 'offscreen.html',
            reasons: ['AUDIO_PLAYBACK', 'DOM_PARSER'],
            justification: 'Парсинг HTML и воспроизведение звука'
        });
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    chrome.runtime.sendMessage({ 
        type: "PLAY_SOUND", 
        volume: volumeValue
    });
}

async function reloadVimeWorldTab() {
    try {
        const tabs = await chrome.tabs.query({ url: [
            "https://cp.vimeworld.com/staff/reports*",
            "https://legacy-cp.vimeworld.com/moder/reports*"
        ] });
        
        if (tabs.length > 0) {
            for (const tab of tabs) {
                 await chrome.tabs.reload(tab.id);
                 console.log(`Вкладка ${tab.id} (${tab.url}) успешно перезагружена.`);
            }
        } else {
            console.log("Вкладки с репортами не найдены, перезагрузка не выполнена.");
        }
    } catch (e) {
        console.error("Ошибка при перезагрузке вкладки:", e);
    }
}

chrome.runtime.onStartup.addListener(() => {
    checkReports();
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.create('reportChecker', {
        delayInMinutes: 0.1,
        periodInMinutes: 0.1
    });
    checkReports();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'reportChecker') {
        checkReports();
    }
});
