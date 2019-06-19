
function showPersonTimeline(person) {
  if (person.private) {
    return;
  }

  rend(
    '<h2>Timeline</h2>' +
    '<div class="timeline-key">' +
      '<div class="timeline-life">life events</div>' +
      '<div class="timeline-source">sources</div>' +
      '<div class="timeline-family">family events</div>' +
    '</div>'
  );

  new PersonTimeline(person);
}

class PersonTimeline {
  constructor(person, isTest) {
    this.person = person;

    if (isTest) {
      this.list = [];
    } else {
      this.createEventList();
      this.sortList();
      this.renderTimeline();
    }
  }

  createEventList() {
    this.list = [];

    DATABASE.events.forEach(item => {
      if (item.people.indexOf(this.person) >= 0) {
        let newItem = {...item};
        newItem.event = true;
        this.list.push(newItem);
      }
    });

    DATABASE.sources.forEach(item => {
      if (item.people.indexOf(this.person) >= 0) {
        let newItem = {...item};
        newItem.source = true;
        this.list.push(newItem);
      }
    });

    ['parent', 'sibling', 'spouse', 'child'].forEach(relationship => {
      this.person[pluralize(relationship)].forEach(relative => {
        this.addFamilyEventsToList(relative, relationship);
      });
    });
  }

  addFamilyEventsToList(relative, relationship) {
    DATABASE.events.forEach(item => {
      if (this.shouldIncludeFamilyEvent(relative, relationship, item)) {
        let newItem = {...item};
        newItem.relationship = relationship;
        newItem.event = true;
        this.list.push(newItem);
      }
    });
  }

  shouldIncludeFamilyEvent(relative, relationship, item) {
    if (item.people.indexOf(relative) < 0) {
      return false;
    }

    // Avoid duplicate timeline entries. Skip if the event has been added for the main person or
    // for another family member.
    if (this.list.filter(it => it._id == item._id).length) {
      return false;
    }

    const afterPersonsBirth = this.person.birth
      && (isDateBeforeDate(this.person.birth.date, item.date)
        || areDatesEqual(this.person.birth.date, item.date));

    const beforePersonsDeath = this.person.death
      && (isDateBeforeDate(item.date, this.person.death.date)
        || areDatesEqual(item.date, this.person.death.date));

    const duringPersonsLife = afterPersonsBirth && beforePersonsDeath;

    // include parent's death if it happens before person's death.
    if (relationship == 'parent') {
      return item.title == 'death' && beforePersonsDeath;
    }

    // include siblings's birth or death if it happens during person's life.
    if (relationship == 'sibling') {
      return (item.title == 'birth' || item.title == 'death') && duringPersonsLife;
    }

    // always include spouse's birth & death; exclude other spouse events.
    if (relationship == 'spouse') {
      return item.title == 'birth' || item.title == 'death';
    }

    if (relationship == 'child') {
      // always include child's birth.
      if (item.title == 'birth') {
        return true;
      }
      // include child's death if it is during person's life or within 5 years after person's death.
      if (item.title == 'death') {
        return item.date.year && this.person.death && this.person.death.date.year
          && item.date.year - this.person.death.date.year < 5;
      }
      // include other child events if they are during person's life.
      return beforePersonsDeath;
    }

    return false;
  }

  sortList() {
    this.list.trueSort((a, b) => {
      // if there is no date on either item, the cemetery should be rated higher.
      if (!a.date.year && !b.date.year) {
        return a.type == 'grave';
      }
      return isDateBeforeDate(a.date, b.date);
    });
  }

  renderTimeline() {
    this.list.forEach(item => {
      new PersonTimelineItem(item);
    });
  }
}

class PersonTimelineItem {
  constructor(item, isTest) {
    this.item = item;

    if (!isTest) {
      this.renderItem(item);
    }
  }

  renderItem(item) {
    const $div = $('<div class="timeline-item">');
    rend($div);

    $div.addClass(this.getItemClass());

    const $col1 = $('<div class="column column1">').appendTo($div);
    const $col2 = $('<div class="column column2">').appendTo($div);

    this.$col1 = $col1;
    this.$col2 = $col2;

    if (item.date.format) {
      $col1.append('<p><b>' + item.date.format + '</b></p>');
    } else if ($('.timeline-no-date').length == 0 && item.type != 'grave') {
      $div.before('<div class="timeline-no-date">No date:</div>')
    }

    if (item.location.format) {
      $col1.append('<p>' + item.location.format + '</p>');
    }

    if (item.location.notes) {
      $col1.append('<p><i>(' + item.location.notes + ')</i></p>');
    }

    $col2.append('<p><b>' + this.getItemTitle() + '</b></p>');

    if (this.shouldDisplayPeopleAboveText()) {
      this.renderItemPeople();
    }

    if (item.source) {
      if (item.images.length) {
        $col1.append(makeImage(item, 0, 100, 100));
      }

      $col2.append(
        '<p style="margin-top: 5px;">' +
          linkToSource(item, item.group + (item.type == 'grave' ? '' : ' - ' + item.title)) +
        '</p>'
      );
    }

    this.getItemText().forEach(text => {
      $col2.append('<p style="margin-top: 5px;">' + text + '</p>');
    });

    if (this.shouldDisplayPeopleBelowText()) {
      this.renderItemPeople();
    }
  }

  getItemClass() {
    if (this.item.source) {
      return 'timeline-source';
    }
    if (this.item.relationship) {
      return 'timeline-family';
    }
    return 'timeline-life';
  }

  getItemTitle() {
    if (this.item.event) {
      if (this.item.relationship) {
        return this.item.title + ' of ' + this.item.relationship;
      }
      return this.item.title;
    }

    if (this.item.type == 'index') {
      return 'source';
    }
    if (this.item.type == 'grave') {
      return 'cemetery';
    }
    if (this.item.type == 'newspaper') {
      return 'newspaper article';
    }
    return this.item.type;
  }

  shouldDisplayPeopleAboveText() {
    return this.item.event && this.item.relationship;
  }

  shouldDisplayPeopleBelowText() {
    return this.item.source || this.item.personal;
  }

  shouldShowPeople() {
    if (!this.item.relationship && this.item.event && this.item.people.length == 1) {
      return false;
    }
    return true;
  }

  renderItemPeople() {
    if (this.shouldShowPeople()) {
      this.$col2.append($makePeopleList(this.item.people, 'photo').css('margin-left', '-5px'));
    }
  }

  getItemText() {
    if (this.item.event) {
      if (this.item.notes) {
        return this.item.notes.split('\n');
      }
      return [];
    }
    let arr = [];
    if (this.item.sourceGroup && this.item.sourceGroup.summary) {
      arr = this.item.sourceGroup.summary.split('\n');
    }
    if (this.item.summary) {
      arr = [...arr, this.item.summary.split('\n')];
    }
    return arr;
  }
}
