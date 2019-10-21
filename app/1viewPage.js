class ViewPage {
  constructor(item) {
    this.item = item;
  }

  viewSectionSummary() {
    if (!this.item.summary) {
      return;
    }
    h2('Summary');
    rend(
      this.item.summary.split('\n').map(text => '<p>' + text + '</p>').join('')
    );
  }

  viewSectionPeople() {
    if (this.item.people.length == 0) {
      return;
    }
    h2('People');
    rend($makePeopleList(this.item.people, 'photo'));
  }

  viewSectionNotes() {
    if (!this.item.notes) {
      return;
    }
    h2('Notes');
    rend(
      '<ul class="bullet"><li>' +
        this.item.notes.split('\n').join('</li><li>') +
      '</li></ul>'
    );
  }

  viewSectionLinks() {
    if (this.item.links.length == 0) {
      return;
    }
    h2('Links');
    rend(this.item.links.map(getFancyLink));
  }

  viewSectionContent() {
    if (!this.item.content) {
      return;
    }
    h2('Transcription');
    rend(formatTranscription(this.item.content));
  }

  viewSectionList(list, options = {}) {
    let $ul;

    if (options.bullet) {
      $ul = $('<ul style="margin-left: 30px;">');
      rend($ul);
    }

    list.forEach((item, i) => {
      let $container;

      if ($ul) {
        $container = $('<li>').appendTo($ul);
      } else {
        $container = $('<div>');
        rend($container);
      }

      if (i > 0) {
        $container.css('margin-top', '15px');
      }

      if (options.divider) {
        $container.append('<hr style="margin: 20px 0;">');
      }

      if (options.type == 'stories') {
        $container.append(linkToStory(item));
      } else if (options.type == 'sources') {
        $container.append(linkToSource(item, options.showStory));
      } else {
        $container.append(item);
      }

      if (options.summary && item.summary) {
        $container.append(
          '<p style="margin-top: 10px;">' + item.summary + '</p>'
        );
      }

      if (options.location && item.location.format) {
        $container.append(
          '<p style="margin-top: 10px;">' + item.location.format + '</p>'
        );
      }

      if (options.date && item.date.format) {
        $container.append(
          '<p style="margin-top: 10px;">' + item.date.format + '</p>'
        );
      }
    });
  }
}
