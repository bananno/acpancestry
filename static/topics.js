
function viewTopic() {
  const topic = PATH.replace('topic/', '');

  if (topic == 'disease') {
    return viewTopicDisease();
  }
}

function viewTopicDisease() {
  const people = DATABASE.people.filter(person => person.tags['died of disease']);

  const events = DATABASE.events.filter(event => {
    if (event.title.match('illness')) {
      return true;
    }
    if (event.title == 'death' && people.map(person => person._id).includes(event.people[0]._id)) {
      return true;
    }
    return false;
  });

  events.trueSort((a, b) => a.date.sort < b.date.sort);

  setPageTitle('Disease');
  rend('<h1>Disease</h1>');
  rend('<h2>People that died of disease</h2>');
  rend($makePeopleList(people, 'photo'));
  rend('<h2>Events</h2>');

  events.forEach(event => {
    rend(eventBlock(event));
  });
}
