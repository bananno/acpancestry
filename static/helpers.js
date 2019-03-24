const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

function setPageTitle(title) {
  if (title && title.length) {
    document.title = title + ' | Lundberg Ancestry';
  } else {
    document.title = 'Lundberg Ancestry';
  }
}

function rend(content) {
  $('#page-content').append(content);
}

function $makePeopleList(people) {
  const $list = $('<ul class="people-list">');

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.append(linkToPerson(person));
  });

  return $list;
}

function linkToPerson(person) {
  return '<a href="' + ORIGIN + '?person/' + person.customId + '">' +
    fixSpecialCharacters(person.name) + '</a>';
}

function formatDate(date) {
  if (date == null) {
    return '';
  }

  let dateString = '';

  if (date) {
    if (date.month && date.month > 0 && date.month <= 12) {
      dateString += MONTH_NAMES[date.month - 1];
    }

    if (date.day) {
      if (dateString.length > 0) {
        dateString += ' ';
      }
      dateString += date.day;
    }

    if (date.year) {
      if (dateString.length > 0) {
        dateString += ', ';
      }
      dateString += date.year;
    }

    if (date.display) {
      dateString = date.display;
    }
  }

  return dateString;
}

function removeSpecialCharacters(str) {
  return str.replace('å', 'a')
    .replace('“', '"')
    .replace('”', '"');
}

function fixSpecialCharacters(str) {
  return str.replace('å', '&aring;')
    .replace('“', '"')
    .replace('”', '"');
}

function addTd($row, content) {
  $row.append($('<td>').append(content));
}

function $headerRow(array) {
  return '<tr><th>' + ['title', 'date', 'location', 'people', 'notes'].join('</th><th>') +
    '</th></tr>';
}
