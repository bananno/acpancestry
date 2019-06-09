
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
      let linkText = source.group + ' - ' + source.title;
      linkText = this.highlight(linkText, this.keywords);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}

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
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToSourceGroup(source, source.group) + '<br>' +
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

class SearchResultsOtherSources extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      let searchString = ['group', 'title', 'content', 'notes', 'summary']
        .map(attr => source[attr] || '').join(',');
      return !['document', 'newspaper', 'book', 'grave'].includes(source.type)
        && this.isMatch(searchString);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Other Sources');
    this.resultsList.forEach(source => {
      let linkText = source.group + ' - ' + source.title;
      linkText = this.highlight(linkText);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}
