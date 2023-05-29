const getMovieList = function (urlParam, name) {
  console.log(urlParam, name);
  window.localStorage.setItem('urlParam', urlParam);
  window.localStorage.setItem('genreName', name);
};
