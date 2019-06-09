
function viewSearchBooks(keywords) {
  const resultsList = getSearchResultsBooks(keywords);

  if (resultsList.length == 0) {
    return;
  }

  sortSearchResultsBooks(resultsList)

  renderSearchResultsBooks(resultsList, keywords);
}

function getSearchResultsBooks(keywords) {
  let resultsList = [];

  DATABASE.sources.filter(source => source.type == 'book').forEach(source => {
    let searchStringSource = ['title', 'notes', 'summary', 'content']
      .map(attr => source[attr] || '').join(',');

    let searchStringGroup = '';

    if (source.sourceGroup) {
      searchStringGroup = ['group', 'notes', 'summary', 'content']
        .map(attr => source.sourceGroup[attr] || '').join(',');
    } else {
      searchStringSource += source.group;
    }

    const matchSource = doesStrMatchKeywords(searchStringSource, keywords);
    const matchGroup = doesStrMatchKeywords(searchStringGroup, keywords);

    // NOT the sum of two booleans: keywords could be spread between the two search strings.
    const matchTotal = doesStrMatchKeywords(searchStringSource + searchStringGroup, keywords);

    if (!matchSource && matchGroup) {
      // If the group matches but not the source itself, there is no need to show the specific
      // source in the results.
      resultsList.push(source.sourceGroup);
    } else if (matchSource || matchTotal) {
      resultsList.push(source);
      if (source.sourceGroup) {
      }
    }
  });

  // Remove duplicate source groups.
  // Example 1: a source group was added twice AND one of its entries was added. Only the entry
  //    should remain.
  // Example 2: three entries were added from one source group. No change.
  // Example 3: a source group was added twice and none of its entries were added. Remove the
  //    duplicate source group and keep the other one.

  const alreadyHaveSourceGroup = {};

  resultsList.filter(source => !source.isGroupMain).forEach(source => {
    if (source.sourceGroup) {
      alreadyHaveSourceGroup[source.sourceGroup._id] = true;
    }
  });

  resultsList = resultsList.filter(source => {
    if (!source.isGroupMain) {
      return true;
    }
    if (alreadyHaveSourceGroup[source._id]) {
      return false;
    }
    alreadyHaveSourceGroup[source._id] = true;
    return true;
  });

  return resultsList;
}

function sortSearchResultsBooks(resultsList) {
  resultsList.trueSort((a, b) => {
    if (a.group != b.group) {
      return a.group < b.group;
    }
    return a.isGroupMain || (a.title < b.title && !b.isGroupMain);
  });
}

function renderSearchResultsBooks(resultsList, keywords) {
  rend('<h2>Books</h2>');

  let previousBookGroup = null;

  resultsList.forEach((source, i) => {

    let linkText;

    if (previousBookGroup != source.group) {
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

    if (source.isGroupMain && source.summary) {
      rend(
        '<p style="padding: 2px;" class="search-result-item">' +
          '<i>' + source.summary + '</i>' +
        '</p>'
      );
    }

    if (source.sourceGroup && source.sourceGroup.summary) {
      rend(
        '<p style="padding: 2px;" class="search-result-item">' +
          '<i>' + source.sourceGroup.summary + '</i>' +
        '</p>'
      );
    }
  });
}
