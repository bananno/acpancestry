class ViewAudit extends ViewPage {
  static byUrl() {
    if (ENV !== 'dev') {
      return false;
    }
    new ViewAudit().render();
    return true;
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
      ['immigration', 'immigration'],
      ['census/1940', 'census'],
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
