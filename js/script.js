const swiper = new Swiper('.swiper-container', {
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.slider-button-next',
    prevEl: '.slider-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});
