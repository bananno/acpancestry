class SearchResults extends ViewPage {
  static byUrl() {
    setPageTitle('Search Results');

    const keywords = PATH.slice(7).toLowerCase().split('+')
      .filter(word => word.length > 0);

    $('#search-form [name="search"]').val(keywords.join(' '));

    if (keywords.length === 0) {
      return h1('Search Results');
    }

    h1('Search Results for "' + keywords.join(' ') + '"');
    pg().css('padding-top', '10px').attr('id', 'number-of-search-results');

    new SearchResultsTopics(keywords);
    new SearchResultsPeople(keywords);
    new SearchResultsPlaces(keywords);
    new SearchResultsLandmarks(keywords);
    new SearchResultsArtifacts(keywords);
    new SearchResultsDocuments(keywords);
    new SearchResultsCemeteries(keywords);
    new SearchResultsNewspapers(keywords);
    new SearchResultsBooks(keywords);
    new SearchResultsOtherSources(keywords);
    new SearchResultsEvents(keywords);

    const totalResults = $('.search-result-item').length;

    $('#number-of-search-results').append(totalResults
      + ' result'.pluralize(totalResults));
  }

  constructor(keywords, isTest) {
    super();
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
    Person.sortListByAncestorDegree(this.resultsList);
  }

  renderResults() {
    this.title('People');
    rend($makePeopleList(this.resultsList, 'photo', {
      highlightKeywords: this.keywords,
      collapseIfAtLeast: 12,
      collapseAfterNumber: 10,
      collapseAll: false,
      collapseMessage: 'show HIDDENNUM more people',
      allowRehide: false,
    }));
  }
}

class SearchResultsTopics extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories.filter(story => {
      return story.type == 'topic' && this.isMatch(story.title);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Topics');
    this.resultsList.forEach(story => {
      pg(linkToStory(story, this.highlight(story.title))).css('margin', '10px');
    });
  }
}
