'use strict';

import { API_KEY, IMG_BASE_URL } from './config.js';
import { sidebar } from './sidebar.js';

const pageContent = document.querySelector('.main-content');
const searchContentEl = document.getElementById('search-value');

const genreName = window.localStorage.getItem('genreName');
const urlParam = window.localStorage.getItem('urlParam');

sidebar();

let totalPages = 0;

async function fetchMovieListByLanguageOrGenre(currentPage) {
  const api = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&include_adult=false&page=${currentPage}&${urlParam}`;

  try {
    const response = await fetch(api);
    const movieList = await response.json();
    return movieList;
  } catch (error) {}
}

async function getMovieListByLanguageOrGenre(currentPage) {
  await fetchMovieListByLanguageOrGenre(currentPage).then(({ results, total_pages }) => {
    totalPages = total_pages;
    results.map((movie) => {
      list(movie);
    });
  });
}

function getMovieDetails(movieItems) {
  for (let item of movieItems) {
    item.addEventListener('click', () => {
      const movieId = item.getAttribute('data-link');
      localStorage.setItem('movieId', movieId);
    });
  }
}

async function getMovieLists() {
  let currentPage = 1;
  await getMovieListByLanguageOrGenre(currentPage);

  document.title = `${genreName} Movies`;

  searchContentEl.textContent = `${genreName}`;

  let movieItems = document.querySelectorAll('.movie-box');

  getMovieDetails(movieItems);

  const loadBtn = document.getElementById('load-more');

  const searchEl = document.getElementById('search');

  loadBtn.addEventListener('click', async () => {
    if (!searchEl.value) {
      await getMovieListByLanguageOrGenre(currentPage + 1);

      if (currentPage + 1 >= totalPages && loadBtn) {
        loadBtn.remove();
      }

      let movieItems = document.querySelectorAll('.movie-box');
      getMovieDetails(movieItems);
      currentPage++;
    }
  });
}

function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const searchValue = urlParams.get('search');

  if (searchValue) {
    let currentPage = 1;
    const loadBtn = document.getElementById('load-more');
    setTimeout(function () {
      fetchSearch(searchValue, currentPage).then(({ results, total_pages }) => {
        if (currentPage >= total_pages && loadBtn) {
          loadBtn.remove();
        }

        if (results.length === 0) {
          searchContentEl.textContent = `${searchValue} (NOT FOUND)`;
        }

        document.querySelectorAll('.movie-box').forEach((item) => {
          item.remove();
        });
        totalPages = total_pages;
        results.map((movie) => {
          list(movie);
        });

        let movieItems = document.querySelectorAll('.movie-box');
        getMovieDetails(movieItems);
        currentPage++;
      });

      let movieItems = document.querySelectorAll('.movie-box');

      for (let item of movieItems) {
        item.addEventListener('click', () => {
          const movieId = item.getAttribute('data-link');
          localStorage.setItem('movieId', movieId);
        });
      }
    }, 500);
  }
}

const searchEl = document.getElementById('search');

searchEl.addEventListener('input', () => {
  let currentPage = 1;
  const loadBtn = document.getElementById('load-more');
  searchContentEl.textContent = `${searchEl.value}`;
  setTimeout(function () {
    fetchSearch(searchEl.value, currentPage).then(({ results, total_pages }) => {
      if (currentPage >= total_pages && loadBtn) {
        loadBtn.remove();
      }

      if (results.length === 0) {
        searchContentEl.textContent = `${searchEl.value} (NOT FOUND)`;
      }

      document.querySelectorAll('.movie-box').forEach((item) => {
        item.remove();
      });
      totalPages = total_pages;
      results.map((movie) => {
        list(movie);
      });

      let movieItems = document.querySelectorAll('.movie-box');
      getMovieDetails(movieItems);
      currentPage++;
    });

    let movieItems = document.querySelectorAll('.movie-box');

    for (let item of movieItems) {
      item.addEventListener('click', () => {
        const movieId = item.getAttribute('data-link');
        localStorage.setItem('movieId', movieId);
      });
    }
  }, 500);
});

async function loadEvent(searchValue, searchParam) {
  const loadBtn = document.getElementById('load-more');

  let currentPage = 1;

  let query;

  if (searchParam) {
    query = searchParam;
  } else if (searchValue) {
    query = searchValue;
  } else if (!searchValue && !searchParam) {
    return;
  }
  searchContentEl.textContent = `${query}`;

  // if (searchValue) {
  loadBtn.addEventListener('click', async () => {
    await fetchSearch(query, currentPage + 1).then(({ results, total_pages }) => {
      if (currentPage + 1 >= total_pages && loadBtn) {
        loadBtn.remove();
      }
      results.map((movie) => {
        list(movie);
      });
    });

    let movieItems = document.querySelectorAll('.movie-box');
    getMovieDetails(movieItems);
    currentPage++;
  });
  // }
}

async function fetchSearch(query, page) {
  const api = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&include_adult=false&language=en-US&page=${page}
  `;
  try {
    const response = await fetch(api);
    const movies = await response.json();
    return movies;
  } catch (error) {}
}

function list(movie) {
  const sliderItemsWrapperEl = document.querySelector('.movie-search-list-wrapper');

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
  sliderItemsWrapperEl.append(movieBoxEl);
}

loadEvent();
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchValues = urlParams.get('search');

if (searchValues) {
  search();
} else {
  getMovieLists();
}

loadEvent(searchEl.value, searchValues);
