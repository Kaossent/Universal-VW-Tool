const STORAGE_KEY = 'vime_forum_templates';
const SETTINGS_KEY = 'vime_forum_settings';
const BAR_STATE_KEY = 'vime_forum_bar_state';

const STYLES = {
    measures: {
        label: 'Меры приняты',
        html: '<strong><span data-ips-font-size="175" style="font-size: 1.75em;"><span data-i-color="green" style="color: #2ecc71 !important;">Меры приняты.</span></span></strong>',
        color: '#2ecc71'
    },
    closed: {
        label: 'Закрыто',
        html: '<strong><span data-ips-font-size="175" style="font-size: 1.75em;"><span data-i-color="blue" style="color: #3498db !important;">Закрыто.</span></span></strong>',
        color: '#3498db'
    },
    ui: {
        bg: '#212529',
        border: '#444'
    }
};

async function initForumTool() {
    // Дефолтные шаблоны
    const data = await chrome.storage.local.get(STORAGE_KEY);
    if (!data[STORAGE_KEY] || data[STORAGE_KEY].length === 0) {
        try {
            const response = await fetch(chrome.runtime.getURL('templates.json'));
            let defaultTemplates = await response.json();
            defaultTemplates = defaultTemplates.map(t => ({ title: '', ...t }));
            await chrome.storage.local.set({ [STORAGE_KEY]: defaultTemplates });
        } catch (e) {
            console.error('Ошибка загрузки templates.json', e);
        }
    }

    await checkAndInitForumTools();

    if (!document.body.dataset.vwNativeListener) {
        document.addEventListener('contextmenu', handleNativeButtonRightClick);
        document.body.dataset.vwNativeListener = 'true';
    }
}

async function checkAndInitForumTools() {
    if (!window.location.href.includes('forum.vimeworld.com')) return;

    if (!document.getElementById('vw-forum-styles')) injectStyles();
    initEditorToolbarMeasuresButton();

    // Панель шаблонов в ответе темы
    const replyArea = document.querySelector('[data-role="replyArea"], #replyForm, .cTopicPostArea');
    if (replyArea) {
        const submitBtn = replyArea.querySelector('button[type="submit"], input[type="submit"]') || document.querySelector('[data-role="replyArea"] button[type="submit"], #replyForm button[type="submit"]');
        if (!document.getElementById('template-bar-wrapper')) {
            await createTemplateBar(submitBtn || replyArea);
        }
        if (submitBtn) {
            addCustomCloseButton(submitBtn);
        }
    }

    // Молоточек быстрого вердикта (временно выключен)
    /*
    if (document.querySelector('.cTopicList, [data-tableid="topics"], .ipsData--topic-list, [data-ips-hook="topicListTable"]')) {
        if (!document.getElementById('vw-forum-styles')) injectStyles();
        initTopicListTools();
    }
    */
}

function initTopicListTools() {
    // Временно отключено
    document.querySelectorAll('.vw-fast-mod-container').forEach(el => el.remove());
    return;
    /*
    const topicRows = document.querySelectorAll(
        '.cTopicList .ipsDataItem, [data-tableid="topics"] li[data-ips-hook="topicRow"], .ipsData--topic-list .ipsData__item'
    );
    
    topicRows.forEach(row => {
        if (row.querySelector('.vw-fast-mod-container')) return;

        if (row.querySelector('.fa-lock, .ipsBadge--locked')) return;

        row.style.position = 'relative';

        const lastPosterList = row.querySelector('.ipsData__extra, .ipsData__last, .ipsDataItem_lastPoster');
        if (lastPosterList) {
            lastPosterList.style.transition = 'margin-right 0.2s';
            lastPosterList.style.marginRight = '45px';
        }

        const btnContainer = document.createElement('div');
        btnContainer.className = 'vw-fast-mod-container';
        btnContainer.style.position = 'absolute';
        btnContainer.style.right = '6px';
        btnContainer.style.top = '0';
        btnContainer.style.bottom = '0';
        btnContainer.style.width = '40px';
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.zIndex = '5'; 

        const btn = document.createElement('button');
        btn.className = 'ipsButton ipsButton_verySmall ipsButton_positive vw-fast-mod-btn';
        btn.innerHTML = '<i class="fa fa-solid fa-gavel"></i>'; 
        btn.title = 'Меры приняты + Закрыть';
        btn.style.padding = '0';
        btn.style.width = '28px';
        btn.style.height = '28px';
        btn.style.lineHeight = '28px';
        btn.style.borderRadius = '4px';
        btn.style.backgroundColor = '#27ae60';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await handleFastVerdict(row, btn);
        };

        btnContainer.appendChild(btn);
        row.appendChild(btnContainer);
    });
    */
}

async function handleFastVerdict(row, btn) {
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-solid fa-spinner fa-spin"></i>'; 

    try {
        const titleLink = row.querySelector('.ipsDataItem_title a, .ipsData__title a, h4[data-ips-hook="title"] a');
        if (!titleLink) throw new Error('Ссылка на тему не найдена');
        const topicUrl = titleLink.href;

        const response = await fetch(topicUrl);
        if (!response.ok) throw new Error('Ошибка сети');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        let form = doc.querySelector('[data-role="replyArea"] form, #replyForm form, form[action*="addComment"], form#topic_reply');

        if (!form) {
             if (doc.querySelector('.ipsType_locked, .fa-lock, .ipsBadge--locked')) {
                 throw new Error('Тема уже закрыта');
             }
             throw new Error('Не удалось найти форму (нет прав?)');
        }

        const lockLink = doc.querySelector('a[href*="action=lock"], a[href*="do=moderate&action=lock"], a[href*="do=moderateTopic&action=lock"]');
        const csrfInput = doc.querySelector('input[name="csrfKey"]');
        const csrfKey = csrfInput ? csrfInput.value : '';

        const formData = new FormData();
        const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
        
        hiddenInputs.forEach(input => {
            if (input.name && input.value) {
                formData.append(input.name, input.value);
            }
        });

        let commentFieldName = null;
        const editorTextarea = form.querySelector('textarea[name^="topic_comment_"]');

        if (editorTextarea) {
            commentFieldName = editorTextarea.name;
        } else {
            const submittedInput = Array.from(hiddenInputs).find(i => i.name && i.name.endsWith('_submitted'));
            if (submittedInput) {
                commentFieldName = submittedInput.name.replace('_submitted', '');
            }
        }

        if (!commentFieldName) {
            const anyTextarea = form.querySelector('textarea');
            if (anyTextarea && anyTextarea.name) commentFieldName = anyTextarea.name;
            else commentFieldName = 'topic_comment';
        }

        formData.append(commentFieldName, `<p>${STYLES.measures.html}</p>`);

        const postResponse = await fetch(form.action, { method: 'POST', body: formData });
        if (!postResponse.ok) throw new Error('Сервер вернул ошибку при отправке ответа');

        if (lockLink) {
            await fetch(lockLink.href);
        } else if (csrfKey) {
            const cleanTopicUrl = topicUrl.split('?')[0];
            await fetch(`${cleanTopicUrl}?do=moderate&action=lock&csrfKey=${csrfKey}`);
        }

        btn.innerHTML = '<i class="fa fa-solid fa-check"></i>';
        btn.className = 'ipsButton ipsButton_verySmall ipsButton_link';
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#2ecc71';
        btn.style.boxShadow = 'none';
        btn.style.cursor = 'default';
        row.style.opacity = '0.5';
        
        const titleContainer = row.querySelector('.ipsData__title, .ipsDataItem_title, h4[data-ips-hook="title"]');
        if (titleContainer && !titleContainer.querySelector('.fa-lock')) {
            const lockIcon = document.createElement('i');
            lockIcon.className = 'fa fa-solid fa-lock';
            lockIcon.style.marginRight = '5px';
            titleContainer.prepend(lockIcon);
        }

    } catch (err) {
        console.error(err);
        alert('Ошибка: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = originalContent;
    }
}

async function handleNativeButtonRightClick(e) {
    const target = e.target.closest('a[title="Меры приняты"], [data-vw-tpl="measures"]');
    if (target) {
        e.preventDefault(); 
        e.stopPropagation();
        insertMeasuresVerdict();
        const submitBtn = document.querySelector('[data-role="replyArea"] button[type="submit"], #replyForm button[type="submit"], form[action*="addComment"] button[type="submit"]');
        await performSubmitAndClose(submitBtn);
    }
}

// Кнопка «Ответить и закрыть» в форме ответа
function addCustomCloseButton(submitBtn) {
    if (!submitBtn || document.getElementById('btn-reply-and-close')) return;

    const closeBtn = document.createElement('button');
    closeBtn.id = 'btn-reply-and-close';
    closeBtn.type = 'button';
    closeBtn.className = submitBtn.className;
    closeBtn.classList.remove('ipsButton--primary', 'ipsButton_primary');
    closeBtn.classList.add('ipsButton--negative', 'ipsButton_negative', 'vw-btn-reply-and-close');
    closeBtn.innerText = 'Ответить и закрыть';
    closeBtn.title = 'Опубликовать ответ и заблокировать тему';
    
    const syncStyles = () => {
        try {
            const cs = window.getComputedStyle(submitBtn);
            if (cs.height && cs.height !== 'auto' && cs.height !== '0px') {
                closeBtn.style.height = cs.height;
                closeBtn.style.minHeight = cs.minHeight;
            }
            if (cs.padding && cs.padding !== '0px') {
                closeBtn.style.padding = cs.padding;
            } else if (cs.paddingTop) {
                closeBtn.style.paddingTop = cs.paddingTop;
                closeBtn.style.paddingBottom = cs.paddingBottom;
                closeBtn.style.paddingLeft = cs.paddingLeft;
                closeBtn.style.paddingRight = cs.paddingRight;
            }
            closeBtn.style.fontSize = cs.fontSize;
            closeBtn.style.fontFamily = cs.fontFamily;
            closeBtn.style.fontWeight = cs.fontWeight;
            closeBtn.style.lineHeight = cs.lineHeight;
            closeBtn.style.borderRadius = cs.borderRadius;
            closeBtn.style.boxSizing = cs.boxSizing;
            closeBtn.style.display = cs.display;
            closeBtn.style.alignItems = cs.alignItems;
            closeBtn.style.justifyContent = cs.justifyContent;
        } catch (_) {}
    };

    syncStyles();
    setTimeout(syncStyles, 100);

    closeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await performSubmitAndClose(closeBtn);
    });

    const parentLi = submitBtn.closest('li');
    if (parentLi) {
        const newLi = document.createElement('li');
        newLi.appendChild(closeBtn);
        parentLi.after(newLi);
    } else {
        submitBtn.after(closeBtn);
    }

    const parentContainer = submitBtn.parentElement;
    if (parentContainer) {
        parentContainer.style.display = 'flex';
        parentContainer.style.alignItems = 'center';
        parentContainer.style.justifyContent = 'flex-end';
        parentContainer.style.gap = '8px';
        parentContainer.style.marginLeft = 'auto';
        submitBtn.style.margin = '0';
        closeBtn.style.margin = '0';
    }
}

// Стили расширения
function injectStyles() {
    let style = document.getElementById('vw-forum-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'vw-forum-styles';
        document.head.appendChild(style);
    }
    style.innerHTML = `
        #template-bar-wrapper { 
            margin-bottom: 12px; 
            margin-top: 8px;
            background: #1e2124; 
            border: 1px solid #333a42; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            width: 100%;
            box-sizing: border-box;
        }
        #template-bar-header { 
            padding: 6px 12px; 
            background: rgba(255,255,255,0.04); 
            border-bottom: 1px solid #333a42; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            height: 36px; 
        }
        #template-bar-header.collapsed { border-bottom: none; }
        .vw-header-btn { 
            background: none; 
            border: none; 
            color: #9ba1a6; 
            cursor: pointer; 
            font-size: 13px; 
            padding: 4px 8px; 
            border-radius: 4px;
            display: flex; 
            align-items: center; 
            gap: 6px; 
            transition: all 0.2s;
        }
        .vw-header-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }
        #template-bar-content { 
            padding: 10px 12px; 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
            align-items: center; 
        }
        .vw-tpl-btn { 
            background: rgba(255,255,255,0.06); 
            border: 1px solid rgba(255,255,255,0.08); 
            color: #e0e0e0; 
            padding: 6px 12px; 
            border-radius: 6px; 
            font-size: 13px; 
            font-weight: 500;
            cursor: pointer; 
            transition: all 0.2s ease; 
            display: inline-flex; 
            align-items: center;
            user-select: none; 
        }
        .vw-tpl-btn:hover { 
            background: rgba(255,255,255,0.12); 
            color: #fff; 
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.4); 
        }
        .vw-tpl-btn[data-type="measures"] { border-left: 3px solid ${STYLES.measures.color}; }
        .vw-tpl-btn[data-type="closed"] { border-left: 3px solid ${STYLES.closed.color}; }
        .vw-tpl-btn.dragging { opacity: 0.4; border: 1px dashed #fff; pointer-events: none; }
        
        .vw-fast-mod-btn { transition: transform 0.1s; }
        .vw-fast-mod-btn:hover { transform: scale(1.1); }
        .vw-fast-mod-btn:active { transform: scale(0.95); }

        #vw-template-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.75); backdrop-filter: blur(2px); z-index: 99999; display: flex; justify-content: center; align-items: center; }
        .vw-modal-content { background: #23272b; color: #eee; padding: 20px; border-radius: 8px; width: 560px; max-width: 95%; border: 1px solid #3c424a; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.6); }
        .vw-input { width: 100%; padding: 8px 10px; margin-bottom: 10px; background: #1a1d20; border: 1px solid #444c56; color: #fff; border-radius: 6px; box-sizing: border-box; }
        .vw-toggle-wrapper { display: flex; align-items: center; margin-bottom: 15px; padding: 12px; background: #1a1d20; border-radius: 6px; border: 1px solid #333a42; }
        .vw-toggle-label { flex: 1; font-size: 13px; font-weight: 500; color: #e0e0e0; }
        .vw-toggle { position: relative; display: inline-block; width: 42px; height: 22px; flex-shrink: 0; }
        .vw-toggle input { opacity: 0; width: 0; height: 0; }
        .vw-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .3s; border-radius: 22px; }
        .vw-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; }
        input:checked + .vw-slider { background-color: #2563eb; }
        input:checked + .vw-slider:before { transform: translateX(20px); }
        .vw-action-btn { 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            width: 28px; 
            height: 28px; 
            min-width: 28px; 
            min-height: 28px; 
            flex-shrink: 0; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 13px; 
            line-height: 1; 
            padding: 0; 
            margin: 0; 
            box-sizing: border-box;
            transition: background-color 0.15s, transform 0.1s; 
        }
        .vw-action-btn:hover { filter: brightness(1.1); }
        .vw-action-btn:active { transform: scale(0.92); }
        .vw-btn-del { background: #e74c3c; color: white; }
        .vw-btn-del:hover { background: #c0392b; }
        .vw-btn-edit { background: #f39c12; color: white; }
        .vw-btn-edit:hover { background: #d68910; }
        .vw-io-btn { margin-right: 10px; padding: 6px 12px; border-radius: 4px; border: 1px solid #444c56; background: #2d333b; color: #ddd; cursor: pointer; font-size: 12px; }
        .vw-io-btn:hover { background: #373e47; color: #fff; }

        #btn-reply-and-close.vw-btn-reply-and-close {
            background-color: #c0392b !important;
            color: #ffffff !important;
            border: none !important;
            cursor: pointer !important;
            text-shadow: none !important;
            margin: 0 !important;
            transition: background-color 0.2s ease, transform 0.1s ease !important;
        }
        #btn-reply-and-close.vw-btn-reply-and-close:hover {
            background-color: #d32f2f !important;
            color: #ffffff !important;
        }
        #btn-reply-and-close.vw-btn-reply-and-close:active {
            background-color: #b71c1c !important;
            transform: translateY(1px) !important;
        }

        /* Кнопки вердиктов */
        .vw-editor-measures-wrap {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            list-style: none !important;
            margin: 0 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
        }
        .vw-editor-measures-btn {
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            padding: 4px 6px !important;
            margin: 0 2px !important;
            border-radius: 4px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            transition: background-color 0.15s ease, transform 0.12s ease, filter 0.15s ease !important;
            user-select: none !important;
            box-sizing: border-box !important;
            height: 28px !important;
            min-width: 28px !important;
            color: #2ecc71 !important;
        }
        .vw-editor-measures-btn:hover {
            background-color: rgba(46, 204, 113, 0.18) !important;
            filter: drop-shadow(0 0 5px rgba(46, 204, 113, 0.55)) !important;
            transform: scale(1.08) !important;
        }
        .vw-editor-measures-btn:active {
            transform: scale(0.92) !important;
        }
        .vw-editor-measures-btn.vw-btn-clicked {
            animation: vw-pulse-green 0.35s ease !important;
        }
        @keyframes vw-pulse-green {
            0% { transform: scale(0.9); filter: brightness(1); }
            50% { transform: scale(1.22); filter: brightness(1.6) drop-shadow(0 0 10px #2ecc71); }
            100% { transform: scale(1); filter: brightness(1); }
        }
        .vw-measures-icon {
            display: block !important;
            width: 17px !important;
            height: 17px !important;
            stroke: #2ecc71 !important;
            transition: stroke 0.15s ease !important;
        }
        .vw-editor-measures-btn:hover .vw-measures-icon {
            stroke: #40d47e !important;
        }

        .vw-editor-closed-btn {
            color: #3498db !important;
        }
        .vw-editor-closed-btn:hover {
            background-color: rgba(52, 152, 219, 0.18) !important;
            filter: drop-shadow(0 0 5px rgba(52, 152, 219, 0.55)) !important;
            transform: scale(1.08) !important;
        }
        .vw-editor-closed-btn:active {
            transform: scale(0.92) !important;
        }
        .vw-editor-closed-btn.vw-btn-clicked {
            animation: vw-pulse-blue 0.35s ease !important;
        }
        @keyframes vw-pulse-blue {
            0% { transform: scale(0.9); filter: brightness(1); }
            50% { transform: scale(1.22); filter: brightness(1.6) drop-shadow(0 0 10px #3498db); }
            100% { transform: scale(1); filter: brightness(1); }
        }
        .vw-closed-icon {
            display: block !important;
            width: 17px !important;
            height: 17px !important;
            stroke: #3498db !important;
            transition: stroke 0.15s ease !important;
        }
        .vw-editor-closed-btn:hover .vw-closed-icon {
            stroke: #5dade2 !important;
        }

        /* Цвета вердиктов */
        :root {
            --i-color_green: #2ecc71 !important;
            --i-color_blue: #3498db !important;
        }
        [data-i-color="green"],
        .tiptap [data-i-color="green"],
        .ipsRichText [data-i-color="green"] {
            --i-color_green: #2ecc71 !important;
            --i-richtext-color: #2ecc71 !important;
            color: #2ecc71 !important;
        }
        [data-i-color="blue"],
        .tiptap [data-i-color="blue"],
        .ipsRichText [data-i-color="blue"] {
            --i-color_blue: #3498db !important;
            --i-richtext-color: #3498db !important;
            color: #3498db !important;
        }

        [data-i-color="green"] [data-i-color="blue"],
        .tiptap [data-i-color="green"] [data-i-color="blue"] {
            --i-color_blue: #3498db !important;
            --i-richtext-color: #3498db !important;
            color: #3498db !important;
        }
        [data-i-color="blue"] [data-i-color="green"],
        .tiptap [data-i-color="blue"] [data-i-color="green"] {
            --i-color_green: #2ecc71 !important;
            --i-richtext-color: #2ecc71 !important;
            color: #2ecc71 !important;
        }
    `;
}

// Панель шаблонов
async function createTemplateBar(anchorElement) {
    let wrapper = document.getElementById('template-bar-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'template-bar-wrapper';
        wrapper.innerHTML = `
            <div id="template-bar-header">
                <div class="vw-left">
                    <button class="vw-header-btn" id="vw-settings-btn" title="Настройки шаблонов">
                        <i class="fa fa-solid fa-gear fa-cog"></i> Настроить
                    </button>
                </div>
                <div class="vw-right">
                    <button class="vw-header-btn" id="vw-toggle-btn" title="Свернуть / развернуть">
                        <i class="fa fa-solid fa-chevron-up"></i>
                    </button>
                </div>
            </div>
            <div id="template-bar-content"></div>
        `;

        let placed = false;
        const form = (anchorElement && anchorElement.nodeType === Node.ELEMENT_NODE ? anchorElement.closest('form') : null)
            || document.querySelector('[data-role="replyArea"] form, #replyForm form');
            
        if (form && anchorElement && anchorElement.nodeType === Node.ELEMENT_NODE) {
            let current = anchorElement;
            while (current && current.parentElement && current.parentElement !== form) {
                current = current.parentElement;
            }
            if (current && current.parentNode === form) {
                form.insertBefore(wrapper, current);
                placed = true;
            }
        }

        if (!placed) {
            const replyArea = document.querySelector('[data-role="replyArea"], #replyForm, .cTopicPostArea');
            if (replyArea) {
                const editorArea = replyArea.querySelector('[data-role="mainEditorArea"], [data-ipseditorv5]');
                if (editorArea && editorArea.parentNode) {
                    editorArea.parentNode.insertBefore(wrapper, editorArea.nextSibling);
                    placed = true;
                } else {
                    replyArea.appendChild(wrapper);
                    placed = true;
                }
            }
        }

        const settingsBtn = document.getElementById('vw-settings-btn');
        if (settingsBtn) settingsBtn.onclick = (e) => { e.preventDefault(); openTemplateEditor(); };

        const toggleBtn = document.getElementById('vw-toggle-btn');
        if (toggleBtn) toggleBtn.onclick = (e) => { e.preventDefault(); toggleTemplateBar(); };

        const container = document.getElementById('template-bar-content');
        if (container) {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientX, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    if (afterElement == null) container.appendChild(draggable);
                    else container.insertBefore(draggable, afterElement);
                }
            });
            container.addEventListener('drop', (e) => { e.preventDefault(); saveNewOrder(); });
        }
    }

    await restoreBarState();
    await renderTemplates(document.getElementById('template-bar-content'));
}

function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.vw-tpl-btn:not(.dragging)')];
    return draggableElements.find(child => {
        const box = child.getBoundingClientRect();
        if (y < box.bottom) {
            if (y < box.top) return true;
            if (x < box.left + box.width / 2) return true;
        }
        return false;
    });
}

async function toggleTemplateBar() {
    const content = document.getElementById('template-bar-content');
    const header = document.getElementById('template-bar-header');
    const btn = document.getElementById('vw-toggle-btn');
    if (!content) return;
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'flex' : 'none';
    if (header) isHidden ? header.classList.remove('collapsed') : header.classList.add('collapsed');
    if (btn) btn.innerHTML = isHidden ? '<i class="fa fa-solid fa-chevron-up"></i>' : '<i class="fa fa-solid fa-chevron-down"></i>';
    await chrome.storage.local.set({ [BAR_STATE_KEY]: !isHidden });
}

async function restoreBarState() {
    const data = await chrome.storage.local.get(BAR_STATE_KEY);
    const isCollapsed = data[BAR_STATE_KEY] || false;
    const content = document.getElementById('template-bar-content');
    const header = document.getElementById('template-bar-header');
    const btn = document.getElementById('vw-toggle-btn');
    if (content && isCollapsed) {
        content.style.display = 'none';
        if (header) header.classList.add('collapsed');
        if (btn) btn.innerHTML = '<i class="fa fa-solid fa-chevron-down"></i>';
    }
}

async function saveNewOrder() {
    const container = document.getElementById('template-bar-content');
    if (!container) return;
    const buttons = container.querySelectorAll('.vw-tpl-btn');
    const newOrder = [];
    buttons.forEach(btn => newOrder.push({ type: btn.dataset.type, comment: btn.dataset.fullText, title: btn.dataset.title || "" }));
    await chrome.storage.local.set({ [STORAGE_KEY]: newOrder });
}

async function renderTemplates(container) {
    if (!container) return;
    container.innerHTML = '';
    const data = await chrome.storage.local.get(STORAGE_KEY);
    const templates = data[STORAGE_KEY] || [];
    if (templates.length === 0) { container.innerHTML = '<span style="color:#777; font-size:12px;">Шаблонов нет.</span>'; return; }
    templates.forEach(tpl => {
        const btn = document.createElement('div');
        btn.className = 'vw-tpl-btn';
        btn.dataset.type = tpl.type;
        btn.dataset.fullText = tpl.comment;
        btn.dataset.title = tpl.title || "";
        btn.innerText = (tpl.title && tpl.title.trim() !== "") ? tpl.title : tpl.comment;
        btn.draggable = true;
        btn.onclick = async (e) => {
            e.preventDefault();
            insertTemplate(tpl);
            const sData = await chrome.storage.local.get(SETTINGS_KEY);
            if (sData[SETTINGS_KEY]?.autoClose) {
                btn.style.opacity = '0.5';
                const sBtn = document.querySelector('[data-role="replyArea"] button[type="submit"], #replyForm button[type="submit"], form[action*="addComment"] button[type="submit"]');
                await performSubmitAndClose(sBtn);
            }
        };
        btn.addEventListener('dragstart', () => setTimeout(() => btn.classList.add('dragging'), 0));
        btn.addEventListener('dragend', () => btn.classList.remove('dragging'));
        container.appendChild(btn);
    });
}

// Вставка шаблона
function insertTemplate(tpl) {
    const html = `<p>${STYLES[tpl.type].html}</p><p>${tpl.comment}</p>`;
    insertHtmlToEditor(html, true);
}

function insertMeasuresVerdict() {
    let existingText = '';
    const tiptap = document.querySelector(
        '[data-role="replyArea"] .tiptap[contenteditable="true"], .tiptap[contenteditable="true"], [data-role="mainEditorArea"] [contenteditable="true"], [contenteditable="true"].ProseMirror'
    );
    if (tiptap) {
        const lines = tiptap.innerText.split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.includes('Меры приняты') && !l.includes('Закрыто'));
        existingText = lines.join('\n').trim();
    }

    let finalHtml = '';
    if (existingText) {
        finalHtml = `<p>${STYLES.measures.html}</p><p>${existingText}</p>`;
    } else {
        finalHtml = `<p>${STYLES.measures.html}</p><p><br></p>`;
    }

    insertHtmlToEditor(finalHtml, true, true);
}

function insertClosedVerdict() {
    let existingText = '';
    const tiptap = document.querySelector(
        '[data-role="replyArea"] .tiptap[contenteditable="true"], .tiptap[contenteditable="true"], [data-role="mainEditorArea"] [contenteditable="true"], [contenteditable="true"].ProseMirror'
    );
    if (tiptap) {
        const lines = tiptap.innerText.split('\n')
            .map(l => l.trim())
            .filter(l => l && !l.includes('Меры приняты') && !l.includes('Закрыто'));
        existingText = lines.join('\n').trim();
    }

    let finalHtml = '';
    if (existingText) {
        finalHtml = `<p>${STYLES.closed.html}</p><p>${existingText}</p>`;
    } else {
        finalHtml = `<p>${STYLES.closed.html}</p><p><br></p>`;
    }

    insertHtmlToEditor(finalHtml, true, true);
}

// Кнопки «Меры приняты» и «Закрыто» на панели редактора
function initEditorToolbarMeasuresButton() {
    if (!window.location.href.includes('forum.vimeworld.com')) return;

    const toolbars = document.querySelectorAll('.ipsEditor__toolbar, [data-role="toolbar"], ul.ipsEditor__toolbar');

    toolbars.forEach(toolbar => {
        if (!toolbar || toolbar.querySelector('.vw-editor-measures-btn') || toolbar.querySelector('.vw-editor-closed-btn')) {
            return;
        }

        const children = Array.from(toolbar.children || []);
        if (children.length === 0) return;

        const editorContainer = toolbar.closest('[data-role="replyArea"], [data-ipseditorv5], .ipsComposeArea_editor, form');
        if (editorContainer && editorContainer.querySelector('.ipsLoading, [class*="loading-spinner"]')) {
            return;
        }

        const isUl = toolbar.tagName.toLowerCase() === 'ul';
        const wrap = document.createElement(isUl ? 'li' : 'div');
        wrap.className = isUl 
            ? 'ipsEditor__toolbar-item-wrap vw-editor-verdicts-wrap vw-editor-measures-wrap' 
            : 'vw-editor-verdicts-wrap vw-editor-measures-wrap';

        const measuresBtn = document.createElement('button');
        measuresBtn.type = 'button';
        measuresBtn.className = 'ipsEditor__toolbar-item vw-editor-verdict-btn vw-editor-measures-btn';
        measuresBtn.title = 'Меры приняты (вставить в ответ)\nПКМ: Вставить и закрыть тему';
        measuresBtn.setAttribute('aria-label', 'Меры приняты');
        measuresBtn.innerHTML = `
            <svg class="vw-measures-icon" viewBox="0 0 24 24" width="16" height="16" stroke="#2ecc71" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        measuresBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertMeasuresVerdict();
            measuresBtn.classList.add('vw-btn-clicked');
            setTimeout(() => measuresBtn.classList.remove('vw-btn-clicked'), 400);
        };

        measuresBtn.oncontextmenu = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertMeasuresVerdict();
            const submitBtn = document.querySelector(
                '[data-role="replyArea"] button[type="submit"], #replyForm button[type="submit"], form[action*="addComment"] button[type="submit"]'
            );
            await performSubmitAndClose(submitBtn);
        };

        const closedBtn = document.createElement('button');
        closedBtn.type = 'button';
        closedBtn.className = 'ipsEditor__toolbar-item vw-editor-verdict-btn vw-editor-closed-btn';
        closedBtn.title = 'Закрыто (вставить в ответ)\nПКМ: Вставить и закрыть тему';
        closedBtn.setAttribute('aria-label', 'Закрыто');
        closedBtn.innerHTML = `
            <svg class="vw-closed-icon" viewBox="0 0 24 24" width="16" height="16" stroke="#3498db" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

        closedBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertClosedVerdict();
            closedBtn.classList.add('vw-btn-clicked');
            setTimeout(() => closedBtn.classList.remove('vw-btn-clicked'), 400);
        };

        closedBtn.oncontextmenu = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            insertClosedVerdict();
            const submitBtn = document.querySelector(
                '[data-role="replyArea"] button[type="submit"], #replyForm button[type="submit"], form[action*="addComment"] button[type="submit"]'
            );
            await performSubmitAndClose(submitBtn);
        };

        wrap.appendChild(measuresBtn);
        wrap.appendChild(closedBtn);
        toolbar.appendChild(wrap);
    });
}

// Вставка HTML в редактор темы
function insertHtmlToEditor(html, replace = false, focusEnd = false) {
    try {
        const script = document.createElement('script');
        script.textContent = `(() => {
            try {
                const edElem = document.querySelector('[data-role="replyArea"] [data-ipseditorv5], [data-ipseditorv5]');
                if (edElem && window.ips && window.ips.ui && window.ips.ui.editorv5) {
                    const obj = window.ips.ui.editorv5.getObj(edElem);
                    const instance = obj ? (obj.instance || (obj.getInstance ? obj.getInstance() : obj._editor)) : null;
                    if (instance && instance.commands) {
                        if (${JSON.stringify(replace)}) {
                            instance.commands.setContent(${JSON.stringify(html)}, true);
                        } else {
                            instance.commands.insertContent(${JSON.stringify(html)});
                        }
                        if (${JSON.stringify(focusEnd)} && instance.commands.focus) {
                            instance.commands.focus('end');
                        }
                        document.documentElement.dataset.vwEditorInserted = 'true';
                        return;
                    }
                }
            } catch (e) {
                console.warn('TipTap API call failed, falling back:', e);
            }
        })();`;
        (document.head || document.documentElement).appendChild(script);
        script.remove();

        if (document.documentElement.dataset.vwEditorInserted === 'true') {
            delete document.documentElement.dataset.vwEditorInserted;
            return;
        }
    } catch (e) {
        console.warn('Main world script execution failed:', e);
    }

    const tiptap = document.querySelector(
        '[data-role="replyArea"] .tiptap[contenteditable="true"], .tiptap[contenteditable="true"], [data-role="mainEditorArea"] [contenteditable="true"], [contenteditable="true"].ProseMirror'
    );
    if (tiptap) {
        tiptap.focus();
        if (replace) {
            tiptap.innerHTML = html;
        } else {
            let inserted = false;
            try {
                inserted = document.execCommand('insertHTML', false, html);
            } catch (_) {}
            if (!inserted) {
                tiptap.innerHTML = html + tiptap.innerHTML;
            }
        }
        tiptap.dispatchEvent(new Event('input', { bubbles: true }));
        tiptap.dispatchEvent(new Event('change', { bubbles: true }));

        if (focusEnd) {
            try {
                const sel = window.getSelection();
                const range = document.createRange();
                const lastP = tiptap.querySelector('p:last-child') || tiptap;
                range.selectNodeContents(lastP);
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            } catch (_) {}
        }

        const textarea = document.querySelector('[data-role="replyArea"] textarea, [data-ipseditorv5] textarea');
        if (textarea) {
            if (replace) textarea.value = html;
            else textarea.value = html + textarea.value;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
    }

    const ckeIframe = document.querySelector('.cke_wysiwyg_frame');
    if (ckeIframe && ckeIframe.contentDocument) {
        if (replace) {
            ckeIframe.contentDocument.body.innerHTML = html;
        } else {
            ckeIframe.contentDocument.body.innerHTML = html + ckeIframe.contentDocument.body.innerHTML;
        }
        return;
    }
    const editable = document.querySelector('.cke_editable');
    if (editable) {
        if (replace) editable.innerHTML = html;
        else editable.innerHTML = html + editable.innerHTML;
    }
}

// Отправка ответа и закрытие темы
async function performSubmitAndClose(btnElement) {
    if (btnElement) { 
        btnElement.disabled = true; 
        if (btnElement.tagName === 'BUTTON') btnElement.innerText = 'Обработка...'; 
    }
    try {
        const form = document.querySelector('[data-role="replyArea"] form, #replyForm form, form[action*="addComment"], form#topic_reply') || document.querySelector('[data-role="replyArea"]');
        if (!form) throw new Error('Форма не найдена');

        let content = "";
        const tiptap = document.querySelector(
            '[data-role="replyArea"] .tiptap[contenteditable="true"], .tiptap[contenteditable="true"], [data-role="mainEditorArea"] [contenteditable="true"]'
        );
        if (tiptap && tiptap.innerHTML.trim()) {
            content = tiptap.innerHTML;
        } else {
            const ckeIframe = document.querySelector('.cke_wysiwyg_frame');
            if (ckeIframe && ckeIframe.contentDocument) content = ckeIframe.contentDocument.body.innerHTML;
            else { const ed = document.querySelector('.cke_editable'); if (ed) content = ed.innerHTML; }
        }
        if (!content) {
            const textarea = form.querySelector('textarea[name^="topic_comment_"], textarea');
            if (textarea) content = textarea.value;
        }

        const formData = new FormData(form.tagName === 'FORM' ? form : undefined);
        if (form.tagName !== 'FORM') {
            form.querySelectorAll('input, textarea, select').forEach(el => {
                if (el.name && el.value) formData.append(el.name, el.value);
            });
        }
        
        const txtKey = Array.from(formData.keys()).find(k => k.startsWith('topic_comment_') && !k.endsWith('_submitted'));
        if (txtKey && content) formData.set(txtKey, content);

        const formAction = form.action || (form.querySelector('form') ? form.querySelector('form').action : window.location.href);

        await fetch(formAction, { method: 'POST', body: formData });

        let lockLink = document.querySelector('a[href*="do=moderate&action=lock"], a[href*="action=lock"], a[href*="do=moderateTopic&action=lock"]');
        if (lockLink) {
            await fetch(lockLink.href);
        } else {
            const csrfInput = document.querySelector('input[name="csrfKey"]');
            const csrfKey = csrfInput ? csrfInput.value : '';
            if (csrfKey) {
                const topicPath = window.location.pathname;
                const lockUrl = `${topicPath}?do=moderate&action=lock&csrfKey=${csrfKey}`;
                await fetch(lockUrl);
            }
        }
        window.location.reload();
    } catch (err) {
        console.error(err);
        alert('Ошибка: ' + err.message);
        if (btnElement) { 
            btnElement.disabled = false; 
            if (btnElement.tagName === 'BUTTON') btnElement.innerText = 'Ошибка'; 
        }
    }
}

// Настройки шаблонов
async function openTemplateEditor() {
    const oldModal = document.getElementById('vw-template-modal');
    if (oldModal) oldModal.remove();

    const settingsData = await chrome.storage.local.get(SETTINGS_KEY);
    const isAutoClose = settingsData[SETTINGS_KEY]?.autoClose || false;

    const modal = document.createElement('div');
    modal.id = 'vw-template-modal';
    
    const content = document.createElement('div');
    content.className = 'vw-modal-content';

    content.innerHTML = `
        <h3 style="margin-top:0; border-bottom:1px solid #444; padding-bottom:10px; color:#fff;">Настройки и Шаблоны</h3>
        
        <div class="vw-toggle-wrapper">
            <span class="vw-toggle-label">Автоматически закрывать жалобу после вставки шаблона (внутри темы)</span>
            <label class="vw-toggle">
                <input type="checkbox" id="setting-auto-close" ${isAutoClose ? 'checked' : ''}>
                <span class="vw-slider"></span>
            </label>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background: #222; border-radius: 4px; border:1px solid #333;">
            <input type="hidden" id="tpl-edit-index" value="-1">
            <label style="display:block; font-size:12px; color:#aaa; margin-bottom:4px;">Тип:</label>
            <select id="tpl-type" class="vw-input"><option value="measures">Меры приняты</option><option value="closed">Закрыто</option></select>
            <label style="display:block; font-size:12px; color:#aaa; margin-bottom:4px;">Название:</label>
            <input type="text" id="tpl-title" class="vw-input">
            <label style="display:block; font-size:12px; color:#aaa; margin-bottom:4px;">Текст:</label>
            <textarea id="tpl-text" rows="2" class="vw-input"></textarea>
            <div style="display:flex; gap:10px;">
                <button id="tpl-save-btn" class="ipsButton ipsButton_primary ipsButton_small" style="flex:1;">Добавить</button>
                <button id="tpl-cancel-edit" class="ipsButton ipsButton_light ipsButton_small" style="display:none;">Отмена</button>
            </div>
        </div>

        <div id="tpl-list" style="max-height: 200px; overflow-y: auto; border-top: 1px solid #444; padding-top:10px; margin-bottom: 15px;"></div>
        
        <div style="border-top: 1px solid #444; padding-top: 10px; margin-top: 10px;">
            <p style="font-size:12px; color:#aaa; margin-bottom:5px;">Резервное копирование (JSON):</p>
            <button id="btn-export-json" class="ipsButton ipsButton_verySmall ipsButton_light vw-io-btn">Скачать файл (Экспорт)</button>
            <button id="btn-import-json-trigger" class="ipsButton ipsButton_verySmall ipsButton_light vw-io-btn">Загрузить файл (Импорт)</button>
            <input type="file" id="file-import-input" accept=".json" style="display:none;">
        </div>

        <div style="margin-top: 15px; text-align: right;">
            <button id="tpl-close-btn" class="ipsButton ipsButton_light ipsButton_small">Закрыть окно</button>
        </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    const autoCloseCheckbox = content.querySelector('#setting-auto-close');
    const typeSelect = content.querySelector('#tpl-type');
    const titleInput = content.querySelector('#tpl-title'); 
    const textInput = content.querySelector('#tpl-text');
    const saveBtn = content.querySelector('#tpl-save-btn');
    const cancelBtn = content.querySelector('#tpl-cancel-edit');
    const editIndexInput = content.querySelector('#tpl-edit-index');
    const listDiv = content.querySelector('#tpl-list');

    content.querySelector('#btn-export-json').onclick = async () => {
        const data = await chrome.storage.local.get(STORAGE_KEY);
        const json = JSON.stringify(data[STORAGE_KEY] || [], null, 2);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "vime_templates.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const fileInput = content.querySelector('#file-import-input');
    content.querySelector('#btn-import-json-trigger').onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            try {
                let imported = JSON.parse(ev.target.result);
                if (Array.isArray(imported)) {
                    imported = imported.map(t => ({ title: "", ...t }));
                    await chrome.storage.local.set({ [STORAGE_KEY]: imported });
                    alert('Шаблоны успешно загружены!');
                    renderList();
                    const container = document.getElementById('template-bar-content');
                    if (container) renderTemplates(container);
                } else {
                    alert('Неверный формат файла!');
                }
            } catch (err) {
                alert('Ошибка чтения JSON: ' + err.message);
            }
        };
        reader.readAsText(file);
    };

    autoCloseCheckbox.addEventListener('change', async () => {
        await chrome.storage.local.set({ [SETTINGS_KEY]: { autoClose: autoCloseCheckbox.checked } });
    });

    const renderList = async () => {
        const data = await chrome.storage.local.get(STORAGE_KEY);
        const templates = data[STORAGE_KEY] || [];
        listDiv.innerHTML = '';
        
        templates.forEach((tpl, index) => {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin-bottom: 6px; background: #1a1d20; border: 1px solid #333a42; border-radius: 6px; gap: 12px;';
            const typeInfo = STYLES[tpl.type] || STYLES.closed;
            const displayName = (tpl.title && tpl.title.trim() !== "") ? `[${tpl.title}]` : "";
            
            item.innerHTML = `
                <div style="flex: 1; min-width: 0; font-size: 13px; color: #ddd; word-break: break-word; line-height: 1.4;">
                    <span style="color: ${typeInfo.color}; font-weight: bold; margin-right: 4px;">●</span> 
                    ${displayName ? `<strong style="color: #fff; margin-right: 4px;">${displayName}</strong> ` : ''}${tpl.comment}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0; margin-left: auto; white-space: nowrap;">
                     <button class="vw-action-btn vw-btn-edit" data-idx="${index}" title="Редактировать"><i class="fa fa-solid fa-pencil fa-pen" style="pointer-events: none;"></i></button>
                     <button class="vw-action-btn vw-btn-del" data-idx="${index}" title="Удалить"><span style="pointer-events: none; font-size: 16px; line-height: 1;">&times;</span></button>
                </div>
            `;
            listDiv.appendChild(item);
        });

        listDiv.querySelectorAll('.vw-btn-edit').forEach(b => b.onclick = (e) => {
            const idx = e.currentTarget.dataset.idx;
            const tpl = templates[idx];
            editIndexInput.value = idx;
            typeSelect.value = tpl.type;
            titleInput.value = tpl.title || ""; 
            textInput.value = tpl.comment;
            saveBtn.innerText = 'Сохранить';
            cancelBtn.style.display = 'block';
        });

        listDiv.querySelectorAll('.vw-btn-del').forEach(b => b.onclick = async (e) => {
            if(confirm('Удалить?')) {
                templates.splice(e.currentTarget.dataset.idx, 1);
                await chrome.storage.local.set({ [STORAGE_KEY]: templates });
                renderList();
                const container = document.getElementById('template-bar-content');
                if (container) renderTemplates(container);
            }
        });
    };

    saveBtn.onclick = async () => {
        const type = typeSelect.value;
        const title = titleInput.value.trim();
        const comment = textInput.value.trim();
        const index = parseInt(editIndexInput.value);
        if (!comment) return alert('Введите текст!');
        const data = await chrome.storage.local.get(STORAGE_KEY);
        const templates = data[STORAGE_KEY] || [];
        const newObj = { type, title, comment };
        if (index >= 0) templates[index] = newObj;
        else templates.push(newObj);
        await chrome.storage.local.set({ [STORAGE_KEY]: templates });
        editIndexInput.value = '-1';
        titleInput.value = '';
        textInput.value = '';
        saveBtn.innerText = 'Добавить';
        cancelBtn.style.display = 'none';
        renderList();
        const container = document.getElementById('template-bar-content');
        if (container) renderTemplates(container);
    };

    cancelBtn.onclick = () => {
        editIndexInput.value = '-1';
        titleInput.value = '';
        textInput.value = '';
        saveBtn.innerText = 'Добавить';
        cancelBtn.style.display = 'none';
    };

    content.querySelector('#tpl-close-btn').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    renderList();
}

const profileDataCache = {}; 

function getProfileData(url) {
    const cleanUrl = url.split('?')[0]; 

    if (profileDataCache[cleanUrl]) return profileDataCache[cleanUrl];

    profileDataCache[cleanUrl] = (async () => {
        const CACHE_KEY = 'vw_profile_' + cleanUrl;
        const CACHE_TTL = 60 * 60 * 1000;

        try {
            const cachedRaw = localStorage.getItem(CACHE_KEY);
            if (cachedRaw) {
                const parsed = JSON.parse(cachedRaw);
                if (Date.now() - parsed.timestamp < CACHE_TTL) {
                    return parsed.data;
                }
            }
        } catch (e) {
            console.warn("Ошибка чтения кэша профилей:", e);
        }

        try {
            const response = await fetch(cleanUrl);
            if (!response.ok) return null;
            
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');

            let nickname = null;
            let reputation = "0";

            const items = doc.querySelectorAll('.ipsDataItem, .ipsData__item');
            for (let item of items) {
                const label = item.querySelector('strong, .ipsData__title'); 
                if (label && label.textContent.trim() === 'Ник') {
                    const desc = item.querySelector('.ipsData__desc, .ipsContained');
                    if (desc) {
                        nickname = desc.textContent.trim();
                    } else {
                        const valueContainers = item.querySelectorAll('.ipsDataItem_generic');
                        if (valueContainers.length > 1) {
                            nickname = valueContainers[valueContainers.length - 1].textContent.trim();
                        } else {
                            nickname = item.textContent.replace('Ник', '').trim();
                        }
                    }
                    break;
                }
            }

            const repElement = doc.querySelector('.cProfileRepScore, [data-action="repLog"] ~ div, .ipsData__item:has([data-action="repLog"]) .i-font-weight_600');
            if (repElement) reputation = repElement.textContent.trim();

            const result = { nickname, reputation };

            if (nickname) {
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: result,
                        timestamp: Date.now()
                    }));
                } catch (e) {
                    console.warn("Ошибка записи в кэш (возможно, память переполнена):", e);
                }
            }

            return result;
        } catch (e) {
            console.error("Ошибка парсинга профиля:", e);
            return null;
        }
    })();

    return profileDataCache[cleanUrl];
}

async function processForumTopicAuthors() {
    if (!window.location.href.includes('/topic/')) return;

    const authorBlocks = Array.from(document.querySelectorAll(
        '.cAuthorPane:not([data-vw-processed="true"]), aside.ipsEntry__author-column:not([data-vw-processed="true"]), [data-ips-hook="topicAuthorColumn"].ipsEntry__author-column:not([data-vw-processed="true"])'
    ));
    if (authorBlocks.length === 0) return;

    authorBlocks.forEach(b => b.dataset.vwProcessed = "true");

    for (const block of authorBlocks) {
        const profileLink = block.querySelector(
            'h3.cAuthorPane_author a, h3.ipsEntry__username a, [data-ips-hook="postUsername"] a'
        );
        if (!profileLink) continue;

        const profileData = await getProfileData(profileLink.href);
        if (!profileData) continue;

        const statsUl = block.querySelector(
            'li[data-role="stats"] ul, ul.ipsEntry__authorStats, [data-ips-hook="postUserStats"]'
        );
        if (statsUl && profileData.reputation !== undefined && !statsUl.querySelector('.vw-reputation-item')) {
            const repLi = document.createElement('li');
            repLi.className = 'vw-reputation-item';
            
            let repColor = '#a3a3a3'; 
            if (profileData.reputation.includes('-')) repColor = '#e74c3c'; 
            else if (profileData.reputation !== '0' && profileData.reputation !== '') repColor = '#2ecc71'; 

            repLi.innerHTML = `
                <a href="#" class="ipsType_blendLinks" title="Репутация" style="pointer-events: none; cursor: default;">
                    <i class="fa fa-solid fa-arrow-up" style="color: ${repColor}"></i> ${profileData.reputation}
                </a>
            `;
            statsUl.appendChild(repLi);
        }

        const nick = profileData.nickname;
        if (nick) {
            const user = await fetchUserData(nick); 
            
            if (user && typeof isValidRank !== 'undefined' && isValidRank(user.rank)) {
                const rankInfo = getRankInfoReporter(user.rank);
                if (!rankInfo) continue;

                if (block.querySelector('.vw-forum-ingame-nick')) continue;

                const wrapperElem = document.createElement(block.tagName === 'UL' ? 'li' : 'div');
                wrapperElem.style.marginTop = '6px';
                wrapperElem.style.marginBottom = '2px';
                wrapperElem.style.fontSize = '13px';
                wrapperElem.style.fontWeight = 'bold';
                wrapperElem.style.textAlign = 'center';
                wrapperElem.style.whiteSpace = 'nowrap';
                wrapperElem.className = 'vw-forum-ingame-nick';

                const prefixSpan = document.createElement("span");
                const prefixLabel = user.prefix ? `[${user.prefix}]` : rankInfo.label;
                if (prefixLabel) {
                    prefixSpan.textContent = `${prefixLabel} `;
                    prefixSpan.style.color = getFirstColor(rankInfo.defaultColor);
                }

                const nickSpan = document.createElement("span");
                applyGradient(nickSpan, user.customColors || [], rankInfo.defaultColor);
                nickSpan.textContent = user.username;

                wrapperElem.append(prefixSpan, nickSpan);

                const isDeveloper = ['kaossent', '__skeletron__', 'kaicenat', 'Moderator_Denis'].includes(user.username.toLowerCase());
                if (isDeveloper) {
                    const starSpan = document.createElement('span');
                    starSpan.className = 'developer-star';
                    starSpan.textContent = '★';
                    starSpan.style.marginLeft = '4px';
                    
                    const tooltip = document.createElement('span');
                    tooltip.className = 'tooltip-text';
                    tooltip.textContent = 'Разработчик';
                    starSpan.appendChild(tooltip);

                    const forumNameH3 = block.querySelector('h3.cAuthorPane_author, h3.ipsEntry__username, [data-ips-hook="postUsername"]');
                    if (forumNameH3 && !forumNameH3.querySelector('.developer-star')) {
                        forumNameH3.appendChild(starSpan);
                    }
                }

                const photoContainer = block.querySelector('li[data-role="photo"], .ipsAvatarStack, [data-ips-hook="postUserPhoto"]');
                if (photoContainer) {
                    photoContainer.after(wrapperElem);
                } else {
                    const usernameElem = block.querySelector('h3.ipsEntry__username, [data-ips-hook="postUsername"]');
                    if (usernameElem) usernameElem.before(wrapperElem);
                    else block.prepend(wrapperElem);
                }
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1));
    }
}

async function processProfileContactsNick() {
    if (!window.location.href.includes('/profile/')) return;

    const items = document.querySelectorAll('.ipsDataItem, .ipsData__item');
    let targetDiv = null;
    let nickname = null;

    for (let item of items) {
        const label = item.querySelector('span > strong, strong.ipsData__title, strong');
        if (label && label.textContent.trim() === 'Ник') {
            const valueDiv = item.querySelector('.ipsData__desc, div.ipsDataItem_generic > div.ipsContained, .ipsContained');
            if (valueDiv && !valueDiv.dataset.vwProcessed) {
                targetDiv = valueDiv;
                nickname = valueDiv.textContent.trim();
                break;
            }
        }
    }

    if (!targetDiv || !nickname) return;
    targetDiv.dataset.vwProcessed = "true";

    try {
        const user = await fetchUserData(nickname); 
        if (user && typeof isValidRank !== 'undefined' && isValidRank(user.rank)) {
            const rankInfo = getRankInfoReporter(user.rank);
            if (!rankInfo) return;

            targetDiv.innerHTML = '';
            targetDiv.style.fontWeight = 'bold';
            targetDiv.style.display = 'inline-block';

            const isDeveloper = ['kaossent', '__skeletron__', 'kaicenat', 'Moderator_Denis'].includes(user.username.toLowerCase());
            if (isDeveloper) {
                const starSpan = document.createElement('span');
                starSpan.className = 'developer-star';
                starSpan.textContent = '★ ';
                starSpan.title = 'Разработчик';
                targetDiv.appendChild(starSpan);
            }

            const prefixSpan = document.createElement("span");
            const prefixLabel = user.prefix ? `[${user.prefix}]` : rankInfo.label;
            if (prefixLabel) {
                prefixSpan.textContent = `${prefixLabel} `;
                prefixSpan.style.color = getFirstColor(rankInfo.defaultColor);
            }
            targetDiv.appendChild(prefixSpan);

            const nickSpan = document.createElement("span");
            applyGradient(nickSpan, user.customColors || [], rankInfo.defaultColor);
            nickSpan.textContent = user.username;
            targetDiv.appendChild(nickSpan);
        }
    } catch (e) {
        console.error("Ошибка стилизации ника в профиле:", e);
    }
}

let forumDebounceTimer = null;
const forumEnhancementsObserver = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const cl = node.classList;
                if (cl && (
                    cl.contains('vw-editor-verdicts-wrap') ||
                    cl.contains('vw-editor-measures-wrap') || 
                    cl.contains('vw-editor-verdict-btn') ||
                    cl.contains('vw-editor-measures-btn') ||
                    cl.contains('vw-editor-closed-btn') ||
                    cl.contains('vw-btn-reply-and-close') ||
                    cl.contains('vw-reputation-item') ||
                    cl.contains('vw-forum-ingame-nick') ||
                    cl.contains('vw-fast-mod-container') ||
                    cl.contains('vw-tpl-btn')
                )) {
                    continue;
                }
                if (node.id === 'template-bar-wrapper' || node.id === 'vw-forum-styles') {
                    continue;
                }
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) break;
    }

    if (shouldUpdate) {
        if (forumDebounceTimer) clearTimeout(forumDebounceTimer);
        forumDebounceTimer = setTimeout(() => {
            checkAndInitForumTools();
            initEditorToolbarMeasuresButton();
            processForumTopicAuthors();
            processProfileContactsNick();
        }, 200);
    }
});

// Инициализация
function initForumEnhancements() {
    if (window.location.href.includes('forum.vimeworld.com')) {
        initForumTool();
        processForumTopicAuthors();
        processProfileContactsNick();
        initEditorToolbarMeasuresButton();
        forumEnhancementsObserver.observe(document.body, { childList: true, subtree: true });
    }
}

document.addEventListener('vwExtensionReady', () => {
    initForumEnhancements();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initForumEnhancements();
} else {
    document.addEventListener('DOMContentLoaded', () => initForumEnhancements());
}

// Проверка динамических элементов
let checkCount = 0;
const interval = setInterval(() => {
    checkAndInitForumTools();
    initEditorToolbarMeasuresButton();
    checkCount++;
    if (checkCount > 20 && document.getElementById('template-bar-wrapper') && document.querySelector('.vw-editor-measures-btn') && document.querySelector('.vw-editor-closed-btn')) {
        clearInterval(interval);
    }
}, 500);