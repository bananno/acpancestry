class ViewHome extends ViewPage {
  static byUrl() {
    new ViewHome().render();
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle();
    h1(SITE_TITLE);

    this.viewFeatured();
    this.viewPhotos();
    this.viewTopics();
    this.viewBrowse();
  }

  viewFeatured() {
    h2('featured');
    rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

    DATABASE.stories
    .filter(story => story.tags.featured)
    .sortBy(story => story.type)
    .forEach(story => {
      let path, icon, image;
      if (story.type == 'cemetery') {
        path = story.type + '/' + story._id;
        image = 'images/map-icon.svg';
      } else if (story.type == 'newspaper') {
        path = story.type + '/' + story._id;
        image = 'images/newspaper-icon.jpg';
      } else if (story.type == 'place') {
        return Place.$iconLink(story.location, { text: story.title, render: true });
      } else {
        return;
      }
      rend($makeIconLink(path, story.title, image));
    });

    DATABASE.sources.filter(s => s.tags.featured).forEach(source => {
      rend(
        '<p style="margin: 10px">' +
          linkToSource(source, source.story.title + ' - ' + source.title) +
        '</p>'
      );
    });
  }

  viewPhotos() {
    h2('photos');
    DATABASE.sources.filter(s => s.story.title == 'Photo').forEach(source => {
      if (source.images.length) {
        rend(
          localLink('source/' + source._id, '<img src="' + source.images[0] +
          '" style="height: 100px; max-width: 300px; margin: 5px;" title="' +
          source.title + '">')
        );
      }
    });
  }

  viewTopics() {
    h2('topics');

    const basicTopicList = [
      ['landmarks', 'landmarks and buildings'],
      ['artifacts', 'artifacts and family heirlooms'],
      ['topic/brickwalls', 'brick walls and mysteries'],
      ['topic/military', 'military'],
      ['topic/immigration', 'immigration'],
      ['topic/disease', 'disease'],
      ['topic/big-families', 'big families'],
    ].map(([path, text]) => localLink(path, text));

    const storyTopicList = DATABASE.stories
      .filter(story => story.type == 'topic')
      .map(story => linkToStory(story, story.title.toLowerCase()));

    bulletList([...basicTopicList, ...storyTopicList]);
  }

  viewBrowse() {
    h2('browse');
    bulletList([localLink('year/1904', 'browse by year')]);
  }
}
