
function viewSearch() {
  setPageTitle('Search Results');
  rend('<h1>Search Results</h1>');
  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  if (keywords.length === 0) {
    return;
  }

  let peopleList = DATABASE.people.filter(person => {
    for (let i = 0; i < keywords.length; i++) {
      if (person.name.toLowerCase().match(keywords[i]) == null) {
        return false;
      }
    }
    return true;
  });

  let sourceList = DATABASE.sources.filter(source => {
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
    return source.type == 'newsapers';
  });
  let otherSourceList = sourceList.filter(source => {
    return source.type != 'document' && source.type != 'newsapers';
  });

  rend('<h2>People</h2>');
  rend($makePeopleList(peopleList));

  rend('<h2>Documents</h2>');
  documentList.forEach(source => {
    rend('<p>' + source.title + '</p>');
  });

  rend('<h2>Newspapers</h2>');
  newspaperList.forEach(source => {
    rend('<p>' + source.title + '</p>');
  });

  rend('<h2>Other</h2>');
  otherSourceList.forEach(source => {
    rend('<p>' + source.title + '</p>');
  });
}
