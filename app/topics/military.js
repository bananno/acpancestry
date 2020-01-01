function viewTopicMilitary() {
  const veterans = DATABASE.people.filter(person => person.tags.veteran);
  const americanRevolution = veterans.filter(person => person.tags.war == 'American Revolution');
  const civilWar = veterans.filter(person => person.tags.war == 'CSA');
  const wwi = veterans.filter(person => person.tags.war == 'WWI');
  const wwii = veterans.filter(person => person.tags.war == 'WWII');
  const otherVeterans = veterans.filter(person => {
    return !['American Revolution', 'CSA', 'WWI', 'WWII'].includes(person.tags.war);
  });
  const diedAtWar = DATABASE.people.filter(person => person.tags['died at war']);

  const militaryTimeline = new Timeline();
  const addedAlready = {};

  DATABASE.events.filter(event => {
    return event.tags.military
      || event.title.match('military')
      || event.title == 'enlistment'
      || event.title.match('Battle')
      || (event.notes || '').match('battle');
  }).forEach(event => {
    addedAlready[event._id] = true;
    militaryTimeline.insertItem({
      ...event,
      event: true
    });
  });

  DATABASE.sources.filter(source => source.tags.military).forEach(source => {
    militaryTimeline.insertItem({
      ...source,
      source: true
    });
  });

  diedAtWar.forEach(person => {
    if (person.death && !addedAlready[person.death._id]) {
      militaryTimeline.insertItem({
        ...person.death,
        event: true
      });
    }
  });

  militaryTimeline.sortList();

  setPageTitle('Military');
  h1('Military');

  h2('American Revolution veterans');
  rend($makePeopleList(americanRevolution, 'photo'));

  h2('Civil War veterans');
  rend($makePeopleList(civilWar, 'photo'));

  h2('World War I veterans');
  rend($makePeopleList(wwi, 'photo'));

  h2('World War II veterans');
  rend($makePeopleList(wwii, 'photo'));

  if (otherVeterans.length) {
    h2('Other wars');
    rend($makePeopleList(otherVeterans, 'photo'));
  }

  const showText = person => ' - ' + person.tags['cause of death note'];

  h2('People who died at war');
  rend($makePeopleList(diedAtWar, 'photo', {showText}));

  h2('Timeline');
  militaryTimeline.renderTimeline();
}
