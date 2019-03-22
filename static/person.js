
function viewPerson() {
  let personId = PATH.replace('person/', '');

  const person = findPerson(personId);

  if (person == null) {
    setPageTitle('Person Not Found');
    $('#page-content').append('<h1>Person not found: ' + personId + '</h1>');
    return;
  }

  setPageTitle(person.name);

  $('#page-content').append('<h1>' + person.name + '</h1>');
}
