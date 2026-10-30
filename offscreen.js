chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    
    if (msg.type === "PLAY_SOUND") {
        console.log(`[Offscreen] Получена команда PLAY_SOUND (Громкость: ${msg.volume})`);
        const audio = document.getElementById('notification-sound');
        
        if (audio) {
            audio.volume = msg.volume;
            audio.currentTime = 0;
            audio.play().catch(e => console.warn("[Offscreen] Не удалось воспроизвести звук:", e));
        } else {
            console.error("[Offscreen] Аудио-тег 'notification-sound' не найден!");
        }
        
        return false;
    
    } else if (msg.type === "PARSE_HTML") {
        console.log("[Offscreen] Получена команда PARSE_HTML");
        try {
            const parser = new DOMParser(); 
            const doc = parser.parseFromString(msg.html, 'text/html');
            const reportRows = doc.querySelectorAll('tr[id^="row_report"]');
            const ids = Array.from(reportRows).map(tr => tr.id);
            
            console.log(`[Offscreen] Парсинг успешен, найдено ${ids.length} ID.`);

            sendResponse(ids); 
        
        } catch (e) {
            console.error("[Offscreen] Ошибка парсинга:", e);
            sendResponse(null);
        }
        
        return true; 
    }
});