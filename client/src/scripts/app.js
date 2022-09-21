import model from './model';
import { viewMain, viewAside } from './view';

class Controller {
  constructor() {
    this.model = model;
    this.viewMain = viewMain;
    this.viewAside = viewAside;
    this.viewMain.bindSearchAndPagination(this.handleSearchAndPagination);
    this.viewMain.bindAddToCart(this.handleAddToCart);
    this.viewAside.bindRemoveFromCart(this.handleRemoveFromCart);
    this.#init();
  }

  #init = async () => {
    // Show all the items initially
    await this.handleSearchAndPagination('');
    // Render the existing shopping cart items;
    const items = await this.model.getCartItems();
    this.viewAside.renderItems(items);
    // Update shopping cart product counter
    this.viewAside.updateCounter();
  };

  handleRemoveFromCart = (id) => {
    // Remove the product from the app's state
    this.model.removeItem(id);
    // Remove the product from the view
    this.viewAside.removeItem(id);
    // Update shopping cart product counter
    this.viewAside.updateCounter();
  };

  handleAddToCart = async (option) => {
    // Add the product to the app's state
    this.model.addItem(option);
    // Render the product in the shopping cart
    const items = await this.model.getCartItems();
    this.viewAside.renderItems(items);
    // Update shopping cart product counter
    this.viewAside.updateCounter();
    // Cart button animation - indicator
    this.viewAside.animateCartBtn();
  };

  /**
   * Handles the search and pagination functionality, decides between the two
   * using the type of the option param.
   * @param {*} option page(number) or query(string)
   */
  handleSearchAndPagination = async (option) => {
    // Clear the main View
    this.viewMain.clear();

    // Start the loading animation
    this.viewMain.addLoading();

    // Get the data from the API
    const data = await this.model.fetchItems({
      page: typeof option === 'number' ? option : null,
      query: typeof option === 'string' ? option : null,
    });

    // Clear the loading animation
    this.viewMain.clearLoading();

    // If the search was unsuccessful or returned no items
    if (data.data.items.length === 0)
      return this.viewMain.renderError('No items found for your query.');
    if (data.status != 'success')
      return this.viewMain.renderError(data.message);

    // If the search was successful render the items then the pagination
    this.viewMain.renderItems(data.data.items);
    this.viewMain.renderPagination(data.page, data.pages);
  };
}

const app = new Controller();
