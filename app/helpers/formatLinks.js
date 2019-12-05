function localLink(target, text, newTab) {
  if (target.slice(0, 1) == '/') {
    target = target.slice(1);
  }
  if (newTab) {
    return '<a href="' + ORIGIN + '/' + target + '" target="_blank">'
      + text + '</a>';
  }
  return '<a href="' + ORIGIN + '/' + target + '" class="local-link">'
    + text + '</a>';
}

function linkToPerson(person, includeLeaf, text, keywords) {
  text = text || fixSpecialCharacters(person.name);
  if (keywords) {
    text = highlightKeywords(text, keywords);
  }
  if (includeLeaf && person.leaf) {
    text += '&#160;<span class="person-leaf-link leaf-' + person.leaf + '"></span>';
  }
  return localLink('person/' + person.customId, text);
}

function linkToStory(story, text) {
  let path = story.type;
  text = text || story.title;
  return localLink(path + '/' + story._id, text);
}

function linkToSource(source, text) {
  if (text === true) {
    text = source.story.title + ' - ' + source.title;
  } else {
    text = text || source.title;
  }
  return localLink('source/' + source._id, text);
}

function $makeIconLink(path, text, image) {
  return $('<div class="icon-link">')
    .append(localLink(path, '<img src="' + image + '">'))
    .append(localLink(path, text));
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
    } else if (linkText == 'BillionGraves') {
      imageName = 'logo-billiongraves.svg';
      linkText = '';
    } else if (linkText == 'FamilySearch') {
      imageName = 'logo-familysearch.png';
      linkText = '';
    } else if (linkText == 'FindAGrave') {
      imageName = 'logo-findagrave.png';
      linkText = '';
    } else if (linkText == 'WikiTree') {
      imageName = 'logo-wikitree.png';
      linkText = '';
    }
  }

  return (
    '<div class="fancy-link">' +
      '<a href="' + linkUrl  + '" target="_blank">' +
        '<img src="/images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
  );
}
