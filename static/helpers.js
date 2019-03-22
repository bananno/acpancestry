
function setPageTitle(title) {
  if (title && title.length) {
    document.title = title + ' | Lundberg Ancestry';
  } else {
    document.title = 'Lundberg Ancestry';
  }
}

function rend(content) {
  $('#page-content').append(content);
}

function findPerson(personId) {
  return DATABASE.people.filter(person => personId == person.customId)[0];
}

function $makePeopleList(people) {
  const $list = $('<ul>');

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.append(linkToPerson(person));
  });

  return $list;
}

function linkToPerson(person) {
  let path = ORIGIN + '?person/' + person.customId;
  return '<a href="' + path + '">' + person.name + '</a>';
}
