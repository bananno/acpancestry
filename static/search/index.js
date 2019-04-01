
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

  viewSearchPeople(keywords);
  viewSearchDocuments(keywords);
  viewSearchCemeteriesOrNewspapers('Newspapers', 'Newspaper Articles', 'newspaper', keywords,
    'article');
  viewSearchCemeteriesOrNewspapers('Cemeteries', 'Graves', 'grave', keywords, 'grave');
  viewSearchOtherSources(keywords);
  viewSearchEvents(keywords);

  const totalResults = $('.search-result-item').length;

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
}

function viewSearchPeople(keywords) {
  const peopleList = DATABASE.people.filter(person => {
    return doesStrMatchKeywords(person.name, keywords);
  });

  if (peopleList.length == 0) {
    return;
  }

  rend('<h2>People</h2>');
  rend($makePeopleList(peopleList, 'photo', keywords));
}
