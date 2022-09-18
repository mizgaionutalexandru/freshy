import { ITEMS_ON_PAGE, BASE_URL } from './config';

class Model {
  state = {
    query: '',
    page: 1,
  };

  constructor() {}

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
}

export default new Model();
