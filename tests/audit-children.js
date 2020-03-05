class ViewAuditChildren extends ViewAudit {
  static byUrl() {
    if (ENV !== 'dev') {
      return false;
    }
    new ViewAuditChildren().render();
    return true;
  }

  constructor() {
    super();
    this.eval();
    this.sort();
  }

  eval() {
    this.list = {
      'ancestors - incomplete': [],
      'ancestors - complete': [],
      'ancestors - not all are shared': [],
      'has no children': [],
      'ignore': [],
      'other - complete': [],
      'other - incomplete': [],
      'other - not all are shared': [],
    };

    DATABASE.people.forEach(person => {
      let personList = (() => {
        if (person.private) {
          return 'ignore';
        }
        if (person.tags['children not shared']) {
          if (person.leaf) {
            return 'ancestors - not all are shared';
          }
          return 'other - not all are shared';
        }
        if (person.tags['all children listed']) {
          if (person.leaf) {
            return 'ancestors - complete';
          }
          return 'other - complete';
        }
        if (person.tags['no children']) {
          return 'has no children';
        }
        if (person.leaf) {
          return 'ancestors - incomplete';
        }
        return 'other - incomplete';
      })();
      this.list[personList].push(person);
    });
  }

  sort() {
    this.list['ancestors - incomplete'].sortBy(person => person.degree);
  }

  render() {
    h1('Audit: all children listed');
    for (let group in this.list) {
      this.showGroupsOfPeople(group);
    }
  }
}
