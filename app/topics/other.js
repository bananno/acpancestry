class ViewTopicOther extends ViewStoryTopic {
  constructor(story) {
    super(story);
  }

  render() {
    super.viewExcerpts();
    super.viewSources();
  }
}
