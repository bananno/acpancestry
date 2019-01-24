
const database = require('../database/data.js');

let searchArr = [];

const processSearchInput = (searchStr) => {
  searchArr = searchStr.toLowerCase().split(' ');
}

const includePerson = (person) => {
  let tempName = person.name.toLowerCase();

  for (let i in searchArr) {
    if (!tempName.match(searchArr[i])) {
      return false;
    }
  }

  return true;
}

const includeEvent = (event) => {
  return false;
}

const getSearchResults = (searchStr) => {
  processSearchInput(searchStr);

  return {
    people: database.people.filter(includePerson),
    events: database.events.filter(includeEvent),
    sources: [],
  };
};

module.exports = getSearchResults;
