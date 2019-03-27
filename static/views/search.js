
function viewSearch() {
  setPageTitle('Search Results');

  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  if (keywords.length === 0) {
    rend('<h1>Search Results</h1>');
    return;
  }

  rend('<h1>Search Results for "' + keywords.join(' ') + '"</h1>');

  let peopleList = DATABASE.people.filter(person => {
    for (let i = 0; i < keywords.length; i++) {
      if (person.name.toLowerCase().match(keywords[i]) == null) {
        return false;
      }
    }
    return true;
  });

  let sourceList = DATABASE.sources.filter(source => {
    if (source.type == 'grave') {
      return false;
    }
    for (let i = 0; i < keywords.length; i++) {
      if (source.title.toLowerCase().match(keywords[i]) == null) {
        return false;
      }
    }
    return true;
  });

  let documentList = sourceList.filter(source => {
    return source.type == 'document';
  });
  let newspaperList = sourceList.filter(source => {
    return source.type == 'newspapers';
  });
  let otherSourceList = sourceList.filter(source => {
    return source.type != 'document' && source.type != 'newspapers';
  });

  rend('<h2>People</h2>');
  rend($makePeopleList(peopleList, 'photo'));

  rend('<h2>Documents</h2>');
  documentList.forEach(source => {
    rend('<p>' + linkToSource(source, source.title) + '</p>');
  });

  rend('<h2>Newspapers</h2>');
  newspaperList.forEach(source => {
    rend('<p>' + linkToSource(source, source.title) + '</p>');
  });

  viewSearchCemeteries(keywords);

  rend('<h2>Other</h2>');
  otherSourceList.forEach(source => {
    rend('<p>' + linkToSource(source, source.title) + '</p>');
  });
}

function viewSearchCemeteries(keywords) {
  const cemeteryList = [];
  const countEntries = {};

  DATABASE.sources.forEach(source => {
    if (source.type != 'grave' || !doesStrMatchKeywords(source.group, keywords)) {
      return;
    }

    if (countEntries[source.group]) {
      countEntries[source.group] += 1;
      return;
    }

    countEntries[source.group] = 1;
    cemeteryList.push(source);
  });

  if (cemeteryList.length == 0) {
    return;
  }

  rend('<h2>Cemeteries</h2>');

  cemeteryList.forEach(source => {
    rend(
      '<p style="padding: 5px 10px">' +
        linkToSource(source, source.group) +
        '<br>' +
        formatLocation(source.location) +
        '<br>' +
        (countEntries[source.group] == 1 ? '1 grave' : countEntries[source.group] + ' graves') +
      '</p>'
    );
  });
}

function doesStrMatchKeywords(str, keywords) {
  str = str.toLowerCase();

  for (let i = 0; i < keywords.length; i++) {
    if (str.match(keywords[i]) == null) {
      return false;
    }
  }

  return true;
}
