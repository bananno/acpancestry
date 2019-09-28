(() => {

function addRelationship(person1, person2, relationship1) {
  relationship1 = relationship1.pluralize();
  const relationship2 = {
    parents: 'children',
    children: 'parents',
    spouses: 'spouses',
  }[relationship1];

  person1[relationship1].push(person2._id);
  person2[relationship2].push(person1._id);
}

test(t => {
  const rootPerson = t.fakePerson();
  const parent1 = t.fakePerson();
  const parent2 = t.fakePerson();
  const stepParent1 = t.fakePerson();
  const fullSibling = t.fakePerson();
  const halfSibling = t.fakePerson();
  const stepSibling = t.fakePerson();
  const spouse = t.fakePerson();
  const child = t.fakePerson();
  const stepChild = t.fakePerson();

  // person, full parents, full siblings
  addRelationship(parent1, parent2, 'spouse');
  addRelationship(rootPerson, parent1, 'parent');
  addRelationship(rootPerson, parent2, 'parent');
  addRelationship(fullSibling, parent1, 'parent');
  addRelationship(fullSibling, parent2, 'parent');

  // parents, step-parents, half-siblings, step-siblings
  addRelationship(parent1, stepParent1, 'spouse');
  addRelationship(halfSibling, parent1, 'parent');
  addRelationship(halfSibling, stepParent1, 'parent');
  addRelationship(stepSibling, stepParent1, 'parent');

  // person, spouse, children, step-children
  addRelationship(rootPerson, spouse, 'spouse');
  addRelationship(child, rootPerson, 'parent');
  addRelationship(child, spouse, 'parent');
  addRelationship(stepChild, spouse, 'parent');

  t.stubDatabase();

  const person = Person.new(rootPerson, true);

  person.populateFamily();

  t.setTitle('person relationships');

  t.setTitle2('full siblings');
  t.assertEqual('contains correct number of siblings',
    1,
    person['siblings'].length,
  );
  t.assertArrayContains('contains correct sibling',
    person['siblings'],
    fullSibling,
  );

  t.setTitle2('half siblings');
  t.assertEqual('contains correct number of half-siblings',
    1,
    person['half-siblings'].length,
  );
  t.assertArrayContains('contains correct half-sibling',
    person['half-siblings'],
    halfSibling,
  );

  t.setTitle2('step siblings');
  t.assertEqual('contains correct number of step-siblings',
    1,
    person['step-siblings'].length,
  );
  t.assertArrayContains('contains correct step-sibling',
    person['step-siblings'],
    stepSibling,
  );

  t.setTitle2('step parents');
  t.assertEqual('contains correct number of step-parents',
    1,
    person['step-parents'].length,
  );
  t.assertArrayContains('contains correct step-parent',
    person['step-parents'],
    stepParent1,
  );

  t.setTitle2('step children');
  t.assertEqual('contains correct number of step-children',
    1,
    person['step-children'].length,
  );
  t.assertArrayContains('contains correct step-child',
    person['step-children'],
    stepChild,
  );
});

test(t => {
  const rootPerson = t.fakePerson();
  const parent1 = t.fakePerson();
  const fullSibling = t.fakePerson();

  addRelationship(rootPerson, parent1, 'parent');
  addRelationship(fullSibling, parent1, 'parent');

  rootPerson.tags['full siblings only'] = true;

  t.stubDatabase();

  const person = Person.new(rootPerson, true);
  const sibling = Person.new(fullSibling, true);

  person.populateFamily();
  sibling.populateFamily();

  t.setTitle('person relationships');
  t.setTitle2('half siblings show as full siblings if at least one of ' +
    'them has "full siblings only" tag');

  t.assertEqual('person contains correct number of half-siblings',
    0,
    person['half-siblings'].length,
  );
  t.assertEqual('person contains correct number of siblings',
    1,
    person['siblings'].length,
  );
  t.assertArrayContains('person contains correct sibling',
    person['siblings'],
    fullSibling,
  );

  t.assertEqual('sibling also contains correct number of half-siblings',
    0,
    sibling['half-siblings'].length,
  );
  t.assertEqual('sibling also contains correct number of siblings',
    1,
    sibling['siblings'].length,
  );
  t.assertArrayContains('sibling also contains correct sibling',
    sibling['siblings'],
    rootPerson,
  );
});

test(t => {
  /*
    Example timeline:
      Man marries Woman1
      Woman1 dies
      Man marries Woman2
      Child is born
    Woman1 and Child should not have a step-parent/child relationship
    since Woman1 died before Child was born.
  */

  const testMan = t.fakePerson();
  const testWoman1 = t.fakePerson();
  const testWoman2 = t.fakePerson();
  const testChild = t.fakePerson();

  testWoman1.death = { date: { year: 1900, month: 0, day: 0 }};
  testChild.birth = { date: { year: 1910, month: 0, day: 0 }};

  addRelationship(testMan, testWoman1, 'spouse');
  addRelationship(testMan, testWoman2, 'spouse');
  addRelationship(testChild, testMan, 'parent');
  addRelationship(testChild, testWoman2, 'parent');

  t.stubDatabase();

  const stepParent = Person.new(testWoman1, true);
  const stepChild = Person.new(testChild, true);

  stepParent.populateFamily();
  stepChild.populateFamily();

  t.setTitle('person relationships');
  t.setTitle2('step-parent does not count if they died before birth of ' +
    'would-be step-child');

  t.assertEqual('child does not have any step-parents',
    0,
    stepChild['step-parents'].length,
  );
  t.assertEqual('parent does not have any step-children',
    0,
    stepParent['step-children'].length,
  );
});

test(t => {
  t.setTitle2('relationship titles');

  t.assertEqual('sister',
    'sister',
    Person.relationshipName('sibling', GENDER.FEMALE),
  );

  t.assertEqual('father',
    'father',
    Person.relationshipName('parent', GENDER.MALE),
  );

  t.assertEqual('step-daughter',
    'step-daughter',
    Person.relationshipName('step-child', GENDER.FEMALE),
  );
});

})();
