
function loadContent() {
  if (PATH == '') {
    return viewMain();
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH.match('person/')) {
    return ViewPerson.byUrl();
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

  if (PATH.match('artifact') || PATH.match('landmark')) {
    return ViewStoryIndex.byUrl() || ViewStoryArtifactOrLandmark.byUrl();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return viewCemeteriesOrNewspapers();
  }

  if (PATH.match('book')) {
    return viewBook();
  }

  return pageNotFound();
}

function viewMain() {
  setPageTitle();
  h1(SITE_TITLE);

  h2('featured');
  rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

  [
    ['USA/MN/Pipestone%20County/Ruthton', 'Ruthton, Minnesota'],
  ].forEach(([path, name]) => rend($makeIconLink('places/' + path, name, 'images/map-icon.svg')));

  DATABASE.stories.filter(s => s.tags.featured).forEach(story => {
    let path, icon;
    if (story.type == 'cemetery') {
      path = story.type + '/' + story._id;
      image = 'images/map-icon.svg';
    } else if (story.type == 'newspaper') {
      path = story.type + '/' + story._id;
      image = 'images/newspaper-icon.jpg';
    } else {
      return;
    }
    rend($makeIconLink(path, story.title, image));
  });

  DATABASE.sources.filter(s => s.tags.featured).forEach(source => {
    rend(
      '<p style="margin: 10px">' +
        linkToSource(source, source.story.title + ' - ' + source.title) +
      '</p>'
    );
  });

  h2('photos');
  DATABASE.sources.filter(s => s.story.title == 'Photo').forEach(source => {
    if (source.images.length) {
      rend(
        localLink('source/' + source._id, '<img src="' + source.images[0] +
        '" style="height: 100px; max-width: 300px; margin: 5px;" title="' +
        source.title + '">')
      );
    }
  });

  h2('topics');
  bulletList([
    ['landmarks', 'landmarks and buildings'],
    ['artifacts', 'artifacts and family heirlooms'],
    ['topic/brickwalls', 'brick walls and mysteries'],
    ['topic/military', 'military'],
    ['topic/immigration', 'immigration'],
    ['topic/disease', 'disease'],
  ].map(([path, text]) => localLink(path, text)));

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
