
const database = require('../database/data.js');

let searchArr = [];

const processSearchInput = (searchStr) => {
  searchStr = searchStr.toLowerCase().trim();
  if (searchStr == '') {
    return [];
  }
  return searchStr.split(' ');
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
  let tempTitle = event.title.toLowerCase();

  for (let i in searchArr) {
    if (!tempTitle.match(searchArr[i])) {
      return false;
    }
  }

  return true;
}

const getSearchResults = (searchStr) => {
  searchArr = processSearchInput(searchStr);

  if (searchArr.length == 0) {
    return {
      people: [],
      events: [],
      sources: [],
    };
  }

  return {
    people: database.people.filter(includePerson),
    events: database.events.filter(includeEvent),
    sources: [],
  };
};

module.exports = getSearchResults;
