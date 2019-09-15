
const [ORIGIN, PATH, ENV] = getFilePaths();

$(document).ready(() => {
  setupLayout();
  setPageTitle();
  processDatabase();
  loadContent();
  runTests();
});

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
