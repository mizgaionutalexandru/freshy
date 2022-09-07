'use strict';

const qs = (query) => document.querySelector(query);

const cart = qs('#cart');
const cartOpenBtn = qs('#show-cart');
const cartCloseBtn = qs('#hide-cart');

cartOpenBtn.addEventListener('click', toggleCartVisibility);
cartCloseBtn.addEventListener('click', toggleCartVisibility);

function toggleCartVisibility() {
  cart.classList.toggle('shopping-cart--hidden');
  // Also toggle show-cart btn visibility
}
