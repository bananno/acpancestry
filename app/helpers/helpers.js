function setPageTitle(title) {
  if (title && ('' + title).length) {
    document.title = title + ' | ' + SITE_TITLE;
  } else {
    document.title = SITE_TITLE;
  }
}

function rend(content) {
  $('#page-content').append(content);
}

function clearPage() {
  $('#page-content').html('');
}

function h1(content) {
  rend($('<h1>').append(content));
}

function h2(content) {
  rend($('<h2>').append(content));
}

function pg(content) {
  const $p = $('<p>').append(content);
  rend($p);
  return $p;
}

function bulletList(array, skipRender) {
  const $list = $('<ul class="bullet">');
  array.forEach(content => $list.append($('<li>').append(content)));
  if (!skipRender) {
    rend($list);
  }
  return $list;
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

function formatLocation(locat) {
  if (locat == null) {
    return '';
  }

  const locationComponents = [];
  const isUSA = locat.country === 'United States';

  if (locat.city) {
    locationComponents.push(locat.city);
  }

  if (locat.region2) {
    locationComponents.push(locat.region2);
  }

  if (isUSA) {
    if (locat.region1) {
      locationComponents.push(USA_STATES[locat.region1] || locat.region1);
    }
    locationComponents.push('USA');
  } else {
    if (locat.region1) {
      locationComponents.push(locat.region1);
    }
    if (locat.country) {
      locationComponents.push(locat.country);
    }
  }

  return locationComponents.join(', ');
}

function removeSpecialCharacters(str) {
  return str.replace('å', 'a')
    .replace('ö', 'o')
    .replace('“', '"')
    .replace('”', '"');
}

function fixSpecialCharacters(str) {
  return str.replace('å', '&aring;')
    .replace(/ö/g, '&ouml;')
    .replace('“', '"')
    .replace('”', '"')
    .replace('’', '\'');
}

function addTd($row, content) {
  $row.append($('<td>').append(content));
}

function $headerRow(array) {
  return '<tr><th>' + array.join('</th><th>') +
    '</th></tr>';
}

function headerTrail(...args) {
  rend(
    '<p class="header-trail">' +
      args.map(linkInfo => {
        let [path, text] = [].concat(linkInfo);
        if (path === false) {
          return text;
        }
        return localLink(path, text || path);
      }).join(' ' + RIGHT_ARROW + ' ') +
    '</p>'
  );
}

function formatTranscription(content) {
  const $mainDiv = $('<div>');

  content = (content || '').split('\n');

  let wasTable = false;
  let $div = $('<div class="transcription">').appendTo($mainDiv);

  content.forEach(str => {
    if (str.slice(0, 7).toLowerCase() == '[below:') {
      str = str.slice(7).trim();
      str = str.replace(']', ':');
      $mainDiv.append('<p style="padding: 5px;">' + str + '</p>');
      wasTable = false;
      if ($div.html() == '') {
        $div.remove();
      }
      $div = $('<div class="transcription">').appendTo($mainDiv);
      return;
    }

    if (str.slice(0, 1) == '|') {
      if (!wasTable) {
        $div.append('<table>');
        wasTable = true;
      }

      str = str.replace(/\|\|/g, '<th>');
      str = str.replace(/\|/g, '<td>');
      str = fixSpecialCharacters(str);

      $div.find('table:last').append('<tr>' + str + '</tr>');
      return;
    }

    wasTable = false;
    $div.append('<p>' + str + '</p>');
  });

  return $mainDiv;
}

function areDatesEqual(date1, date2) {
  if (date1 == null || date2 == null) {
    return date1 == null && date2 == null;
  }
  return date1.year == date2.year && date1.month == date2.month && date1.day == date2.day;
}

function isDateBeforeDate(date1, date2) {
  if (date1.date) {
    date1 = date1.date;
  }

  if (date2.date) {
    date2 = date2.date;
  }

  const dateParts1 = [date1.year, date1.month, date1.day];
  const dateParts2 = [date2.year, date2.month, date2.day];

  for (let i = 0; i < 3; i++) {
    if (dateParts2[i] == null || dateParts2[i] == 0) {
      return true;
    }

    if (dateParts1[i] == null || dateParts1[i] == 0) {
      return false;
    }

    if (dateParts1[i] != dateParts2[i]) {
      return dateParts1[i] < dateParts2[i];
    }
  }

  return false;
}

function removeDuplicatesById(list) {
  const foundId = {};

  return list.filter(obj => {
    if (foundId[obj._id]) {
      return false;
    }
    foundId[obj._id] = true;
    return true;
  });
}

function $notationBlock(notation, options = {}) {
  const $div = $('<div class="notation-block">');
  $div.append('<p style="margin-bottom: 10px"><b>' + notation.title + '</b></p>');
  if (options.splitParagraphs) {
    notation.text.split('\n').forEach(text => {
      $div.append('<p style="margin: 8px 0;">' + text + '</p>');
    });
  } else {
    $div.append('<p>' + notation.text + '</p>');
  }
  if (notation.people.length > 1 || options.alwaysShowPeople) {
    $div.append($makePeopleList(notation.people, 'photo'));
  }
  return $div;
}

function $quoteBlock(options) {
  const $quote = $('<div class="quote-block with-single">' +
    '<div class="left"></div>' +
    '<div class="main"></div>' +
    '</div>');

  if (options.rightQuote) {
    $quote.removeClass('with-single');
    $quote.addClass('with-double');
    $quote.append('<div class="right">');
  }

  if (options.coverBackground) {
    $quote.addClass('cover-background');
  }

  const $main = $quote.find('.main');

  $main.append($('<p class="quotation">').append(options.text));
  $main.append($('<p class="credit">').append(options.credit));

  if (options.css) {
    $quote.css(options.css);
  }

  return $quote;
}

function pad0(number, length) {
  number = '' + number;
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}
