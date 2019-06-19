
function viewPerson() {
  const personId = PATH.replace('person/', '');
  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  showPersonHeader(person);
  showPersonBiographies(person);
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

function showPersonBiographies(person) {
  const bios = DATABASE.sources.filter(source => {
    return source.people[0] == person && source.tags.biography;
  });

  if (bios.length == 0) {
    return;
  }

  rend('<h2>Biography</h2>');

  bios.forEach((source, i) => {
    rend(
      '<div style="margin-left: 12px;' + (i > 0 ? 'margin-top:15px' : '') + '">' +
        '<p>' +
          '<b>' + source.group + '</b>' +
        '</p>' +
        '<p style="margin-top: 8px">' +
          source.content.slice(0, 500) +
          '... <i>' + localLink('source/' + source._id, 'continue reading') + '</i>' +
        '</p>' +
      '</div>'
    );
  });
}

function showPersonFamily(person) {
  rend('<h2>Family</h2>');

  ['parents', 'siblings', 'spouses', 'children'].forEach(relationship => {
    if (person[relationship].length == 0) {
      return;
    }

    const $box = $('<div class="person-family">');
    $box.append(`<h3>${relationship}:</h3>`);
    if (relationship == 'siblings' || relationship == 'children') {
      person[relationship].trueSort((a, b) => {
        return a.birthSort < b.birthSort;
      });
    }
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
