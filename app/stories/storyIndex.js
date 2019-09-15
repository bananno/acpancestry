class ViewStoryIndex extends ViewPage {
  static byUrl() {
    if (['artifacts', 'landmarks'].includes(PATH)) {
      new ViewStoryIndex(PATH).render();
      return true;
    }
  }

  constructor(storyType) {
    super();
    this.type = singularize(storyType);
    this.stories = this.getStories();
  }

  getStories() {
    if (this.type == 'artifact') {
      return DATABASE.stories.filter(story => {
        return story.type == 'artifact' || story.tags.artifact;
      });
    }
    return DATABASE.stories.filter(story => {
      return story.type == this.type;
    });
  }

  render() {
    this.headerTrail();
    this.setPageTitle();
    this.viewTitle();
    this.viewStories();
  }

  headerTrail() {
  }

  setPageTitle() {
    if (this.type == 'artifact') {
      return setPageTitle('Artifacts');
    }
    if (this.type == 'landmark') {
      return setPageTitle('Landmarks');
    }
    setPageTitle(this.type);
  }

  viewTitle() {
    if (this.type == 'artifact') {
      return h1('Artifacts and family heirlooms');
    }
    if (this.type == 'landmark') {
      return h1('Landmarks and buildings');
    }
    h1(this.type);
  }

  viewStories() {
    if (['artifact', 'landmark'].includes(this.type)) {
      this.makeList(this.stories, {
        type: 'stories',
        bullet: false,
        divider: true,
        summary: true,
        location: true,
      });
      return;
    }
  }
}
