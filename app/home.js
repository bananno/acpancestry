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
    DATABASE.images.filter(image => image.tags.featured).forEach(image => {
      const $link = Image.asLink(image, 100, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
    pg(localLink('photos', 'see more photos ' + RIGHT_ARROW))
      .css('margin', '10px');
  }

  viewBrowse() {
    h2('browse');

    this.viewBrowseSection({
      first: true,
      path: 'landmarks',
      title: 'landmarks and buildings',
      text: 'All the houses, businesses, farms, and other landmarks of any ' +
        'significance to the Family Tree.'
    });

    this.viewBrowseSection({
      path: 'artifacts',
      title: 'artifacts and family heirlooms'
    });

    this.viewBrowseSection({
      path: 'topic/military',
      title: 'military'
    });

    this.viewBrowseSection({
      path: 'topic/immigration',
      title: 'immigration',
      text: 'People in the Family Tree immigrated to the United States from ' +
        DATABASE.countryList.length + ' different countries. ' +
        'See a list of immigrants by county and a timeline of events.'
    });

    (() => {
      const people = DATABASE.people.filter(person => {
        return person.tags['died of disease'];
      });
      const diseases = [];
      people.forEach(person => {
        if (person.tags.disease && !diseases.includes(person.tags.disease)) {
          diseases.push(person.tags.disease);
        }
      });
      this.viewBrowseSection({
        path: 'topic/disease',
        title: 'disease',
        text: 'At least ' + people.length + ' people in the Family Tree ' +
          ' have died of ' + diseases.length + ' different diseases. See a ' +
          'list of people, historical events, and newspaper articles.'
      });
    })();

    this.viewBrowseSection({
      path: 'topic/big-families',
      title: 'big families'
    });

    DATABASE.stories.filter(story => story.type == 'topic').forEach(story => {
      let storyId = story.tags.customId || story._id;
      this.viewBrowseSection({
        path: 'topic/' + storyId,
        title: story.title.toLowerCase()
      });
    });

    this.viewBrowseSection({
      path: 'year/1904',
      title: 'browse by year',
      text: 'See what everyone in the Family Tree was up to during any given year.'
    });
  }

  viewBrowseSection(options) {
    if (!options.first) {
      rend('<hr style="margin-top: 20px;">');
    }

    pg(localLink(options.path, options.title))
      .css('margin-top', '20px').css('font-size', '18px');

    if (options.text) {
      pg(options.text).css('margin-top', '5px');
    }
  }
}
