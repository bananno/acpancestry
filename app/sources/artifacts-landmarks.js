function artifactBlock(story, specs) {
  const $box = $('<div>');

  if (specs.largeHeader) {
    $box.append('<h2>' + story.title + '</h2>');
  } else {
    $box.css('margin-left', '15px');
    const text = specs.highlightKeywords
      ? highlightKeywords(story.title, specs.highlightKeywords) : null;
    $box.append('<p>' + linkToStory(story, text) + '</p>');
    if (!specs.firstItem) {
      $box.css('margin-top', '20px');
    }
  }

  if (story.summary) {
    const summary = specs.highlightKeywords
      ? highlightKeywords(story.summary, specs.highlightKeywords) : story.summary;

    if (specs.largeHeader) {
      $box.append('<p style="margin-left: 10px">' + summary + '</p>');
    } else {
      $box.append('<p style="margin-top: 5px">' + summary + '</p>');
    }
  }

  $box.append($makePeopleList(specs.people || story.people, 'photo'));

  if (story.type == 'book') {
    $box.append(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  }

  rend($box);
}
