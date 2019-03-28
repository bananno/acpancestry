const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const USE_STATES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

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

function $makePeopleList(people, format) {
  if (format == 'photo') {
    const $list = $('<div class="people-list">');

    people.forEach(person => {
      const $item = $('<div>').appendTo($list);
      $item.append(linkToPerson(person, '<img src="' + person.profileImage + '">'));
      $item.append(linkToPerson(person));
    });

    return $list;
  }

  const $list = $('<ul class="people-list">');

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.append(linkToPerson(person));
  });

  return $list;
}

function localLink(target, text) {
  return '<a href="' + ORIGIN + '?' + target + '">' + text + '</a>';
}

function linkToPerson(person, text) {
  text = text || fixSpecialCharacters(person.name);
  return localLink('person/' + person.customId, text);
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
      locationComponents.push(USE_STATES[locat.region1] || locat.region1);
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
    }
  }

  return (
    '<div class="fancy-link">' +
      '<a href="' + linkUrl  + '" target="_blank">' +
        '<img src="public/images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
  );
}

function formatTranscription(content) {
  const $div = $('<div class="transcription">');

  content = (content || '').split('\n');

  let wasTable = false;

  content.forEach(str => {
    if (str.slice(0, 1) == '|') {
      if (!wasTable) {
        $div.append('<table>');
        wasTable = true;
      }

      if (str.slice(0, 2) == '||') {
        str = '<th>' + str.slice(2);
      } else {
        str = '<td>' + str.slice(1);
      }

      str = str.split('||').join('<th>')
      str = str.split('|').join('<td>')

      $div.find('table:last').append('<tr>' + str + '</tr>');
      return;
    }

    wasTable = false;
    $div.append('<p>' + str + '</p>');
  });

  return $div;
}
