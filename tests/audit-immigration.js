class ViewAuditImmigration extends ViewAudit {
  constructor() {
    super();
    this.eval();
    this.sort();
  }

  eval() {
    this.list = {
      'review': ['REVIEW: might be an immigrant', []],
      'only-outside': ['born and died outside the USA', []],
      'tagged non-immigrant': ['tagged as non-immigrant', [],
        'birth/death locations flag them as a possible immigrant but ' +
        'they do not fit the description'],
      'tagged immigrant': ['tagged as immigrant', []],
      'only-usa': ['born and died in USA', []],
      'missing-info': ['not enough information', [], null],
      'else': ['no category specified', []],
      'ignore': ['ignore', []],
    };

    const eventCombo = {
      'none-none': 'missing-info',
      'none-USA': 'missing-info',
      'none-other': 'review',
      'USA-none': 'missing-info',
      'USA-USA': 'only-usa',
      'USA-other': 'review',
      'other-none': 'review',
      'other-USA': 'review',
      'other-other': 'only-outside',
    };

    DATABASE.people.forEach(person => {
      const category = (() => {
        if (person.tags.immigrant) {
          return 'tagged immigrant';
        }

        if (person.tags['not immigrant']) {
          return 'tagged non-immigrant';
        }

        if (person.private) {
          return 'ignore';
        }

        const birthCounty = this.getCountryForEvent(person.birth);
        const deathCounty = this.getCountryForEvent(person.death);

        return eventCombo[birthCounty + '-' + deathCounty] || 'else';
      })();

      this.list[category][1].push(person);
    });
  }

  getCountryForEvent(event) {
    if (!event || !event.location || !event.location.country) {
      return 'none';
    }
    if (event.location.country == 'United States') {
      return 'USA';
    }
    return 'other';
  }

  sort() {
  }

  render() {
    h1('Audit: immigration');

    pg(localLink('topic/immigration', 'immigration topic page'))
      .css('margin', '20px 10px');

    for (let key in this.list) {
      const [title, people, note] = this.list[key];

      h2(title);

      if (note) {
        pg('<i>(' + note + ')</i>');
      }

      if (people.length == 0) {
        pg('<i>(none in list)</i>');;
      } else {
        rend($makePeopleList(people));
      }
    }
  }
}
