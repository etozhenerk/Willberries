"use strict";

const mySwiper = new Swiper(".swiper-container", {
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

// cart

const togglePopup = () => {
  const buttonCart = document.querySelector(".button-cart"),
    modalCart = document.querySelector("#modal-cart"),
    modalClose = document.querySelector(".modal-close");

  const openModal = () => {
    modalCart.classList.add("show");
  };
  const closeModal = (e) => {
    const target = e.target;
    if (target === modalClose || target === modalCart) {
      modalCart.classList.remove("show");
    }
  };

  buttonCart.addEventListener("click", openModal);
  modalCart.addEventListener("click", closeModal);
};

togglePopup();

// scroll smoth

const scrollSmoth = () => {
  const scrollLinks = document.querySelectorAll("a.scroll-link");

  scrollLinks.forEach((scrollLink) => {
    scrollLink.addEventListener("click", (e) => {
      e.preventDefault();
      const id = scrollLink.getAttribute("href");
      document.querySelector(id).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
};

scrollSmoth();
