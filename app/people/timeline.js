
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

class PersonTimeline extends Timeline {
  constructor(person, isTest) {
    super(person, isTest);

    if (!isTest) {
      this.createEventList();
      this.sortList();
      this.renderTimeline();
    }
  }

  createEventList() {
    DATABASE.events.forEach(item => {
      if (item.people.indexOf(this.person) >= 0) {
        this.insertItem({
          ...item,
          event: true
        });
      }
    });

    DATABASE.sources.forEach(item => {
      if (item.people.indexOf(this.person) >= 0) {
        this.insertItem({
          ...item,
          source: true
        });
      }
    });

    ['parent', 'sibling', 'spouse', 'child'].forEach(relationship => {
      this.person[pluralize(relationship)].forEach(relative => {
        this.addFamilyEventsToList(relative, relationship);
      });
    });

    if (!this.person.death || !this.person.death.date) {
      this.addEmptyDeathEvent();
    }
  }

  addFamilyEventsToList(relative, relationship) {
    DATABASE.events.forEach(item => {
      if (this.shouldIncludeFamilyEvent(relative, relationship, item)) {
        this.insertItem({
          ...item,
          relationship: relationship,
          event: true
        });
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

    // If death date is not available for this person, all events are considered to be "after"
    // their death.
    const beforePersonsDeath = !this.person.death
      || (isDateBeforeDate(item.date, this.person.death.date)
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
      // include child's death if it is during person's life or within 5 years after person's
      // death, OR if the person's death date is not available.
      if (item.title == 'death') {
        if (!item.date.year) {
          return false;
        }
        if (!this.person.death) {
          return true;
        }
        return this.person.death.date.year && item.date.year - this.person.death.date.year < 5;
      }
      // ignore historical events attached to the child.
      if (item.tags && item.tags.historical) {
        return false;
      }
      // include other child events if they are during person's life.
      return beforePersonsDeath;
    }

    return false;
  }

  addEmptyDeathEvent() {
    if (this.person.death) {
      const item = this.list.filter(item => item._id == this.person.death._id)[0];
      item.mod = 'added-death-date';
      item.date = {
        year: 3000,
        sort: '3000-00-00',
        format: 'date unknown',
      };
      return;
    }

    this.insertItem({
      title: 'death',
      people: [this.person],
      date: {
        year: 3000,
        sort: '3000-00-00',
        format: 'date unknown',
      },
      location: {},
      event: true,
      _id: 'added-death-event',
    });
  }
}

class PersonTimelineItem extends TimelineItem {
  constructor(item, isTest) {
    super(item, true, isTest);
  }
}
