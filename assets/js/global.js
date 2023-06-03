const getSearchBtn = document.querySelector('.search-btn');
const searchEl = document.getElementById('search');
const searchWrapperEl = document.querySelector('.search-wrapper');
const header = document.querySelector('.header');
const hamburgerEl = document.querySelector('.hamburger');
const sidebarEl = document.querySelector('#sidebar');
const searchBtn = document.querySelector('.search-btn');

hamburgerEl.addEventListener('click', () => {
  const hamburgerBars = hamburgerEl.querySelectorAll('.bar');

  if (hamburgerBars[0].getAttribute('style')) {
    hamburgerBars.forEach((item) => item.removeAttribute('style'));
    sidebarEl.removeAttribute('style');
    sidebarEl.classList.remove('active-sidebar');
  } else {
    hamburgerBars[0].style.transform = 'translateY(6px) rotate(45deg)';
    hamburgerBars[1].style.opacity = '0';
    hamburgerBars[2].style.transform = 'translateY(-6px) rotate(-45deg)';

    sidebarEl.style.display = 'block';
    sidebarEl.classList.add('active-sidebar');
  }
});

const getMovieList = function (urlParam, name) {
  console.log(urlParam, name);
  window.localStorage.setItem('urlParam', urlParam);
  window.localStorage.setItem('genreName', name);
};

getSearchBtn.addEventListener('click', () => {
  searchWrapperEl.style.display = 'block';
  searchEl.focus();
  console.log(searchWrapperEl);
});

// window.addEventListener('resize', () => {
//   if (header.offsetWidth >= 484) {
//     searchWrapperEl.style.display = 'block';
//   } else {
//     searchWrapperEl.removeAttribute('style');
//   }
// });

searchEl.addEventListener('focus', () => {
  const searchWrapperEl = document.querySelector('.search-wrapper');

  searchBtn.style.display = 'none';

  console.log(typeof searchWrapperEl.offsetWidth);
  if (searchWrapperEl.offsetWidth <= 234) {
    searchWrapperEl.classList.add('active');
  }
});

searchEl.addEventListener('blur', () => {
  const searchWrapperEl = document.querySelector('.search-wrapper');
  searchWrapperEl.classList.remove('active');
  searchBtn.removeAttribute('style');

  if (searchWrapperEl.offsetWidth <= 234) {
    searchWrapperEl.removeAttribute('style');
  }
});
