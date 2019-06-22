
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

  new SearchResultsPeople(keywords);
  new SearchResultsDocuments(keywords);
  new SearchResultsCemeteries(keywords);
  new SearchResultsNewspapers(keywords);
  new SearchResultsBooks(keywords);
  new SearchResultsOtherSources(keywords);
  new SearchResultsEvents(keywords);

  const totalResults = $('.search-result-item').length;

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
}

class SearchResults {
  constructor(keywords, isTest) {
    this.keywords = keywords;
    this.isTest = isTest;
    this.resultsList = [];
  }

  execute() {
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

  title(text) {
    rend('<h2>' + text + '</h2>');
  }
}

class SearchResultsPeople extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.people.filter(person => {
      return this.isMatch(person.name);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('People');
    rend($makePeopleList(this.resultsList, 'photo', this.keywords));
  }
}
