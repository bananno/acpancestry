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

  makeList(list, options = {}) {
    const $ul = $('<ul style="margin-left: 30px;">');
    rend($ul);

    if (options.type == 'stories') {
      list.forEach(story => {
        const $li = $('<li>').appendTo($ul);
        $li.append(linkToStory(story));
      });
    }

    if (options.type == 'sources') {
      list.forEach(source => {
        const $li = $('<li>').appendTo($ul);
        $li.append(linkToSource(source, options.showStory));
      });
    }
  }
}
