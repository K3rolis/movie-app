'use strict';

import { API_KEY } from './config.js';
const sidebarEl = document.getElementById('sidebar');

export function sidebar() {
  const genreList = {};

  async function fetchGenres() {
    const api = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;

    try {
      const response = await fetch(api);
      const genres = await response.json();
      return genres;
    } catch (error) {}
  }

  fetchGenres().then(({ genres }) => {
    for (const { id, name } of genres) {
      genreList[id] = name;
    }
    genreLink();
  });

  function genreLink() {
    for (const [genreId, genreName] of Object.entries(genreList)) {
      const link = document.createElement('a');
      link.classList.add('sidebar-link');
      link.setAttribute('href', './movie-list.html');
      link.setAttribute('menu-close', '');
      link.setAttribute('data-genre', genreName);
      link.setAttribute('onclick', `getMovieList("with_genres=${genreId}", "${genreName}")`);
      link.textContent = genreName;
      sidebarEl.querySelectorAll('.sidebar-list')[0].appendChild(link);
    }
  }
}
