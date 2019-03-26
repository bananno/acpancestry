
function loadContent() {
  if (PATH == '') {
    return viewMain();
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH.match('person/')) {
    return viewPerson();
  }

  if (PATH == 'events') {
    return viewEvents();
  }

  if (PATH == 'sources') {
    return viewSources();
  }

  if (PATH.match('search')) {
    return viewSearch();
  }
}

function viewMain() {
  setPageTitle();
  $('#page-content').append('<h1>Lundberg Ancestry</h1>');
}

function viewPeople() {
  setPageTitle('People');

  $('#page-content').append('<h1>All People</h1>');

  $makePeopleList(DATABASE.people).appendTo('#page-content');
}
