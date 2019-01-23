
const data = require('./raw.js');
let relationshipTypes = ['parents', 'spouses', 'children'];

data.peopleRef = {};

data.people.forEach(person => {
  data.peopleRef[person._id] = person;
});

data.people.forEach(person => {
  relationshipTypes.forEach(rel => {
    person[rel] = person[rel].map(relative => data.peopleRef[relative] || null)
    person[rel] = person[rel].filter(relative => relative != null);
  });
});

data.events.forEach(event => {
  event.people = event.people.map(person => {
    person = data.peopleRef[person];
    if (person == null || person.private) {
      return null;
    }
    return person;
  });
  event.people = event.people.filter(person => person != null);
});

module.exports = data;
