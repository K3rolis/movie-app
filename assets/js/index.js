'use strict';

import { sidebar } from './sidebar.js';
import { API_KEY, IMG_BASE_URL } from './config.js';
import { api_key, imageBaseURL } from './api.js';
import { createMovieCards, getMovieLink } from './movie-card.js';

// import { createMovieCard } from './movie-card.js';

init();

const pageContent = document.getElementById('main-content');
const bannerEl = pageContent.querySelector('.banner-content');
const heroSliderItems = pageContent.querySelector('#banner-cards-wrapper');

async function fetchGenres() {
  const api = `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}`;
  try {
    const response = await fetch(api);
    const genres = await response.json();
    return genres;
  } catch (error) {
    // console.log(error);
  }
}

async function fetchMovieLists() {
  const urls = [
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&page=1`,
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}&page=1`,
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${api_key}&page=1`,
  ];

  try {
    const [upcoming, trending, topRated] = await Promise.all(urls.map((url) => fetch(url).then((resp) => resp.json())));

    return [
      {
        title: 'Upcoming Movies',
        data: upcoming,
      },
      {
        title: 'Weekly Trending Movies',
        data: trending,
      },
      {
        title: 'Top Rated Movies',
        data: topRated,
      },
    ];
  } catch (err) {
    console.log('oops', err);
  }
}

console.log(fetchMovieLists());

async function displayMovieLists() {
  const pageContent = document.getElementById('main-content');

  await fetchMovieLists().then((item) => {
    for (let { title, data } of item) {
      const sliderListEl = document.createElement('div');
      sliderListEl.classList.add('slider-list');

      const sliderTitleEl = document.createElement('span');
      sliderTitleEl.classList.add('slider-title');
      sliderTitleEl.textContent = title;

      const sliderItemsWrapperEl = document.createElement('div');
      sliderItemsWrapperEl.classList.add('slider-items-wrapper');

      pageContent.appendChild(sliderListEl);
      sliderListEl.append(sliderTitleEl, sliderItemsWrapperEl);

      data.results.map((movie) => {
        createMovieCards(movie, sliderItemsWrapperEl);
      });
    }
    getMovieLink();
  });
}

const genresList = {
  convertToString(genreIdList) {
    let stringifiedGenreList = [];
    for (const genreId of genreIdList) {
      if (this[genreId]) {
        stringifiedGenreList.push(this[genreId]);
      }
    }
    return stringifiedGenreList.join(', ');
  },
};

async function getGenres() {
  await fetchGenres().then(({ genres }) => {
    for (const { id, name } of genres) {
      genresList[id] = name;
    }
  });
  return genresList;
}

async function fetchMovies() {
  const api = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`;
  try {
    const response = await fetch(api);
    const movies = await response.json();
    return movies;
  } catch (error) {}
}

async function createHeroBannerElements() {
  // Movie Content
  const pageContent = document.getElementById('main-content');
  const bannerEl = pageContent.querySelector('.banner-content');

  const bannerItem = document.createElement('div');
  bannerItem.classList.add('banner-item');

  const heroBannerEl = document.createElement('img');
  heroBannerEl.classList.add('hero-banner');
  bannerEl.append(heroBannerEl);

  const titleEl = document.createElement('div');
  titleEl.classList.add('title');

  const metaDataEl = document.createElement('div');
  metaDataEl.classList.add('meta-data');

  const releaseDateEl = document.createElement('span');
  releaseDateEl.classList.add('release-date');

  const ratingEl = document.createElement('span');
  ratingEl.classList.add('rating');

  const genreEl = document.createElement('div');
  genreEl.classList.add('genre');

  const descriptionEl = document.createElement('div');
  descriptionEl.classList.add('description');

  const trailerButtonEl = document.createElement('a');
  trailerButtonEl.classList.add('trailer-button');
  trailerButtonEl.setAttribute('href', '#');

  const trailerTextEl = document.createElement('span');
  trailerTextEl.textContent = 'Watch Trailer';

  const trailerIconEl = document.createElement('i');
  trailerIconEl.classList.add('fa-solid', 'fa-play');

  trailerButtonEl.append(trailerTextEl, trailerIconEl);
  metaDataEl.append(releaseDateEl, ratingEl);
  bannerEl.appendChild(bannerItem);
  bannerItem.append(titleEl, metaDataEl, genreEl, descriptionEl, trailerButtonEl);

  // Slider

  const bannerSlider = document.createElement('div');
  bannerSlider.classList.add('banner-slider');
  bannerSlider.setAttribute('id', 'banner-cards-wrapper');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('cards-wrapper');

  bannerEl.appendChild(bannerSlider);
  bannerSlider.appendChild(cardsWrapper);
}

function displayHeroContent(data, movieIndex) {
  const titleEl = bannerEl.querySelector('.title');
  const releaseDateEl = bannerEl.querySelector('.release-date');
  const ratingEl = bannerEl.querySelector('.rating');
  const genreEl = bannerEl.querySelector('.genre');
  const description = bannerEl.querySelector('.description');
  const heroBannerEl = pageContent.querySelector('img');

  if (!data[movieIndex]) movieIndex = 0;
  heroBannerEl.setAttribute('src', `${imageBaseURL}w1280${data[movieIndex].backdrop_path}`);
  heroBannerEl.setAttribute('alt', `${data[movieIndex].title}`);
  // heroBannerEl.setAttribute('loading', `${index === movieIndex ? 'eager' : 'lazy'}`);

  titleEl.textContent = data[movieIndex].title;
  releaseDateEl.textContent = data[movieIndex].release_date;
  ratingEl.textContent = data[movieIndex].vote_average;
  genreEl.textContent = genresList.convertToString(data[movieIndex].genre_ids);
  description.textContent = data[movieIndex].overview;
}

function displaySlider(data, index) {
  const cardsWrapper = bannerEl.querySelector('.cards-wrapper');
  const sliderItem = document.createElement('div');
  sliderItem.classList.add('card');
  sliderItem.setAttribute('data-slider-item', `${index}`);

  const sliderItemImg = document.createElement('img');
  sliderItemImg.setAttribute('src', `${imageBaseURL}w154${data.poster_path}`);

  sliderItem.appendChild(sliderItemImg);
  cardsWrapper.appendChild(sliderItem);
}

async function displayMovieAndSlider() {
  const bannerEl = pageContent.querySelector('.banner-content');
  const cardsWrapper = bannerEl.querySelector('.cards-wrapper');
  cardsWrapper.setAttribute('id', 'cards-wrapper');

  let controlMovieIndex = 0;
  await fetchMovies().then(({ results }) => {
    results.map((result, index) => {
      displaySlider(result, index);
    });

    const sliderItems = document.getElementById('cards-wrapper');
    const allCards = cardsWrapper.querySelectorAll('.card');

    let lastSliderItem = allCards[0];
    lastSliderItem.classList.add('active');

    for (let item of allCards) {
      item.addEventListener('click', () => {
        allCards.forEach((item) => item.classList.remove('active'));

        item.classList.add('active');

        controlMovieIndex = item.getAttribute('data-slider-item');
        if (!controlMovieIndex || controlMovieIndex === null) {
          controlMovieIndex = 0;
          lastSliderItem.classList.add('active');
        }
        displayHeroContent(results, controlMovieIndex);
      });
    }

    displayHeroContent(results, controlMovieIndex);
  });
}

async function init() {
  sidebar();
  await createHeroBannerElements();
  getGenres();
  displayMovieLists();
  displayMovieAndSlider();
}

// Event Listeners

heroSliderItems.addEventListener('wheel', (e) => {
  e.preventDefault();
  heroSliderItems.scrollLeft += e.deltaY;
});
