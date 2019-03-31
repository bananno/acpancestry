
function citationList(citations) {
  const $table = $('<table class="citation-list">');

  $table.append('<tr><th colspan="2">item</th><th>information</th><th>source</th></tr>');

  citations.forEach(citation => {
    let citationSourceText = citation.source.group + ' - ' + citation.source.title;
    $table.append(
      '<tr>' +
        '<td>' + citation.item + '</td>' +
        '<td>' + '</td>' +
        '<td>' + citation.information + '</td>' +
        '<td>' + linkToSource(citation.source, citationSourceText) + '</td>' +
      '</tr>'
    );
  });

  return $table;
}
