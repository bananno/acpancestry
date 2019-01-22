var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/people', function(req, res, next) {
  res.render('people', {
    database: database,
  });
});

router.get('/events', function(req, res, next) {
  res.render('events', {
    database: database,
  });
});

router.get('/sources', function(req, res, next) {
  res.render('sources', {
    database: database,
  });
});

module.exports = router;
