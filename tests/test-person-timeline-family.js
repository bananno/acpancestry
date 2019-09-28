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
  const testPersonTemplate1 = t.fakePerson({
    birth: { date: { year: 1900, month: 1, day: 1 }},
    death: { date: { year: 1980, month: 1, day: 1 }},
  });

  const testPersonTemplate2 = t.fakePerson();

  const testEvent = t.fakeEvent({ title: 'death' });

  t.stubDatabase();

  const testPerson1 = Person.create(testPersonTemplate1, true);
  const testPerson2 = Person.create(testPersonTemplate2, true);

  let timeline, tempSaveValue;
  testEvent.people = [testPerson2.person];

  t.setTitle('person timeline family events');

  // timeline.shouldIncludeFamilyEvent arguments: relative, relationship, item

  // The person, the relative, and the event do not have to be connected. Just
  // pass to the method, which assumes they are connected correctly.

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

  ['sibling', 'half-sibling', 'step-sibling'].forEach(siblingType => {
    t.setTitle2(siblingType + 's');

    testEvent.title = 'birth';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('include ' + siblingType + ' birth if during person\'s life',
      true,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('include ' + siblingType + ' death if during person\'s life',
      true,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1910;
    tempSaveValue = testPerson1.death;
    testPerson1.death = null;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('include ' + siblingType + ' birth if after person\'s birth but death date is null',
      true,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
    testPerson1.death = tempSaveValue;

    testEvent.title = 'death';
    testEvent.date.year = 1910;
    tempSaveValue = testPerson1.death;
    testPerson1.death = null;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('include ' + siblingType + ' death if after person\'s birth but death date is null',
      true,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
    testPerson1.death = tempSaveValue;

    testEvent.title = 'other event';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('exclude other ' + siblingType + ' events during person\'s life',
      false,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1899;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('exclude ' + siblingType + ' birth if before person\'s birth',
      false,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1899;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('exclude ' + siblingType + ' death if before person\'s birth',
      false,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1981;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('exclude ' + siblingType + ' birth if after person\'s death',
      false,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1981;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertEqual('exclude ' + siblingType + ' death if after person\'s death',
      false,
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
  });

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
