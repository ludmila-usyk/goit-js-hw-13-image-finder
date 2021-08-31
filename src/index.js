import './sass/main.scss';
import refs from './refs.js';
import photoCardsTpl from './template.hbs';
import { error, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

//переменные
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '23121474-dc8d36b74d53a13d4dcab8680';
let page = 1;
let searchValue = '';//поиск


// //посылаем запрос на бекенд
// const handlerSubmit = (e) => {
//   e.preventDefault()
  
//   //задаем поиск
//   if (searchValue === refs.input.value) return;
//   searchValue = refs.input.value;

//   fetch(`${BASE_URL}?image_type=photo&orientation=horizontal&q=${searchValue}&page=${page}&per_page=12&key=${KEY}`)
//   .then(response => response.json())
//   .then(photo => renderPhoto(photo.hits))
//   .catch(err => console.log(err))
// }

//посылаем запрос на бекенд
const handlerSubmit = (e) => {
    e.preventDefault()
    
    //задаем поиск
    if (searchValue === refs.input.value) return;
    searchValue = refs.input.value;
  
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
       }
    })
    .then(() => page++)
    .then(clearContent)
    .catch(err => {
        defaultModules.set(PNotifyMobile, {});
        clearGallery();
        // error({
        //     text: 'Nothing found',
        //     delay: 1000,
        // });
    })
  };

refs.form.addEventListener('submit', handlerSubmit);
refs.loadMore.addEventListener('click', loadMore);

// function createGallery (arr) {
//   for(let obj of arr) {
//     createImg(obj)
//   }
// }

// function createImg(obj) {
//   const img = document.createElement('img')
//   img.src = obj.webformatURL;
//   refs.gallery.appendChild(img)
// };

function renderPhoto(photo) {
    refs.gallery.insertAdjacentHTML('beforeend', photoCardsTpl(photo));
  }

function clearGallery() {
    refs.gallery.innerHTML = '';
};

function clearContent() {
    refs.input.value ='';
};

function loadMore (e) { //добавляет елементы
    e.preventDefault();
    
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
       }
    })
    .then(() => page++)
    // .then(clearContent)
    .catch(err => {
        defaultModules.set(PNotifyMobile, {});
        clearGallery();
        error({
            text: 'Nothing found',
            delay: 1000,
        });
    })
};