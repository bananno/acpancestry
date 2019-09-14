class ViewStory extends ViewPage {
  constructor(story) {
    super(story);
    this.story = story;
    this.type = story.type;
    this.entries = story.entries;
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail('sources', pluralize(this.type));
    }

    if (['artifact', 'landmark'].includes(this.type)) {
      return headerTrail(pluralize(this.type));
    }

    return headerTrail('sources');
  }

  viewImages() {
    if (!this.story.images.length) {
      return;
    }
    h2('Images');
    this.story.images.forEach((imageUrl, i) => {
      rend(makeImage(this.story, i, 100, 100).css('margin', '10px 5px 0 5px'));
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
}

class ViewCemeteryOrNewspaper extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('newspaper/', '').replace('cemetery/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return pageNotFound();
    }

    new ViewCemeteryOrNewspaper(story).render();
  }

  constructor(story) {
    super(story);

    if (this.type == 'cemetery') {
      this.entries.sortBy(source => source.title);
    } else if (this.storyType == 'newspaper') {
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
    this.showEntries();
  }

  showEntries() {
    if (this.type == 'cemetery') {
      h2('Graves');
      showListOfGraves(this.entries)
    } else {
      h2('Articles');
      showListOfArticles(this.entries);
    }
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
    this.showEntries();
  }

  showEntries() {
    h2('Chapters');

    if (this.entries.length == 0) {
      pg('<i>None</i>').css('margin', '15px 10px');
      return;
    }

    this.makeList(this.entries, {
      type: 'sources',
      showStory: false,
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
  }

  constructor(story) {
    super(story);
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
  }
}
