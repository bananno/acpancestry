function artifactBlock(story, specs) {
  const $box = $('<div>');

  if (specs.largeHeader) {
    $box.append('<h2>' + story.title + '</h2>');
  } else {
    $box.css('margin-left', '15px');
    $box.append('<p>' + linkToStory(story) + '</p>');
    if (!specs.firstItem) {
      $box.css('margin-top', '20px');
    }
  }

  if (story.summary) {
    if (specs.largeHeader) {
      $box.append('<p style="margin-left: 10px">' + story.summary + '</p>');
    } else {
      $box.append('<p style="margin-top: 5px">' + story.summary + '</p>');
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
