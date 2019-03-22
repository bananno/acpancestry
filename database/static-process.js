
function processDatabase() {
  DATABASE.personRef = {};

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    DATABASE.personRef[person.customId] = person;
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);
  DATABASE.events = DATABASE.events.map(getProcessedEvent);
}

function getProcessedPerson(person) {
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = removeNullValues(person[relationship]);
  });

  return person;
}

function getProcessedEvent(event) {
  event.people = event.people.map(person => {
    person = DATABASE.personRef[person];

    if (person && (event.title === 'birth' || event.title === 'death')) {
      if (person[event.title] === undefined) {
        person[event.title] = event;
      }
    }

    return person;
  });

  event.people = removeNullValues(event.people);

  return event;
}

function removeNullValues(array) {
  return array.filter(value => value != null);
}
