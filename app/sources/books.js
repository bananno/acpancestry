function viewBook() {
  if (PATH == 'books') {
    return viewBooksIndex();
  }

  const storyId = PATH.replace('book/', '');

  const story = DATABASE.storyRef[storyId];

  if (story) {
    return viewOneBook(story);
  }

  return pageNotFound();
}

function viewBooksIndex() {
  headerTrail('sources');
  setPageTitle('Books');
  h1('Books');

  const books = DATABASE.stories.filter(story => story.type == 'book');

  books.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo').css('margin-top', '15px'));

    rend(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  });
}

function viewOneBook(story) {
  headerTrail('sources', 'books');
  setPageTitle(story.title);
  h1(story.title);

  ['date', 'location'].forEach(attr => {
    if (story[attr].format) {
      rend('<p style="padding-top: 10px;">' + story[attr].format + '</p>');
    }
  });

  story.images.forEach((imageUrl, i) => {
    rend(makeImage(story, i, 100, 100).css('margin', '10px 5px 0 5px'));
  });

  rend($makePeopleList(story.people, 'photo').css('margin', '15px 0'));

  if (story.notes) {
    rend('<p>' + story.notes + '</p>');
  }

  story.links.forEach(linkUrl => {
    rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
  });

  story.entries.forEach(showBookEntry);
}

function showBookEntry(source) {
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
