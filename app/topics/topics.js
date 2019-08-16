
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

  if (topic == 'brickwalls') {
    return viewTopicBrickwalls();
  }

  return pageNotFound();
}

function viewTopicImmigration() {
  const countries = [];
  const peopleByCountry = {};

  const people = DATABASE.people.filter(person => person.tags.immigrant);

  people.forEach(person => {
    (person.tags.country || 'Other').split(',').forEach(country => {
      if (!countries.includes(country)) {
        countries.push(country);
        peopleByCountry[country] = [];
      }
      peopleByCountry[country].push(person);
    });
  });

  countries.trueSort((a, b) => a < b && a != 'Other');

  setPageTitle('Immigration');
  h1('Immigration');

  countries.forEach(country => {
    h2(country);
    rend($makePeopleList(peopleByCountry[country], 'photo'));
  });

  h2('Timeline');

  new Timeline(null, null, {
    sourceFilter: source => source.tags.immigration,
    eventFilter: event => event.title == 'immigration' || event.tags.immigration,
    sort: true,
    render: true
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

function viewTopicBrickwalls() {
  const current = DATABASE.people.filter(person => person.tags['brick wall']);
  const broken = DATABASE.people.filter(person => person.tags['broken brick wall']);

  setPageTitle('Brick Walls');
  h1('Brick Walls');

  h2('Current brick walls');
  rend($makePeopleList(current, 'photo'));

  h2('Broken brick walls');
  rend($makePeopleList(broken, 'photo'));
}
