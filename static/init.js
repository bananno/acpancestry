
const [ORIGIN, PATH] = getFilePaths();

$(document).ready(() => {
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
  $('#main-navigation').append('<li><a href="' + ORIGIN + '">Home</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?people">People</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?events">Events</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?sources">Sources</a></li>');
}
