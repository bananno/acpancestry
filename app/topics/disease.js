class ViewTopicDisease extends ViewStoryTopic {
  static homePageSummary() {
    const people = ViewTopicDisease.getListOfPeople();

    const diseases = [];

    people.forEach(person => {
      let note = person.tags['cause of death note'];
      if (note && !diseases.includes(note)) {
        diseases.push(note);
      }
    });

    return ('At least ' + people.length + ' people in the Family Tree ' +
      ' have died of ' + diseases.length + ' different diseases. See a ' +
      'list of people, historical events, and newspaper articles.');
  }

  static getListOfPeople() {
    return ViewTopicCauseOfDeath.getPersonList('disease');
  }

  constructor(story) {
    super(story);
    this.collectData();
  }

  collectData() {
    this.people = ViewTopicDisease.getListOfPeople();

    this.timeline = new Timeline(false, false, {
      sourceFilter: this.sourceFilter.bind(this),
      eventFilter: this.eventFilter.bind(this),
      sort: true,
      keys: {
        'life': 'personal events',
        'historical': 'historical events',
        'source': 'sources',
      },
    });
  }

  render() {
    h2('People that died of disease');

    rend($makePeopleList(this.people, 'photo', {
      showText: this.printListShowText
    }));

    h2('Timeline');
    this.timeline.renderTimeline();
  }

  printListShowText(person) {
    if (person.tags['cause of death note']) {
      return ' - ' + person.tags['cause of death note'];
    }
  }

  sourceFilter(source) {
    return source.tags['disease'];
  }

  eventFilter(event) {
    if (event.title == 'death'
        && Person.isInList(this.people, event.people[0])) {
      return true;
    }
    if (event.tags['disease']) {
      return true;
    }
    return false;
  }
}
