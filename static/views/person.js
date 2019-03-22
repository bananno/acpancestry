
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
  rend(personTree(person));

  rend('<h2>Links</h2>');
}

function personTree(person) {
  if (person == null) {
    return '';
  }

  return (
    '<table border="1">' +
      '<tr>' +
        `<td>${personTree(person.parents[0])}</td>` +
        `<td>${personTree(person.parents[1])}</td>` +
      '</tr>' +
      '<tr>' +
        `<td colspan="2">${person.name}</td>` +
      '</tr>' +
    '</table>'
  );
}
