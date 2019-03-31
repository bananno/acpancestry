
function viewSearchEvents(keywords) {
  const eventsList = DATABASE.events.filter(event => {
    let searchItems = [event.title, event.location.format, event.notes];

     event.people.forEach(person => {
      searchItems.push(person.name);
     });

    return doesStrMatchKeywords(searchItems.join(' '), keywords);
  });

  if (eventsList.length) {
    rend('<h2>Events</h2>');
  }

  eventsList.forEach(event => {
    let people = event.people.map(person => highlightKeywords(person.name, keywords));

    let line1 = highlightKeywords(event.title, keywords);
    let lines = [];

    if (['birth', 'death', 'marriage'].indexOf(event.title) >= 0) {
      line1 += ' - ' + people.join(' & ');
    } else {
      lines.push(people.join(', '));
    }

    lines.push(highlightKeywords(event.location.format, keywords));
    lines.push(highlightKeywords(event.date.format, keywords));
    lines.push(highlightKeywords(event.notes, keywords));

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
