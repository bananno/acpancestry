var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/people', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/events', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/sources', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/person/:personId', function(req, res, next) {
  let personId = req.params.personId;
  let currentPerson = database.people.filter(nextPerson => {
    return nextPerson.customId == personId;
  })[0];
  res.render('person', {
    title: 'Person!',
    database: database,
    person: currentPerson,
  });
});

module.exports = router;
