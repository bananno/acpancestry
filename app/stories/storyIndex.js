class ViewStoryIndex extends ViewPage {
  constructor(options = {}) {
    super();
    this.type = options.storyType.singularize();
    this.mainTitle = options.storyType.capitalize();
    this.h1Title = options.h1Title || this.mainTitle;
    this.entryName = options.entryName;
    this.stories = this.getStories();
  }

  getStories() {
    return Story.filterByType(this.type);
  }

  render() {
    this.headerTrail();
    setPageTitle(this.mainTitle);
    h1(this.h1Title);
    this.renderStories();
  }

  headerTrail() {
    // skip for most story types
  }

  renderStories() {
    this.viewSectionList(this.stories, {
      type: 'stories',
      bullet: false,
      divider: true,
      summary: true,
      location: true,
      date: true,
    });
  }
}

class ViewStoryIndexArtifacts extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexArtifacts().render();
  }

  constructor() {
    super({
      storyType: 'artifacts',
      h1Title: 'Artifacts and family heirlooms',
    });
  }

  getStories() {
    return Story.filter(story => {
      return story.type == 'artifact' || story.tags.artifact;
    });
  }
}

class ViewStoryIndexBooks extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexBooks().render();
  }

  constructor() {
    super({
      storyType: 'books',
    });
  }

  headerTrail() {
    headerTrail('sources');
  }
}

class ViewStoryIndexLandmarks extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexLandmarks().render();
  }

  constructor() {
    super({
      storyType: 'landmarks',
      h1Title: 'Landmarks and buildings'
    });
  }
}

class ViewStoryIndexCemeteryOrNewspaper extends ViewStoryIndex {
  // Cemeteries and newspapers have more functionality in common with
  // each other than with any of the other story types.

  constructor(options) {
    super(options);
    this.getStoriesByPlace();
  }

  headerTrail() {
    headerTrail('sources');
  }

  getStoriesByPlace() {
    this.placeList = [];
    this.storiesByPlace = {Other: []};

    this.stories.forEach(story => {
      let placeName = 'Other';
      if (story.location.country == 'United States' && story.location.region1) {
        placeName = USA_STATES[story.location.region1];
      }
      if (this.storiesByPlace[placeName] == undefined) {
        this.placeList.push(placeName);
        this.storiesByPlace[placeName] = [];
      }
      this.storiesByPlace[placeName].push(story);
    });

    this.placeList.sort();

    if (this.storiesByPlace.Other.length) {
      this.placeList.push('Other');
    }
  }

  renderStories() {
    this.placeList.forEach(place => {
      h2(place);
      this.storiesByPlace[place].forEach(story => {
        pg(linkToStory(story)).css('margin', '15px 0 0 5px');
        pg(story.location.format).css('margin-left', '5px');

        let numEntries;

        if (this.type == 'cemetery') {
          numEntries = Story.getNumberOfGravesInCemetery(story);
        } else {
          numEntries = story.entries.length;
        }

        pg(numEntries + ' ' + this.entryName.pluralize(numEntries))
          .css('margin-left', '5px');
      });
    });
  }
}

class ViewStoryIndexCemeteries extends ViewStoryIndexCemeteryOrNewspaper {
  static load(params) {
    new ViewStoryIndexCemeteries().render();
  }

  constructor() {
    super({
      storyType: 'cemeteries',
      entryName: 'grave',
    });
  }
}

class ViewStoryIndexNewspapers extends ViewStoryIndexCemeteryOrNewspaper {
  static load(params) {
    new ViewStoryIndexNewspapers().render();
  }

  constructor() {
    super({
      storyType: 'newspapers',
      entryName: 'article',
    });
  }
}

