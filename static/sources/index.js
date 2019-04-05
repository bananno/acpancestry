
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

function viewListOfNewspapersOrCemeteries(sourceType, entryName) {
  const groupList = createListOfNewspapersOrCemeteries(sourceType);

  for (let groupName in groupList) {
    const item = sourceListitemCemeteryOrNewspaper(groupList[groupName][0], entryName,
      groupList[groupName].length);
    rend(item);
  }
}

function createListOfNewspapersOrCemeteries(sourceType, sourceList) {
  const groupList = [];
  (sourceList || DATABASE.sources).forEach(source => {
    if (source.type != sourceType) {
      return;
    }
    const groupName = source.group;
    groupList[groupName] = groupList[groupName] || [];
    groupList[groupName].push(source);
  });
  return groupList;
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
