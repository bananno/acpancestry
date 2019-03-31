const citationItemOrder = [
  'name',
  'birth',
  'christening',
  'baptism',
  'marriage',
  'marriage - spouse',
  'marriage 1',
  'marriage 1 - spouse',
  'marriage 2',
  'marriage 2 - spouse',
  'divorce',
  'immigration',
  'naturalization',
  'death',
  'funeral',
  'obituary',
  'residence',
];

function $makeCitationList(citations) {
  citations = sortCitations(citations);

  const $table = $('<table class="citation-list">');

  $table.append('<tr><th colspan="2">item</th><th>information</th><th>source</th></tr>');

  citations.forEach(citation => {
    let [item1, item2] = [citation.item, ''];
    let citationSourceText = citation.source.group + ' - ' + citation.source.title;

    if (item1.match(' - ')) {
      item2 = item1.slice(item1.indexOf(' - ') + 3);
      item1 = item1.slice(0, item1.indexOf(' - '));
    }

    $table.append(
      '<tr>' +
        '<td>' + item1 + '</td>' +
        '<td>' + item2 + '</td>' +
        '<td>' + citation.information + '</td>' +
        '<td>' + linkToSource(citation.source, citationSourceText) + '</td>' +
      '</tr>'
    );
  });

  return $table;
}

function sortCitations(citationList, endPoint) {
  let madeChange = false;
  endPoint = endPoint || citationList.length - 1;

  for (let i = 0; i < endPoint; i++) {
    const citation1 = citationList[i];
    const citation2 = citationList[i + 1];

    if (citationsShouldSwap(citation1, citation2)) {
      madeChange = true;
      citationList[i] = citation2;
      citationList[i + 1] = citation1;
    }
  }

  if (madeChange) {
    return sortCitations(citationList, endPoint - 1);
  }

  return citationList;
}

function citationsShouldSwap(citation1, citation2) {
  return compareItems(citation1.item, citation2.item,
    citation1.information, citation2.information);
}

function compareItems(item1, item2, information1, information2) {
  for (let i = 0; i < citationItemOrder.length; i++) {
    if (item1 == item2) {
      return information1 > information2;
    }

    if (item1 == citationItemOrder[i]) {
      return false;
    }

    if (item2 == citationItemOrder[i]) {
      return true;
    }

    if (item1 == citationItemOrder[i] + ' - date') {
      return false;
    }

    if (item2 == citationItemOrder[i] + ' - date') {
      return true;
    }

    if (item1 == citationItemOrder[i] + ' - place') {
      return false;
    }

    if (item2 == citationItemOrder[i] + ' - place') {
      return true;
    }

    if (item1.match(citationItemOrder[i])) {
      return false;
    }

    if (item2.match(citationItemOrder[i])) {
      return true;
    }
  }

  return item1 > item2;
}
