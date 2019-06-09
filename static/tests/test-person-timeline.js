
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

  let timeline;

  t.stubDatabase();

  t.setTitle('Person timeline family events');

  // timeline.shouldIncludeFamilyEvent arguments: relative, relationship, item

  t.setTitle2('Parents');

  testEvent.title = 'birth';
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude parent birth',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1899;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include parent death if before person\'s birth',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include parent death if during person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude parent death if after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  t.setTitle2('Siblings');

  testEvent.title = 'birth';
  testEvent.date.year = 1910;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include sibling birth if during person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1910;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include sibling death if during person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1910;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude other sibling events during person\'s life',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'birth';
  testEvent.date.year = 1899;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude sibling birth if before person\'s birth',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1899;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude sibling death if before person\'s birth',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'birth';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude sibling birth if after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude sibling death if after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );

  t.setTitle2('Spouses');

  testEvent.title = 'birth';
  testEvent.date.year = 1890;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include spouse birth',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1990;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include spouse death',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1920;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude other spouse events',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  t.setTitle2('Children');
  timeline = new PersonTimeline(testPerson1, true);

  testEvent.title = 'birth';
  t.assertEqual('include child birth',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include child death if during person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1984;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include child death if within 5 years of person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1986;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude child death if more than 5 years after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include other child events if during person\'s life',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude other child events if after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  t.setTitle2('Other');

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include family events that are not yet in the timeline list',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  timeline.list = [testEvent];
  t.assertEqual('exclude family events that are already added to the list',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
});
