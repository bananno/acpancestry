const ORIGIN = window.location.origin;
const ENV = !!ORIGIN.match('localhost') ? 'dev' : '';
const USE_SINGLE_PAGE = true;

let PATH;
window.onpopstate = getRoute;

function clickLocalLink(event) {
  if (!USE_SINGLE_PAGE || event.metaKey) {
    return;
  }

  event.preventDefault();

  const clickedPath = $(event.target).closest('a').attr('href');

  history.pushState({}, null, clickedPath);

  getRoute();

  window.scrollTo(0, 0);
}

function getRoute() {
  PATH = getCurrentPath();
  clearPage();
  loadContent();
}

function getCurrentPath() {
  let path = window.location.pathname + window.location.search;

  if (path.match('\\?')) {
    path = path.slice(path.indexOf('\?') + 1);
  }

  if (path.charAt(0) == '/') {
    path = path.slice(1);
  }

  return path;
}

