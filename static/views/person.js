
function viewPerson() {
  let personId = PATH.replace('person/', '');

  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  setPageTitle(person.name);

  rend(`<h1>${person.name}</h1>`);

  rend('<h2>Family</h2>');

  ['parents', 'spouses', 'children'].forEach(relationship => {
    if (person[relationship].length == 0) {
      return;
    }
    const $box = $('<div class="person-family">');
    $box.append(`<h3>${relationship}:</h3>`);
    $box.append($makePeopleList(person[relationship]));
    rend($box);
  });

  rend('<h2>Tree</h2>');
  rend('<div class="person-tree">' + personTree(person) + '</div>');

  rend('<h2>Links</h2>');
}

function personTree(person, safety) {
  safety = safety || 0;

  if (safety > 20) {
    console.log('Tree safety exceeded');
    return '[error]';
  }

  if (person == null) {
    return '';
  }

  return (
    '<table>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.parents[0], safety + 1) +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.parents[1], safety + 1) +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td colspan="2">' +
          '<div class="treecell">' +
            linkToPerson(person) +
          '</div>' +
        '</td>' +
      '</tr>' +
    '</table>'
  );
}
