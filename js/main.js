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