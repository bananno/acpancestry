function personTree(person, safety, n) {
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
    return '<div class="treecell unknown">unknown '
      + ['father', 'mother'][n] + '</div>';
  }

  // Offset the parents array if the mother is included but not the father.
  let p1 = 0, p2 = 1;
  if (person.parents.length == 1
      && person.parents[0].tags.gender == 'female') {
    p1 = null;
    p2 = 0;
  }

  return (
    '<table' + treeStyle + '>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.parents[p1], safety + 1, 0) +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.parents[p2], safety + 1, 1) +
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
