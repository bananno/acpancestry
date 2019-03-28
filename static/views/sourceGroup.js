
function viewSourceGroup() {
  const sourceId = PATH.replace('sourceGroup/', '');

  const source = DATABASE.sources.filter(source => source._id == sourceId)[0];

  if (!source) {
    rend('<h1>Source not found</h1>');
    return;
  }

  if (source.type == 'grave') {
    viewSourceGroupCemetery(source);
    return;
  }

  rend('<h1>Source group</h1>');
}

function viewSourceGroupCemetery(rootSource) {
  const cemeteryName = rootSource.group;

  setPageTitle(cemeteryName);
  rend('<h1>' + cemeteryName + '</h1>');
  rend('<p style="padding-top: 10px;">' + formatLocation(rootSource.location) + '</p>');

  DATABASE.sources.forEach(source => {
    if (source.type != 'grave' || source.group != cemeteryName) {
      return;
    }

    rend('<h2>' + source.title + '</h2>');

    source.images.forEach(imageUrl => {
      rend(makeImage(imageUrl, 100, 100));
    });

    rend($makePeopleList(source.people, 'photo'));

    if (source.content) {
      rend(formatTranscription(source.content));
    }

    if (source.notes) {
      rend('<p>' + source.notes + '</p>');
    }

    source.links.forEach(linkUrl => {
      rend(getFancyLink(linkUrl));
    });
  });
}
