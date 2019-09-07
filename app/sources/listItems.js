
function showSourceCategoryList(options) {
  showStory = options.showStoryInLink;
  if (showStory === undefined) {
    showStory = true;
  }

  if (options.title) {
    h2(options.title);
  }

  options.stories.forEach(story => {
    if (options.showStoryTitles) {
      h2(story.title);
    }
    showSourceList(story.entries, true, true, showStory);
  });
}

function showSourceList(sourceList, showLocation, showDate, showStory) {
  let previousHeader;
  let firstItem = true;

  sourceList.forEach(source => {
    let linkText;

    if (showStory) {
      linkText = source.story.title + ' - ' + source.title;
    } else {
      linkText = source.title;
    }

    rend(
      '<p style="padding-top: ' + (firstItem ? '5' : '15') + 'px; padding-left: 10px;">' +
        linkToSource(source, linkText) +
      '</p>'
    );

    if (showLocation) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.location.format +
        '</p>'
      );
    }

    if (showDate) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.date.format +
        '</p>'
      );
    }

    firstItem = false;
  });
}
