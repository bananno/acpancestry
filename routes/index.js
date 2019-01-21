var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Lundberg Ancestry',
    people: database.people,
  });
});

module.exports = router;
