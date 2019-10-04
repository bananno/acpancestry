class ViewAudit extends ViewPage {
  static byUrl() {
    if (PATH == 'audit') {
      new ViewAudit().render();
      return true;
    }
    if (PATH == 'audit/age-at-death') {
      new ViewAuditAgeAtDeath().render();
      return true;
    }
    if (PATH == 'audit/children') {
      new ViewAuditChildren().render();
      return true;
    }
  }

  constructor() {
    super();
    setPageTitle('Audit');
  }

  render() {
    h1('Audit');

    [
      ['age-at-death', 'age at death'],
      ['children', 'children'],
    ].forEach(([path, text]) => {
      pg(localLink('audit/' + path, text));
    });
  }

  showGroupsOfPeople(groupName, personList) {
    personList = personList || this.list[groupName];
    h2(groupName);
    const $ul = $('<ul>');
    rend($ul);
    personList.forEach(person => {
      rend(
        $('<div>')
        .css('display', 'inline-block')
        .css('width', '400px')
        .append(linkToPerson(person))
      );
    });
  }
}
