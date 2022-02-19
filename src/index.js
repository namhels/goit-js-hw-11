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

function loadNextPage(res) {
  const markup = makeMarkup(res.hits);
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
// ==========================================================

// const gallery = new SimpleLightbox('.gallery a');
// const refs = {
//   form: document.querySelector('.search-form'),
//   gallery: document.querySelector('.gallery'),
//   moreBtn: document.querySelector('.load-more'),
// };

// const apiPixabay = new ApiPixabay();
// // console.log(instance);

// refs.form.addEventListener('submit', onSearch);

// async function onSearch(e) {
//   e.preventDefault();
//   apiPixabay.resetPage();
//   clearGallery();
//   apiPixabay.query = e.target.searchQuery.value.trim();
//   await loadMore();
//   // if (!isScrollListener) {
//   //   window.addEventListener('scroll', onScrollThrottled);
//   //   isScrollListener = true;
//   // }
// }

// async function loadMore() {
//   try {
//     const response = await apiPixabay.fetchImages();
//     onSuccess(response);
//   } catch (error) {
//     onError(error);
//   }
// }

// function onSuccess(response) {
//   const cards = response.data.hits;
//   const totalHits = response.data.totalHits;
//   if (cards.length === 0 && totalHits === 0) {
//     Notify.failure('Sorry, there are no images matching your search query. Please try again.');
//     // window.removeEventListener('scroll', onScrollThrottled);
//     // isScrollListener = false;
//     return;
//   }
//   if (cards.length === 0 && totalHits !== 0) {
//     Notify.failure("We're sorry, but you've reached the end of search results.");
//     // window.removeEventListener('scroll', onScrollThrottled);
//     // isScrollListener = false;
//     return;
//   }
//   if (apiPixabay.page === 2) {
//     Notify.success(`Hooray! We found ${totalHits} images.`);
//   }
//   const cardsMarkup = makeMarkup(cards);

//   refs.gallery.insertAdjacentHTML('beforeend', cardsMarkup);

//   // addCardsToGallery(cardsMarkup);
//   gallery.refresh();
// }

// function onError(error) {
//   // window.removeEventListener('scroll', onScrollThrottled);
//   // isScrollListener = false;
//   if (error.response === 400) {
//     Notify.failure("We're sorry, but you've reached the end of search results.");
//     return;
//   }
//   Notify.failure('Sorry, there is no response from server. Please try again.');
// }

// // function addCardsToGallery(markup) {
// //   refs.gallery.insertAdjacentHTML('beforeend', markup);
// // }
// function clearGallery() {
//   refs.gallery.innerHTML = '';
// }
