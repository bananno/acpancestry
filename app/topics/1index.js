class ViewStoryTopic extends ViewStory {
  static byUrl() {
    const [isTopic, storyId, leftovers] = PATH.split('/');

    if (isTopic != 'topic' || !storyId || leftovers) {
      return false;
    }

    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryTopic(story).render();
    return true;
  }

  static homePageSummary(story) {
    let matchTitle = story.title.toLowerCase();

    if (matchTitle.match('disease')) {
      return ViewTopicDisease.homePageSummary();
    }

    if (matchTitle.match('immigration')) {
      return ('People in the Family Tree immigrated to the United ' +
        'States from ' + DATABASE.countryList.length + ' different ' +
        'countries. See a list of immigrants by county and a ' +
        'timeline of events.')
    }

    return null;
  }

  constructor(story) {
    super(story);
    this.tempTitle = this.story.title.toLowerCase();
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);
    this.viewSpecialTopic() || this.viewOtherTopic();
  }

  viewSpecialTopic() {
    if (this.tempTitle.match('military')) {
      viewTopicMilitary();
      return true;
    }

    if (this.tempTitle.match('disease')) {
      new ViewTopicDisease().render();
      return true;
    }

    if (this.tempTitle.match('immigration')) {
      viewTopicImmigration();
      return true;
    }

    if (this.tempTitle.match('brick walls')) {
      return ViewTopicBrickWalls.new();
    }

    if (this.tempTitle.match('big families')) {
      viewTopicBigFamilies.new();
      return true;
    }

    if (this.tempTitle == 'gravestone symbols') {
      return ViewTopicGravestones.gravestoneSymbols();
    }

    if (this.tempTitle == 'masonry') {
      return ViewTopicMasonry.new(this.story);
    }

    if (this.tempTitle == 'cause of death') {
      this.viewExcerpts();
      this.viewSources();
      return ViewSpecialTopicCauseOfDeath.new(this.story);
    }
  }

  viewOtherTopic() {
    this.viewExcerpts();
    this.viewSources();
  }
}
