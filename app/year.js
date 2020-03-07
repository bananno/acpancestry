
class ViewYear extends ViewPage {
  static load(params) {
    const year = parseInt(params.year);

    if (isNaN(year)) {
      return false;
    }

    new ViewYear(year).render();

    return true;
  }

  constructor(year) {
    super();

    this.year = year;

    this.bornThisYear = DATABASE.people.filter(person => {
      return person.birth && person.birth.date && person.birth.date.year === year;
    });

    this.diedThisYear = DATABASE.people.filter(person => {
      return person.death && person.death.date && person.death.date.year === year;
    });

    this.aliveThisYear = DATABASE.people.filter(person => {
      return person.birth && person.birth.date && person.birth.date.year < year
        && person.death && person.death.date && person.death.date.year > year;
    });

    this.events = DATABASE.events.filter(event => {
      return event.date && event.date.year == year
        && event.title != 'birth' && event.title != 'death';
    });

    this.bornThisYear.sortBy(person => person.birthSort);
    this.aliveThisYear.sortBy(person => person.birthSort);
    this.events.sortBy(event => event.date.sort);
  }

  render() {
    setPageTitle(this.year);
    h1(this.year);

    rend(
      '<p>' +
        localLink('year/' + (this.year - 1), '&#10229;' + (this.year - 1)) +
        ' &#160; &#160; &#160; ' +
        localLink('year/' + (this.year + 1), (this.year + 1) + '&#10230;') +
      '</p>'
    );

    let $list;

    h2('Events');
    this.events.forEach(event => {
      rend(ViewEvents.eventBlock(event).css('margin-left', '10px'));
    });

    h2('Born this year');
    $list = $makePeopleList(this.bornThisYear, 'photo');
    rend($list);

    h2('Died this year');
    $list = $makePeopleList(this.diedThisYear, 'photo');
    rend($list);

    h2('Lived during this year');
    $list = $makePeopleList(this.aliveThisYear, 'photo');
    rend($list);
    this.aliveThisYear.forEach(person => {
      const age = this.year - person.birth.date.year;
      $list.find('[data-person="' + person._id + '"]').append(' (age: ' + age + ')');
    });
  }
}
