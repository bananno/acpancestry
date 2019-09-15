class ViewStoryIndex extends ViewPage {
  static byUrl() {
    if (['artifacts', 'cemeteries', 'landmarks', 'newspapers']
        .includes(PATH)) {
      new ViewStoryIndex(PATH).render();
      return true;
    }
    return false;
  }

  constructor(storyType) {
    super();
    this.type = storyType.singularize();
    this.mainTitle = storyType.capitalize();
    this.stories = this.getStories();
    this.entryName = this.getEntryName();
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

  getEntryName() {
    if (this.type == 'cemetery') {
      return 'grave';
    }
    if (this.type == 'newspaper') {
      return 'article';
    }
  }

  render() {
    this.headerTrail();
    this.setPageTitle();
    this.viewTitle();
    this.viewStories();
  }

  headerTrail() {
    if (['cemetery', 'newspaper'].includes(this.type)) {
      headerTrail('sources');
    }
  }

  setPageTitle() {
    setPageTitle(this.mainTitle);
  }

  viewTitle() {
    if (this.type == 'artifact') {
      return h1('Artifacts and family heirlooms');
    }
    if (this.type == 'landmark') {
      return h1('Landmarks and buildings');
    }
    h1(this.mainTitle);
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
    if (['cemetery', 'newspaper'].includes(this.type)) {
      this.viewCemeteriesNewspapers();
      return;
    }
  }

  viewCemeteriesNewspapers() {
    const [placeList, storiesByPlace] = this.getStoriesByPlace();

    placeList.forEach(place => {
      h2(place);
      storiesByPlace[place].forEach(story => {
        pg(linkToStory(story)).css('margin', '15px 0 0 5px');
        pg(story.location.format).css('margin-left', '5px');

        let numEntries;

        if (this.type == 'cemetery') {
          numEntries = ViewStoryIndex.getNumberOfGravesInCemetery(story);
        } else {
          numEntries = story.entries.length;
        }

        pg(numEntries + ' ' + this.entryName.pluralize(numEntries))
          .css('margin-left', '5px');
      });
    });
  }

  getStoriesByPlace() {
    const placeList = [];
    const storiesByPlace = { Other: [] };
    const stories = DATABASE.stories.filter(s => s.type == this.type);

    stories.forEach(story => {
      let placeName = 'Other';
      if (story.location.country == 'United States' && story.location.region1) {
        placeName = USA_STATES[story.location.region1];
      }
      if (storiesByPlace[placeName] == undefined) {
        placeList.push(placeName);
        storiesByPlace[placeName] = [];
      }
      storiesByPlace[placeName].push(story);
    });

    placeList.sort();

    if (storiesByPlace.Other.length) {
      placeList.push('Other');
    }

    return [placeList, storiesByPlace];
  }

  static getNumberOfGravesInCemetery(story) {
    let count = 0;

    story.entries.forEach(source => {
      count += source.people.length || 1;
    });

    return count;
  }
}
