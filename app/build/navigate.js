let ORIGIN, PATH, ENV;

function clickLocalLink(event) {
  if (event.metaKey) {
    return;
  }

  event.preventDefault();

  const clickedPath = $(event.target).attr('href');

  history.pushState({}, null, clickedPath);

  clearPage();
  getRoute();
}

function getRoute() {
  [ORIGIN, PATH, ENV] = getFilePaths();
  loadContent();
}

function getFilePaths() {
  let url = window.location.href;
  let path = '';
  let env;

  if (url.match('\\?')) {
    path = url.slice(url.indexOf('\?') + 1);
    url = url.slice(0, url.indexOf('\?'));
  }

  if (url.match('localhost')) {
    env = 'dev';
  }

  return [url, path, env];
}

