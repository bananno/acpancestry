class ViewAuditAgeAtDeath extends ViewAudit {
  static byUrl() {
    if (ENV !== 'dev') {
      return false;
    }
    new ViewAuditImmigration().render();
    return true;
  }

  constructor() {
    super();
    this.eval();
  }

  eval() {
    this.list = {
      'hidden': [],
      'not enough information': [],
      'custom value': [],
      'default calculation': [],
    };

    this.defaultCalculation = [];

    DATABASE.people.forEach(person => {
      let personList = (() => {
        let tagValue = person.tags['at age death'];
        if (tagValue) {
          if (tagValue == 'hidden') {
            return 'hidden';
          }
          return 'custom value';
        }
        if (person.birth && person.birth.date && person.birth.date.year
            && person.death && person.death.date && person.death.date.year) {
          return 'default calculation';
        }
        return 'not enough information';
      })();

      this.list[personList].push(person);
    });
  }

  render() {
    h1('Audit: age at death');

    this.showGroupsOfPeople('hidden');
    this.showGroupsOfPeople('not enough information');

    this.showTableValues('custom value', person => {
      return person.tags['age at death'];
    });

    this.showTableValues('default calculation', person => {
      return Person.new(person).ageAtDeath();
    });
  }

  showTableValues(groupName, callback) {
    const peopleList = this.list[groupName];

    h2(groupName);
    const $table = $('<table border="1">');
    rend($table);

    $table.append('<tr><th>'
      + ['person', 'birth', 'death', 'age'].join('</th><th>')
      + '</th></tr>');

    peopleList.forEach(person => {
      const $row = $('<tr>').appendTo($table);
      [
        linkToPerson(person),
        person.birth.date.format,
        person.death.date.format,
        Person.new(person).ageAtDeath(),
      ].forEach(val => $row.append($('<td>').append(val)));
    });
  }
}
