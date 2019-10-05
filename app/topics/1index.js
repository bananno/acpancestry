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
  }
}
