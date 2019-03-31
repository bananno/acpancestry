
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

  if (peopleList.length) {
    rend('<h2>People</h2>');
    rend($makePeopleList(peopleList, 'photo', keywords));
  }

  if (documentList.length) {
    rend('<h2>Documents</h2>');
    documentList.forEach(source => {
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, source.group + ' - ' + source.title) +
        '</p>'
      );
    });
  }

  viewSearchCemeteriesOrNewspapers('Newspapers', 'newspaper', keywords, 'article');
  viewSearchCemeteriesOrNewspapers('Cemeteries', 'grave', keywords, 'grave');

  if (otherSourceList.length) {
    rend('<h2>Other Sources</h2>');
    otherSourceList.forEach(source => {
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, source.group + ' - ' + source.title) +
        '</p>'
      );
    });
  }

  viewSearchEvents(keywords);

  const totalResults = $('.search-result-item').length;

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
      '<p style="padding: 5px 10px" class="search-result-item">' +
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
    let people = event.people.map(person => highlightKeywords(person.name, keywords));

    let line1 = highlightKeywords(event.title, keywords);
    let lines = [];

    if (['birth', 'death', 'marriage'].indexOf(event.title) >= 0) {
      line1 += ' - ' + people.join(' & ');
    } else {
      lines.push(people.join(', '));
    }

    lines.push(highlightKeywords(event.location.format, keywords));
    lines.push(highlightKeywords(event.date.format, keywords));
    lines.push(highlightKeywords(event.notes, keywords));

    rend(
      '<p class="search-result-item" style="padding-top: 10px">' + line1 + '</p>' +
      lines.map(str => {
        if (str == null || str == '') {
          return '';
        }
        return (
          '<p style="padding-top: 2px">' + str + '</p>'
        );
      }).join('')
    );
  });
}
