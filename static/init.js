
const [ORIGIN, PATH] = getFilePaths();

$(document).ready(() => {
  processDatabase();
  createHeaderLinks();
  loadContent();
});

function getFilePaths() {
  let url = window.location.href;
  let path = '';

  if (url.match('\\?')) {
    path = url.slice(url.indexOf('\?') + 1);
    url = url.slice(0, url.indexOf('\?'));
  }

  return [url, path];
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '">Lundberg Ancestry</a>');
  const $list = $('#main-navigation ul');

  $list.append('<li><a href="' + ORIGIN + '">Home</a></li>');

  ['People', 'Events', 'Sources', 'Places'].forEach(nav => {
    $list.append('<li>' + localLink(nav.toLowerCase(), nav) + '</li>');
  });
}

Array.prototype.trueSort = function(callback) {
  this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};
