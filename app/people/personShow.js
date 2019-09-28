class ViewPerson extends ViewPage {
  static byUrl() {
    let [mainPath, personId, ...subPath] = PATH.split('/');

    if (mainPath != 'person') {
      return false;
    }

    const person = Person.create(personId);

    if (!person) {
      return ViewPerson.notFound(personId);
    }

    new ViewPerson(person, subPath).render();
  }

  static notFound(personId) {
    setPageTitle('Person Not Found');
    h1('Person not found: ' + personId);
    return;
  }

  constructor(person, subPath) {
    super(person);
    this.person = person;
    this.subPath = subPath;
    this.person.populateFamily();
  }

  render() {
    this.setPageTitle();
    this.viewHeader();

    if (this.subPath.length) {
      let showFullProfile = this.viewSubPath();
      if (!showFullProfile) {
        return;
      }
    }

    this.viewProfileSummary();
    this.viewBiographies();
    this.viewFamily();
    this.viewDescendants();
    this.viewTree();
    this.viewSectionLinks();
    this.viewResearchNotes();
    this.viewArtifacts();
    this.viewTimeline();
    this.viewCitations();

    if (this.runTests) {
      this.runTests(this.person);
    }
  }

  setPageTitle() {
    let pageTitle = removeSpecialCharacters(this.person.name);
    let birth = this.person.birth;
    let death = this.person.death;

    if (birth || death) {
      pageTitle += ' (' +
        ((birth ? birth.date.year : ' ') || ' ') + '-' +
        ((death ? death.date.year : ' ') || ' ') + ')';
    }

    setPageTitle(pageTitle);
  }

  viewHeader() {
    let person = this.person;

    rend(
      '<div class="person-header">' +
        '<img src="' + person.profileImage + '">' +
        '<div class="person-header-content">' +
          '<h1>' +
            fixSpecialCharacters(person.name) +
            (person.star ? '&#160;<img src="images/leaf.png" style="height:40px">' : '') +
          '</h1>' +
          this.formatHeaderEvent('B', person.birth) +
          this.formatHeaderEvent('D', person.death) +
        '</div>' +
      '</div>'
    );

    if (this.person.private) {
      rend('<p class="person-summary">Some information is hidden to ' +
        'protect the privacy of living people.</p>');
    }
  }

  formatHeaderEvent(abbr, event) {
    if (this.person.private || event === undefined) {
      return '';
    }

    return (
      '<div class="person-header-events">' +
        '<div><b>' + abbr + ':</b></div>' +
        '<div>' + formatDate(event.date) + '</div>' +
        (event.location.format ? (
          '<br>' +
          '<div>&#160;</div>' +
          '<div>' + event.location.format + '</div>'
        ) : '') +
      '</div>'
    );
  }

  viewSubPath() {
    if (this.subPath.length == 1 && this.subPath[0] == 'test'
        && ENV == 'dev') {
      this.viewTests();
      return true;
    }

    rend(
      '<p style="margin-left: 10px; margin-top: 10px;">' +
        linkToPerson(this.person, false, '&#10229; back to profile') +
      '</p>'
    );

    if (this.subPath.length != 2) {
      return pageNotFound();
    }

    if (this.subPath[0] == 'source') {
      return viewPersonSource(this.person, this.subPath[1]);
    }

    return pageNotFound();
  }

  viewProfileSummary() {
    DATABASE.notations.filter(notation => {
      return notation.title == 'profile summary'
        && notation.people.includes(this.person);
    }).forEach(notation => {
      notation.text.split('\n').forEach(s => {
        rend('<p style="margin-top: 20px;">' + s + '</p>');
      });
    });
  }

  viewBiographies() {
    const bios = DATABASE.sources.filter(source => {
      return source.people[0] == this.person && source.tags.biography;
    });

    if (bios.length == 0) {
      return;
    }

    h2('Biography');

    bios.forEach((source, i) => {
      rend(
        '<div class="cover-background" ' +
            'style="margin-left: 12px;' + (i > 0 ? 'margin-top:15px' : '') + '">' +
          '<p>' +
            '<b>' + source.story.title + '</b>' +
          '</p>' +
          '<p style="margin-top: 8px">' +
            source.content.slice(0, 500) +
            '... <i>' +
            localLink('person/' + this.person.customId
              + '/source/' + source._id, 'continue reading') +
            '</i>' +
          '</p>' +
        '</div>'
      );
    });
  }

  viewFamily() {
    h2('Family');
    this.person.forEachRelationship((relationship, relatives) => {
      if (relatives.length == 0) {
        return;
      }
      const $box = $('<div class="person-family">');
      $box.append(`<h3>${relationship}:</h3>`);
      $box.append($makePeopleList(relatives, 'photo'));
      rend($box);
    });
  }

  viewDescendants() {
    const addDesc = (person, gen) => {
      descendants[gen] = descendants[gen] || [];
      descendants[gen].push(person);
      person.children.forEach(child => addDesc(child, gen + 1));
    };

    const descendants = [];
    addDesc(this.person, 0);

    if (descendants.length < 3) {
      return;
    }

    h2('Descendants');

    descendants.slice(2).forEach((list, gen) => {
      let relationship = (() => {
        if (gen == 0) {
          return 'grandchildren';
        }
        if (gen == 1) {
          return 'great-grandchildren';
        }
        return gen + '-great-grandchildren';
      })();

      if (list.length == 1) {
        relationship = relationship.replace('ren', '');
      }

      const $box = $('<div class="person-family descendants">');
      $box.append(`<h3>${relationship}:</h3>`);
      $box.append($makePeopleList(list, 'photo'));
      rend($box);
    });
  }

  viewTree() {
    h2('Tree');
    rend('<div class="person-tree">' + personTree(this.person) + '</div>');
  }

  viewResearchNotes() {
    const notations = DATABASE.notations.filter(note => {
      return note.people.includes(this.person) && note.tags['research notes'];
    });

    if (notations.length == 0) {
      return;
    }

    h2('Research Notes');

    notations.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr>');
      }
      rend($notationBlock(notation));
    });
  }

  viewArtifacts() {
    const stories = DATABASE.stories.filter(story => {
      return story.people.includes(this.person) && story.type == 'artifact';
    });

    if (stories.length == 0) {
      return;
    }

    h2('Artifacts');

    stories.forEach((story, i) => {
      artifactBlock(story, {
        firstItem: i == 0,
        largeHeader: false,
        people: story.people.filter(p => p != this.person),
      });
    });
  }

  viewTimeline() {
    PersonTimeline.show(this.person);
  }

  viewCitations() {
    if (this.person.citations.length == 0) {
      return;
    }
    h2('Citations');
    rend($makeCitationList(this.person.citations));
  }
}

function viewPersonSource(person, sourceId) {
  const source = DATABASE.sourceRef[sourceId];

  if (source == null) {
    h2('Source not found: ' + sourceId);
    return;
  }

  h2('Biography');
  rend(formatTranscription(source.content));

  h2('About this source');

  [
    source.story.type + ': ' + linkToStory(source.story),
    source.title,
    source.date.format,
    source.location.format
  ].filter(s => s).forEach(text => {
    rend('<p style="margin: 10px 0 0 10px;">' + text + '</p>');
  });

  if (source.images.length) {
    h2('Images');
    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 200));
    });
  }

  viewSourceSummary(source);
  viewSourceNotes(source);

  if (source.people.length > 1) {
    h2('Other people in this source');
    rend($makePeopleList(source.people.filter(p => p != person), 'photo'));
  }

  viewSourceLinks(source);
}
