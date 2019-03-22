
function processDatabase() {
  DATABASE.personRef = {};

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    DATABASE.personRef[person.customId] = person;
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);
}

function getProcessedPerson(person) {
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = person[relationship].filter(otherPerson => otherPerson != null);
  });

  return person;
}
