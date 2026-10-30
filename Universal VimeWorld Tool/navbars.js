(function() {
    const currentUrl = window.location.href;

    if (!currentUrl.includes("forum.vimeworld.com")) {
        
        const structuralStyle = document.createElement('style');
        
        if (currentUrl.includes("legacy-cp.vimeworld.com")) {
            structuralStyle.textContent =
                `
                .navbar {
                    max-width: 1100px !important;
                }

                .navbar.navbar-default.navbar-static-top {
                    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important;
                    border: none !important;
                    margin-bottom: 0 !important;
                }

                .navbar.navbar-default .navbar-brand {
                    font-weight: bold !important;
                    height: auto;
                    padding-top: 1.8rem !important;
                    padding-bottom: 0.8rem !important;
                }

                .navbar.navbar-default .nav.navbar-nav > li > a {
                    font-weight: 500;
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                    padding-left: 1rem !important;
                    padding-right: 1rem !important;
                    margin: 2px;
                }

                .navbar.navbar-default .nav.navbar-nav > li.active > a,
                .navbar.navbar-default .nav.navbar-nav > li.active > a:hover {
                    font-weight: bold !important; 
                    border-radius: 10px !important;
                    background-color: #2196f3 !important;
                    color: #ffffff !important;
                }

                .navbar.navbar-default .navbar-toggle {
                    margin-top: 1rem !important;
                }
            `;
        }
        else if (currentUrl.includes("cp.vimeworld.com") && !currentUrl.includes("legacy-cp.vimeworld.com")) {
             structuralStyle.textContent = `
                a.nav-link.active {
                    border-radius: 10px !important;
                    background-color: #2196f3 !important;
                    color: #ffffff !important;
                    font-weight: bold !important;
                }

                #vw-forum-dropdown-wrapper {
                    position: relative !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    z-index: 1060 !important;
                }

                #vw-forum-dropdown-menu {
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    z-index: 1070 !important;
                    margin-top: 0.25rem !important;
                }

                .navbar-nav .dropdown-menu .dropdown-item {
                     font-size: 13px !important;
                }

                .dropdown-menu.show {
                     display: block !important;
                }
             `;
        }
        
        document.head.appendChild(structuralStyle);
    }

    if (!currentUrl.includes("forum.vimeworld.com")) {

        if (currentUrl.includes("legacy-cp.vimeworld.com/moder/reports") || currentUrl.includes("legacy-cp.vimeworld.com/moder/usernames")) {

            try {
                const bTag = document.querySelector("span.pull-left b");
                let nickname = null;
                if (bTag && bTag.lastChild) {
                    nickname = bTag.lastChild.textContent.trim(); 
                }

                const serverLink = document.getElementById("top_servers_btn");
                const serverLi = serverLink ? serverLink.parentElement : null;

                if (nickname && serverLink && serverLi) {
                    
                    const separatorLi = document.createElement('li');
                    separatorLi.setAttribute('role', 'presentation');
                    separatorLi.style.cssText = 'padding: 0 !important; margin: 0 !important;'; 
                    separatorLi.innerHTML = `<div style="border-left: 1px solid #404040; height: 30px; margin: 10px 10px 0px 0px;"></div>`;

                    serverLi.parentElement.insertBefore(separatorLi, serverLi);

                    const newLinkHTML = `
                    <span>
                        <img width="26" height="26" alt="${nickname}" src="https://skin.vimeworld.com/helm/3d/${nickname}/52.png" 
                             style="filter: invert(0); border-radius: 4px; margin-top: -4px; margin-right: 3px; vertical-align: middle;">
                        <span style="vertical-align: middle;">${nickname}</span>
                        <span class="caret" style="margin-left: 5px;"></span> 
                    </span>
                    `;

                    serverLink.innerHTML = newLinkHTML;

                    serverLink.style.paddingTop = '12px';
                    serverLink.style.paddingBottom = '12px';

                    serverLink.style.setProperty("background", "transparent", "important");
                    serverLink.style.setProperty("border-radius", "0", "important");
                }
            } catch (e) {
                console.error("Ошибка при замене дропдауна сервера:", e);
            }

            const navList = document.querySelector(".collapse.navbar-collapse .nav.navbar-nav:not(.navbar-right)");
            if (navList) {
                const siteLi = document.createElement('li');
                siteLi.innerHTML = '<a href="https://vimeworld.com" target="_blank">Сайт</a>';

                const forumLi = document.createElement('li');
                forumLi.className = 'dropdown';
                forumLi.innerHTML = `
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                        Форум <span class="caret"></span>
                    </a>
                    <ul class="dropdown-menu">
                        <li><a href="https://forum.vimeworld.com" target="_blank">Главная форума</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="https://forum.vimeworld.com/topic/15-общее-положение-правил-сервера-и-форума" target="_blank">Правила</a></li>
                        <li><a href="https://forum.vimeworld.com/topic/1321111-правила-мутов-и-банов-на-серверах-update-11092025" target="_blank">Наказания</a></li>
                        <li><a href="https://forum.vimeworld.com/topic/1336480-вопросы-помощники-в-освоении-нюансов-правил-vimeworlda-update-27102024" target="_blank">FAQ игроков</a></li>
                        <li><a href="https://forum.vimeworld.com/topic/1323399-faq-часто-задаваемые-вопросы-update-15092025" target="_blank">FAQ модерский</a></li>
                    </ul>
                `;

                const newsLi = document.createElement('li');
                newsLi.innerHTML = '<a href="https://forum.vimeworld.com/forum/139-%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8/" target="_blank">Новости</a>';

                const lkLi = document.createElement('li');
                lkLi.innerHTML = '<a href="https://cp.vimeworld.com">Личный кабинет</a>';

                navList.prepend(lkLi);
                navList.prepend(newsLi);
                navList.prepend(forumLi);
                navList.prepend(siteLi);

                const dictionaryLi = document.createElement('li');
                dictionaryLi.innerHTML = '<a href="https://docs.google.com/spreadsheets/d/1nbhO0hBGmN9WvAoc-pUEDsCTtTPxG8TNj1EM5uRAKPY/edit?gid=0#gid=0" target="_blank">Словарь</a>';
                navList.appendChild(dictionaryLi);

                const serverDropdownMenu = document.querySelector(".nav.navbar-nav.navbar-right .dropdown-menu");
                const logoutLink = navList.querySelector('a[href="../index"]');

                if (serverDropdownMenu && logoutLink) {
                    const logoutListItem = logoutLink.parentElement;

                    const separator = document.createElement('li');
                    separator.setAttribute('role', 'separator');
                    separator.className = 'divider';

                    serverDropdownMenu.appendChild(separator);
                    serverDropdownMenu.appendChild(logoutListItem);
                }

                const navItems = navList.querySelectorAll('li');
                navItems.forEach(li => li.classList.remove('active'));

                if (currentUrl.includes("/moder/reports")) {
                    const activeLink = navList.querySelector('a[href*="./reports"]');
                    if (activeLink) activeLink.parentElement.classList.add('active');
                } else if (currentUrl.includes("/moder/usernames")) {
                    const activeLink = navList.querySelector('a[href*="./usernames"]');
                    if (activeLink) activeLink.parentElement.classList.add('active');
                } else {

                     const activeLink = navList.querySelector('a[href="https://cp.vimeworld.com"]');
                     if (activeLink) activeLink.parentElement.classList.add('active');
                }
            }
        }

        if (currentUrl.includes("cp.vimeworld.com") && !currentUrl.includes("legacy-cp.vimeworld.com")) {
            function setupModernCpNavbar() {
                try {
                    const url = window.location.href;
                    if (!url.includes("cp.vimeworld.com") || url.includes("legacy-cp.vimeworld.com")) return;

                    const navContainer = document.querySelector('.navbar-nav.flex-grow-1, .flex-grow-1.navbar-nav, header .navbar-nav, nav .navbar-nav');
                    if (!navContainer) return;

                    // 1. Forum dropdown
                    const forumLink = navContainer.querySelector('a.nav-link[href*="forum.vimeworld.com"]:not([href*="/forum/139"])') ||
                                      Array.from(navContainer.querySelectorAll('a')).find(a => {
                                          if (a.closest && a.closest('.dropdown-menu')) return false;
                                          const text = (a.textContent || '').trim().toLowerCase();
                                          const href = (a.getAttribute('href') || '').toLowerCase();
                                          return (text === 'форум' || href === 'https://forum.vimeworld.com' || href === 'https://forum.vimeworld.com/') && !href.includes('/forum/139');
                                      });

                    if (forumLink && !forumLink.classList.contains('dropdown-toggle') && !document.getElementById('vw-forum-dropdown-wrapper')) {
                        const isParentLi = forumLink.parentElement && forumLink.parentElement.tagName === 'LI';
                        const dropdownWrapper = document.createElement(isParentLi ? 'li' : 'div');
                        dropdownWrapper.className = 'nav-item dropdown';
                        dropdownWrapper.id = 'vw-forum-dropdown-wrapper';
                        dropdownWrapper.style.position = 'relative';
                        dropdownWrapper.style.zIndex = '1060';
                        dropdownWrapper.style.display = 'inline-flex';
                        dropdownWrapper.style.alignItems = 'center';

                        forumLink.classList.add('dropdown-toggle');
                        forumLink.id = 'forum-dropdown';
                        forumLink.setAttribute('role', 'button');
                        forumLink.setAttribute('aria-expanded', 'false');
                        forumLink.setAttribute('data-bs-toggle', 'dropdown');
                        forumLink.href = '#';

                        const dropdownMenu = document.createElement('ul');
                        dropdownMenu.className = 'dropdown-menu';
                        dropdownMenu.id = 'vw-forum-dropdown-menu';
                        dropdownMenu.setAttribute('aria-labelledby', 'forum-dropdown');
                        dropdownMenu.style.zIndex = '1070';
                        dropdownMenu.innerHTML = `
                            <li><a class="dropdown-item" href="https://forum.vimeworld.com" target="_blank">Главная форума</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="https://forum.vimeworld.com/topic/15-общее-положение-правил-сервера-и-форума" target="_blank">Правила</a></li>
                            <li><a class="dropdown-item" href="https://forum.vimeworld.com/topic/1321111-правила-мутов-и-банов-на-серверах-update-11092025" target="_blank">Наказания</a></li>
                            <li><a class="dropdown-item" href="https://forum.vimeworld.com/topic/1336480-вопросы-помощники-в-освоении-нюансов-правил-vimeworlda-update-27102024" target="_blank">FAQ игроков</a></li>
                            <li><a class="dropdown-item" href="https://forum.vimeworld.com/topic/1323399-faq-часто-задаваемые-вопросы-update-15092025" target="_blank">FAQ модерский</a></li>
                        `;

                        forumLink.after(dropdownWrapper);
                        dropdownWrapper.appendChild(forumLink);
                        dropdownWrapper.appendChild(dropdownMenu);

                        forumLink.addEventListener('click', (event) => {
                            event.preventDefault();
                            event.stopPropagation();

                            const isShown = dropdownMenu.classList.contains('show');
                            dropdownMenu.classList.toggle('show');
                            forumLink.setAttribute('aria-expanded', !isShown ? 'true' : 'false');
                        });

                        window.addEventListener('click', (event) => {
                            if (dropdownMenu.classList.contains('show') && !dropdownWrapper.contains(event.target)) {
                                dropdownMenu.classList.remove('show');
                                forumLink.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }

                    // 2. Dictionary link ("Словарь")
                    if (!document.getElementById('vw-dictionary-nav-link')) {
                        const dictionaryLink = document.createElement('a');
                        dictionaryLink.id = 'vw-dictionary-nav-link';
                        dictionaryLink.href = "https://docs.google.com/spreadsheets/d/1nbhO0hBGmN9WvAoc-pUEDsCTtTPxG8TNj1EM5uRAKPY/edit?gid=0#gid=0";
                        dictionaryLink.className = 'nav-link';
                        dictionaryLink.textContent = 'Словарь';
                        dictionaryLink.setAttribute('data-rr-ui-event-key', dictionaryLink.href);
                        dictionaryLink.target = '_blank';

                        navContainer.appendChild(dictionaryLink);
                    }
                } catch (e) {
                    console.error('[Universal VW Tool] Error setting up modern CP navbar:', e);
                }
            }

            setInterval(setupModernCpNavbar, 300);
            setupModernCpNavbar();
            document.addEventListener('DOMContentLoaded', setupModernCpNavbar);
            window.addEventListener('popstate', setupModernCpNavbar);
        }
        
    }

})();
