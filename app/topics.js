
function viewTopic() {
  const topic = PATH.replace('topic/', '');

  if (topic == 'military') {
    return viewTopicMilitary();
  }

  if (topic == 'immigration') {
    return viewTopicImmigration();
  }

  if (topic == 'disease') {
    return viewTopicDisease();
  }
}

function viewTopicMilitary() {
  const veterans = DATABASE.people.filter(person => person.tags.veteran);
  const diedAtWar = DATABASE.people.filter(person => person.tags['died at war']);
  const events = DATABASE.events.filter(event => {
    return event.title.match('military') || event.title == 'enlistment';
  });

  setPageTitle('Military');
  rend('<h1>Military</h1>');
  rend('<h2>Veterans</h2>');
  rend($makePeopleList(veterans, 'photo'));
  rend('<h2>People who died at war</h2>');
  rend($makePeopleList(diedAtWar, 'photo'));
  rend('<h2>Events</h2>');
  events.forEach(event => {
    rend(eventBlock(event));
  });
}

function viewTopicImmigration() {
  const people = DATABASE.people.filter(person => person.tags.immigrant);

  setPageTitle('Immigration');
  rend('<h1>Immigration</h1>');
  rend('<h2>People who immigrated</h2>');
  rend($makePeopleList(people, 'photo'));
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
