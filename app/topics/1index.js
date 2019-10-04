function viewTopic() {
  const topic = PATH.replace('topic/', '');

  if (topic == 'military') {
    return viewTopicMilitary();
  }

  if (topic == 'immigration') {
    return viewTopicImmigration();
  }

  if (topic == 'disease') {
    return viewTopicDisease();
  }

  if (topic == 'brickwalls') {
    return viewTopicBrickwalls();
  }

  if (topic == 'big-families') {
    return viewTopicBigFamilies.new();
  }

  return pageNotFound();
}
