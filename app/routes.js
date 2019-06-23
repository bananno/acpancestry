
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

  if (PATH.length > 5 && PATH.slice(0, 6) == 'source') {
    return routeSources();
  }

  if (PATH.match('search')) {
    return viewSearch();
  }

  if (PATH.match('place')) {
    return viewPlaces();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  if (PATH.match('image/')) {
    return viewImage();
  }

  if (PATH.match('topic/')) {
    return viewTopic();
  }

  return pageNotFound();
}

function viewMain() {
  setPageTitle();
  rend('<h1>' + SITE_TITLE + '</h1>');
  rend('<h2>featured</h2>');
  rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));
  rend('<h2>topics</h2>');
  rend(`
    <ul class="bullet">
    ${['military', 'immigration', 'disease'].map(topic => {
      return '<li>' + localLink('topic/' + topic, topic) + '</li>';
    }).join('')}
    </ul>
  `);
}

function viewPeople() {
  setPageTitle('People');
  rend('<h1>All People</h1>');
  rend($makePeopleList(DATABASE.people, 'photo'));
}

function viewTests() {
  setPageTitle('Tests');
  rend('<h1>Tests</h1>');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  rend('<h1>Page Not Found</h1>');
}
