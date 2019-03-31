
function viewSearchDocuments(keywords) {
  const documentList = DATABASE.sources.filter(source => {
    return source.type == 'document' && doesStrMatchKeywords(source.title, keywords);
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
    return source.type != 'document' && source.type != 'newspaper'
      && source.type != 'grave' && doesStrMatchKeywords(source.title, keywords);
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

function viewSearchCemeteriesOrNewspapers(title, sourceType, keywords, entryName) {
  const groupList = [];
  const countEntries = {};

  DATABASE.sources.forEach(source => {
    if (source.type != sourceType || !doesStrMatchKeywords(source.group, keywords)) {
      return;
    }

    if (countEntries[source.group]) {
      countEntries[source.group] += 1;
      return;
    }

    countEntries[source.group] = 1;
    groupList.push(source);
  });

  if (groupList.length == 0) {
    return 0;
  }

  rend('<h2>' + title + '</h2>');

  groupList.forEach(source => {
    rend(
      '<p style="padding: 5px 10px" class="search-result-item">' +
        linkToSourceGroup(source, source.group) +
        '<br>' +
        formatLocation(source.location) +
        '<br>' +
        countEntries[source.group] + ' ' + entryName +
        (countEntries[source.group] == 1 ? '' : 's') +
      '</p>'
    );
  });
}
