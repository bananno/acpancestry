
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

Array.prototype.trueSort = function(callback) {
  this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};

Array.prototype.sortBy = function(callback) {
  this.sort((a, b) => {
    return callback(a) < callback(b) ? -1 : 0;
  });
};
