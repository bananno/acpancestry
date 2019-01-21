var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Lundberg Ancestry',
    people: database.people,
  });
});

router.get('/person/:personId', function(req, res, next) {
  res.render('person', {
    title: 'Person!',
  });
});

module.exports = router;
