
function viewSearch() {
  setPageTitle('Search Results');

  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  if (keywords.length === 0) {
    rend('<h1>Search Results</h1>');
    return;
  }

  rend('<h1>Search Results for "' + keywords.join(' ') + '"</h1>');
  rend('<p style="padding-top:10px;" id="number-of-search-results"></p>');

  const peopleList = DATABASE.people.filter(person => {
    return doesStrMatchKeywords(person.name, keywords);
  });

  let sourceList = DATABASE.sources.filter(source => {
    if (source.type == 'grave' && source.type != 'newspaper') {
      return false;
    }

    return doesStrMatchKeywords(source.title, keywords);
  });

  const documentList = sourceList.filter(source => {
    return source.type == 'document';
  });

  const otherSourceList = sourceList.filter(source => {
    return source.type != 'document' && source.type != 'newspaper'
      && source.type != 'grave';
  });

  let totalResults = peopleList.length + documentList.length + otherSourceList.length;

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

  totalResults += viewSearchCemeteriesOrNewspapers('Newspapers', 'newspaper', keywords, 'article');
  totalResults += viewSearchCemeteriesOrNewspapers('Cemeteries', 'grave', keywords, 'grave');

  if (otherSourceList.length) {
    rend('<h2>Other</h2>');
    otherSourceList.forEach(source => {
      rend('<p style="padding: 5px;">' + linkToSource(source, source.group + ' - ' +
        source.title) + '</p>');
    });
  }

  viewSearchEvents(keywords);

  totalResults += $('.search-result-item').length;

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
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
    return 0;
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

  return groupList.length;
}

function viewSearchEvents(keywords) {
  const eventsList = DATABASE.events.filter(event => {
    let searchItems = [event.title, event.location.format, event.notes];

     event.people.forEach(person => {
      searchItems.push(person.name);
     });

    return doesStrMatchKeywords(searchItems.join(' '), keywords);
  });

  if (eventsList.length) {
    rend('<h2>Events</h2>');
  }

  eventsList.forEach(event => {
    const people = event.people.map(person => person.name);

    rend(
      '<p class="search-result-item" style="padding-top: 10px">' +
        highlightKeywords(event.title, keywords) +
      '</p>' +
      '<p style="padding-top: 2px">' +
        highlightKeywords(people.join(', '), keywords) +
      '</p>' +
      (event.notes && event.notes.length ?
      '<p style="padding-top: 2px">' +
        highlightKeywords(event.notes, keywords) +
      '</p>' : '') +
      '<p style="padding-top: 2px">' +
        highlightKeywords([event.location.format, event.date.format].join(' '), keywords) +
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

function highlightKeywords(str, keywords, i) {
  if (str.length == 0) {
    return str;
  }

  if (i == null) {
    keywords = keywords.sort((a, b) => {
      return b.length - a.length;
    });
    i = 0;
  }

  if (i >= keywords.length) {
    return str;
  }

  let p1 = str.toLowerCase().indexOf(keywords[i]);

  if (p1 == -1) {
    return highlightKeywords(str, keywords, i + 1);
  }

  let p2 = p1 + keywords[i].length;

  return highlightKeywords(str.slice(0, p1), keywords, i + 1) +
    '<span class="highlight-search-result">' + str.slice(p1, p2) + '</span>' +
    highlightKeywords(str.slice(p2), keywords, i);

  return str;
}
