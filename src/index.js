import './sass/main.scss';
import refs from './refs.js';
import photoCardsTpl from './template.hbs';
import { error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
import LoadMoreBtn from './components/load-more-btn';
import * as basicLightbox from 'basiclightbox';
import '../node_modules/basiclightbox/dist/basicLightbox.min.css';
//переменные
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '23121474-dc8d36b74d53a13d4dcab8680';
let page = 1;
let index = 0;
let currentIndex = 0;
let searchValue = ''; //поиск
let instance = null;
//посылаем запрос на бекенд
const handlerSubmit = e => {
  e.preventDefault();
  index = 0;
  //задаем поиск
  if (searchValue === refs.input.value) return;
  searchValue = refs.input.value;
  loadMoreBtn.show();
  loadMoreBtn.disable();
  fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchValue}&page=${page}&per_page=12&key=${KEY}`,
  )
    .then(response => response.json())
    .then(photo => {
      if (photo.hits.length === 0) {
        return error({
          text: 'Check your request.',
          delay: 1000,
        });
      } else {
        clearGallery();
        const parsedData = photo.hits.map(el => {
          return { ...el, dataIndex: index++ };
        });
        renderPhoto(parsedData);
        loadMoreBtn.enable();
      }
    })
    .then(() => page++)
    .then(clearContent)
    // .then(scrollOnLoadMore)
    .catch(err => {
      defaultModules.set(PNotifyMobile, {});
      clearGallery();
      error({
        text: 'Nothing found',
        delay: 1000,
      });
    });
};
function renderPhoto(photo) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardsTpl(photo));
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
function clearContent() {
  refs.input.value = '';
}
function loadMore(e) {
  //добавляет елементы
  e.preventDefault();
  // loadMoreBtn.show();
  // loadMoreBtn.disable();
  fetch(
    `${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchValue}&page=${page}&per_page=12&key=${KEY}`,
  )
    .then(response => response.json())
    .then(photo => {
      if (photo.hits.length === 0) {
        return error({
          text: 'Check your request.',
          delay: 1000,
        });
      } else {
        const parsedData = photo.hits.map(el => {
          return { ...el, dataIndex: index++ };
        });
        renderPhoto(parsedData);
        loadMoreBtn.enable();
      }
    })
    .then(() => page++)
    .then(scrollOnLoadMore)
    .catch(err => {
      defaultModules.set(PNotifyMobile, {});
      clearGallery();
      error({
        text: 'Nothing found',
        delay: 1000,
      });
    });
}
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
loadMoreBtn.refs.button.addEventListener('click', loadMore);
refs.form.addEventListener('submit', handlerSubmit);
refs.loadMore.addEventListener('click', loadMore);
refs.gallery.addEventListener('click', onOpenModal);
function scrollOnLoadMore() {
  refs.label.scrollIntoView({ block: 'end', behavior: 'smooth' });
}
function onOpenModal(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
  currentIndex = +e.target.dataset.index;
  const largeImageURL = e.target.src;
  instance = basicLightbox.create(
    `<img src=${largeImageURL} width="1200" height="900" class="imgOpen">`,
  );
  instance.show();
  window.addEventListener('keydown', onNextImgClick);
}
function onNextImgClick(e) {
  const ARR_RIGHT_CODE = 'ArrowRight';
  const ARR_LEFT_CODE = 'ArrowLeft';
  const arr = document.querySelectorAll('.list-image');
  if (e.code === ARR_RIGHT_CODE && currentIndex < arr.length - 1) {
    instance.close();
    instance = basicLightbox.create(
      `<img src=${arr[currentIndex + 1].dataset.source} width="1200" height="900" class="imgOpen">`,
    );
    instance.show();
    currentIndex += 1;
  } else if (e.code === ARR_LEFT_CODE && currentIndex > 0) {
    instance.close();
    instance = basicLightbox.create(
      `<img src=${arr[currentIndex - 1].dataset.source} width="1200" height="900" class="imgOpen">`,
    );
    instance.show();
    currentIndex -= 1;
  } else {
    return;
  }
}