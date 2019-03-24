
function viewEvents() {
  setPageTitle('Events');
  const $table = $('<table class="event-list" border="1">');

  rend('<h1>All Events</h1>');
  rend($table);

  $table.append($headerRow(['title', 'date', 'location', 'people', 'notes']));

  DATABASE.events.forEach(event => {
    const $row = $('<tr>').appendTo($table);

    addTd($row, event.title);
    addTd($row, formatDate(event.date));
    addTd($row, ' ');
    addTd($row, $makePeopleList(event.people));
    addTd($row, event.notes);
  });
}
