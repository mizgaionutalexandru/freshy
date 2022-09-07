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

// disables animations during window resize
let resizeTimer;
window.addEventListener('resize', () => {
  document.body.classList.add('resize-animation-stopper');
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove('resize-animation-stopper');
  }, 400);
});
