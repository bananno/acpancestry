
function processDatabase() {
  DATABASE.personRef = {};

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    DATABASE.personRef[person.customId] = person;
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);
  DATABASE.people.forEach(addPersonChildSiblings);

  DATABASE.events = DATABASE.events.map(getProcessedEvent);

  DATABASE.sources = DATABASE.sources.map(getProcessedSource);
}

function getProcessedPerson(person) {
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = removeNullValues(person[relationship]);
  });

  person.siblings = [];
  person.links = person.links || [];

  person.profileImage = person.profileImage || 'public/images/generic-profile-picture.png';

  return person;
}

function addPersonChildSiblings(person) {
  person.children.forEach((sibling1, i) => {
    const otherSiblings = person.children.slice(i + 1);
    otherSiblings.forEach(sibling2 => {
      if (sibling1.siblings.indexOf(sibling2) === -1) {
        sibling1.siblings.push(sibling2);
        sibling2.siblings.push(sibling1);
      }
    });
  });
}

function getProcessedEvent(event) {
  event.people = event.people.map(person => {
    person = DATABASE.personRef[person];

    if ((event.title === 'birth' || event.title === 'death')
        && person[event.title] === undefined) {
      person[event.title] = event;
    } else if (event.title === 'birth and death') {
      person.birth = person.birth || event;
      person.death = person.death || event;
    }

    return person;
  });

  event.location = event.location || {};
  event.location.format = formatLocation(event.location);

  return event;
}

function getProcessedSource(source) {
  source.people = source.people.map(person => {
    return DATABASE.personRef[person];
  });

  source.people = removeNullValues(source.people);

  source.location = source.location || {};
  source.location.format = formatLocation(source.location);

  return source;
}

function removeNullValues(array) {
  return array.filter(value => value != null);
}
