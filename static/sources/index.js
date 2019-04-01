
const sourceCategories = [
  {
    path: 'all',
    title: 'All Sources',
    pathText: 'View All',
    route: viewSourcesAll,
  },
  {
    path: 'cemeteries',
    title: 'Cemeteries',
    route: viewSourcesCemeteries,
  },
  {
    path: 'newspapers',
    title: 'Newspapers',
    route: viewSourcesNewspapers,
  },
  {
    path: 'censusUSA',
    title: 'US Federal Census',
    route: viewSourcesCensusUSA,
  },
  {
    path: 'censusState',
    title: 'US State Census',
  },
  {
    path: 'censusOther',
    title: 'Other Census',
  },
  {
    path: 'draft',
    title: 'WWI & WWII Draft',
  },
  {
    path: 'indexOnly',
    title: 'Index-only Records',
  },
  {
    path: 'other',
    title: 'Other Sources',
  },
];

function routeSources() {
  if (PATH == 'sources') {
    return viewSourcesIndex();
  }

  if (PATH.match('source/')) {
    return viewOneSource();
  }

  if (PATH.match('sourceGroup/')) {
    return viewSourceGroup();
  }

  const categoryPath = PATH.slice(8);

  const category = sourceCategories.filter(category => {
    return category.path === categoryPath;
  })[0];

  if (category === undefined) {
    return pageNotFound();
  }

  setPageTitle(category.title);
  rend('<h1>' + category.title + '</h1>');

  if (category.route) {
    return category.route();
  }
}

function viewSourcesIndex() {
  setPageTitle('Sources');
  rend('<h1>Sources</h1>');
  rend(
    '<ul>' +
      sourceCategories.map(category => {
        return ('<li>' +
          localLink('sources/' + category.path, category.pathText || category.title) +
        '</li>');
      }).join('') +
    '</ul>'
  );
}

function viewSourcesAll() {
  const $table = $('<table class="event-list" border="1">');

  rend($table);

  $table.append($headerRow(['type', 'group', 'title', 'date', 'location', 'people']));

  DATABASE.sources.forEach(source => {
    const $row = $('<tr>').appendTo($table);

    addTd($row, linkToSource(source, source.type));
    addTd($row, source.group);
    addTd($row, source.title);
    addTd($row, formatDate(source.date));
    addTd($row, formatLocation(source.location));
    addTd($row, $makePeopleList(source.people));
  });
}

function viewOneSource() {
  const sourceId = PATH.replace('source/', '');

  const source = DATABASE.sources.filter(source => source._id == sourceId)[0];

  if (!source) {
    rend('<h1>Source not found</h1>');
    return;
  }

  if (source.type == 'grave') {
    viewSourceGrave(source);
  } else {
    viewSourceOther(source);
  }

  rend('<h2>People</h2>');
  rend($makePeopleList(source.people, 'photo'));

  rend('<h2>Links</h2>');
  rend(source.links.map(getFancyLink));
}

function viewSourceGrave(source) {
  setPageTitle(source.group);
  rend('<h1>' + source.group + '</h1>');
  rend('<h1>' + source.title + '</h1>');
}

function viewSourceOther(source) {
  setPageTitle('Source');
  rend('<h1>Source</h1>');
  rend('<p>' + source.type + '</p>');
  rend('<p>' + source.group + '</p>');
  rend('<p>' + source.title + '</p>');
  rend('<p>' + formatDate(source.date) + '</p>');
  rend('<p>' + formatLocation(source.location) + '</p>');

  if (source.images.length) {
    rend('<h2>Images</h2>');

    if (source.group.match('Census USA')) {
      rend('<p style="margin-bottom:10px">The image might be cropped to show the most ' +
        'relevent portion. See the "links" section below for the full image.</p>');
    }

    source.images.forEach(imageUrl => {
      rend(makeImage(imageUrl));
    });
  }

  if (source.content) {
    rend('<h2>Transcription</h2>');
    rend(formatTranscription(source.content));
  }

  if (source.notes) {
    rend('<h2>Notes</h2>');
    rend('<ul class="bullet"><li>' + source.notes.split('\n').join('</li><li>') + '</li></ul>');
  }
}

function viewSourcesCemeteries() {
  const cemeteryList = [];

  DATABASE.sources.forEach(source => {
    if (source.type != 'grave') {
      return;
    }

    const cemeteryName = source.group;

    cemeteryList[cemeteryName] = cemeteryList[cemeteryName] || [];

    cemeteryList[cemeteryName].push(source);
  });

  for (let cemeteryName in cemeteryList) {
    const rootSource = cemeteryList[cemeteryName][0];

    rend(
      '<p style="padding-top: 15px">' +
        linkToSourceGroup(rootSource, cemeteryName) +
        '<br>' +
        formatLocation(rootSource.location) +
        '<br>' +
        (cemeteryList[cemeteryName].length == 1 ? '1 grave'
          : cemeteryList[cemeteryName].length + ' graves') +
      '</p>'
    );
  }
}

function viewSourcesNewspapers() {
  const newspaperList = [];

  DATABASE.sources.forEach(source => {
    if (source.type != 'newspaper') {
      return;
    }

    const newspaperName = source.group;

    newspaperList[newspaperName] = newspaperList[newspaperName] || [];

    newspaperList[newspaperName].push(source);
  });

  for (let newspaperName in newspaperList) {
    const rootSource = newspaperList[newspaperName][0];

    rend(
      '<p style="padding-top: 15px">' +
        linkToSourceGroup(rootSource, newspaperName) +
        '<br>' +
        (rootSource.location.format ? rootSource.location.format + '<br>' : '') +
        (newspaperList[newspaperName].length == 1 ? '1 article'
          : newspaperList[newspaperName].length + ' articles') +
      '</p>'
    );
  }
}

function viewSourcesCensusUSA() {
  const groupList = [];

  for (let year = 1790; year <= 1950; year += 10) {
    const list = DATABASE.sources.filter(source => {
      return source.group == ('Census USA ' + year);
    });

    if (year == 1890) {
      rend('<h2>1890</h2>');
      rend('<p>Most of the 1890 census was destroyed in a 1921 fire.</p>');
    } else {
      if (list.length == 0) {
        continue;
      }
      rend('<h2>' + year + '</h2>');
    }

    list.forEach((source, i) => {
      rend(
        '<p style="padding-top: ' + (i == 0 ? '5' : '15') + 'px">' +
          linkToSourceGroup(source, source.title) +
        '</p>' +
        '<p style="padding-top: 2px">' +
          source.location.format +
        '</p>'
      );
    });
  }
}
