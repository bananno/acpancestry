
const sourceCategories = [
  {
    path: 'all',
    title: 'All Sources',
    pathText: 'View All',
    route: viewSourcesAll,
  },
  {
    path: 'photos',
    title: 'Photographs',
    route: viewListOfPhotographs,
  },
  {
    fullPath: 'newspapers',
    title: 'Newspapers',
  },
  {
    fullPath: 'cemeteries',
    title: 'Cemeteries',
  },
  {
    fullPath: 'books',
    title: 'Books',
  },
  {
    path: 'censusUSA',
    title: 'US Federal Census',
    route: viewSourcesCensusUSA,
  },
  {
    path: 'censusState',
    title: 'US State Census',
    route: viewSourcesCensusState,
  },
  {
    path: 'censusOther',
    title: 'Other Census',
    route: viewSourcesCensusOther,
  },
  {
    path: 'draft',
    title: 'Military Draft Registration',
    route: viewSourcesDraft,
  },
  {
    path: 'indexOnly',
    title: 'Index-only Records',
    route: viewSourcesIndexOnly,
  },
  {
    path: 'other',
    title: 'Other Sources',
    route: viewSourcesOther,
  },
];

function routeSources() {
  if (PATH == 'sources') {
    return viewSourcesIndex();
  }

  if (PATH.match('source/')) {
    return ViewOneSource.byUrl();
  }

  const categoryPath = PATH.slice(8);

  const category = sourceCategories.filter(category => {
    return category.path === categoryPath;
  })[0];

  if (category === undefined) {
    return pageNotFound();
  }

  setPageTitle(category.title);
  headerTrail('sources');
  rend('<h1>' + category.title + '</h1>');

  if (category.route) {
    return category.route();
  }
}

function viewSourcesIndex() {
  setPageTitle('Sources');
  rend('<h1>Sources</h1>');

  sourceCategories.forEach(category => {
    const path = category.fullPath || ('sources/' + category.path);
    const text = category.pathText || category.title;
    rend(
      '<p style="margin-top: 8px; font-size: 18px;">' +
        localLink(path, text) +
      '</p>'
    );
  });
}

function viewSourcesAll() {
  const $table = $('<table class="event-list" border="1">');

  rend($table);

  $table.append($headerRow(['type', 'group', 'title', 'date', 'location', 'people']));

  DATABASE.sources.forEach(source => {
    const $row = $('<tr>').appendTo($table);

    addTd($row, source.story.type);
    addTd($row, linkToStory(source.story));
    addTd($row, linkToSource(source, source.title));
    addTd($row, formatDate(source.date));
    addTd($row, formatLocation(source.location));
    addTd($row, $makePeopleList(source.people));
  });
}

function viewListOfPhotographs() {
  const photos = DATABASE.sources.filter(source => source.type == 'photo');

  photos.forEach(source => {
    rend('<h2>' + source.title + '</h2>');
    source.images.forEach((img, i) => {
      rend(makeImage(source, i, 200).css('margin-right', '5px'));
    });

    if (source.content) {
      rend(formatTranscription(source.content));
    }

    rend($makePeopleList(source.people, 'photo'));

    if (source.summary) {
      source.summary.split('\n').forEach(text => {
        rend('<p>' + text + '</p>');
      });
    }

    if (source.notes) {
      source.notes.split('\n').forEach(text => {
        rend('<p>' + text + '</p>');
      });
    }

    rend(source.links.map(getFancyLink));
  });
}

function viewSourcesCensusUSA() {
  for (let year = 1790; year <= 1950; year += 10) {
    const story = DATABASE.stories.filter(story => {
      return story.title == 'Census USA ' + year;
    })[0];

    if (!story) {
      continue;
    }

    h2(year);

    if (year == 1890) {
      rend(
        '<p style="padding-left: 10px;">' +
          'Most of the 1890 census was destroyed in a 1921 fire.' +
        '</p>'
      );
    }

    showSourceList(story.entries, true, false, false);
  }
}

function viewSourcesCensusState() {
  const stories = DATABASE.stories.filter(isStoryStateCensus);

  stories.sortBy(story => story.title);

  let previousHeader;

  stories.forEach(story => {
    const headerName = USA_STATES[story.location.region1];

    if (previousHeader != headerName) {
      h2(headerName);
      previousHeader = headerName;
    }

    showSourceList(story.entries, true, true, true);
  });
}

function isStoryStateCensus(story) {
  return story.tags['Census US States'];
}

function viewSourcesCensusOther() {
  const storyList = DATABASE.stories.filter(story => {
    return story.title.match('Census')
      && !story.title.match('USA')
      && !isStoryStateCensus(story);
  });

  storyList.sortBy(story => story.title);

  showSourceCategoryList({
    showStoryTitles: true,
    showStoryInLink: false,
    stories: storyList
  });
}

function viewSourcesDraft() {
  ['World War I draft', 'World War II draft'].forEach(title => {
    showSourceCategoryList({
      title: title,
      stories: DATABASE.stories.filter(story => story.title == title),
      showStoryInLink: false
    });
  });
}

function viewSourcesIndexOnly() {
  const storiesIndex = DATABASE.stories.filter(story => story.type == 'index');

  storiesIndex.sortBy(story => story.title);

  rend(
    '<p style="padding: 10px 0;">' +
      'These sources come from online databases. Some of these records are transcribed from ' +
      'original documents and images which are not directly available online. Others are from ' +
      'web-only databases.' +
    '</p>'
  );

  showSourceCategoryList({
    title: 'Birth Index',
    stories: storiesIndex.filter(story => story.title.match('Birth Index'))
  });

  showSourceCategoryList({
    title: 'Death Index',
    stories: storiesIndex.filter(story => story.title.match('Death Index'))
  });

  showSourceCategoryList({
    title: 'Other',
    stories: storiesIndex.filter(story => {
      return !story.title.match('Birth Index')
        && !story.title.match('Death Index');
    })
  });
}

function viewSourcesOther() {
  const storiesOther = DATABASE.stories.filter(story => {
    return !['cemetery', 'newspaper', 'index', 'book'].includes(story.type)
      && !['World War I draft', 'World War II draft',
        'Photo'].includes(story.title)
      && !story.title.match('Census');
  });

  storiesOther.sortBy(story => story.title);

  showSourceCategoryList({
    title: 'Baptism',
    stories: storiesOther.filter(story => story.title.match('Baptism'))
  });

  showSourceCategoryList({
    title: 'Marriage',
    stories: storiesOther.filter(story => story.title.match('Marriage'))
  });

  showSourceCategoryList({
    title: 'Immigration & Travel',
    stories: storiesOther.filter(story => story.title.match('Passenger'))
  });

  showSourceCategoryList({
    title: 'Other',
    stories: storiesOther.filter(story => {
      return !story.title.match('Baptism')
        && !story.title.match('Marriage')
        && !story.title.match('Passenger');
    })
  });
}
