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

    if (specs.render) {
      this.renderTimeline();
    }
  }

  insertItem(item) {
    this.list.push(item);
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
    if (this.isPerson) {
      this.list.forEach(item => {
        new PersonTimelineItem(item);
      });
    } else {
      this.list.forEach(item => {
        new TimelineItem(item);
      });
    }
  }
}

class TimelineItem {
  constructor(item, isPerson, isTest) {
    this.item = item;
    this.isPerson = isPerson === true;
    this.isTest = isTest === true;

    if (!isTest) {
      this.renderItem(item);
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
    if (!this.isPerson) {
      return true;
    }
    if (!this.item.relationship && this.item.event && this.item.people.length == 1) {
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

    const $list = $makePeopleList(this.item.people, 'photo').css('margin-left', '-5px');

    this.$col2.append($list);

    if (this.item.people.length > 5) {
      $list.hide();
      const $show = $('<div class="fake-link" style="margin-top: 5px">')
      let showText = 'show all ' + this.item.people.length + ' tagged people';
      $show.text(showText);
      $list.before($show);
      $show.click(() => {
        if ($list.is(':visible')) {
          $list.slideUp();
          $show.text(showText);
        } else {
          $list.slideDown();
          $show.text('hide list');
        }
      });
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
    if (this.item.story && this.item.story.summary) {
      arr = this.item.story.summary.split('\n');
    }
    if (this.item.summary) {
      arr = [...arr, ...this.item.summary.split('\n')];
    }
    return arr;
  }

  renderItem(item) {
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
          linkToSource(item, item.type == 'grave' ? item.story.title : item.fullTitle) +
        '</p>'
      );
    }

    this.getItemText().forEach(text => {
      $col2.append('<p style="margin-top: 5px;">' + text + '</p>');
    });

    if (!this.shouldDisplayPeopleAboveText()) {
      this.renderItemPeople();
    }
  }
}
