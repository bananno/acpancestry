
function viewSourceGroup() {
  const sourceId = PATH.replace('sourceGroup/', '');

  const source = DATABASE.sources.filter(source => source._id == sourceId)[0];

  if (!source) {
    rend('<h1>Source not found</h1>');
    return;
  }

  if (source.type == 'grave') {
    viewSourceGroupCemeteryOrNewspaper(source, 'Cemeteries');
    return;
  }

  if (source.type == 'newspaper') {
    viewSourceGroupCemeteryOrNewspaper(source, 'Newspapers', true);
    return;
  }

  rend('<h1>Source group</h1>');
}

function viewSourceGroupCemeteryOrNewspaper(rootSource, group, showDate) {
  const groupName = rootSource.group;
  setPageTitle(groupName);

  rend(
    '<p class="header-trail">' +
      localLink('sources', 'Sources') +
      ' &#8594; ' +
      localLink('sources/' + group.toLowerCase(), group) +
    '</p>'
  );

  rend('<h1>' + groupName + '</h1>');
  rend('<p style="padding-top: 10px;">' + formatLocation(rootSource.location) + '</p>');

  DATABASE.sources.forEach(source => {
    if (source.type != rootSource.type || source.group != groupName) {
      return;
    }

    rend('<h2>' + source.title + '</h2>');

    if (showDate && source.date.format) {
      rend('<p style="margin-left: 10px; margin-bottom: 10px;">' + source.date.format + '</p>');
    }

    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 100, 100).css('margin', '0 5px'));
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
