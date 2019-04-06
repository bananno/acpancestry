
function showPersonTimeline(person) {
  rend('<h2>Timeline</h2>');

  const items = getPersonTimelineItems(person);

  items.forEach(showPersonTimelineItem);
}

function getPersonTimelineItems(person) {
  const list = [...DATABASE.events, ...DATABASE.sources].filter(item => {
    return item.people.indexOf(person) >= 0;
  });

  return list;
}

function showPersonTimelineItem(item) {
  rend(
    '<p style="margin-left: 15px; margin-top: 10px; padding-top: 10px; border-top: 1px solid black;">' +
      [item.type,
      item.group,
      item.title,
      item.date.format,
      item.location.format,
      item.people ? item.people.map(person => person.name).join(', ') : '',
      item.location.note
      ].filter(attr => attr).join('<br>') +
    '</p>'
  );
}
