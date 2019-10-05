class PersonTimeline extends Timeline {
  static show(person) {
    if (person.private) {
      return;
    }

    rend(
      '<h2>Timeline</h2>' +
      '<div class="timeline-key">' +
        '<div class="timeline-life">life events</div>' +
        '<div class="timeline-source">sources</div>' +
        '<div class="timeline-family">family events</div>' +
        '<div class="timeline-historical">historical events</div>' +
      '</div>'
    );

    new PersonTimeline(person);
  }

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
      if (Person.isInList(item.people, this.person)) {
        let isHistorical = item.tags['special historical'];
        this.insertItem({
          event: true,
          personal: !isHistorical,
          historical: isHistorical,
          ...item
        });
      }
    });

    DATABASE.sources.forEach(item => {
      if (Person.isInList(item.people, this.person)) {
        this.insertItem({
          source: true,
          ...item
        });
      }
    });

    this.person.forEachRelationship((relationship, relatives) => {
      relatives.forEach(relative => {
        this.addFamilyEventsToList(relative, relationship.singularize());
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
    if (!item.people.map(p => p._id).includes(relative._id)
        || item.tags['special historical']) {
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

    // Include parent's marriage or immigration if it happens during person's life.
    // Include parent's death if it's before person's death, and even if it's before person's birth.
    if (relationship == 'parent') {
      if (['immigration', 'marriage'].includes(item.title)) {
        return duringPersonsLife;
      }
      return item.title == 'death' && beforePersonsDeath;
    }

    // Include step-parent's death if it's during person's life.
    if (relationship == 'step-parent') {
      return item.title == 'death' && duringPersonsLife;
    }

    // include siblings's birth or death if it happens during person's life.
    if (relationship.match('sibling')) {
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
