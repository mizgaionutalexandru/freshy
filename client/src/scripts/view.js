import {
  BASE_URL,
  ACTION_KEY,
  WINDOW_WIDTH_SHOPPING_CART_SHOWN,
  API_MIN_QUANTITY,
} from './config.js';

class View {
  qs = (query) => document.querySelector(query);
  qsa = (query) => document.querySelectorAll(query);
}

class ViewMain extends View {
  #parent = this.qs('.main');

  constructor() {
    super();
    this.#mainHandler();
  }

  bindSearchAndPagination(handler) {
    this.searchAndPaginationHandler = handler;
  }

  bindAddToCart(handler) {
    this.addToCartHandler = handler;
  }

  #mainHandler() {
    this.#parent.addEventListener('click', (e) => {
      // Handle search
      if (e.target.closest('.form--search__btn')) {
        e.preventDefault();
        // get the query value typed in by the user
        const query = this.qs('.form--search__input').value;
        return this.searchAndPaginationHandler(query);
      }

      // Handle pagination
      if (e.target.closest('[data-page]')) {
        // If the button is inactive then ignore the click
        if (
          e.target.closest('.pagination__direction--inactive') ||
          e.target.closest('.pagination__arrow--inactive')
        )
          return;
        // get the next page
        const page = parseInt(e.target.closest('[data-page]').dataset.page);
        return this.searchAndPaginationHandler(page);
      }

      // Product clicks
      const item = e.target.closest('.item');
      if (item) {
        // Handle quantity increase
        if (e.target.closest('.item__increase'))
          this.#quantityIncreaseHandler(item);

        // Handle quantity decrease
        if (e.target.closest('.item__decrease'))
          this.#quantityDecreaseHandler(item);

        // Handle adding product to cart
        if (e.target.closest('.item__cta')) {
          // Get the item's id
          const id = item.dataset.id;
          // Get the item's quantity and round it to 2 decimals
          let quantity = parseFloat(item.querySelector('.item__input').value);
          quantity = Math.round((quantity + Number.EPSILON) * 100) / 100;
          quantity = quantity < API_MIN_QUANTITY ? API_MIN_QUANTITY : quantity;
          // Modify the input value
          item.querySelector('.item__input').value = quantity;
          //
          this.addToCartHandler({ item: id, quantity });
        }
      }
    });

    this.#parent.addEventListener('keydown', (e) => {
      if (e.key != ACTION_KEY) return;
      e.preventDefault();
      // Handle search
      if (document.activeElement.closest('.form--search')) {
        // get the query value typed in by the user))
        const query = this.qs('.form--search__input').value;
        this.searchAndPaginationHandler(query);
      }

      // Handle pagination
      if (document.activeElement.closest('[data-page]')) {
        // If the button is inactive then ignore the click
        if (
          document.activeElement.closest('.pagination__direction--inactive') ||
          document.activeElement.closest('.pagination__arrow--inactive')
        )
          return;
        // get the next page
        const page = parseInt(
          document.activeElement.closest('[data-page]').dataset.page
        );
        return this.searchAndPaginationHandler(page);
      }
    });
  }

  #quantityIncreaseHandler(item) {
    const currentValue = parseFloat(item.querySelector('.item__input').value);
    let newValue;
    if (currentValue < API_MIN_QUANTITY) newValue = API_MIN_QUANTITY;
    else if (currentValue % API_MIN_QUANTITY === 0)
      newValue = currentValue + API_MIN_QUANTITY;
    else {
      newValue =
        (parseInt(currentValue / API_MIN_QUANTITY) + 1) * API_MIN_QUANTITY;
    }

    item.querySelector('.item__input').value = newValue;
  }

  #quantityDecreaseHandler(item) {
    const currentValue = parseFloat(item.querySelector('.item__input').value);
    let newValue;
    if (currentValue <= API_MIN_QUANTITY) newValue = API_MIN_QUANTITY;
    else if (currentValue % API_MIN_QUANTITY === 0)
      newValue = currentValue - API_MIN_QUANTITY;
    else {
      newValue =
        (parseInt(currentValue / API_MIN_QUANTITY) - 1) * API_MIN_QUANTITY;
    }

    item.querySelector('.item__input').value = newValue;
  }

  clear() {
    // Remove the current elements and the pagination
    this.qs('.loading')?.remove();
    this.qs('.items')?.remove();
    this.qs('.pagination')?.remove();
    this.qs('.error')?.remove();
    this.qs('.form--search__input').value = '';
  }

  addLoading() {
    const html = `<div class="loading">
                    <div class="loading__dot"></div>
                </div>`;

    this.#parent.insertAdjacentHTML('beforeend', html);
  }

  clearLoading() {
    this.qs('.loading')?.remove();
  }

  renderItems(items) {
    let html = `<div class="items" role="list" aria-label="Items you can buy">`;
    items.forEach((item) => {
      html += `
    <article class="item" data-id=${item._id.toString()} data-default-quantity=${
        item.defaultQuantity
      }>
        <img class="item__img" src="${BASE_URL}/imgs/${item.image}" alt="" />
            <div class="item__title">
            <span class="item__title__text"> ${item.name} </span>
        </div>
        <div class="item__quantity">
            <span class="item__quantity__text">Quantity</span>
            <div class="item__quantity__modifier">
                <img
                class="item__decrease"
                src="${BASE_URL}/icons/minus.svg"
                alt="Decrease the quantity"
                />
                <input class="item__input" type="text" value="${
                  item.defaultQuantity
                }" />
                <img
                class="item__increase"
                src="${BASE_URL}/icons/add.svg"
                alt="Increase the quantity"
                />
            </div>
        </div>
        <span class="item__price">${item.price}€ / ${item.unit}</span>
        <span tabindex="0" class="item__cta">Add to cart</span>
    </article>`;
    });
    html += `</div>`;
    this.#parent.insertAdjacentHTML('beforeend', html);
  }

  renderPagination(activePage, totalPages) {
    let html = `<footer class="pagination">
    <img
        data-page=${activePage === 1 ? 1 : activePage - 1}
        class="pagination__arrow ${
          activePage === 1 ? 'pagination__arrow--inactive' : ''
        }"
        src="${BASE_URL}/icons/arrow.svg"
        alt="Move to the previous page icon"
    />
    <span
        data-page=${activePage === 1 ? 1 : activePage - 1}
        tabindex="0"
        class="pagination__direction ${
          activePage === 1 ? 'pagination__direction--inactive' : ''
        }"
        >&#8592; Previous</span
    >`;

    for (let page = 1; page <= totalPages; page++)
      html += `
    <div data-page=${page} tabindex="0" class="pagination__page ${
        page === activePage ? 'pagination__page--active' : ''
      }">
        <span class="pagination__text">${page}</span>
    </div>
    `;

    html += `<span data-page=${
      activePage === totalPages ? totalPages : activePage + 1
    }
      tabindex="0" class="pagination__direction ${
        activePage === totalPages ? 'pagination__direction--inactive' : ''
      }">Next &#8594;</span>
    <img
        data-page=${activePage === totalPages ? totalPages : activePage + 1}
        class="pagination__arrow ${
          activePage === totalPages ? 'pagination__arrow--inactive' : ''
        }"
        src="${BASE_URL}/icons/arrow.svg"
        alt="Move to the next page icon"
    />
    </footer>`;
    this.#parent.insertAdjacentHTML('beforeend', html);
  }

  renderError(message) {
    const html = `<div class="error">
    <svg
      class="error__icon"
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
    <div class="error__text">
      ${message} <br />
      Please try again :)
    </div>
  </div>`;
    this.#parent.insertAdjacentHTML('beforeend', html);
  }
}

export const viewMain = new ViewMain();

class ViewAside extends View {
  #openCartBtn = this.qs('#show-cart');
  #closeCartBtn = this.qs('#hide-cart');
  #parent = this.qs('#cart');
  #itemsContainer = this.qs('.shopping-cart__items');

  constructor() {
    super();
    this.#mainHandler();
    this.#initTabIndexes();
  }

  #mainHandler() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      // disables animations during window resize
      resizeTimer = this.#animationStopperHandler(resizeTimer);
      // Always make shopping cart elements tabbable for >= 1150px
      this.#tabIndexesHandler();
    });

    this.#openCartBtn.addEventListener('click', () =>
      this.#toggleCartVisibilityHandler()
    );
    this.#closeCartBtn.addEventListener('click', () =>
      this.#toggleCartVisibilityHandler()
    );

    this.#openCartBtn.addEventListener('keydown', (e) => {
      if (e.key === ACTION_KEY) this.#toggleCartVisibilityHandler();
    });

    this.#parent.addEventListener('keydown', (e) => {
      if (e.key != ACTION_KEY) return;
      e.preventDefault();
      if (e.target.closest('#hide-cart')) this.#toggleCartVisibilityHandler();
    });
  }

  #animationStopperHandler(resizeTimer) {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove('resize-animation-stopper');
    }, 400);
    return resizeTimer;
  }

  #toggleCartVisibilityHandler() {
    cart.classList.toggle('shopping-cart--hidden');
    // If the cart will hide then the open cart button will be focused
    if (this.qs('.shopping-cart--hidden')) this.#openCartBtn.focus();
    // If the cart will shown then the close cart button will be focused
    else this.#closeCartBtn.focus();
    // Toggle tabindexes
    this.qsa('#cart [tabindex]').forEach((tabbable) => {
      tabbable.tabIndex = tabbable.tabIndex < 0 ? '0' : '-1';
    });
  }

  #tabIndexesHandler() {
    if (window.innerWidth >= WINDOW_WIDTH_SHOPPING_CART_SHOWN)
      this.qsa('#cart [tabindex]').forEach((tabbable) => {
        tabbable.tabIndex = '0';
      });
    else
      this.qsa('#cart [tabindex]').forEach((tabbable) => {
        tabbable.tabIndex = '-1';
      });
  }

  #initTabIndexes() {
    this.qsa('#cart [tabindex]').forEach((tabbable) => {
      tabbable.tabIndex =
        window.innerWidth >= WINDOW_WIDTH_SHOPPING_CART_SHOWN ? '0' : '-1';
    });
  }

  renderItems(items) {
    items.forEach((item) => {
      // Check if the item is already rendered
      const renderedItem = this.#parent.querySelector(`[data-id="${item.id}"`);
      if (!renderedItem) {
        const markup = this.#getCartItemMarkup(item);
        return this.#itemsContainer.insertAdjacentHTML('beforeend', markup);
      }
      // If it is, modify the existing element
      renderedItem.querySelector(
        '.shopping-cart__info__quantity'
      ).innerHTML = `${item.quantity} ${item.unit}`;
      renderedItem.querySelector(
        '.shopping-cart__info__price'
      ).innerHTML = `${item.price}€`;
    });
  }

  #getCartItemMarkup(item) {
    const tabindex =
      window.innerWidth >= WINDOW_WIDTH_SHOPPING_CART_SHOWN
        ? '0'
        : this.#parent.classList.contains('shopping-cart--hidden')
        ? '-1'
        : '0';

    return `
    <article class="shopping-cart__item" data-id=${item.id}>
      <img class="shopping-cart__img" src="${BASE_URL}/imgs/${item.image}" alt="" />
      <div class="shopping-cart__info">
        <div class="shopping-cart__info__header">
          <span class="shopping-cart__info__title"
            >${item.name}</span
          >
          <svg
            tabindex="${tabindex}"
            class="shopping-cart__remove"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_28_5543)">
              <path
                class="shopping-cart__remove__x"
                d="M0.712632 1.59712C0.579963 1.92879 0.557852 2.39313 0.662882 2.74139C0.723689 2.96803 1.03878 3.31629 3.24993 5.57166L5.76511 8.14212L3.24992 10.7126C0.497045 13.5207 0.574435 13.4212 0.596546 14.1067C0.618657 14.969 1.31517 15.6655 2.17752 15.6877C2.86297 15.7098 2.76347 15.7872 5.57163 13.0343L8.14209 10.5191L10.7126 13.0343C13.5207 15.7872 13.4212 15.7098 14.1067 15.6877C14.969 15.6655 15.6655 14.969 15.6876 14.1067C15.7097 13.4212 15.7871 13.5207 13.0343 10.7126L10.5191 8.14212L13.0343 5.57166C15.7871 2.7635 15.7097 2.863 15.6876 2.17754C15.6655 1.31519 14.969 0.618682 14.1067 0.596571C13.4212 0.57446 13.5207 0.497071 10.7126 3.24995L8.14209 5.76513L5.57163 3.24995C2.76347 0.497072 2.86297 0.574461 2.17752 0.596572C1.54734 0.607628 0.939276 1.02775 0.712632 1.59712Z"
                fill="#001714"
                fill-opacity="0.4"
              />
            </g>
            <defs>
              <clipPath id="clip0_28_5543">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div class="shopping-cart__info__body">
          <span class="shopping-cart__info__quantity">${item.quantity} ${item.unit}</span>
          <span class="shopping-cart__info__price">${item.price}€</span>
        </div>
      </div>
    </article>`;
  }

  animateCartBtn() {
    this.#openCartBtn.classList.add('item-added-animation');
    setTimeout(
      () => this.#openCartBtn.classList.remove('item-added-animation'),
      100
    );
  }

  updateCounter() {
    const noItems =
      this.#itemsContainer.querySelectorAll('[data-id]').length || 0;
    this.#openCartBtn.dataset.items = noItems;
  }
}

export const viewAside = new ViewAside();
