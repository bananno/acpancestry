function $makePeopleList(people, format, options = {}) {
  if (format == 'photo') {
    return $makePeopleListPhoto(people, format, options);
  }

  const $list = $('<ul class="people-list">');

  if (options.css) {
    $list.css(options.css);
  }

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.attr('data-person', person._id);
    $item.append(linkToPerson(person, true, null, options.highlightKeywords));
  });

  return $list;
}

function $makePeopleListPhoto(people, format, options) {
  const $list = $('<div class="people-list">');

  if (options.css) {
    $list.css(options.css);
  }

  let $visiblePart, $toggleListLink, $hiddenPart, numVisiblePeople;

  $visiblePart = $('<div>').appendTo($list);

  if (options.collapseIfAtLeast !== undefined
      && people.length >= options.collapseIfAtLeast) {
    $toggleListLink = $('<div>').appendTo($list);
    $hiddenPart = $('<div>').appendTo($list);
    $hiddenPart.hide();
    numVisiblePeople = options.collapseAfterNumber || 0;

    const showText = options.collapseMessage
      .replace('HIDDENNUM', people.length - numVisiblePeople)
      .replace('TOTALNUM', people.length);

    $toggleListLink.addClass('fake-link').css('margin-top', '5px').text(showText);

    $toggleListLink.click(() => {
      if ($hiddenPart.is(':visible')) {
        $hiddenPart.slideUp();
        $toggleListLink.text(showText);
      } else {
        $hiddenPart.slideDown();
        if (options.allowRehide) {
          $toggleListLink.text('hide list');
        } else {
          $toggleListLink.remove();
        }
      }
    });
  } else {
    numVisiblePeople = people.length;
  }

  people.forEach((person, index) => {
    const $item = $('<div class="icon-link">');
    $item.attr('data-person', person._id);

    if (options.highlightKeywords) {
      $item.addClass('search-result-item');
    }

    $item.append(linkToPerson(person, false, '<img src="' + person.profileImage + '">'));
    $item.append(linkToPerson(person, true, null, options.highlightKeywords));

    if (index >= numVisiblePeople) {
      $hiddenPart.append($item);
    } else {
      $visiblePart.append($item);
    }

    if (options.showText) {
      $item.append(' ' + (options.showText(person) || ''));
    }
  });

  return $list;
}
