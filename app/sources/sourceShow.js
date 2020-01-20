class ViewSource extends ViewPage {
  static byUrl() {
    const sourceId = PATH.replace('source/', '');

    const source = DATABASE.sourceRef[sourceId];

    if (!source) {
      h1('Source not found');
      return;
    }

    new ViewSource(source).render();
  }

  constructor(source) {
    super(source);
    this.source = source;
    this.story = source.story;
    this.type = source.story.type;
  }

  render() {
    this.setTitle();
    this.headerTrail();
    this.viewTitles();
    this.viewSectionSummary();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionPeople();
    this.viewStories();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.otherEntries();
  }

  setTitle() {
    if (this.type == 'cemetery') {
      setPageTitle(this.story.title);
    } else {
      setPageTitle('Source');
    }
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail(
        'sources',
        this.type.pluralize(),
        [this.type + '/' + this.story._id, this.story.title]
      );
    }

    if (this.type == 'document' && this.story.title.match('Census USA')) {
      return headerTrail('sources', ['sources/censusUSA', 'Census USA'],
        [false, this.source.date.year]);
    }

    return headerTrail('sources');
  }

  viewTitles() {
    if (this.type == 'cemetery') {
      pg(this.story.location.format);
      pg('<br>');
      h1(this.source.title);
      return;
    }

    if (this.type == 'newspaper') {
      h1(this.source.title);
      pg('newspaper article');
      pg(this.story.location.format);
      pg(this.source.date.format);
      return;
    }

    if (this.type == 'document') {
      if (this.story.title.match('Census USA')) {
        h1(this.source.title);
        pg(this.story.type);
      } else {
        h1('Document');
        pg(this.source.title);
      }
    } else {
      h1('Source');
      pg(this.story.type);
      pg(this.source.title);
    }

    pg(this.source.date.format || this.story.date.format);
    pg(this.source.location.format || this.story.location.format);
  }

  viewImages() {
    if (!this.source.images.length) {
      return;
    }

    h2('Images');

    if (this.source.tags.cropped) {
      rend('<p style="margin-bottom:10px">' +
        'The image is cropped to show the most relevent portion. ' +
        'See the "links" section below to see the full image.' +
      '</p>');
    }

    let measure = this.type == 'cemetery' ? 200 : null;

    this.source.images.forEach(image => {
      rend(Image.make(image, measure).css('margin-right', '5px'));
    });
  }

  viewStories() {
    if (this.source.stories.length == 0) {
      return;
    }
    h2('See Also');
    this.viewSectionList(this.source.stories, {
      type: 'stories',
      bullet: true,
      divider: false,
      summary: true,
      location: true,
      date: true,
    });
  }

  otherEntries() {
    if (this.type == 'document' && this.story.title.match('Census USA')) {
      const neighbors = this.story.entries.filter(source => {
        return source.location.format == this.source.location.format
          && source._id != this.source._id;
      });

      if (neighbors.length == 0) {
        return;
      }

      h2('Neighbors');

      pg('Other households in <b>' + this.source.location.format + '</b> in '
        + this.source.date.year + '.').css('margin-bottom', '10px');

      this.viewSectionList(neighbors, {
        type: 'sources',
        showStory: false,
        bullet: true,
        divider: false,
        summary: true,
        location: false,
        date: false,
      });

      return;
    }

    if (!['newspaper', 'cemetery'].includes(this.type)) {
      return;
    }

    const entries = this.story.entries.filter(s => s != this.source);

    if (entries.length == 0) {
      return;
    }

    h2('More from ' + this.story.title);

    if (this.type == 'cemetery') {
      entries.sortBy(source => source.title);
      ViewCemeteryOrNewspaper.showListOfGraves(entries);
    } else {
      entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
      ViewCemeteryOrNewspaper.showListOfArticles(entries);
    }
  }
}
