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

function h1(content) {
  rend($('<h1>').append(content));
}

function h2(content) {
  rend($('<h2>').append(content));
}

function bulletList(array, skipRender) {
  const $list = $('<ul class="bullet">');
  array.forEach(content => $list.append($('<li>').append(content)));
  if (!skipRender) {
    rend($list);
  }
  return $list;
}

function $makePeopleList(people, format, keywords) {
  if (format == 'photo') {
    const $list = $('<div class="people-list">');

    people.forEach(person => {
      const $item = $('<div class="icon-link">').appendTo($list);
      $item.attr('data-person', person._id);
      if (keywords) {
        $item.addClass('search-result-item');
      }
      $item.append(linkToPerson(person, false, '<img src="' + person.profileImage + '">'));
      $item.append(linkToPerson(person, true, null, keywords));
    });

    return $list;
  }

  const $list = $('<ul class="people-list">');

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.attr('data-person', person._id);
    $item.append(linkToPerson(person, true, null, keywords));
  });

  return $list;
}

function $makeIconLink(path, text, image) {
  return $('<div class="icon-link">')
    .append(localLink(path, '<img src="' + image + '">'))
    .append(localLink(path, text));
}

function localLink(target, text, newTab) {
  return '<a href="' + ORIGIN + '?' + target + '"' + (newTab ? ' target="_blank"' : '') + '>'
    + text + '</a>';
}

function linkToPerson(person, leaf, text, keywords) {
  text = text || fixSpecialCharacters(person.name);
  if (keywords) {
    text = highlightKeywords(text, keywords);
  }
  return localLink('person/' + person.customId, text
    + (leaf && person.star ? '&#160;<span class="person-leaf"></span>' : ''));
}

function linkToSource(source, text) {
  text = text || source.title;
  return localLink('source/' + source._id, text);
}

function linkToSourceGroup(source, text) {
  text = text || source.title;
  return localLink('sourceGroup/' + source._id, text);
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
    .replace('”', '"');
}

function addTd($row, content) {
  $row.append($('<td>').append(content));
}

function $headerRow(array) {
  return '<tr><th>' + array.join('</th><th>') +
    '</th></tr>';
}

function getFancyLink(link) {
  let linkUrl = link;
  let linkText = link;
  let imageName = 'external-link.png';

  if (linkUrl.match(' ')) {
    linkUrl = linkUrl.slice(0, linkUrl.indexOf(' '));
    linkText = linkText.slice(linkText.indexOf(' ') + 1);

    if (linkText == 'Ancestry') {
      imageName = 'logo-ancestry.png';
      linkText = '';
    } else if (linkText == 'FamilySearch') {
      imageName = 'logo-familysearch.png';
      linkText = '';
    } else if (linkText == 'FindAGrave') {
      imageName = 'logo-findagrave.png';
      linkText = '';
    } else if (linkText == 'WikiTree') {
      imageName = 'logo-wikitree.png';
      linkText = '';
    }
  }

  return (
    '<div class="fancy-link">' +
      '<a href="' + linkUrl  + '" target="_blank">' +
        '<img src="images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
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
  const dateParts1 = [date1.year, date1.month, date1.day];
  const dateParts2 = [date2.year, date2.month, date2.day];

  for (let i = 0; i < 3; i++) {
    if (dateParts2[i] == null) {
      return true;
    }

    if (dateParts1[i] == null) {
      return false;
    }

    if (dateParts1[i] != dateParts2[i]) {
      return dateParts1[i] < dateParts2[i];
    }
  }

  return false;
}

function pluralize(word, number) {
  if (number === 1) {
    return word;
  }
  return {
    cemetery: 'cemeteries',
    Cemetery: 'Cemeteries',
    child: 'children',
    Child: 'Children',
  }[word] || word + 's';
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

function $notationBlock(notation, alwaysShowPeople) {
  const $div = $('<div class="notation-block">');
  $div.append('<p style="margin-bottom: 10px"><b>' + notation.title + '</b></p>');
  $div.append('<p>' + notation.text + '</p>');
  if (notation.people.length > 1 || alwaysShowPeople) {
    $div.append($makePeopleList(notation.people, 'photo'));
  }
  return $div;
}
