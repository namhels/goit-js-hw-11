import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '25272385-d3b781fb1902e693cd197cf56';

export default class ApiPixabay {
  constructor() {
    this.page = 1;
  }

  async fetchImages(inputValue) {
    const queryParams = new URLSearchParams({
      key: API_KEY,
      q: inputValue,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    const { data } = await axios.get(`?${queryParams}`);
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
