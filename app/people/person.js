class Person {
  static find(person) {
    if (person.name) {
      return person;
    }
    return DATABASE.personRef[person];
  }

  static create(personId, isTest) {
    const person = Person.find(personId);
    if (person) {
      return new Person(person, isTest);
    }
  }

  static populateList(arr) {
    arr.forEach(person => {
      person = Person.find(person);
    });
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
}
