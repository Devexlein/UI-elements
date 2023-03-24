"use strict"
/**
 * NodeList.prototype.forEach() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
 */
if (window.NodeList && !NodeList.prototype.forEach) {
   NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
         callback.call(thisArg, this[i], i, this);
      }
   };
}

// скрипт для определения типа устройства/экрана
const isMobile = {
   Android: function () {
      return navigator.userAgent.match(/Android/i);
   },
   BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
   },
   iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
   },
   Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
   },
   Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
   },
   any: function () {
      return (
         isMobile.Android() ||
         isMobile.BlackBerry() ||
         isMobile.iOS() ||
         isMobile.Opera() ||
         isMobile.Windows());
   }
};

if (isMobile.any()) {
   document.body.classList.add('_touch');

   let menuArrows = document.querySelectorAll('.menu__arrow');
   if (menuArrows.length > 0) {
      for (let index = 0; index < menuArrows.length; index++) {
         const menuArrow = menuArrows[index];
         menuArrow.addEventListener("click", function (e) {
            menuArrow.parentElement.classList.toggle('_active');
         });
      }
   }

} else {
   document.body.classList.add('_pc');
}

// Burger-menu
const iconMenu = document.querySelector('.menu__icon');
const menuBody = document.querySelector('.menu__body');

if (iconMenu) {
   iconMenu.addEventListener("click", function (e) {
      document.body.classList.toggle('_lock');
      iconMenu.classList.toggle('_active');
      menuBody.classList.toggle('_active');
   })
}

// плавный скролл при клике
const menuLinks = document.querySelectorAll('.menu__link[data-goto]');

if (menuLinks.length > 0) {
   menuLinks.forEach(menuLink => {
      menuLink.addEventListener("click", onMenuLinkClick);
   });

   function onMenuLinkClick(e) {
      // получаем объект-ссылку, где был клик
      const menuLink = e.target;
      // проверяем наличие дата-атрибута и существует ли объект, на который он ссылается
      if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
         const gotoBlock = document.querySelector(menuLink.dataset.goto);
         // количество пикселей до объекта, учитываем высоту шапки
         const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - document.querySelector('header').offsetHeight;

         // если меню-бургер содержит класс _active, удаляем классы у элементов ниже
         if (iconMenu.classList.contains('_active')) {
            document.body.classList.remove('_lock');
            iconMenu.classList.remove('_active');
            menuBody.classList.remove('_active');
         }

         // прокрутка скролла к месту
         window.scrollTo({
            top: gotoBlockValue,
            behavior: "smooth"
         });
         e.preventDefault();
      }
   }
}

// Select - выпадающий список
document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {

   // Поиск активного дропдауна
   const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
   const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
   const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item');

   const dropDownInput = dropDownWrapper.querySelector('.dropdown__input-hidden');


   // Отслеживаем клик по кнопке
   dropDownBtn.addEventListener('click', function () {
      // открываем/закрываем список
      dropDownList.classList.toggle('dropdown__list--visible');
      this.classList.add('dropdown__button--active');
   });

   // Выбор элемента списка
   dropDownListItems.forEach(function (listItem) {
      listItem.addEventListener('click', function (e) {
         // Блокируем передачу клика вверх 
         e.stopPropagation();
         // Запомнить выбранное значение списка
         dropDownBtn.innerText = this.innerText;
         dropDownBtn.focus();

         // Указываем в инпуте выбранное значение списка по data-атрибуту
         dropDownInput.value = this.dataset.value;

         // Закрыть дропдаун
         dropDownList.classList.remove('dropdown__list--visible');
      })
   });

   // Клик снаружи дропдауна. Закрываем список 
   document.addEventListener('click', function (e) {
      if (e.target !== dropDownBtn) {
         dropDownBtn.classList.remove('dropdown__button--active');
         dropDownList.classList.remove('dropdown__list--visible');
      }
   });

   // Закрываем список при нажатии на клавиши Esc и Tab
   document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' || e.key === 'Escape') {
         dropDownBtn.classList.remove('dropdown__button--active');
         dropDownList.classList.remove('dropdown__list--visible');
      }
   });
});


// табы 
// событие загрузки документа
document.addEventListener('DOMContentLoaded', () => {
   const tabs = document.querySelector('.tabs');
   const tabsBtn = document.querySelectorAll('.tabs__btn');
   const tabsContent = document.querySelectorAll('.tabs__box');

   if (tabs) {
      // отслеживаем клик на табах
      tabs.addEventListener('click', (e) => {
         if (e.target.classList.contains('tabs__btn')) {
            // при клике на кнопку записываем её дата-атрибут
            const tabsPath = e.target.dataset.tabsPath;
            // удаляем активный класс у всех элементов
            tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
            // к текущей кнопке добавляем активный класс
            document.querySelector(`[data-tabs-path="${tabsPath}"]`).classList.add('tabs__btn_active');
            // вызываем функцию переключения контента
            tabsHandler(tabsPath);
         }

         if (e.target.classList.contains('tabs__arrow_prev')) {
            // находим активную в текущий момент кнопку
            let activeBtn = document.querySelector('.tabs__btn_active');
            let activeParent = activeBtn.closest('.tabs__link');
            // предыдущий элемент родителя активной кнопки
            let previousParent = activeParent.previousElementSibling;

            if (previousParent) {
               // если он есть, присваиваем класс активности
               let prevActive = previousParent.querySelector('.tabs__btn');
               tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
               prevActive.classList.add('tabs__btn_active');

               // вызываем функцию переключения табов
               let path = prevActive.dataset.tabsPath;
               tabsHandler(path);
            }
         }

         if (e.target.classList.contains('tabs__arrow_next')) {
            let activeBtn = document.querySelector('.tabs__btn_active');
            let activeParent = activeBtn.closest('.tabs__link');
            // следующий за элементом родителя активной кнопки
            let nextParent = activeParent.nextElementSibling;

            if (nextParent) {
               let nextActive = nextParent.querySelector('.tabs__btn');
               tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
               nextActive.classList.add('tabs__btn_active');

               let path = nextActive.dataset.tabsPath;
               tabsHandler(path);
            }
         }
      });
   }
   // переключение табов
   const tabsHandler = (path) => {
      tabsContent.forEach(el => { el.classList.remove('tabs__box_active') });
      document.querySelector(`[data-tabs-target="${path}"]`).classList.add('tabs__box_active');
   };
});


// Радужная кнопка 
// *registerProperty (CSS Houdini) - анимация не работает в Firefox или Safari
const rainbowColors = [
   // 'hsl(1deg, 96%, 55%)', // red
   // 'hsl(25deg, 100%, 50%)', // orange
   // 'hsl(40deg, 100%, 50%)', // yellow
   // 'hsl(45deg, 100%, 50%)', // yellow
   // 'hsl(66deg, 100%, 40%)', // yellow
   // 'hsl(130deg, 100%, 40%)', // green
   // 'hsl(177deg, 100%, 35%)', // green
   'hsl(230deg, 100%, 45%)', // blue
   'hsl(230deg, 100%, 45%)', // blue
   'hsl(240deg, 100%, 45%)', // indigo
   'hsl(260deg, 100%, 55%)', // violet
   'hsl(325deg, 100%, 48%)', // violet
   'hsl(325deg, 100%, 48%)', // violet
   'hsl(325deg, 100%, 48%)', // violet
   'hsl(260deg, 100%, 55%)', // violet
];

const paletteSize = rainbowColors.length;
// Number of milliseconds for each update
const intervalDelay = 1000;
const colorNames = [
   '--magic-rainbow-color-0',
   '--magic-rainbow-color-1',
   '--magic-rainbow-color-2',
];
// Register properties
colorNames.forEach((name, index) => {
   CSS.registerProperty({
      name,
      syntax: '<color>',
      inherits: false,
      initialValue: rainbowColors[index],
   });
});
const buttonElem = document.querySelector('.btn-gradient');
let cycleIndex = 0;
window.setInterval(() => {
   // Shift every color up by one position.
   //
   // `% paletteSize` is a handy trick to ensure
   // that values "wrap around"; if we've exceeded
   // the number of items in the array, it loops
   // back to 0.
   const nextColors = [
      rainbowColors[(cycleIndex + 1) % paletteSize],
      rainbowColors[(cycleIndex + 2) % paletteSize],
      rainbowColors[(cycleIndex + 3) % paletteSize],
   ];
   // Apply these new colors, update the DOM.
   colorNames.forEach((name, index) => {
      buttonElem.style.setProperty(name, nextColors[index]);
   });
   // increment the cycle count, so that we advance
   // the colors in the next loop.
   cycleIndex++;
}, intervalDelay);


// Подключение карты
main();
async function main() {
   var map = null;
   await ymaps3.ready;
   const { YMap, YMapDefaultSchemeLayer, YMapControls, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;
   const LOCATION = {
      center: [37.703181999999984, 55.72321706901226],
      zoom: 17
   };

   const { YMapZoomControl } = await ymaps3.import(
      "@yandex/ymaps3-controls@0.0.1"
   );

   map = new YMap(document.getElementById("map"), { location: LOCATION }, [
      new YMapDefaultSchemeLayer(),
      new YMapControls({ position: "right" }, [new YMapZoomControl({})])
   ]);

   map.addChild(new YMapDefaultFeaturesLayer());

   const el = document.createElement('img');
   el.className = 'my-marker';
   el.src = '../img/maps/placeholder.png';
   // el.onclick = () => map.update({ location: { ...LOCATION, duration: 400 } });
   map.addChild(new YMapMarker({ coordinates: LOCATION.center }, el));
}


/* Подключение API 2.1 - предыдущая версия*/
// let center = [55.72321706901226, 37.703181999999984];

// function init() {
//    let map = new ymaps.Map('map', {
//       center: center,
//       zoom: 17
//    });

//    let placemark = new ymaps.Placemark(center, {}, {
//       iconLayout: "default#image",
//       iconImageHref: './img/showroom/location-map.png',
//       iconImageSize: [50, 50],
//       iconImageOffset: [-17, -40],
//    });

//    map.controls.remove('geolocationControl'); // удаляем геолокацию
//    map.controls.remove('searchControl'); // удаляем поиск
//    map.controls.remove('trafficControl'); // удаляем контроль трафика
//    map.controls.remove('typeSelector'); // удаляем тип
//    // map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
//    // map.controls.remove('zoomControl'); // удаляем контрол зуммирования
//    map.controls.remove('rulerControl'); // удаляем контрол правил
//    // map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

//    map.geoObjects.add(placemark);
// }

// ymaps.ready(init);