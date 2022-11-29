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


// Обратный отсчет

// Определяем действующие элементы на странице
const year = document.querySelector('#year');
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');

const countdown = document.querySelector('#countdown');
const preloader = document.querySelector('#preloader');


// Делаем расчеты
const currentYear = new Date().getFullYear();
const nextYear = new Date(`January 01 ${currentYear + 1} 00:00:00`);

// Устанавливаем год на страницу
year.innerText = currentYear + 1;


function updateCounter() {
   const currentTime = new Date();
   const diff = nextYear - currentTime;

   // Перевод в целые дни
   const daysLeft = Math.floor(diff / 1000 / 60 / 60 / 24);

   // Часов всего, с учетом остатка от деления на 24 (преобразования в дни)
   const hoursLeft = Math.floor(diff / 1000 / 60 / 60) % 24;

   // Минут всего, с учетом остатка от преобразования в часы
   const minutesLeft = Math.floor(diff / 1000 / 60) % 60;

   // Секунд всего, с учетом остатка от преобразования в минуты
   const secondsLeft = Math.floor(diff / 1000) % 60;

   // Устанавливаем дни, часы, минуты, секунды на страницу
   days.innerText = daysLeft;
   hours.innerText = hoursLeft < 10 ? '0' + hoursLeft : hoursLeft;
   minutes.innerText = minutesLeft < 10 ? '0' + minutesLeft : minutesLeft;
   seconds.innerText = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
}

updateCounter();

// Запускаем расчет 1 раз в секунду (для обновления)
setInterval(updateCounter, 1000);


// Смена прелоудера на счетчик
setTimeout(function () {
   preloader.remove();
   countdown.style.display = 'flex';
}, 1000);
