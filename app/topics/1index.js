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

    const exactNames = {
      'big families': ViewTopicBigFamilies,
      'cause of death': ViewTopicCauseOfDeath,
      'disease': ViewTopicDisease,
      'gravestone symbols': ViewTopicGravestones,
      'immigration': ViewTopicImmigration,
      'military': ViewTopicMilitary,
      'masonry': ViewTopicMasonry,
    };

    if (exactNames[matchTitle]) {
      return exactNames[matchTitle];
    }

    if (matchTitle.match('brick wall')) {
      return ViewTopicBrickWalls;
    }

    return ViewTopicOther;
  }

  static homePageSummary(story) {
    if (!story) {
      return;
    }

    const storyClass = ViewStoryTopic.getStoryClass(story);

    if (storyClass.homePageSummary) {
      return storyClass.homePageSummary();
    }
  }

  constructor(story) {
    super(story);
    this.topicClass = ViewStoryTopic.getStoryClass(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);
    new this.topicClass(this.story).render();
    return true;
  }
}
