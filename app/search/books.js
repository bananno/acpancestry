
class SearchResultsBooks extends SearchResults {
  static newTest(...keywords) {
    return new SearchResultsBooks(keywords, true);
  }

  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.type = 'book';
    this.execute();
  }

  getResults() {
    DATABASE.stories
    .filter(story => story.type == this.type)
    .forEach(story => {
      const searchStringStory = ['title', 'notes', 'summary', 'content']
        .map(attr => story[attr] || '').join(',');

      let matchStory = this.isMatch(searchStringStory);
      let addedStory = matchStory;

      const matchingEntries = [];

      if (matchStory) {
        this.add({ isStory: true, matchingEntries, ...story });
      }

      story.entries.forEach(source => {
        const searchStringSource = ['title', 'notes', 'summary', 'content']
          .map(attr => source[attr] || '').join(',');

        const sourceMatch = this.isMatch(searchStringSource);
        const matchTotal = !matchStory
          && this.isMatch(searchStringSource + ',' + searchStringStory);

        if (sourceMatch || matchTotal) {
          if (!addedStory) {
            addedStory = true;
            this.add({ isStory: true, matchingEntries, ...story });
          }
          matchingEntries.push(source);
        }
      });
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title(this.type.pluralize().capitalize());

    this.resultsList.forEach((story, i) => {
      if (i > 0) {
        rend('<hr style="margin-top: 15px;">');
      }

      rend('<div style="display: none;" class="search-result-item">');

      pg(linkToStory(story, this.highlight(story.title)))
        .css('margin', '15px 0 0 5px');

      pg(this.highlight(this.summary)).css('margin', '5px');

      story.matchingEntries.forEach((source, j) => {
        if (j == 0) {
          pg('<i>Matching chapters/entries:</i>')
            .css('margin', '5px').css('color', 'gray');
        }

        rend(
          '<ul style="margin-left: 30px;">' +
            '<li style="margin: 5px;">' +
              linkToSource(source, this.highlight(source.title)) +
            '</li>' +
          '</ul>'
        );
      });
    });
  }
}
