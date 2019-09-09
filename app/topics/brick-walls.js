function viewTopicBrickwalls() {
  setPageTitle('Brick Walls');
  h1('Brick Walls & Mysteries');
  h2('Current questions');
  viewTopicBrickwallHelper('brick wall');
  h2('Solved');
  viewTopicBrickwallHelper('broken brick wall');
}

function viewTopicBrickwallHelper(tagName) {
  const people = DATABASE.people.filter(person => person.tags[tagName]);
  const notations = DATABASE.notations.filter(note => note.tags[tagName]);

  rend($makePeopleList(people, 'photo'));

  notations.forEach((notation, i) => {
    if (i > 0) {
      rend('<hr>');
    } else if (people.length > 0) {
      rend('<hr style="margin-top: 10px">');
    }
    rend($notationBlock(notation, true));
  });
}
