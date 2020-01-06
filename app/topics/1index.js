class ViewStoryTopic extends ViewStory {
  static byUrl() {
    const [isTopic, storyId, leftovers] = PATH.split('/');

    if (isTopic != 'topic' || !storyId || leftovers) {
      return false;
    }

    if (storyId == 'military') {
      viewTopicMilitary();
      return true;
    }

    if (storyId == 'immigration') {
      viewTopicImmigration();
      return true;
    }

    if (storyId == 'disease') {
      new ViewTopicDisease().render();
      return true;
    }

    if (storyId == 'big-families') {
      viewTopicBigFamilies.new();
      return true;
    }

    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryTopic(story).render();
    return true;
  }

  constructor(story) {
    super(story);
    this.tempTitle = this.story.title.toLowerCase();
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);

    if (this.tempTitle.match('brick walls')) {
      return ViewTopicBrickWalls.new();
    }

    this.viewExcerpts();
    this.viewSources();
    this.viewSpecialTopic();
  }

  viewSpecialTopic() {
    if (this.tempTitle == 'gravestone symbols') {
      return ViewSpecialTopicGravestones.gravestoneSymbols();
    }
    if (this.tempTitle == 'masonry') {
      return ViewSpecialTopicGravestones.masonGravestones();
    }
    if (this.tempTitle == 'cause of death') {
      return ViewSpecialTopicCauseOfDeath.new(this.story);
    }
  }
}
