(() => {

test(t => {
  const personRootTemplate = t.fakePerson();
  const personFatherTemplate = t.fakePerson({ gender: GENDER.MALE });
  const personMotherTemplate = t.fakePerson({ gender: GENDER.FEMALE });
  const personStepFatherTemplate = t.fakePerson({ gender: GENDER.MALE });
  const personStepMotherTemplate = t.fakePerson({ gender: GENDER.FEMALE });
  const personSpouseTemplate = t.fakePerson();
  const personChild1Template = t.fakePerson();
  const personChild2Template = t.fakePerson();
  const personSibling1Template = t.fakePerson();
  const personSibling2Template = t.fakePerson();
  const personOtherTemplate = t.fakePerson();

  personRootTemplate.parents = [personFatherTemplate._id, personMotherTemplate._id];
  personSibling1Template.parents = [personFatherTemplate._id, personMotherTemplate._id];
  personSibling2Template.parents = [personFatherTemplate._id, personMotherTemplate._id];
  personFatherTemplate.children = [personRootTemplate._id, personSibling1Template._id, personSibling2Template._id];
  personRootTemplate.spouses = [personSpouseTemplate._id];
  personRootTemplate.children = [personChild1Template._id, personChild2Template._id];

  const testEvent = t.fakeEvent();

  t.stubDatabase();

  const personRoot = Person.create(personRootTemplate, true);
  const personFather = Person.create(personFatherTemplate, true);
  const personMother = Person.create(personMotherTemplate, true);
  const personStepFather = Person.create(personStepFatherTemplate, true);
  const personStepMother = Person.create(personStepMotherTemplate, true);
  const personSibling1 = Person.create(personSibling1Template, true);
  const personSibling2 = Person.create(personSibling2Template, true);
  const personSpouse = Person.create(personSpouseTemplate, true);
  const personChild1 = Person.create(personChild1Template, true);
  const personChild2 = Person.create(personChild2Template, true);
  const personOther = Person.create(personOtherTemplate, true);

  personRoot.populateFamily();

  let timelineItem;

  const timelineEvent = {
    source: false,
    event: true,
    relationship: 'parent',
    personal: false,
    ...testEvent
  };

  t.setTitle('person timeline family events: titles');

  (() => {
    t.setTitle2('parent marriage');

    timelineEvent.title = 'marriage';
    timelineEvent.relationship = 'parent';

    timelineEvent.people = [personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"marriage of mother" when marriage event contains mother only',
      'marriage of mother',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personStepFather, personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"marriage of mother" when marriage event contains mother and stepfather',
      'marriage of mother',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personFather];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"marriage of father" when marriage event contains father only',
      'marriage of father',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personFather, personStepMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"marriage of father" when marriage event contains father and stepmother',
      'marriage of father',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personFather, personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"marriage of parents" when marriage event contains both parents',
      'marriage of parents',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('any other parent event');
    timelineEvent.title = 'any-event';
    timelineEvent.relationship = 'parent';

    timelineEvent.people = [personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of mother" when event contains mother only',
      'any-event of mother',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personOther, personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of mother" when event contains mother and another person',
      'any-event of mother',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personFather];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of father" when event contains father only',
      'any-event of father',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personOther, personFather];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of father" when event contains father and another person',
      'any-event of father',
      timelineItem.getItemTitle(),
    );

    personFather.gender = 0;
    timelineEvent.people = [personFather];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of parent" when parent gender is missing',
      'any-event of parent',
      timelineItem.getItemTitle(),
    );
    personFather.gender = GENDER.MALE;

    timelineEvent.people = [personFather, personMother];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of parents" when event includes both parents',
      'any-event of parents',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('any sibling event');

    timelineEvent.title = 'any-event';
    timelineEvent.relationship = 'sibling';
    timelineEvent.people = [personSibling1];

    personSibling1.gender = GENDER.FEMALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of sister"',
      'any-event of sister',
      timelineItem.getItemTitle(),
    );

    personSibling1.gender = GENDER.MALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of brother"',
      'any-event of brother',
      timelineItem.getItemTitle(),
    );

    personSibling1.gender = 0;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of sibling" when sibling gender is missing',
      'any-event of sibling',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personSibling1, personSibling2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of siblings" when event contains more than one of them',
      'any-event of siblings',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('spouse birth');

    timelineEvent.relationship = 'spouse';
    timelineEvent.title = 'birth';
    timelineEvent.people = [personSpouse];

    personSpouse.gender = GENDER.FEMALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"birth of future wife"',
      'birth of future wife',
      timelineItem.getItemTitle(),
    );

    personSpouse.gender = GENDER.MALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"birth of future husband"',
      'birth of future husband',
      timelineItem.getItemTitle(),
    );

    personSpouse.gender = 0;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"birth of future spouse" when spouse gender is missing',
      'birth of future spouse',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('any other spouse event');

    timelineEvent.relationship = 'spouse';
    timelineEvent.title = 'any-event';
    timelineEvent.people = [personSpouse];

    personSpouse.gender = GENDER.FEMALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of wife"',
      'any-event of wife',
      timelineItem.getItemTitle(),
    );

    personSpouse.gender = GENDER.MALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of husband"',
      'any-event of husband',
      timelineItem.getItemTitle(),
    );

    personSpouse.gender = 0;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of spouse" when spouse gender is missing',
      'any-event of spouse',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('any child event');

    timelineEvent.title = 'any-event';
    timelineEvent.relationship = 'child';
    timelineEvent.people = [personChild1];

    personChild1.gender = GENDER.FEMALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of daughter"',
      'any-event of daughter',
      timelineItem.getItemTitle(),
    );

    personChild1.gender = GENDER.MALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of son"',
      'any-event of son',
      timelineItem.getItemTitle(),
    );

    personChild1.gender = 0;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of child" when child gender is missing',
      'any-event of child',
      timelineItem.getItemTitle(),
    );

    timelineEvent.people = [personChild1, personChild2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of children" when event contains more than one of them',
      'any-event of children',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('any other relative');

    timelineEvent.relationship = 'any-relative';
    timelineEvent.title = 'any-event';
    timelineEvent.people = [personOther];

    personOther.gender = GENDER.FEMALE;
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of any-relative"',
      'any-event of any-relative',
      timelineItem.getItemTitle(),
    );
  })();

  (() => {
    t.setTitle2('events with multiple family members');
    timelineEvent.title = 'any-event';

    timelineEvent.relationship = 'child';
    timelineEvent.people = [personSpouse, personChild1];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of family members" when event contains spouse and one child',
      'any-event of family members',
      timelineItem.getItemTitle(),
    );

    timelineEvent.relationship = 'child';
    timelineEvent.people = [personSpouse, personChild1, personChild2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of family members" when event contains spouse and multiple children',
      'any-event of family members',
      timelineItem.getItemTitle(),
    );

    timelineEvent.relationship = 'child';
    timelineEvent.people = [personChild1, personChild2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of children" when event contains multiple children',
      'any-event of children',
      timelineItem.getItemTitle(),
    );

    timelineEvent.relationship = 'sibling';
    timelineEvent.people = [personSibling1, personSibling2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of siblings" when event contains multiple siblings',
      'any-event of siblings',
      timelineItem.getItemTitle(),
    );

    timelineEvent.relationship = 'parent';
    timelineEvent.people = [personMother, personSibling2];
    timelineItem = new TimelineItem(timelineEvent, true, personRoot);
    t.assertEqual('"any-event of family members" when event contains parent and sibling',
      'any-event of family members',
      timelineItem.getItemTitle(),
    );
  })();
});

})();
