class ViewPerson extends ViewPage {
  static byUrl() {
    let [mainPath, personId, ...subPath] = PATH.split('/');

    if (mainPath != 'person') {
      return false;
    }

    const person = Person.new(personId);

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
    this.viewPhotos();
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
            fixSpecialCharacters(person.name) + this.headerLeaf() +
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

  headerLeaf() {
    if (!this.person.leaf) {
      return '';
    }
    return '<div class="person-leaf-header leaf-' + this.person.leaf + '"></div>';
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
      return this.person.isInList(notation.people)
        && (notation.title == 'profile summary'
          || notation.tags['profile summary']);
    }).forEach(notation => {
      notation.text.split('\n').forEach(s => {
        rend('<p style="margin-top: 20px;">' + s + '</p>');
      });
    });
  }

  viewPhotos() {
    const images = DATABASE.images.filter(image => {
      return image.tags.profile && this.person.isInList(image.item.people);
    });

    if (images.length == 0) {
      return;
    }

    h2('Photos');

    images.forEach(image => {
      const $link = Image.asLink(image, 200, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
  }

  viewBiographies() {
    const bios = DATABASE.sources.filter(source => {
      return source.tags.biography && source.people.length
        && source.people[0]._id == this.person._id;
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

    if (this.person.tags['show family incomplete']) {
      pg('<i>Note: This person had additional family member(s) that are not ' +
        'in the list because they are not in the database yet.</i>')
      .css('margin', '10px');
    }

    this.person.forEachRelationship((relationship, relatives) => {
      if (relatives.length == 0) {
        if (relationship == 'children'
            && this.person.tags['number of children']) {
          const $box = $('<div class="person-family">');
          $box.append(`<h3>${relationship}:</h3>`);
          $box.append(this.person.tags['number of children'] +
            ' (but none in database)');
          rend($box);
        }
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
      return this.person.isInList(note.people) && note.tags['research notes'];
    });

    if (notations.length == 0) {
      return;
    }

    h2('Research Notes');

    notations.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr>');
      }
      rend($notationBlock(notation, {splitParagraphs: true}));
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
    Citation.renderList(this.person.citations);
  }
}

function viewPersonSource(person, sourceId) {
  const source = DATABASE.sourceRef[sourceId];

  if (source == null) {
    h2('Source not found: ' + sourceId);
    return;
  }

  const viewer = new ViewSource(source);

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
    source.images.forEach(image => rend(Image.make(image, 200)));
  }

  viewer.viewSectionSummary();
  viewer.viewSectionNotes();

  if (source.people.length > 1) {
    h2('Other people in this source');
    const otherPeople = source.people.filter(p => p._id != person._id);
    rend($makePeopleList(otherPeople, 'photo'));
  }

  viewer.viewSectionLinks();
}
