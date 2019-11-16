class ViewSpecialTopicGravestones extends ViewPage {
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

  static gravestoneSymbols() {
    pg('Click any image for more information about the grave.')
      .css('margin-top', '15px');

    const categories = {};
    const noCategory = [];

    ViewSpecialTopicGravestones.forEachGravestoneImage(image => {
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

  static masonGravestones() {
    h2('Gravestones');

    pg('These gravestones show the Mason symbol. Click any image for more '
      + 'information about the grave.').css('margin', '15px 0');

    ViewSpecialTopicGravestones.forEachGravestoneImage(image => {
      if (image.tags['gravestone symbol'] == 'Freemasons') {
        const $link = Image.asLink(image, 250);
        $link.find('img')
          .prop('title', image.item.title)
          .css('margin', '5px');
        rend($link);
      }
    });
  }
}
