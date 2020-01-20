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

  static getStoryClass(story) {
    let matchTitle = story.title.toLowerCase();

    if (matchTitle.match('disease')) {
      return ViewTopicDisease;
    }

    if (matchTitle.match('immigration')) {
      return ViewTopicImmigration;
    }

    if (matchTitle.match('military')) {
      return ViewTopicMilitary;
    }
  }

  static homePageSummary(story) {
    if (!story) {
      return;
    }

    const storyClass = ViewStoryTopic.getStoryClass(story);

    if (storyClass && storyClass.homePageSummary) {
      return storyClass.homePageSummary();
    }
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
      new ViewTopicMilitary(this.story).render();
      return true;
    }

    if (this.tempTitle.match('disease')) {
      new ViewTopicDisease(this.story).render();
      return true;
    }

    if (this.tempTitle.match('immigration')) {
      new ViewTopicImmigration(this.story).render();
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
      return ViewTopicGravestones.gravestoneSymbols(this.story);
    }

    if (this.tempTitle == 'masonry') {
      return ViewTopicMasonry.new(this.story);
    }

    if (this.tempTitle == 'cause of death') {
      this.viewExcerpts();
      this.viewSources();
      return ViewTopicCauseOfDeath.new(this.story);
    }
  }

  viewOtherTopic() {
    this.viewExcerpts();
    this.viewSources();
  }
}
