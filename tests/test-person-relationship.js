test(t => {
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

  const person = Person.create(rootPerson);

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
