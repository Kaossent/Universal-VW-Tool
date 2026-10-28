chrome.storage.sync.get("isEnabled2", (data) => {
    const currentUrl = window.location.href;

    if (data.isEnabled2 && !currentUrl.includes("forum.vimeworld.com")) {

        document.body.style.setProperty("background-color", "#121212", "important");

        const darkThemeStyle = document.createElement('style');
        darkThemeStyle.textContent = `
            .navbar.navbar-default .nav.navbar-nav > li > a,
            .navbar-default .navbar-nav > .dropdown > a .caret {
                color: #dee2e6 !important;
                border-top-color: #dee2e6 !important; 
                border-bottom-color: #dee2e6 !important;
            }
            .navbar.navbar-default .navbar-toggle .icon-bar {
                background-color: #dee2e6 !important;
            }

            .navbar.navbar-default .navbar-brand {
                color: #ffffff !important;
            }

            .navbar.navbar-default .nav.navbar-nav > li > a:hover,
            .navbar-default .navbar-nav > .dropdown > a:hover .caret {
                color: #484e51ff !important;
                border-top-color: #484e51ff !important;
                border-bottom-color: #484e51ff !important;
            }

            .navbar.navbar-default .nav.navbar-nav > li.active > a,
            .navbar.navbar-default .nav.navbar-nav > li.active > a:hover {
                color: #ffffff !important; 
            }
            
            .navbar.navbar-default.navbar-static-top {
                background-color: #1e1e1e !important;
                border-bottom: 1px solid #333 !important;
            }

            .navbar.navbar-default .nav.navbar-nav > li:not(.active) > a:hover {
                background-color: transparent !important;
            }

            .navbar.navbar-default .nav.navbar-nav > .open > a,
            .navbar.navbar-default .nav.navbar-nav > .open > a:hover,
            .navbar.navbar-default .nav.navbar-nav > .open > a:focus {
                background-color: #333333 !important;
            }
            
            .dropdown-menu {
                background-color: #333333 !important;
                border: 1px solid #333 !important;
            }
            .dropdown-menu > li > a {
                color: #ffffffa6 !important;
            }
            .dropdown-menu > li > a:hover {
                background-color: #333 !important; 
                color: #ffffff !important;
            }
            .dropdown-menu .divider {
                background-color: #333 !important;
            }

            .navbar.navbar-default .navbar-toggle {
                border-color: rgba(255,255,255,.1) !important;
            }

            .navbar-brand {
                 color: #ffffff !important;
            }

            a.nav-link {
                color: #dee2e6;
            }

            a.nav-link.active {
                color: #ffffff !important;
            }
            
            a.nav-link:hover {
                color: #ffffff;
            }
        `;
        document.head.appendChild(darkThemeStyle);
    }
    else if (!data.isEnabled2 && !currentUrl.includes("forum.vimeworld.com")) {

        if (currentUrl.includes("legacy-cp.vimeworld.com/moder/reports") || currentUrl.includes("legacy-cp.vimeworld.com/moder/usernames")) {
            const lightThemeProfileStyle = document.createElement('style');
            lightThemeProfileStyle.textContent = `
                #top_servers_btn, 
                #top_servers_btn .caret {
                    color: #777 !important;
                    border-top-color: #777 !important;
                    border-bottom-color: #777 !important;
                }
            `;
            document.head.appendChild(lightThemeProfileStyle);
        }
    }

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

                .navbar-nav a.nav-link {
                     font-family: Arial, Helvetica, sans-serif !important;
                     font-size: 13px !important;
                }

                a.nav-link.active {
                    border-radius: 10px !important;
                    background-color: #2196f3 !important;
                    color: #ffffff !important;
                    font-weight: bold !important;
                }

                .navbar-nav .dropdown-menu .dropdown-item {
                     font-family: Arial, Helvetica, sans-serif !important;
                     font-size: 13px !important;
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

            const modifyNavInterval = setInterval(() => {
                const navContainer = document.querySelector(".flex-grow-1.navbar-nav");
                if (navContainer) {

                    const forumLink = navContainer.querySelector('a.nav-link[href="https://forum.vimeworld.com"]');

                    if (forumLink && !forumLink.classList.contains('dropdown-toggle')) {
                        clearInterval(modifyNavInterval);

                        const dropdownWrapper = document.createElement('div');
                        dropdownWrapper.className = 'nav-item dropdown';

                        forumLink.classList.add('dropdown-toggle');
                        forumLink.id = 'forum-dropdown';
                        forumLink.setAttribute('role', 'button');
                        forumLink.setAttribute('aria-expanded', 'false');
                        forumLink.href = '#';

                        const dropdownMenu = document.createElement('ul');
                        dropdownMenu.className = 'dropdown-menu';
                        dropdownMenu.setAttribute('aria-labelledby', 'forum-dropdown');
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

                            const menu = dropdownWrapper.querySelector('.dropdown-menu');
                            menu.classList.toggle('show');
                            const isExpanded = menu.classList.contains('show');
                            forumLink.setAttribute('aria-expanded', isExpanded);
                        });

                        window.addEventListener('click', (event) => {
                            if (dropdownMenu.classList.contains('show') && !dropdownWrapper.contains(event.target)) {
                                dropdownMenu.classList.remove('show');
                                forumLink.setAttribute('aria-expanded', 'false');
                            }
                        });

                        dropdownWrapper.style.position = 'relative';
                        dropdownWrapper.style.zIndex = '1060';
                        dropdownMenu.style.zIndex = '1070';

                        const dictionaryLink = document.createElement('a');
                        dictionaryLink.href = "https://docs.google.com/spreadsheets/d/1nbhO0hBGmN9WvAoc-pUEDsCTtTPxG8TNj1EM5uRAKPY/edit?gid=0#gid=0";
                        dictionaryLink.className = 'nav-link';
                        dictionaryLink.textContent = 'Словарь';
                        dictionaryLink.setAttribute('data-rr-ui-event-key', dictionaryLink.href);
                        dictionaryLink.target = '_blank';

                        navContainer.appendChild(dictionaryLink);
                    }
                }
            }, 200);

            setTimeout(() => clearInterval(modifyNavInterval), 10000);
            
        }
        
    }
});
