class Person {
  static find(person) {
    if (person.name) {
      return person;
    }
    if (!person) {
      return null;
    }

    let strippedID = person.toLowerCase().split('-').join('');
    return DATABASE.personRef[strippedID];
  }

  static new(person, isTest) {
    if (!person) {
      return null;
    }
    if (person.constructor == Person) {
      return new Person(person.person, isTest);
    }
    if (person.name) {
      return new Person(person, isTest);
    }
    person = Person.find(person);
    if (person) {
      return new Person(person, isTest);
    }
  }

  static create(person, isTest) { // phase out
    return Person.new(person, isTest);
  }

  static populateList(arr) {
    arr.forEach(person => {
      person = Person.find(person);
    });
  }

  static relationshipName(relationship, gender) {
    // can pass either gender or entire person object:
    gender = (gender || {}).gender || gender;

    const relationships = {
      'parent': ['mother', 'father'],
      'step-parent': ['step-mother', 'step-father'],
      'sibling': ['sister', 'brother'],
      'half-sibling': ['half-sister', 'half-brother'],
      'step-sibling': ['step-sister', 'step-brother'],
      'spouse': ['wife', 'husband'],
      'child': ['daughter', 'son'],
      'step-child': ['step-daughter', 'step-son'],
    };

    if (relationships[relationship]) {
      return relationships[relationship][gender - 1] || relationship;
    }

    return relationship;
  }

  constructor(person, isTest) {
    this.person = person;
    this.isTest = isTest;
    for (let key in person) {
      this[key] = person[key];
    }
  }

  forEachRelationship(callback) {
    ['parents', 'step-parents', 'siblings', 'step-siblings', 'half-siblings',
    'spouses', 'children', 'step-children'].forEach(rel => {
      callback(rel, this[rel]);
    });
  }

  getFamily(relationship) {
    let people = this[relationship];

    if (people == null || people.length == 0) {
      return [];
    }

    if (people[0].name === undefined) {
      people = people.map(Person.find);
    }

    if (relationship == 'siblings' || relationship == 'children') {
      people.sortBy(person => person.birthSort);
    }

    return people;
  }

  get mother() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.FEMALE)[0]);
  }

  get father() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.MALE)[0]);
  }
}
