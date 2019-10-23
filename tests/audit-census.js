class ViewAuditCensus extends ViewAudit {
  static byUrl() {
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
      'ancestorMissingInfo': ['ancestors missing date info', []],
      'ancestorMissingCensus': ['ancestors missing census', []],
      'missingInfo': ['missing date info', []],
      'missingCensus': ['missing census', []],
      'complete': ['complete', []],
      'outOfRange': ['dates are out of range', []],
      'ignore': ['ignore', []],
      'other': ['other', []],
    };

    DATABASE.people.forEach(person => {
      const list = (() => {
        if (hasSource[person._id]) {
          return 'complete';
        }

        if (person.private) {
          return 'ignore';
        }

        const isAncestor = !!person.leaf;

        const enoughInfo = person.birth && person.death
          && person.birth.date && person.death.date
          && person.birth.date.year && person.death.date.year;

        if (!enoughInfo) {
          return isAncestor ? 'ancestorMissingInfo' : 'missingInfo';
        }

        const inRange = enoughInfo && person.birth.date.year <= this.year
          && person.death.date.year >= this.year;

        if (!inRange) {
          return 'outOfRange';
        }

        return isAncestor ? 'ancestorMissingCensus' : 'missingCensus';
      })();

      this.list[list][1].push(person);
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
