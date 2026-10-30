function getRankInfo(rank) {
    switch (rank) {
        case "PLAYER":
            return { label: "", defaultColor: "" }; 
        case "VIP":
            return { label: "Vip", defaultColor: "#1cd41c" };
        case "PREMIUM":
            return { label: "Premium", defaultColor: "#00dada" };
        case "HOLY":
            return { label: "Holy", defaultColor: ["#fff8a9", "#ffa317"]};
        case "IMMORTAL":
            return { label: "Immortal", defaultColor: ["#ff70d1","#ff5d6d"]};
        case "DIVINE":
            return { label: "Divine", defaultColor: ["#b451ff", "#84b5ff"] };
        case "THANE":
            return { label: "Thane", defaultColor: ["#30ff87","#1cffe4","#3594ff"] };
        case "ELITE":
            return { label: "Elite", defaultColor: ["#ffa51e","#ff5619","#ff314a"]};
        case "ETERNAL":
            return { label: "Eternal", defaultColor: ["#2688ed","#8b00d7","#ff4161"] };
        case "CELESTIAL":
            return { label: "Celestial", defaultColor: ["#e0f3ff", "#bfdfff", "#96c6ff", "#6895d6"] };
        case "ABSOLUTE":
            return { label: "Absolute", defaultColor: ["#f200ff", "#972a6e", "#632f59", "#dd57bc"] };
        case "IMPERIAL":
            return { label: "Imperial", defaultColor: ["#fdbd05", "#ffa630", "#fffabd", "#fdbd05"] };
        case "ULTIMATE":
            return { label: "Ultimate", defaultColor: ["#4f4f4f", "#737272", "#fbf7ff", "#3a3a3a"] };
        case "YOUTUBE":
            return { label: "Media", defaultColor: ["#bf2dff","#f33fd7"]}; 
        case "VIME":
            return { label: "Vime", defaultColor: ["#2599d4","#1d7cab"] }; 
        case "ORGANIZER":
            return { label: "Организатор", defaultColor: ["#0d83ae","#00c0eb"] }; 
        case "DEV":
            return { label: "Разработчик", defaultColor: "#d61753" }; 
        case "BUILDER":
            return { label: "Билдер", defaultColor: ["#67ff54","#16bd00"] }; 
        case "SRBUILDER":
            return { label: "Проверенный билдер", defaultColor: ["#67ff54","#16bd00"]};
        case "MAPLEAD":
            return { label: "Главный билдер", defaultColor: ["#55961a","#3f6e13"] };  
        case "HELPER":
            return { label: "Хелпер", defaultColor: "#76a6ff" }; 
        case "MODER":
            return { label: "Модератор", defaultColor: "#4e62eb" };
        case "WARDEN":
            return { label: "Проверенный модератор", defaultColor: "#3c36de" };
        case "CHIEF":
            return { label: "Администратор", defaultColor: ["#ff5e43","#db2100"]};
        case "ADMIN":
            return { label: "Главный администратор", defaultColor: ["#ff2030","#d40048","#c1006b"]};
        default:
            return null; 
    }
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
    element.style.fontWeight = ""; 

    let gradientColors = [];

    if (colors && colors.length > 0) {
        gradientColors = colors.map(formatColor).filter(Boolean);
    } else if (Array.isArray(defaultColor) && defaultColor.length > 1) {
        gradientColors = defaultColor.map(formatColor).filter(Boolean);
    } else if (typeof defaultColor === "string") {
        element.style.color = formatColor(defaultColor);
        element.style.fontWeight = 'bold'; 
        return;
    }

    if (gradientColors.length < 2) {
        element.style.color = gradientColors[0] || defaultColor;
        element.style.fontWeight = 'bold';
        return;
    }

    element.style.background = `linear-gradient(to right, ${gradientColors.join(", ")})`;
    element.style.webkitBackgroundClip = "text";
    element.style.backgroundClip = "text";
    element.style.webkitTextFillColor = "transparent";
    element.style.textFillColor = "transparent";
    element.style.fontWeight = 'bold';
}

function getFirstColor(color) {
  if (Array.isArray(color) && color.length) return formatColor(color[0]);
  return formatColor(color);
}

function getRankPrefixInfo(rank) {
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

function formatPlayedTime(totalSeconds) {
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalDays = Math.floor(totalHours / 24);
  const remainderHours = totalHours % 24;

  return `${totalHours} ч. (${totalDays} дн. и ${remainderHours} ч.)`;
}

function getColClasses(dl) {
  if (dl) {
    const existingDt = dl.querySelector('dt');
    if (existingDt && existingDt.classList.contains('col-sm-3')) {
      return { dt: 'col-sm-3', dd: 'col-sm-9' };
    }
  }
  return { dt: 'col-sm-4', dd: 'col-sm-8' };
}

function createDlRow(dl, term, definition) {
  const cols = getColClasses(dl);
  const dt = document.createElement('dt');
  dt.className = cols.dt;
  dt.textContent = term;

  const dd = document.createElement('dd');
  dd.className = cols.dd;
  dd.textContent = definition;

  dl.appendChild(dt);
  dl.appendChild(dd);
  
  return dd;
}

function findOrCreateDlRow(dl, term) {
  const allDt = dl.querySelectorAll('dt');
  for (const dt of allDt) {
    if (dt.textContent.trim().toLowerCase() === term.toLowerCase()) {
      return dt.nextElementSibling;
    }
  }
  return createDlRow(dl, term, '');
}

function isThemeLight() {
    const htmlTheme = document.documentElement.getAttribute('data-bs-theme');
    const bodyTheme = document.body.getAttribute('data-bs-theme');
    if (htmlTheme === 'light' || bodyTheme === 'light') return true;
    if (htmlTheme === 'dark' || bodyTheme === 'dark') return false;

    const card = document.querySelector('.card') || document.body;
    if (card) {
        const bg = window.getComputedStyle(card).backgroundColor;
        const rgb = bg.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
            return brightness > 130;
        }
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
}

/**
 * @param {number} level 
 * @returns {number} 
 */
function calculateTotalExpForLevel(level) {
    const baseExp = 8000;
    const increment = 2000;
    
    if (level === 1) {
        return baseExp;
    }
    const totalExp = baseExp + (level - 1) * increment;
    return totalExp;
}

/**
 * @param {string} nickname
 * @param {HTMLElement} dlElement
 * @param {HTMLElement} nickDd
 */
async function fetchAndInjectInfo(nickname, dlElement, nickDd) {
  try {
    const userResponse = await fetch(`https://api.vimeworld.com/user/name/${nickname}`);
    const userData = await userResponse.json();
    
    if (!userData || userData.length === 0) {
      console.warn(`[VimeWorld CP Info] Игрок ${nickname} не найден.`);
      return;
    }
    
    const info = userData[0]; 

    nickDd.textContent = ''; 
    const prefixInfo = getRankPrefixInfo(info.rank);
    const nickRankInfo = getRankInfo(info.rank); 
    
    const apiPrefix = info.prefix;
    const customColors = info.customColors || [];
    const defaultNickColor = nickRankInfo ? nickRankInfo.defaultColor : null;

    const prefixSpan = document.createElement('span');
    const prefixLabel = apiPrefix ? `[${apiPrefix}]` : (prefixInfo ? prefixInfo.label : '');
    
    if (prefixLabel) {
        prefixSpan.textContent = `${prefixLabel} `;
        prefixSpan.style.color = getFirstColor(prefixInfo ? prefixInfo.defaultColor : null);
        prefixSpan.style.fontWeight = 'bold';
        nickDd.appendChild(prefixSpan);
    }

    const nickSpan = document.createElement('span');
    nickSpan.textContent = info.username;

    applyGradient(nickSpan, customColors, defaultNickColor);
    nickDd.appendChild(nickSpan);

    try {
        const allP = document.querySelectorAll('p');
        let statusB = null;

        for (const p of allP) {
            if (p.textContent.includes('Текущий статус:')) {
                statusB = p.querySelector('b');
                if (statusB) break;
            }
        }

        if (statusB) {
            const highRankInfo = getRankInfo(info.rank);
            if (highRankInfo && highRankInfo.defaultColor) {
                statusB.textContent = highRankInfo.label;
                applyGradient(statusB, [], highRankInfo.defaultColor);
            }
        }
    } catch (e) {
        console.warn("[VimeWorld CP Info] Не удалось стилизовать 'Текущий статус':", e);
    }

    const playedTime = formatPlayedTime(info.playedSeconds);
    const guildInfo = info.guild ? `<${info.guild.tag}> ${info.guild.name}` : 'Нет';

    const ranks = info.ranks || [];
    const statusDd = findOrCreateDlRow(dlElement, 'Статус');
    statusDd.innerHTML = '';

    const displayRanks = ranks
        .map(rank => getRankInfo(rank)) 
        .filter(rankInfo => rankInfo && rankInfo.label);

    if (displayRanks.length === 0) {
        const rankSpan = document.createElement('span');
        rankSpan.textContent = "Игрок";
        rankSpan.style.fontWeight = 'bold'; 
        statusDd.appendChild(rankSpan);
    } else {
        const mainRank = displayRanks[0];
        const mainRankDiv = document.createElement('div');
        mainRankDiv.textContent = mainRank.label;
        mainRankDiv.style.width = 'fit-content';
        applyGradient(mainRankDiv, [], mainRank.defaultColor);
        statusDd.appendChild(mainRankDiv);

        if (displayRanks.length > 1) {
            const otherRanks = displayRanks.slice(1);
            
            otherRanks.forEach((rankInfo) => {
                const rankLineDiv = document.createElement('div');
                rankLineDiv.style.display = 'flex';
                rankLineDiv.style.alignItems = 'center';

                const plusSpan = document.createElement('span');
                plusSpan.textContent = '+';
                plusSpan.style.fontWeight = 'bold';
                plusSpan.style.marginRight = '4px'; 

                const rankLabelSpan = document.createElement('span');
                rankLabelSpan.textContent = rankInfo.label;
                rankLabelSpan.style.width = 'fit-content';
                applyGradient(rankLabelSpan, [], rankInfo.defaultColor); 
                
                rankLineDiv.appendChild(plusSpan);
                rankLineDiv.appendChild(rankLabelSpan);

                statusDd.appendChild(rankLineDiv);
            });
        }
    }

    const gameDd = findOrCreateDlRow(dlElement, 'Наиграно');
    if (!gameDd.textContent.trim() || gameDd.textContent.trim() === '—') {
        gameDd.textContent = playedTime;
    }
    const guildDd = findOrCreateDlRow(dlElement, 'В гильдии');
    if (!guildDd.textContent.trim()) {
        guildDd.textContent = guildInfo;
    }
    
    try {
        if (!dlElement.querySelector('#vw_level_panel')) {
            const level = info.level;
            const nextLevel = level + 1;
            const levelPercentage = info.levelPercentage; 

            const totalExp = calculateTotalExpForLevel(level);
            const currentExp = Math.floor(totalExp * levelPercentage);
            const displayPercent = Math.floor(levelPercentage * 100); 
            const cssPercent = (levelPercentage * 100).toFixed(2); 

            const cols = getColClasses(dlElement);
            const panelDt = document.createElement('dt');
            panelDt.className = cols.dt;
            panelDt.id = 'vw_level_dt';
            panelDt.textContent = 'Уровень';

            const panelDd = document.createElement('dd');
            panelDd.className = cols.dd;
            panelDd.id = 'vw_level_dd';

            const levelPanel = document.createElement('div');
            levelPanel.id = 'vw_level_panel';
            levelPanel.style.display = 'flex';
            levelPanel.style.flexDirection = 'column'; 
            levelPanel.style.alignItems = 'stretch'; 
            levelPanel.style.width = '100%'; 
            levelPanel.style.boxSizing = 'border-box'; 
            levelPanel.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
            levelPanel.style.marginTop = '4px'; 
            levelPanel.style.marginBottom = '4px'; 

            const barWrapper = document.createElement('div');
            barWrapper.style.display = 'flex';
            barWrapper.style.flexDirection = 'row';
            barWrapper.style.alignItems = 'center';
            barWrapper.style.width = '100%';
            barWrapper.style.fontSize = '0.9rem';

            const expStartEl = document.createElement('span');
            expStartEl.style.flexShrink = '0';
            expStartEl.style.marginRight = '10px';
            expStartEl.textContent = level; 

            const isLight = isThemeLight();

            const progressBarContainer = document.createElement('div');
            progressBarContainer.className = 'vw-level-progressbar';
            progressBarContainer.style.flexGrow = '1'; 
            progressBarContainer.style.position = 'relative'; 
            progressBarContainer.style.backgroundColor = isLight ? '#e9ecef' : '#2b2b2b';
            progressBarContainer.style.borderRadius = '25px';
            progressBarContainer.style.height = '20px';
            progressBarContainer.style.border = isLight ? '1px solid #ced4da' : '2px solid #222';
            progressBarContainer.style.boxShadow = isLight ? 'inset 0 1px 2px rgba(0,0,0,0.08)' : 'inset 0 1px 3px rgba(0,0,0,0.5)';
            progressBarContainer.style.cursor = 'pointer'; 
            
            const progressBarFill = document.createElement('div');
            progressBarFill.style.position = 'absolute';
            progressBarFill.style.top = '0';
            progressBarFill.style.left = '0';
            progressBarFill.style.height = '100%';
            progressBarFill.style.backgroundColor = '#4caf50';
            progressBarFill.style.borderRadius = '25px';
            progressBarFill.style.transition = 'width 0.5s ease-out';
            progressBarFill.style.width = `${cssPercent}%`;
            progressBarFill.style.zIndex = '1'; 

            const expCurrentEl = document.createElement('div');
            expCurrentEl.className = 'vw-level-percent';
            expCurrentEl.style.position = 'absolute';
            expCurrentEl.style.top = '0';
            expCurrentEl.style.left = '0';
            expCurrentEl.style.right = '0';
            expCurrentEl.style.bottom = '0';
            expCurrentEl.style.display = 'flex';
            expCurrentEl.style.justifyContent = 'center';
            expCurrentEl.style.alignItems = 'center';
            expCurrentEl.style.fontWeight = 'bold';
            expCurrentEl.style.fontSize = '0.8rem';
            expCurrentEl.style.zIndex = '2'; 
            expCurrentEl.style.color = isLight ? '#212529' : '#ffffff';
            expCurrentEl.style.textShadow = isLight ? '0 0 2px rgba(255,255,255,0.9)' : '0 0 3px rgba(0,0,0,0.8)'; 
            expCurrentEl.textContent = `${displayPercent}%`;

            const expTotalEl = document.createElement('span');
            expTotalEl.style.flexShrink = '0';
            expTotalEl.style.marginLeft = '10px';
            expTotalEl.textContent = nextLevel; 

            const tooltipEl = document.createElement('div');
            tooltipEl.textContent = `${currentExp} / ${totalExp} EXP`;
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.visibility = 'hidden';
            tooltipEl.style.opacity = '0';
            tooltipEl.style.transition = 'opacity 0.2s ease, visibility 0.2s ease';
            tooltipEl.style.backgroundColor = '#212529';
            tooltipEl.style.color = '#ffffff';
            tooltipEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            tooltipEl.style.padding = '5px 10px';
            tooltipEl.style.borderRadius = '4px';
            tooltipEl.style.fontSize = '0.85rem';
            tooltipEl.style.fontWeight = 'bold';
            tooltipEl.style.zIndex = '100';
            tooltipEl.style.bottom = '130%';
            tooltipEl.style.left = '50%';
            tooltipEl.style.transform = 'translateX(-50%)';
            tooltipEl.style.whiteSpace = 'nowrap';
            tooltipEl.style.pointerEvents = 'none';

            const tooltipArrow = document.createElement('div');
            tooltipArrow.style.position = 'absolute';
            tooltipArrow.style.bottom = '-5px';
            tooltipArrow.style.left = '50%';
            tooltipArrow.style.transform = 'translateX(-50%)';
            tooltipArrow.style.width = '0';
            tooltipArrow.style.height = '0';
            tooltipArrow.style.borderLeft = '5px solid transparent';
            tooltipArrow.style.borderRight = '5px solid transparent';
            tooltipArrow.style.borderTop = '5px solid #212529';

            tooltipEl.appendChild(tooltipArrow);
            progressBarContainer.appendChild(tooltipEl);

            progressBarContainer.addEventListener('mouseover', () => {
                tooltipEl.style.visibility = 'visible';
                tooltipEl.style.opacity = '1';
            });
            
            progressBarContainer.addEventListener('mouseout', () => {
                tooltipEl.style.visibility = 'hidden';
                tooltipEl.style.opacity = '0';
            });

            progressBarContainer.appendChild(progressBarFill);
            progressBarContainer.appendChild(expCurrentEl); 

            barWrapper.appendChild(expStartEl);
            barWrapper.appendChild(progressBarContainer);
            barWrapper.appendChild(expTotalEl);
            
            levelPanel.appendChild(barWrapper);
            panelDd.appendChild(levelPanel);

            let insertBeforeNode = null;
            const allDt = dlElement.querySelectorAll('dt');
            for (const dt of allDt) {
                const txt = dt.textContent.trim().toLowerCase();
                if (txt === 'наиграно' || txt === 'в гильдии' || txt === 'опыт') {
                    insertBeforeNode = dt;
                    break;
                }
            }
            if (insertBeforeNode) {
                dlElement.insertBefore(panelDt, insertBeforeNode);
                dlElement.insertBefore(panelDd, insertBeforeNode);
            } else {
                dlElement.appendChild(panelDt);
                dlElement.appendChild(panelDd);
            }
        }

    } catch (e) {
        console.error("[VimeWorld CP Info] Ошибка при создании панели уровня:", e);
    }

  } catch (error) {
    console.error("[VimeWorld CP Info] Ошибка при получении данных:", error);
  }
}

function checkAndProcessPlayerCards() {
  const allDt = document.querySelectorAll('dl.row dt, dl dt');
  for (const dt of allDt) {
    if (dt.textContent.trim() === 'Ник') {
      const nickDd = dt.nextElementSibling;
      const dlParent = dt.parentElement;
      if (nickDd && dlParent) {
        const rawNick = nickDd.textContent.trim();
        const nickname = rawNick.replace(/\[.*?\]/g, '').trim().split(/\s+/).pop();
        if (nickname && dlParent.dataset.vwUserCardProcessed !== nickname && !nickname.includes('[')) {
          dlParent.dataset.vwUserCardProcessed = nickname;
          fetchAndInjectInfo(nickname, dlParent, nickDd);
        }
      }
    }
  }
}

setInterval(checkAndProcessPlayerCards, 600);
document.addEventListener('DOMContentLoaded', checkAndProcessPlayerCards);
window.addEventListener('popstate', checkAndProcessPlayerCards);