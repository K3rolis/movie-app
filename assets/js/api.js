'use strict';

const api_key = '41abe0d227ea4a72d905172b74d77a30';
const imageBaseURL = 'https://image.tmdb.org/t/p/';

function fetchDataFromServer(url, callback) {
  fetch(url)
    .then((respone) => respone.json())
    .then((data) => callback(data));
}

export { imageBaseURL, api_key, fetchDataFromServer };
