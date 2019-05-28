
test(t => {
  const testPerson1 = {
    name: 'Test Person 1',
    customId: 'TestPerson1',
    _id: '0001',
    birth: { date: { year: 1900, month: 1, day: 1 }},
    death: { date: { year: 1980, month: 1, day: 1 }},
  };

  const testPerson2 = {
    name: 'Test Person 2',
    customId: 'TestPerson2',
    _id: '0002',
  };

  const testEvent = {
    people: [testPerson2],
    date: { year: 1920, month: 1, day: 1 },
  };

  t.stubDatabase();

  t.setTitle('Person timeline family events');

  // shouldIncludeTimelineFamilyItem arguments: person, list, relative, relationship, item

  // CHILD EVENTS

  testEvent.title = 'birth';
  t.assertEqual('Person timeline includes child birth.',
    true,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1950;
  t.assertEqual('Person timeline includes child death if during person\'s life.',
    true,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1984;
  t.assertEqual('Person timeline includes child death if within 5 years of person\'s life.',
    true,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1986;
  t.assertEqual('Person timeline excludes child death if more than 5 years after person\'s death.',
    false,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'child', testEvent),
  );

  // SPOUSE EVENTS

  testEvent.title = 'birth';
  testEvent.date.year = 1890;
  t.assertEqual('Person timeline includes spouse birth.',
    true,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1990;
  t.assertEqual('Person timeline includes spouse death.',
    true,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1920;
  t.assertEqual('Person timeline excludes other spouse events.',
    false,
    shouldIncludeTimelineFamilyItem(testPerson1, [], testPerson2, 'spouse', testEvent),
  );
});
