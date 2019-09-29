class ViewHome extends ViewPage {
  static byUrl() {
    new ViewHome();
  }

  constructor() {
    super();

    setPageTitle();
    h1(SITE_TITLE);

    h2('featured');
    rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

    [
      ['USA/MN/Pipestone%20County/Ruthton', 'Ruthton, Minnesota'],
    ].forEach(([path, name]) => rend($makeIconLink('places/' + path, name, 'images/map-icon.svg')));

    DATABASE.stories.filter(s => s.tags.featured).forEach(story => {
      let path, icon, image;
      if (story.type == 'cemetery') {
        path = story.type + '/' + story._id;
        image = 'images/map-icon.svg';
      } else if (story.type == 'newspaper') {
        path = story.type + '/' + story._id;
        image = 'images/newspaper-icon.jpg';
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

    h2('topics');
    bulletList([
      ['landmarks', 'landmarks and buildings'],
      ['artifacts', 'artifacts and family heirlooms'],
      ['topic/brickwalls', 'brick walls and mysteries'],
      ['topic/military', 'military'],
      ['topic/immigration', 'immigration'],
      ['topic/disease', 'disease'],
    ].map(([path, text]) => localLink(path, text)));

    h2('browse');
    bulletList([localLink('year/1904', 'browse by year')]);
  }
}
