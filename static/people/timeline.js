
function showPersonTimeline(person) {
  rend('<h2>Timeline</h2>');

  const items = getPersonTimelineItems(person);

  items.forEach(showPersonTimelineItem);
}

function getPersonTimelineItems(person) {
  const list = [...DATABASE.events, ...DATABASE.sources].filter(item => {
    return item.people.indexOf(person) >= 0;
  });

  const dateParts = ['year', 'month', 'day'];

  list.sort((item2, item1) => {
    for (let i = 0; i < 3; i++) {
      const datePart1 = item1.date[dateParts[i]];
      const datePart2 = item2.date[dateParts[i]];

      if (datePart2 == null) {
        return 0;
      }

      if (datePart1 == null) {
        return -1;
      }

      if (datePart1 == datePart2) {
        return datePart1 - datePart2;
      }
    }
    return 0;
  });

  return list;
}

function showPersonTimelineItem(item) {
  const $div = $('<div class="timeline-item">');
  rend($div);

  $div.append(
    '<div class="timeline-item-date-place">' +
      (item.date.format ? '<b>' + item.date.format + '</b>' : '') +
      (item.date.format && item.location.format ? '<br>' : '') +
      item.location.format +
    '</div>'
  );

  const $col2 = $('<div>').appendTo($div);

  $col2.append(
    [item.type,
    item.group,
    item.title,
    item.people ? item.people.map(person => person.name).join(', ') : '',
    item.location.note
    ].filter(attr => attr).join('<br>')
  );
}
