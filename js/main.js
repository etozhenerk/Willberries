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

//goods

const viewAll = document.querySelectorAll(".view-all"),
  navigationLinks = document.querySelectorAll(
    ".navigation-link:not(.view-all)"
  ),
  longGoodsList = document.querySelector(".long-goods-list"),
  showAcsessories = document.querySelectorAll(".show-acsessories"),
  showClothing = document.querySelectorAll(".show-clothing");

const getGoods = async () => {
  const result = await fetch("./db/db.json");
  if (!result.ok) {
    throw "Ошибочка вышла: " + result.status;
  }

  return await result.json();
};

const createCard = ({ label, img, name, description, id, price }) => {
  const card = document.createElement("div");
  card.className = "col-lg-3 col-sm-6";
  card.innerHTML = `
      <div class="goods-card">
        ${label ? `<span class="label">${label}</span>` : ""}
        <img src="./db/${img}" alt="${name}" class="goods-image">
        <h3 class="goods-title">${name}</h3>
        <p class="goods-description">${description}</p>
        <button class="button goods-card-btn add-to-cart" data-id="${id}">
          <span class="button-price">$${price}</span>
      </button>
    </div>`;

  return card;
};

const renderCards = (data) => {
  longGoodsList.textContent = "";

  const cards = data.map(createCard);

  longGoodsList.append(...cards);

  document.body.classList.add("show-goods");
};

const showAll = (e, elem) => {
  e.preventDefault();
  getGoods().then(renderCards);
  const id = elem.getAttribute("href");
  document.querySelector(id).scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

viewAll.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    showAll(e, elem);
  });
});

const filterCards = (field, value) => {
  getGoods()
    .then((data) => {
      const filteredGoods = data.filter((good) => good[field] === value);

      return filteredGoods;
    })
    .then(renderCards);
};

navigationLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const field = link.dataset.field,
      value = link.textContent;
    filterCards(field, value);
  });
});

showAcsessories.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    e.preventDefault();
    filterCards("category", "Accessories");
  });
});
showClothing.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    e.preventDefault();
    filterCards("category", "Clothing");
  });
});
