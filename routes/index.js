var express = require('express');
var router = express.Router();

const database = require('../database/data.js');

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

module.exports = router;
