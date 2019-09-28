(() => {

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

})();
