import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ApiPixabay from './js/ApiPixabay';
import makeMarkup from './components/makeMarkup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let inputValue = '';
let totalPages = 0;
const lightbox = new SimpleLightbox('.gallery a');
const api = new ApiPixabay();

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

hideButton();
refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  clearMarkup();
  inputValue = e.target.searchQuery.value.trim();
  if (!inputValue) {
    Notify.failure('Please fill in the search field');
    return;
  }
  api.resetPage();
  try {
    const res = await api.fetchImages(inputValue);
    loadFirstPage(res);
  } catch (error) {
    onError(error);
  }
}

function loadFirstPage({ hits, totalHits }) {
  clearMarkup();
  if (!hits.length) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  totalPages = Math.ceil(totalHits / hits.length);
  const markup = makeMarkup(hits);
  addCardsToGallery(markup);

  if (api.page !== totalPages) {
    showButton();
  }
  Notify.success(`Hooray! We found ${totalHits} images.`);
  lightbox.refresh();
}

function loadNextPage({ hits }) {
  const markup = makeMarkup(hits);
  addCardsToGallery(markup);
  if (api.page === totalPages) {
    hideButton();
    Notify.info("We're sorry, but you've reached the end of search results.");
    lightbox.refresh();
    return;
  }
  showButton();
  lightbox.refresh();
}

async function onLoadMore(e) {
  e.target.classList.add('is-hidden');
  api.incrementPage();
  try {
    const res = await api.fetchImages(inputValue);
    loadNextPage(res);
  } catch (error) {
    onError(error);
  }
}

function clearMarkup() {
  hideButton();
  refs.gallery.innerHTML = '';
}

function onError(error) {
  console.error(error);
  Notify.failure('Something went wrong.Please try again');
}

function addCardsToGallery(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function hideButton() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function showButton() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
