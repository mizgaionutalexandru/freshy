'use strict';
import { WINDOW_WIDTH_SHOPPING_CART_SHOWN } from './config.js';

const cart = qs('#cart');
const cartOpenBtn = qs('#show-cart');
const cartCloseBtn = qs('#hide-cart');
const shoppingCartTabbables = qsa('#cart [tabindex]');

cartOpenBtn.addEventListener('click', toggleCartVisibility);
cartCloseBtn.addEventListener('click', toggleCartVisibility);

function toggleCartVisibility() {
  cart.classList.toggle('shopping-cart--hidden');
  // Toggle tabindexes
  shoppingCartTabbables.forEach((tabbable) => {
    tabbable.tabIndex = tabbable.tabIndex < 0 ? '0' : '-1';
  });
}

// disables animations during window resize
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);

  // Always make shopping cart elements tabbable for >= 1150px
  if (window.innerWidth >= WINDOW_WIDTH_SHOPPING_CART_SHOWN)
    shoppingCartTabbables.forEach((tabbable) => {
      tabbable.tabIndex = '0';
    });
  else
    shoppingCartTabbables.forEach((tabbable) => {
      tabbable.tabIndex = '-1';
    });
});

// If the initial window width is >= 1150px make shopping cart elements tabbable
if (window.innerWidth >= WINDOW_WIDTH_SHOPPING_CART_SHOWN)
  shoppingCartTabbables.forEach((tabbable) => {
    tabbable.tabIndex = '0';
  });
