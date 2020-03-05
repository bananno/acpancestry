function PATHS() {
  return [
    ['', ViewHome],
    ['image/:id', ViewImage],
    ['person/:personId', ViewPerson],
    ['person/:personId/source/:sourceId', ViewPerson],
    ['person/:personId/test', ViewPerson],
    ['photos', ViewPhotos],
    ['topic/:id', ViewStoryTopic],
  ].map(([path, className]) => {
    return {
      className,
      path,
      pathParts: path.split('/'),
      exact: !path.match(':')
    };
  });
}

function loadContent() {
  const exactPath = PATHS().find(route => {
    return route.exact && route.path === PATH;
  });

  const parts = PATH.split('/');

  if (exactPath) {
    console.log('Found exact route.');
    return exactPath.className.byUrl();
  }

  const dynamicPath = PATHS().filter(route => {
    return !route.exact && parts.length == route.pathParts.length;
  }).map(route => {
    route.params = {};
    for (let index = 0; index < route.pathParts.length; index++) {
      const pathPart = route.pathParts[index];
      if (pathPart[0] === ':') {
        route.params[pathPart.slice(1)] = parts[index];
        continue;
      }
      if (pathPart !== parts[index]) {
        return false;
      }
    }
    return route;
  }).filter(Boolean);

  if (dynamicPath.length > 1) {
    console.error('Found multiple matching routes.');
  }

  if (dynamicPath.length === 1) {
    console.log('Found dynamic route.');
    return dynamicPath[0].className.byUrl(dynamicPath[0].params) || pageNotFound();
  }

  if (dynamicPath.length === 0) {
    console.log('Route not found.');
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH == 'events') {
    return viewEvents();
  }

  if (PATH.length > 5 && PATH.slice(0, 6) == 'source') {
    return routeSources();
  }

  if (PATH.match('search')) {
    return SearchResults.byUrl();
  }

  if (PATH.match('place')) {
    return ViewPlace.byUrl() || pageNotFound();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  if (PATH.match('audit') && ENV == 'dev') {
    return ViewAudit.byUrl() || pageNotFound();
  }

  if (PATH.match('year/')) {
    return viewYear();
  }

  if (PATH.match('about/')) {
    return viewAbout();
  }

  if (PATH.match('artifact') || PATH.match('landmark')) {
    return ViewStoryIndex.byUrl() || ViewStoryArtifactOrLandmark.byUrl()
      || pageNotFound();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return ViewStoryIndex.byUrl() || ViewCemeteryOrNewspaper.byUrl()
      || pageNotFound();
  }

  if (PATH.match('book')) {
    return ViewStoryIndex.byUrl() || ViewStoryBook.byUrl()
      || pageNotFound();
  }

  if (PATH.match('event')) {
    return ViewStoryEvent.byUrl() || pageNotFound();
  }

  return pageNotFound();
}

function viewTests() {
  setPageTitle('Tests');
  rend('<h1>Tests</h1>');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  rend('<h1>Page Not Found</h1>');
}
