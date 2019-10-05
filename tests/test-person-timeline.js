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

test(t => {
  const testItemStory = t.fakeStory();

  const testItemSourceTemplate = t.fakeSource({
    story: testItemStory._id,
  });

  const testItemPersonalEventTemplate = t.fakeEvent({
    title: 'some event',
  });

  const testItemFamilyEventTemplate = t.fakeEvent({
    title: 'death',
  });

  const testItemHistoricalEventTemplate = t.fakeEvent({
    title: 'hist event',
    tags: { 'special historical': true },
  });

  t.stubDatabase();

  let timelineItem;

  const testItemSource = {
    source: true,
    ...testItemSourceTemplate
  }

  const testItemPersonalEvent = {
    event: true,
    personal: true,
    ...testItemPersonalEventTemplate
  }

  const testItemFamilyEvent = {
    event: true,
    relationship: 'parent',
    ...testItemFamilyEventTemplate
  }

  const testItemHistoricalEvent = {
    event: true,
    historical: true,
    ...testItemHistoricalEventTemplate
  }

  t.setTitle2('item class');

  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('should be "timeline-source" for all sources',
    'timeline-source',
    timelineItem.getItemClass(),
  );

  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertEqual('should be "timeline-life" for personal life events',
    'timeline-life',
    timelineItem.getItemClass(),
  );

  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertEqual('should be "timeline-family" for family events',
    'timeline-family',
    timelineItem.getItemClass(),
  );

  timelineItem = new TimelineItem(testItemHistoricalEvent, true, true);
  t.assertEqual('should be "timeline-historical" for historical events',
    'timeline-historical',
    timelineItem.getItemClass(),
  );

  t.setTitle2('item title');

  testItemStory.type = 'index';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('should be equal to "source" for index-type sources',
    'source',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'cemetery';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('should be equal to "cemetery" for cemetery-type sources',
    'cemetery',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'newspaper';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('should be equal to "newspaper article" for newspaper-type sources',
    'newspaper article',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'other source type';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('should be equal to source type for all other sources',
    'other source type',
    timelineItem.getItemTitle(),
  );

  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertEqual('should be equal to the event title for personal events',
    'some event',
    timelineItem.getItemTitle(),
  );

  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertEqual('should be "(title) of (relationship)" for family events',
    'death of parent',
    timelineItem.getItemTitle(),
  );

  t.setTitle2('item text');

  testItemSource.summary = 'info1\ninfo2';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('item text is an array for sources with a summary',
    ['info1', 'info2'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = '';
  testItemSource.story = {};
  testItemSource.story.summary = 'info3\ninfo4';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('item text is an array for sources with a story summary',
    ['info3', 'info4'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = 'info1\ninfo2';
  testItemSource.story = {};
  testItemSource.story.summary = 'info3\ninfo4';
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('item text is a combined array for sources with a summary and a story summary',
    ['info3', 'info4', 'info1', 'info2'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = '';
  testItemSource.story = {};
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertEqual('item text is an empty array for sources without any summary',
    [],
    timelineItem.getItemText(),
  );

  testItemPersonalEvent.notes = 'notes1\nnotes2';
  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertEqual('item text is an array for personal events with notes',
    ['notes1', 'notes2'],
    timelineItem.getItemText(),
  );

  testItemFamilyEvent.notes = 'notes3\nnotes4';
  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertEqual('item text is an array for family events with notes',
    ['notes3', 'notes4'],
    timelineItem.getItemText(),
  );

  testItemPersonalEvent.notes = '';
  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertEqual('item text is an empty array for personal events with no notes',
    [],
    timelineItem.getItemText(),
  );

  testItemFamilyEvent.notes = '';
  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertEqual('item text is an empty array for family events with no notes',
    [],
    timelineItem.getItemText(),
  );

  t.setTitle2('people list');

  testItemSource.people = [];
  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertTrue('always show people list for sources',
    timelineItem.shouldShowPeople(),
  );

  testItemFamilyEvent.people = [];
  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertTrue('always show people list for family events',
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}, { name: 'test person 2'}];
  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertTrue('show people list for personal events if there are multiple people in the list',
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}];
  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertFalse('do not show people list for personal events with only 1 person',
    timelineItem.shouldShowPeople(),
  );

  testItemHistoricalEvent.people = [{ name: 'test person 1'}, { name: 'test person 2'}];
  timelineItem = new TimelineItem(testItemHistoricalEvent, true, true);
  t.assertFalse('do not show people list for historical events',
    timelineItem.shouldShowPeople(),
  );

  timelineItem = new TimelineItem(testItemFamilyEvent, true, true);
  t.assertTrue('show people above item text for family events',
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new TimelineItem(testItemPersonalEvent, true, true);
  t.assertFalse('show people below item text for personal events',
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new TimelineItem(testItemSource, true, true);
  t.assertFalse('show people below item text for sources',
    timelineItem.shouldDisplayPeopleAboveText(),
  );
});

})();
