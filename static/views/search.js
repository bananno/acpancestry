
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

  const documentList = sourceList.filter(source => {
    return source.type == 'document';
  });

  const otherSourceList = sourceList.filter(source => {
    return source.type != 'document' && source.type != 'newspaper'
      && source.type != 'grave';
  });

  if (peopleList.length) {
    rend('<h2>People</h2>');
    rend($makePeopleList(peopleList, 'photo'));
  }

  if (documentList.length) {
    rend('<h2>Documents</h2>');
    documentList.forEach(source => {
      rend('<p style="padding: 5px;">' +
        linkToSource(source, source.group + ' - ' + source.title) + '</p>');
    });
  }

  viewSearchCemeteriesOrNewspapers('Newspapers', 'newspaper', keywords, 'article');
  viewSearchCemeteriesOrNewspapers('Cemeteries', 'grave', keywords, 'grave');

  if (otherSourceList.length) {
    rend('<h2>Other</h2>');
    otherSourceList.forEach(source => {
      rend('<p style="padding: 5px;">' + linkToSource(source, source.group + ' - ' +
        source.title) + '</p>');
    });
  }
}

function viewSearchCemeteriesOrNewspapers(title, sourceType, keywords, entryName) {
  const groupList = [];
  const countEntries = {};

  DATABASE.sources.forEach(source => {
    if (source.type != sourceType || !doesStrMatchKeywords(source.group, keywords)) {
      return;
    }

    if (countEntries[source.group]) {
      countEntries[source.group] += 1;
      return;
    }

    countEntries[source.group] = 1;
    groupList.push(source);
  });

  if (groupList.length == 0) {
    return;
  }

  rend('<h2>' + title + '</h2>');

  groupList.forEach(source => {
    rend(
      '<p style="padding: 5px 10px">' +
        linkToSourceGroup(source, source.group) +
        '<br>' +
        formatLocation(source.location) +
        '<br>' +
        countEntries[source.group] + ' ' + entryName +
        (countEntries[source.group] == 1 ? '' : 's') +
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
