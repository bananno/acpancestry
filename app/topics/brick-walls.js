class ViewTopicBrickWalls extends ViewStoryTopic {
  static new() {
    const story = DATABASE.stories.find(story => story.title.match('Brick'));
    new ViewTopicBrickWalls(story).render();
    return true;
  }

  constructor(story) {
    super(story);

    this.current = {};
    this.solved = {};

    ['people', 'notations'].forEach(itemType => {
      this.current[itemType] = [];
      this.solved[itemType] = [];

      this.story[itemType].forEach(item => {
        if (item.tags['broken brick wall']) {
          this.solved[itemType].push(item);
        } else {
          this.current[itemType].push(item);
        }
      });
    });
  }

  render() {
    h2('Current questions');
    this.renderSection('current');
    h2('Solved');
    this.renderSection('solved');
  }

  renderSection(section) {
    rend($makePeopleList(this[section].people, 'photo'));

    this[section].notations.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr>');
      } else if (this[section].people.length > 0) {
        rend('<hr style="margin-top: 10px">');
      }
      rend($notationBlock(notation, {
        alwaysShowPeople: true,
        splitParagraphs: false
      }));
    });
  }
}
