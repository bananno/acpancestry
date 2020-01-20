class ViewTopicMilitary extends ViewStoryTopic {
  constructor(story) {
    super(story);
    this.veterans = ViewTopicMilitary.collectDataVeterans();
    this.diedAtWar = ViewTopicCauseOfDeath.getPersonList('war');
    this.timeline = ViewTopicMilitary.createTimeline(this.diedAtWar);
  }

  static collectDataVeterans() {
    const veteransAll = DATABASE.people.filter(person => person.tags.veteran);

    const veterans = {};

    function getVeterans(tagValue) {
      return veteransAll.filter(person => person.tags.veteran == tagValue);
    }

    veterans.americanRevolution = getVeterans('American Revolution');
    veterans.civilWar = getVeterans('CSA');
    veterans.wwi = getVeterans('WWI');
    veterans.wwii = getVeterans('WWII');

    veterans.other = veteransAll.filter(person => {
      return !['American Revolution', 'CSA', 'WWI', 'WWII']
        .includes(person.tags.veteran);
    });

    return veterans;
  }

  static createTimeline(diedAtWar) {
    const timeline = new Timeline();
    const addedAlready = {};

    DATABASE.events.filter(event => {
      return event.tags.military
        || event.title.match('military')
        || event.title == 'enlistment'
        || event.title.match('Battle')
        || (event.notes || '').match('battle');
    }).forEach(event => {
      addedAlready[event._id] = true;
      timeline.insertItem({
        ...event,
        event: true
      });
    });

    DATABASE.sources.filter(source => source.tags.military).forEach(source => {
      timeline.insertItem({
        ...source,
        source: true
      });
    });

    diedAtWar.forEach(person => {
      if (person.death && !addedAlready[person.death._id]) {
        timeline.insertItem({
          ...person.death,
          event: true
        });
      }
    });

    timeline.sortList();

    return timeline;
  }

  render() {
    [
      ['American Revolution veterans', 'americanRevolution'],
      ['Civil War veterans', 'civilWar'],
      ['World War I veterans', 'wwi'],
      ['World War II veterans', 'wwii'],
      ['Other wars', 'other']
    ].forEach(([title, warKey]) => {
      if (this.veterans[warKey].length) {
        h2(title);
        this.printList(this.veterans[warKey]);
      }
    });

    h2('People who died at war');
    this.printList(this.diedAtWar, person => {
      return ' - ' + person.tags['cause of death note'];
    });

    h2('Timeline');
    this.timeline.renderTimeline();
  }

  printList(people, showText) {
    rend($makePeopleList(people, 'photo', {showText}));
  }
}
