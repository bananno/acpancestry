var express = require('express');
var router = express.Router();

const database = require('../database.js');

router.get('/:personId', function(req, res, next) {
  let personId = req.params.personId;
  let currentPerson = database.people.filter(nextPerson => {
    return nextPerson.customId == personId;
  })[0];
  res.render('person', {
    database: database,
    person: currentPerson,
  });
});

module.exports = router;
