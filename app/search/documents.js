class SearchResultsDocuments extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      return source.type == 'document' && this.isMatch(source.title + source.content);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Documents');
    this.resultsList.forEach(source => {
      let linkText = source.story.title + ' - ' + source.title;
      linkText = this.highlight(linkText, this.keywords);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}
