class ViewTopic extends ViewPage {
  static byUrl() {
    const topic = PATH.replace('topic/', '');

    if (topic == 'military') {
      viewTopicMilitary();
      return true;
    }

    if (topic == 'immigration') {
      viewTopicImmigration();
      return true;
    }

    if (topic == 'disease') {
      new ViewTopicDisease().render();
      return true;
    }

    if (topic == 'brickwalls') {
      viewTopicBrickwalls();
      return true;
    }

    if (topic == 'big-families') {
      viewTopicBigFamilies.new();
      return true;
    }

    return ViewStoryTopic.byId(topic);
  }
}

class ViewStoryTopic extends ViewStory {
  static byId(storyId) {
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryTopic(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);
    this.viewExcerpts();
    this.viewSources();
    this.viewSpecialTopic();
  }

  viewSpecialTopic() {
    let tempTitle = this.story.title.toLowerCase();

    if (tempTitle == 'gravestone symbols') {
      return ViewSpecialTopicGravestones.gravestoneSymbols();
    }
    if (tempTitle == 'masonry') {
      return ViewSpecialTopicGravestones.masonGravestones();
    }
    if (tempTitle == 'cause of death') {
      return ViewSpecialTopicCauseOfDeath.new(this.story);
    }
  }
}
