function PATHS() {
  return [
    ['', ViewHome],
    ['year/:year', ViewYear],

    // people
    ['people', ViewPeople],
    ['person/:personId', ViewPerson],
    ['person/:personId/source/:sourceId', ViewPerson],
    ['person/:personId/test', ViewPerson],

    // documents
    ['sources', ViewSourcesIndex],
    ['sources/all', ViewSourcesAll],
    ['sources/censusUSA', ViewSourcesCensusUSA],
    ['sources/censusState', ViewSourcesCensusState],
    ['sources/censusOther', ViewSourcesCensusOther],
    ['sources/draft', ViewSourcesDraft],
    ['sources/indexOnly', ViewSourcesIndexOnly],
    ['sources/other', ViewSourcesOther],

    // source/story/etc. categories
    ['artifacts', ViewStoryIndexArtifacts],
    ['books', ViewStoryIndexBooks],
    ['cemeteries', ViewStoryIndexCemeteries],
    ['landmarks', ViewStoryIndexLandmarks],
    ['newspapers', ViewStoryIndexNewspapers],
    ['events', ViewEvents],
    ['photos', ViewPhotos],

    // source/story records
    ['artifact/:storyId', ViewStoryArtifactOrLandmark],
    ['book/:storyId', ViewStoryBook],
    ['cemetery/:storyId', ViewCemeteryOrNewspaper],
    ['event/:storyId', ViewStoryEvent],
    ['image/:imageId', ViewImage],
    ['landmark/:storyId', ViewStoryArtifactOrLandmark],
    ['newspaper/:storyId', ViewCemeteryOrNewspaper],
    ['topic/:storyId', ViewStoryTopic],

    // places
    ['places', ViewPlace],
    ['places/all', ViewPlace],
    ['places/:country', ViewPlace],
    ['places/:country/:region1', ViewPlace],
    ['places/:country/:region1/:region2', ViewPlace],
    ['places/:country/:region1/:region2/:city', ViewPlace],

    ['about', ViewAbout],
    ['about/person-profile', ViewAboutPersonProfile],

    ['audit', ViewAudit],
    ['audit/age-at-death', ViewAuditAgeAtDeath],
    ['audit/census/:year', ViewAuditCensus],
    ['audit/children', ViewAuditChildren],
    ['audit/immigration', ViewAuditImmigration],
  ].map(([path, pageClass]) => {
    return {
      load: pageClass.load || pageClass.byUrl,
      path,
      pathParts: path.split('/'),
      exact: !path.match(':')
    };
  });
}

function loadContent() {
  if (PATH.slice(0, 6) === 'search') {
    return SearchResults.byUrl();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  const route = findRoute();

  if (route) {
    return route.load(route.params) || pageNotFound();
  }

  pageNotFound();
}

function findRoute() {
  const exactPath = PATHS().find(route => {
    return route.exact && route.path === PATH;
  });

  if (exactPath) {
    console.log('Found exact route.');
    return exactPath;
  }

  const parts = PATH.split('/');

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

  if (dynamicPath.length === 0) {
    console.error('Route not found.');
    return false;
  }

  if (dynamicPath.length > 1) {
    console.error('Found multiple matching routes.');
  }

  console.log('Found dynamic route.');
  return dynamicPath[0];
}

function viewTests() {
  setPageTitle('Tests');
  h1('Tests');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  h1('Page Not Found');
}
