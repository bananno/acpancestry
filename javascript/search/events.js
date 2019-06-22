
class SearchResultsEvents extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.events.filter(event => {
      const searchItems = [event.title, event.location.format, event.notes];
      return this.isMatch(searchItems.join(' '));
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Events');

    this.resultsList.forEach(event => {
      const lines = [];
      let line1 = this.highlight(event.title);

      const people = event.people.map(person => person.name);

      if (['birth', 'death', 'birth and death', 'marriage'].indexOf(event.title) >= 0) {
        line1 += ' - ' + people.join(' & ');
      } else {
        lines.push(people.join(', '));
      }

      lines.push(this.highlight(event.location.format));
      lines.push(this.highlight(event.date.format));
      lines.push(this.highlight(event.notes));

      rend(
        '<p class="search-result-item" style="padding-top: 10px">' + line1 + '</p>' +
        lines.map(str => {
          if (str == null || str == '') {
            return '';
          }
          return (
            '<p style="padding-top: 2px">' + str + '</p>'
          );
        }).join('')
      );
    });
  }
}
