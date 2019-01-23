var express = require('express');
var router = express.Router();

const database = require('../database/data.js');

router.get('/:personId', function(req, res, next) {
  let personId = req.params.personId;
  let currentPerson = database.people.filter(nextPerson => {
    return nextPerson.customId == personId;
  })[0];
  res.render('layout', {
    view: 'people/layout',
    subview: 'summary',
    title: currentPerson.name,
    database: database,
    person: currentPerson,
  });
});

module.exports = router;
