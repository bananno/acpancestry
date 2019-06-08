
function viewSearchBooks(keywords) {
  const resultsList = getSearchResultsBooks(keywords);

  if (resultsList.length) {
    renderSearchResultsBooks(resultsList, keywords);
  }
}

function getSearchResultsBooks(keywords) {
  const resultsList = [];

  DATABASE.sources.filter(source => source.type == 'book').forEach(source => {
    const searchStringSource = ['group', 'title', 'notes', 'summary', 'content']
      .map(attr => source[attr] || '').join('');

    const searchStringGroup = source.sourceGroup ? ['notes', 'summary', 'content']
      .map(attr => source.sourceGroup[attr] || '').join('') : '';

    const matchSource = doesStrMatchKeywords(searchStringSource, keywords);
    const matchGroup = doesStrMatchKeywords(searchStringGroup, keywords);

    // NOT the sum of two booleans: keywords could be spread between the two search strings.
    const matchAny = doesStrMatchKeywords(searchStringSource + searchStringGroup, keywords);

    if (!matchAny) {
      resultsList.push({
        source: source,
        matchSource: matchSource,
        matchGroup: matchGroup,
        matchAny: matchAny,
      });
    }
  });

  resultsList.trueSort((a, b) => {
    if (a.source.group != b.source.group) {
      return a.source.group < b.source.group;
    }
    return a.source.title.toLowerCase() == 'source group'
      || (a.source.title < b.source.title && b.source.title.toLowerCase() != 'source group');
  });

  return resultsList;
}

function renderSearchResultsBooks(resultsList, keywords) {
  rend('<h2>Books</h2>');

  let previousBookGroup = null;

  resultsList.forEach((resultSource, i) => {
    const source = resultSource.source;

    let linkText;

    if (previousBookGroup != source.group) {
      rend(
        '<p style="padding: 5px;' + (i > 0 ? 'margin-top:10px;' : '') + '" class="search-result-item">' +
          '<b>' + source.group + '</b>' +
        '</p>'
      );

      if (source.title.toLowerCase() == 'source group' && source.summary) {
        rend(
          '<p style="padding: 2px;" class="search-result-item">' +
            '<i>' + source.summary + '</i>' +
          '</p>'
        );
      }

      linkText = source.group + ' - ' + source.title;
      previousBookGroup = source.group;
    } else {
      linkText = ' ------- ' + source.title;
    }

    linkText = highlightKeywords(linkText, keywords);

    rend(
      '<p style="padding: 5px;" class="search-result-item">' +
        linkToSource(source, linkText) +
      '</p>'
    );
  });
}
