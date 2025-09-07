// Объект замен для эмодзи
const emojiReplacements = {
    // Дефолтные
    "优": "\uD83D\uDE0E",
    "伙": "\u263A",
    "会": "\uD83D\uDE01",
    "伛": "\uD83D\uDE0A",
    "伜": "\uD83D\uDE1F",
    "伝": "\uD83D\uDE04",
    "伞": "\uD83D\uDE0D",
    "伟": "\uD83D\uDE33",
    "传": "\uD83D\uDE1C",
    "伡": "\uD83D\uDE2D",
    "伣": "\uD83E\uDD2C",
    "伤": "\uD83D\uDE10",
    "伥": "\uD83D\uDE09",
    "伽": "\uD83D\uDE1E",
    "伨": "\uD83D\uDE08",
    "伩": "\uD83E\uDD21",
    "伪": "\uD83D\uDC80",
    "伫": "\uD83D\uDE21",
    "伬": "\uD83E\uDD28",
    "伭": "\uD83D\uDE14",
    "伦": "\uD83D\uDC4D",
    "伻": "\uD83D\uDC4E",
    "似": "\uD83D\uDC4C",
    "伺": "\uD83E\uDDA1",
    "佁": "\uD83D\uDC9B",
    "佂": "\uD83D\uDC9C",
    "佃": "\uD83D\uDC99",
    "佄": "\uD83D\uDC9D",
    "佅": "\uD83D\uDC9A",
    "但": "\uD83D\uDC9A",
    
    //Подарки
    "俀": "\uD83C\uDF81",
    "俁": "\uD83C\uDF81",
    "係": "\uD83C\uDF81",
    "促": "\uD83C\uDF81",
    "俄": "\uD83C\uDF81",

    // Снеговики (статичный, грустный, веселый, таит)
    "俅": "\u2603\u200D", // снеговик
    "俆": "\uD83D\uDE22", // грустный снеговик
    "俇": "\uD83D\uDE01", // веселый снеговик
    "俈": "\uD83E\uDD2F", // снеговик с хитрой улыбкой

    // Подарок, медведь, снегурочка, Гринч
    "俉": "\uD83C\uDF81", // подарок
    "俊": "\uD83D\uDC3B", // медведь
    "俋": "\uD83E\uDD36", // снегурочка
    "俌": "\uD83E\uDD77", // Гринч

    // Мороженое (разные виды)
    "俍": "\uD83C\uDF66", // рожок
    "俎": "\uD83C\uDF68", // эскимо
    "俏": "\uD83C\uDF67", // щербет
    "俐": "\uD83C\uDF69", // мягкое мороженое

    // Олени (обычный, плачущий, умиленный, удивленный)
    "侲": "\uD83E\uDD8C", // олень
    "侳": "\uD83E\uDD8C\u200D\uD83D\uDE22", // плачущий олень
    "侴": "\uD83E\uDD8C\u200D\uD83D\uDE0D", // умиленный олень
    "侵": "\uD83E\uDD8C\u200D\uD83D\uDE32", // удивленный олень

    // Пингвины (влюблен, плачущий, радостный, хмурый)
    "侶": "\uD83D\uDC27\u200D\uD83D\uDE0D", // влюбленный пингвин
    "侷": "\uD83D\uDC27\u200D\uD83D\uDE22", // плачущий пингвин
    "侸": "\uD83D\uDC27\u200D\uD83D\uDE01", // радостный пингвин
    "侹": "\uD83D\uDC27\u200D\uD83D\uDE23", // хмурый пингвин

    // Лёд (нерадостный, перевернутый, в шоке, грустный, прищуренный, смотрит косо)
    "侺": "\uD83E\uDD76", // нерадостный
    "侻": "\uD83E\uDD74", // перевернутый
    "侼": "\uD83E\uDD2F", // в шоке
    "侽": "\uD83D\uDE14", // грустный
    "侾": "\uD83D\uDE11", // прищуренный
    "便": "\uD83D\uDE44", // смотрит косо

    // Дискошар (удивленный, нерадостный, крутой, влюбленный)
    "俑": "\uD83C\uDFA2\u200D\uD83D\uDE32", // удивленный
    "俒": "\uD83C\uDFA2\u200D\uD83D\uDE14", // нерадостный
    "俓": "\uD83C\uDFA2\u200D\uD83D\uDE0E", // крутой
    "俔": "\uD83C\uDFA2\u200D\uD83D\uDE0D", // влюбленный

    // Блины
    "俕": "\uD83E\uDD5E", // блин
    "俖": "\uD83C\uDF5E", // хлеб (блинчик)
    "俗": "\uD83C\uDF72", // горшок (блины)
    "俘": "\uD83C\uDF73", // яичница (блинчики)

    // Попугай, кошка, собака, рыбка
    "俙": "\uD83E\uDD9C", // попугай
    "俚": "\uD83D\uDC31", // кошка
    "俛": "\uD83D\uDC36", // собака
    "俜": "\uD83D\uDC1F", // рыбка

    // Пластинка, нота, звуковой ключ
    "保": "\uD83C\uDFB6", // пластинка
    "俞": "\uD83C\uDFB5", // нота
    "俟": "\uD83C\uDFB9", // звуковой ключ
    "俠": "\uD83C\uDFBA", // труба

    // Синтезатор, джойпад, микрофон, наушники
    "信": "\uD83C\uDFB4", // синтезатор
    "俢": "\uD83C\uDFAE", // джойпад
    "俣": "\uD83C\uDFA4", // микрофон
    "俤": "\uD83C\uDFA7", // наушники

    // Очки, звезда, танцующий, дрампад
    "俥": "\uD83D\uDC53", // очки
    "俦": "\u2B50", // звезда
    "俧": "\uD83D\uDD7A", // танцующий
    "俨": "\uD83C\uDFB8", // дрампад

    // Кассеты
    "俩": "\uD83C\uDFA7", // кассета (вариант)
    "俪": "\uD83C\uDFB2", // кассета (вариант)
    "俫": "\uD83C\uDFB3", // кассета (вариант)
    "俬": "\uD83C\uDFB7", // кассета (вариант)

    // Круг, треугольник, квадрат, черная маска
    "偤": "\u2B55", // круг
    "健": "\u25B6", // треугольник
    "偦": "\u25FC", // квадрат
    "偧": "\uD83D\uDE37", // черная маска

    // Плачущий, в шоке, умиленный, прозрачный
    "偋": "\uD83D\uDE22", // плачущий
    "偌": "\uD83D\uDE31", // в шоке
    "偍": "\uD83D\uDE0D", // умиленный
    "偎": "\uD83E\uDD76", // прозрачный (лед)

    // Луна с лицом, солнце с лицом, солнце, месяц
    "偏": "\uD83C\uDF19", // луна с лицом
    "偐": "\uD83C\uDF1E", // солнце с лицом
    "偑": "\u2600", // солнце
    "偒": "\uD83C\uDF13", // месяц

    // Дождь, гроза, волна, огонь
    "偓": "\uD83C\uDF27", // дождь
    "偔": "\u26C8", // гроза
    "偕": "\uD83C\uDF0A", // волна
    "偖": "\uD83D\uDD25", // огонь

    // Комета, ночное небо, звезда на фоне, звезды
    "偗": "\u2604", // комета
    "偘": "\uD83C\uDF03", // ночное небо
    "偙": "\uD83C\uDF1F", // звезда на фоне
    "做": "\u2728", // звезды

    // Золото, TNT, сундук, земля, AFK
    "偛": "\uD83D\uDCB0", // золото
    "停": "\uD83D\uDCA3", // TNT
    "偝": "\uD83E\uDDF1", // сундук
    "偞": "\uD83C\uDF0D", // земля
    "偟": "\uD83D\uDE34", // AFK

    // Ухмыленный, влюбленный, веселый, удивленный
    "倳": "\uD83D\uDE0F", // ухмыленный
    "倴": "\uD83D\uDE0D", // влюбленный
    "倵": "\uD83D\uDE01", // веселый
    "倶": "\uD83D\uDE32", // удивленный

    // Разные сладости
    "倷": "\uD83C\uDF6B", // шоколад
    "倸": "\uD83C\uDF6C", // леденец
    "倹": "\uD83C\uDF6D", // мармелад
    "债": "\uD83C\uDF6E", // мороженое

    // Фуга (мертвая, влюбленная, шокирована, плачущая)
    "傀": "\uD83D\uDC80", // мертвая
    "傁": "\uD83D\uDE0D", // влюбленная
    "偾": "\uD83D\uDE31", // шокирована
    "偿": "\uD83D\uDE22", // плачущая

    // Шок, недовольный, ухмылка, крутой
    "傂": "\uD83D\uDE31", // шок
    "傃": "\uD83D\uDE20", // недовольный
    "傄": "\uD83D\uDE0F", // ухмылка
    "傅": "\uD83D\uDE0E", // крутой

    // Яблоко, торт, печенье, зелье
    "偲": "\uD83C\uDF4E", // яблоко
    "偳": "\uD83C\uDF70", // торт
    "側": "\uD83C\uDF6A", // печенье
    "偵": "\uD83E\uDDEA", // зелье

    // Алмаз, изумруд, золото, звезда (одна)
    "偶": "\uD83D\uDC8E", // алмаз
    "偷": "\uD83D\uDC8D", // изумруд
    "偸": "\uD83D\uDCB0", // золото
    "偹": "\u2B50", // звезда

    // Плачущий, мертвый, влюбленный, обычный
    "偺": "\uD83D\uDE22", // плачущий
    "偻": "\uD83D\uDC80", // мертвый
    "偼": "\uD83D\uDE0D", // влюбленный
    "偽": "\uD83D\uDE10",  // обычный

    "傇": "\ud83d\udc30", // Кролик
    "傇": "\ud83d\udc30", // Кролик плачет
    "傉": "\ud83d\udc30", // Кролик влюбленный
    "傊": "\ud83d\udc30", // Кролик плачет

    "傐": "\ud83c\udf44", // гриб
    "傑": "\ud83c\udf44", // грибы
    "傒": "\ud83c\udf44", // мухомор
    "傓": "\ud83c\udf44", // белый гриб

    "傔": "\ud83e\uddf4", // розовое зелье
    "傕": "\ud83e\uddf4", // зеленое зелье
    "傖": "\ud83e\uddf4", // зелье в форме сердца
    "傗": "\ud83e\uddf4", // зелье в форме триугольника

    "傢": "\u26a0\ufe0f", // предупреждение 
    "傡": "\u26d4", // нет выхода
    "傠": "\ud83d\udeab", // запрещенно

    "傜": "\ud83d\udc80", // красный скелет
    "傝": "\ud83d\udc80", // скелет плачет
    "傞": "\ud83d\udc80", // скелет
    "傟": "\ud83d\udc80", // скелет влюбленный

    "傘": "\ud83d\udd25", // Огонь синий
    "備": "\ud83d\udd25", // Огонь зеленый
    "傚": "\ud83d\udd25", // Огонь розовый
    "傛": "\ud83d\udd25", // Огонь фиолетовый

    "傣": "\ud83e\udd2e", // Рвота на лице
    "傤": "\ud83e\udd2e", // Рвота радугой на лице
    "傥": "\ud83e\udd2e", // Рвота серая на лице

    "储": "\ud83d\ude0e", // Улыбающееся лицо в солнцезащитных очках
    "傩": "\ud83e\udd20", // Смайл со шляпой
    "傪": "\ud83e\udd20", // Улыбающийся смайл со шляпой
    "傫": "\ud83e\udd2e", // Смайл со шляпой и рвотой

    "傶": "\ud83d\udc8e", // Diamond
    "債": "\u2666\ufe0f", // Gem red
    "傮": "\u2666\ufe0f", // Gem green
    "傭": "\u2666\ufe0f", // Gem yellow

    "催": "\u2620\ufe0f", // skull and crossboness dark
    "傯": "\ud83d\uddfa\ufe0f", // map
    "傷": "\u2620\ufe0f", // skull and crossboness white
    "傱": "\ud83d\ude33", // Flushed face
    "傲": "\ud83d\ude0e", // Smiling face with sunglass
    "傳": "\ud83d\ude01", // Beaming face with smiling 
    "傴": "\ud83e\udd2e", // Рвота на лице
    "僀": "\ud83d\udc41\ufe0f", // eye
    "僁": "\ud83d\ude2d", // Loudly crying face
    "僂": "\ud83d\udc98", // Сердце на цепях
    "僃": "\ud83d\udc98", // Серое сердце на цепях  
    "僄": "\ud83d\udcdc", // Свиток
    "僅": "\ud83d\udc7b", // Призрак
    // Kydze
    "僇": "\ud83d\udc41\ufe0f\u200d\ud83d\udde8\ufe0f", // Страшный глаз
    "僈": "\ud83d\udc26\u200d\u2b1b", // Ворона
    "僉": "\ud83d\udd2a", // Нож
    "僊": "\ud83e\udea6", // Могила
    "僋": "\ud83c\udf19", // Кровавая луна
    "僌": "\ud83d\udd4a\ufe0f", // Птица
    "働": "\ud83d\udc51", // Нимб
    "僎": "\ud83d\udd2e", // Что-то фиолетовое
    "像": "\ud83d\udd90\ufe0f", // Красная рука
    "僜": "\ud83d\ude04", // Улыбающийся анимешник
    "僝": "\ud83e\udd28", // Анимешник с приподнятой бровью
    "僞": "\ud83d\ude3c", // Синий кот
    "僟": "\ud83d\ude11", // Анимешник с закрытыми глазами
    "僔": "\ud83d\udd2e", // Магический шар
    "僕": "\ud83d\udc51", // Корона
    "僖": "\u2620\ufe0f", // Череп с костями
    "僗": "\ud83d\udc52", // Соломенная шляпа
    "僘": "\ud83d\udc69", // Анимешная женщина без глаз
    "僙": "\ud83d\udd2a", // Кровавый нож
    "僛": "\ud83d\udc41\ufe0f", //  Анимешный кровавый глаз
    "僠": "\ud83d\ude2e", // Анимешник кричит
    "僡": "\ud83d\ude0a", // Анимешник
    "僢": "\ud83d\ude23", // Анимешник с открытым ртом и закрытыми глазами
    "僣": "\ud83d\ude38", // Радостный кот
    "儳": "\ud83d\udc7e", // Пришелец
    "儴": "\ud83d\udc7d", // Пришелец приплюснутый
    "儵": "\ud83d\udfe1", // Желтый круг
    "儶": "\ud83d\udfe0", // Оранжевый круг
    "儷": "\ud83d\udfe0", // Оранжевый круг с белыми полосками
    "儸": "\ud83c\udf0f", // Планета земля
    "儹": "\ud83e\ude90", // Марс
    "儺": "\ud83d\udef8", // НЛО
    "儻": "\ud83d\udd73\ufe0f", // Черная дыра
    "儼": "\ud83e\ude90", // Сатурн
    "儽": "\ud83d\ude80", // Ракета
    "儾": "\ud83c\udf11", // Полнолуние 
    "儿": "\ud83d\udef8", // Планета земля 2
    "兀": "\ud83e\udde8", // Петарда
    "儯": "\ud83d\udc7e", // Пришелец 2
    "儰": "\ud83d\udc7e", // Пришелец 3
    "儱": "\ud83d\udc7e", // Пришелец 4
    "儲": "\ud83d\udc7e", // Пришелец 5
    "僆": "\ud83d\udc1a", // Ракушка
};

    let lastValue = '';

const copyrightElement = document.querySelector(".pull-right.copyright");

if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.innerHTML = `© 2012 - ${currentYear} - <a href="https://vimeworld.com" target="_blank">VimeWorld.com</a>. Made by 
        <a href="https://vimetop.ru/player/Kaossent" target="_blank">Kaossent</a>, 
        <a href="https://vimetop.ru/player/Rander_" target="_blank">Rander_</a> &
        <a href="https://t.me/tournaments_vimeworld" target="_blank">Events VimeWorld</a>`;
}


const link = document.querySelector('a[href="https://www.invisioncommunity.com/"]');
    
if (link) {
    link.textContent = 'Made by Kaossent';
    link.href = 'https://vimetop.ru/player/Kaossent';
}

const currentUrl = window.location.href;

if (!currentUrl.includes("forum.vimeworld.com") && !currentUrl.includes("cp.vimeworld.com") && !currentUrl.includes("vimetop.ru")) {
    const style = document.createElement('style');
    style.textContent = 
    `
    .pagination li:first-child a {
        border-top-left-radius: 10px !important;
        border-bottom-left-radius: 10px !important;
    }

    .pagination li:last-child a {
        border-bottom-right-radius: 10px !important;
        border-top-right-radius: 10px !important;
    }
    
            /* Initial state of the panel (hidden and slightly translated) */
    .panel {
        border-radius: 10px !important;
        margin-top: 25px;
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .container-fluid {
        display: flex;
        justify-content: center; /* Центровка по горизонтали */
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
        justify-content: center; /* Центрирует navbar по горизонтали */
    }

    #top_servers_btn {
        background: #64c3e2 !important;
        border-radius: 5px !important;
    }

    button {
        color: white !important; /* белый цвет текста */
        border: none !important; /* убираем границу */
        padding: 6px 13.5px !important; /* внутренние отступы */
        border-radius: 5px !important; /* скругленные углы */
        cursor: pointer !important; /* курсор руки при наведении */
    }

    button:hover {
        transform: scale(1.1); /* увеличение до 105% при наведении */
    }

    select.form-control {
        background-color: #12c3d3; /* красный цвет по умолчанию */
        text-align: center !important;
        font-weight: bold;
        color: white; /* белый цвет текста */
        border: none; /* убрать границу */
        padding: 5px; /* внутренние отступы */
        border-radius: 5px; /* скругленные углы */
        cursor: pointer; /* курсор руки при наведении */
    }

    select.form-control:hover {
        background-color: #0e8b96; /* более темный красный при наведении */
    }

    select.form-control:focus {
        outline: none; /* убрать стандартное выделение */
        background-color: #0e8b96; /* более темный красный при фокусе */
    }

    .btn-warning {
        background-color: rgb(179, 0, 0) !important; /* Или любой другой цвет */
        color: white !important; /* Или любой другой цвет */
    }


    `
    
    document.head.appendChild(style);
}   

const style = document.createElement('style');
if (currentUrl.includes("legacy-cp.vimeworld.com")) {
    style.textContent = 
    `
    a.navbar-brand {
        color: #444444 !important;
    }

    .navbar {
        color: #FFFFFF !important;
    }
    `
}
document.head.appendChild(style);

window.addEventListener("load", () => {
    chrome.storage.sync.get("isEnabled", async (data) => {
        if (data.isEnabled) {
            // Загружаем список фонов из background.txt
            try {
                const response = await fetch(chrome.runtime.getURL("background.txt"));
                const text = await response.text();
                const images = text.split(/\r?\n/).filter(Boolean);

                const randomImage = images[Math.floor(Math.random() * images.length)];
                const currentUrl = window.location.href;

                if (currentUrl.includes("vimetop.ru")) {
                    document.querySelector('.hk-pg-wrapper')?.style.setProperty("background", "none", "important");
                    document.querySelector('.hk-wrapper')?.style.setProperty("background", "none", "important");
                    document.body.style.setProperty("background-color", "none", "important");
                    document.body.style.setProperty("background", "none", "important");
                }

                document.body.style.setProperty("background-image", `url('${randomImage}')`, "important");
                document.body.style.setProperty("background-size", "cover", "important");
                document.body.style.setProperty("background-repeat", "no-repeat", "important");
                document.body.style.setProperty("background-position", "center center", "important");
                document.body.style.setProperty("background-attachment", "fixed", "important");
                document.body.style.setProperty("background-color", "#000000", "important");
                document.body.style.setProperty("opacity", "0", "important");

                setTimeout(() => {
                    document.body.style.transition = "opacity 0s ease";
                    document.body.style.opacity = "1"; 
                }, 100);
            } catch (error) {
                console.error("Не удалось загрузить background.txt:", error);
            }
        } else {
            const currentUrl = window.location.href;
            if (!currentUrl.includes("forum.vimeworld.com") && !currentUrl.includes("cp.vimeworld.com")) {
                document.body.style.setProperty("background", `none`, "important");
                document.body.style.setProperty("background-color", "#f5f4f8", 'important');
            }
        }
});


chrome.storage.sync.get("isEnabled2", (data) => {
    if (data.isEnabled2) {
        const currentUrl = window.location.href;
        if (!currentUrl.includes("forum.vimeworld.com")) {
            document.body.style.setProperty("background-color", "#121212", "important")

            const headers = document.querySelectorAll('.info th');

            headers.forEach((header, index) => {
                header.style.backgroundColor = '#333333';
                header.style.color = '#b3b9c4';
                header.style.fontWeight = 'bold'; 
                header.style.borderColor = '#303030';
            });

            const style = document.createElement('style');
            style.textContent = `
            .panel {
                border-radius: 10px !important;
                margin-top: 25px;
                transition: opacity 0.5s ease, transform 0.5s ease;
                background-color: #212529 !important;
                border-color: #303030 !important;
            }
            
            .pagination a {
                background-color: #3E3D3D !important;
                border-color: #3b3939 !important;
            }
            
            .btn:hover {
                box-shadow: 0px 1px 10px 2px rgba(104, 103, 101, 0.356) !important;
                box-shadow: inset 0px -4px 15px 1px rgba(59, 59, 58, 0.411)!important;
            }

            .pagination li:first-child a,
            .pagination li:nth-child(2) a,
            .pagination li:last-child a,
            .pagination li:nth-last-child(2) a {
                background-image: linear-gradient(to bottom,#3E3D3D 0,#3E3D3D 100%) !important;
                border-color: #3b3939 !important;
            }
            .pagination li:first-child a {
                border-top-left-radius: 10px !important;
                border-bottom-left-radius: 10px !important;
            }
            
            .pagination li:last-child a {
                border-bottom-right-radius: 10px !important;
                border-top-right-radius: 10px !important;
            }

            a.navbar-brand {
                color: white !important;
            }

            .panel-heading {
                border-bottom: #303030 !important;
            }
            .panel-heading h2 {
                color: #727d82 !important;
            }

            .panel-body {
                color: #727d82 !important
                background-color: #212529 !important;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3);
                font-weight: bold;
            }

            .panel-body a {
                color: white !important;
            }

            .panel-footer {
                background-color: #212529 !important;
                border-top: #303030 !important;
            }
            
            .navbar {
                display: flex;
                align-content: center;
                border-radius: 10px !important;
                margin: 0 auto;
                background-color: #212529 !important;
                border-color: #313131 !important;
                border-radius: 10px !important;
            }

            .container-fluid {
                background-color: #212529 !important;
            }
            select.form-control:hover {
                background-color: #0e8b96; /* более темный красный при наведении */
            }

            select.form-control:focus {
                outline: none; /* убрать стандартное выделение */
                background-color: #0e8b96; /* более темный красный при фокусе */
            }

            input.form-control {
                border-radius: 5px;
                background-color: rgb(62, 61, 61);
                color: #b3b9c4;
            }  

            .modal-header {
                background-color: #212529 !important; /* Устанавливаем черный фон */
                border-bottom: 1px solid #303030 !important;
                color: white !important; /* Устанавливаем белый цвет текста для контраста */
            }

            .modal-body {
                background-color: #212529 !important; /* Устанавливаем черный фон */
                color: white !important; /* Устанавливаем белый цвет текста для контраста */
                border-bottom: 1px solid #303030 !important;
            }

            .modal-footer {
                border-top: 1px solid #303030 !important;       
                margin-top: 0px !important;                                                                    
                background-color: #212529 !important; /* Устанавливаем черный фон */
                color: white !important; /* Устанавливаем белый цвет текста для контраста */
            }       
            
            td {
                color: rgb(222, 226, 230);
            }

            .table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th {
                background-color: #3E3D3D !important;
            }

            .table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr.warning:hover>th {
                background-color: #baa7f7 !important;
            }
            h5, h4 {
                color: rgb(179, 185, 196) !important;
            }

            /* Класс success1 для изменения цвета */
            .btn.btn-success1 {
                padding: 5px !important; /* Добавляем немного отступов */
                border-radius: 4px; /* Закругление краев */
                background-color: rgb(224, 185, 112) !important;
                margin-left: 5px !important;
                color: white !important;
            }

            .btn.btn-primary1 {
                padding: 5px !important; /* Добавляем немного отступов */
                border-radius: 4px; /* Закругление краев */
                background-color: rgb(129, 112, 224) !important;
                margin-left: 5px !important;
                color: white !important;
            }

            .btn.btn-info1 {
                padding: 5px !important; /* Добавляем немного отступов */
                border-radius: 4px; /* Закругление краев */
                background-color: rgb(149, 194, 184) !important;
                margin-left: 5px !important;
                color: white !important;
            }

            /* Эффект при наведении */
            .success1:hover {
                background-color: #39385c; /* Более светлый фон при наведении */
                transition: color 0.3s ease, background-color 0.3s ease; /* Плавный переход */
            }

            #top_servers_btn {
                background: #64c3e2 !important;
                border-radius: 5px !important;
            }

            .btn-info {
                color: #b3b9c4;
            }

            button:hover {
                transform: scale(1.1); /* увеличение до 105% при наведении */
            }
            select.form-control {
                background-color: #12c3d3; /* красный цвет по умолчанию */
                text-align: center !important;
                font-weight: bold;
                color: white; /* белый цвет текста */
                border: none; /* убрать границу */
                padding: 5px; /* внутренние отступы */
                border-radius: 5px; /* скругленные углы */
                cursor: pointer; /* курсор руки при наведении */
            }
            
            .form-control, .form-control[disabled] {
                background-color: rgb(51,51,51,1) !important;
                border-color: rgb(51,51,51,0,7) !important;
                border: none !important
            }
            input.form-control {
                border-radius: 5px;
            }   
            .table>thead>tr>th, .table>tbody>tr>th, .table>tfoot>tr>th, .table>thead>tr>td, .table>tbody>tr>td, .table>tfoot>tr>td {
                border-top: 2px #2e343b !important;
            }

            .info th {
                border: 0px !important;
                border-color: none;
            }

            .info th:first-child {
                border-top-left-radius: 10px;
            }

            .info th:last-child {
                border-top-right-radius: 10px;
            }

            .btn.btn-warning {
                background-image: linear-gradient(to bottom, #ad1010, rgb(179, 0, 0) 100%) !important; /* Или любой другой цвет */
            }

            .btn.btn-default {
                background: linear-gradient(to bottom,#3a294a 0,#3a294a 100%)
            }

            .btn.btn-default:hover {
                background: linear-gradient(to bottom,#3a294a 0,#3a294a 80%)
            }

            .modal-header {
                border-top-left-radius: 10px !important;
                border-top-right-radius: 10px !important;
            }

            .modal-content {
                border-top-left-radius: 11px !important;
                border-top-right-radius: 11px !important;
                border-bottom-right-radius: 13px !important;
                border-bottom-left-radius: 13px !important;
                border: 0px !important;
            }

            .modal-footer {
                border-bottom-left-radius: 10px !important;
                border-bottom-right-radius: 10px !important;
            }
            
            .close {
                text-shadow: 0 1px 0 white !important;
                color: gray !important;
            }

            .btn-success {
                border-radius: 5px !important;
            }

            .btn-info {
                border-radius: 5px !important;
                color: white !important;
            }

            .btn-warning {
                border: 0px !important;
                border-radius: 5px !important;
            }

            .btn-default {
                border: 0px !important;
                color: white !important;
                text-shadow: none !important;
                border-radius: 5px !important;
            }

            .btn.btn-default {
                background: gray !important;
            }
            `;

            document.head.appendChild(style);
        }
    }
});
});

    document.getElementById('mr_itime').addEventListener('blur', function() {
        const currentValue = this.value;
        if (currentValue !== lastValue) {
            const sum = calculateSum(currentValue);
            this.value = sum;
            lastValue = sum; 
        }
    });

    function calculateSum(input) {
        const numbers = input.split('+').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
        return numbers.reduce((acc, num) => acc + num, 0); 
    }

function convertText() {
    const elements = document.querySelectorAll('#mr_messages');
    elements.forEach(element => {
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                let newText = node.textContent;

                newText = newText.replace(/&x([0-9A-Fa-f]{6})\s*([^\s&]+)/g, (match, hex, word) => {
                    return `<span style="color: #${hex};">${word}</span>`;
                });

                newText = newText.replace(/&x[0-9A-Fa-f]{6}/g, '');

                for (const [key, value] of Object.entries(emojiReplacements)) {
                    newText = newText.replace(new RegExp(key, 'g'), value);
                }

                newText = newText.replace(/\s+/g, ' ').trim();

                if (newText !== node.textContent) {
                    const newNode = document.createElement('span');
                    newNode.innerHTML = newText;
                    element.replaceChild(newNode, node);
                }
            }
        });
    });
}

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

	const inputContainer = document.createElement('div');
    inputContainer.style.marginTop = '10px';
    inputContainer.style.display = 'flex';
    inputContainer.style.alignItems = 'center';
    inputContainer.style.justifyContent = 'flex-start'; 

    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'textInput';
    inputField.style.width = '309px'; 
    inputField.style.display = 'inline';
    inputField.className = 'form-control'; 
    inputField.placeholder = 'Введите текст...';

    const countButton = document.createElement('button');
    countButton.id = 'countButton';
    countButton.textContent = 'Подсчитать [0]'; 
    countButton.className = 'btn btn-success1'; 
    countButton.style.marginLeft = '10px';  
    countButton.onclick = countCharacters;

    const convertButton = document.createElement('button');
    convertButton.textContent = 'Hex ⇄ Emoji'; 
    convertButton.className = 'btn btn-primary1'; 
    convertButton.style.marginLeft = '10px';
    convertButton.onclick = convertText; 

    const replaceButton = document.createElement('button');
    replaceButton.textContent = 'Eng ⇄ Rus'; 
    replaceButton.className = 'btn btn-info1'; 
    replaceButton.style.marginLeft = '10px';
    replaceButton.onclick = replaceEngRus; 

    inputContainer.appendChild(inputField);
    inputContainer.appendChild(countButton);
    inputContainer.appendChild(replaceButton); 
    inputContainer.appendChild(convertButton);

    const modalFooter = document.querySelector('.modal-footer');
    if (modalFooter) {
        modalFooter.appendChild(inputContainer);
    }
}

const userCache = {};
const userPromises = {};

function fetchUserData(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    console.warn("Пустое имя передано в fetchUserData, запрос отменён.");
    return Promise.resolve(null);
  }

  name = name.trim();

  if (userCache[name]) {
    return Promise.resolve(userCache[name]);
  }
  if (userPromises[name]) {
    return userPromises[name];
  }

  const promise = fetch(`https://api.vimeworld.ru/user/name/${name}?token=${API_TOKEN}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        userCache[name] = data[0];
        delete userPromises[name];
        return data[0];
      } else {
        delete userPromises[name];
        return null;
      }
    })
    .catch(error => {
      console.error(`Ошибка при запросе для ${name}:`, error);
      delete userPromises[name];
      throw error;
    });

  userPromises[name] = promise;
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
        console.log(`${element.textContent} Flat Default Color`);
        return;
    }

    if (gradientColors.length < 2) {
        element.style.color = gradientColors[0] || defaultColor;
        console.log(`${element.textContent} Flat Color`);
        return;
    }

    element.style.background = `linear-gradient(to right, ${gradientColors.join(", ")})`;
    element.style.webkitBackgroundClip = "text";
    element.style.backgroundClip = "text";
    element.style.webkitTextFillColor = "transparent";
    element.style.textFillColor = "transparent";

    console.log(`${element.textContent} Gradient Color`);
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

function renderName(td, name, rankInfo, custom = [], apiPrefix = null) {
  if (!td) return;
  if (td.dataset.processed) return;
  td.dataset.processed = "true";
  td.innerHTML = "";

  const prefixSpan = document.createElement("span");
  const prefixLabel = apiPrefix ? `[${apiPrefix}]` : rankInfo.label;
  prefixSpan.textContent = `${prefixLabel} `;
  prefixSpan.style.color = getFirstColor(rankInfo.defaultColor);

  const nickSpan = document.createElement("span");
  nickSpan.textContent = name;

  td.append(prefixSpan, nickSpan);
  applyGradient(nickSpan, custom, rankInfo.defaultColor);

}

function processRows(limit = 200) {
  chrome.storage.sync.get({ isEnabled3: true }, (data) => {
    if (!data.isEnabled3) return; 

    const rows = document.querySelectorAll('tr[id^="row_report"]');
    let done = 0;

    rows.forEach(row => {
      if (done >= limit) return;

      const [violatorTd, reporterTd] = [row.cells[2], row.cells[3]];

      if (violatorTd && !violatorTd.dataset.processed) {
        const match = violatorTd.textContent.match(/\]\s*([\p{L}\d_.]+)/u);
        if (match) {
          const name = match[1];
          done++;
          fetchUserData(name)
            .then(u => u && isValidRank(u.rank) && renderName(
              violatorTd,
              name,
              getRankInfoReporter(u.rank),
              u.customColors || [],
              u.prefix
            ))
            .catch(e => console.error("Violator fetch:", e));
        }
      }

      if (reporterTd && !reporterTd.dataset.processed) {
        const match = reporterTd.textContent.match(/\]?\s*([\p{L}\d_.]+)/u);
        if (match) {
          const name = match[1];
          done++;
          fetchUserData(name)
            .then(u => u && isValidRank(u.rank) && renderName(
              reporterTd,
              name,
              getRankInfoReporter(u.rank),
              u.customColors || [],
              u.prefix
            ))
            .catch(e => console.error("Reporter fetch:", e));
        }
      }
    });
  });
}


function modifyLoginLabel() {
  chrome.storage.sync.get("isEnabled3", (data) => {
    if (!data.isEnabled3) return;

    const nameEl = document.querySelector("span.pull-left b");
    if (!nameEl) return;

    const name = nameEl.textContent.trim();
    if (!name) return;

    fetchUserData(name)
      .then((user) => {
        if (user && isValidRank(user.rank)) {
          const rankInfo = getRankInfoReporter(user.rank);
          if (rankInfo) {
            const prefixSpan = document.createElement("span");
            prefixSpan.textContent = `${rankInfo.label}`;
            prefixSpan.style.color = formatColor(
              Array.isArray(rankInfo.defaultColor)
                ? rankInfo.defaultColor[0]
                : rankInfo.defaultColor
            );

            const nameSpan = document.createElement("span");
            nameSpan.textContent = ` ${name}`;
            applyGradient(nameSpan, user.customColors || [], rankInfo.defaultColor);

            nameEl.textContent = "";
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
    chrome.storage.sync.get("isEnabled2", (data) => {
        const currentUrl = window.location.href;
        if (!currentUrl.includes("forum.vimeworld.com")) {
            const table = document.getElementById('table');
            if (table) {
                table.classList.remove("table-hover");
            }

            // Удалим старые стили
            const oldStyle = document.getElementById("custom-row-style");
            if (oldStyle) oldStyle.remove();

            const style = document.createElement('style');
            style.id = "custom-row-style";

            const rows = document.querySelectorAll('tr[id^="row_report"]');

            if (data.isEnabled2) {
                // Тёмная тема
                document.body.style.setProperty("background-color", "#121212", "important");

                style.textContent = `
                    .custom_warning {
                        background-color: rgba(226, 223, 40, 0.25) !important;
                    }
                    .custom_success {
                        background-color: rgba(40, 226, 124, 0.25) !important;
                    }
                    .custom_danger {
                        background-color: rgba(255, 105, 105, 0.25) !important;
                    }
                `;

                document.head.appendChild(style);

                rows.forEach(row => {
                    if (row.classList.contains("warning")) {
                        row.classList.replace("warning", "custom_warning");
                    } else if (row.classList.contains("success")) {
                        row.classList.replace("success", "custom_success");
                    } else if (row.classList.contains("danger")) {
                        row.classList.replace("danger", "custom_danger");
                    }
                });

            } else {
                // Светлая тема
                document.body.style.setProperty("background-color", "#ffffff", "important");

                style.textContent = `
                    .warning, .warning td {
                        background-color: rgba(226, 223, 40, 0.25) !important;
                    }

                    .success, .success td {
                        background-color: rgba(40, 226, 124, 0.25) !important;
                    }

                    .danger, .danger td {
                        background-color: rgba(255, 105, 105, 0.25) !important;
                    }
                `;

                document.head.appendChild(style);

                rows.forEach(row => {
                    if (row.classList.contains("custom_warning")) {
                        row.classList.replace("custom_warning", "warning");
                    } else if (row.classList.contains("custom_success")) {
                        row.classList.replace("custom_success", "success");
                    } else if (row.classList.contains("custom_danger")) {
                        row.classList.replace("custom_danger", "danger");
                    }
                });
            }
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

async function styleViolatorAndReporter() {
  const data = await getStorageAsync({ isEnabled3: true });
  if (!data.isEnabled3) return;

  function extractUsername(rawText) {
    if (!rawText) return null;
    const cleaned = rawText.replace(/\[.*?\]/g, '').trim();
    const parts = cleaned.split(/\s+/);
    return parts.pop();
  }

  const violatorEl = document.getElementById("mr_violator");
  const reporterEl = document.getElementById("mr_reporter");
  const moderEl = document.getElementById("mr_alert_muted_moder");
  const deletedModerEl = document.getElementById("mr_alert_deleted_moder");
  const mutedBlock = document.getElementById("mr_alert_muted");
  const deletedBlock = document.getElementById("mr_alert_deleted");
  const durationEl = document.getElementById("mr_alert_muted_duration");

  const tasks = [];

  if (violatorEl) {
    tasks.push((async () => {
      const span = violatorEl.querySelector('span');
      const name = extractUsername(span ? span.textContent : violatorEl.textContent);
      if (!name) return;
      const user = await fetchUserData(name);
      if (user && isValidRank(user.rank)) {
        const rankInfo = getRankInfoReporter(user.rank);
        if (rankInfo) {
          violatorEl.textContent = `${user.prefix ? `[${user.prefix}]` : rankInfo.label} ${user.username}`;
          applyGradient(violatorEl, user.customColors || [], rankInfo.defaultColor);
        }
      }
    })());
  }

  if (reporterEl) {
    tasks.push((async () => {
      const name = reporterEl.textContent.trim();
      if (!name) return;
      const user = await fetchUserData(name);
      if (user && isValidRank(user.rank)) {
        const rankInfo = getRankInfoReporter(user.rank);
        if (rankInfo) {
          reporterEl.textContent = `${user.prefix ? `[${user.prefix}]` : rankInfo.label} ${user.username}`;
          applyGradient(reporterEl, user.customColors || [], rankInfo.defaultColor);
        }
      }
    })());
  }

  if (moderEl) {
    tasks.push((async () => {
      const name = extractUsername(moderEl.textContent.trim());
      if (!name) return;
      const user = await fetchUserData(name);
      if (user && isValidRank(user.rank)) {
        const rankInfo = getRankInfoReporter(user.rank);
        if (rankInfo) {
          moderEl.textContent = `${user.prefix ? `[${user.prefix}]` : rankInfo.label} ${user.username}`;
          applyGradient(moderEl, user.customColors || [], rankInfo.defaultColor);
        }
      }
    })());
  }

  if (deletedModerEl) {
    tasks.push((async () => {
      const name = extractUsername(deletedModerEl.textContent.trim());
      if (!name) return;
      const user = await fetchUserData(name);
      if (user && isValidRank(user.rank)) {
        const rankInfo = getRankInfoReporter(user.rank);
        if (rankInfo) {
          deletedModerEl.textContent = `${user.prefix ? `[${user.prefix}]` : rankInfo.label} ${user.username}`;
          applyGradient(deletedModerEl, user.customColors || [], rankInfo.defaultColor);
        }
      }
    })());
  }

  if (mutedBlock && moderEl) {
    const childNodes = Array.from(mutedBlock.childNodes);
    for (const node of childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("Модератор")) {
        node.textContent = node.textContent.replace("Модератор", "").trim();
      }
    }
  }

  if (deletedBlock && deletedModerEl) {
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

  if (durationEl) {
    const minutes = parseInt(durationEl.textContent.trim(), 10);
    if (!isNaN(minutes)) {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;

      let readable = [];
      if (days > 0) readable.push(`${days} дн.`);
      if (hours > 0) readable.push(`${hours} ч.`);
      if (mins > 0 || (days === 0 && hours === 0)) readable.push(`${mins} мин.`);

      durationEl.textContent = `(${readable.join(" ")}) ${minutes} `;
    }
  }

  await Promise.all(tasks);
}

function scheduleStyle() {
  if (styleTimeout) clearTimeout(styleTimeout);
  styleTimeout = setTimeout(() => {
    const violator = document.getElementById("mr_violator");
    const reporter = document.getElementById("mr_reporter");

    if (!(violator && reporter)) return;
    if (isStyling) return;

    modalObserver.disconnect();
    isStyling = true;

    styleViolatorAndReporter()
      .catch(err => console.error("styleViolatorAndReporter error:", err))
      .finally(() => {
        isStyling = false;
        setTimeout(() => {
          modalObserver.observe(document.body, observerConfig);
        }, 150);
      });
  }, 100);
}

modalObserver = new MutationObserver((mutations) => {
  let relevant = false;
  for (const m of mutations) {
    if (m.type === "childList") {
      if (m.addedNodes && m.addedNodes.length > 0) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1) {
            if (n.id === "mr_violator" || n.id === "mr_reporter" || (n.querySelector && (n.querySelector("#mr_violator") || n.querySelector("#mr_reporter")))) {
              relevant = true;
              break;
            }
          }
        }
      }
    }
    if (m.type === "characterData" || m.type === "attributes") {
      relevant = true;
    }
    if (relevant) break;
  }

  if (relevant) scheduleStyle();
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
  chrome.storage.sync.get({ isEnabled2: true }, (data) => {
  // темная тема
  if (!data.isEnabled2) {
    const style = document.createElement("style");
    style.textContent = `
      #muteCalcPanel {
        background: #ffffff !important;
        color: #000 !important;
      }

      .muteCalcInput {
        background: #f9f9f9 !important;
        border: 1px solid #ccc !important;
        color: #000 !important;
      }
      #muteCalcPanel button:disabled {
        background: #b86e00a4;
      }
      #muteCalcPanel button[data-tooltip]:hover::after {
        background: #555 !important;
        color: #fff !important;
      }
    `;
    document.head.appendChild(style);
  }
});

  // Кнопка открытия
  const toggle = document.createElement("button");
  toggle.id = "muteCalcToggle";
  document.body.appendChild(toggle);

  // Панель
  const panel = document.createElement("div");
  panel.id = "muteCalcPanel";
  document.body.appendChild(panel);

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
    const extTime = document.getElementById("mr_itime");
    if (extTime) extTime.value = totalMinutes > 0 ? totalMinutes : "";

    const extReason = document.getElementById("mr_ireason");

    let reasonStr = "";
    if (reasonsList.size >= 5) {
      reasonStr = "Многочисленные нарушения";
    } else {
      reasonStr = [...reasonsList].join(" + ");
    }

    if (extReason) extReason.value = reasonStr;

    timeInput.value = totalMinutes > 0 ? totalMinutes : "";
    reasonInput.value = reasonStr;
    totalLabel.textContent = formatTime(totalMinutes);

    if (hasPolitics) {
      matOskLabel.textContent = `Неадекватное поведение: 2880 / 1440`;
    } else {
      matOskLabel.textContent = `Неадекватное поведение: ${matOskSum} / 1440`;
    }
  }

    //Drag & Drop 
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
      if (target.tagName === "BUTTON" && target !== dragged) {
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

  // Сохраняем порядок кнопок
  function saveButtonsOrder(container) {
    const order = [...container.querySelectorAll("button")].map(b => b.textContent);
    localStorage.setItem("muteCalcButtonsOrder", JSON.stringify(order));
  }

  // Восстанавливаем порядок кнопок
  function restoreButtonsOrder(container) {
    const saved = localStorage.getItem("muteCalcButtonsOrder");
    if (!saved) return;
    try {
      const order = JSON.parse(saved);
      const buttons = [...container.querySelectorAll("button")];
      order.forEach(text => {
        const btn = buttons.find(b => b.textContent === text);
        if (btn) container.appendChild(btn);
      });
    } catch {}
  }

  function addReason(reason) {
    if (["Мат/Аморал", "Оскорбление игроков", "Оскорбление игроков + Мат","Политическая агитация"].includes(reason)) {
      reasonsList.add("Неадекватное поведение");
    } else {
      reasonsList.add(reason);
    }
  }

  function addMinutes(btn, minutes, reason, type = null, isSpecial = false) {
    if (btn.disabled) return;

    if (reason === "Политическая агитация") {
      totalMinutes -= matOskSum;
      matOskSum = 0;
      hasPolitics = true;
      totalMinutes += 2880;
      // блокируем кнопки Неадекватное поведение
      [matBtn, oskBtn, matOskBtn].forEach(b => b && (b.disabled = true));
      addReason(reason);
      btn.disabled = true;
      updateFields();
      return;
    }

    if (type === "mat" || type === "osk" || type === "matosk") {
      if (hasPolitics) return;
      let newSum = matOskSum + minutes;
      addReason(reason);
      if (newSum >= 1440) {
        const add = 1440 - matOskSum;
        totalMinutes += add;
        matOskSum = 1440;
        // блокируем кнопки Неадекватное поведение
        [matBtn, oskBtn, matOskBtn].forEach(b => b && (b.disabled = true));
      } else {
        totalMinutes += minutes;
        matOskSum = newSum;
      }
    } else if (type === "flood") {
      totalMinutes += minutes;
      addReason(reason);
      floodBtn.disabled = true;
      floodSymBtn.disabled = true;
    } else {
      totalMinutes += minutes;
      addReason(reason);
      btn.disabled = true;
    }

    if (isSpecial) {
      warning.style.display = "block";
    }
    updateFields();
  }

  // Причины
  const reasons = [
    ["Flood", 60, "flood"],
    ["Flood символами", 60, "flood"],
    ["Caps Lock", 60],
    ["Мат/Аморал", 120, "mat"],
    ["Оскорбление игроков", 240, "osk"],
    ["Оскорбление игроков + Мат", 360, "matosk"],
    ["Оскорбление родственников", 2880],
    ["Оскорбление Персонала", 21600],
    ["Неуважительное общение с Персоналом", 21600],
    ["Оскорбление Администрации", 43200],
    ["Неуважительное общение с Администрацией", 43200],
    ["Оскорбление проекта", 43200],
    ["Выдача себя за Персонал", 2880],
    ["Выдача себя за Администрацию", 10080],
    ["Пиар сторонних ресурсов", 2880],
    ["Реклама другого проекта", 10080],
    ["Оффтоп", 1440],
    ["Политическая агитация", 2880],
    ["Обман игроков", 240],
    ["Призыв к суициду", 240],
    ["Продажа вимеров", 2880],
    ["Покупка вимеров", 2880],
    ["Продажа услуг за вимеры", 21600],
    ["Продажа неигровых вещей за вимеры", 21600],
    ["Продажа вещей за реальные деньги", 43200],
    ["Продажа услуг за реальные деньги", 43200],
    ["Продажа аккаунта", 1440, null, true],
    ["Покупка аккаунта", 1440, null, true],
    ["Передача аккаунта", 1440, null, true],
    ["Пропаганда наркотиков", 1440, null, true],
    ["Пропаганда фашизма", 1440, null, true],
    ["Провокация игроков", 1440, null, true],
    ["Распространение читов", 1440, null, true],
    ["Распространение багов", 1440, null, true],
  ];

  let matBtn, oskBtn, matOskBtn, floodBtn, floodSymBtn;

  reasons.forEach(([text, minutes, type, special]) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.setAttribute("data-tooltip", `+${minutes} минут`);
    btn.draggable = true;
    if (special) btn.classList.add("special");
    btn.addEventListener("click", () => {
      btn.classList.add("button-clicked");
      setTimeout(() => btn.classList.remove("button-clicked"), 150);

      addMinutes(btn, minutes, text, type, special);
    });

    panel.appendChild(btn);

      if (type === "mat") matBtn = btn;
      if (type === "osk") oskBtn = btn;
      if (type === "matosk") matOskBtn = btn;
      if (text === "Flood") floodBtn = btn;
      if (text === "Flood символами") floodSymBtn = btn;
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
    totalMinutes = 0;
    matOskSum = 0;
    hasPolitics = false;
    reasonsList.clear();
    updateFields();
    warning.style.display = "none";
    panel.querySelectorAll("button").forEach(b => {
      if (b.id !== "muteCalcReset" && b.id !== "muteCalcCopy") b.disabled = false;
    });

    resetBtn.textContent = "OK!";
    setTimeout(() => (resetBtn.textContent = "RESET"), 1500);
  };
  inputsRow.appendChild(resetBtn);

  // Переключение панели
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

let API_TOKEN = null;
let tokenLoaded = false;
let domReady = false;

function tryInitialize() {
  if (tokenLoaded && domReady) {
    console.log('Start');
    createInputField();
    convertText();
    modifyLoginLabel();
    rowClass();
    processRows();
  }
}

// Загружаем токен
fetch(chrome.runtime.getURL('config.json'))
  .then(response => response.json())
  .then(config => {
    API_TOKEN = config.token;
    tokenLoaded = true;
    console.log('Token loaded:', API_TOKEN);
    tryInitialize();
  })
  .catch(error => {
    console.error('Не удалось загрузить config.json:', error);
  });

//DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    domReady = true;
    tryInitialize(); 
  }, { once: true });
} else {
  domReady = true;
  tryInitialize();
}

