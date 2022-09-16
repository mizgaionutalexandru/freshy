import model from './model';
import { viewMain, viewAside } from './view';

class Controller {
  constructor() {
    this.model = model;
    this.viewMain = viewMain;
    this.viewAside = viewAside;
    this.viewMain.bindSearch(this.handleSearch);
  }

  handleSearch = async (query) => {
    // Clear the main View
    this.viewMain.clear();

    // Start the loading animation
    this.viewMain.addLoading();

    // Get the data from the API
    const data = await this.model.searchItems(query);

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
