
const database = require('../database/process-express.js');

let searchArr = [];

const processSearchInput = (searchStr) => {
  searchStr = searchStr.toLowerCase().trim();
  if (searchStr == '') {
    return [];
  }
  return searchStr.split(' ');
}

const includePerson = (person) => {
  let tempTest = person.name.toLowerCase();

  for (let i in searchArr) {
    if (searchArr[i].slice(0, 1) == '-') {
      if (tempTest.match(searchArr[i].slice(1))) {
        return false;
      }
    } else if (!tempTest.match(searchArr[i])) {
      return false;
    }
  }

  return true;
}

const includeEvent = (event) => {
  let tempTest = event.title.toLowerCase();

  for (let i in searchArr) {
    if (searchArr[i].slice(0, 1) == '-') {
      if (tempTest.match(searchArr[i].slice(1))) {
        return false;
      }
    } else if (!tempTest.match(searchArr[i])) {
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
