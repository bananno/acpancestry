
function processDatabase() {
  DATABASE.people = DATABASE.people.map(getProcessedPerson);
}

function getProcessedPerson(person) {
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(findPersonByRealId);
    person[relationship] = person[relationship].filter(otherPerson => otherPerson != null);
  });

  return person;
}

function findPersonByRealId(personId) {
  return DATABASE.people.filter(person => personId == person._id)[0];
}
