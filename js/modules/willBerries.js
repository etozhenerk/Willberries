"use strict";

const cartTableGoods = document.querySelector(".cart-table__goods"),
  cardTableTotal = document.querySelector(".card-table__total"),
  cartCount = document.querySelector('.cart-count'),
  btnDanger = document.querySelector('.btn-danger');

const buttonCart = document.querySelector(".button-cart"),
  modalCart = document.querySelector("#modal-cart"),
  modalClose = document.querySelector(".modal-close");

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

const cart = {
  cartGoods: [],
  countQuantity(){
    cartCount.textContent = this.cartGoods.reduce((sum, item) => sum + item.count, 0);
  },
  clearCart(){
    this.cartGoods.length = 0;
    this.renderCart();
    this.countQuantity();
  },
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = "cart-item";
      trGood.dataset.id = id;

      trGood.innerHTML = `
          <td>${name}</td>
          <td>${price}$</td>
          <td><button class="cart-btn-minus">-</button></td>
          <td>${count}</td>
          <td><button class="cart-btn-plus">+</button></td>
          <td>${price * count}$</td>
          <td><button class="cart-btn-delete">x</button></td>
      `;
      cartTableGoods.append(trGood);
    });

    const totalPrice = this.cartGoods.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );
    cardTableTotal.textContent = `${totalPrice}$`;
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
    this.countQuantity();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (id === item.id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (id === item.id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
    this.countQuantity();
  },
  addCartGoods(id) {
    const goodItem = this.cartGoods.find((item) => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then((data) => data.find((item) => item.id === id))
        .then(({ id, name, price }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
          this.countQuantity();
        });
    }
    
  },
};

btnDanger.addEventListener('click', cart.clearCart.bind(cart));

document.body.addEventListener("click", (e) => {
  const addToCart = e.target.closest(".add-to-cart");
  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

cartTableGoods.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("cart-btn-delete")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.deleteGood(id);
  }
  if (target.classList.contains("cart-btn-minus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.minusGood(id);
  }
  if (target.classList.contains("cart-btn-plus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.plusGood(id);
  }
});

//cart

const openModal = () => {
  cart.renderCart();
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

//goods

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
    .then((data) => data.filter((good) => good[field] === value))
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


const modalForm = document.querySelector('.modal-form');

const postData = (dataUser) =>
  fetch("server.php", {
    method: "POST",
    body: dataUser,
  });

modalForm.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(modalForm);
  formData.append("cart", JSON.stringify(cart.cartGoods));
  postData(formData)
    .then(response => {
      if(!response.ok){
        throw new Error(response.status);
      }
      alert('Ваш заказ успешно отправлен');
    })
    .catch(err => {
      alert('К сожалению произошла ошибка, повторите попытку позже');
      console.error(err);
    })
    .finally(() => {
      modalCart.classList.remove("show");
      modalForm.reset();
      cart.clearCart();
    });
});