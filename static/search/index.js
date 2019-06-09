
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
  new SearchResultsDocuments(keywords);
  viewSearchCemeteriesOrNewspapers('Newspapers', 'Newspaper Articles', 'newspaper', keywords,
    'article');
  viewSearchCemeteriesOrNewspapers('Cemeteries', 'Graves', 'grave', keywords, 'grave');
  new SearchResultsBooks(keywords);
  viewSearchOtherSources(keywords);
  viewSearchEvents(keywords);

  const totalResults = $('.search-result-item').length;

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
}

class SearchResults {
  constructor(keywords, isTest) {
    this.keywords = keywords;
    this.isTest = isTest;
    this.resultsList = [];

    this.getResults();

    if (this.resultsList.length == 0) {
      return;
    }

    this.sortResults();

    if (!this.isTest) {
      this.renderResults();
    }
  }

  isMatch(text) {
    return doesStrMatchKeywords(text, this.keywords);
  }

  add(obj) {
    this.resultsList.push(obj);
  }

  highlight(text) {
    return highlightKeywords(text, this.keywords);
  }
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
