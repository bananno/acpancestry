class SearchResultsOtherSources extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      let searchString = ['title', 'content', 'notes', 'summary']
        .map(attr => source[attr] || '').join(',');
      return !['document', 'newspaper', 'book', 'cemetery']
        .includes(source.story.type) && this.isMatch(searchString);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Other Sources');
    this.resultsList.forEach(source => {
      let linkText = source.story.title + ' - ' + source.title;
      linkText = this.highlight(linkText);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}
