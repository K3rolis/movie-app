import { IMG_BASE_URL } from './config.js';

export function createMovieCards(movie, appendElement) {
  if (!movie.poster_path) {
    return;
  }

  const movieBoxEl = document.createElement('a');
  movieBoxEl.classList.add('movie-box');
  movieBoxEl.setAttribute('data-link', `${movie.id}`);
  movieBoxEl.setAttribute('href', './movie-details.html');

  const sliderItemEl = document.createElement('div');
  sliderItemEl.classList.add('slider-item');

  const sliderItemImgEl = document.createElement('img');

  sliderItemImgEl.setAttribute('src', `${IMG_BASE_URL}w300${movie.poster_path}`);
  sliderItemImgEl.setAttribute('alt', movie.title);

  sliderItemEl.appendChild(sliderItemImgEl);

  const movieContentEl = document.createElement('div');
  movieContentEl.classList.add('movie-content');

  const titleEl = document.createElement('div');
  titleEl.classList.add('title');
  titleEl.textContent = movie.title;

  const metaDataEl = document.createElement('div');
  metaDataEl.classList.add('meta-data');

  const ratingEl = document.createElement('span');
  ratingEl.classList.add('rating');
  ratingEl.textContent = movie.vote_average.toFixed(1);

  const starEl = document.createElement('i');
  starEl.classList.add('fa-solid', 'fa-star');

  const releasedDateEl = document.createElement('span');
  releasedDateEl.classList.add('released-date');

  if (movie.release_date === undefined) {
    releasedDateEl.textContent = 'Unkown';
  } else {
    releasedDateEl.textContent = movie.release_date.split('-')[0];
  }

  ratingEl.appendChild(starEl);
  metaDataEl.append(ratingEl, releasedDateEl);
  movieContentEl.append(titleEl, metaDataEl);
  movieBoxEl.append(sliderItemEl, movieContentEl);
  appendElement.append(movieBoxEl);
}

export function getMovieLink() {
  const movieItems = document.querySelectorAll('.movie-box');
  for (let item of movieItems) {
    item.addEventListener('click', () => {
      const movieId = item.getAttribute('data-link');
      localStorage.setItem('movieId', movieId);
    });
  }
}
