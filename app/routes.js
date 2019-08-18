
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

  if (PATH.match('year/')) {
    return viewYear();
  }

  if (PATH.match('about/')) {
    return viewAbout();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return viewCemeteriesOrNewspapers();
  }

  return pageNotFound();
}

function viewMain() {
  setPageTitle();
  h1(SITE_TITLE);

  h2('featured');
  rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

  DATABASE.sources.filter(s => s.tags.featured).forEach(source => {
    rend(
      '<p style="margin: 10px">' +
        linkToSource(source, source.group + ' - ' + source.title) +
      '</p>'
    );
  });

  [
    ['USA/MN/Pipestone%20County/Ruthton', 'Ruthton, Minnesota'],
  ].forEach(([path, name]) => rend($makeIconLink('places/' + path, name, 'images/map-icon.svg')));

  h2('photos');
  DATABASE.sources.filter(s => s.type == 'photo').forEach(source => {
    if (source.images.length) {
      rend(
        localLink('source/' + source._id, '<img src="' + source.images[0] +
        '" style="height: 100px; max-width: 300px; margin: 5px;" title="' +
        source.title + '">')
      );
    }
  });

  h2('topics');
  bulletList(['military', 'immigration', 'disease', 'brick walls'].map(topic => {
    return localLink('topic/' + topic.replace(/ /g, ''), topic);
  }));

  h2('browse');
  bulletList([localLink('year/1904', 'browse by year')]);
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
