
function viewCemeteriesOrNewspapers() {
  if (PATH == 'cemeteries') {
    return viewCemeteriesNewspapersIndex('Cemeteries', 'cemetery', 'grave');
  }

  if (PATH.match('cemetery')) {
    return viewCemeteryOrNewspaper('cemetery');
  }

  if (PATH == 'newspapers') {
    return viewCemeteriesNewspapersIndex('Newspapers', 'newspaper', 'article');
  }

  if (PATH.match('newspaper')) {
    return viewCemeteryOrNewspaper('newspaper');
  }

  return pageNotFound();
}

function viewCemeteriesNewspapersIndex(title, storyType, entryName) {
  const [placeList, storiesByPlace] = getStoriesByPlace(storyType);

  headerTrail('sources');
  setPageTitle(title);
  h1(title);

  placeList.forEach(place => {
    h2(place);
    storiesByPlace[place].forEach(story => {
      let numEntries;

      if (storyType == 'cemetery') {
        numEntries = getNumberOfGravesInCemetery(story);
      } else {
        numEntries = story.entries.length;
      }

      rend(
        '<p style="padding: 15px 0 0 5px;">' +
          localLink(storyType + '/' + story._id, story.title) +
          (story.location.format ? '<br>' : '') + story.location.format +
          '<br>' + numEntries + ' ' + pluralize(entryName, numEntries) +
        '</p>'
      );
    });
  });
}

function getStoriesByPlace(storyType) {
  const placeList = [];
  const storiesByPlace = { Other: [] };
  const stories = DATABASE.stories.filter(s => s.type == storyType);

  stories.forEach(story => {
    let placeName = 'Other';
    if (story.location.country == 'United States' && story.location.region1) {
      placeName = USA_STATES[story.location.region1];
    }
    if (storiesByPlace[placeName] == undefined) {
      placeList.push(placeName);
      storiesByPlace[placeName] = [];
    }
    storiesByPlace[placeName].push(story);
  });

  placeList.sort();

  if (storiesByPlace.Other.length) {
    placeList.push('Other');
  }

  return [placeList, storiesByPlace];
}

function viewCemeteryOrNewspaper(storyType) {
  const storyId = PATH.replace(storyType + '/', '');
  const story = DATABASE.storyRef[storyId];

  if (!story) {
    return pageNotFound();
  }

  if (storyType == 'newspaper') {
    story.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
  }

  headerTrail('sources', pluralize(storyType));
  setPageTitle(story.title);
  h1(story.title);

  rend('<p style="padding-top: 10px;">' + story.location.format + '</p>');

  rend($makePeopleList(story.people, 'photo'));

  if (story.notes) {
    rend('<p>' + story.notes + '</p>');
  }

  if (story.images.length) {
    h2('Images');
    story.images.forEach((imageUrl, i) => {
      rend(makeImage(story, i, 100, 100).css('margin', '10px 5px 0 5px'));
    });
  }

  if (story.links.length) {
    h2('Links');
    story.links.forEach(linkUrl => {
      rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
    });
  }

  if (storyType == 'cemetery') {
    story.entries.trueSort((a, b) => a.title < b.title);
    h2('Graves');
    showListOfGraves(story.entries)
  } else {
    story.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    h2('Articles');
    showListOfArticles(story.entries);
  }
}

function getNumberOfGravesInCemetery(story) {
  let count = 0;

  story.entries.forEach(source => {
    count += source.people.length || 1;
  });

  return count;
}

function showListOfGraves(sources) {
  sources.forEach((source, i) => {
    const $box = $('<div style="margin: 20px 10px;">');

    $box.append('<p>' + linkToSource(source) + '</p>');

    if (source.summary) {
      $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
    }

    rend($box);
  });
}

function showListOfArticles(sources) {
  sources.forEach((source, i) => {
    if (i > 0) {
      rend('<hr>');
    }

    const $box = $('<div style="margin: 20px 10px;">');

    $box.append('<p>' + linkToSource(source) + '</p>');

    if (source.date.format) {
      $box.append('<p style="margin-top: 5px">' + source.date.format + '</p>');
    }

    if (source.summary) {
      $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
    }

    rend($box);
  });
}
