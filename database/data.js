
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

module.exports = data;
