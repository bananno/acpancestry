
function viewPerson() {
  let personId = PATH.replace('person/', '');
  let subPath;

  if (personId.match('/')) {
    subPath = personId.slice(personId.indexOf('/') + 1);
    personId = personId.slice(0, personId.indexOf('/'));
  }

  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  showPersonHeader(person);

  if (subPath) {
    rend(
      '<p style="margin-left: 10px; margin-top: 10px;">' +
        linkToPerson(person, false, '&#10229; back to profile') +
      '</p>'
    );

    if (subPath.match('source')) {
      const sourceId = subPath.replace('source/', '');
      return viewPersonSource(person, sourceId);
    }

    return pageNotFound();
  }

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
      '<div class="cover-background" ' +
          'style="margin-left: 12px;' + (i > 0 ? 'margin-top:15px' : '') + '">' +
        '<p>' +
          '<b>' + source.group + '</b>' +
        '</p>' +
        '<p style="margin-top: 8px">' +
          source.content.slice(0, 500) +
          '... <i>' +
          localLink('person/' + person.customId + '/source/' + source._id, 'continue reading') +
          '</i>' +
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

function viewPersonSource(person, sourceId) {
  const source = DATABASE.sourceRef[sourceId];

  if (source == null) {
    rend(`<h2>Source not found: ${sourceId}</h2>`);
    return;
  }

  rend('<h2>Biography</h2>');
  rend(formatTranscription(source.content));

  rend('<h2>About this source</h2>');
  rend('<p style="margin-left: 10px;">' + source.type + '</p>');
  rend('<p style="margin-left: 10px;">' + source.group + '</p>');
  rend('<p style="margin-left: 10px;">' + source.title + '</p>');
  rend('<p style="margin-left: 10px;">' + formatDate(source.date) + '</p>');
  rend('<p style="margin-left: 10px;">' + formatLocation(source.location) + '</p>');

  if (source.images.length) {
    rend('<h2>Images</h2>');
    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 200));
    });
  }

  viewSourceSummary(source);
  viewSourceNotes(source);

  if (source.people.length > 1) {
    rend('<h2>Other people in this source</h2>');
    rend($makePeopleList(source.people.filter(p => p != person), 'photo'));
  }

  viewSourceLinks(source);
}
