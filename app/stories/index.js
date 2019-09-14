class ViewStory {
  constructor(story) {
    this.story = story;
    this.type = story.type;
    this.entries = story.entries;
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail('sources', pluralize(this.type));
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

  viewPeople() {
    if (!this.story.people.length) {
      return;
    }
    h2('People');
    rend($makePeopleList(this.story.people, 'photo'));
  }

  viewNotes() {
    if (!this.story.notes) {
      return;
    }
    h2('Notes');
    rend(
      '<ul class="bullet"><li>' +
        this.story.notes.split('\n').join('</li><li>') +
      '</li></ul>'
    );
  }

  viewLinks() {
    if (!this.story.links.length) {
      return;
    }
    h2('Links');
    rend(this.story.links.map(getFancyLink));
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

    this.viewPeople();
    this.viewImages();
    this.viewNotes();
    this.viewLinks();
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

    this.viewPeople();
    this.viewImages();
    this.viewNotes();
    this.viewLinks();
    this.showEntries();
  }

  showEntries() {
    h2('Chapters');

    if (this.entries.length == 0) {
      rend('<p style="margin: 15px 10px;"><i>None</i></p>');
      return;
    }

    this.entries.forEach((source, i) => {
      if (i > 0) {
        rend('<hr style="margin: 30px 0;">');
      }

      const $box = $('<div style="margin: 20px 10px;">');

      $box.append('<p>' + linkToSource(source) + '</p>');

      if (source.summary) {
        $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
      }

      rend($box);
    });
  }
}
