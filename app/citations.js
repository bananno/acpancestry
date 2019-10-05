const CITATION_LIST_ORDER = [
  'name',
  'birth',
  'christening',
  'baptism',
  'father',
  'mother',
  'marriage',
  'marriage - spouse',
  'marriage 1',
  'marriage 1 - spouse',
  'marriage 2',
  'marriage 2 - spouse',
  'spouse',
  'divorce',
  'immigration',
  'naturalization',
  'death',
  'funeral',
  'burial',
  'obituary',
  'residence',
];

class Citation {
  static renderList(citations) {
    rend(Citation.$makeList(citations));
  }

  static $makeList(citations) {
    Citation.sortList(citations);

    const $table = $('<table class="citation-list cover-background">');

    $table.append('<tr><th colspan="2">item</th><th>information</th><th>source</th></tr>');

    let [previousItem1, previousItem2] = [null, null];

    citations.forEach(citation => {
      let [item1, item2] = [citation.item, ''];

      if (item1.match(' - ')) {
        item2 = item1.slice(item1.indexOf(' - ') + 3);
        item1 = item1.slice(0, item1.indexOf(' - '));
      }

      const $row = $('<tr>').appendTo($table);

      $table.append(
        '<tr>' +
          '<td class="repeat-' + (previousItem1 == item1) + '">' +
            item1 +
          '</td>' +
          '<td class="repeat-' + (previousItem1 == item1 && previousItem2 == item2) + '">' +
            item2 +
          '</td>' +
          '<td>' + citation.information + '</td>' +
          '<td>' +
            linkToSource(citation.source, citation.source.fullTitle) +
          '</td>' +
        '</tr>'
      );

      previousItem1 = item1;
      previousItem2 = item2;
    });

    return $table;
  }

  static sortList(citations) {
    citations.forEach(citation => {
      if (citation.sort) {//temp
        return;
      }
      citation.sort = citation.sort || Citation.getSortValue(citation);
      // citation.item = citation.sort;//temp
    });

    citations.sortBy(citation => citation.sort);
  }

  static getSortValue(citation) {
    return (() => {
      let item = citation.item, index;
      index = CITATION_LIST_ORDER.indexOf(item);
      if (index >= 0) {
        return pad0(index, 2) + '-0';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - name', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-1';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - date', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-2';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - place', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-3';
      }
      index = CITATION_LIST_ORDER.indexOf(item.split(' - ')[0]);
      if (index >= 0) {
        return pad0(index, 2) + '-4';
      }
      return CITATION_LIST_ORDER.length;
    })() + ' - ' + citation.item + ' - ' + citation.information;
  }
}
