'use strict';

import { BASE_URL, STORAGE_KEY } from './config';

function initUserInput() {
  const formCta = document.querySelector('.form__cta');
  formCta.addEventListener('click', async (e) => {
    const inputs = new Array(...document.querySelectorAll('.form__input'));
    const valids = inputs.map((input) => input.checkValidity());
    if (valids.includes(false)) return;
    // If all the inputs are valid
    e.preventDefault();
    // Add loading animation
    formCta.classList.add('loading');

    const shoppingCart = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const userData = {
      customer: {
        fullName: document.querySelector('#name').value,
        email: document.querySelector('#email').value,
        phoneNumber: document.querySelector('#phone').value,
        shippingAddress: document.querySelector('#shipping-address').value,
        billingAddress: document.querySelector('#billing-address').value,
      },
      shoppingCart,
    };
    const res = await fetch(`${BASE_URL}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    formCta.classList.remove('loading');
    if (data.status != 'success') {
      // render the error
      document.querySelector('.error').classList.add('error--shown');
      document.querySelector('.error__text').innerHTML = data.message;
      setTimeout(() => {
        document.querySelector('.error').classList.remove('error--shown');
      }, 3000);
      return;
    }
    // render success msg
    formCta.innerHTML = 'Order placed!';
    formCta.style.backgroundColor = `var(--green-two)`;
    localStorage.setItem(STORAGE_KEY, `[]`);
    setTimeout(() => {
      location.assign('/');
    }, 1000);
  });
}

async function initShoppingCart() {
  // Load the shopping cart items
  const shoppingCart = JSON.parse(localStorage.getItem(STORAGE_KEY));

  document.querySelector('.items').innerHTML = `<div class="loading--cart">
        <div class="loading--cart__dot"></div>
    </div>`;

  if (!shoppingCart) return renderEmptyCartError();
  const cartItemsFullInfo = [];
  for (const item of shoppingCart) {
    // Request the API for item's info
    const itemFetched = await fetchItem(item.item);

    const { image, name, price, unit } = itemFetched;

    cartItemsFullInfo.push({
      id: item.item,
      quantity: item.quantity,
      image,
      name,
      unit,
      price: Math.round((price * item.quantity + Number.EPSILON) * 100) / 100,
    });
  }

  renderItems(cartItemsFullInfo);
}

async function fetchItem(id) {
  const res = await fetch(`${BASE_URL}/api/v1/items/${id}`);
  const data = await res.json();
  return data.data.item;
}

function renderItems(items) {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';
  if (items.length === 0) {
    renderEmptyCartError();
    return;
  }
  let markup = '';
  let total = 0;
  items.forEach((item) => {
    markup += `
    <article class="item">
        <img class="item__img" src="${BASE_URL}/imgs/${item.image}" alt="" />
        <div class="item__info">
        <div class="item__title">${item.name}</div>
        <div class="item__body">
            <span class="item__quantity">${item.quantity} ${item.unit}</span>
            <span class="item__price">${item.price}€</span>
        </div>
        </div>
    </article>`;
    total += item.price;
  });
  itemsContainer.insertAdjacentHTML('beforeend', markup);
  document.querySelector('.total').innerHTML = `Total: ${total}€`;
}

function renderEmptyCartError() {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.innerHTML = '';
  const markup = `<div class="error--items">
    <svg
    class="error--items__icon"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
        d="M15.4062 0.0437222C11.375 0.193724 7.58125 1.84997 4.7125 4.71247C2.13125 7.29997 0.55 10.5812 0.125 14.25C0.03125 15.0125 0.03125 16.9875 0.125 17.75C0.55 21.4187 2.13125 24.7 4.7125 27.2875C6.96875 29.5437 9.78125 31.05 12.8562 31.65C14.0375 31.8812 14.7125 31.9437 16 31.9437C18.7938 31.9437 21.1688 31.35 23.5938 30.0375C27.775 27.7812 30.7437 23.7625 31.65 19.1437C31.8813 17.9625 31.9438 17.2875 31.9438 16C31.9438 13.2062 31.35 10.8312 30.0375 8.40622C27.7875 4.24372 23.7938 1.28122 19.175 0.349974C18.0312 0.124973 16.5438 -2.67029e-05 15.4062 0.0437222ZM17.7063 3.09372C20.5438 3.46247 23.1313 4.74997 25.1875 6.81247C27.25 8.86872 28.5375 11.4562 28.9062 14.2937C29.025 15.2062 29.025 16.7937 28.9062 17.7062C28.5375 20.5437 27.25 23.1312 25.1875 25.1875C23.1313 27.25 20.5438 28.5375 17.7063 28.9062C16.7938 29.025 15.2063 29.025 14.2937 28.9062C11.4563 28.5375 8.86875 27.25 6.8125 25.1875C4.75 23.1312 3.4625 20.5437 3.09375 17.7062C2.975 16.7937 2.975 15.2062 3.09375 14.2937C3.3875 12.05 4.275 9.92497 5.7 8.04372C6.2 7.38747 7.3875 6.19997 8.04375 5.69997C9.9 4.29372 12.0375 3.39372 14.225 3.09997C15.0813 2.98122 16.8313 2.98122 17.7063 3.09372Z"
        fill="#EA4C41"
    />
    <path
        d="M15.3376 7.1187C14.6626 7.2937 14.1751 7.73745 14.0626 8.27495C14.0188 8.4937 14.0001 10.0937 14.0126 13.1937L14.0313 17.7812L14.1751 18.0625C14.4563 18.6312 15.1188 18.95 16.0001 18.95C16.7126 18.95 17.1751 18.7812 17.5751 18.375C17.8001 18.1375 17.8813 18.0062 17.9376 17.7437C17.9876 17.5 18.0001 16.1312 17.9876 12.8125L17.9688 8.2187L17.8063 7.93745C17.5938 7.5812 17.4876 7.48745 17.0626 7.27495C16.7751 7.1312 16.6313 7.09995 16.1251 7.08745C15.8001 7.07495 15.4438 7.08745 15.3376 7.1187Z"
        fill="#EA4C41"
    />
    <path
        d="M15.6812 21.0687C15.0688 21.1625 14.5438 21.5562 14.25 22.1375C14.0875 22.4625 14.0625 22.5875 14.0625 23C14.0625 23.4125 14.0875 23.5375 14.25 23.8625C14.4563 24.2688 14.725 24.5437 15.1438 24.7625C15.3625 24.8812 15.5063 24.9062 16 24.9062C16.4938 24.9062 16.6375 24.8812 16.8563 24.7625C17.275 24.5437 17.5438 24.2688 17.75 23.8625C17.9125 23.5375 17.9375 23.4125 17.9375 23C17.9375 22.5875 17.9125 22.4625 17.75 22.1375C17.3563 21.3563 16.5438 20.9312 15.6812 21.0687Z"
        fill="#EA4C41"
    />
    </svg>
    <div class="error--items__text">Your shopping cart is empty. <br/> Add products to place an order!</div>
</div>`;

  itemsContainer.insertAdjacentHTML('beforeend', markup);
  document.querySelector('.total').remove();

  setTimeout(() => {
    location.assign('/');
  }, 1000);
}

initShoppingCart();
initUserInput();
