'use strict';
import {
  qs,
  qsa,
  addLoading,
  renderItems,
  renderPagination,
  renderError,
} from './utils.js';
import {
  WINDOW_WIDTH_SHOPPING_CART_SHOWN,
  ACTION_KEY,
  BASE_URL,
  ITEMS_ON_PAGE,
} from './config.js';

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

///////////////////////////////////////////////////////////

const main = qs('.main');
main.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.closest('.form--search__btn')) AJAX();
});

main.addEventListener('keydown', (e) => {
  if (e.key != ACTION_KEY) return;
  e.preventDefault();
  if (document.activeElement.closest('.form--search')) AJAX();
});

async function AJAX() {
  // Remove the current elements and the pagination
  qs('.loading')?.remove();
  qs('.items')?.remove();
  qs('.pagination')?.remove();
  qs('.error')?.remove();

  // Start loading animation
  addLoading(main);

  // Get the query value typed by the user
  const query = qs('.form--search__input').value;

  // Request the data from the API
  const res = await fetch(
    `${BASE_URL}/api/v1/items?search=${query}&limit=${ITEMS_ON_PAGE}&page=1`
  );
  const data = await res.json();
  // Clear the loading animation
  qs('.loading')?.remove();

  // If there are no items found
  if (data.data.items.length === 0)
    return renderError(main, 'No items found for your query.');
  // If something went wrong on the server side
  if (data.status != 'success') return renderError(main, data.message);

  if (data.status === 'success') {
    // Create the items container
    const itemsContainerHTML = `<div class="items" role="list" aria-label="Items you can buy"></div>`;
    main.insertAdjacentHTML('beforeend', itemsContainerHTML);

    // Render the items
    renderItems(qs('.items'), data.data.items);

    // Render pagination
    renderPagination(main, data.pages, data.page);
  }
}
