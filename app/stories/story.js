class Story {
  static filter(callback) {
    return DATABASE.stories.filter(callback);
  }

  static filterByType(storyType) {
    return DATABASE.stories.filter(story => story.type === storyType);
  }

  static findByTitle(storyName) {
    return DATABASE.stories.find(story => {
      return story.title === 'Census USA ' + year;
    });
  }

  static getNumberOfGravesInCemetery(story) {
    let count = 0;

    story.entries.forEach(source => {
      count += source.people.length || 1;
    });

    return count;
  }
}
