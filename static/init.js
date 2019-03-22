
const ORIGIN = getOrigin();

$(document).ready(() => {
  createHeaderLinks();
});

function getOrigin() {
  let url = window.location.href;

  if (url.match('\\?')) {
    return url.slice(0, url.indexOf('\?'));
  }

  return url;
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '">Lundberg Ancestry</a>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '">Home</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?people">People</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?events">Events</a></li>');
  $('#main-navigation').append('<li><a href="' + ORIGIN + '?sources">Sources</a></li>');
}
