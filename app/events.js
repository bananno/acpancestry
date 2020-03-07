class ViewEvents extends ViewPage {
  static load(params) {
    new ViewEvents().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('Events');
    h1('All Events');

    const $table = $('<table class="event-list" border="1">');
    rend($table);

    $table.append($headerRow(['title', 'date', 'location', 'people', 'notes']));

    DATABASE.events.forEach(event => {
      const $row = $('<tr>').appendTo($table);

      addTd($row, event.title);
      addTd($row, formatDate(event.date));
      addTd($row, formatLocation(event.location));
      addTd($row, $makePeopleList(event.people));
      addTd($row, event.notes);
    });
  }

  static eventBlock(event) {
    const $div = $('<div style="margin-bottom:20px">');

    $div.append('<div><b>' + event.title + '</b></div>');
    $div.append('<div>' + event.people.map(person => person.name).join(', ') + '</div>');
    $div.append('<div>' + event.date.format + '</div>');
    $div.append('<div>' + event.location.format + '</div>');

    if (event.notes) {
      $div.append('<div>' + event.notes + '</div>');
    }

    return $div;
  }
}
