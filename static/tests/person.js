
test(t => {
  const personA = { name: 'Person A', customId: 'PersonA', _id: '000A' };
  const personB = { name: 'Person B', customId: 'PersonB', _id: '000B' };
  const personC = { name: 'Person C', customId: 'PersonC', _id: '000C' };

  const testPerson = {
    name: 'Test Person',
    customId: 'TestPerson',
    _id: '0000',
    children: [personA, personB, personC],
  };

  const event1 = {};

  t.stubDatabase();

  t.setTitle('Person timeline family events');

  t.assertEqual('Person timeline includes child birth.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline includes child death if during person\'s life.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline includes child death if within 5 years of person\'s life.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline excludes child death if more than 5 years after person\'s death.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline includes spouse birth.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline includes spouse death.',
    true,
    includeTimelineEvent(testPerson, event1),
  );

  t.assertEqual('Person timeline excludes other spouse events.',
    false,
    includeTimelineEvent(testPerson, event1),
  );
});

function includeTimelineEvent() {
  return true;
}
