// Скролл фильтра
const nav = document.querySelector('.js-filter');
const navList = nav.querySelector('.js-filter__list');
const navBtn = nav.getElementsByClassName('js-filter__item');
const SectionsList = document.getElementsByClassName('js-sections');
const Sections = document.querySelectorAll('.js-section');
const activeBtnClass = 'filter__item_active'; // Класс для стилизации активной кнопки
const speed = .2; // Скорость скроллинга до раздела меню
let clickAnimation = false; //  Флаг для того, чтобы присваивание классов при скроллинге не пересекалось с присваиванием классов при клике на кнопку
let positionSections = [];
let navBtnArray = Array.from(navBtn);
const SectionsArray = Array.from(Sections);

navList.children[0].classList.add(activeBtnClass); // Сразу добавляем активный класс для первой кнопки, так как сразу димим первый раздел меню

window.addEventListener("load", init); // Как только все ресурсы загузятся, сработает функция init

function anchorActive() { // Функция для того, чтобы при клике на кнопку, страница плавно докручивалась до соответствующего раздела
    for (let i = 0; i < navBtn.length; i++) { // Проходим циклом по каждой кнопке
        navBtn[i].addEventListener('click', function(e) { // Отслеживаем клик по кнопке
            clickAnimation = true; // Активируем флаг, как только кликнули по кнопке
            if (!(navBtn[i].classList.contains(activeBtnClass))) { // Если на кнопке нет активного класса, то снова проходимся циклом по всем кнопкам и удаляем везде активные классы, и добавляем только той кнопке, по которой кликнули
                for (var j = 0; j < navBtn.length; j++) {
                    navBtn[j].classList.remove(activeBtnClass);
                    this.classList.add(activeBtnClass);
                }
            }
            let windowY = window.pageYOffset; // Переменная windowY хранит информацию на сколько пикселей прокручена страница по вертикали
            const indexBtn = e.target.dataset.indexButton; // Переменная indexBtn хранит данные из атрибута data-index-button текущей кнопки
            const currentSection = document.querySelector(`[data-section = "${indexBtn}"]`); // Ищем элемент, у которого значение атрибута data-section совпадает со значением атрибута data-index-button текущей кнопки, и кладем в переменную currentSection
            const coord = currentSection.getBoundingClientRect().top; // Переменная coord хранит позицию текущего раздела относительно начала окна браузера 
            let start = null; // 

            requestAnimationFrame(step); // requestAnimationFrame() – встроенный метод JavaScript для плавной анимации. Функция step будет вызвана, когда придёт время обновить анимацию на следующей перерисовке.
            
            function step(time) {
                if (start === null)  start = time;
                let progress = time - start;
                
                let coordY;
                    if (coord < 0) {
                        coordY = Math.max(windowY - progress / speed, windowY + coord)
                    } else {
                        coordY = Math.min(windowY + progress / speed, windowY + coord);
                    }
                    

                window.scrollTo(0, coordY); // Скроллим страницу на coordY пикселей по вертикали и 0 по горизонтали
                
                if (coordY != windowY + coord) {
                    requestAnimationFrame(step); // Если еще не докрутили страницу до нужного раздела, то снова вызываем метод
                } else {
                    clickAnimation = false; // Как только доскроллили до нужного раздела, флаг отключаем
                }
            }
        })
    }
}
function init() { // Инициализирующая функция, в которой вызываются все остальные функции, объявленные здесь
    positionSections = setPositionSections(SectionsArray);
    anchorActive();
    scrollActiveClass();
    window.addEventListener("scroll", scrollActiveClass); // При событии скролл срабатывает scrollActiveClass
}
function scrollActiveClass() {
    positionSections.forEach((el, i) => {
        let currentEl = navBtnArray[i];
        if (clickAnimation) return; // Если clickAnimation является true, то классы при скроллинге не добаляются
        if (isVisible(el, currentEl)) {
            for (const iter of navBtnArray) {
                iter.classList.remove(activeBtnClass);
            }
        currentEl.classList.add(activeBtnClass);
        }
    });
}

function isVisible(element, current) {
    let scroll = window.pageYOffset; // Переменная scroll хранит информацию на сколько пикселей прокручена страница по вертикали

    return scroll >= element.top - 110 && scroll < element.bottom;
}

function setPositionSections(elements) {
    let position = [];
    Array.from(elements).forEach((item, i) => {
        position[i] = {};
        position[i].item = item;
        position[i].top = item.getBoundingClientRect().top + window.pageYOffset;
        position[i].bottom = item.getBoundingClientRect().bottom + window.pageYOffset;
    });
    return position;
}

//// Фиксация фильтра
const filter = document.querySelector(".content__filter");
const filterTop = $(".content__filter").offset().top

$(window).scroll(function(){
    const windowScroll = $(window).scrollTop();
    if(windowScroll > filterTop) {
        $(".content__filter").addClass("fixed");
    } else {
        $(".content__filter").removeClass("fixed");
    }
});

//// Фиксация корзины
const basket = document.querySelector(".basket");
const basketTop = $(".basket").offset().top  + 50;

$(window).scroll(function(){
    const windowScroll = $(window).scrollTop();
    if(windowScroll > basketTop) {
        $(".basket").addClass("fixed_basket");
    } else {
        $(".basket").removeClass("fixed_basket");
    }
});

//// Обработки кнопки бургер
var burgerlink = document.querySelector('.header__burger-link');
var navMobile = document.querySelector('.nav-mobile');
burgerlink.addEventListener('click', toggleClassBurger);

var navMobilelink = document.querySelectorAll ("a.nav-mobile__item-link");
for (var link of navMobilelink){
	link.addEventListener('click', toggleClassBurger);
}
function toggleClassBurger() {
    event.preventDefault();
    burgerlink.classList.toggle("header__burger-link_active");
    navMobile.classList.toggle("nav-mobile_active");
}

//// Открываем фильтр
const show = document.querySelector(".filter-show");
const filterMob = document.querySelector(".filter");
const bg = document.querySelector(".bg");
show.addEventListener('click', toggleClass);
const filterItems = document.querySelectorAll(".js-filter__item");
for (var item of filterItems) {
    item.addEventListener('click', toggleClass);
}

function toggleClass() {    
    if (window.innerWidth < 769) {
        show.classList.toggle("filter-show_hidden");
        filterMob.classList.toggle("filter_mb");
        bg.classList.toggle("bg_active");
    } if (bg.classList.contains("bg_active")) {
        document.body.style.overflow = "hidden";
    } if ((window.innerWidth < 769 && !bg.classList.contains("bg_active"))) {
        document.body.style.overflow = "auto";
    }
}

//// Модальное окно
const menuItems = document.querySelectorAll(".menu__consist-more");
const modalItems = document.querySelectorAll(".modal__item");
const modalClose = document.querySelectorAll(".info__close");

// Открываем модально окно
for (var menuItem of menuItems) {
    menuItem.addEventListener('click', openModal);
}
function openModal() {
    for (var menuItem of menuItems) {
        menuItem;
        target = event.target;
        let menuItemData = target.getAttribute("data-btn");
        for (var modalItem of modalItems) {
            let modalItemData = modalItem.getAttribute("data-modal");
            if (menuItemData === modalItemData) {
                bg.classList.add("bg_active");
                document.body.style.overflow = "hidden";
                modalItem.classList.add("modal__item_block");
            }
        }
    } 
}
// Закрывает модальное окно
for (var close of modalClose) {
    close.addEventListener('click', closeModal);
}
function closeModal() {
    for (var modalItem of modalItems) {
        modalItem;
        bg.classList.remove("bg_active");
        document.body.style.overflow = "auto";
        modalItem.classList.remove("modal__item_block");
    }
}