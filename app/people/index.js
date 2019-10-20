function viewPeople() {
  setPageTitle('People');
  h1('All People');
  const peopleList = [...DATABASE.people];
  Person.sortListByAncestorDegree(peopleList);
  rend($makePeopleList(peopleList, 'photo'));
}
