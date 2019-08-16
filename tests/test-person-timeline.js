
test(t => {
  const testPerson = {
    _id: '0001',
    name: 'Test Person 1',
  };

  const testEventDeath = {
    _id: 'aaa1',
    title: 'death',
  };

  DATABASE.people = [testPerson];
  DATABASE.events = [testEventDeath];

  t.stubDatabase();

  let timeline;

  t.setTitle('person timeline');
  t.setTitle2('events');

  testEventDeath.people = [];
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
    timeline.list.length == 1 && timeline.list[0]._id == 'aaa1'
  );
  t.assertEqual('add a note to person death event if it has a location but not a date',
    true,
    timeline.list[0].date.format == 'date unknown' && timeline.list[0]._id == 'aaa1'
  );
  t.assertEqual('add a sorting value to person death event if it has a location but not a date',
    true,
    timeline.list[0].date.sort == '3000-00-00' && timeline.list[0]._id == 'aaa1'
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

  let timeline, tempSaveValue;

  t.stubDatabase();

  t.setTitle('person timeline family events');

  // timeline.shouldIncludeFamilyEvent arguments: relative, relationship, item

  t.setTitle2('parents');

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
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include parent death if person\'s death date is null',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'death';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude parent death if after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  t.setTitle2('siblings');

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

  testEvent.title = 'birth';
  testEvent.date.year = 1910;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include sibling birth if after person\'s birth but death date is null',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'death';
  testEvent.date.year = 1910;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include sibling death if after person\'s birth but death date is null',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'sibling', testEvent),
  );
  testPerson1.death = tempSaveValue;

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

  t.setTitle2('spouses');

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

  t.setTitle2('children');

  testEvent.title = 'birth';
  timeline = new PersonTimeline(testPerson1, true);
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
  testEvent.date.year = 1984;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('include child death if after person\'s birth but death date is null',
    true,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'death';
  testEvent.date.year = 1986;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude child death if more than 5 years after person\'s death',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'historical event';
  testEvent.date.year = 1950;
  testEvent.tags = { historical: true };
  timeline = new PersonTimeline(testPerson1, true);
  t.assertEqual('exclude historical child events even if during person\'s life',
    false,
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
  testEvent.tags = {};

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

  t.setTitle2('other');

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

  testItemSource.type = 'other source type';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to source type for all other sources',
    'other source type',
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

  t.setTitle2('item text');

  testItemSource.summary = 'info1\ninfo2';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is an array for sources with a summary',
    ['info1', 'info2'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = '';
  testItemSource.sourceGroup = {};
  testItemSource.sourceGroup.summary = 'info3\ninfo4';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is an array for sources with a source group summary',
    ['info3', 'info4'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = 'info1\ninfo2';
  testItemSource.sourceGroup = {};
  testItemSource.sourceGroup.summary = 'info3\ninfo4';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is a combined array for sources with a summary and a group summary',
    ['info3', 'info4', 'info1', 'info2'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = '';
  testItemSource.sourceGroup = {};
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is an empty array for sources without any summary',
    [],
    timelineItem.getItemText(),
  );

  testItemPersonalEvent.notes = 'notes1\nnotes2';
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('item text is an array for personal events with notes',
    ['notes1', 'notes2'],
    timelineItem.getItemText(),
  );

  testItemFamilyEvent.notes = 'notes3\nnotes4';
  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('item text is an array for family events with notes',
    ['notes3', 'notes4'],
    timelineItem.getItemText(),
  );

  testItemPersonalEvent.notes = '';
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('item text is an empty array for personal events with no notes',
    [],
    timelineItem.getItemText(),
  );

  testItemFamilyEvent.notes = '';
  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('item text is an empty array for family events with no notes',
    [],
    timelineItem.getItemText(),
  );

  t.setTitle2('people list');

  testItemSource.people = [];
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('always show people list for sources',
    true,
    timelineItem.shouldShowPeople(),
  );

  testItemFamilyEvent.people = [];
  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('always show people list for family events',
    true,
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}, { name: 'test person 2'}];
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('show people list for personal events if there are multiple people in the list',
    true,
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}];
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('do not show people list for personal events with only 1 person',
    false,
    timelineItem.shouldShowPeople(),
  );

  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertEqual('show people above item text for family events',
    true,
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertEqual('show people below item text for personal events',
    false,
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('show people below item text for sources',
    false,
    timelineItem.shouldDisplayPeopleAboveText(),
  );
});
