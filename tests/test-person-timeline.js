(() => {

test(t => {
  const testPersonTemplate = t.fakePerson();
  const testEventDeath = t.fakeEvent({ title: 'death' });

  t.stubDatabase();

  const testPerson = Person.create(testPersonTemplate, true);

  testPerson.populateFamily();

  let timeline;

  t.setTitle('person timeline');
  t.setTitle2('events');

  testPerson.death = null;
  timeline = new PersonTimeline(testPerson, true);
  timeline.createEventList();
  t.assertEqual('add an empty death event if person death is null',
    'added-death-event',
    timeline.list[0] ? timeline.list[0]._id : null,
  );

  testEventDeath.people = [testPerson];
  testEventDeath.date = null;
  testEventDeath.location = { country: 'USA' };
  testPerson.death = testEventDeath;
  timeline = new PersonTimeline(testPerson, true);
  timeline.createEventList();
  t.assertEqual('do not add an empty death event if person death event exists without a date',
    true,
    timeline.list.length == 1 && timeline.list[0]._id == testEventDeath._id
  );
  t.assertEqual('add a note to person death event if it has a location but not a date',
    true,
    timeline.list[0].date.format == 'date unknown' && timeline.list[0]._id == testEventDeath._id
  );
  t.assertEqual('add a sorting value to person death event if it has a location but not a date',
    true,
    timeline.list[0].date.sort == '3000-00-00' && timeline.list[0]._id == testEventDeath._id
  );

  testEventDeath.people = [testPerson];
  testEventDeath.date = { year: 1915 };
  testEventDeath.location = null;
  testPerson.death = testEventDeath;
  timeline = new PersonTimeline(testPerson, true);
  timeline.createEventList();
  t.assertEqual('do not add an empty death event if person death date is available',
    false,
    timeline.list.map(item => item.mod).includes('added-death-event'),
  );
});

})();
