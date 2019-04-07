
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

  const $col1 = $('<div class="timeline-item-date-place">').appendTo($div);
  const $col2 = $('<div>').appendTo($div);

  if (item.date.format) {
    $col1.append('<p><b>' + item.date.format + '</b></p>');
  }

  if (item.location.format) {
    $col1.append('<p>' + item.location.format + '</p>');
  }

  if (item.location.note) {
    $col1.append('<p><i>(' + item.location.note + ')</i></p>');
  }

  if (item.type) {
    $col2.append('<p>' + item.group + ' - ' + item.title + '</p>');
  } else {
    $col2.append('<p><b>' + item.title + '</b></p>');
  }

  if (item.note) {
    $col2.append('<p>' + item.note + '</p>');
  }

  $col2.append($makePeopleList(item.people, 'photo'));
}
