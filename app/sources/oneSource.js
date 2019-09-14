class ViewOneSource extends ViewPage {
  static byUrl() {
    const sourceId = PATH.replace('source/', '');

    const source = DATABASE.sourceRef[sourceId];

    if (!source) {
      h1('Source not found');
      return;
    }

    new ViewOneSource(source).render();
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
    if (this.type == 'cemetery') {
      return headerTrail('sources', 'cemeteries',
        ['cemetery/' + this.story._id, this.story.title]);
    }

    if (this.type == 'newspaper') {
      return headerTrail('sources', 'newspapers',
        ['newspaper/' + this.story._id, this.story.title]);
    }

    return headerTrail('sources');
  }

  viewTitles() {
    if (this.type == 'cemetery') {
      rend('<p>' + this.story.location.format + '</p>');
      rend('<p><br></p>');
      h1(this.source.title);
      return;
    }

    if (this.type == 'newspaper') {
      h1(this.source.title);
      rend('<p>newspaper article</p>');
      rend('<p>' + this.story.location.format + '</p>');
      rend('<p>' + this.source.date.format + '</p>');
      return;
    }

    if (this.type == 'document') {
      h1('Document');
    } else {
      h1('Source');
      rend('<p>' + this.story.type + '</p>');
    }

    rend('<p>' + this.source.title + '</p>');
    rend('<p>' + this.source.date.format || source.story.date.format + '</p>');
    rend('<p>' + this.source.location.format || source.story.location.format + '</p>');
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

    this.source.images.forEach((imageUrl, i) => {
      rend(makeImage(this.source, i, measure).css('margin-right', '5px'));
    });
  }

  otherEntries() {
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
      showListOfGraves(entries);
    } else {
      entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
      showListOfArticles(entries);
    }
  }
}
