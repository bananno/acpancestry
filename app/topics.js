
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
  const americanRevolution = veterans.filter(person => person.tags.war == 'American Revolution');
  const civilWar = veterans.filter(person => person.tags.war == 'CSA');
  const wwii = veterans.filter(person => person.tags.war == 'WWII');
  const wwi = veterans.filter(person => person.tags.war == 'WWI');
  const otherVeterans = veterans.filter(person => {
    return !['American Revolution', 'CSA', 'WWI', 'WWII'].includes(person.tags.war);
  });
  const diedAtWar = DATABASE.people.filter(person => person.tags['died at war']);

  const events = DATABASE.events.filter(event => {
    return event.tags.military
      || event.title.match('military')
      || event.title == 'enlistment'
      || event.title.match('Battle')
      || (event.notes || '').match('battle');
  });

  diedAtWar.forEach(person => {
    if (person.death) {
      events.push(person.death);
    }
  });

  setPageTitle('Military');
  h1('Military');

  h2('American Revolution veterans');
  rend($makePeopleList(americanRevolution, 'photo'));

  h2('Civil War veterans');
  rend($makePeopleList(civilWar, 'photo'));

  h2('World War II veterans');
  rend($makePeopleList(wwii, 'photo'));

  if (wwi.length) {
    h2('World War I veterans');
    rend($makePeopleList(wwi, 'photo'));
  }

  if (otherVeterans.length) {
    h2('Other wars');
    rend($makePeopleList(otherVeterans, 'photo'));
  }

  h2('People who died at war');
  rend($makePeopleList(diedAtWar, 'photo'));

  h2('Events');
  events.forEach(event => {
    rend(eventBlock(event));
  });
}

function viewTopicImmigration() {
  const people = DATABASE.people.filter(person => person.tags.immigrant);

  const events = DATABASE.events.filter(event => {
    return event.title == 'immigration' || event.tags.immigration;
  });

  events.trueSort((a, b) => a.date.sort < b.date.sort);

  setPageTitle('Immigration');
  h1('Immigration');

  h2('People who immigrated');
  rend($makePeopleList(people, 'photo'));

  h2('Events');
  events.forEach(event => {
    rend(eventBlock(event));
  });
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
  h1('Disease');

  h2('People that died of disease');
  rend($makePeopleList(people, 'photo'));

  h2('Events');
  events.forEach(event => {
    rend(eventBlock(event));
  });
}
