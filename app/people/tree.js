function personTree(person, safety, parent) {
  let treeStyle = '';

  if (safety == undefined) {
    safety = 0;
  } else {
    treeStyle = ' style="min-width: 100%;"';
  }

  if (safety > 20) {
    console.log('Tree safety exceeded');
    return '[error]';
  }

  if (person == null) {
    return '<div class="treecell unknown">unknown ' + parent + '</div>';
  }

  return (
    '<table' + treeStyle + '>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.father, safety + 1, 'father') +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.mother, safety + 1, 'mother') +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td colspan="2">' +
          '<div class="treecell">' +
            linkToPerson(person, true) +
          '</div>' +
        '</td>' +
      '</tr>' +
    '</table>'
  );
}
