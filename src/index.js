import './sass/main.scss';
import refs from './refs.js';
import photoCardsTpl from './template.hbs';
import { error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
import LoadMoreBtn from './components/load-more-btn';


//переменные
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '23121474-dc8d36b74d53a13d4dcab8680';
let page = 1;
let searchValue = '';//поиск

//посылаем запрос на бекенд
const handlerSubmit = (e) => {
    e.preventDefault()
    
    //задаем поиск
    if (searchValue === refs.input.value) return;
    searchValue = refs.input.value;
  
        loadMoreBtn.show();
        loadMoreBtn.disable();

    fetch(`${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchValue}&page=${page}&per_page=12&key=${KEY}`)
    .then(response => response.json())
    .then(photo => {
       if (photo.hits.length === 0) {
           return error({
            text: 'Check your request.',
            delay: 1000,
          });
       } else {
           clearGallery();
           renderPhoto(photo.hits);
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
    })
  };

function renderPhoto(photo) {
    refs.gallery.insertAdjacentHTML('beforeend', photoCardsTpl(photo));
};

function clearGallery() {
    refs.gallery.innerHTML = '';
};

function clearContent() {
    refs.input.value ='';
};

function loadMore (e) { //добавляет елементы
    e.preventDefault();

        // loadMoreBtn.show();
        // loadMoreBtn.disable();

    fetch(`${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchValue}&page=${page}&per_page=12&key=${KEY}`)
    .then(response => response.json())
    .then(photo => {
       if (photo.hits.length === 0) {
           return error({
            text: 'Check your request.',
            delay: 1000,
          });
       } else {
            renderPhoto(photo.hits);
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
    })
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

loadMoreBtn.refs.button.addEventListener('click', loadMore);
refs.form.addEventListener('submit', handlerSubmit);
refs.loadMore.addEventListener('click', loadMore);


function scrollOnLoadMore() {
  refs.label.scrollIntoView({ block: 'end', behavior: 'smooth'});
}

