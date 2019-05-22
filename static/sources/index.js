
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
    path: 'newspapers',
    title: 'Newspapers',
    route: () => { viewListOfNewspapersOrCemeteries('newspaper', 'article'); },
  },
  {
    path: 'cemeteries',
    title: 'Cemeteries',
    route: () => { viewListOfNewspapersOrCemeteries('grave', 'grave'); },
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

  sourceCategories.forEach(category => {
    rend(
      '<p style="margin-top: 8px; font-size: 18px;">' +
        localLink('sources/' + category.path, category.pathText || category.title) +
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

    addTd($row, linkToSource(source, source.type));
    addTd($row, source.group);
    addTd($row, source.title);
    addTd($row, formatDate(source.date));
    addTd($row, formatLocation(source.location));
    addTd($row, $makePeopleList(source.people));
  });
}

function viewListOfPhotographs() {
  const photos = DATABASE.sources.filter(source => source.type == 'photo');

  photos.forEach(source => {
    rend('<h2>' + source.title + '</h2>');
    source.images.forEach(img => {
      rend(makeImage(img, 200).css('margin-right', '5px'));
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

function viewListOfNewspapersOrCemeteries(sourceType, entryName) {
  const groupNameList = createListOfNewspapersOrCemeteries(sourceType)[0];
  let previousHeader = null;

  groupNameList.forEach(sourceGroup => {
    if (previousHeader != sourceGroup.header) {
      rend('<h2>' + sourceGroup.header + '</h2>');
      previousHeader = sourceGroup.header;
    }
    const item = sourceListitemCemeteryOrNewspaper(sourceGroup.root, entryName,
      sourceGroup.sources.length);
    rend(item);
  });
}

function createListOfNewspapersOrCemeteries(sourceType, sourceList) {
  const groupNameList = [];
  const sourcesInGroup = [];

  (sourceList || DATABASE.sources).forEach(source => {
    if (source.type != sourceType) {
      return;
    }
    const groupName = source.group;
    if (!sourcesInGroup[groupName]) {
      sourcesInGroup[groupName] = [];
      groupNameList.push({
        name: groupName,
        root: source,
        sources: sourcesInGroup[groupName],
        header: source.location.country == 'United States' && source.location.region1
          ? USA_STATES[source.location.region1] : 'Other',
      });
    }
    sourcesInGroup[groupName].push(source);
  });

  groupNameList.sort((a, b) => {
    return (a.header != 'Other' && a.header < b.header) ? -1 : 0;
  });

  return [groupNameList, sourcesInGroup];
}

function viewSourcesCensusUSA() {
  const groupList = [];

  for (let year = 1790; year <= 1950; year += 10) {
    const list = DATABASE.sources.filter(source => {
      return source.group == ('Census USA ' + year);
    });

    if (year == 1890) {
      rend('<h2>1890</h2>');
      rend(
        '<p style="padding-left: 10px;">' +
          'Most of the 1890 census was destroyed in a 1921 fire.' +
        '</p>'
      );
    } else {
      if (list.length == 0) {
        continue;
      }
      rend('<h2>' + year + '</h2>');
    }

    list.forEach((source, i) => {
      rend(
        '<p style="padding-top: ' + (i == 0 ? '5' : '15') + 'px; padding-left: 10px;">' +
          linkToSourceGroup(source, source.title) +
        '</p>' +
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.location.format +
        '</p>'
      );
    });
  }
}

function viewSourcesCensusState() {
  const list = DATABASE.sources.filter(isItemStateCensus);
  showSourceList(list, true, true, true);
}

function isItemStateCensus(source) {
  return source.group.match('Census Minnesota')
    || source.group.match('Census Nebraska');
}

function viewSourcesCensusOther() {
  const list = DATABASE.sources.filter(source => {
    return source.group.match('Census') && !source.group.match('Census USA')
      && !isItemStateCensus(source);
  });

  showSourceList(list, true, true, true);
}

function viewSourcesDraft() {
  const list1 = DATABASE.sources.filter(source => {
    return source.group == 'World War I draft';
  });

  const list2 = DATABASE.sources.filter(source => {
    return source.group == 'World War II draft';
  });

  rend('<h2>World War I</h2>');
  showSourceList(list1, true, true, false);
  rend('<h2>World War II</h2>');
  showSourceList(list2, true, true, false);
}

function viewSourcesOther() {
  const list = DATABASE.sources.filter(source => {
    return source.type != 'photo'
      && source.type != 'grave'
      && source.type != 'newspaper'
      && !source.group.match('Census')
      && source.group != 'World War I draft'
      && source.group != 'World War II draft';
  });

  showSourceList(list, true, true, true);
}
