class ViewStory extends ViewPage {
  static byId(storyId) {
    const story = DATABASE.storyRef[storyId];

    if (story) {
      new ViewStory(story);
      return true;
    }
  }

  constructor(story) {
    super(story);
    this.story = story;
    this.type = story.type;
    this.entries = story.entries;
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail('sources', this.type.pluralize());
    }

    if (['artifact', 'landmark'].includes(this.type)) {
      return headerTrail(this.type.pluralize());
    }

    return headerTrail('sources');
  }

  renderSectionPeople(options = {}) {
    h2(options.title || 'Known members');

    if (options.subtext) {
      pg(options.subtext).css('margin', '15px 0');
    }

    rend($makePeopleList(options.people || this.story.people, 'photo'));
  }

  viewImages() {
    if (!this.story.images.length) {
      return;
    }
    h2('Images');
    this.story.images.forEach(image => {
      rend(Image.make(image, 100, 100).css('margin', '10px 5px 0 5px'));
    });
  }

  viewPhotos() {
    const images = [];

    const sources = DATABASE.sources.filter(source => {
      if (source.stories.includes(this.story)) {
        source.images.forEach(image => {
          if (image.tags.story) {
            images.push(image);
          }
        });
      }
    });

    if (images.length == 0) {
      return;
    }

    h2('Photos');

    images.forEach(image => {
      const $link = Image.asLink(image, 200, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
  }

  viewSources() {
    const sources = DATABASE.sources.filter(source => {
      return source.stories.includes(this.story);
    });
    if (sources.length == 0) {
      return;
    }
    h2('Sources');
    sources.forEach(source => {
      rend('<p style="margin: 10px">' + linkToSource(source, true) + '</p>');
    });
  }

  viewExcerpts() {
    const excerpts = this.story.notations.filter(notation => {
      return notation.title == 'excerpt';
    });
    if (excerpts.length == 0) {
      return;
    }
    h2('Excerpts');
    excerpts.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr style="margin: 20px 0;">');
      }
      pg(notation.text).css('margin-top', '20px');
      pg('from ' + linkToSource(notation.source, true))
        .css('margin', '10px 0 0 30px');
    });
  }

  viewSectionSources() {
    if (this.story.sources.length == 0) {
      return;
    }
    h2('Sources');
    this.story.sources.forEach(source => {
      pg(linkToSource(source, true)).css('margin', '10px 5px');
    });
  }
}

class ViewCemeteryOrNewspaper extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('newspaper/', '').replace('cemetery/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return pageNotFound();
    }

    new ViewCemeteryOrNewspaper(story).render();
    return true;
  }

  constructor(story) {
    super(story);

    if (this.type == 'cemetery') {
      this.entries.sortBy(source => source.title);
    } else if (this.type == 'newspaper') {
      this.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    }
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    rend('<p style="padding-top: 10px;">' + this.story.location.format + '</p>');

    this.viewSectionPeople();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
    this.showEntries();
  }

  showEntries() {
    if (this.type == 'cemetery') {
      h2('Graves');
      ViewCemeteryOrNewspaper.showListOfGraves(this.entries)
    } else {
      h2('Articles');
      ViewCemeteryOrNewspaper.showListOfArticles(this.entries);
    }
  }

  static showListOfGraves(sources) {
    sources.forEach((source, i) => {
      const $box = $('<div style="margin: 20px 10px;">');

      $box.append('<p>' + linkToSource(source) + '</p>');

      if (source.summary) {
        $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
      }

      rend($box);
    });
  }

  static showListOfArticles(sources) {
    sources.forEach((source, i) => {
      if (i > 0) {
        rend('<hr>');
      }

      const $box = $('<div style="margin: 20px 10px;">');

      $box.append('<p>' + linkToSource(source) + '</p>');

      if (source.date.format) {
        $box.append('<p style="margin-top: 5px">' + source.date.format + '</p>');
      }

      if (source.summary) {
        $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
      }

      rend($box);
    });
  }
}

class ViewStoryBook extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('book/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return pageNotFound();
    }

    new ViewStoryBook(story).render();
    return true;
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    ['date', 'location'].forEach(attr => {
      if (this.story[attr].format) {
        rend('<p style="padding-top: 10px;">' + this.story[attr].format + '</p>');
      }
    });

    this.viewSectionPeople();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
    this.showEntries();
  }

  showEntries() {
    h2('Chapters');

    if (this.entries.length == 0) {
      pg('<i>None</i>').css('margin', '15px 10px');
      return;
    }

    this.viewSectionList(this.entries, {
      type: 'sources',
      showStory: false,
      bullet: true,
      divider: false,
      summary: true,
    });
  }
}

class ViewStoryArtifactOrLandmark extends ViewStory {
  static byUrl() {
    const [storyType, storyId, extraText] = PATH.split('/');
    const story = DATABASE.storyRef[storyId];

    if (storyType != 'artifact' && storyType != 'landmark') {
      return false;
    }

    if (!story || extraText) {
      return pageNotFound();
    }

    new ViewStoryArtifactOrLandmark(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    rend('<p style="padding-top: 10px;">' + this.story.location.format + '</p>');

    this.viewSectionSummary();
    this.viewSectionPeople();
    this.viewPhotos();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
  }
}

class ViewStoryEvent extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('event/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryEvent(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);

    ['date', 'location'].forEach(attr => {
      if (this.story[attr] && this.story[attr].format) {
        pg(this.story[attr].format).css('margin', '5px');
      }
    });

    this.viewSectionPeople();
    this.viewSectionSources();
    this.viewExcerpts();
  }
}
