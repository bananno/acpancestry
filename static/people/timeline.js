
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
    this.list.forEach(this.renderItem);
  }

  renderItem(item) {
    const $div = $('<div class="timeline-item">');
    rend($div);

    const $col1 = $('<div class="column column1">').appendTo($div);
    const $col2 = $('<div class="column column2">').appendTo($div);

    let showPeopleList = true;

    if (item.relationship) {
      $div.addClass('timeline-family');
    } else if (item.event) {
      $div.addClass('timeline-life');
      if (item.people.length == 1) {
        showPeopleList = false;
      }
    } else {
      $div.addClass('timeline-source');
    }

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

    if (item.source) {
      if (item.type == 'index') {
        $col2.append('<p><b>source</b></p>');
      } else if (item.type == 'grave') {
        $col2.append('<p><b>cemetery</b></p>');
      } else if (item.type == 'newspaper') {
        $col2.append('<p><b>newspaper article</b></p>');
      } else {
        $col2.append('<p><b>' + item.type + '</b></p>');
      }

      $col2.append(
        '<p style="margin-top: 5px;">' +
          linkToSource(item, item.group + (item.type == 'grave' ? '' : ' - ' + item.title)) +
        '</p>'
      );

      if (item.images.length) {
        $col1.append(makeImage(item, 0, 100, 100));
      }
    } else {
      if (item.relationship) {
        $col2.append('<p><b>' + item.title + ' of ' + item.relationship + '</b></p>');
      } else {
        $col2.append('<p><b>' + item.title + '</b></p>');
      }
    }

    if (showPeopleList) {
      $col2.append($makePeopleList(item.people, 'photo').css('margin-left', '-5px'));
    }

    if (item.source) {
      if (item.summary) {
        $col2.append(
          '<p style="margin-top: 5px;">' +
            item.summary.replace(/\n/g, '</p><p style="margin-top: 5px;">') +
          '</p>'
        );
      }
    } else {
      if (item.notes) {
        $col2.append(
          '<p style="margin-top: 5px;">' +
            item.notes.replace(/\n/g, '</p><p style="margin-top: 5px;">') +
          '</p>'
        );
      }
    }
  }
}
