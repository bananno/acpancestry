class SearchResultsCemeteriesOrNewspapers extends SearchResults {
  constructor(keywords, isTest, options) {
    super(keywords, isTest);

    this.storyType = options.storyType;
    this.sectionStoryTitle = options.sectionStoryTitle;
    this.sectionSourceTitle = options.sectionSourceTitle;
    this.entryName = options.entryName;

    this.resultsListStories = [];
    this.resultsListSources = [];

    this.getResults();
    this.renderGroupResults();
    this.renderIndividualResults();
  }

  getResults() {
    DATABASE.stories.forEach(story => {
      if (story.type != this.storyType) {
        return;
      }

      if (this.isMatch(story.title)) {
        this.resultsListStories.push(story);
      }

      story.entries.forEach(source => {
        let searchString = story.title + source.title + source.content;

        if (this.isMatch(searchString)) {
          this.resultsListSources.push(source);
        }
      });
    });
  }

  renderGroupResults() {
    if (this.resultsListStories.length == 0) {
      return;
    }

    this.title(this.sectionStoryTitle);

    this.resultsListStories.forEach(story => {
      let linkText = this.highlight(story.title);
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToStory(story, linkText) + '<br>' +
          story.location.format + '<br>' +
          story.entries.length + ' ' +
          this.entryName.pluralize(story.entries.length) +
        '</p>'
      );
    });
  }

  renderIndividualResults() {
    if (this.resultsListSources.length == 0 ) {
      return;
    }

    this.title(this.sectionSourceTitle);

    this.resultsListSources.forEach((source, i) => {
      pg(linkToSource(source, this.highlight(source.title)))
        .css('padding', '2px 10px')
        .css('padding-top', (i == 0 ? '5px' : '15px'))
        .addClass('search-result-item');

      pg(source.story.title).css('padding', '2px 10px');

      ['date', 'location'].forEach(attr => {
        if (source[attr].format) {
          pg(source[attr].format).css('padding', '2px 10px');
        } else if (source.story[attr].format) {
          pg(source.story[attr].format).css('padding', '2px 10px');
        }
      });

      if (source.content) {
        rend(formatTranscription(this.highlight(source.content)));
      }
    });
  }
}

class SearchResultsCemeteries extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, {
      storyType: 'newspaper',
      sectionStoryTitle: 'Newspapers',
      sectionSourceTitle: 'Newspaper Articles',
      entryName: 'article'
    });
  }
}

class SearchResultsNewspapers extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, {
      storyType: 'cemetery',
      sectionStoryTitle: 'Cemeteries',
      sectionSourceTitle: 'Graves',
      entryName: 'grave'
    });
  }
}
