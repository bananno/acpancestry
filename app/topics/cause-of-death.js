class ViewTopicCauseOfDeath extends ViewStoryTopic {
  static getPersonList(causeOfDeath) {
    return DATABASE.people.filter(person => {
      return (person.tags['cause of death'] || '').split(',')
        .map(s => s.trim()).includes(causeOfDeath);
    });
  }

  constructor(story) {
    super(story);
  }

  render() {
    this.viewExcerpts();
    this.viewSources();
    this.renderAccident();
    this.renderDisease();
    this.renderWar();
    this.renderOther();
    this.renderUnknown();
  }

  subtitle(text) {
    pg(text).css('margin', '0 0 10px 5px');
  }

  printList(people, showText) {
    showText = showText || this.printListShowText;
    rend($makePeopleList(people, 'photo', {showText}));
  }

  printListShowText(person) {
    if (person.tags['cause of death note']) {
      return ' - ' + person.tags['cause of death note'];
    }
  }

  renderAccident() {
    h2('Accident');
    const people = ViewTopicCauseOfDeath.getPersonList('accident');
    this.printList(people);
  }

  renderDisease() {
    h2('Disease');
    this.subtitle('See also: '
      + localLink('/topic/disease', 'disease timeline'));
    const people = ViewTopicCauseOfDeath.getPersonList('disease');
    people.sortBy(person => person.tags['cause of death note'].toLowerCase());
    this.printList(people);
  }

  renderWar() {
    h2('War');
    this.subtitle('See also: '
      + localLink('/topic/military', 'more about military'));
    const people = ViewTopicCauseOfDeath.getPersonList('war');
    this.printList(people);
  }

  renderOther() {
    // Person has a cause of death and at least one of the values (separated
    // by comma, if multiple) is not accounted for in the other sections.
    h2('Other');
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death']
        && person.tags['cause of death'].split(',').some(causeOfDeath => {
          return !['accident', 'disease', 'war', 'unknown']
              .includes(causeOfDeath);
          });
    });
    people.sortBy(person => person.tags['cause of death']);
    this.printList(people, person => (' - ' + person.tags['cause of death']));
  }

  renderUnknown() {
    // Person cause of death is "unknown" or they died young and their
    // cause of death is not specified.
    h2('Unknown');
    this.subtitle('Died young or under odd circumstances, but cause of ' +
      'death not yet found.');
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death'] == 'unknown'
        || (!person.tags['cause of death'] && person.tags['died young']);
    });
    this.printList(people);
  }
}
