
class SearchResultsArtifacts extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories
    .filter(story => story.type == 'artifact').filter(story => {
      let searchStr = story.title;
      return this.isMatch(searchStr);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Artifacts');
    this.resultsList.forEach((story, i) => {
      artifactBlock(story, {
        firstItem: i == 0,
        largeHeader: false,
        people: [],
        highlightKeywords: this.keywords
      });
    });
  }
}

class SearchResultsLandmarks extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories
    .filter(story => story.type == 'landmark').filter(story => {
      let searchStr = story.title;
      return this.isMatch(searchStr);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Landmarks');
    this.resultsList.forEach(story => {
      rend('<p style="margin: 15px 0 0 15px;" class="search-result-item">'
        + linkToStory(story, this.highlight(story.title)) + '</p>');

      if (story.location.format) {
        rend('<p style="margin: 2px 0 0 15px;" class="search-result-item">'
          + story.location.format + '</p>');
      }
    });
  }
}
