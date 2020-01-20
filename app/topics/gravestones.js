class ViewTopicGravestones extends ViewStoryTopic {
  static forEachGravestoneImage(callback) {
    DATABASE.stories
    .filter(story => story.type == 'cemetery')
    .forEach(story => {
      story.entries.forEach(source => {
        source.images.forEach(image => {
          callback(image);
        });
      });
    });
  }

  constructor(story) {
    super(story);
  }

  render() {
    pg('Click any image for more information about the grave.')
      .css('margin-top', '15px');

    const categories = {};
    const noCategory = [];

    ViewTopicGravestones.forEachGravestoneImage(image => {
      if (image.tags['gravestone symbol']) {
        const cat = image.tags['gravestone symbol'] || 'none';
        categories[cat] = categories[cat] || [];
        categories[cat].push(image);
      } else {
        noCategory.push(image);
      }
    });

    // categories.none = noCategory;

    for (let cat in categories) {
      h2(cat);
      categories[cat].forEach(image => {
        const $link = Image.asLink(image, 300);
        $link.find('img')
          .prop('title', image.item.title)
          .css('margin', '5px');
        rend($link);
      });
    }
  }
}
