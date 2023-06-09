'use strict';

import { API_KEY, IMG_BASE_URL } from './config.js';
import { sidebar } from './sidebar.js';
import { createMovieCards, getMovieLink } from './movie-card.js';

const pageContent = document.getElementById('main-content');

const movieId = window.localStorage.getItem('movieId');

init();

const getGenres = function (genreList) {
  const newGenreList = [];

  for (const { name } of genreList) {
    newGenreList.push(name);
  }
  return newGenreList.join(', ');
};

const getActors = function (castList) {
  const newCastList = [];

  for (let i = 0; i < castList.length && i < 15; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }

  return newCastList.join(', ');
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === 'Director');

  let directorText;

  directors.length > 1 ? (directorText = 'Directors') : (directorText = 'Director');

  const directorList = [];
  for (const { name } of directors) {
    directorList.push(name);
  }

  return [directorText, directorList.join(', ')];
};

const filterVideos = function (videoList) {
  return videoList.filter(({ type, site }) => type === 'Trailer' && site === 'YouTube');
};

async function createDetailElements() {
  await fetchMovieDetails().then((movie) => {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      genres,
      overview,
      casts: { cast, crew },
      videos: { results: videos },
    } = movie;

    const detailsEl = document.createElement('div');
    detailsEl.classList.add('movie-details');
    detailsEl.setAttribute('id', 'movie-details');

    const detailsWrapperEl = document.createElement('div');
    detailsWrapperEl.classList.add('movie-details-wrapper');

    const detailsBackgroundEl = document.createElement('img');
    detailsBackgroundEl.classList.add('movie-details-background');
    detailsBackgroundEl.setAttribute('src', `${IMG_BASE_URL}original${backdrop_path}`);

    detailsEl.appendChild(detailsWrapperEl);

    const detailsSidebarEl = document.createElement('div');
    detailsSidebarEl.classList.add('movie-details-sidebar');

    const sliderItemEl = document.createElement('div');
    sliderItemEl.classList.add('slider-item');

    const sliderImgEl = document.createElement('img');
    sliderImgEl.setAttribute('src', `${IMG_BASE_URL}w342${poster_path}`);
    sliderImgEl.setAttribute('alt', `${title} poster`);

    sliderItemEl.appendChild(sliderImgEl);

    const detailsContentEl = document.createElement('div');
    detailsContentEl.classList.add('movie-details-content');

    const titleEl = document.createElement('div');
    titleEl.classList.add('title');
    titleEl.textContent = title;

    const metaDataEl = document.createElement('div');
    metaDataEl.classList.add('meta-data');

    const ratingEl = document.createElement('div');

    const ratingTextEl = document.createElement('span');
    const ratingStarEl = document.createElement('i');
    ratingStarEl.classList.add('fa-solid', 'fa-star');

    ratingTextEl.textContent = vote_average.toFixed(1);
    ratingEl.append(ratingStarEl, ratingTextEl);

    const durationEl = document.createElement('span');

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;

    durationEl.textContent = `${hours}h ${minutes} min.`;
    const releasedDateEl = document.createElement('span');
    releasedDateEl.textContent = release_date;

    const genreEl = document.createElement('p');
    genreEl.classList.add('genre');
    genreEl.textContent = getGenres(genres);

    const decorationEl = document.createElement('div');
    decorationEl.classList.add('text-decoration', 'border-bottom');

    const decorationSpanEl = document.createElement('span');
    decorationSpanEl.textContent = 'The Story';

    decorationEl.appendChild(decorationSpanEl);

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('description');
    descriptionEl.textContent = overview;

    const decorationEl2 = document.createElement('div');
    decorationEl2.classList.add('text-decoration');

    const decorationSpanEl2 = document.createElement('span');
    decorationSpanEl2.textContent = 'Stars & Directors';

    decorationEl2.appendChild(decorationSpanEl2);

    const listItemsEl = document.createElement('div');
    listItemsEl.classList.add('list-items');

    const listGroupEl = document.createElement('div');
    listGroupEl.classList.add('list-group');

    const listTitleEl = document.createElement('div');
    listTitleEl.classList.add('list-title');
    listTitleEl.textContent = 'Stars';

    const listContentEl = document.createElement('p');
    listContentEl.classList.add('list-content');
    listContentEl.textContent = getActors(cast);

    listGroupEl.append(listTitleEl, listContentEl);
    listItemsEl.appendChild(listGroupEl);

    const listGroupEl2 = document.createElement('div');
    listGroupEl2.classList.add('list-group');

    const listTitleEl2 = document.createElement('div');
    listTitleEl2.classList.add('list-title');

    listTitleEl2.textContent = getDirectors(crew)[0];

    const listContentEl2 = document.createElement('p');
    listContentEl2.classList.add('list-content');
    listContentEl2.textContent = getDirectors(crew)[1];

    listGroupEl2.append(listTitleEl2, listContentEl2);

    const trailerListEl = document.createElement('div');
    trailerListEl.classList.add('trailer-list');

    const trailerListTitleEl = document.createElement('span');
    trailerListTitleEl.classList.add('title');
    trailerListTitleEl.textContent = 'Trailers ';

    const trailerItemsWrapperEl = document.createElement('div');
    trailerItemsWrapperEl.classList.add('trailer-items-wrapper');

    for (const { key, name } of filterVideos(videos)) {
      const trailerItemEl = document.createElement('div');
      trailerItemEl.classList.add('trailer-item');

      const trailerVideoEl = document.createElement('iframe');
      trailerVideoEl.setAttribute('src', `https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0`);
      trailerVideoEl.setAttribute('frameborder', 0);
      trailerVideoEl.setAttribute('allowfullscreen', 1);
      trailerVideoEl.setAttribute('title', title);

      if (filterVideos(videos).length > 1) {
        trailerItemEl.style.width = '350px';
      }

      trailerItemEl.appendChild(trailerVideoEl);
      trailerItemsWrapperEl.appendChild(trailerItemEl);
    }

    trailerListEl.append(trailerListTitleEl, trailerItemsWrapperEl);

    pageContent.append(detailsEl);
    listItemsEl.append(listGroupEl, listGroupEl2);
    detailsWrapperEl.append(detailsBackgroundEl, detailsSidebarEl, detailsContentEl);
    detailsSidebarEl.appendChild(sliderItemEl);
    metaDataEl.append(ratingEl, durationEl, releasedDateEl);
    detailsContentEl.append(titleEl, metaDataEl, genreEl, decorationEl, descriptionEl, decorationEl2, listItemsEl, trailerListEl);

    // YOU ALSO

    const sliderListEl = document.createElement('div');
    sliderListEl.classList.add('slider-list');

    const sliderTitleEl = document.createElement('span');
    sliderTitleEl.classList.add('slider-title');
    sliderTitleEl.textContent = 'You May Also Like';

    const sliderItemsWrapperEl = document.createElement('div');
    sliderItemsWrapperEl.classList.add('slider-items-wrapper');
    sliderItemsWrapperEl.setAttribute('id', 'recommendation-movies');

    pageContent.appendChild(sliderListEl);
    sliderListEl.append(sliderTitleEl, sliderItemsWrapperEl);
  });
}

async function getRecommendationMovies() {
  const sliderItemsWrapperEl = document.getElementById('recommendation-movies');
  await fetchRecommendationMovies().then(({ results }) =>
    results.map((movie) => {
      createMovieCards(movie, sliderItemsWrapperEl);
    })
  );
}

async function fetchMovieDetails() {
  const api = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=casts,videos,images,releases`;
  try {
    const response = await fetch(api);
    const movieDetails = await response.json();
    return movieDetails;
  } catch (error) {}
}

async function fetchRecommendationMovies() {
  const api = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`;

  try {
    const response = await fetch(api);
    const recommendations = await response.json();
    return recommendations;
  } catch (error) {}
}

async function init() {
  sidebar();
  await createDetailElements();
  await getRecommendationMovies();
  getMovieLink();
  scrollableSlider();
}

function scrollableSlider() {
  const sliderItem = document.querySelector('.slider-items-wrapper');

  sliderItem.addEventListener('wheel', (e) => {
    e.preventDefault();
    sliderItem.scrollLeft += e.deltaY;
  });
}
