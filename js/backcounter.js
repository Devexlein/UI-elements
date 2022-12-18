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