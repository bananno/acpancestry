class Timeline {
  constructor(person, isTest, specs) {
    this.person = person;
    this.isPerson = person != undefined;
    this.isTest = isTest === true;
    this.list = [];

    if (specs) {
      this.buildTimeline(specs);
    }
  }

  buildTimeline(specs) {
    if (specs.sourceFilter) {
      DATABASE.sources.filter(specs.sourceFilter).forEach(source => {
        this.insertItem({ ...source, source: true });
      });
    }

    if (specs.eventFilter) {
      DATABASE.events.filter(specs.eventFilter).forEach(event => {
        this.insertItem({ ...event, event: true });
      });
    }

    if (specs.sort) {
      this.sortList();
    }

    if (specs.sortFunction) {
      this.sortList(specs.sortFunction);
    }

    this.keys = specs.keys;

    if (specs.render) {
      this.renderTimeline();
    }
  }

  insertItem(item) {
    this.list.push(item);
  }

  sortList() {
    this.list.forEach(item => {
      item.sortBy = TimelineItem.getSortValue(item);
    });

    this.list.sortBy(item => item.sortBy);
  }

  renderTimeline() {
    this.showKeys();
    this.list.forEach(item => {
      new TimelineItem(item, this.isTest, this.person);
    });
  }

  showKeys() {
    if (!this.keys) {
      return;
    }
    const $div = $('<div class="timeline-key">');
    for (let key in this.keys) {
      $div.append('<div class="timeline-' + key + '">' + this.keys[key]
        + '</div>');
    }
    rend($div);
  }
}

class TimelineItem {
  static getSortValue(item) {
    if (!item.date && item.story) {
      // Items without dates should be at the bottom of the list and
      // graves should be at the top of that section.
      if (item.story.type == 'cemetery') {
        return '3000-00-00';
      }

      item.date = item.story.date || {};
    }

    return [
      item.date.year || '3000',
      pad0(item.date.month || 12, 2),
      pad0(item.date.day || 32, 2),
    ].join('-');
  }

  constructor(item, isTest, person) {
    this.item = item;
    this.isTest = isTest === true;

    if (person && person !== true) {
      this.person = person;
    }

    this.isPerson = person != undefined || item.relationship || item.personal;

    this.tags = this.item.tags || {};

    if (!this.isTest) {
      this.renderItem();
    }
  }

  getItemClass() {
    if (this.item.source) {
      return 'timeline-source';
    }
    if (this.item.relationship) {
      return 'timeline-family';
    }
    if (this.item.historical) {
      return 'timeline-historical';
    }
    if (this.tags['historical'] || this.tags['special historical']) {
      return 'timeline-historical';
    }
    return 'timeline-life';
  }

  getItemTitle() {
    if (this.item.event) {
      if (this.item.relationship) {
        return this.item.title + ' of ' + this.getEventRelationship();
      }

      if (this.item.title == 'death' && this.person) {
        let age = this.person.ageAtDeath();
        if (age) {
          return 'death (age: ' + age + ')';
        }
        return 'death';
      }

      return this.item.title;
    }

    if (this.item.notation) {
      return this.item.title;
    }

    const storyType = this.item.story.type;

    if (storyType == 'index') {
      return 'source';
    }

    if (storyType == 'newspaper') {
      return 'newspaper article';
    }

    return storyType;
  }

  shouldShowPeople() {
    if (this.tags['historical']) {
      return false;
    }
    if (!this.isPerson) {
      return true;
    }
    if (this.isPerson && this.item.event) {
      if (this.item.historical) {
        return false;
      }
      if (this.item.personal && this.item.people.length == 1) {
        return false;
      }
    }
    if (this.isPerson && this.item.notation && this.item.people.length == 1) {
      return false;
    }
    return true;
  }

  shouldDisplayPeopleAboveText() {
    return this.isPerson && this.item.event && this.item.relationship ? true : false;
  }

  renderItemPeople() {
    if (!this.shouldShowPeople()) {
      return;
    }

    const $list = $makePeopleList(this.item.people, 'photo', {
      css: { 'margin-left': '-5px'},
      collapseIfAtLeast: 6,
      collapseAfterNumber: 0,
      collapseMessage: 'show all TOTALNUM tagged people',
      allowRehide: true,
    });

    this.$col2.append($list);
  }

  getItemText() {
    if (this.item.event) {
      if (this.item.notes) {
        return this.item.notes.split('\n');
      }
      return [];
    }

    if (this.item.notation) {
      return this.item.text.split('\n');
    }

    let arr = [];
    if (this.item.story && this.item.story.summary) {
      arr = this.item.story.summary.split('\n');
    }
    if (this.item.summary) {
      arr = [...arr, ...this.item.summary.split('\n')];
    }
    return arr;
  }

  renderItem() {
    const item = this.item;
    const $div = $('<div class="timeline-item">');
    rend($div);

    $div.addClass(this.getItemClass());

    const $col1 = $('<div class="column column1">').appendTo($div);
    const $col2 = $('<div class="column column2">').appendTo($div);

    this.$col1 = $col1;
    this.$col2 = $col2;

    const dateStr = item.date.format
      || (item.story ? item.story.date.format : '');

    const locationStr = item.location.format
      || (item.story ? item.story.location.format : '');

    const locationNotes = item.location.notes
      || (item.story ? item.story.location.notes : '');

    if (dateStr) {
      $col1.append('<p><b>' + dateStr + '</b></p>');
    } else if ($('.timeline-no-date').length == 0 && item.type != 'grave') {
      $div.before('<div class="timeline-no-date">No date:</div>')
    }

    if (locationStr) {
      $col1.append('<p>' + locationStr + '</p>');
    }

    if (locationNotes) {
      $col1.append('<p><i>(' + locationNotes + ')</i></p>');
    }

    let title = this.getItemTitle();
    $div.attr('item-title', title);
    $col2.append('<p><b>' + title + '</b></p>');

    if (this.shouldDisplayPeopleAboveText()) {
      this.renderItemPeople();
    }

    if (item.source && !item.notation) {
      if (item.images.length) {
        $col1.append(Image.make(item.images[0], 100, 100));
      }

      $col2.append(
        '<p style="margin-top: 5px;">' +
          linkToSource(item, item.type == 'grave' ? item.story.title : item.fullTitle) +
        '</p>'
      );
    }

    if (item.notation) {
      const $quote = $quoteBlock({
        text: this.getItemText(),
        small: true,
        css: {
          'margin-top': '10px'
        },
      });

      $col2.append($quote);

      $col2.append(
        '<p style="margin: 5px 0;">' +
          '- excerpt from ' +
          linkToSource(item.source, true) +
        '</p>'
      );
    } else {
      this.getItemText().forEach(text => {
        $col2.append('<p style="margin-top: 5px;">' + text + '</p>');
      });
    }

    if (!this.shouldDisplayPeopleAboveText()) {
      this.renderItemPeople();
    }
  }

  getEventRelationship() {
    let relationship = this.item.relationship;

    if ((this.item.people || []).length == 0) {
      return relationship;
    }

    if (relationship == 'spouse' && this.item.title == 'birth') {
      return 'future ' + Person.relationshipName(relationship, this.item.people[0]);
    }

    if (!['parent', 'spouse', 'sibling', 'child'].includes(relationship)
        || !this.person || this.item.people.length <= 1) {
      return Person.relationshipName(relationship, this.item.people[0]);
    }

    let allFamilyMembers = [];
    let numCategories = 0;

    ['parents', 'siblings', 'spouses', 'children'].forEach(rel => {
      const theseFamilyMembers = this.item.people.filter(p => {
        return this.person[rel].map(p => p._id).includes(p._id);
      });

      if (theseFamilyMembers.length) {
        numCategories += 1;
        allFamilyMembers = [...allFamilyMembers, ...theseFamilyMembers];
      }
    });

    if (allFamilyMembers.length == 1) {
      return Person.relationshipName(relationship, allFamilyMembers[0]);
    }

    if (numCategories > 1) {
      return 'family members';
    }

    return relationship.pluralize();
  }
}
