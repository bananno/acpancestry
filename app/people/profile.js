
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

  showPersonProfileSummary(person);
  showPersonBiographies(person);
  showPersonFamily(person);
  showPersonDescendants(person);

  rend('<h2>Tree</h2>');
  rend('<div class="person-tree">' + personTree(person) + '</div>');

  if (person.links.length) {
    rend('<h2>Links</h2>');
    person.links.forEach(nextLink => {
      rend(getFancyLink(nextLink));
    });
  }

  showPersonResearchNotes(person);
  showPersonArtifacts(person);
  showPersonTimeline(person);

  if (person.citations.length) {
    rend('<h2>Citations</h2>');
    rend($makeCitationList(person.citations));
  }
}

function showPersonHeader(person) {
  let pageTitle = removeSpecialCharacters(person.name);

  if (person.birth || person.death) {
    pageTitle += ' (' +
      ((person.birth ? person.birth.date.year : ' ') || ' ') + '-' +
      ((person.death ? person.death.date.year : ' ') || ' ') + ')';
  }

  setPageTitle(pageTitle);

  rend(
    '<div class="person-header">' +
      '<img src="' + person.profileImage + '">' +
      '<div class="person-header-content">' +
        '<h1>' +
          fixSpecialCharacters(person.name) +
          (person.star ? '&#160;<img src="images/leaf.png" style="height:40px">' : '') +
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

function showPersonProfileSummary(person) {
  DATABASE.notations.filter(notation => {
    return notation.title == 'profile summary'
      && notation.people.includes(person);
  }).forEach(notation => {
    notation.text.split('\n').forEach(s => {
      rend('<p style="margin-top: 20px;">' + s + '</p>');
    });
  });
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

  const isRelative = {};
  const siblings = [...person.siblings];

  person.parents.forEach(rel => isRelative[rel._id] = true);
  person.children.forEach(rel => isRelative[rel._id] = true);

  ['step-parents', 'step-siblings', 'half-siblings', 'siblings', 'step-children']
    .forEach(rel => person[rel] = []);

  siblings.forEach(sibling => {
    if (person.parents.length == 2 && sibling.parents.length == 2
        && person.parents[0] == sibling.parents[0] && person.parents[1] == sibling.parents[1]) {
      person.siblings.push(sibling);
    } else {
      person['half-siblings'].push(sibling);
    }
    isRelative[sibling._id] = true;
  });

  person.parents.forEach(parent => {
    parent.spouses.forEach(parent => {
      if (!isRelative[parent._id]) {
        person['step-parents'].push(parent);
        parent.children.forEach(sibling => {
          if (!isRelative[sibling._id]) {
            person['step-siblings'].push(sibling);
          }
        });
      }
    })
  });

  person.spouses.forEach(spouse => {
    spouse.children.forEach(child => {
      if (!isRelative[child._id]) {
        person['step-children'].push(child);
      }
    });
  });

  ['parents', 'step-parents', 'siblings', 'step-siblings', 'half-siblings', 'spouses',
    'children', 'step-children'].forEach(relationship => {
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

function showPersonDescendants(person) {
  const addDesc = (person, gen) => {
    descendants[gen] = descendants[gen] || [];
    descendants[gen].push(person);
    person.children.forEach(child => addDesc(child, gen + 1));
  };

  const descendants = [];
  addDesc(person, 0);

  if (descendants.length < 3) {
    return;
  }

  h2('Descendants');

  descendants.slice(2).forEach((list, gen) => {
    let relationship = (() => {
      if (gen == 0) {
        return 'grandchildren';
      }
      if (gen == 1) {
        return 'great-grandchildren';
      }
      return gen + '-great-grandchildren';
    })();

    if (list.length == 1) {
      relationship = relationship.replace('ren', '');
    }

    const $box = $('<div class="person-family descendants">');
    $box.append(`<h3>${relationship}:</h3>`);
    $box.append($makePeopleList(list, 'photo'));
    rend($box);
  });
}

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
    return '<div class="treecell unknown">' + ['father', 'mother'][n] + ' unknown</div>';
  }

  return (
    '<table' + treeStyle + '>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.parents[0], safety + 1, 0) +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.parents[1], safety + 1, 1) +
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

function showPersonResearchNotes(person) {
  const notations = DATABASE.notations.filter(note => {
    return note.people.includes(person) && note.tags['research notes'];
  });

  if (notations.length == 0) {
    return;
  }

  h2('Research Notes');

  notations.forEach((notation, i) => {
    if (i > 0) {
      rend('<hr>');
    }
    rend($notationBlock(notation));
  });
}

function showPersonArtifacts(person) {
  const stories = DATABASE.stories.filter(story => {
    return story.people.includes(person) && story.type == 'artifact';
  });

  if (stories.length == 0) {
    return;
  }

  h2('Artifacts');

  stories.forEach((story, i) => {
    artifactBlock(story, {
      firstItem: i == 0,
      largeHeader: false,
      people: story.people.filter(p => p != person),
    });
  });
}
