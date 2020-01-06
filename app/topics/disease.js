class ViewTopicDisease extends ViewPage {
  static homePageSummary() {
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death'] == 'disease';
    });

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

  constructor() {
    super();
    this.collectData();
  }

  collectData() {
    this.people = Person.filter(person => {
      return person.tags['died of disease']
        || person.tags['cause of death'] == 'disease';
    });

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
    if (event.title.match('illness')) {
      return true;
    }
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
