
function viewSearchDocuments(keywords) {
  const documentList = DATABASE.sources.filter(source => {
    let searchString = source.title + source.content;
    return source.type == 'document' && doesStrMatchKeywords(searchString, keywords);
  });

  if (documentList.length) {
    rend('<h2>Documents</h2>');
    documentList.forEach(source => {
      let linkText = source.group + ' - ' + source.title;
      linkText = highlightKeywords(linkText, keywords);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}

function viewSearchOtherSources(keywords) {
  const otherSourceList = DATABASE.sources.filter(source => {
    let searchString = source.group + source.title + source.content;
    return !['document', 'newspaper', 'book', 'grave'].includes(source.type)
      && doesStrMatchKeywords(searchString, keywords);
  });

  if (otherSourceList.length) {
    rend('<h2>Other Sources</h2>');
    otherSourceList.forEach(source => {
      let linkText = source.group + ' - ' + source.title;
      linkText = highlightKeywords(linkText, keywords);
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
