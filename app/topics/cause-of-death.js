class ViewSpecialTopicCauseOfDeath extends ViewPage {
  static new(story) {
    new ViewSpecialTopicCauseOfDeath(story).render();
  }

  constructor(story) {
    super();
    this.story = story;
  }

  render() {
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
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death'] == 'accident';
    });
    this.printList(people);
  }

  renderDisease() {
    h2('Disease');
    this.subtitle('See also: '
      + localLink('/topic/disease', 'disease timeline'));
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death'] == 'disease'
        || person.tags['died of disease'];
    });
    people.sortBy(person => person.tags['cause of death note'].toLowerCase());
    this.printList(people);
  }

  renderWar() {
    h2('War');
    this.subtitle('See also: '
      + localLink('/topic/military', 'more about military'));
    const people = DATABASE.people.filter(person => {
      return person.tags['died at war'];
    });
    this.printList(people);
  }

  renderOther() {
    h2('Other');
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death']
        && !['accident', 'disease', 'unknown']
          .includes(person.tags['cause of death'])
        && !person.tags['died at war']
        && !person.tags['died of disease'];
    });
    people.sortBy(person => person.tags['cause of death']);
    this.printList(people, person => (' - ' + person.tags['cause of death']));
  }

  renderUnknown() {
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
