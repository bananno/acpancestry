
const database = require('../database/data.js');

const getSearchResults = (searchStr) => {
  return {
    people: [],
    events: [],
    sources: [],
  };
};

module.exports = getSearchResults;
