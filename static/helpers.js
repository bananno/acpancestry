
function setPageTitle(title) {
  if (title && title.length) {
    document.title = title + ' | Lundberg Ancestry';
  } else {
    document.title = 'Lundberg Ancestry';
  }
}

function findPerson(personId) {
  return DATABASE.people.filter(person => person.customId == personId)[0];
}

function linkToPerson(person) {
  let path = ORIGIN + '?person/' + person.customId;
  return '<a href="' + path + '">' + person.name + '</a>';
}
