class ViewTopicMasonry extends ViewStoryTopic {
  static new(story) {
    new ViewTopicMasonry(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    this.renderPeople();
    super.viewExcerpts();
    super.viewSources();
    this.renderSectionGravestones();
  }

  renderPeople() {
    h2('Known members');

    pg('Members are often identified in their obituary or by a ' +
      'symbol on their gravestone.').css('margin', '15px 0');

    rend($makePeopleList(this.story.people, 'photo'));
  }

  renderSectionGravestones() {
    h2('Gravestones');

    pg('These gravestones show the Mason symbol. Click any image for more '
      + 'information about the grave.').css('margin', '15px 0');

    ViewTopicGravestones.forEachGravestoneImage(image => {
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
