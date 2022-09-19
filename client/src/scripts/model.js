import { ITEMS_ON_PAGE, BASE_URL, STORAGE_KEY } from './config';

class Model {
  state = {
    query: '',
    page: 1,
  };
  cache = {};

  constructor() {
    // Get the items from the local storage
    this.state.cartItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  /**
   * Add the product to the shopping cart local storage
   * @param {*} options expected to be {item: id, quantity: number}
   */
  addItem(options) {
    const index = this.state.cartItems.findIndex(
      (item) => item.item === options.item
    );
    // If it's a new item, add it as it is
    if (index === -1) this.state.cartItems.push(options);
    // If the item already exists just modify its quantity
    else this.state.cartItems[index].quantity += options.quantity;
    this.#commitItemsToLocalStorage();
  }

  async getCartItems() {
    const cartItemsFullInfo = [];
    for (const item of this.state.cartItems) {
      // Request the API for item's info
      // the local storages saves only the items ids and quantities
      const itemFetched =
        this.cache[item.item] || (await this.fetchItem(item.item));

      // Cache the results for this session
      this.cache[item.item] = itemFetched;

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

    return cartItemsFullInfo;
  }

  #commitItemsToLocalStorage() {
    const items = JSON.stringify(this.state.cartItems);
    localStorage.setItem(STORAGE_KEY, items);
  }

  async fetchItems(options) {
    // Save the new app state
    this.state.query = options.query ?? this.state.query;
    this.state.page = options.page || 1;

    // Request the data from the API
    const res = await fetch(
      `${BASE_URL}/api/v1/items?search=${this.state.query}&limit=${ITEMS_ON_PAGE}&page=${this.state.page}`
    );
    const data = await res.json();
    return data;
  }

  async fetchItem(id) {
    const res = await fetch(`${BASE_URL}/api/v1/items/${id}`);
    const data = await res.json();
    return data.data.item;
  }
}

export default new Model();
