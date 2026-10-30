// Inject main_scroll.js into MAIN world as immediate fallback
try {
  const scrollScript = document.createElement('script');
  scrollScript.src = chrome.runtime.getURL('main_scroll.js');
  (document.head || document.documentElement).appendChild(scrollScript);
} catch (e) {}

// Prevent page from jumping to top when opening/closing report modals (isolated context fallback)
(function setupScrollPreservation() {
  const originalScrollTo = window.scrollTo;
  window.scrollTo = function(...args) {
    let targetY = null;
    if (typeof args[0] === 'number') {
      targetY = args[1] !== undefined ? args[1] : args[0];
    } else if (typeof args[0] === 'object' && args[0] !== null) {
      targetY = args[0].top;
    }

    if (targetY === 0) {
      const isReportOpen = window.location.pathname.includes('/reports') ||
                           (document.body && document.body.classList.contains('modal-open')) ||
                           document.querySelector('.modal.show');
      if (isReportOpen) {
        return; // Suppress jumping to top
      }
    }

    return originalScrollTo.apply(this, args);
  };
})();

let emojiReplacements = {};
let lastValue = '';
let isOnlineStatusEnabled = true;
let isDictHighlightEnabled = true;
let isHeadsEnabled = true;
let isServerInfoEnabled = true;
let isEnabled3 = true;
let isCompactModeEnabled = true;
let isUnmuteTimeEnabled = true;
let isDictFuzzyDepth = 3;

function syncSettingsFromStorage(data) {
  if (data.isEnabled3 !== undefined) isEnabled3 = Boolean(data.isEnabled3);
  if (data.isOnlineStatusEnabled !== undefined) isOnlineStatusEnabled = Boolean(data.isOnlineStatusEnabled);
  if (data.isHeadsEnabled !== undefined) isHeadsEnabled = Boolean(data.isHeadsEnabled);
  if (data.isCompactModeEnabled !== undefined) isCompactModeEnabled = Boolean(data.isCompactModeEnabled);
  if (data.isUnmuteTimeEnabled !== undefined) isUnmuteTimeEnabled = Boolean(data.isUnmuteTimeEnabled);
  if (data.isServerInfoEnabled !== undefined) isServerInfoEnabled = Boolean(data.isServerInfoEnabled);
  if (data.isDictHighlightEnabled !== undefined) isDictHighlightEnabled = Boolean(data.isDictHighlightEnabled);
  if (data.isDictFuzzyDepth !== undefined) isDictFuzzyDepth = parseInt(data.isDictFuzzyDepth, 10) || 3;
}

const copyrightElement = document.querySelector(".pull-right.copyright");

const link = document.querySelector('a[href="https://www.invisioncommunity.com/"]');
    
if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.innerHTML = `© 2012 - ${currentYear} - <a href="https://vimeworld.com" target="_blank">VimeWorld.com</a>. Made by 
        <a href="https://vimetop.ru/player/Kaossent" target="_blank">Kaossent</a>`;
}

const currentUrl = window.location.href;

if (!currentUrl.includes("forum.vimeworld.com") && !currentUrl.includes("cp.vimeworld.com") && !currentUrl.includes("vimetop.ru")) {
    const style = document.createElement('style');
    style.textContent = 
    `
    table.table {
        table-layout: fixed !important;
        width: 100% !important;
    }
    table.table th:nth-child(1), table.table td:nth-child(1) { width: 70px !important; }
    table.table th:nth-child(2), table.table td:nth-child(2) { width: 135px !important; white-space: nowrap !important; }
    table.table th:nth-child(3), table.table td:nth-child(3),
    table.table th:nth-child(4), table.table td:nth-child(4) { 
        width: auto !important; 
        overflow: hidden !important; 
        text-overflow: ellipsis !important; 
        white-space: nowrap !important; 
    }
    table.table th:nth-child(5), table.table td:nth-child(5) { width: 80px !important; text-align: center !important; }
    table.table th:nth-child(6), table.table td:nth-child(6) { width: 110px !important; padding: 8px 4px !important; }
    
    table.table td:nth-child(6) button, table.table td:nth-child(6) a {
        width: 100% !important;
        display: block !important;
        margin-bottom: 4px !important;
        box-sizing: border-box !important;
    }
    .pagination li:first-child a {
        border-top-left-radius: 10px !important;
        border-bottom-left-radius: 10px !important;
    }

    .pagination li:last-child a {
        border-bottom-right-radius: 10px !important;
        border-top-right-radius: 10px !important;
    }
    
    .panel {
        border-radius: 10px !important;
        margin-top: 25px;
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .container-fluid {
        display: flex;
        justify-content: center;
        background-color: white !important;
        border-radius: 10px !important;
        max-width: 900px !important;
    }

    .panel-footer {
                    background-color: white !important;
                    border-top: white !important;
    }

    .container-fluid li a {
        color: red;
    }

    body {
        display: grid;
        justify-content: center;
    }

    #top_servers_btn {
        background: #64c3e2 !important;
        border-radius: 5px !important;
    }

    button {
        color: white !important;
        border: none !important;
        padding: 6px 13.5px !important;
        border-radius: 5px !important;
        cursor: pointer !important;
    }

    button:hover {
        transform: scale(1.1);
    }

    select.form-control {
        background-color: #12c3d3;
        text-align: center !important;
        font-weight: bold;
        color: white;
        border: none;
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;
    }

    select.form-control:hover {
        background-color: #0e8b96;
    }

    select.form-control:focus {
        outline: none;
        background-color: #0e8b96;
    }

    .btn-warning {
        background-color: rgb(179, 0, 0) !important; 
        color: white !important;
    }
    
    `
    
    document.head.appendChild(style);
}


function initBackground() {
    chrome.storage.sync.get({ isEnabled: true }, (syncData) => {
        if (!syncData.isEnabled) return;

        chrome.storage.local.get(["customLocalBg"], (localData) => {
            let imageUrl = "";

            if (localData.customLocalBg) {
                imageUrl = localData.customLocalBg;
            } else {
                const maxImages = 103;
                const randomNum = Math.floor(Math.random() * maxImages) + 1;
                imageUrl = chrome.runtime.getURL(`backgrounds/${randomNum}.png`);
            }

            applyBackground(imageUrl);
        });
    });
}

if (document.readyState === 'loading') {
    window.addEventListener("DOMContentLoaded", initBackground);
} else {
    initBackground();
}



function applyBackground(url) {
    if (!url) return;
    const currentUrl = window.location.href;
    if (currentUrl.includes("vimetop.ru")) {
        document.querySelector('.hk-pg-wrapper')?.style.setProperty("background", "none", "important");
        document.querySelector('.hk-wrapper')?.style.setProperty("background", "none", "important");
        document.body.style.setProperty("background", "none", "important");
    }

    const s = document.body.style;
    s.setProperty("background-image", `url('${url}')`, "important");
    s.setProperty("background-size", "cover", "important");
    s.setProperty("background-repeat", "no-repeat", "important");
    s.setProperty("background-position", "center center", "important");
    s.setProperty("background-attachment", "fixed", "important");
    document.body.classList.add("has-custom-bg");
}

    document.addEventListener('blur', function(e) {
        if (e.target && e.target.id === 'mr_itime') {
            const currentValue = e.target.value;
            if (currentValue !== lastValue) {
                const sum = calculateSum(currentValue);
                e.target.value = sum;
                lastValue = sum; 
            }
        }
    }, true);

    function calculateSum(input) {
        const numbers = input.split('+').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
        return numbers.reduce((acc, num) => acc + num, 0); 
    }

function startMessagesObserver() {
    const bodyObserver = new MutationObserver(() => {
        const msgs = document.getElementById('mr_messages') || document.querySelector('.modal-body .bg-tertiary, .modal-body div.rounded.p-2');
        if (msgs && !msgs.dataset.dictObserved) {
            msgs.dataset.dictObserved = "true";

            messagesObserverInstance = new MutationObserver((mutations) => {
                if (mutations.some(m => m.addedNodes.length > 0 && (m.addedNodes[0].className === 'dict-highlight' || m.addedNodes[0].className === 'converted-emoji'))) return;
                
                messagesObserverInstance.disconnect();
                convertText();
                highlightDictWords();
                messagesObserverInstance.observe(msgs, { childList: true, subtree: true });
            });
            
            messagesObserverInstance.observe(msgs, { childList: true, subtree: true });
            convertText();
            highlightDictWords(); 
        } else if (!msgs && messagesObserverInstance) {
            messagesObserverInstance.disconnect();
            messagesObserverInstance = null;
        }
    });
    
    bodyObserver.observe(document.body, { childList: true, subtree: true });
}

let dictionaryData = [];

function parseCSV(str) {
    const arr = [];
    let quote = false;
    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

async function loadDictionary() {
    try {
        const url = "https://docs.google.com/spreadsheets/d/1nbhO0hBGmN9WvAoc-pUEDsCTtTPxG8TNj1EM5uRAKPY/export?format=csv&gid=0";
        const res = await fetch(url);
        const text = await res.text();
        
        if (text.includes("<!DOCTYPE html>")) {
            console.error("СЛОВАРЬ: Google Таблица закрыта. Откройте доступ 'Всем, у кого есть ссылка'.");
            return;
        }

        const rows = parseCSV(text);
        if (rows.length < 2) return;

        let headerRowIndex = rows.findIndex(r => r.some(cell => cell.includes("Слово") || cell.includes("Значение")));
        if (headerRowIndex === -1) headerRowIndex = 0; 
        
        const headers = rows[headerRowIndex].map(h => h.trim().toLowerCase());
        
        const wordIdx = headers.findIndex(h => h.includes("слово"));
        const meaningIdx = headers.findIndex(h => h.includes("значение"));
        const notesIdx = headers.findIndex(h => h.includes("примечания"));
        const synIdx = headers.findIndex(h => h.includes("похожие"));

        if (wordIdx === -1) {
            console.error("СЛОВАРЬ: Не найдена колонка 'Слово'.");
            return;
        }

        dictionaryData = rows.slice(headerRowIndex + 1).map(r => ({
            word: r[wordIdx] ? r[wordIdx].toLowerCase().trim() : '',
            meaning: r[meaningIdx] ? r[meaningIdx].trim() : '',
            notes: r[notesIdx] ? r[notesIdx].trim() : '',
            synonyms: r[synIdx] ? r[synIdx].toString().toLowerCase().split(',').map(s => s.trim()).filter(Boolean) : []
        })).filter(item => item.word !== ''); 
        
        console.log(`Словарь загружен! Слов: ${dictionaryData.length}`);

        buildDictRegex();
    } catch (e) {
        console.error("Ошибка загрузки словаря:", e);
    }
}

function searchDictionary(query) {
    query = query.toLowerCase().trim();
    if (!query) return null;

    let match = dictionaryData.find(item => item.word === query);
    if (match) return match;

    match = dictionaryData.find(item => item.synonyms.includes(query));
    if (match) return match;

    match = dictionaryData.find(item => item.synonyms.some(syn => syn.includes(query) || query.includes(syn)));
    
    return match || null;
}

let dictRegex = null;
let dictLookup = [];
let messagesObserverInstance = null;

function buildDictRegex() {
    if (!dictionaryData || dictionaryData.length === 0) return;
    
    let allFuzzyStrings = [];
    dictLookup = [];

    function buildFuzzyPattern(word) {
        let cleanWord = word.trim().toLowerCase();
        
        if (cleanWord.length <= 2) {
            return cleanWord.split('').map(c => {
                if (c === ' ') return '\\s+';
                return c.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '+';
            }).join('');
        }

        let chars = cleanWord.split('');
        let pattern = chars.map(c => {
            if (c === ' ') return '\\s+'; 
            return c.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '+';
        }).join('[^а-яА-ЯёЁa-zA-Z0-9_]*'); 

        pattern += '[а-яА-ЯёЁa-zA-Z0-9_]{0,' + isDictFuzzyDepth + '}';
        
        return pattern;
    }

    dictionaryData.forEach(item => {
        const addWord = (w) => {
            if (!w) return;
            let cleanW = w.toLowerCase().trim();
            if (cleanW.length < 2) return; 

            let color = "#ffccbc";
            if (item.meaning.includes("Оскорбление")) color = "#ff6b6b"; 
            if (item.meaning.includes("Мат")) color = "#ffb74d"; 
            if (item.meaning.includes("Не нарушение") || item.meaning.includes("Не мат")) color = "#81c784"; 
            if (item.meaning.includes("Неуважение")) color = "#b39ddb";

            let data = { meaning: item.meaning, color: color, notes: item.notes };

            let fuzzyStr = buildFuzzyPattern(cleanW);
            
            if (!allFuzzyStrings.includes(fuzzyStr)) {
                allFuzzyStrings.push(fuzzyStr);
                dictLookup.push({ 
                    regex: new RegExp(`^${fuzzyStr}$`, 'i'), 
                    data: data 
                });
            }
        };
        
        addWord(item.word);
        if (item.synonyms) item.synonyms.forEach(addWord);
    });

    allFuzzyStrings.sort((a, b) => b.length - a.length);

    if (allFuzzyStrings.length > 0) {
        dictRegex = new RegExp(`(^|[^а-яА-ЯёЁa-zA-Z0-9_])(${allFuzzyStrings.join('|')})(?=[^а-яА-ЯёЁa-zA-Z0-9_]|$)`, 'gi');
    }
}

function highlightDictWords() {
    const messagesContainer = document.getElementById('mr_messages') || document.querySelector('.modal-body .bg-tertiary, .modal-body div.rounded.p-2');
    if (!messagesContainer) return;

    if (!isDictHighlightEnabled) {
        messagesContainer.querySelectorAll('span.dict-highlight').forEach(span => {
            const text = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(text, span);
        });
        return;
    }
    if (!dictRegex) return;

    const walker = document.createTreeWalker(messagesContainer, NodeFilter.SHOW_TEXT, null, false);
    const nodes = [];
    let node;
    while (node = walker.nextNode()) nodes.push(node);

    nodes.forEach(textNode => {
        const originalText = textNode.nodeValue;
        if (!originalText.trim()) return;

        dictRegex.lastIndex = 0; 
        if (!dictRegex.test(originalText)) return;
        dictRegex.lastIndex = 0; 

        let newHtml = originalText.replace(dictRegex, (match, before, word) => {
            let lowerWord = word.toLowerCase();
            let data = null;
            
            for (let i = 0; i < dictLookup.length; i++) {
                if (dictLookup[i].regex.test(lowerWord)) {
                    data = dictLookup[i].data;
                    break;
                }
            }

            if (!data) return match;

            let notesSafe = data.notes ? data.notes.replace(/"/g, '&quot;') : '';
            let titleAttr = notesSafe ? `${data.meaning} | ${notesSafe}` : data.meaning;
            
            return `${before}<span class="dict-highlight" style="color: ${data.color}; font-weight: bold; border-bottom: 1px dashed ${data.color}; cursor: help;" title="${titleAttr}">${word}</span>`;
        });

        if (newHtml !== originalText) {
            const span = document.createElement('span');
            span.innerHTML = newHtml;
            textNode.parentNode.replaceChild(span, textNode);
        }
    });
}

function convertText() {
    const elements = document.querySelectorAll('#mr_messages, .modal-body .bg-tertiary, .modal-body div.rounded.p-2');

    const mcColors = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#FFAA00', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF'
    };

    elements.forEach(element => {
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let originalText = node.textContent;
                let newText = originalText.replace(/\s+/g, ' ');

                if (/&[0-9a-fk-orR]|&x[0-9a-fA-F]{6}/i.test(newText)) {
                    let parts = newText.split(/(&x[0-9A-Fa-f]{6}|&[0-9a-fA-Fk-oK-OrR])/i);
                    let htmlResult = "";
                    let currentColor = "";
                    let isBold = false;
                    let isItalic = false;
                    let isStrikethrough = false;
                    let isUnderline = false;
                    let isObfuscated = false;

                    parts.forEach(part => {
                        if (!part) return;

                        let lowerPart = part.toLowerCase();

                        if (lowerPart.startsWith('&x') && lowerPart.length === 8) {
                            currentColor = `#${lowerPart.slice(2)}`;
                            isBold = isItalic = isStrikethrough = isUnderline = isObfuscated = false; 
                        } else if (lowerPart.startsWith('&') && lowerPart.length === 2) {
                            let code = lowerPart[1];

                            if (mcColors[code]) { 
                                currentColor = mcColors[code];
                                isBold = isItalic = isStrikethrough = isUnderline = isObfuscated = false; 
                            } 
                            else if (code === 'l') { isBold = true; }
                            else if (code === 'o') { isItalic = true; }
                            else if (code === 'm') { isStrikethrough = true; }
                            else if (code === 'n') { isUnderline = true; }
                            else if (code === 'k') { isObfuscated = true; }
                            else if (code === 'r') { 
                                currentColor = "";
                                isBold = isItalic = isStrikethrough = isUnderline = isObfuscated = false;
                            }
                        } else {
                            let styleStr = "";
                            if (currentColor) styleStr += `color: ${currentColor}; `;
                            if (isBold) styleStr += `font-weight: bold; `;
                            if (isItalic) styleStr += `font-style: italic; `;
                            let textDeco = [];
                            if (isStrikethrough) textDeco.push("line-through");
                            if (isUnderline) textDeco.push("underline");
                            if (textDeco.length > 0) styleStr += `text-decoration: ${textDeco.join(" ")}; `;
                            let classStr = isObfuscated ? ' class="mc-obfuscated"' : '';
                            let dataAttr = isObfuscated ? ` data-len="${part.length}"` : '';

                            if (styleStr || classStr) {
                                htmlResult += `<span${classStr}${dataAttr} style="${styleStr}">${part}</span>`;
                            } else {
                                htmlResult += part;
                            }
                        }
                    });
                    newText = htmlResult;
                }

                for (const [key, value] of Object.entries(emojiReplacements)) {
                    newText = newText.replace(new RegExp(key, 'g'), value);
                }

                if (newText !== originalText.replace(/\s+/g, ' ')) {
                    const newNode = document.createElement('span');
                    newNode.className = 'converted-emoji'; 
                    newNode.innerHTML = newText;
                    element.replaceChild(newNode, node);
                }
            }
        });
    });
}

setInterval(() => {
    const obfElements = document.querySelectorAll('.mc-obfuscated');
    if (obfElements.length === 0) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    
    obfElements.forEach(el => {
        let len = parseInt(el.getAttribute('data-len')) || el.textContent.length;
        let newText = "";
        for (let i = 0; i < len; i++) {
            newText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        el.textContent = newText;
    });
}, 50);

function countCharacters() {
    const inputField = document.getElementById('textInput');
    const countButton = document.getElementById('countButton');
    const text = inputField.value;
    countButton.textContent = `Подсчитать [${text.length}]`;
}

function replaceEngRus() {
    const inputField = document.getElementById('textInput');
    const text = inputField.value;

    const translitMap = {
        'q': 'й', 'w': 'ц', 'e': 'у', 'r': 'к', 't': 'е', 'y': 'н', 'u': 'г', 'i': 'ш', 'o': 'щ', 'p': 'з', 
        'a': 'ф', 's': 'ы', 'd': 'в', 'f': 'а', 'g': 'п', 'h': 'р', 'j': 'о', 'k': 'л', 'l': 'д', 
        'z': 'я', 'x': 'ч', 'c': 'с', 'v': 'м', 'b': 'и', 'n': 'т', 'm': 'ь', ',': 'б',
        'Q': 'Й', 'W': 'Ц', 'E': 'У', 'R': 'К', 'T': 'Е', 'Y': 'Н', 'U': 'Г', 'I': 'Ш', 'O': 'Щ', 'P': 'З', 
        'A': 'Ф', 'S': 'Ы', 'D': 'В', 'F': 'А', 'G': 'П', 'H': 'Р', 'J': 'О', 'K': 'Л', 'L': 'Д', 
        'Z': 'Я', 'X': 'Ч', 'C': 'С', 'V': 'М', 'B': 'И', 'N': 'Т', 'M': 'Ь', '.': 'ю', '[': 'х'
    };

    const reverseTranslitMap = Object.fromEntries(
        Object.entries(translitMap).map(([key, value]) => [value, key])
    );

    const replacedText = text.split('').map(char => {
        return translitMap[char] || reverseTranslitMap[char] || char;
    }).join('');

    inputField.value = replacedText; 
}

function createInputField() {
    let inputContainer = document.getElementById('dictInputContainer');
    let resultBox = document.getElementById('dictResultBox');

    if (!inputContainer) {
        inputContainer = document.createElement('div');
        inputContainer.id = 'dictInputContainer';
        inputContainer.style.margin = '12px 0 0 0';
        inputContainer.style.padding = '0';
        inputContainer.style.display = 'flex';
        inputContainer.style.width = '100%';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.justifyContent = 'flex-start';
        inputContainer.style.flexWrap = 'nowrap'; 
        inputContainer.style.gap = '8px';

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'textInput';
        inputField.style.flex = '1';
        inputField.style.minWidth = '140px'; 
        inputField.style.display = 'inline';
        inputField.style.margin = '0';
        inputField.className = 'form-control'; 
        inputField.placeholder = 'Поиск в словаре...';

        resultBox = document.createElement('div');
        resultBox.id = 'dictResultBox';
        resultBox.style.display = 'none';
        resultBox.style.marginTop = '10px';
        resultBox.style.padding = '10px 15px';
        resultBox.style.backgroundColor = '#212529'; 
        resultBox.style.border = '1px solid #303030';
        resultBox.style.borderRadius = '8px';
        resultBox.style.color = '#b3b9c4';
        resultBox.style.width = '100%';

        const countButton = document.createElement('button');
        countButton.id = 'countButton';
        countButton.textContent = 'Подсчитать [0]'; 
        countButton.className = 'btn btn-success1'; 
        countButton.style.margin = '0';
        countButton.style.height = '38px';
        countButton.onclick = countCharacters;
        
        const dictButton = document.createElement('button');
        dictButton.textContent = 'Найти';
        dictButton.className = 'btn btn-primary1'; 
        dictButton.style.margin = '0';
        dictButton.style.height = '38px'; 
        
        dictButton.onclick = () => {
            const query = inputField.value;
            const result = searchDictionary(query);
            
            resultBox.style.display = 'block'; 
            
            if (result) {
                const formatTags = (text) => {
                    const tags = [
                        { word: "Оскорбление", bg: "#ff6b6b", color: "#1a1a1a" },
                        { word: "Мат", bg: "#ffb74d", color: "#1a1a1a" },
                        { word: "Аморал", bg: "#ffccbc", color: "#1a1a1a" },
                        { word: "Не нарушение", bg: "#81c784", color: "#1a1a1a" },
                        { word: "Неуважение", bg: "#b39ddb", color: "#1a1a1a" }
                    ];

                    let html = text;
                    tags.forEach(tag => {
                        const regex = new RegExp(tag.word, 'g');
                        html = html.replace(regex, `<span style="background-color: ${tag.bg}; color: ${tag.color}; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-right: 4px; display: inline-block;">${tag.word}</span>`);
                    });
                    
                    return html.replace(/,/g, '');
                };

                const notesHtml = result.notes 
                    ? `<div style="font-size: 13px; margin-top: 6px;">${result.notes}</div>` 
                    : '';
                    
                const synonymsHtml = result.synonyms && result.synonyms.length > 0
                    ? `<div style="font-size: 12px; margin-top: 4px; color: #8a929e;"><b>Похожие:</b> ${result.synonyms.join(', ')}</div>`
                    : '';
                
                resultBox.innerHTML = `
                    <div style="display: flex; align-items: center; flex-wrap: wrap;">
                        <span style="font-weight: bold; font-size: 14px; color: white; text-transform: uppercase; margin-right: 8px;">
                            ${result.word}
                        </span> 
                        <span style="color: #6c757d; margin-right: 8px;">—</span> 
                        <div>${formatTags(result.meaning)}</div>
                    </div>
                    ${notesHtml}
                    ${synonymsHtml}
                `;
            } else {
                resultBox.innerHTML = `<div style="color: #ff6969; font-weight: bold;">Слово "${query}" не найдено в словаре.</div>`;
            }
        };

        const replaceButton = document.createElement('button');
        replaceButton.textContent = 'Eng ⇄ Rus'; 
        replaceButton.className = 'btn btn-info1'; 
        replaceButton.style.margin = '0';
        replaceButton.style.height = '38px';
        replaceButton.onclick = replaceEngRus; 

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                dictButton.click();
            }
        });

        const keepActive = (el) => {
            const obs = new MutationObserver(() => {
                if (el.disabled) el.disabled = false;
            });
            obs.observe(el, { attributes: true, attributeFilter: ['disabled'] });
        };

        keepActive(inputField);
        keepActive(countButton);
        keepActive(dictButton);
        keepActive(replaceButton);
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(dictButton); 
        inputContainer.appendChild(replaceButton); 
        inputContainer.appendChild(countButton);
    }

    const modalFooter = document.querySelector('.modal-footer');
    const modalBody = document.querySelector('.modal-body');

    if (modalFooter) {
        modalFooter.style.flexWrap = 'wrap';
        if (!modalFooter.contains(inputContainer) || modalFooter.lastElementChild !== resultBox) {
            modalFooter.appendChild(inputContainer);
            modalFooter.appendChild(resultBox);
        }
    } else if (modalBody) {
        if (!modalBody.contains(inputContainer) || modalBody.lastElementChild !== resultBox) {
            modalBody.appendChild(inputContainer);
            modalBody.appendChild(resultBox);
        }
    }
}

const userCache = {};
const userPromises = {};

let nameQueue = new Set();
let promiseResolvers = new Map(); 
let queueTimer = null; 
const BATCH_SIZE = 50;
const BATCH_DELAY = 100; 

async function processNameQueue() {
    if (nameQueue.size === 0) {
        return;
    }

    const namesToFetch = [...nameQueue];
    nameQueue.clear();
    clearTimeout(queueTimer);
    queueTimer = null;

    for (let i = 0; i < namesToFetch.length; i += BATCH_SIZE) {
        const chunk = namesToFetch.slice(i, i + BATCH_SIZE);
        const url = `https://api.vimeworld.com/user/name/${chunk.map(encodeURIComponent).join(',')}?token=${API_TOKEN}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let data = await response.json();

            if (data.error) {
                 throw new Error(`API error code: ${data.error}. Message: ${data.error_msg}`);
            }

            const foundUsernames = new Set();
            
            if (Array.isArray(data) && data.length > 0) {

                const ids = data.map(u => u.id);
                try {
                    const sessionUrl = `https://api.vimeworld.com/user/session/${ids.join(',')}?token=${API_TOKEN}`;
                    const sessionResponse = await fetch(sessionUrl);
                    if (sessionResponse.ok) {
                        const sessionData = await sessionResponse.json();
                        if (Array.isArray(sessionData)) {
                            const sessionMap = {};
                            sessionData.forEach(s => sessionMap[s.id] = s.online);
                            data.forEach(u => {
                                if (sessionMap[u.id]) u.online = sessionMap[u.id];
                            });
                        }
                    }
                } catch (e) {
                    console.error("Ошибка при получении сессий:", e);
                }

                data.forEach(user => {
                    const normalizedUsername = user.username.toLowerCase();
                    foundUsernames.add(normalizedUsername);
                    userCache[normalizedUsername] = user;

                    if (promiseResolvers.has(normalizedUsername)) {
                        promiseResolvers.get(normalizedUsername).resolve(user);
                        promiseResolvers.delete(normalizedUsername);
                    }
                    delete userPromises[normalizedUsername];
                });
            }

            chunk.forEach(name => {
                const normalizedName = name.toLowerCase();
                if (!foundUsernames.has(normalizedName)) {
                    userCache[normalizedName] = null;
                    if (promiseResolvers.has(normalizedName)) {
                        promiseResolvers.get(normalizedName).resolve(null);
                        promiseResolvers.delete(normalizedName);
                    }
                    delete userPromises[normalizedName];
                }
            });

        } catch (error) {
            console.error(`Ошибка при пакетном запросе для ников [${chunk.join(', ')}]:`, error);
            chunk.forEach(name => {
                const normalizedName = name.toLowerCase();
                if (promiseResolvers.has(normalizedName)) {
                    promiseResolvers.get(normalizedName).reject(error);
                    promiseResolvers.delete(normalizedName);
                }
                delete userPromises[normalizedName];
            });
        }
    }
}

/**
 * @param {string} name
 * @returns {Promise<Object|null>}
 */

function fetchUserData(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    console.warn("Пустое имя передано в fetchUserData, запрос отменён.");
    return Promise.resolve(null);
  }

  const normalizedName = name.trim().toLowerCase();

  if (userCache.hasOwnProperty(normalizedName)) {
    return Promise.resolve(userCache[normalizedName]);
  }

  if (userPromises[normalizedName]) {
    return userPromises[normalizedName];
  }

  const promise = new Promise((resolve, reject) => {
    promiseResolvers.set(normalizedName, { resolve, reject });
  });

  userPromises[normalizedName] = promise;
  nameQueue.add(name.trim());

  if (queueTimer) {
    clearTimeout(queueTimer);
  }
  queueTimer = setTimeout(processNameQueue, BATCH_DELAY);

  return promise;
}

function formatColor(color) {
    if (!color) return null;
    color = color.trim().toLowerCase();
    if (color.startsWith("#")) return color;
    if (/^[0-9a-f]{6}$/.test(color)) return `#${color}`;
    return null;
}

function applyGradient(element, colors, defaultColor) {

    element.style.color = "";
    element.style.background = "";
    element.style.webkitBackgroundClip = "";
    element.style.backgroundClip = "";
    element.style.webkitTextFillColor = "";
    element.style.textFillColor = "";

    let gradientColors = [];

    if (colors && colors.length > 0) {
        gradientColors = colors.map(formatColor).filter(Boolean);
    } else if (Array.isArray(defaultColor) && defaultColor.length > 1) {
        gradientColors = defaultColor.map(formatColor).filter(Boolean);
    } else if (typeof defaultColor === "string") {
        element.style.color = formatColor(defaultColor);
        return;
    }

    if (gradientColors.length < 2) {
        element.style.color = gradientColors[0] || defaultColor;
        return;
    }

    element.style.background = `linear-gradient(to right, ${gradientColors.join(", ")})`;
    element.style.webkitBackgroundClip = "text";
    element.style.backgroundClip = "text";
    element.style.webkitTextFillColor = "transparent";
    element.style.textFillColor = "transparent";
}

function getRankInfoReporter(rank) {
    switch (rank) {
        case "PLAYER":
            return { label: "", defaultColor: "" };
        case "VIP":
            return { label: "[V]", defaultColor: "#1cd41c" };
        case "PREMIUM":
            return { label: "[P]", defaultColor: "#00dada" };
        case "HOLY":
            return { label: "[H]", defaultColor: ["#fff8a9", "#ffa317"]};
        case "IMMORTAL":
            return { label: "[I]", defaultColor: ["#ff70d1","#ff5d6d"]};
        case "DIVINE":
            return { label: "[Divine]", defaultColor: ["#b451ff", "#84b5ff"] };
        case "THANE":
            return { label: "[Thane]", defaultColor: ["#30ff87","#1cffe4","#3594ff"] };
        case "ELITE":
            return { label: "[Elite]", defaultColor: ["#ffa51e","#ff5619","#ff314a"]};
        case "ETERNAL":
            return { label: "[Eternal]", defaultColor: ["#2688ed","#8b00d7","#ff4161"] };
        case "CELESTIAL":
            return { label: "[Celestial]", defaultColor: ["#e0f3ff", "#bfdfff", "#96c6ff", "#6895d6"] };
        case "ABSOLUTE":
            return { label: "[Absolute]", defaultColor: ["#f200ff", "#972a6e", "#632f59", "#dd57bc"] };
        case "IMPERIAL":
            return { label: "[Imperial]", defaultColor: ["#fdbd05", "#ffa630", "#fffabd", "#fdbd05"] };
        case "ULTIMATE":
            return { label: "[Ultimate]", defaultColor: ["#4f4f4f", "#737272", "#fbf7ff", "#3a3a3a"] };
        case "YOUTUBE":
            return { label: "[Media]", defaultColor: ["#bf2dff","#f33fd7"]}; 
        case "VIME":
            return { label: "[Vime]", defaultColor: ["#2599d4","#1d7cab"] }; 
        case "ORGANIZER":
            return { label: "[Организатор]", defaultColor: ["#0d83ae","#00c0eb"] }; 
        case "DEV":
            return { label: "[Dev]", defaultColor: "#d61753" }; 
        case "BUILDER":
            return { label: "[Билдер]", defaultColor: ["#67ff54","#16bd00"] }; 
        case "SRBUILDER":
            return { label: "[Пр. билдер]", defaultColor: ["#67ff54","#16bd00"]};
        case "MAPLEAD":
            return { label: "[Гл. билдер]", defaultColor: ["#55961a","#3f6e13"] };  
        case "HELPER":
            return { label: "[Хелпер]", defaultColor: "#76a6ff" }; 
        case "MODER":
            return { label: "[Модер]", defaultColor: "#4e62eb" };
        case "WARDEN":
            return { label: "[Пр. Модер]", defaultColor: "#3c36de" };
        case "CHIEF":
            return { label: "[Админ]", defaultColor: ["#ff5e43","#db2100"]};
        case "ADMIN":
            return { label: "[Гл. админ]", defaultColor: ["#ff2030","#d40048","#c1006b"]};
        default:
            return null;
    }
}

function getFirstColor(color) {
  if (Array.isArray(color) && color.length) return formatColor(color[0]);
  return formatColor(color);
}

function renderName(td, name, rankInfo, custom = [], apiPrefix = null, userObj = null) {
  if (!td) return;
  td.dataset.processed = "true";
  td.dataset.vwUsername = name;

  const historyLink = td.querySelector('a[href*="/staff/usernames"]');
  td.innerHTML = ""; 

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.maxWidth = "100%";

  if (isOnlineStatusEnabled && userObj && userObj.online) {
      const indicator = createStatusIndicator(userObj);
      if (indicator) {
          indicator.style.marginRight = "4px";
          wrapper.appendChild(indicator);
      }
  }

  if (isHeadsEnabled) {
      const headImg = document.createElement("img");
      headImg.className = "vw-head-avatar";
      headImg.src = `https://skin.vimeworld.com/helm/${encodeURIComponent(name)}.png`;
      headImg.style.width = "14px";
      headImg.style.height = "14px";
      headImg.style.marginRight = "4px";
      headImg.style.borderRadius = "2px";
      headImg.style.imageRendering = "pixelated";
      wrapper.appendChild(headImg);
  }

  const textContainer = document.createElement("div");
  textContainer.style.overflow = "hidden";
  textContainer.style.textOverflow = "ellipsis";
  textContainer.style.whiteSpace = "nowrap";
  textContainer.style.flex = "1";
  textContainer.style.minWidth = "0"; 

  if (isEnabled3) {
    const isDeveloper = name.toLowerCase() === 'kaossent' || name.toLowerCase() === '__skeletron__' || name.toLowerCase() === 'kaicenat' || name.toLowerCase() === 'Moderator_Denis';
    if (isDeveloper) {
      const starSpan = document.createElement('span');
      starSpan.className = 'developer-star';
      starSpan.textContent = '★';
      const tooltip = document.createElement('span');
      tooltip.className = 'tooltip-text';
      tooltip.textContent = 'Разработчик';
      starSpan.appendChild(tooltip);
      wrapper.appendChild(starSpan);
    }

    const prefixLabel = apiPrefix ? `[${apiPrefix}]` : (rankInfo && rankInfo.label ? rankInfo.label : "");
    if (prefixLabel) {
      const prefixSpan = document.createElement("span");
      prefixSpan.textContent = prefixLabel;
      prefixSpan.style.color = getFirstColor(rankInfo.defaultColor);
      prefixSpan.style.fontWeight = "bold"; 
      prefixSpan.style.marginRight = "4px";
      textContainer.appendChild(prefixSpan);
    }

    const nickSpan = document.createElement("span");
    applyGradient(nickSpan, custom, rankInfo ? rankInfo.defaultColor : "");
    nickSpan.textContent = name;
    textContainer.appendChild(nickSpan);
  } else {
    const nickSpan = document.createElement("span");
    nickSpan.textContent = name;
    textContainer.appendChild(nickSpan);
  }

  wrapper.appendChild(textContainer);
  if (historyLink) {
    historyLink.style.marginLeft = "6px";
    wrapper.appendChild(historyLink);
  }

  td.appendChild(wrapper);
}
function createStatusIndicator(userObj) {
    if (!userObj || !userObj.online) return null;
    
    const statusIndicator = document.createElement("span");
    statusIndicator.className = "status-indicator";

    const statusCircle = document.createElement("span");
    statusCircle.className = "status-circle " + (userObj.online.value ? "online" : "offline");
    
    const tooltipText = document.createElement("span");
    tooltipText.className = "tooltip-text";
    tooltipText.textContent = userObj.online.message || (userObj.online.value ? "Онлайн" : "Оффлайн");

    statusIndicator.appendChild(statusCircle);
    statusIndicator.appendChild(tooltipText);
    return statusIndicator;
}

function formatToRuDateTime(str) {
  if (!str || typeof str !== 'string') return str;
  // Convert US format: M/D/YYYY or MM/DD/YYYY with optional time
  let res = str.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?/gi, (match, m, d, y, hh, mm, ss, ampm) => {
    const pad = n => String(n).padStart(2, '0');
    const day = pad(d);
    const month = pad(m);
    const year = y;
    if (hh === undefined) {
      return day + '.' + month + '.' + year;
    }
    let h = parseInt(hh, 10);
    if (ampm) {
      const isPM = ampm.toUpperCase() === 'PM';
      if (isPM && h < 12) h += 12;
      else if (!isPM && h === 12) h = 0;
    }
    const secStr = ss !== undefined ? ':' + pad(ss) : '';
    return day + '.' + month + '.' + year + ', ' + pad(h) + ':' + pad(mm) + secStr;
  });

  // Convert ISO format: YYYY-MM-DD[T/ ]HH:MM[:SS]
  res = res.replace(/\b(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?)?/g, (match, y, m, d, hh, mm, ss) => {
    const pad = n => String(n).padStart(2, '0');
    if (hh === undefined) {
      return pad(d) + '.' + pad(m) + '.' + y;
    }
    const secStr = ss !== undefined ? ':' + pad(ss) : '';
    return pad(d) + '.' + pad(m) + '.' + y + ', ' + pad(hh) + ':' + pad(mm) + secStr;
  });

  return res;
}

function formatVwDates(root = document) {
  // 1. Table rows: Date column (cell 1)
  const rows = root.querySelectorAll('table.table tbody tr, tr[id^="row_report"]');
  rows.forEach(row => {
    if (row.cells && row.cells.length >= 2) {
      const dateCell = row.cells[1];
      if (dateCell && !dateCell.dataset.vwDate) {
        const raw = dateCell.textContent.trim();
        const formatted = formatToRuDateTime(raw);
        if (formatted !== raw) {
          dateCell.textContent = formatted;
          dateCell.dataset.vwDate = "true";
        }
      }
    }
  });

  // 2. Modal <dl> Date: <dt>Дата</dt> <dd>...</dd>
  const dts = root.querySelectorAll('.modal-body dt, dt');
  dts.forEach(dt => {
    if (dt.textContent.trim().toLowerCase() === 'дата') {
      const dd = dt.nextElementSibling;
      if (dd && !dd.dataset.vwDate) {
        const raw = dd.textContent.trim();
        const formatted = formatToRuDateTime(raw);
        if (formatted !== raw) {
          dd.textContent = formatted;
          dd.dataset.vwDate = "true";
        }
      }
    }
  });

  // 3. Modal alert blocks: dates in .alert-success, .alert-warning
  const alerts = root.querySelectorAll('.modal-body .alert, .alert');
  alerts.forEach(alert => {
    alert.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
        const formatted = formatToRuDateTime(node.nodeValue);
        if (formatted !== node.nodeValue) {
          node.nodeValue = formatted;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains('small') || node.tagName === 'SPAN' || node.tagName === 'DIV')) {
        const raw = node.textContent;
        const formatted = formatToRuDateTime(raw);
        if (formatted !== raw) {
          node.textContent = formatted;
        }
      }
    });
  });
}

function processRows(limit = 200) {
  const currentHref = window.location.href;
  const currentPath = window.location.pathname;

  // Never run on donate, shop, settings or non-reports pages!
  if (currentHref.includes('/donate') || currentPath.includes('/donate')) return;
  if (currentHref.includes('/settings') || currentPath.includes('/settings')) return;

  const isReportsPage = currentPath.startsWith('/staff/reports') ||
                        currentPath.startsWith('/reports') ||
                        currentHref.includes('legacy-cp.vimeworld.com');
  if (!isReportsPage) return;

  const table = document.querySelector('table.table');
  if (table) {
    const thText = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim()).join(' ');
    if (!thText.includes('Нарушитель') && !thText.includes('Отправитель') && !document.querySelector('tr[id^="row_report"]')) {
      return;
    }
  }

  chrome.storage.sync.get({
    isEnabled3: true,
    isOnlineStatusEnabled: true,
    isHeadsEnabled: true
  }, (data) => {
    syncSettingsFromStorage(data);
    const anyFeatureEnabled = isEnabled3 || isHeadsEnabled || isOnlineStatusEnabled;
    if (!anyFeatureEnabled) return; 

    function extractUsername(cell) {
        if (!cell) return null;
        if (cell.dataset.vwUsername) return cell.dataset.vwUsername;
        const link = cell.querySelector && cell.querySelector('a[href*="usernames?name="]');
        if (link) {
            try {
                const url = new URL(link.href, window.location.origin);
                const nameParam = url.searchParams.get('name');
                if (nameParam) return decodeURIComponent(nameParam).trim();
            } catch (e) {
                const m = link.href.match(/name=([^&]+)/i);
                if (m) return decodeURIComponent(m[1]).trim();
            }
            if (link.getAttribute('aria-label')) {
                const m = link.getAttribute('aria-label').match(/История ника\s+(.+)/i);
                if (m) return m[1].trim();
            }
        }
        const rawText = cell.textContent || '';
        const cleaned = rawText.replace(/\[.*?\]/g, '').trim();
        const parts = cleaned.split(/\s+/).filter(p => /^[a-zA-Z0-9_а-яА-ЯёЁ]{2,16}$/.test(p));
        return parts[0] || parts.pop() || null;
    }

    const rows = document.querySelectorAll('table.table tbody tr, tr[id^="row_report"]');
    let done = 0;

    rows.forEach(row => {
      if (row.cells && row.cells.length >= 2) {
        const dateTd = row.cells[1];
        if (dateTd && !dateTd.dataset.vwDate) {
          const rawDate = dateTd.textContent.trim();
          const formatted = formatToRuDateTime(rawDate);
          if (formatted !== rawDate) {
            dateTd.textContent = formatted;
            dateTd.dataset.vwDate = "true";
          }
        }
      }

      if (done >= limit) return;
      if (!row.cells || row.cells.length < 5) return;

      const violatorTd = row.cells[2];
      const reporterTd = row.cells[3];

      if (violatorTd && !violatorTd.dataset.processed) {
        const name = extractUsername(violatorTd);
        if (name) {
          done++;
          fetchUserData(name)
            .then(u => {
              if (u) {
                renderName(
                  violatorTd, u.username, getRankInfoReporter(u.rank) || { label: "", defaultColor: "" }, u.customColors || [], u.prefix, u
                );
              }
            })
            .catch(e => console.error("Violator fetch:", e));
        }
      }

      if (reporterTd && !reporterTd.dataset.processed) {
        const name = extractUsername(reporterTd);
        if (name) {
          done++;
          fetchUserData(name)
            .then(u => {
              if (u) {
                renderName(
                  reporterTd, u.username, getRankInfoReporter(u.rank) || { label: "", defaultColor: "" }, u.customColors || [], u.prefix, u
                );
              }
            })
            .catch(e => console.error("Reporter fetch:", e));
        }
      }
    });
  });
}


function modifyLoginLabel() {
  chrome.storage.sync.get("isEnabled3", (data) => {
    if (!data.isEnabled3) return;

    const nameEl = document.querySelector("span.pull-left b, .navbar .dropdown span.ms-2, nav .dropdown-toggle span.ms-2");
    if (!nameEl || nameEl.dataset.vwProcessed) return;

    const name = nameEl.textContent.trim();
    if (!name || name.includes("[")) return;
    nameEl.dataset.vwProcessed = "true";

    fetchUserData(name)
      .then((user) => {
        if (user && isValidRank(user.rank)) {
          const rankInfo = getRankInfoReporter(user.rank);
          if (rankInfo) {
            nameEl.textContent = "";

            const isDeveloper = user.username.toLowerCase() === 'kaossent' || user.username.toLowerCase() === '__skeletron__' || user.username.toLowerCase() === 'mute' || user.username.toLowerCase() === 'DrugAttiLLasa';
            if (isDeveloper) {
              const starSpan = document.createElement('span');
              starSpan.className = 'developer-star';
              starSpan.textContent = '★';
              const tooltip = document.createElement('span');
              tooltip.className = 'tooltip-text';
              tooltip.textContent = 'Разработчик';
              starSpan.appendChild(tooltip);
              nameEl.appendChild(starSpan);
            }
            
            const prefixSpan = document.createElement("span");
            prefixSpan.textContent = `${rankInfo.label}`;
            prefixSpan.style.fontWeight = "bold";
            prefixSpan.style.color = formatColor(
              Array.isArray(rankInfo.defaultColor)
                ? rankInfo.defaultColor[0]
                : rankInfo.defaultColor
            );

            const nameSpan = document.createElement("span");
            nameSpan.textContent = ` ${user.username}`;
            applyGradient(nameSpan, user.customColors || [], rankInfo.defaultColor);
            
            nameEl.appendChild(prefixSpan);
            nameEl.appendChild(nameSpan);
          }
        }
      })
      .catch((err) =>
        console.error(`Ошибка при обработке логин-имени ${name}:`, err)
      );
  });
}

function isValidRank(rank) {
    return [
      "CELESTIAL", "ABSOLUTE", "IMPERIAL", "ULTIMATE",
      "DIVINE", "THANE", "ELITE", "ETERNAL", "IMMORTAL", "HOLY",
      "PREMIUM", "VIP", "WARDEN", "PLAYER", "YOUTUBE", "VIME",
      "DEV", "MODER", "CHIEF", "ADMIN", "ORGANIZER", "BUILDER",
      "SRBUILDER", "MAPLEAD", "HELPER"
    ].includes(rank);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        renderName();
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function rowClass() {
    const currentUrl = window.location.href;
    if (currentUrl.includes("forum.vimeworld.com")) return;

    const table = document.getElementById('table') || document.querySelector('table.table');
    if (table) {
        table.classList.remove("table-hover");
    }

    if (!document.getElementById("custom-row-style")) {
        const style = document.createElement('style');
        style.id = "custom-row-style";
        style.textContent = `
            .custom_warning, tr.custom_warning td {
                background-color: rgba(226, 223, 40, 0.18) !important;
            }
            .custom_success, tr.custom_success td {
                background-color: rgba(40, 226, 124, 0.18) !important;
            }
            .custom_danger, tr.custom_danger td {
                background-color: rgba(255, 105, 105, 0.18) !important;
            }
        `;
        document.head.appendChild(style);
    }

    const rows = document.querySelectorAll('tr[id^="row_report"], table.table tbody tr');
    rows.forEach(row => {
        if (row.classList.contains("warning") || row.querySelector('.text-bg-warning')) {
            row.classList.add("custom_warning");
        } else if (row.classList.contains("success") || row.querySelector('.text-bg-success')) {
            row.classList.add("custom_success");
        } else if (row.classList.contains("danger") || row.querySelector('.text-bg-danger')) {
            row.classList.add("custom_danger");
        }
    });
}

let styleTimeout = null;
let isStyling = false;
let modalObserver = null;
const observerConfig = { childList: true, subtree: true, characterData: true, attributes: true };

function getStorageAsync(defaults) {
  return new Promise(resolve => chrome.storage.sync.get(defaults, resolve));
}

function getRankColor(rankName) {
  if (!rankName) return null;
  const upper = rankName.toUpperCase();
  const colors = {
    VIP: '#1cd41c',
    PREMIUM: '#00dada',
    HOLY: '#ffa317',
    IMMORTAL: '#ff5d6d',
    DIVINE: '#b451ff',
    THANE: '#30ff87',
    ELITE: '#ff5619',
    ETERNAL: '#2688ed',
    CELESTIAL: '#6895d6',
    ABSOLUTE: '#f200ff',
    IMPERIAL: '#ffa630',
    ULTIMATE: '#fbf7ff',
    YOUTUBE: '#bf2dff',
    MEDIA: '#bf2dff',
    DEV: '#d61753',
    MODER: '#4e62eb',
    WARDEN: '#3c36de',
    CHIEF: '#db2100',
    ADMIN: '#ff2030',
    HELPER: '#76a6ff',
    BUILDER: '#16bd00'
  };
  return colors[upper] || null;
}

async function formatModalMessages() {
  const container = document.querySelector('.modal-body .bg-tertiary, .modal-body div.rounded.p-2');
  if (!container) return;

  container.style.setProperty('max-height', 'none', 'important');
  container.style.setProperty('overflow', 'visible', 'important');
  container.style.setProperty('overflow-y', 'visible', 'important');
  container.style.setProperty('padding', '6px 10px', 'important');

  function renderServerBadge(srv) {
    const srvSpan = document.createElement('span');
    srvSpan.className = 'vw-server-badge';
    srvSpan.style.cssText = 'background: rgba(255, 255, 255, 0.08); color: #c9d1d9; padding: 1px 5px; border-radius: 3px; font-size: 11px; margin-right: 6px; border: 1px solid rgba(255, 255, 255, 0.2); font-weight: bold; font-family: monospace; display: inline-block; vertical-align: middle; line-height: 1.3; user-select: none;';
    srvSpan.textContent = srv;
    return srvSpan;
  }

  function formatTime(rawTime) {
    if (!rawTime) return '';
    const str = String(rawTime).trim();
    const m = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (m) {
      let h = parseInt(m[1], 10);
      const mm = m[2];
      const ss = m[3] || '00';
      const ampm = m[4];
      if (ampm) {
        const isPM = ampm.toUpperCase() === 'PM';
        if (isPM && h < 12) h += 12;
        else if (!isPM && h === 12) h = 0;
      }
      return `${String(h).padStart(2, '0')}:${mm}:${ss}`;
    }
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Moscow',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
    return str;
  }

  // Determine fallback server from details table
  let fallbackServer = '';
  const dts = document.querySelectorAll('.modal-body dt, dt');
  for (const dt of dts) {
    if (dt.textContent.trim().toLowerCase() === 'сервер') {
      const dd = dt.nextElementSibling;
      if (dd) {
        const srvText = dd.textContent.trim().split(',')[0].trim();
        if (srvText && srvText !== '—' && srvText !== 'неизвестен') {
          fallbackServer = srvText;
          break;
        }
      }
    }
  }

  let activeServer = fallbackServer;
  const existingRows = Array.from(container.children);

  existingRows.forEach(child => {
    // 1. Check if child itself is a standalone server header (e.g. div.small.font-monospace without timestamp)
    if (child.matches && (child.matches('.font-monospace, .small') || !child.querySelector('span.text-body-secondary'))) {
      const text = child.textContent.trim();
      if (text && !text.includes(':') && text.length < 20 && !text.includes('Сообщения')) {
        activeServer = text;
        child.style.setProperty('display', 'none', 'important');
        return;
      }
    }

    // 2. Check if child contains an inner server header (React creates this when server changes)
    const innerSrv = child.querySelector && child.querySelector('div.font-monospace, div.small');
    if (innerSrv) {
      const text = innerSrv.textContent.trim();
      if (text && !text.includes(':')) {
        activeServer = text;
      }
      innerSrv.style.setProperty('display', 'none', 'important');
      innerSrv.style.setProperty('margin', '0', 'important');
      innerSrv.style.setProperty('padding', '0', 'important');
    }

    // 3. Row presentation: single unbroken sequential line with compact font
    child.style.setProperty('display', 'block', 'important');
    child.style.setProperty('margin-top', '0px', 'important');
    child.style.setProperty('margin-bottom', '2px', 'important');
    child.style.setProperty('line-height', '1.35', 'important');
    child.style.setProperty('font-size', '13px', 'important');
    child.style.setProperty('white-space', 'normal', 'important');
    child.style.setProperty('word-break', 'break-word', 'important');

    // 4. Format timestamp and prepend or remove server badge
    const timeSpan = child.querySelector && child.querySelector('span.text-body-secondary');
    if (timeSpan) {
      if (!child.dataset.vwTimeFormatted) {
        timeSpan.textContent = formatTime(timeSpan.textContent.trim());
        timeSpan.style.setProperty('color', '#8a929e', 'important');
        timeSpan.style.setProperty('font-size', '12.5px', 'important');
        timeSpan.style.setProperty('font-family', 'monospace', 'important');
        timeSpan.style.setProperty('margin-right', '6px', 'important');
        timeSpan.style.setProperty('display', 'inline-block', 'important');
        timeSpan.style.setProperty('vertical-align', 'middle', 'important');
        timeSpan.style.setProperty('line-height', '1.3', 'important');
        child.dataset.vwTimeFormatted = 'true';
      }

      const existingBadge = child.querySelector('.vw-server-badge');
      if (isServerInfoEnabled) {
        const srvToUse = activeServer || fallbackServer;
        if (srvToUse && !existingBadge) {
          const badge = renderServerBadge(srvToUse);
          child.insertBefore(badge, timeSpan);
        } else if (existingBadge && srvToUse) {
          existingBadge.textContent = srvToUse;
        }
      } else {
        if (existingBadge) {
          existingBadge.remove();
        }
      }
    }

    // 5. Format message text: colored rank prefix, uniform separator
    if (!child.querySelector('.vw-chat-text-wrapper')) {
      const textNodes = [];
      child.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim()) {
          textNodes.push(node);
        }
      });

      if (textNodes.length > 0) {
        const rawText = textNodes.map(n => n.nodeValue).join(' ').trim();
        textNodes.forEach(n => n.remove());

        const rankMatch = rawText.match(/^(\[?(VIP|PREMIUM|HOLY|IMMORTAL|DIVINE|THANE|ELITE|ETERNAL|CELESTIAL|ABSOLUTE|IMPERIAL|ULTIMATE|YOUTUBE|MEDIA|DEV|MODER|WARDEN|CHIEF|ADMIN|HELPER|BUILDER)\]?)\s*(?:-|\s-)?\s*(.*)$/i);

        const span = document.createElement('span');
        span.className = 'vw-chat-text-wrapper';
        span.style.verticalAlign = 'middle';

        if (rankMatch) {
          const rawRank = rankMatch[2];
          const rankColor = getRankColor(rawRank) || '#1cd41c';

          const rankSpan = document.createElement('span');
          rankSpan.className = 'vw-rank-prefix';
          rankSpan.textContent = rankMatch[1];
          rankSpan.style.cssText = `color: ${rankColor}; font-weight: bold; margin-right: 4px;`;
          span.appendChild(rankSpan);

          const sepSpan = document.createElement('span');
          sepSpan.textContent = '- ';
          sepSpan.style.cssText = 'color: #8a929e; margin-right: 4px;';
          span.appendChild(sepSpan);

          const msgSpan = document.createElement('span');
          msgSpan.className = 'vw-chat-content';
          msgSpan.textContent = rankMatch[3];
          span.appendChild(msgSpan);
        } else {
          let msg = rawText;
          if (msg.startsWith('-')) {
            msg = msg.replace(/^-\s*/, '');
          }
          const sepSpan = document.createElement('span');
          sepSpan.textContent = '- ';
          sepSpan.style.cssText = 'color: #8a929e; margin-right: 4px;';
          span.appendChild(sepSpan);

          const msgSpan = document.createElement('span');
          msgSpan.className = 'vw-chat-content';
          msgSpan.textContent = msg;
          span.appendChild(msgSpan);
        }

        child.appendChild(span);
      }
    }
  });

  convertText();
  highlightDictWords();
}

function injectMuteInputStyles() {
  if (document.getElementById('vw-mute-input-styles')) return;
  const style = document.createElement('style');
  style.id = 'vw-mute-input-styles';
  style.textContent = `
    .modal-dialog input[placeholder*="Минут"],
    .modal-dialog input[placeholder*="Причина"],
    .modal-dialog input[type="number"],
    .modal-body .row.g-2 input,
    .modal-body input.form-control:not(#textInput) {
      background-color: #212529 !important;
      border: 1px solid #495057 !important;
      border-radius: 6px !important;
      color: #f1f3f5 !important;
      height: 38px !important;
      box-shadow: none !important;
      opacity: 1 !important;
    }
    .modal-dialog input[placeholder*="Минут"]::placeholder,
    .modal-dialog input[placeholder*="Причина"]::placeholder,
    .modal-dialog input[type="number"]::placeholder,
    .modal-body .row.g-2 input::placeholder,
    .modal-body input.form-control:not(#textInput)::placeholder {
      color: #adb5bd !important;
      opacity: 1 !important;
    }
    .modal-dialog input[placeholder*="Минут"]:focus,
    .modal-dialog input[placeholder*="Причина"]:focus,
    .modal-dialog input[type="number"]:focus,
    .modal-body .row.g-2 input:focus,
    .modal-body input.form-control:not(#textInput):focus {
      background-color: #212529 !important;
      border-color: #0d6efd !important;
      color: #fff !important;
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
      outline: none !important;
    }
    .modal-body > .row.g-2 {
      position: relative !important;
      z-index: 10 !important;
      display: flex !important;
      flex-wrap: nowrap !important;
      gap: 8px !important;
      align-items: center !important;
      padding-right: 232px !important;
      margin-bottom: 0 !important;
      height: 38px !important;
      pointer-events: none !important;
      transition: margin-top 0.15s ease !important;
    }
    .modal-body > .row.g-2 > * {
      pointer-events: auto !important;
      margin: 0 !important;
    }

    /* When confirmation dialog is open, shift input row down to make 36px space for confirmation question */
    .modal-body:has(+ .modal-footer.justify-content-between) > .row.g-2,
    .modal-body:has(+ .modal-footer:has(button.btn-secondary)) > .row.g-2 {
      margin-top: 36px !important;
    }

    .modal-footer {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      border-top: none !important;
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: flex-end !important;
      gap: 8px !important;
      align-items: center !important;
      padding: 0 16px 16px 16px !important;
      margin-top: -36px !important;
      position: relative !important;
      z-index: 20 !important;
      pointer-events: none !important;
    }
    .modal-footer > * {
      pointer-events: auto !important;
    }

    /* Confirmation dialog: question above inputs, buttons stay in-place on the right */
    .modal-footer.justify-content-between,
    .modal-footer:has(button.btn-secondary) {
      margin-top: -36px !important;
      padding: 0 16px 16px 16px !important;
      border-top: none !important;
      justify-content: flex-end !important;
      position: relative !important;
      z-index: 20 !important;
      pointer-events: none !important;
    }

    .modal-footer.justify-content-between > span,
    .modal-footer:has(button.btn-secondary) > span {
      position: absolute !important;
      top: -34px !important;
      left: 16px !important;
      right: 16px !important;
      height: 28px !important;
      display: block !important;
      line-height: 28px !important;
      font-size: 0.95rem !important;
      color: #f1f3f5 !important;
      pointer-events: auto !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      z-index: 25 !important;
    }

    .modal-footer.justify-content-between > div.d-flex,
    .modal-footer:has(button.btn-secondary) > div.d-flex {
      display: inline-flex !important;
      gap: 8px !important;
      align-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
      pointer-events: auto !important;
    }

    .modal-footer.justify-content-between > div.d-flex > button,
    .modal-footer:has(button.btn-secondary) > div.d-flex > button {
      height: 38px !important;
      width: 108px !important;
      min-width: 108px !important;
      margin: 0 !important;
      white-space: nowrap !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      box-sizing: border-box !important;
      pointer-events: auto !important;
    }

    /* Secondary button (Отмена) */
    .modal-dialog button.btn-secondary,
    .modal-footer button.btn-secondary {
      background-color: #6c757d !important;
      background-image: none !important;
      border: 1px solid #6c757d !important;
      color: #ffffff !important;
      height: 38px !important;
      width: 108px !important;
      min-width: 108px !important;
      margin: 0 !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      box-sizing: border-box !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      pointer-events: auto !important;
    }
    .modal-dialog button.btn-secondary:hover,
    .modal-footer button.btn-secondary:hover {
      background-color: #5a6268 !important;
      border-color: #545b62 !important;
      color: #ffffff !important;
    }

    .modal-footer > button.btn-warning,
    .modal-footer > button.btn-danger,
    .modal-footer > div.d-flex > button {
      height: 38px !important;
      width: 108px !important;
      min-width: 108px !important;
      margin: 0 !important;
      white-space: nowrap !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      border-radius: 6px !important;
      font-weight: 500 !important;
      box-sizing: border-box !important;
      vertical-align: middle !important;
    }

    /* Кнопка мута - ЗЕЛЁНАЯ */
    .modal-dialog button.btn-danger,
    .modal-footer button.btn-danger,
    .modal-footer > button.btn-danger {
      background-color: #28a745 !important;
      background-image: none !important;
      border: 1px solid #28a745 !important;
      color: #ffffff !important;
      font-weight: 500 !important;
      order: 1 !important;
      height: 38px !important;
      width: 108px !important;
      min-width: 108px !important;
      margin: 0 !important;
    }
    .modal-dialog button.btn-danger:hover,
    .modal-footer button.btn-danger:hover {
      background-color: #218838 !important;
      border-color: #1e7e34 !important;
      color: #ffffff !important;
    }

    /* Кнопка отклонить в модалке - КРАСНАЯ */
    .modal-dialog button.btn-warning,
    .modal-footer button.btn-warning,
    .modal-footer > button.btn-warning {
      background-color: #dc3545 !important;
      background-image: none !important;
      border: 1px solid #dc3545 !important;
      color: #ffffff !important;
      font-weight: 500 !important;
      order: 2 !important;
      height: 38px !important;
      width: 108px !important;
      min-width: 108px !important;
      margin: 0 !important;
    }
    .modal-dialog button.btn-warning:hover,
    .modal-footer button.btn-warning:hover {
      background-color: #c82333 !important;
      border-color: #bd2130 !important;
      color: #ffffff !important;
    }

    /* Кнопка отклонить в таблице репортов - контурная красная под стиль кнопки 'Просмотр' */
    table.table button.btn-outline-warning {
      background-color: transparent !important;
      background-image: none !important;
      border-color: #dc3545 !important;
      color: #dc3545 !important;
    }
    table.table button.btn-outline-warning:hover {
      background-color: #dc3545 !important;
      border-color: #dc3545 !important;
      color: #ffffff !important;
    }

    #dictInputContainer {
      margin: 12px 0 0 0 !important;
      padding: 0 !important;
      flex: 1 1 100% !important;
      width: 100% !important;
      max-width: 100% !important;
      order: 10 !important;
      display: flex !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
      gap: 8px !important;
    }

    #dictInputContainer .btn,
    #dictInputContainer input {
      margin: 0 !important;
    }

    #dictInputContainer #textInput {
      flex: 1 1 auto !important;
      width: auto !important;
      min-width: 140px !important;
      height: 38px !important;
    }

    #dictInputContainer .btn {
      height: 38px !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      white-space: nowrap !important;
    }
  `;
  (document.head || document.documentElement).appendChild(style);
}
injectMuteInputStyles();

async function styleViolatorAndReporter() {
  const data = await getStorageAsync({ 
    isEnabled3: true,
    isOnlineStatusEnabled: true,
    isHeadsEnabled: true,
    isCompactModeEnabled: true,
    isUnmuteTimeEnabled: true,
    isServerInfoEnabled: true,
    isDictHighlightEnabled: true,
    isDictFuzzyDepth: 3
  });
  syncSettingsFromStorage(data);

  function extractUsername(el) {
    if (!el) return null;
    if (el.dataset.vwUsername) return el.dataset.vwUsername;
    const link = el.querySelector && el.querySelector('a[href*="usernames?name="]');
    if (link) {
      try {
        const url = new URL(link.href, window.location.origin);
        const nameParam = url.searchParams.get('name');
        if (nameParam) return decodeURIComponent(nameParam).trim();
      } catch (e) {
        const m = link.href.match(/name=([^&]+)/i);
        if (m) return decodeURIComponent(m[1]).trim();
      }
      if (link.getAttribute('aria-label')) {
        const m = link.getAttribute('aria-label').match(/История ника\s+(.+)/i);
        if (m) return m[1].trim();
      }
    }
    const rawText = el.textContent || '';
    const cleaned = rawText.replace(/\[.*?\]/g, '').trim();
    const parts = cleaned.split(/\s+/).filter(p => /^[a-zA-Z0-9_а-яА-ЯёЁ]{2,16}$/.test(p));
    return parts[0] || parts.pop() || null;
  }

  const applyStyling = (element, user) => {
    if (!element || !user) return;
    element.dataset.vwUsername = user.username;
    const rankInfo = getRankInfoReporter(user.rank) || { label: "", defaultColor: "" };

    const historyLink = element.querySelector('a[href*="/staff/usernames"]');
    element.innerHTML = ''; 
    
    const wrapper = document.createElement("span");
    wrapper.dataset.vwWrapper = "true"; 
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";

    if (isOnlineStatusEnabled && user.online) {
        const indicator = createStatusIndicator(user);
        if (indicator) {
            indicator.style.marginRight = "4px";
            wrapper.appendChild(indicator);
        }
    }

    if (isHeadsEnabled) {
        const headImg = document.createElement("img");
        headImg.src = `https://skin.vimeworld.com/helm/${encodeURIComponent(user.username)}.png`;
        headImg.style.width = "14px";
        headImg.style.height = "14px";
        headImg.style.marginRight = "4px";
        headImg.style.borderRadius = "2px";
        headImg.style.imageRendering = "pixelated";
        wrapper.appendChild(headImg);
    }

    if (isEnabled3) {
      const isDeveloper = user.username.toLowerCase() === 'kaossent' || user.username.toLowerCase() === '__skeletron__' || user.username.toLowerCase() === 'kaicenat' || user.username.toLowerCase() === 'Moderator_Denis';
      if (isDeveloper) {
        const starSpan = document.createElement('span');
        starSpan.className = 'developer-star';
        starSpan.textContent = '★';
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = 'Разработчик';
        starSpan.appendChild(tooltip);
        wrapper.appendChild(starSpan); 
      }

      const prefixLabel = user.prefix ? `[${user.prefix}]` : (rankInfo && rankInfo.label ? rankInfo.label : "");
      if (prefixLabel) {
        const prefixSpan = document.createElement("span");
        prefixSpan.textContent = prefixLabel;
        prefixSpan.style.color = getFirstColor(rankInfo.defaultColor);
        prefixSpan.style.fontWeight = "bold";
        prefixSpan.style.marginRight = "4px"; 
        wrapper.appendChild(prefixSpan);
      }

      const nickSpan = document.createElement("span");
      nickSpan.textContent = user.username;
      applyGradient(nickSpan, user.customColors || [], rankInfo.defaultColor);
      wrapper.appendChild(nickSpan);
    } else {
      const nickSpan = document.createElement("span");
      nickSpan.textContent = user.username;
      wrapper.appendChild(nickSpan);
    }

    element.appendChild(wrapper);
    if (historyLink) {
      historyLink.style.marginLeft = "6px";
      element.appendChild(historyLink);
    }
  };

  let violatorEl = document.getElementById("mr_violator");
  let reporterEl = document.getElementById("mr_reporter");
  let moderEl = document.getElementById("mr_alert_muted_moder");
  let deletedModerEl = document.getElementById("mr_alert_deleted_moder");
  let mutedBlock = document.getElementById("mr_alert_muted");
  let deletedBlock = document.getElementById("mr_alert_deleted");
  let durationEl = document.getElementById("mr_alert_muted_duration");

  const modalBody = document.querySelector(".modal-body");
  if (modalBody) {
    formatVwDates(modalBody);
    formatModalMessages();

    const charCounter = modalBody.querySelector('.row.g-2 .small, .row.g-2 div.small');
    if (charCounter) charCounter.style.setProperty('display', 'none', 'important');

    injectMuteInputStyles();
    const minInput = modalBody.querySelector('input[type="number"], input[placeholder*="Минут"]');
    const reasonInput = modalBody.querySelector('input[placeholder*="Причина"]');
    if (minInput) {
      minInput.style.setProperty('background-color', '#212529', 'important');
      minInput.style.setProperty('border', '1px solid #495057', 'important');
      minInput.style.setProperty('color', '#f1f3f5', 'important');
      minInput.style.setProperty('border-radius', '6px', 'important');
      minInput.style.setProperty('height', '38px', 'important');
    }
    if (reasonInput) {
      reasonInput.style.setProperty('background-color', '#212529', 'important');
      reasonInput.style.setProperty('border', '1px solid #495057', 'important');
      reasonInput.style.setProperty('color', '#f1f3f5', 'important');
      reasonInput.style.setProperty('border-radius', '6px', 'important');
      reasonInput.style.setProperty('height', '38px', 'important');
    }

    const inputsRow = modalBody.querySelector('.row.g-2');
    const modalFooter = document.querySelector('.modal-footer');

    const isConfirmation = Boolean(modalFooter && (
      modalFooter.classList.contains('justify-content-between') ||
      modalFooter.querySelector('button.btn-secondary')
    ));

    if (inputsRow) {
      inputsRow.style.setProperty('position', 'relative', 'important');
      inputsRow.style.setProperty('z-index', '10', 'important');
      inputsRow.style.setProperty('padding-right', '232px', 'important');
      inputsRow.style.setProperty('pointer-events', 'none', 'important');
      inputsRow.style.setProperty('margin-top', isConfirmation ? '36px' : '0', 'important');
      Array.from(inputsRow.children).forEach(child => {
        child.style.setProperty('pointer-events', 'auto', 'important');
        child.style.setProperty('margin', '0', 'important');
      });
    }

    if (modalFooter) {
      modalFooter.style.setProperty('background', 'transparent', 'important');
      modalFooter.style.setProperty('background-color', 'transparent', 'important');
      modalFooter.style.setProperty('border', 'none', 'important');
      modalFooter.style.setProperty('border-top', 'none', 'important');
      modalFooter.style.setProperty('border-color', 'transparent', 'important');
      modalFooter.style.setProperty('display', 'flex', 'important');
      modalFooter.style.setProperty('flex-wrap', 'wrap', 'important');
      modalFooter.style.setProperty('gap', '8px', 'important');
      modalFooter.style.setProperty('align-items', 'center', 'important');
      modalFooter.style.setProperty('justify-content', 'flex-end', 'important');
      modalFooter.style.setProperty('padding', '0 16px 16px 16px', 'important');
      modalFooter.style.setProperty('margin-top', '-36px', 'important');
      modalFooter.style.setProperty('position', 'relative', 'important');
      modalFooter.style.setProperty('z-index', '20', 'important');
      modalFooter.style.setProperty('pointer-events', 'none', 'important');

      // Remove any previously inserted close button
      const existingClose = modalFooter.querySelector('.vw-btn-close');
      if (existingClose) existingClose.remove();

      if (isConfirmation) {
        const confirmSpan = modalFooter.querySelector('span');
        if (confirmSpan) {
          confirmSpan.style.setProperty('position', 'absolute', 'important');
          confirmSpan.style.setProperty('top', '-34px', 'important');
          confirmSpan.style.setProperty('left', '16px', 'important');
          confirmSpan.style.setProperty('right', '16px', 'important');
          confirmSpan.style.setProperty('height', '28px', 'important');
          confirmSpan.style.setProperty('display', 'block', 'important');
          confirmSpan.style.setProperty('line-height', '28px', 'important');
          confirmSpan.style.setProperty('font-size', '0.95rem', 'important');
          confirmSpan.style.setProperty('color', '#f1f3f5', 'important');
          confirmSpan.style.setProperty('pointer-events', 'auto', 'important');
          confirmSpan.style.setProperty('white-space', 'nowrap', 'important');
          confirmSpan.style.setProperty('overflow', 'hidden', 'important');
          confirmSpan.style.setProperty('text-overflow', 'ellipsis', 'important');
          confirmSpan.style.setProperty('z-index', '25', 'important');
        }

        const confirmButtonsDiv = modalFooter.querySelector('.d-flex.gap-2, div.d-flex');
        if (confirmButtonsDiv) {
          confirmButtonsDiv.style.setProperty('display', 'inline-flex', 'important');
          confirmButtonsDiv.style.setProperty('align-items', 'center', 'important');
          confirmButtonsDiv.style.setProperty('gap', '8px', 'important');
          confirmButtonsDiv.style.setProperty('margin', '0', 'important');
          confirmButtonsDiv.style.setProperty('padding', '0', 'important');
          confirmButtonsDiv.style.setProperty('pointer-events', 'auto', 'important');
        }

        const secondaryBtns = modalFooter.querySelectorAll('button.btn-secondary');
        secondaryBtns.forEach(btn => {
          btn.style.setProperty('background-color', '#6c757d', 'important');
          btn.style.setProperty('background-image', 'none', 'important');
          btn.style.setProperty('border', '1px solid #6c757d', 'important');
          btn.style.setProperty('color', '#ffffff', 'important');
          btn.style.setProperty('font-weight', '500', 'important');
          btn.style.setProperty('height', '38px', 'important');
          btn.style.setProperty('width', '108px', 'important');
          btn.style.setProperty('min-width', '108px', 'important');
          btn.style.setProperty('margin', '0', 'important');
          btn.style.setProperty('border-radius', '6px', 'important');
          btn.style.setProperty('box-sizing', 'border-box', 'important');
          btn.style.setProperty('display', 'inline-flex', 'important');
          btn.style.setProperty('align-items', 'center', 'important');
          btn.style.setProperty('justify-content', 'center', 'important');
          btn.style.setProperty('pointer-events', 'auto', 'important');
        });
      }

      const muteBtns = modalFooter.querySelectorAll('button.btn-danger');
      muteBtns.forEach(btn => {
        btn.style.setProperty('background-color', '#28a745', 'important');
        btn.style.setProperty('background-image', 'none', 'important');
        btn.style.setProperty('border-color', '#28a745', 'important');
        btn.style.setProperty('color', '#ffffff', 'important');
        btn.style.setProperty('font-weight', '500', 'important');
        btn.style.setProperty('height', '38px', 'important');
        btn.style.setProperty('width', '108px', 'important');
        btn.style.setProperty('min-width', '108px', 'important');
        btn.style.setProperty('margin', '0', 'important');
        btn.style.setProperty('border-radius', '6px', 'important');
        btn.style.setProperty('box-sizing', 'border-box', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        if (!isConfirmation) {
          btn.style.setProperty('order', '1', 'important');
          if (btn.textContent.trim() === 'Выдать мут') {
            btn.textContent = 'Мут';
          }
        }
      });

      const rejectBtns = modalFooter.querySelectorAll('button.btn-warning');
      rejectBtns.forEach(btn => {
        btn.style.setProperty('background-color', '#dc3545', 'important');
        btn.style.setProperty('background-image', 'none', 'important');
        btn.style.setProperty('border-color', '#dc3545', 'important');
        btn.style.setProperty('color', '#ffffff', 'important');
        btn.style.setProperty('font-weight', '500', 'important');
        btn.style.setProperty('height', '38px', 'important');
        btn.style.setProperty('width', '108px', 'important');
        btn.style.setProperty('min-width', '108px', 'important');
        btn.style.setProperty('margin', '0', 'important');
        btn.style.setProperty('border-radius', '6px', 'important');
        btn.style.setProperty('box-sizing', 'border-box', 'important');
        btn.style.setProperty('pointer-events', 'auto', 'important');
        if (!isConfirmation) {
          btn.style.setProperty('order', '2', 'important');
        }
      });

      const dictContainer = document.getElementById('dictInputContainer');
      if (dictContainer) {
        dictContainer.style.setProperty('margin', '12px 0 0 0', 'important');
        dictContainer.style.setProperty('padding', '0', 'important');
        dictContainer.style.setProperty('width', '100%', 'important');
        dictContainer.querySelectorAll('.btn, input').forEach(el => {
          el.style.setProperty('margin', '0', 'important');
          el.style.setProperty('pointer-events', 'auto', 'important');
        });
      }
    }


    if (!violatorEl || !reporterEl) {
      const col3s = modalBody.querySelectorAll(".col-sm-3, .col-3, dt");
      for (const col of col3s) {
        const text = col.textContent.trim();
        if (text === "Нарушитель" && !violatorEl) {
          violatorEl = col.nextElementSibling;
        } else if (text === "Отправитель" && !reporterEl) {
          reporterEl = col.nextElementSibling;
        }
      }
    }
    if (!mutedBlock) {
      const alerts = modalBody.querySelectorAll(".alert-success");
      for (const alert of alerts) {
        if (alert.textContent.includes("выдал мут") || alert.textContent.includes("мут")) {
          mutedBlock = alert;
          moderEl = alert.querySelector("b, span");
          const mMatch = alert.textContent.match(/на\s+(\d+)\s+мин/);
          if (mMatch) {
            const bTags = alert.querySelectorAll("b");
            for (const b of bTags) {
              if (b.textContent.trim() === mMatch[1]) {
                durationEl = b;
                break;
              }
            }
          }
          break;
        }
      }
    }
    if (!deletedBlock) {
      const warnings = modalBody.querySelectorAll(".alert-warning");
      for (const warn of warnings) {
        if (warn.textContent.includes("отклонен")) {
          deletedBlock = warn;
          deletedModerEl = warn.querySelector("b, span");
          break;
        }
      }
    }
  }

  const tasks = [];

  if (violatorEl) {
    tasks.push((async () => {
      if (violatorEl.querySelector('[data-vw-wrapper="true"]')) return;
      const name = extractUsername(violatorEl);
      if (!name) return; 
      
      const user = await fetchUserData(name);
      if (user) applyStyling(violatorEl, user);
    })());
  }

  if (reporterEl) {
    tasks.push((async () => {
      if (reporterEl.querySelector('[data-vw-wrapper="true"]')) return;
      const name = extractUsername(reporterEl); 
      if (!name) return;

      const user = await fetchUserData(name);
      if (user) applyStyling(reporterEl, user);
    })());
  }

  if (moderEl) {
    tasks.push((async () => {
        if (moderEl.querySelector('[data-vw-wrapper="true"]')) return;
        const name = extractUsername(moderEl);
        if (!name) return;
        const user = await fetchUserData(name);
        if (user) applyStyling(moderEl, user);
    })());
  }

  if (deletedModerEl) {
    tasks.push((async () => {
      if (deletedModerEl.querySelector('[data-vw-wrapper="true"]')) return;
      const name = extractUsername(deletedModerEl);
      if (!name) return;

      const user = await fetchUserData(name);
      if (user) applyStyling(deletedModerEl, user);
    })());
  }

  if (mutedBlock) {
    if (isCompactModeEnabled) {
      mutedBlock.style.setProperty('padding', '6px 12px', 'important');
      mutedBlock.style.setProperty('margin-bottom', '10px', 'important');
      mutedBlock.style.setProperty('font-size', '13.5px', 'important');

      if (moderEl) {
        const childNodes = Array.from(mutedBlock.childNodes);
        for (const node of childNodes) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("Модератор")) {
            node.textContent = node.textContent.replace("Модератор", "").trim();
          }
        }
      }

      const dateDiv = mutedBlock.querySelector('.small:not(#vw_expire_wrapper):not(.text-success), div.small:not(#vw_expire_wrapper):not(.text-success)');
      if (dateDiv && !mutedBlock.querySelector('.vw-alert-date')) {
        const dateText = dateDiv.textContent.trim();
        dateDiv.remove();

        const dateSpan = document.createElement('span');
        dateSpan.className = 'vw-alert-date';
        dateSpan.textContent = dateText + ' | ';
        dateSpan.style.setProperty('font-weight', '500', 'important');
        dateSpan.style.setProperty('margin-right', '5px', 'important');
        dateSpan.style.setProperty('color', 'inherit', 'important');
        mutedBlock.insertBefore(dateSpan, mutedBlock.firstChild);
      }
    } else {
      mutedBlock.style.removeProperty('padding');
      mutedBlock.style.removeProperty('margin-bottom');
      mutedBlock.style.removeProperty('font-size');
      const dateSpan = mutedBlock.querySelector('.vw-alert-date');
      if (dateSpan) {
        const dateText = dateSpan.textContent.replace(/\s*\|\s*$/, '').trim();
        dateSpan.remove();
        const dateDiv = document.createElement('div');
        dateDiv.className = 'small';
        dateDiv.textContent = dateText;
        mutedBlock.appendChild(dateDiv);
      }
    }
  }

  if (deletedBlock) {
    if (isCompactModeEnabled) {
      deletedBlock.style.setProperty('padding', '6px 12px', 'important');
      deletedBlock.style.setProperty('margin-bottom', '10px', 'important');
      deletedBlock.style.setProperty('font-size', '13.5px', 'important');
      deletedBlock.style.setProperty('line-height', '1.4', 'important');

      if (deletedModerEl) {
        const childNodes = Array.from(deletedBlock.childNodes);
        for (let i = 0; i < childNodes.length; i++) {
          const node = childNodes[i];
          if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("модератором")) {
            node.textContent = node.textContent.replace("модератором", "").trim();
            const next = childNodes[i + 1];
            if (next && next.nodeType === Node.ELEMENT_NODE && next.tagName === "B") {
              node.textContent += " ";
            }
          }
        }
      }

      const dateDiv = deletedBlock.querySelector('.small, div.small');
      if (dateDiv && !deletedBlock.querySelector('.vw-alert-date')) {
        const dateText = dateDiv.textContent.trim();
        dateDiv.remove();

        const dateSpan = document.createElement('span');
        dateSpan.className = 'vw-alert-date';
        dateSpan.textContent = dateText + ' | ';
        dateSpan.style.setProperty('font-weight', '500', 'important');
        dateSpan.style.setProperty('margin-right', '5px', 'important');
        dateSpan.style.setProperty('color', 'inherit', 'important');
        deletedBlock.insertBefore(dateSpan, deletedBlock.firstChild);
      }
    } else {
      deletedBlock.style.removeProperty('padding');
      deletedBlock.style.removeProperty('margin-bottom');
      deletedBlock.style.removeProperty('font-size');
      deletedBlock.style.removeProperty('line-height');
      const dateSpan = deletedBlock.querySelector('.vw-alert-date');
      if (dateSpan) {
        const dateText = dateSpan.textContent.replace(/\s*\|\s*$/, '').trim();
        dateSpan.remove();
        const dateDiv = document.createElement('div');
        dateDiv.className = 'small';
        dateDiv.textContent = dateText;
        deletedBlock.appendChild(dateDiv);
      }
    }
  }

  if (durationEl) {
    let minutes = parseInt(durationEl.dataset.rawMinutes || durationEl.textContent.trim(), 10);
    if (!isNaN(minutes)) {
      durationEl.dataset.rawMinutes = String(minutes);
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;

      let readable = [];
      if (days > 0) readable.push(`${days} дн.`);
      if (hours > 0) readable.push(`${hours} ч.`);
      if (mins > 0 || (days === 0 && hours === 0)) readable.push(`${mins} мин.`);

      if (!durationEl.dataset.formatted) {
        durationEl.textContent = `(${readable.join(" ")}) ${minutes} `;
        durationEl.dataset.formatted = "true";
      }
    }
  }

  if (mutedBlock) {
    if (!isUnmuteTimeEnabled) {
      const existingTimer = document.getElementById("vw_expire_wrapper");
      if (existingTimer) existingTimer.remove();
      if (window.vwModalMuteTimer) {
        clearInterval(window.vwModalMuteTimer);
        window.vwModalMuteTimer = null;
      }
    } else {
      if (!document.getElementById("vw_custom_expire_text")) {
        let minutes = 0;
        if (durationEl && durationEl.dataset.rawMinutes) {
          minutes = parseInt(durationEl.dataset.rawMinutes, 10) || 0;
        }
        if (!minutes) {
          const m = mutedBlock.textContent.match(/на\s+(?:\([^)]+\)\s*)?(\d+)\s*мин/);
          if (m) minutes = parseInt(m[1], 10) || 0;
        }

        let startDate = null;
        const dateText = mutedBlock.querySelector('.small, .text-muted, .vw-alert-date')?.textContent || mutedBlock.textContent;
        // Match Russian date: DD.MM.YYYY, HH:MM[:SS]
        const ruMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{4}),?\s+(\d{2}):(\d{2})(?::(\d{2}))?/);
        if (ruMatch) {
          const day = parseInt(ruMatch[1], 10);
          const month = parseInt(ruMatch[2], 10) - 1;
          const year = parseInt(ruMatch[3], 10);
          const hour = parseInt(ruMatch[4], 10);
          const min = parseInt(ruMatch[5], 10);
          const sec = ruMatch[6] ? parseInt(ruMatch[6], 10) : 0;
          startDate = new Date(year, month, day, hour, min, sec);
        } else {
          // Fallback for US date: MM/DD/YYYY, HH:MM[:SS] AM/PM
          const usMatch = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
          if (usMatch) {
            const month = parseInt(usMatch[1], 10) - 1;
            const day = parseInt(usMatch[2], 10);
            const year = parseInt(usMatch[3], 10);
            let hour = parseInt(usMatch[4], 10);
            const min = parseInt(usMatch[5], 10);
            const sec = usMatch[6] ? parseInt(usMatch[6], 10) : 0;
            if (usMatch[7]) {
              const isPM = usMatch[7].toUpperCase() === 'PM';
              if (isPM && hour < 12) hour += 12;
              else if (!isPM && hour === 12) hour = 0;
            }
            startDate = new Date(year, month, day, hour, min, sec);
          }
        }

        if (minutes > 0 && startDate && !isNaN(startDate.getTime())) {
          const endDate = new Date(startDate.getTime() + minutes * 60 * 1000);
          const timerContainer = document.createElement("div");
          timerContainer.id = "vw_expire_wrapper";
          timerContainer.className = "small mt-1 text-success fw-bold";
          timerContainer.innerHTML = `⏳ Истекает: <span id="vw_custom_expire_text"></span>`;
          mutedBlock.appendChild(timerContainer);

          const expireEl = document.getElementById("vw_custom_expire_text");
          function updateExpire() {
            if (!expireEl || !document.contains(expireEl)) return true;
            const now = Date.now();
            if (now >= endDate.getTime()) {
              expireEl.textContent = "Истек";
              return true;
            }
            const diff = endDate.getTime() - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 60000) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            let remainStr = "";
            if (days > 0) remainStr += `${days}д `;
            if (hours > 0 || days > 0) remainStr += `${hours}ч `;
            remainStr += `${mins}м ${secs}с`;

            const today = new Date();
            const sameDay = today.toDateString() === endDate.toDateString();
            const endStr = sameDay
              ? endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : endDate.toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace('.', '');

            expireEl.textContent = `${endStr} (через ${remainStr})`;
            return false;
          }

          updateExpire();
          if (window.vwModalMuteTimer) clearInterval(window.vwModalMuteTimer);
          window.vwModalMuteTimer = setInterval(() => {
            if (updateExpire()) {
              clearInterval(window.vwModalMuteTimer);
              window.vwModalMuteTimer = null;
            }
          }, 1000);
        }
      }
    }
  }

  await Promise.all(tasks);
}

function scheduleStyle() {
  if (isStyling) return;
  if (styleTimeout) clearTimeout(styleTimeout);
  
  styleTimeout = setTimeout(() => {
    isStyling = true;
    styleViolatorAndReporter()
      .catch(err => console.error("styleViolatorAndReporter error:", err))
      .finally(() => {
        isStyling = false;
      });
  }, 100);
}

modalObserver = new MutationObserver((mutations) => {
  let modalRelevant = false;
  let tableRelevant = false;

  for (const m of mutations) {
    const targetEl = m.target;
    if (targetEl && targetEl.nodeType === 1) {
      if (targetEl.closest && (targetEl.closest('.modal') || targetEl.closest('.modal-dialog') || targetEl.closest('.modal-body') || targetEl.closest('.modal-footer'))) {
        modalRelevant = true;
      }
      if (targetEl.closest && (targetEl.closest('table.table') || targetEl.tagName === 'TBODY' || targetEl.tagName === 'TR')) {
        tableRelevant = true;
      }
    }

    if (m.type === "childList" && m.addedNodes.length > 0) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1) {
          if (n.classList?.contains('modal') || n.classList?.contains('modal-dialog') || n.classList?.contains('modal-body') ||
              (n.querySelector && n.querySelector('.modal, .modal-dialog, .modal-body, .modal-footer, dl.row, .alert'))) {
            modalRelevant = true;
          }
          if (n.tagName === 'TR' || n.tagName === 'TBODY' || n.classList?.contains('table') ||
              (n.querySelector && n.querySelector('table, tbody, tr'))) {
            tableRelevant = true;
          }
        }
      }
    }
    if (modalRelevant && tableRelevant) break;
  }

  if (modalRelevant) {
    scheduleStyle();
    createInputField();
    formatVwDates();
  }

  if (tableRelevant) {
    processRows();
    formatVwDates();
  }
});

try {
  modalObserver.observe(document.body, observerConfig);
} catch (e) {
  document.addEventListener("DOMContentLoaded", () => {
    modalObserver.observe(document.body, observerConfig);
  });
}

// Калькулятор мутов 
(function () {
  function isCalculatorUrl() {
    const url = window.location.href;
    return url.includes("legacy-cp.vimeworld.com/moder/reports") || 
           url.includes("cp.vimeworld.com/moder/reports") || 
           url.includes("cp.vimeworld.com/staff/reports");
  }

  const calcStyle = document.createElement("style");
  calcStyle.textContent = `
    #muteCalcPanel button[data-capped="true"] {
        background: #b86e00a4 !important;
        opacity: 0.8;
    }
  `;
  document.head.appendChild(calcStyle);

  function updateCalcTheme(isDark) {
    let style = document.getElementById("mute-calc-light-theme");
    if (!isDark) {
      if (!style) {
        style = document.createElement("style");
        style.id = "mute-calc-light-theme";
        style.textContent = `
          #muteCalcPanel { background: #ffffff !important; color: #000 !important; }
          .muteCalcInput { background: #f9f9f9 !important; border: 1px solid #ccc !important; color: #000 !important; }
          #muteCalcPanel button[data-capped="true"] { background: #b86e00a4 !important; }
          #muteCalcPanel button[data-tooltip]:hover::after { background: #555 !important; color: #fff !important; }
        `;
        document.head.appendChild(style);
      }
    } else {
      if (style) style.remove();
    }
  }

  chrome.storage.sync.get({ isEnabled2: true }, (data) => {
    updateCalcTheme(data.isEnabled2);
  });

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.isEnabled2 !== undefined) {
        updateCalcTheme(changes.isEnabled2.newValue);
      }
    });
  }

  // Кнопка открытия
  const toggle = document.createElement("button");
  toggle.id = "muteCalcToggle";
  toggle.style.backgroundImage = `url("${chrome.runtime.getURL("vimecalculator.png")}")`;

  // Панель
  const panel = document.createElement("div");
  panel.id = "muteCalcPanel";

  function ensureCalculatorAttached() {
    if (!isCalculatorUrl()) {
      if (toggle.parentElement) toggle.remove();
      if (panel.parentElement) panel.remove();
      return;
    }
    if (!document.body.contains(toggle)) {
      document.body.appendChild(toggle);
    }
    if (!document.body.contains(panel)) {
      document.body.appendChild(panel);
    }
  }

  ensureCalculatorAttached();
  setInterval(ensureCalculatorAttached, 1000);

  let totalMinutes = 0;
  let matOskSum = 0;
  let hasPolitics = false;
  let reasonsList = new Set();

  const warning = document.createElement("div");
  warning.id = "muteCalcWarning";
  warning.textContent = "Не забудьте забанить / подать жалобу на игрока!";
  panel.appendChild(warning);

  //Поля Время и Причина 
  const inputsRow = document.createElement("div");
  inputsRow.className = "muteCalcInputsRow";

  const timeInput = document.createElement("input");
  timeInput.type = "text";
  timeInput.id = "muteCalcTimeInput";
  timeInput.className = "muteCalcInput";
  timeInput.placeholder = "Время";
  inputsRow.appendChild(timeInput);

  const reasonInput = document.createElement("input");
  reasonInput.type = "text";
  reasonInput.id = "muteCalcReasonInput";
  reasonInput.className = "muteCalcInput";
  reasonInput.placeholder = "Причина";
  inputsRow.appendChild(reasonInput);

  panel.appendChild(inputsRow);

  function setReactInputValue(input, value) {
    if (!input) return;
    const proto = window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function getModalMuteInputs() {
    const extTime = document.getElementById("mr_itime") || 
      document.querySelector('.modal-body input[type="number"][placeholder*="Минут"]') ||
      document.querySelector('.modal-body input[type="number"]');

    const extReason = document.getElementById("mr_ireason") || 
      document.querySelector('.modal-body input[placeholder*="Причина мута"]');

    return { extTime, extReason };
  }

  timeInput.addEventListener('input', () => {
    const { extTime } = getModalMuteInputs();
    if (extTime) setReactInputValue(extTime, timeInput.value);
  });

  reasonInput.addEventListener('input', () => {
    const { extReason } = getModalMuteInputs();
    if (extReason) setReactInputValue(extReason, reasonInput.value);
  });

  // Подпись времени
  const totalLabel = document.createElement("div");
  totalLabel.id = "muteCalcTotal";
  totalLabel.textContent = `0 дн. 0 ч.`;

  const matOskLabel = document.createElement("div");
  matOskLabel.id = "muteCalcMatOsk";
  matOskLabel.textContent = `Неадекватное поведение: 0 / 1440`;

  const infoRow = document.createElement("div");
  infoRow.className = "muteCalcInfoRow";

  infoRow.appendChild(totalLabel);
  infoRow.appendChild(matOskLabel);

  panel.appendChild(infoRow);

  //Восстановление состояния из localStorage
  function loadState() {
    const saved = localStorage.getItem("muteCalcState");
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      if (state.left) panel.style.left = state.left;
      if (state.top) panel.style.top = state.top;
      if (state.width) panel.style.width = state.width;
      if (state.height) panel.style.height = state.height;
      if (state.active) panel.classList.add("active");
    } catch (e) {}
  }

  function saveState() {
    const state = {
      left: panel.style.left || "",
      top: panel.style.top || "",
      width: panel.style.width || "",
      height: panel.style.height || "",
      active: panel.classList.contains("active"),
    };
    localStorage.setItem("muteCalcState", JSON.stringify(state));
  }

  loadState();

  function formatTime(minutes) {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return `${days} дн. ${hours} ч.`;
  }

  function updateFields() {
    const { extTime, extReason } = getModalMuteInputs();

    let reasonStr = "";
    if (reasonsList.size >= 5) {
      reasonStr = "Многочисленные нарушения";
    } else {
      reasonStr = [...reasonsList].join(" + ");
    }

    if (extTime) setReactInputValue(extTime, totalMinutes > 0 ? totalMinutes : "");
    if (extReason) setReactInputValue(extReason, reasonStr);

    timeInput.value = totalMinutes > 0 ? totalMinutes : "";
    reasonInput.value = reasonStr;
    totalLabel.textContent = formatTime(totalMinutes);

    if (hasPolitics) {
      matOskLabel.textContent = `Неадекватное поведение: 2880 / 1440`;
    } else {
      matOskLabel.textContent = `Неадекватное поведение: ${Math.min(matOskSum, 1440)} / 1440`;
    }
  }

  function updateStateFromButtons() {
      totalMinutes = 0;
      matOskSum = 0;
      hasPolitics = false;
      reasonsList.clear();

      let allBtns = [...panel.querySelectorAll("button[data-calc-btn='true']")];
      let polBtn = allBtns.find(b => b.textContent === "Политическая агитация");
      if (polBtn && parseInt(polBtn.dataset.clicks) > 0) {
          hasPolitics = true;
      }

      allBtns.forEach(btn => {
          let clicks = parseInt(btn.dataset.clicks) || 0;
          if (clicks === 0) return; 

          let reason = btn.textContent;
          let type = btn.dataset.type;
          let minutes = parseInt(btn.dataset.minutes);

          if (["Мат/Аморал", "Оскорбление игроков", "Оскорбление игроков + Мат", "Политическая агитация"].includes(reason)) {
              reasonsList.add("Неадекватное поведение");
          } else {
              reasonsList.add(reason);
          }
          if (reason === "Политическая агитация") {
              totalMinutes += 2880;
          } else if (type === "mat" || type === "osk" || type === "matosk") {
              matOskSum += (minutes * clicks);
          } else if (["Продажа услуг за вимеры", "Продажа неигровых вещей за вимеры", "Продажа вимеров", "Покупка вимеров"].includes(reason)) {
              totalMinutes += 21600;
          } else if (["Продажа вещей за реальные деньги", "Продажа услуг за реальные деньги"].includes(reason)) {
              totalMinutes += 43200;
          } else {
              totalMinutes += (minutes * clicks);
          }
      });

      // Лимит неадекватного поведения
      if (!hasPolitics) {
          totalMinutes += Math.min(matOskSum, 1440);
      }

      allBtns.forEach(btn => {
          let type = btn.dataset.type;
          let clicks = parseInt(btn.dataset.clicks) || 0;

          if (type === "mat" || type === "osk" || type === "matosk") {
              if (matOskSum >= 1440 || hasPolitics) {
                  btn.setAttribute('data-capped', 'true');
              } else {
                  btn.removeAttribute('data-capped');
              }
          } else {
              if (clicks > 0) {
                  btn.setAttribute('data-capped', 'true');
              } else {
                  btn.removeAttribute('data-capped');
              }
          }
      });

      updateFields();
  }

  // Drag & Drop 
  function enableDragAndDrop(container) {
    let dragged;

    container.addEventListener("dragstart", e => {
      if (e.target.tagName === "BUTTON") {
        dragged = e.target;
        e.dataTransfer.effectAllowed = "move";
      }
    });

    container.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      const target = e.target;
      if (target.tagName === "BUTTON" && target !== dragged && target.dataset.calcBtn === 'true') {
        const rect = target.getBoundingClientRect();
        const offset = e.clientY - rect.top;
        if (offset > rect.height / 2) {
          target.after(dragged);
        } else {
          target.before(dragged);
        }
      }
    });

    container.addEventListener("drop", e => {
      e.preventDefault();
      saveButtonsOrder(container);
    });
  }

  function saveButtonsOrder(container) {
    const order = [...container.querySelectorAll("button[data-calc-btn='true']")].map(b => b.textContent);
    localStorage.setItem("muteCalcButtonsOrder", JSON.stringify(order));
  }

  function restoreButtonsOrder(container) {
    const saved = localStorage.getItem("muteCalcButtonsOrder");
    if (!saved) return;
    try {
      const order = JSON.parse(saved);
      const buttons = [...container.querySelectorAll("button[data-calc-btn='true']")];
      order.forEach(text => {
        const btn = buttons.find(b => b.textContent === text);
        if (btn) container.appendChild(btn);
      });
    } catch {}
  }

  // Причины
  const reasons = [
    ["Flood", 60, "flood"],
    ["Flood символами", 60, "flood"],
    ["Caps Lock", 60],
    ["Голосование", 60],
    ["Мат/Аморал", 120, "mat"],
    ["Оскорбление игроков", 240, "osk"],
    ["Оскорбление игроков + Мат", 360, "matosk"],
    ["Оскорбление родственников", 2880],
    ["Оскорбление Персонала", 2880],
    ["Неуважительное общение с Персоналом", 2880],
    ["Оскорбление Администрации", 2880],
    ["Неуважительное общение с Администрацией", 2880],
    ["Оскорбление проекта", 43200],
    ["Выдача себя за Персонал", 2880],
    ["Выдача себя за Администрацию", 10080],
    ["Пиар сторонних ресурсов", 2880],
    ["Реклама другого проекта", 10080],
    ["Оффтоп", 1440],
    ["Политическая агитация", 2880],
    ["Обман игроков", 240],
    ["Призыв к суициду", 240],
    ["Провокация игроков", 43200],
    ["Продажа вимеров", 21600],
    ["Покупка вимеров", 21600],
    ["Продажа услуг за вимеры", 21600],
    ["Продажа неигровых вещей за вимеры", 21600],
    ["Продажа вещей за реальные деньги", 43200],
    ["Продажа услуг за реальные деньги", 43200],
    ["Продажа аккаунта", 1440, null, true],
    ["Покупка аккаунта", 1440, null, true],
    ["Передача аккаунта", 1440, null, true],
    ["Пропаганда наркотиков", 1440, null, true],
    ["Пропаганда фашизма", 1440, null, true],
    ["Распространение читов", 1440, null, true],
    ["Распространение багов", 1440, null, true],
  ];

  reasons.forEach(([text, minutes, type, special]) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.setAttribute("data-tooltip", `+${minutes} минут`);
    btn.setAttribute("data-calc-btn", "true");
    btn.dataset.minutes = minutes;
    btn.dataset.type = type || "default";
    btn.dataset.special = special || "false";
    btn.dataset.clicks = "0";
    btn.draggable = true;
    if (special) btn.classList.add("special");

    btn.addEventListener("click", () => {
      if (btn.getAttribute('data-capped') === 'true' && !["mat", "osk", "matosk"].includes(type)) return;
      if (["mat", "osk", "matosk"].includes(type) && (matOskSum >= 1440 || hasPolitics)) return;

      btn.classList.add("button-clicked");
      setTimeout(() => btn.classList.remove("button-clicked"), 150);

      let clicks = parseInt(btn.dataset.clicks) || 0;
      const group15 = ["Продажа услуг за вимеры", "Продажа неигровых вещей за вимеры", "Продажа вимеров", "Покупка вимеров"];
      const group30 = ["Продажа вещей за реальные деньги", "Продажа услуг за реальные деньги"];

      if (group15.includes(text)) {
          if (clicks >= 1) return;
          [...panel.querySelectorAll("button[data-calc-btn='true']")].forEach(b => {
              if (group15.includes(b.textContent) || group30.includes(b.textContent)) b.dataset.clicks = "0";
          });
      } else if (group30.includes(text)) {
          if (clicks >= 1) return;
          [...panel.querySelectorAll("button[data-calc-btn='true']")].forEach(b => {
              if (group15.includes(b.textContent) || group30.includes(b.textContent)) b.dataset.clicks = "0";
          });
      } else if (text === "Flood") {
          if (clicks >= 1) return;
          let floodSym = [...panel.querySelectorAll("button[data-calc-btn='true']")].find(b => b.textContent === 'Flood символами');
          if (floodSym) floodSym.dataset.clicks = "0";
      } else if (text === "Flood символами") {
          if (clicks >= 1) return;
          let flood = [...panel.querySelectorAll("button[data-calc-btn='true']")].find(b => b.textContent === 'Flood');
          if (flood) flood.dataset.clicks = "0";
      } else if (["mat", "osk", "matosk"].includes(type)) {
      } else {
          if (clicks >= 1) return;
      }

      btn.dataset.clicks = (parseInt(btn.dataset.clicks) || 0) + 1;
      if (special) warning.style.display = "block";

      updateStateFromButtons();
    });

    btn.addEventListener("contextmenu", (e) => {
      e.preventDefault();

      let clicks = parseInt(btn.dataset.clicks) || 0;
      if (clicks <= 0) return;

      btn.classList.add("button-clicked");
      setTimeout(() => btn.classList.remove("button-clicked"), 150);
      btn.dataset.clicks = clicks - 1;

      let hasSpecial = [...panel.querySelectorAll("button[data-calc-btn='true']")].some(b => parseInt(b.dataset.clicks) > 0 && b.dataset.special === 'true');
      if (!hasSpecial) warning.style.display = "none";

      updateStateFromButtons();
    });

    panel.appendChild(btn);
  });

  enableDragAndDrop(panel);
  restoreButtonsOrder(panel);

  // COPY
  const copyBtn = document.createElement("button");
  copyBtn.id = "muteCalcCopy";
  copyBtn.textContent = "COPY";
  copyBtn.onclick = () => {
    const text = `${totalMinutes} ${reasonInput.value}`;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "OK!";
      setTimeout(() => (copyBtn.textContent = "COPY"), 1500);
    });
  };
  inputsRow.appendChild(copyBtn);

  // RESET
  const resetBtn = document.createElement("button");
  resetBtn.id = "muteCalcReset";
  resetBtn.textContent = "RESET";
  resetBtn.onclick = () => {
    panel.querySelectorAll("button[data-calc-btn='true']").forEach(b => {
        b.dataset.clicks = "0";
        b.removeAttribute("data-capped");
    });
    warning.style.display = "none";
    updateStateFromButtons();

    resetBtn.textContent = "OK!";
    setTimeout(() => (resetBtn.textContent = "RESET"), 1500);
  };
  inputsRow.appendChild(resetBtn);

  toggle.addEventListener("click", () => {
    panel.classList.toggle("active");
    saveState();
  });

  // Drag 
  let isDragging = false;
  let offsetX, offsetY;
  panel.addEventListener("mousedown", (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.id !== "muteCalcResizer" && e.target.tagName !== "INPUT") {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      panel.style.transition = "none";
    }
  });
  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      panel.style.left = (e.clientX - offsetX) + "px";
      panel.style.top = (e.clientY - offsetY) + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.position = "fixed";
      saveState();
    }
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
    panel.style.transition = "";
  });

  // Resize 
  const resizer = document.createElement("div");
  resizer.id = "muteCalcResizer";
  panel.appendChild(resizer);

  let isResizing = false;
  resizer.addEventListener("mousedown", (e) => {
    isResizing = true;
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener("mousemove", (e) => {
    if (isResizing) {
      const rect = panel.getBoundingClientRect();
      panel.style.width = (e.clientX - rect.left) + "px";
      panel.style.height = (e.clientY - rect.top) + "px";
      saveState();
    }
  });
  document.addEventListener("mouseup", () => {
    isResizing = false;
  });
})();

(function () {
  let currentMuteTimer = null;

  function escapeHTML(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  }

  async function viewReport(reportId) {
    if (currentMuteTimer) {
        clearInterval(currentMuteTimer);
        currentMuteTimer = null;
    }

    if (!reportId) {
      const idEl = document.getElementById('mr_id');
      reportId = idEl ? idEl.textContent.trim() : null;
    }
    if (!reportId) return;

    const url = 'https://legacy-cp.vimeworld.com/moder/ajax/report.php';
    const body = new URLSearchParams({ action: 'view', report: String(reportId) }).toString();

    try {
      let settings = { isServerInfoEnabled: true, isUnmuteTimeEnabled: true, isCompactModeEnabled: false };
      if (typeof chrome !== 'undefined' && chrome.storage) {
          settings = await new Promise(resolve => {
              chrome.storage.sync.get({ 
                  isServerInfoEnabled: true, 
                  isUnmuteTimeEnabled: true,
                  isCompactModeEnabled: false,
                  isEnabled2: false
              }, resolve);
          });
      }

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept': '*/*',
          'Origin': 'https://legacy-cp.vimeworld.com'
        },
        body,
        credentials: 'include'
      });

      const text = await resp.text();
      let data = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.warn('Не JSON, парсим как HTML', e);
        return;
      }

      const messagesContainer = document.getElementById('mr_messages');
      if (data && Array.isArray(data.messages) && messagesContainer) {

          const rankColors = {
              "vip": "#1cd41c", "premium": "#00dada", "holy": "#ffa317", "immortal": "#ff70d1",
              "divine": "#b451ff", "thane": "#30ff87", "elite": "#ffa51e", "eternal": "#2688ed",
              "celestial": "#6895d6", "absolute": "#dd57bc", "imperial": "#fdbd05", "ultimate": "#737272",
              "media": "#bf2dff", "vime": "#2599d4", "организатор": "#0d83ae", "разработчик": "#d61753", 
              "dev": "#d61753", "билдер": "#16bd00", "пр. билдер": "#16bd00", "гл. билдер": "#3f6e13", 
              "хелпер": "#76a6ff", "модер": "#4e62eb", "модератор": "#4e62eb", "пр. модер": "#3c36de", 
              "админ": "#ff5e43", "администратор": "#ff5e43", "гл. админ": "#ff2030"
          };

          setTimeout(() => {
                messagesContainer.innerHTML = "";

                const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark' ||
                               window.matchMedia('(prefers-color-scheme: dark)').matches;
                const badgeBg = isDark ? "#3e3d3d" : "#e9ecef";
                const badgeColor = isDark ? "#b3b9c4" : "#495057";
                const badgeBorder = isDark ? "#4a4a4a" : "#ced4da";

                data.messages.forEach(msg => {
                    const timeStr = msg.time ? new Date(msg.time * 1000).toLocaleTimeString('ru-RU') : '';
                    const server = msg.server || '';
                    const messageText = msg.message || '';

                    const serverHtml = (settings.isServerInfoEnabled && server) 
                        ? `<span style="background: ${badgeBg}; color: ${badgeColor}; padding: 1px 5px; border-radius: 4px; font-size: 10px; margin-right: 5px; border: 1px solid ${badgeBorder}; font-weight: bold;">${escapeHTML(server)}</span>` 
                        : '';

                    const timeHtml = `<span class="text-muted">${escapeHTML(timeStr)}</span>`;

                    let prefixHtml = "";
                    let mainText = messageText;

                    const match = messageText.match(/^((?:(.*?)\s*>\s*)?([^:]+):\s*)(.*)$/);

                    if (match) {
                        let rankStr = match[2]; 
                        mainText = match[4]; 

                        if (rankStr) {
                            let rankColor = rankColors[rankStr.toLowerCase()] || "#a3a3a3";
                            prefixHtml = ` <b style="color: ${rankColor};">${escapeHTML(rankStr)}</b> <span class="text-muted">-</span> `;
                        } else {
                            prefixHtml = ` <span class="text-muted">-</span> `;
                        }
                    } else {
                        prefixHtml = ` <span class="text-muted">-</span> `;
                    }

                    messagesContainer.innerHTML += `${serverHtml}${timeHtml}${prefixHtml}${escapeHTML(mainText)}<br>`;
                });
            }, 400);
      }

      const existingMute = document.getElementById('mr_alert_muted');
      if (data && data.action && data.action.action === "mute") {
          const m = data.action;
          const moder = m.moder || "Неизвестный модератор";
          const reason = m.reason || "Без причины";
          const duration = m.minutes ? m.minutes : 0;
          const startStr = m.date || "";

          const startDate = new Date(m.time * 1000);
          const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
          const today = new Date();
          
          const sameDay = today.toDateString() === endDate.toDateString();
          const endStr = sameDay
              ? endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : endDate.toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).replace('.', '');

          let html;

          if (settings.isCompactModeEnabled) {
              const expireSection = settings.isUnmuteTimeEnabled ? ` | ⏳ <b id="vw_custom_expire_text"></b>` : "";
              html = `
                <div id="mr_alert_muted" class="alert alert-success" style="width: 100%; display: block; padding: 8px 12px;">
                  <b>${escapeHTML(startStr)}</b> | <b id="mr_alert_muted_moder">${moder}</b> | <b id="mr_alert_muted_duration">${duration}</b> мин. | <b id="mr_alert_muted_reason">${escapeHTML(reason)}</b>${expireSection}
                </div>
              `;
          } else {
              const expireSection = settings.isUnmuteTimeEnabled ? `<br>Истекает: <b id="vw_custom_expire_text"></b>` : "";
              html = `
                <div id="mr_alert_muted" class="alert alert-success" style="width: 100%; display: block;">
                  <b>${escapeHTML(startStr)}</b> — <b id="mr_alert_muted_moder">${moder}</b> выдал мут на <b id="mr_alert_muted_duration">${duration}</b> минут с причиной: <b id="mr_alert_muted_reason">${escapeHTML(reason)}</b>${expireSection}
                </div>
              `;
          }

          if (existingMute) {
              existingMute.outerHTML = html;
          } else {
              const modalBody = document.querySelector(".modal-body");
              if (modalBody) modalBody.insertAdjacentHTML("afterbegin", html);
          }

          // таймер до конца мута
          if (settings.isUnmuteTimeEnabled) {
              function updateExpire() {
                  const expireEl = document.getElementById("vw_custom_expire_text");
                  if (!expireEl) return true; 
                  
                  const now = Date.now();
                  if (now >= endDate.getTime()) {
                      expireEl.textContent = "Истек";
                      return true;
                  }
                  const diff = endDate.getTime() - now;

                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                  const mins = Math.floor((diff / 60000) % 60);
                  const secs = Math.floor((diff / 1000) % 60);

                  let remainStr = "";
                  if (days > 0) remainStr += `${days}д `;
                  if (hours > 0 || days > 0) remainStr += `${hours}ч `;
                  remainStr += `${mins}м ${secs}с`;

                  expireEl.textContent = `${endStr} (через ${remainStr})`;
                  return false;
              }

              updateExpire(); 
              currentMuteTimer = setInterval(() => {
                  if (updateExpire()) {
                      clearInterval(currentMuteTimer);
                      currentMuteTimer = null;
                  }
              }, 1000);
          }
      } 
      // Отклоненный репорт
      else if (data && data.action && data.action.action === "delete") {
          const m = data.action;
          const moder = m.moder || "Неизвестный модератор";
          const startStr = m.date || "";
          
          let html;

          if (settings.isCompactModeEnabled) {
              html = `
                <div id="mr_alert_deleted" class="alert alert-warning" style="width: 100%; display: block; padding: 8px 12px;">
                  <b>${escapeHTML(startStr)}</b> | <b id="mr_alert_deleted_moder">${moder}</b> | <b>Отклонен</b>
                </div>
              `;
          } else {
              html = `
                <div id="mr_alert_deleted" class="alert alert-warning" style="width: 100%; display: block;">
                  <b>${escapeHTML(startStr)}</b> — <b id="mr_alert_deleted_moder">${moder}</b> отклонил репорт
                </div>
              `;
          }

          const existingDeleted = document.getElementById('mr_alert_deleted');
          if (existingDeleted) {
              existingDeleted.outerHTML = html;
          } else {
              const modalBody = document.querySelector(".modal-body");
              if (modalBody) modalBody.insertAdjacentHTML("afterbegin", html);
          }
      }
    } catch (err) {
      console.error('fetch/process error', err);
    }
  }

  function getIdFromButton(btn) {
    if (!btn) return null;
    if (btn.dataset && btn.dataset.report) return btn.dataset.report;
    const onclick = btn.getAttribute && btn.getAttribute('onclick');
    if (onclick) {
      const m = onclick.match(/viewReport\((\d+)\)/);
      if (m) return m[1];
    }
    return null;
  }

  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest && ev.target.closest('button[role="btn-view"], .btn[role="btn-view"]');
    if (!btn) return;
    ev.preventDefault();
    const id = getIdFromButton(btn) || (document.getElementById('mr_id') && document.getElementById('mr_id').textContent.trim());
    if (id) viewReport(id);
  });

  window.viewReport = viewReport;
})();


(function() {
    const panelHeading = document.querySelector(".panel-heading");
    if (!panelHeading) return;

    panelHeading.style.display = "flex";
    panelHeading.style.justifyContent = "space-between";
    panelHeading.style.alignItems = "center";

    const btn = document.createElement("button");
    btn.style.fontFamily = "Arial, sans-serif";
    btn.style.fontSize = "14px";
    btn.style.padding = "6px 12px";
    btn.style.background = "linear-gradient(to bottom, #fbb450 0, #faa937 100%)";
    btn.style.color = "white";
    btn.style.fontWeight = "bold";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.transition = "background-color 0.3s ease, transform 0.2s ease";

    if (window.location.href.includes("?all")) {
        btn.textContent = "Активные репорты";
        btn.onclick = () => window.location.href = "https://legacy-cp.vimeworld.com/moder/reports";
    } else {
        btn.textContent = "Все репорты";
        btn.onclick = () => window.location.href = "https://legacy-cp.vimeworld.com/moder/reports?all";
    }

    panelHeading.appendChild(btn);
})();


let API_TOKEN = null;

// Загружаем токен из config.json
async function loadApiToken() {
    try {
        const storageData = await new Promise(resolve => chrome.storage.sync.get("developerToken", resolve));
        
        if (storageData.developerToken) {
            API_TOKEN = storageData.developerToken;
            console.log('Токен API загружен из хранилища.');
            return;
        }
        const response = await fetch(chrome.runtime.getURL('config.json'));
        const config = await response.json();
        API_TOKEN = config.token;
        console.log('Токен API загружен из config.json.');
    } catch (error) {
        console.error('Не удалось загрузить API токен:', error);
    }
}

// Загружаем данные из emojis.json
async function loadEmojiData() {
    try {
        const url = chrome.runtime.getURL('emojis.json');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }
        emojiReplacements = await response.json();
        console.log('Данные эмодзи успешно загружены!');
    } catch (error)
    {
        console.error('Не удалось загрузить emojis.json:', error);
    }
}

function isReportsPage() {
    const url = window.location.href;
    return url.includes('legacy-cp.vimeworld.com/moder/reports') || 
           url.includes('cp.vimeworld.com/moder/reports') ||
           url.includes('cp.vimeworld.com/staff/reports');
}

function runReportFeatures() {
    if (!isReportsPage()) return;
    createInputField(); 
    convertText();
    modifyLoginLabel();
    rowClass();
    processRows();
    startMessagesObserver();
}

// Основная функция
async function initialize() {
    if (window.location.hostname.includes('legacy-cp')) {
        document.body.classList.add('vw-legacy-cp');
    }

    await new Promise(resolve => {
        chrome.storage.sync.get({ 
            isEnabled3: true,
            isOnlineStatusEnabled: true,
            isHeadsEnabled: true,
            isCompactModeEnabled: true,
            isUnmuteTimeEnabled: true,
            isServerInfoEnabled: true,
            isDictHighlightEnabled: true,
            isDictFuzzyDepth: 3 
        }, (data) => {
            syncSettingsFromStorage(data);
            resolve();
        });
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace !== 'sync') return;

        const newSettings = {};
        for (const key in changes) {
            newSettings[key] = changes[key].newValue;
        }
        syncSettingsFromStorage(newSettings);

        if (changes.isDictFuzzyDepth) {
            buildDictRegex();
        }

        if (changes.isDictHighlightEnabled || changes.isDictFuzzyDepth) {
            highlightDictWords();
        }

        if (changes.isServerInfoEnabled) {
            formatModalMessages();
        }

        if (changes.isCompactModeEnabled || changes.isUnmuteTimeEnabled) {
            scheduleStyle();
        }

        if (changes.isEnabled3 || changes.isHeadsEnabled || changes.isOnlineStatusEnabled) {
            document.querySelectorAll('table.table td[data-processed]').forEach(td => {
                delete td.dataset.processed;
            });
            document.querySelectorAll('[data-vw-wrapper="true"]').forEach(w => {
                w.remove();
            });
            processRows();
            scheduleStyle();
        }
    });

    await Promise.all([
        loadApiToken(),
        loadEmojiData(),
        loadDictionary() 
    ]);

    console.log('Запуск Universal VimeWorld Tool...');

    runReportFeatures();

    // SPA support for modern cp.vimeworld.com
    window.addEventListener('popstate', () => {
        setTimeout(runReportFeatures, 250);
    });

    const origPushState = history.pushState;
    if (origPushState) {
        history.pushState = function() {
            const res = origPushState.apply(this, arguments);
            setTimeout(runReportFeatures, 250);
            return res;
        };
    }

    const origReplaceState = history.replaceState;
    if (origReplaceState) {
        history.replaceState = function() {
            const res = origReplaceState.apply(this, arguments);
            setTimeout(runReportFeatures, 250);
            return res;
        };
    }

    // Periodic check to process dynamic table rows, modal, and login label
    setInterval(() => {
        if (isReportsPage()) {
            processRows();
            rowClass();
            modifyLoginLabel();
        }
    }, 1500);

    document.dispatchEvent(new CustomEvent('vwExtensionReady'));
}

initialize();
