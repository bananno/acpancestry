
class SearchResultsDocuments extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      return source.type == 'document' && this.isMatch(source.title + source.content);
    });
  }

  sortResults() {
  }

  renderResults() {
    rend('<h2>Documents</h2>');
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

class SearchResultsOtherSources extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
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
    rend('<h2>Other Sources</h2>');
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

function viewSearchCemeteriesOrNewspapers(groupTitle, title, sourceType, keywords, entryName) {
  const groupList = [];
  const groupEntryCount = {};
  const individualList = [];

  DATABASE.sources.forEach(source => {
    if (source.type != sourceType) {
      return;
    }

    if (doesStrMatchKeywords(source.group, keywords)) {
      if (groupEntryCount[source.group]) {
        groupEntryCount[source.group] += 1;
      } else {
        groupEntryCount[source.group] = 1;
        groupList.push(source);
      }
    }

    let searchString = source.title + source.content;

    if (doesStrMatchKeywords(searchString, keywords)) {
      individualList.push(source);
    }
  });

  if (groupList.length) {
    rend('<h2>' + groupTitle + '</h2>');
  }

  groupList.forEach(source => {
    rend(
      '<p style="padding: 5px 10px" class="search-result-item">' +
        linkToSourceGroup(source, source.group) + '<br>' +
        source.location.format + '<br>' +
        groupEntryCount[source.group] + ' ' + entryName +
        (groupEntryCount[source.group] == 1 ? '' : 's') +
      '</p>'
    );
  });

  if (individualList.length) {
    rend('<h2>' + title + '</h2>');
  }

  individualList.forEach(source => {
    rend(
      '<p style="padding: 5px 10px" class="search-result-item">' +
        linkToSource(source, highlightKeywords(source.title, keywords)) + '<br>' +
        source.group + '<br>' +
        (source.date.format ? source.date.format + '<br>' : '') +
        (source.location.format ? source.location.format + '<br>' : '') +
      '</p>'
    );

    rend(formatTranscription(highlightKeywords(source.content, keywords)));
  });
}
