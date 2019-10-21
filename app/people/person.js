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

  static filter(callback) {
    return DATABASE.people.filter(callback);
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

  static sortListByAncestorDegree(peopleList) {
    peopleList.sortBy(person => {
      if (!person.leaf) {
        return '2';
      }
      if (person.degree < 10) {
        return '1-0' + person.degree;
      }
      return '1-' + person.degree;
    });
  }

  static isInList(list, person) {
    person = person._id || person;
    return list.map(p => p._id || p).includes(person);
  }

  static age(startDate, endDate) {
    if (!startDate || !endDate) {
      return null;
    }
    startDate = startDate.date || startDate;
    endDate = endDate.date || endDate;
    let age = { year: 0, month: 0, day: 0 };

    age.year = endDate.year - startDate.year;
    age.month = endDate.month - startDate.month;
    age.day = endDate.day - startDate.day;

    if (age.day < 0) {
      age.day += 31;
      age.month -= 1;
    }

    if (age.month < 0) {
      age.month += 12;
      age.year -= 1;
    }

    if (age.year > 1) {
      age.day = 0;
      if (age.year > 5) {
        age.month = 0;
      }
    }

    return ['year', 'month', 'day'].map(part => {
      if (age[part]) {
        return age[part] + ' ' + part.pluralize(age[part]);
      }
    }).filter(p => p).join(', ');
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

  ageAtDeath() {
    return this.tags['age at death'] || this.ageAt(this.death);
  }

  ageAt(date) {
    if (this.birth && this.death) {
      return Person.age(this.birth.date, this.death.date);
    }
  }

  numberOfChildren() {
    if (this.tags['all children listed'] || this.tags['no children']) {
      if (this.tags['children not shared']) {
        return null;
      }
      return this.children.length;
    }

    if (this.tags['number of children']) {
      return parseInt(this.tags['number of children']);
    }

    return null;
  }

  isInList(list) {
    return Person.isInList(list, this);
  }

  get mother() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.FEMALE)[0]);
  }

  get father() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.MALE)[0]);
  }
}
