class ViewSourcesIndex extends ViewPage {
  static load(params) {
    new ViewSourcesIndex().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('Sources');
    h1('Sources');

    pg('A "source" can be a document, photograph, artifact, landmark, ' +
      'website, or anything else that adds to the picture of a family tree.')
    .css('margin', '10px 0 15px 0');

    [
      ['All Sources', 'sources/all'],
      ['Photographs', 'photos'],
      ['Newspapers', 'newspapers'],
      ['Cemeteries', 'cemeteries'],
      ['Books', 'books'],
      ['US Federal Census', 'sources/censusUSA'],
      ['US State Census', 'sources/censusState'],
      ['Other Census', 'sources/censusOther'],
      ['Military Draft Registration', 'sources/draft'],
      ['Index-only Records', 'sources/indexOnly'],
      ['Other Sources', 'sources/other'],
    ].forEach(([text, path]) => {
      rend(
        '<p style="margin-top: 8px; font-size: 18px;">' +
          localLink(path, text) +
        '</p>'
      );
    });
  }
}

class ViewSourcesAll extends ViewPage {
  static load(params) {
    new ViewSourcesAll().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('All Sources');
    h1('All Sources');

    const $table = $('<table class="event-list" border="1">');

    rend($table);

    $table.append($headerRow(['type', 'group', 'title', 'date', 'location', 'people']));

    DATABASE.sources.forEach(source => {
      const $row = $('<tr>').appendTo($table);

      addTd($row, source.story.type);
      addTd($row, linkToStory(source.story));
      addTd($row, linkToSource(source, source.title));
      addTd($row, formatDate(source.date));
      addTd($row, formatLocation(source.location));
      addTd($row, $makePeopleList(source.people));
    });
  }
}

class ViewSourcesCensusUSA extends ViewPage {
  static load(params) {
    new ViewSourcesCensusUSA().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('United States Federal Census');
    h1('United States Federal Census');

    for (let year = 1790; year <= 1950; year += 10) {
      const story = Story.findByTitle('Census USA ' + year);

      if (!story) {
        continue;
      }

      h2(year);

      if (year == 1890) {
        rend(
          '<p style="padding-left: 10px;">' +
            'Most of the 1890 census was destroyed in a 1921 fire.' +
          '</p>'
        );
      }

      showSourceList(story.entries, true, false, false);
    }
  }
}

class ViewSourcesCensusState extends ViewPage {
  static load(params) {
    new ViewSourcesCensusState().render();
    return true;
  }

  constructor() {
    super();
    this.stories = DATABASE.stories.filter(isStoryStateCensus);
    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('US State Census');
    h1('US State Census');

    let previousHeader;

    this.stories.forEach(story => {
      const headerName = USA_STATES[story.location.region1];

      if (previousHeader != headerName) {
        h2(headerName);
        previousHeader = headerName;
      }

      showSourceList(story.entries, true, true, true);
    });
  }
}

function isStoryStateCensus(story) {
  return story.tags['Census US States'];
}

class ViewSourcesCensusOther extends ViewPage {
  static load(params) {
    new ViewSourcesCensusOther().render();
    return true;
  }

  constructor() {
    super();

    this.stories = DATABASE.stories.filter(story => {
      return story.title.match('Census')
        && !story.title.match('USA')
        && !isStoryStateCensus(story);
    });

    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Other Census');
    h1('Other Census');

    showSourceCategoryList({
      showStoryTitles: true,
      showStoryInLink: false,
      stories: this.stories
    });
  }
}

class ViewSourcesDraft extends ViewPage {
  static load(params) {
    new ViewSourcesDraft().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('Military Draft Registration');
    h1('Military Draft Registration');

    ['World War I draft', 'World War II draft'].forEach(title => {
      showSourceCategoryList({
        title: title,
        stories: DATABASE.stories.filter(story => story.title == title),
        showStoryInLink: false
      });
    });
  }
}

class ViewSourcesIndexOnly extends ViewPage {
  static load(params) {
    new ViewSourcesIndexOnly().render();
    return true;
  }

  constructor() {
    super();
    this.stories = DATABASE.stories.filter(story => story.type == 'index');
    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Index-only Records');
    h1('Index-only Records');

    pg(
      'These sources come from online databases. Some of these records ' +
      'are transcribed from original documents and images which are not ' +
      'directly available online. Others are from web-only databases.'
    ).css('padding', '10px 0');

    showSourceCategoryList({
      title: 'Birth Index',
      stories: this.stories.filter(story => story.title.match('Birth Index'))
    });

    showSourceCategoryList({
      title: 'Death Index',
      stories: this.stories.filter(story => story.title.match('Death Index'))
    });

    showSourceCategoryList({
      title: 'Other',
      stories: this.stories.filter(story => {
        return !story.title.match('Birth Index')
          && !story.title.match('Death Index');
      })
    });
  }
}

class ViewSourcesOther extends ViewPage {
  static load(params) {
    new ViewSourcesOther().render();
    return true;
  }

  constructor() {
    super();

    this.stories = DATABASE.stories.filter(story => {
      return !['cemetery', 'newspaper', 'index', 'book'].includes(story.type)
        && !['World War I draft', 'World War II draft',
          'Photo'].includes(story.title)
        && !story.title.match('Census');
    });

    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Other Sources');
    h1('Other Sources');

    showSourceCategoryList({
      title: 'Baptism',
      stories: this.stories.filter(story => story.title.match('Baptism'))
    });

    showSourceCategoryList({
      title: 'Marriage',
      stories: this.stories.filter(story => story.title.match('Marriage'))
    });

    showSourceCategoryList({
      title: 'Immigration & Travel',
      stories: this.stories.filter(story => story.title.match('Passenger'))
    });

    showSourceCategoryList({
      title: 'Other',
      stories: this.stories.filter(story => {
        return !story.title.match('Baptism')
          && !story.title.match('Marriage')
          && !story.title.match('Passenger');
      })
    });
  }
}
