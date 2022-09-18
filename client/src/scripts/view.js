import {
  BASE_URL,
  ACTION_KEY,
  WINDOW_WIDTH_SHOPPING_CART_SHOWN,
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

  bindSearch(handler) {
    this.searchHandler = handler;
  }

  #mainHandler() {
    this.#parent.addEventListener('click', (e) => {
      e.preventDefault();
      if (e.target.closest('.form--search__btn')) {
        // get the query value typed in by the user
        const query = this.qs('.form--search__input').value;
        this.searchHandler(query);
      }
    });

    this.#parent.addEventListener('keydown', (e) => {
      if (e.key != ACTION_KEY) return;
      e.preventDefault();
      if (document.activeElement.closest('.form--search')) {
        // get the query value typed in by the user))
        const query = this.qs('.form--search__input').value;
        this.searchHandler(query);
      }
    });
  }

  clear() {
    // Remove the current elements and the pagination
    this.qs('.loading')?.remove();
    this.qs('.items')?.remove();
    this.qs('.pagination')?.remove();
    this.qs('.error')?.remove();
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
    <article class="item" data-id=${item._id.toString()}>
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
        class="pagination__arrow ${
          activePage === 1 ? 'pagination__arrow--inactive' : ''
        }"
        src="${BASE_URL}/icons/arrow.svg"
        alt="Move to the previous page icon"
    />
    <span
        tabindex="0"
        class="pagination__direction ${
          activePage === 1 ? 'pagination__direction--inactive' : ''
        }"
        >&#8592; Previous</span
    >`;

    for (let page = 1; page <= totalPages; page++)
      html += `
    <div tabindex="0" class="pagination__page ${
      page === activePage ? 'pagination__page--active' : ''
    }">
        <span class="pagination__text">${page}</span>
    </div>
    `;

    html += `<span tabindex="0" class="pagination__direction ${
      activePage === totalPages ? 'pagination__direction--inactive' : ''
    }">Next &#8594;</span>
    <img
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
}

export const viewAside = new ViewAside();
