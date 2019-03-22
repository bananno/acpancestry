
function viewPerson() {
  let personId = PATH.replace('person/', '');

  const person = findPerson(personId);

  if (person == null) {
    $('#page-content').append('<h1>Person not found: ' + personId + '</h1>');
    return;
  }

  $('#page-content').append('<h1>' + person.name + '</h1>');
}
