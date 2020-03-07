class ViewPeople extends ViewPage {
  static load(params) {
    new ViewPeople().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('People');
    h1('All People');
    const peopleList = [...DATABASE.people];
    Person.sortListByAncestorDegree(peopleList);
    rend($makePeopleList(peopleList, 'photo'));
  }
}
