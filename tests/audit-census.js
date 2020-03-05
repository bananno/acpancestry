class ViewAuditCensus extends ViewAudit {
  static byUrl() {
    if (ENV !== 'dev') {
      return false;
    }
    const year = PATH.replace('audit/census/', '');
    new ViewAuditCensus(year).render();
    return true;
  }

  constructor(year) {
    super();
    this.year = year;
    this.eval();
  }

  eval() {
    const story = DATABASE.stories.filter(story => {
      return story.title == 'Census USA ' + this.year;
    })[0];

    const hasSource = {};

    story.entries.forEach(source => {
      source.people.forEach(person => {
        hasSource[person._id] = true;
      });
    });

    this.list = {
      'missingDateInfo': ['missing date info', []],
      'incomplete': ['missing census', []],
      'outsideCountry': ['missing census, but maybe not living in USA', []],
      'complete': ['complete', []],
      'outOfRangeLate': ['out of range: born after ' + this.year, []],
      'outOfRangeEarly': ['out of range: died before ' + this.year, []],
      'ignore': ['ignore', []],
    };

    DATABASE.people.forEach(person => {
      const category = (() => {
        if (hasSource[person._id]) {
          return 'complete';
        }

        if (person.private) {
          return 'ignore';
        }

        const birthYear = (person.birth && person.birth.date
          && person.birth.date.year) ? person.birth.date.year : 0;

        const deathYear = (person.death && person.death.date
          && person.death.date.year) ? person.death.date.year : 0;

        if (birthYear && birthYear > this.year) {
          return 'outOfRangeLate';
        }

        if (deathYear && deathYear < this.year) {
          return 'outOfRangeEarly';
        }

        if (!birthYear || !deathYear) {
          return 'missingDateInfo';
        }

        if (person.death.location && person.death.location.country
            && person.death.location.country != 'United States') {
          return 'outsideCountry';
        }

        return 'incomplete';
      })();

      this.list[category][1].push(person);
    });

    ['missingDateInfo', 'incomplete'].forEach(category => {
      this.list[category][1].sortBy(person => {
        return person.leaf ? '1' : '2';
      });
    });
  }

  render() {
    h1('Census ' + this.year);
    this.yearLinks();

    for (let key in this.list) {
      h2(this.list[key][0]);
      rend($makePeopleList(this.list[key][1], 'photo'));
    }
  }

  yearLinks() {
    const $p = $('<p>');
    rend($p);
    for (let year = 1850; year <= 1940; year += 10) {
      $p.append(localLink('audit/census/' + year, year) + ' ');
    }
  }
}
