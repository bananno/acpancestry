
function viewPerson() {
  const personId = PATH.replace('person/', '');
  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  showPersonHeader(person);
  showPersonFamily(person);

  rend('<h2>Tree</h2>');
  rend('<div class="person-tree">' + personTree(person) + '</div>');

  if (person.links.length) {
    rend('<h2>Links</h2>');
    person.links.forEach(nextLink => {
      rend(getFancyLink(nextLink));
    });
  }

  showPersonTimeline(person);

  if (person.citations.length) {
    rend('<h2>Citations</h2>');
    rend($makeCitationList(person.citations));
  }
}

function showPersonHeader(person) {
  setPageTitle(removeSpecialCharacters(person.name));

  rend(
    '<div class="person-header">' +
      '<img src="' + person.profileImage + '">' +
      '<div class="person-header-content">' +
        '<h1>' +
          fixSpecialCharacters(person.name) +
          (person.star ? '&#160;<img src="public/images/leaf.png" style="height:40px">' : '') +
        '</h1>' +
        personShowHeaderEvent(person, 'B', person.birth) +
        personShowHeaderEvent(person, 'D', person.death) +
      '</div>' +
    '</div>'
  );

  if (person.private) {
    rend('<p class="person-summary">Some information is hidden to protect the ' +
      'privacy of living people.</p>');
  }
}

function personShowHeaderEvent(person, abbr, event) {
  if (person.private || event === undefined) {
    return '';
  }

  return (
    '<div class="person-header-events">' +
      '<div><b>' + abbr + ':</b></div>' +
      '<div>' + formatDate(event.date) + '</div>' +
      (event.location.format ? (
        '<br>' +
        '<div>&#160;</div>' +
        '<div>' + event.location.format + '</div>'
      ) : '') +
    '</div>'
  );
}

function showPersonFamily(person) {
  rend('<h2>Family</h2>');

  ['parents', 'siblings', 'spouses', 'children'].forEach(relationship => {
    if (person[relationship].length == 0) {
      return;
    }

    const $box = $('<div class="person-family">');
    $box.append(`<h3>${relationship}:</h3>`);
    $box.append($makePeopleList(person[relationship], 'photo'));
    rend($box);
  });
}

function personTree(person, safety) {
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
    return '';
  }

  return (
    '<table' + treeStyle + '>' +
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
            linkToPerson(person, true) +
          '</div>' +
        '</td>' +
      '</tr>' +
    '</table>'
  );
}
