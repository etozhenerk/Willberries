"use strict";

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