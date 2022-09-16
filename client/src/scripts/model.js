import { ITEMS_ON_PAGE, BASE_URL } from './config';

class Model {
  constructor() {
    //
  }

  async searchItems(query) {
    // Request the data from the API
    const res = await fetch(
      `${BASE_URL}/api/v1/items?search=${query}&limit=${ITEMS_ON_PAGE}&page=1`
    );
    const data = await res.json();
    return data;
  }
}

export default new Model();
