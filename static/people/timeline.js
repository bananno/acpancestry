
function showPersonTimeline(person) {
  if (person.private) {
    return;
  }

  rend('<h2>Timeline</h2>');

  const items = getPersonTimelineItems(person);

  items.forEach(showPersonTimelineItem);
}

function getPersonTimelineItems(person) {
  const list = [];

  DATABASE.events.forEach(item => {
    if (item.people.indexOf(person) >= 0) {
      let newItem = {...item};
      newItem.event = true;
      list.push(newItem);
    }
  });

  DATABASE.sources.forEach(item => {
    if (item.people.indexOf(person) >= 0) {
      let newItem = {...item};
      newItem.source = true;
      list.push(newItem);
    }
  });

  person.children.forEach(relative => {
    addFamilyEvents(relative, 'child');
  });

  person.spouses.forEach(relative => {
    addFamilyEvents(relative, 'spouse');
  });

  function addFamilyEvents(person, relationship) {
    DATABASE.events.forEach(item => {
      if (item.people.indexOf(person) >= 0 && item.title == 'birth') {
        let newItem = {...item};
        newItem.relationship = relationship;
        newItem.event = true;
        list.push(newItem);
      }
    });
  }

  const dateParts = ['year', 'month', 'day'];

  list.sort((item1, item2) => {
    // if there is no date on either item, the cemetery should be rated higher
    if (!item1.date.year && !item2.date.year) {
      return item1.type == 'grave' ? -1 : 0;
    }

    for (let i = 0; i < 3; i++) {
      const datePart1 = item1.date[dateParts[i]];
      const datePart2 = item2.date[dateParts[i]];

      if (datePart1 == null) {
        return 0;
      }

      if (datePart2 == null) {
        return -1;
      }

      if (datePart2 != datePart1) {
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

  const $col1 = $('<div class="column timeline-item-date-place">').appendTo($div);
  const $col2 = $('<div class="column timeline-item-info">').appendTo($div);

  let showPeopleList = true;

  if (item.event && (item.title == 'birth' || item.title == 'death')) {
    if (item.relationship) {
      $div.addClass('family-event');
    } else {
      $div.addClass('main-event');
      if (item.people.length == 1) {
        showPeopleList = false;
      }
    }
  }

  if (item.date.format) {
    $col1.append('<p><b>' + item.date.format + '</b></p>');
  } else if ($('.timeline-no-date').length == 0 && item.type != 'grave') {
    $div.before('<div class="timeline-no-date">No date:</div>')
  }

  if (item.location.format) {
    $col1.append('<p>' + item.location.format + '</p>');
  }

  if (item.location.notes) {
    $col1.append('<p><i>(' + item.location.notes + ')</i></p>');
  }

  if (item.source) {
    if (item.type == 'index') {
      $col2.append('<p><b>source</b></p>');
    } else if (item.type == 'grave') {
      $col2.append('<p><b>cemetery</b></p>');
    } else {
      $col2.append('<p><b>' + item.type + '</b></p>');
    }

    $col2.append(
      '<p style="margin-top: 5px;">' +
        linkToSource(item, item.group + (item.type == 'grave' ? '' : ' - ' + item.title)) +
      '</p>'
    );

    if (item.images.length) {
      $col1.append(makeImage(item.images[0], 100, 100));
    }
  } else {
    if (item.relationship) {
      $col2.append('<p><b>' + item.title + ' of ' + item.relationship + '</b></p>');
    } else {
      $col2.append('<p><b>' + item.title + '</b></p>');
    }
  }

  if (showPeopleList) {
    $col2.append($makePeopleList(item.people, 'photo').css('margin-left', '-5px'));
  }

  if (item.notes) {
    $col2.append(
      '<p style="margin-top: 5px;">' +
        item.notes.replace(/\n/g, '</p><p style="margin-top: 5px;">') +
      '</p>'
    );
  }
}
