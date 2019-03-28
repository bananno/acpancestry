
function viewSources() {
  setPageTitle('Sources');
  const $table = $('<table class="event-list" border="1">');

  rend('<h1>All Sources</h1>');

  rend(
    '<ul>' +
      '<li>' + localLink('sources/cemeteries', 'Cemeteries') + '</li>' +
    '</ul>'
  );

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
}

function viewSourcesCemeteries() {
  setPageTitle('Cemeteries');
  rend('<h1>Cemeteries</h1>');

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
        cemeteryList[cemeteryName].length +
      ' graves</p>'
    );
  }
}
