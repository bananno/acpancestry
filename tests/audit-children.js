class ViewAuditChildren extends ViewAudit {
  constructor() {
    super();
    this.eval();
    this.sort();
  }

  eval() {
    this.list = {
      'ancestors - incomplete': [],
      'ancestors - complete': [],
      'has no children': [],
      'ignore': [],
      'other - complete': [],
      'other - incomplete': [],
    };

    DATABASE.people.forEach(person => {
      let personList = (() => {
        if (person.private) {
          return 'ignore';
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
      h2(group);
      const $ul = $('<ul>');
      rend($ul);
      this.list[group].forEach(person => {
        rend(
          $('<div>')
          .css('display', 'inline-block')
          .css('width', '400px')
          .append(linkToPerson(person))
        );
      });
    }
  }
}
