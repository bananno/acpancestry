var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    database: database,
  });
});

router.get('/person/:personId', function(req, res, next) {
  let currentPerson = database.people[0];
  res.render('person', {
    title: 'Person!',
    database: database,
    person: currentPerson,
  });
});

module.exports = router;
