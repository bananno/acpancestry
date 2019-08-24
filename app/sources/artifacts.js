
function viewArtifacts() {
  setPageTitle('Artifacts');
  h1('Artifacts and family heirlooms');

  const artifacts = DATABASE.stories.filter(story => {
    return story.type == 'artifact' || story.tags.artifact;
  });

  artifacts.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo'));

    if (story.type == 'book') {
      rend(
        '<p style="margin: 10px">' +
          localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
        '</p>'
      );
    }
  });
}

function viewLandmarks() {
  setPageTitle('Landmarks');
  h1('Landmarks and buildings');

  const stories = DATABASE.stories.filter(story => {
    return story.type == 'landmark';
  });

  stories.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo'));
  });
}
