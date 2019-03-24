
function viewPerson() {
  let personId = PATH.replace('person/', '');

  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  setPageTitle(removeSpecialCharacters(person.name));

  rend(
    '<div class="person-header">' +
      '<img src="public/images/generic-profile-picture.png">' +
      '<div>' +
        '<h1>' + fixSpecialCharacters(person.name) + '</h1>' +
        personShowHeaderEvent(person, 'B', person.birth) +
        personShowHeaderEvent(person, 'D', person.death) +
      '</div>' +
    '</div>'
  );

  if (person.private) {
    rend('<p class="person-summary">Some information is hidden to protect the ' +
      'privacy of living people.</p>');
  }

  rend('<h2>Family</h2>');

  ['parents', 'siblings', 'spouses', 'children'].forEach(relationship => {
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

  person.links.forEach(nextLink => {
    rend(getFancyLink(nextLink));
  });
}

function personShowHeaderEvent(person, abbr, event) {
  if (person.private || event === undefined) {
    return '';
  }
  return '<p><b>' + abbr + ':</b> ' + formatDate(event.date) + '</p>';
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

function getFancyLink(link) {
  let linkUrl = link;
  let linkText = link;
  let imageName = 'external-link.png';

  if (linkUrl.match(' ')) {
    linkUrl = linkUrl.slice(0, linkUrl.indexOf(' '));
    linkText = linkText.slice(linkText.indexOf(' ') + 1);

    if (linkText == 'Ancestry') {
      imageName = 'logo-ancestry.png';
      linkText = '';
    } else if (linkText == 'FamilySearch') {
      imageName = 'logo-familysearch.png';
      linkText = '';
    } else if (linkText == 'FindAGrave') {
      imageName = 'logo-findagrave.png';
      linkText = '';
    }
  }

  return (
    '<div class="fancy-link">' +
      '<a href="' + linkUrl  + '" target="_blank">' +
        '<img src="public/images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
  );
}
