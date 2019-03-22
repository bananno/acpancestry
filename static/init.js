
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

function loadContent() {
  if (PATH == '') {
    setPageTitle();
    $('#page-content').append('<h1>Lundberg Ancestry</h1>');
    return;
  }

  if (PATH == 'people') {
    setPageTitle('People');
    $('#page-content').append('<h1>All People</h1>');

    const $list = $('<ul class="people-list">').appendTo('#page-content');

    DATABASE.people.forEach(person => {
      $list.append($('<li>').append(linkToPerson(person)));
    });

    return;
  }

  if (PATH.match('person/')) {
    viewPerson();
    return;
  }

  if (PATH == 'events') {
    setPageTitle('Events');
    $('#page-content').append('<h1>All Events</h1>');
    return;
  }

  if (PATH == 'sources') {
    setPageTitle('Sources');
    $('#page-content').append('<h1>All Sources</h1>');
    return;
  }
}
