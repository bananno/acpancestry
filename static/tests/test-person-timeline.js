
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

test(t => {
  const testItemSource = {
    source: true,
    event: false,
    relationship: null,
    personal: false,
  };

  const testItemPersonalEvent = {
    source: false,
    event: true,
    relationship: null,
    personal: true,
    title: 'some event',
  };

  const testItemFamilyEvent = {
    source: false,
    event: true,
    relationship: 'parent',
    personal: false,
    title: 'death',
  };

  let timelineItem;

  t.stubDatabase();

  t.setTitle('person timeline items');

  t.setTitle2('item class');

  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be "timeline-source" for all sources',
    'timeline-source',
    timelineItem.getItemClass(),
  );

  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('should be "timeline-life" for personal life events',
    'timeline-life',
    timelineItem.getItemClass(),
  );

  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('should be "timeline-family" for family events',
    'timeline-family',
    timelineItem.getItemClass(),
  );

  t.setTitle2('item title');

  testItemSource.type = 'index';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "source" for index-type sources',
    'source',
    timelineItem.getItemTitle(),
  );

  testItemSource.type = 'grave';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "cemetery" for grave-type sources',
    'cemetery',
    timelineItem.getItemTitle(),
  );

  testItemSource.type = 'newspaper';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "newspaper article" for newspaper-type sources',
    'newspaper article',
    timelineItem.getItemTitle(),
  );

  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('should be equal to the event title for personal events',
    'some event',
    timelineItem.getItemTitle(),
  );

  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('should be "(title) of (relationship)" for family events',
    'death of parent',
    timelineItem.getItemTitle(),
  );
});
