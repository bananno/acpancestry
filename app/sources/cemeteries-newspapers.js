
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
        '<p style="padding-top: 15px">' +
          localLink(storyType + '/' + story._id, story.title) +
          '<br>' + story.location.format +
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
    } else {
      storiesByPlace.Other.push(story);
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

  setPageTitle(story.title);
  h1(story.title);

  rend('<p style="padding-top: 10px;">' + story.location.format + '</p>');

  if (storyType == 'newspaper') {
    story.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
  }

  story.entries.forEach(showCemeteryNewspaperSource);
}

function getNumberOfGravesInCemetery(story) {
  let count = 0;

  story.entries.forEach(source => {
    count += source.people.length || 1;
  });

  return count;
}

function showCemeteryNewspaperSource(source) {
  h2(source.title);

  if (source.date.format) {
    rend('<p style="margin-left: 10px; margin-bottom: 10px;">' +
      source.date.format + '</p>');
  }

  source.images.forEach((imageUrl, i) => {
    rend(makeImage(source, i, 100, 100).css('margin', '0 5px'));
  });

  rend($makePeopleList(source.people, 'photo'));

  if (source.notes) {
    rend('<p>' + source.notes + '</p>');
  }

  source.links.forEach(linkUrl => {
    rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
  });

  if (source.content) {
    rend(formatTranscription(source.content));
  } else if (source.type == 'newspaper') {
    rend('<p style="margin: 10px"><i>Transcription not available.</i></p>');
  }
}
