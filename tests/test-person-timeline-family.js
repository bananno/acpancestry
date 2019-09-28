(() => {

/*
  timeline.shouldIncludeFamilyEvent() arguments:
    1. relative (person object)
    2. relationship (string)
    3. item (event object)

  The person, the relative, and the event do not have to be connected. Just
  pass everything to the method, which assumes they are connected correctly.
*/

test(t => { // PARENTS - include events
  const testPersonTemplate1 = t.fakePerson({
    birth: { date: { year: 1900, month: 1, day: 1 }},
    death: { date: { year: 1980, month: 1, day: 1 }},
  });

  const testPersonTemplate2 = t.fakePerson();

  const testEvent = t.fakeEvent();

  t.stubDatabase();

  const testPerson1 = Person.create(testPersonTemplate1, true);
  const testPerson2 = Person.create(testPersonTemplate2, true);

  let timeline, tempSaveValue;
  testEvent.people = [testPerson2.person];

  t.setTitle('person timeline family events');

  t.setTitle2('parents - birth & death');

  testEvent.title = 'birth';
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude parent birth',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1899;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include parent death if before person\'s birth',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include parent death if during person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1981;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include parent death if person\'s death date is null',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'death';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude parent death if after person\'s death',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  t.setTitle2('parents - marriage');

  testEvent.title = 'marriage';
  testEvent.date.year = 1899;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude parent marriage if before person\'s birth',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'marriage';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include parent marriage if during person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );

  testEvent.title = 'marriage';
  testEvent.date.year = 1981;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('exclude parent marriage if person\'s death date is null',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'marriage';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude parent marriage if after person\'s death',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'parent', testEvent),
  );
});

test(t => { // PARENTS - event titles
  const testPersonTemplate1 = t.fakePerson({
    birth: { date: { year: 1900, month: 1, day: 1 }},
    death: { date: { year: 1980, month: 1, day: 1 }},
  });

  const personFatherTemplate = t.fakePerson({ gender: GENDER.MALE });
  const personMotherTemplate = t.fakePerson({ gender: GENDER.FEMALE });
  const personStepFatherTemplate = t.fakePerson({ gender: GENDER.MALE });
  const personStepMotherTemplate = t.fakePerson({ gender: GENDER.FEMALE });

  testPersonTemplate1.parents = [personFatherTemplate._id,
    personMotherTemplate._id];

  const testEvent = t.fakeEvent({ title: 'marriage' });

  t.stubDatabase();

  const rootPerson = Person.create(testPersonTemplate1, true);
  const personFather = Person.create(personFatherTemplate, true);
  const personMother = Person.create(personMotherTemplate, true);
  const personStepFather = Person.create(personStepFatherTemplate, true);
  const personStepMother = Person.create(personStepMotherTemplate, true);

  let timeline, timelineItem, tempSaveValue;
  testEvent.people = [personMother.person];

  const timelineEvent = {
    source: false,
    event: true,
    relationship: 'parent',
    personal: false,
    ...testEvent
  };

  timelineEvent.people = [personMother];
  timelineItem = new PersonTimelineItem(timelineEvent, true, rootPerson);
  t.assertEqual('title is "marriage of mother" when event contains mother only',
    'marriage of mother',
    timelineItem.getItemTitle(),
  );

  timelineEvent.people = [personStepFather, personMother];
  timelineItem = new PersonTimelineItem(timelineEvent, true, rootPerson);
  t.assertEqual('title is "marriage of mother" when event contains mother and stepfather',
    'marriage of mother',
    timelineItem.getItemTitle(),
  );

  timelineEvent.people = [personFather];
  timelineItem = new PersonTimelineItem(timelineEvent, true, rootPerson);
  t.assertEqual('title is "marriage of father" when event contains father only',
    'marriage of father',
    timelineItem.getItemTitle(),
  );

  timelineEvent.people = [personFather, personStepMother];
  timelineItem = new PersonTimelineItem(timelineEvent, true, rootPerson);
  t.assertEqual('title is "marriage of father" when event contains father and stepmother',
    'marriage of father',
    timelineItem.getItemTitle(),
  );

  timelineEvent.people = [personFather, personMother];
  timelineItem = new PersonTimelineItem(timelineEvent, true, rootPerson);
  t.assertEqual('title is "marriage of parents" when event contains both parents',
    'marriage of parents',
    timelineItem.getItemTitle(),
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

  ['sibling', 'half-sibling', 'step-sibling'].forEach(siblingType => {
    t.setTitle2(siblingType + 's');

    testEvent.title = 'birth';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertTrue('include ' + siblingType + ' birth if during person\'s life',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertTrue('include ' + siblingType + ' death if during person\'s life',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1910;
    tempSaveValue = testPerson1.death;
    testPerson1.death = null;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertTrue('include ' + siblingType + ' birth if after person\'s birth but death date is null',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
    testPerson1.death = tempSaveValue;

    testEvent.title = 'death';
    testEvent.date.year = 1910;
    tempSaveValue = testPerson1.death;
    testPerson1.death = null;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertTrue('include ' + siblingType + ' death if after person\'s birth but death date is null',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
    testPerson1.death = tempSaveValue;

    testEvent.title = 'other event';
    testEvent.date.year = 1910;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertFalse('exclude other ' + siblingType + ' events during person\'s life',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1899;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertFalse('exclude ' + siblingType + ' birth if before person\'s birth',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1899;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertFalse('exclude ' + siblingType + ' death if before person\'s birth',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'birth';
    testEvent.date.year = 1981;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertFalse('exclude ' + siblingType + ' birth if after person\'s death',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );

    testEvent.title = 'death';
    testEvent.date.year = 1981;
    timeline = new PersonTimeline(testPerson1, true);
    t.assertFalse('exclude ' + siblingType + ' death if after person\'s death',
      timeline.shouldIncludeFamilyEvent(testPerson2, siblingType, testEvent),
    );
  });

  t.setTitle2('spouses');

  testEvent.title = 'birth';
  testEvent.date.year = 1890;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include spouse birth',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1990;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include spouse death',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1920;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude other spouse events',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'spouse', testEvent),
  );

  t.setTitle2('children');

  testEvent.title = 'birth';
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include child birth',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include child death if during person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1984;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include child death if within 5 years of person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'death';
  testEvent.date.year = 1984;
  tempSaveValue = testPerson1.death;
  testPerson1.death = null;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include child death if after person\'s birth but death date is null',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
  testPerson1.death = tempSaveValue;

  testEvent.title = 'death';
  testEvent.date.year = 1986;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude child death if more than 5 years after person\'s death',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'historical event';
  testEvent.date.year = 1950;
  testEvent.tags = { historical: true };
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude historical child events even if during person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
  testEvent.tags = {};

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include other child events if during person\'s life',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1981;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertFalse('exclude other child events if after person\'s death',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  t.setTitle2('other');

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  t.assertTrue('include family events that are not yet in the timeline list',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );

  testEvent.title = 'other event';
  testEvent.date.year = 1950;
  timeline = new PersonTimeline(testPerson1, true);
  timeline.list = [testEvent];
  t.assertFalse('exclude family events that are already added to the list',
    timeline.shouldIncludeFamilyEvent(testPerson2, 'child', testEvent),
  );
});

})();
