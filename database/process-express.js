
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
  person.events = [];
});

data.events.forEach(event => {
  event.people = event.people.map(person => {
    person = data.peopleRef[person];
    if (person == null || person.private) {
      return null;
    }
    person.events.push(event);
    return person;
  });
  event.people = event.people.filter(person => person != null);
});

data.events = data.events.filter(event => event.people.length > 0);

data.people.forEach(person => {
  person.birth = person.events.filter(event => event.title == 'birth')[0];
  person.death = person.events.filter(event => event.title == 'death')[0];
});

module.exports = data;