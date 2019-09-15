class SearchResultsCemeteriesOrNewspapers extends SearchResults {
  constructor(keywords, isTest, sourceType, groupTitle, entryTitle, entrySingular) {
    super(keywords, isTest);
    this.sourceType = sourceType;
    this.groupTitle = groupTitle;
    this.entryTitle = entryTitle;
    this.entrySingular = entrySingular;
    this.groupList = [];
    this.groupEntryCount = {};
    this.individualList = [];
    this.getResults();
    this.renderGroupResults();
    this.renderIndividualResults();
  }

  getResults() {
    DATABASE.sources.forEach(source => {
      if (source.type != this.sourceType) {
        return;
      }

      if (this.isMatch(source.group)) {
        if (this.groupEntryCount[source.group]) {
          this.groupEntryCount[source.group] += 1;
        } else {
          this.groupEntryCount[source.group] = 1;
          this.groupList.push(source);
        }
      }

      let searchString = source.title + source.content;

      if (this.isMatch(searchString)) {
        this.individualList.push(source);
      }
    });
  }

  renderGroupResults() {
    if (this.groupList.length == 0) {
      return;
    }

    this.title(this.groupTitle);

    this.groupList.forEach(source => {
      let linkText = this.highlight(source.group);
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToSourceGroup(source, linkText) + '<br>' +
          source.location.format + '<br>' +
          this.groupEntryCount[source.group] + ' ' + this.entrySingular +
          (this.groupEntryCount[source.group] == 1 ? '' : 's') +
        '</p>'
      );
    });
  }

  renderIndividualResults() {
    if (this.individualList.length == 0 ) {
      return;
    }

    this.title(this.entryTitle);

    this.individualList.forEach(source => {
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToSource(source, this.highlight(source.title)) + '<br>' +
          source.group + '<br>' +
          (source.date.format ? source.date.format + '<br>' : '') +
          (source.location.format ? source.location.format + '<br>' : '') +
        '</p>'
      );

      rend(formatTranscription(this.highlight(source.content)));
    });
  }
}

class SearchResultsCemeteries extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, 'newspaper', 'Newspapers', 'Newspaper Articles', 'article');
  }
}

class SearchResultsNewspapers extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, 'grave', 'Cemeteries', 'Graves', 'grave');
  }
}
