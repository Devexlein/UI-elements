// Параллакс слайдер

let parallaxSlider = new Swiper('.parallax-slider', {
   // включаем паралакс
   parallax: true,
   // скорость переключения
   speed: 2000,
   // стрелки
   navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
   },
});