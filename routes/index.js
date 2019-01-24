var express = require('express');
var router = express.Router();

const database = require('../database/data.js');
const getSearchResults = require('../tools/searchResults.js');

router.get('/', function(req, res, next) {
  res.render('layout', {
    view: 'index',
    title: null,
    database: database,
  });
});

router.get('/people', function(req, res, next) {
  res.render('layout', {
    view: 'people/index',
    title: 'People',
    database: database,
  });
});

router.get('/events', function(req, res, next) {
  res.render('layout', {
    view: 'events',
    title: 'Events',
    database: database,
  });
});

router.get('/sources', function(req, res, next) {
  res.render('layout', {
    view: 'sources',
    title: 'Sources',
    database: database,
  });
});

router.post('/search', function(req, res, next) {
  let searchStr = req.body.search;
  res.render('layout', {
    view: 'search',
    title: 'Search',
    search: searchStr,
    searchResults: getSearchResults(searchStr),
  });
});

module.exports = router;
