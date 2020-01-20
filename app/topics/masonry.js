class ViewTopicMasonry extends ViewStoryTopic {
  constructor(story) {
    super(story);
  }

  render() {
    this.renderSectionPeople();
    this.renderSectionGravestones();
    super.viewSources();
    super.viewExcerpts();
  }

  renderSectionPeople() {
    super.renderSectionPeople({
      title: 'Known members',
      subtext: 'Members are often identified in their obituary or by a ' +
        'symbol on their gravestone.'
    });
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
