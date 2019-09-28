(() => {

test(t => {
  const testItemStory = {
  };

  const testItemSource = {
    source: true,
    story: testItemStory,
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

  testItemStory.type = 'index';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "source" for index-type sources',
    'source',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'cemetery';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "cemetery" for cemetery-type sources',
    'cemetery',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'newspaper';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('should be equal to "newspaper article" for newspaper-type sources',
    'newspaper article',
    timelineItem.getItemTitle(),
  );

  testItemStory.type = 'other source type';
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
  testItemSource.story = {};
  testItemSource.story.summary = 'info3\ninfo4';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is an array for sources with a story summary',
    ['info3', 'info4'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = 'info1\ninfo2';
  testItemSource.story = {};
  testItemSource.story.summary = 'info3\ninfo4';
  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertEqual('item text is a combined array for sources with a summary and a story summary',
    ['info3', 'info4', 'info1', 'info2'],
    timelineItem.getItemText(),
  );

  testItemSource.summary = '';
  testItemSource.story = {};
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
  t.assertTrue('always show people list for sources',
    timelineItem.shouldShowPeople(),
  );

  testItemFamilyEvent.people = [];
  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertTrue('always show people list for family events',
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}, { name: 'test person 2'}];
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertTrue('show people list for personal events if there are multiple people in the list',
    timelineItem.shouldShowPeople(),
  );

  testItemPersonalEvent.people = [{ name: 'test person 1'}];
  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertFalse('do not show people list for personal events with only 1 person',
    timelineItem.shouldShowPeople(true),
  );

  timelineItem = new PersonTimelineItem(testItemFamilyEvent, true);
  t.assertTrue('show people above item text for family events',
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new PersonTimelineItem(testItemPersonalEvent, true);
  t.assertFalse('show people below item text for personal events',
    timelineItem.shouldDisplayPeopleAboveText(),
  );

  timelineItem = new PersonTimelineItem(testItemSource, true);
  t.assertFalse('show people below item text for sources',
    timelineItem.shouldDisplayPeopleAboveText(),
  );
});

test(t => {
  const personRelativeTemplate = t.fakePerson();

  t.stubDatabase();

  const personRelative = Person.create(personRelativeTemplate, true);

  personRelative.name = 'TEST PERSON RELATIVE';

  let timelineItem;

  let item = {
    event: true,
    source: false,
    personal: false,
    people: [personRelative]
  };

  t.setTitle2('family event title');
  item.people = [personRelative];

  item.title = 'death';
  item.relationship = 'parent';
  personRelative.gender = GENDER.FEMALE;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"death of mother"',
    'death of mother',
    timelineItem.getItemTitle(),
  );

  item.title = 'death';
  item.relationship = 'parent';
  personRelative.gender = GENDER.MALE;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"death of father"',
    'death of father',
    timelineItem.getItemTitle(),
  );

  item.title = 'death';
  item.relationship = 'parent';
  personRelative.gender = 0;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"death of parent" when parent gender is missing',
    'death of parent',
    timelineItem.getItemTitle(),
  );

  item.title = 'death';
  item.relationship = 'spouse';
  personRelative.gender = GENDER.FEMALE;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"death of wife"',
    'death of wife',
    timelineItem.getItemTitle(),
  );

  item.title = 'birth';
  item.relationship = 'child';
  personRelative.gender = 0;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"birth of child"',
    'birth of child',
    timelineItem.getItemTitle(),
  );

  item.title = 'birth';
  item.relationship = 'child';
  personRelative.gender = GENDER.MALE;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"birth of son"',
    'birth of son',
    timelineItem.getItemTitle(),
  );

  item.title = 'birth';
  item.relationship = 'sibling';
  personRelative.gender = 0;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"birth of sibling"',
    'birth of sibling',
    timelineItem.getItemTitle(),
  );

  item.title = 'other-event';
  item.relationship = 'other-relative';
  personRelative.gender = 0;
  timelineItem = new PersonTimelineItem(item, true, true);
  t.assertEqual('"other-event of other-relative"',
    'other-event of other-relative',
    timelineItem.getItemTitle(),
  );
});
})();
