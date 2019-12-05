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


function viewAbout() {
  const about = PATH.replace('about/', '');

  if (about == 'person-profile') {
    return viewAboutPersonProfile();
  }

  return pageNotFound();
}

function viewAboutPersonProfile() {
  setPageTitle('About Person Profile');
  rend(`
    <h1>About Person Profile</h1>
    <p style="margin-top: 20px;">
      Every person in the database has a profile page.
    </p>
    <p style="margin-top: 10px;">
      Below is an explanation of the information you will find on a profile page.
    </p>
    <h2>Biography</h2>
    <p>
    </p>
    <h2>Family</h2>
    <p>
      This section will show a list of the person's immediate family members. Click any family
      member to view their profile.
    </p>
    <h2>Tree</h2>
    <p>
      This section will show a diagram of all of the person's ancestors in the database. Click
      any ancestor member to view their profile.
    </p>
    <div id="example-tree"></div>
    <h2>Links</h2>
    <p>
      This section will include a list of external links to this person's profile on various
      genealogy websites. Some sites require you to log in before viewing the profile.
    </p>
    <h2>Timeline</h2>
    <p>
    </p>
    <h2>Citations</h2>
    <p>
    </p>
  `);

  $('#example-tree').append('insert tree')
}

Array.prototype.sortBy = function(callback) {
  return this.sort((a, b) => {
    return callback(a) < callback(b) ? -1 : 0;
  });
};

Array.prototype.trueSort = function(callback) {
  return this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};

Array.prototype.random = function() {
  let n = Math.round(Math.random() * (this.length - 1));
  return this[n];
}

String.prototype.capitalize = function() {
  return this.slice(0, 1).toUpperCase() + this.slice(1);
};

$(document).ready(() => {
  const stringSingularToPlural = {};
  const stringPluralToSingular = {};

  SINGULAR_PLURAL_STRINGS.forEach(([singular, plural]) => {
    stringSingularToPlural[singular] = plural;
    stringSingularToPlural[singular.capitalize()] = plural.capitalize();
    stringPluralToSingular[plural] = singular;
    stringPluralToSingular[plural.capitalize()] = singular.capitalize();
  });

  String.prototype.singularize = function(number) {
    if (number !== undefined && number !== 1) {
      return this;
    }
    return stringPluralToSingular[this] || this.slice(0, this.length - 1);
  };

  String.prototype.pluralize = function(number) {
    if (number === 1) {
      return this;
    }
    return stringSingularToPlural[this] || this + 's';
  };
});

const CITATION_LIST_ORDER = [
  'name',
  'birth',
  'christening',
  'baptism',
  'father',
  'mother',
  'marriage',
  'marriage - spouse',
  'marriage 1',
  'marriage 1 - spouse',
  'marriage 2',
  'marriage 2 - spouse',
  'spouse',
  'divorce',
  'immigration',
  'naturalization',
  'death',
  'funeral',
  'burial',
  'obituary',
  'residence',
];

class Citation {
  static renderList(citations) {
    rend(Citation.$makeList(citations));
  }

  static $makeList(citations) {
    Citation.sortList(citations);

    const $table = $('<table class="citation-list cover-background">');

    $table.append('<tr><th colspan="2">item</th><th>information</th><th>source</th></tr>');

    let [previousItem1, previousItem2] = [null, null];

    citations.forEach(citation => {
      let [item1, item2] = [citation.item, ''];

      if (item1.match(' - ')) {
        item2 = item1.slice(item1.indexOf(' - ') + 3);
        item1 = item1.slice(0, item1.indexOf(' - '));
      }

      const $row = $('<tr>').appendTo($table);

      $table.append(
        '<tr>' +
          '<td class="repeat-' + (previousItem1 == item1) + '">' +
            item1 +
          '</td>' +
          '<td class="repeat-' + (previousItem1 == item1 && previousItem2 == item2) + '">' +
            item2 +
          '</td>' +
          '<td>' + citation.information + '</td>' +
          '<td>' +
            linkToSource(citation.source, citation.source.fullTitle) +
          '</td>' +
        '</tr>'
      );

      previousItem1 = item1;
      previousItem2 = item2;
    });

    return $table;
  }

  static sortList(citations) {
    citations.forEach(citation => {
      if (citation.sort) {//temp
        return;
      }
      citation.sort = citation.sort || Citation.getSortValue(citation);
      // citation.item = citation.sort;//temp
    });

    citations.sortBy(citation => citation.sort);
  }

  static getSortValue(citation) {
    return (() => {
      let item = citation.item, index;
      index = CITATION_LIST_ORDER.indexOf(item);
      if (index >= 0) {
        return pad0(index, 2) + '-0';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - name', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-1';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - date', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-2';
      }
      index = CITATION_LIST_ORDER.indexOf(item.replace(' - place', ''));
      if (index >= 0) {
        return pad0(index, 2) + '-3';
      }
      index = CITATION_LIST_ORDER.indexOf(item.split(' - ')[0]);
      if (index >= 0) {
        return pad0(index, 2) + '-4';
      }
      return CITATION_LIST_ORDER.length;
    })() + ' - ' + citation.item + ' - ' + citation.information;
  }
}


const SITE_TITLE = 'Lundberg Ancestry';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const USA_STATES = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

const PLACE_PARTS = ['country', 'region1', 'region2', 'city'];

const GENDER = { FEMALE: 1, MALE: 2 };

const SINGULAR_PLURAL_STRINGS = [
  ['cemetery', 'cemeteries'],
  ['child', 'children'],
  ['step-child', 'step-children'],
];

const RIGHT_ARROW = '&#8594;';


function viewEvents() {
  setPageTitle('Events');
  const $table = $('<table class="event-list" border="1">');

  rend('<h1>All Events</h1>');
  rend($table);

  $table.append($headerRow(['title', 'date', 'location', 'people', 'notes']));

  DATABASE.events.forEach(event => {
    const $row = $('<tr>').appendTo($table);

    addTd($row, event.title);
    addTd($row, formatDate(event.date));
    addTd($row, formatLocation(event.location));
    addTd($row, $makePeopleList(event.people));
    addTd($row, event.notes);
  });
}

function eventBlock(event) {
  const $div = $('<div style="margin-bottom:20px">');

  $div.append('<div><b>' + event.title + '</b></div>');
  $div.append('<div>' + event.people.map(person => person.name).join(', ') + '</div>');
  $div.append('<div>' + event.date.format + '</div>');
  $div.append('<div>' + event.location.format + '</div>');

  if (event.notes) {
    $div.append('<div>' + event.notes + '</div>');
  }

  return $div;
}

class ViewHome extends ViewPage {
  static byUrl() {
    new ViewHome().render();
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle();
    h1(SITE_TITLE);

    this.viewFeatured();
    this.viewPhotos();
    this.viewBrowse();
  }

  viewFeatured() {
    h2('featured');
    rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

    DATABASE.stories
    .filter(story => story.tags.featured)
    .sortBy(story => story.type)
    .forEach(story => {
      let path, icon, image;
      if (story.type == 'cemetery') {
        path = story.type + '/' + story._id;
        image = 'images/map-icon.svg';
      } else if (story.type == 'newspaper') {
        path = story.type + '/' + story._id;
        image = 'images/newspaper-icon.jpg';
      } else if (story.type == 'place') {
        return Place.$iconLink(story.location, { text: story.title, render: true });
      } else {
        return;
      }
      rend($makeIconLink(path, story.title, image));
    });

    DATABASE.sources.filter(s => s.tags.featured).forEach(source => {
      rend(
        '<p style="margin: 10px">' +
          linkToSource(source, source.story.title + ' - ' + source.title) +
        '</p>'
      );
    });
  }

  viewPhotos() {
    h2('photos');
    DATABASE.images.filter(image => image.tags.featured).forEach(image => {
      const $link = Image.asLink(image, 100, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
    pg(localLink('photos', 'see more photos ' + RIGHT_ARROW))
      .css('margin', '10px');
  }

  viewBrowse() {
    h2('browse');

    this.viewBrowseSection({
      first: true,
      path: 'landmarks',
      title: 'landmarks and buildings',
      text: 'All the houses, businesses, farms, and other landmarks of any ' +
        'significance to the Family Tree.'
    });

    this.viewBrowseSection({
      path: 'artifacts',
      title: 'artifacts and family heirlooms'
    });

    this.viewBrowseSection({
      path: 'topic/brickwalls',
      title: 'brick walls and mysteries'
    });

    this.viewBrowseSection({
      path: 'topic/military',
      title: 'military'
    });

    this.viewBrowseSection({
      path: 'topic/immigration',
      title: 'immigration',
      text: 'People in the Family Tree immigrated to the United States from ' +
        DATABASE.countryList.length + ' different countries. ' +
        'See a list of immigrants by county and a timeline of events.'
    });

    (() => {
      const people = DATABASE.people.filter(person => {
        return person.tags['died of disease'];
      });
      const diseases = [];
      people.forEach(person => {
        if (person.tags.disease && !diseases.includes(person.tags.disease)) {
          diseases.push(person.tags.disease);
        }
      });
      this.viewBrowseSection({
        path: 'topic/disease',
        title: 'disease',
        text: 'At least ' + people.length + ' people in the Family Tree ' +
          ' have died of ' + diseases.length + ' different diseases. See a ' +
          'list of people, historical events, and newspaper articles.'
      });
    })();

    this.viewBrowseSection({
      path: 'topic/big-families',
      title: 'big families'
    });

    DATABASE.stories.filter(story => story.type == 'topic').forEach(story => {
      this.viewBrowseSection({
        path: 'topic/' + story._id,
        title: story.title.toLowerCase()
      });
    });

    this.viewBrowseSection({
      path: 'year/1904',
      title: 'browse by year',
      text: 'See what everyone in the Family Tree was up to during any given year.'
    });
  }

  viewBrowseSection(options) {
    if (!options.first) {
      rend('<hr style="margin-top: 20px;">');
    }

    pg(localLink(options.path, options.title))
      .css('margin-top', '20px').css('font-size', '18px');

    if (options.text) {
      pg(options.text).css('margin-top', '5px');
    }
  }
}

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


function viewYear() {
  const year = parseInt(PATH.replace('year/', '') || 0);

  if (isNaN(year)) {
    return pageNotFound();
  }

  const bornThisYear = DATABASE.people.filter(person => {
    return person.birth && person.birth.date && person.birth.date.year === year;
  });

  const diedThisYear = DATABASE.people.filter(person => {
    return person.death && person.death.date && person.death.date.year === year;
  });

  const aliveThisYear = DATABASE.people.filter(person => {
    return person.birth && person.birth.date && person.birth.date.year < year
      && person.death && person.death.date && person.death.date.year > year;
  });

  const events = DATABASE.events.filter(event => {
    return event.date && event.date.year == year
      && event.title != 'birth' && event.title != 'death';
  });

  bornThisYear.trueSort((a, b) => a.birthSort < b.birthSort);
  aliveThisYear.trueSort((a, b) => a.birthSort < b.birthSort);
  events.trueSort((a, b) => a.date.sort < b.date.sort);

  setPageTitle(year);
  h1(year);

  rend(
    '<p>' +
      localLink('year/' + (year - 1), '&#10229;' + (year - 1)) +
      ' &#160; &#160; &#160; ' +
      localLink('year/' + (year + 1), (year + 1) + '&#10230;') +
    '</p>'
  );

  let $list;

  h2('Events');
  events.forEach(event => {
    rend(eventBlock(event).css('margin-left', '10px'));
  });

  h2('Born this year');
  $list = $makePeopleList(bornThisYear, 'photo');
  rend($list);

  h2('Died this year');
  $list = $makePeopleList(diedThisYear, 'photo');
  rend($list);

  h2('Lived during this year');
  $list = $makePeopleList(aliveThisYear, 'photo');
  rend($list);
  aliveThisYear.forEach(person => {
    const age = year - person.birth.date.year;
    $list.find('[data-person="' + person._id + '"]').append(' (age: ' + age + ')');
  });
}

$(document).ready(() => {
  setupLayout();
  setPageTitle();
  processDatabase();
  runTests();

  $(document).on('click', '.local-link', clickLocalLink);

  getRoute();
});

function runTests() {} // overwritten in dev version


function setupLayout() {
  $(document).on('click', '#menu-icon', openSideMenu);
  $(document).on('click', '#main-navigation .close-me', closeSideMenu);
  $(document).on('click', '#main-navigation .local-link', closeSideMenu);
  $(document).on('click', '#menu-backdrop', closeSideMenu);
  createHeaderLinks();
  addFooterQuote();
}

function openSideMenu() {
  $('#main-navigation, #menu-backdrop').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation, #menu-backdrop').removeClass('open');
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '" class="local-link">'
    + SITE_TITLE + '</a>');

  const $list = $('#main-navigation ul');

  $list.append('<li><a href="' + ORIGIN + '" class="local-link">Home</a></li>');

  ['People', 'Events', 'Sources', 'Places'].forEach(nav => {
    $list.append('<li>' + localLink(nav.toLowerCase(), nav) + '</li>');
  });

  if (ENV == 'dev') {
    ['Test', 'Audit'].forEach(nav => {
      $list.append('<li>' + localLink(nav.toLowerCase(), nav.slice(0, 1))
        + '</li>');
    });
  }
}

function addFooterQuote() {
  const quotes = DATABASE.notations.filter(n => n.tags['featured quote']);
  $('#page-footer').append(quotes.random().text);
}

const ORIGIN = window.location.origin;
const ENV = !!ORIGIN.match('localhost') ? 'dev' : '';
const USE_SINGLE_PAGE = true;

let PATH;
window.onpopstate = getRoute;

function clickLocalLink(event) {
  if (!USE_SINGLE_PAGE || event.metaKey) {
    return;
  }

  event.preventDefault();

  const clickedPath = $(event.target).closest('a').attr('href');

  history.pushState({}, null, clickedPath);

  getRoute();

  window.scrollTo(0, 0);
}

function getRoute() {
  PATH = getCurrentPath();
  clearPage();
  loadContent();
}

function getCurrentPath() {
  let path = window.location.pathname + window.location.search;

  if (path.match('\\?')) {
    path = path.slice(path.indexOf('\?') + 1);
  }

  if (path.charAt(0) == '/') {
    path = path.slice(1);
  }

  return path;
}


function loadContent() {
  if (PATH == '') {
    return ViewHome.byUrl();
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH.match('person/')) {
    return ViewPerson.byUrl();
  }

  if (PATH == 'events') {
    return viewEvents();
  }

  if (PATH.length > 5 && PATH.slice(0, 6) == 'source') {
    return routeSources();
  }

  if (PATH.match('search')) {
    return SearchResults.byUrl();
  }

  if (PATH.match('place')) {
    return ViewPlace.byUrl() || pageNotFound();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  if (PATH.match('audit') && ENV == 'dev') {
    return ViewAudit.byUrl() || pageNotFound();
  }

  if (PATH.match('image/')) {
    return ViewImage.byUrl() || pageNotFound();
  }

  if (PATH.match('topic/')) {
    return ViewTopic.byUrl() || pageNotFound();
  }

  if (PATH.match('year/')) {
    return viewYear();
  }

  if (PATH.match('about/')) {
    return viewAbout();
  }

  if (PATH.match('artifact') || PATH.match('landmark')) {
    return ViewStoryIndex.byUrl() || ViewStoryArtifactOrLandmark.byUrl()
      || pageNotFound();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return ViewStoryIndex.byUrl() || ViewCemeteryOrNewspaper.byUrl()
      || pageNotFound();
  }

  if (PATH.match('book')) {
    return ViewStoryIndex.byUrl() || ViewStoryBook.byUrl()
      || pageNotFound();
  }

  if (PATH.match('event')) {
    return ViewStoryEvent.byUrl() || pageNotFound();
  }

  if (PATH.match('photo')) {
    return ViewPhotos.byUrl() || pageNotFound();
  }

  return pageNotFound();
}

function viewTests() {
  setPageTitle('Tests');
  rend('<h1>Tests</h1>');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  rend('<h1>Page Not Found</h1>');
}

function localLink(target, text, newTab) {
  if (target.slice(0, 1) == '/') {
    target = target.slice(1);
  }
  if (newTab) {
    return '<a href="' + ORIGIN + '/' + target + '" target="_blank">'
      + text + '</a>';
  }
  return '<a href="' + ORIGIN + '/' + target + '" class="local-link">'
    + text + '</a>';
}

function linkToPerson(person, includeLeaf, text, keywords) {
  text = text || fixSpecialCharacters(person.name);
  if (keywords) {
    text = highlightKeywords(text, keywords);
  }
  if (includeLeaf && person.leaf) {
    text += '&#160;<span class="person-leaf-link leaf-' + person.leaf + '"></span>';
  }
  return localLink('person/' + person.customId, text);
}

function linkToStory(story, text) {
  let path = story.type;
  text = text || story.title;
  return localLink(path + '/' + story._id, text);
}

function linkToSource(source, text) {
  if (text === true) {
    text = source.story.title + ' - ' + source.title;
  } else {
    text = text || source.title;
  }
  return localLink('source/' + source._id, text);
}

function $makeIconLink(path, text, image) {
  return $('<div class="icon-link">')
    .append(localLink(path, '<img src="' + image + '">'))
    .append(localLink(path, text));
}

function getFancyLink(link) {
  let linkUrl = link;
  let linkText = link;
  let imageName = 'external-link.png';

  if (linkUrl.match(' ')) {
    linkUrl = linkUrl.slice(0, linkUrl.indexOf(' '));
    linkText = linkText.slice(linkText.indexOf(' ') + 1);

    if (linkText == 'Ancestry') {
      imageName = 'logo-ancestry.png';
      linkText = '';
    } else if (linkText == 'BillionGraves') {
      imageName = 'logo-billiongraves.svg';
      linkText = '';
    } else if (linkText == 'FamilySearch') {
      imageName = 'logo-familysearch.png';
      linkText = '';
    } else if (linkText == 'FindAGrave') {
      imageName = 'logo-findagrave.png';
      linkText = '';
    } else if (linkText == 'WikiTree') {
      imageName = 'logo-wikitree.png';
      linkText = '';
    }
  }

  return (
    '<div class="fancy-link">' +
      '<a href="' + linkUrl  + '" target="_blank">' +
        '<img src="/images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
  );
}

function setPageTitle(title) {
  if (title && ('' + title).length) {
    document.title = title + ' | ' + SITE_TITLE;
  } else {
    document.title = SITE_TITLE;
  }
}

function rend(content) {
  $('#page-content').append(content);
}

function clearPage() {
  $('#page-content').html('');
}

function h1(content) {
  rend($('<h1>').append(content));
}

function h2(content) {
  rend($('<h2>').append(content));
}

function pg(content) {
  const $p = $('<p>').append(content);
  rend($p);
  return $p;
}

function bulletList(array, skipRender) {
  const $list = $('<ul class="bullet">');
  array.forEach(content => $list.append($('<li>').append(content)));
  if (!skipRender) {
    rend($list);
  }
  return $list;
}

function formatDate(date) {
  if (date == null) {
    return '';
  }

  let dateString = '';

  if (date) {
    if (date.month && date.month > 0 && date.month <= 12) {
      dateString += MONTH_NAMES[date.month - 1];
    }

    if (date.day) {
      if (dateString.length > 0) {
        dateString += ' ';
      }
      dateString += date.day;
    }

    if (date.year) {
      if (dateString.length > 0) {
        dateString += ', ';
      }
      dateString += date.year;
    }

    if (date.display) {
      dateString = date.display;
    }
  }

  return dateString;
}

function formatLocation(locat) {
  if (locat == null) {
    return '';
  }

  const locationComponents = [];
  const isUSA = locat.country === 'United States';

  if (locat.city) {
    locationComponents.push(locat.city);
  }

  if (locat.region2) {
    locationComponents.push(locat.region2);
  }

  if (isUSA) {
    if (locat.region1) {
      locationComponents.push(USA_STATES[locat.region1] || locat.region1);
    }
    locationComponents.push('USA');
  } else {
    if (locat.region1) {
      locationComponents.push(locat.region1);
    }
    if (locat.country) {
      locationComponents.push(locat.country);
    }
  }

  return locationComponents.join(', ');
}

function removeSpecialCharacters(str) {
  return str.replace('å', 'a')
    .replace('ö', 'o')
    .replace('“', '"')
    .replace('”', '"');
}

function fixSpecialCharacters(str) {
  return str.replace('å', '&aring;')
    .replace(/ö/g, '&ouml;')
    .replace('“', '"')
    .replace('”', '"')
    .replace('’', '\'');
}

function addTd($row, content) {
  $row.append($('<td>').append(content));
}

function $headerRow(array) {
  return '<tr><th>' + array.join('</th><th>') +
    '</th></tr>';
}

function headerTrail(...args) {
  rend(
    '<p class="header-trail">' +
      args.map(linkInfo => {
        let [path, text] = [].concat(linkInfo);
        if (path === false) {
          return text;
        }
        return localLink(path, text || path);
      }).join(' ' + RIGHT_ARROW + ' ') +
    '</p>'
  );
}

function formatTranscription(content) {
  const $mainDiv = $('<div>');

  content = (content || '').split('\n');

  let wasTable = false;
  let $div = $('<div class="transcription">').appendTo($mainDiv);

  content.forEach(str => {
    if (str.slice(0, 7).toLowerCase() == '[below:') {
      str = str.slice(7).trim();
      str = str.replace(']', ':');
      $mainDiv.append('<p style="padding: 5px;">' + str + '</p>');
      wasTable = false;
      if ($div.html() == '') {
        $div.remove();
      }
      $div = $('<div class="transcription">').appendTo($mainDiv);
      return;
    }

    if (str.slice(0, 1) == '|') {
      if (!wasTable) {
        $div.append('<table>');
        wasTable = true;
      }

      str = str.replace(/\|\|/g, '<th>');
      str = str.replace(/\|/g, '<td>');
      str = fixSpecialCharacters(str);

      $div.find('table:last').append('<tr>' + str + '</tr>');
      return;
    }

    wasTable = false;
    $div.append('<p>' + str + '</p>');
  });

  return $mainDiv;
}

function areDatesEqual(date1, date2) {
  if (date1 == null || date2 == null) {
    return date1 == null && date2 == null;
  }
  return date1.year == date2.year && date1.month == date2.month && date1.day == date2.day;
}

function isDateBeforeDate(date1, date2) {
  if (date1.date) {
    date1 = date1.date;
  }

  if (date2.date) {
    date2 = date2.date;
  }

  const dateParts1 = [date1.year, date1.month, date1.day];
  const dateParts2 = [date2.year, date2.month, date2.day];

  for (let i = 0; i < 3; i++) {
    if (dateParts2[i] == null || dateParts2[i] == 0) {
      return true;
    }

    if (dateParts1[i] == null || dateParts1[i] == 0) {
      return false;
    }

    if (dateParts1[i] != dateParts2[i]) {
      return dateParts1[i] < dateParts2[i];
    }
  }

  return false;
}

function pluralize(word, number) {
  if (number === 1) {
    return word;
  }
  return {
    cemetery: 'cemeteries',
    Cemetery: 'Cemeteries',
    child: 'children',
    Child: 'Children',
  }[word] || word + 's';
}

function removeDuplicatesById(list) {
  const foundId = {};

  return list.filter(obj => {
    if (foundId[obj._id]) {
      return false;
    }
    foundId[obj._id] = true;
    return true;
  });
}

function $notationBlock(notation, options = {}) {
  const $div = $('<div class="notation-block">');
  $div.append('<p style="margin-bottom: 10px"><b>' + notation.title + '</b></p>');
  if (options.splitParagraphs) {
    notation.text.split('\n').forEach(text => {
      $div.append('<p style="margin: 8px 0;">' + text + '</p>');
    });
  } else {
    $div.append('<p>' + notation.text + '</p>');
  }
  if (notation.people.length > 1 || options.alwaysShowPeople) {
    $div.append($makePeopleList(notation.people, 'photo'));
  }
  return $div;
}

function $quoteBlock(options) {
  const $quote = $('<div class="quote-block with-single">' +
    '<div class="left"></div>' +
    '<div class="main"></div>' +
    '</div>');

  if (options.rightQuote) {
    $quote.removeClass('with-single');
    $quote.addClass('with-double');
    $quote.append('<div class="right">');
  }

  if (options.coverBackground) {
    $quote.addClass('cover-background');
  }

  const $main = $quote.find('.main');

  $main.append($('<p class="quotation">').append(options.text));
  $main.append($('<p class="credit">').append(options.credit));

  if (options.css) {
    $quote.css(options.css);
  }

  return $quote;
}

function pad0(number, length) {
  number = '' + number;
  while (number.length < length) {
    number = '0' + number;
  }
  return number;
}

function $makePeopleList(people, format, options = {}) {
  if (format == 'photo') {
    return $makePeopleListPhoto(people, format, options);
  }

  const $list = $('<ul class="people-list">');

  if (options.css) {
    $list.css(options.css);
  }

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.attr('data-person', person._id);
    $item.append(linkToPerson(person, true, null, options.highlightKeywords));
  });

  return $list;
}

function $makePeopleListPhoto(people, format, options) {
  const $list = $('<div class="people-list">');

  if (options.css) {
    $list.css(options.css);
  }

  let $visiblePart, $toggleListLink, $hiddenPart, numVisiblePeople;

  $visiblePart = $('<div>').appendTo($list);

  if (options.collapseIfAtLeast !== undefined
      && people.length >= options.collapseIfAtLeast) {
    $toggleListLink = $('<div>').appendTo($list);
    $hiddenPart = $('<div>').appendTo($list);
    $hiddenPart.hide();
    numVisiblePeople = options.collapseAfterNumber || 0;

    const showText = options.collapseMessage
      .replace('HIDDENNUM', people.length - numVisiblePeople)
      .replace('TOTALNUM', people.length);

    $toggleListLink.addClass('fake-link').css('margin-top', '5px').text(showText);

    $toggleListLink.click(() => {
      if ($hiddenPart.is(':visible')) {
        $hiddenPart.slideUp();
        $toggleListLink.text(showText);
      } else {
        $hiddenPart.slideDown();
        if (options.allowRehide) {
          $toggleListLink.text('hide list');
        } else {
          $toggleListLink.remove();
        }
      }
    });
  } else {
    numVisiblePeople = people.length;
  }

  people.forEach((person, index) => {
    const $item = $('<div class="icon-link">');
    $item.attr('data-person', person._id);

    if (options.highlightKeywords) {
      $item.addClass('search-result-item');
    }

    $item.append(linkToPerson(person, false, '<img src="' + person.profileImage + '">'));
    $item.append(linkToPerson(person, true, null, options.highlightKeywords));

    if (index >= numVisiblePeople) {
      $hiddenPart.append($item);
    } else {
      $visiblePart.append($item);
    }
  });

  return $list;
}

class Image {
  static find(image) {
    if (image._id) {
      return image;
    }
    return DATABASE.imageRef[image];
  }

  static make(image, maxHeight, maxWidth) {
    image = Image.find(image);

    const linkAddress = 'image/' + image._id;

    const $imageViewer = $(
      '<div class="image-viewer">' +
        localLink(linkAddress, '<img src="' + image.url + '">click to enlarge', true) +
      '</div>'
    );

    if (maxHeight) {
      $imageViewer.find('img').css('max-height', maxHeight + 'px');
    }

    if (maxWidth) {
      $imageViewer.find('img').css('max-width', maxWidth + 'px');
    } else {
      $imageViewer.find('img').css('max-width', '100%');
    }

    return $imageViewer;
  }

  static asLink(image, maxHeight, maxWidth) {
    image = Image.find(image);

    const linkAddress = 'image/' + image._id;

    const img = '<img src="' + image.url + '">';

    const $link = $(image.story ? linkToStory(image.item, img)
      : linkToSource(image.item, img));

    if (maxHeight) {
      $link.find('img').css('max-height', maxHeight + 'px');
    }

    if (maxWidth) {
      $link.find('img').css('max-width', maxWidth + 'px');
    } else {
      $link.find('img').css('max-width', '100%');
    }

    return $link;
  }
}

class ViewImage extends ViewPage {
  static byUrl() {
    const imageId = PATH.replace('image/', '');
    const image = Image.find(imageId);

    if (!image) {
      return false;
    }

    setPageTitle('Image');

    $('body').html('');

    $('body').css({
      'background': 'none',
      'background-color': 'black',
      'margin': '10px',
    });

    const $image = $('<img>')
      .prop('src', image.url)
      .addClass('full-screen-image pre-zoom')
      .appendTo('body')
      .click(() => {
        if ($image.hasClass('pre-zoom')) {
          $image.removeClass('pre-zoom');
        } else {
          $image.addClass('pre-zoom');
        }
      });

    return true;
  }
}

class ViewPhotos extends ViewPage {
  static byUrl() {
    if (PATH == 'photos') {
      new ViewPhotos().render();
      return true;
    }
    return false;
  }

  constructor() {
    super();
    this.makeList();
  }

  makeList() {
    this.list = DATABASE.images.filter(image => image.tags.gallery);
  }

  render() {
    setPageTitle('Photos');
    h1('Photos');
    this.list.forEach(image => {
      const $link = Image.asLink(image, 200, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
  }
}

function viewPeople() {
  setPageTitle('People');
  h1('All People');
  const peopleList = [...DATABASE.people];
  Person.sortListByAncestorDegree(peopleList);
  rend($makePeopleList(peopleList, 'photo'));
}

class Person {
  static find(person) {
    if (person.name) {
      return person;
    }
    if (!person) {
      return null;
    }

    let strippedID = person.toLowerCase().split('-').join('');
    return DATABASE.personRef[strippedID];
  }

  static new(person, isTest) {
    if (!person) {
      return null;
    }
    if (person.constructor == Person) {
      return new Person(person.person, isTest);
    }
    if (person.name) {
      return new Person(person, isTest);
    }
    person = Person.find(person);
    if (person) {
      return new Person(person, isTest);
    }
  }

  static create(person, isTest) { // phase out
    return Person.new(person, isTest);
  }

  static filter(callback) {
    return DATABASE.people.filter(callback);
  }

  static populateList(arr) {
    arr.forEach(person => {
      person = Person.find(person);
    });
  }

  static relationshipName(relationship, gender) {
    // can pass either gender or entire person object:
    gender = (gender || {}).gender || gender;

    const relationships = {
      'parent': ['mother', 'father'],
      'step-parent': ['step-mother', 'step-father'],
      'sibling': ['sister', 'brother'],
      'half-sibling': ['half-sister', 'half-brother'],
      'step-sibling': ['step-sister', 'step-brother'],
      'spouse': ['wife', 'husband'],
      'child': ['daughter', 'son'],
      'step-child': ['step-daughter', 'step-son'],
    };

    if (relationships[relationship]) {
      return relationships[relationship][gender - 1] || relationship;
    }

    return relationship;
  }

  static sortListByAncestorDegree(peopleList) {
    peopleList.sortBy(person => {
      if (!person.leaf) {
        return '2';
      }
      if (person.degree < 10) {
        return '1-0' + person.degree;
      }
      return '1-' + person.degree;
    });
  }

  static isInList(list, person) {
    person = person._id || person;
    return list.map(p => p._id || p).includes(person);
  }

  static age(startDate, endDate) {
    if (!startDate || !endDate) {
      return null;
    }
    startDate = startDate.date || startDate;
    endDate = endDate.date || endDate;
    let age = { year: 0, month: 0, day: 0 };

    age.year = endDate.year - startDate.year;
    age.month = endDate.month - startDate.month;
    age.day = endDate.day - startDate.day;

    if (age.day < 0) {
      age.day += 31;
      age.month -= 1;
    }

    if (age.month < 0) {
      age.month += 12;
      age.year -= 1;
    }

    if (age.year > 1) {
      age.day = 0;
      if (age.year > 5) {
        age.month = 0;
      }
    }

    return ['year', 'month', 'day'].map(part => {
      if (age[part]) {
        return age[part] + ' ' + part.pluralize(age[part]);
      }
    }).filter(p => p).join(', ');
  }

  constructor(person, isTest) {
    this.person = person;
    this.isTest = isTest;
    for (let key in person) {
      this[key] = person[key];
    }
  }

  forEachRelationship(callback) {
    ['parents', 'step-parents', 'siblings', 'step-siblings', 'half-siblings',
    'spouses', 'children', 'step-children'].forEach(rel => {
      callback(rel, this[rel]);
    });
  }

  getFamily(relationship) {
    let people = this[relationship];

    if (people == null || people.length == 0) {
      return [];
    }

    if (people[0].name === undefined) {
      people = people.map(Person.find);
    }

    if (relationship == 'siblings' || relationship == 'children') {
      people.sortBy(person => person.birthSort);
    }

    return people;
  }

  ageAtDeath() {
    return this.tags['age at death'] || this.ageAt(this.death);
  }

  ageAt(date) {
    if (this.birth && this.death) {
      return Person.age(this.birth.date, this.death.date);
    }
  }

  numberOfChildren() {
    if (this.tags['all children listed'] || this.tags['no children']) {
      if (this.tags['children not shared']) {
        return null;
      }
      return this.children.length;
    }

    if (this.tags['number of children']) {
      return parseInt(this.tags['number of children']);
    }

    return null;
  }

  isInList(list) {
    return Person.isInList(list, this);
  }

  get mother() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.FEMALE)[0]);
  }

  get father() {
    return Person.new(this.parents.filter(person => person.gender == GENDER.MALE)[0]);
  }
}

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

Person.prototype.populateFamily = function() {
  this.forEachRelationship(rel => {
    this[rel] = this[rel] || [];
  });

  const relativeMap = {};

  relativeMap[this._id] = 'root';

  Person.populateList(this.parents);
  Person.populateList(this.spouses);
  Person.populateList(this.children);

  this.parents.forEach(parent => {
    Person.populateList(parent.spouses);
    Person.populateList(parent.children);
    relativeMap[parent._id] = 'parent';
  });

  this.parents.forEach(parent => {
    parent.spouses.forEach(spouse => {
      if (!relativeMap[spouse._id]) {
        if (spouse.death && this.birth
            && isDateBeforeDate(spouse.death.date, this.birth.date)) {
          relativeMap[spouse._id] = 'not-step-parent';
        } else {
          this['step-parents'].push(spouse);
          relativeMap[spouse._id] = 'step-parent';
        }
      }
    });
    parent.children.forEach(sibling => {
      if (relativeMap[sibling._id]) {
        return;
      }

      const fullSiblingsOnly = this.tags['full siblings only']
        || sibling.tags['full siblings only'];

      if (fullSiblingsOnly || (
          this.parents.length == 2 && sibling.parents.length == 2
          && this.parents[0] == sibling.parents[0]
          && this.parents[1] == sibling.parents[1])) {
        this['siblings'].push(sibling);
        relativeMap[sibling._id] = 'sibling';
      } else {
        this['half-siblings'].push(sibling);
        relativeMap[sibling._id] = 'half-sibling';
      }
    });
  });

  this['step-parents'].forEach(parent => {
    Person.populateList(parent.children);
    parent.children.forEach(child => {
      if (!relativeMap[child._id]) {
        this['step-siblings'].push(child);
        relativeMap[child._id] = 'step-sibling';
      }
    });
  });

  this.children.forEach(child => {
    relativeMap[child._id] = 'child';
  });

  this.spouses.forEach(spouse => {
    relativeMap[spouse._id] = 'spouse';
    Person.populateList(spouse.children);
    spouse.children.forEach(child => {
      if (!relativeMap[child._id]) {
        if (this.death && child.birth
            && isDateBeforeDate(this.death.date, child.birth.date)) {
          relativeMap[child._id] = 'not-step-child';
        } else {
          this['step-children'].push(child);
          relativeMap[child._id] = 'step-child';
        }
      }
    });
  });

  [
    'siblings',
    'half-siblings',
    'step-siblings',
    'children',
    'step-children'
  ].forEach(relationship => {
    this[relationship].sortBy(relative => {
      return relative.birth ? relative.birth.date.sort : '3000';
    });
  });
};

(() => {
  ViewPerson.prototype.viewTests = function() {
    h2('Tests');
    rend('<div id="person-test-section"></div>');

    this.runTests = getTests(this.person.customId);

    if (!this.runTests) {
      pg('There are no tests for this person.');
    }
  };

  function getTests(personId) {
    if (personId == 'anthony-hroch') {
      return personTestsAnthonyHroch;
    }
    if (personId == 'hans-johansen') {
      return personTestsHansHansen;
    }
    if (personId == 'peter-winblad') {
      return personTestsPeterWinblad;
    }
    if (personId == 'william-winblad') {
      return personTestsWilliamWinblad;
    }
  }

  function printTest(pass, subtitle) {
    $('#person-test-section').append('<ul><li class="unit-tests test-passing-'
      + pass + '">' + subtitle + '</li></ul>');
  }

  function setTitle2(str) {
    $('#person-test-section').append('<b>' + str + '</b>').css('margin', '5px');
  }

  function assertTrue(text, value) {
    printTest(value === true, text);
  }

  function personTestsAnthonyHroch(person) {
    setTitle2('family relationships');

    assertTrue('has 1 step-parent, William Nemechek',
      person['step-parents'].length == 1
        && person['step-parents'][0].customId == 'william-nemechek'
    );

    assertTrue('has 3 step-siblings',
      person['step-siblings'].length == 3
    );

    assertTrue('has at least 1 half-sibling, Clarence Nemechek',
      person['half-siblings'].length >= 1
        && person['half-siblings'].map(p => p.customId).includes('clarence-nemechek')
    );

    setTitle2('timeline');

    assertTrue('timeline includes "marriage of mother"',
      $('.timeline-item.timeline-family[item-title="marriage of mother"]').length == 1
    );

    assertTrue('timeline includes "death of mother"',
      $('.timeline-item.timeline-family[item-title="death of mother"]').length == 1
    );

    assertTrue('(ADD LATER) timeline does not include "birth of step-brother" '
        + 'because Benny was born before the families merged',
      $('.timeline-item.timeline-family[item-title="birth of step-brother"]').length == 0
    );

    assertTrue('timeline includes "birth of half-brother"',
      $('.timeline-item.timeline-family[item-title="birth of half-brother"]').length == 1
    );

    assertTrue('timeline includes "death of step-brother"',
      $('.timeline-item.timeline-family[item-title="death of step-brother"]').length == 1
    );
  }

  function personTestsHansHansen(person) {
    setTitle2('timeline');

    assertTrue('timeline includes "marriage of parents"',
      $('.timeline-item.timeline-family[item-title="marriage of parents"]').length == 1
    );
  }

  function personTestsPeterWinblad(person) {
    setTitle2('timeline');

    assertTrue('timeline includes "immigration of family members" for spouse and children',
      $('.timeline-item.timeline-family[item-title="immigration of family members"]').length == 1
    );

    assertTrue('timeline includes "birth of children" for twins',
      $('.timeline-item.timeline-family[item-title="birth of children"]').length == 1
    );
  }

  function personTestsWilliamWinblad(person) {
    setTitle2('timeline');

    assertTrue('timeline includes "immigration of father"',
      $('.timeline-item.timeline-family[item-title="immigration of father"]').length == 1
    );

    assertTrue('timeline includes "birth of siblings" for twin brother & sister',
      $('.timeline-item.timeline-family[item-title="birth of siblings"]').length == 1
    );

    assertTrue('timeline includes "birth of daughter" despite being after his death',
      $('.timeline-item.timeline-family[item-title="birth of daughter"]').length == 1
    );
  }
})();

class PersonTimeline extends Timeline {
  static show(person) {
    if (person.private) {
      return;
    }

    new PersonTimeline(person);
  }

  constructor(person, isTest) {
    super(person, isTest, {
      keys: {
        'life': 'life events',
        'source': 'sources',
        'family': 'family events',
        'historical': 'historical events',
      },
    });

    if (!isTest) {
      this.createEventList();
      this.sortList();

      h2('Timeline');
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

    DATABASE.sources
    .filter(item => this.shouldIncludeSource(item))
    .forEach(item => {
      this.insertItem({
        source: true,
        ...item
      });
    });

    DATABASE.notations.filter(item => {
      return (item.title == 'excerpt' || item.tags.excerpt)
        && Person.isInList(item.people, this.person)
        && item.tags['person timeline'];
    }).forEach(item => {
      this.insertItem({
        notation: true,
        ...item
      });
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

  shouldIncludeSource(source) {
    return Person.isInList(source.people, this.person)
      && !source.tags['hide from person timeline']
      && !source.story.tags['hide from person timeline'];
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
      // ignore events that are specified to be hidden from parent's timeline.
      if (item.tags && (item.tags.historical
          || item.tags['hide from parent timeline'])) {
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

function personTree(person, safety, parent) {
  let treeStyle = '';

  if (safety == undefined) {
    safety = 0;
  } else {
    treeStyle = ' style="min-width: 100%;"';
  }

  if (safety > 20) {
    console.log('Tree safety exceeded');
    return '[error]';
  }

  if (person == null) {
    return '<div class="treecell unknown">unknown ' + parent + '</div>';
  }

  return (
    '<table' + treeStyle + '>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.father, safety + 1, 'father') +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.mother, safety + 1, 'mother') +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td colspan="2">' +
          '<div class="treecell">' +
            linkToPerson(person, true) +
          '</div>' +
        '</td>' +
      '</tr>' +
    '</table>'
  );
}


function viewPlaces() {
  const placePath = getURLPathPlaces();

  let [placeList, items] = getItemsByPlace(placePath);

  placeList = editPlaceNames(placePath, placeList);

  showPageTitleAndHeader(placePath);

  if (items.length == 0) {
    rend('<p style="margin-top: 10px;">There is no information available for this place.</p>');
  } else if (placePath.length == 4) {
    viewPlacesItemList(items, true);
  } else if (placePath.length && placePath[placePath.length - 1].path == 'all') {
    viewPlacesItemList(items, false);
  } else {
    viewPlacesIndex(placePath, placeList);
  }
}

function getURLPathPlaces() {
  if (PATH == 'places') {
    return [];
  }

  let places = PATH.replace('places/', '').split('/').map(place => {
    let placeFix = place.replace(/\%20/g, ' ').replace(/\+/g, ' ');
    return {
      path: place,
      true: placeFix,
      text: placeFix,
    };
  });

  if (places.length == 0) {
    return [];
  }

  if (places[0].text == 'United States' || places[0].text == 'USA') {
    places[0].path = 'USA';
    places[0].text = 'United States';
    places[0].true = 'United States';

    if (places.length > 1) {
      if (USA_STATES[places[1].text]) {
        places[1].text = USA_STATES[places[1].text];
      }
    }
  }

  return places;
}

function showPageTitleAndHeader(placePath) {
  if (placePath.length == 0) {
    setPageTitle('Places');
    rend('<h1>Places</h1>');
    return;
  }

  let mostSpecificPlace = placePath[placePath.length - 1].text;
  let showAll = false;

  if (mostSpecificPlace == 'all') {
    mostSpecificPlace = placePath[placePath.length - 2].text;
    showAll = true;
  }

  setPageTitle(mostSpecificPlace);

  let tempPath = 'places';
  let links = [localLink('places', 'Places')];

  for (let i = 0; i < placePath.length - 1; i++) {
    tempPath += '/' + placePath[i].path;
    links.push(localLink(tempPath, placePath[i].text));
  }

  rend('<p class="header-trail">' + links.join(' &#8594; ') + '</p>');

  rend('<h1>' + mostSpecificPlace + (showAll ? ' - all' : '') + '</h1>');
}


function viewPlacesItemList(itemList, hideLocation) {

  // view list of stories/sources in given location - REPAIR LATER
  return;

  [['Cemeteries', 'grave', 'grave'],
  ['Newspapers', 'newspaper', 'article']].forEach(([sectionTitle, sourceType, entryName]) => {
    const groupList = createListOfNewspapersOrCemeteries(sourceType, itemList)[1];
    let needHeader = true;

    for (let groupName in groupList) {
      if (needHeader) {
        rend('<h2>' + sectionTitle + '</h2>');
        needHeader = false;
      }

      const rootSource = groupList[groupName][0];
      const numItems = groupList[groupName].length;

      rend(sourceListitemCemeteryOrNewspaper(rootSource, entryName, numItems, hideLocation));
    }
  });

  const otherItems = itemList.filter(item => item.type != 'grave' && item.type != 'newspaper');

  if (otherItems.length) {
    rend('<h2>Other</h2>');
  }

  otherItems.forEach(item => {
    if (item.group) {
      viewPlacesItemSource(item);
    } else {
      viewPlacesItemEvent(item);
    }
  });
}

function viewPlacesItemSource(source) {
  rend(
    '<p style="margin-top: 10px;">' +
    linkToSource(source, source.type + ' - ' + source.group + ' - ' + source.title) +
    '</p>'
  );
}

function viewPlacesItemEvent(event) {
  rend(
    '<p style="margin-top: 10px;">' +
      event.title + ' - ' +
      event.people.map(person => linkToPerson(person)).join(', ') +
    '</p>'
  );
}


const placeLevels = ['country', 'region1', 'region2', 'city'];

function getItemsByPlace(placePath) {
  const placeList = [];
  const foundPlaceAlready = [];
  const mostSpecificLevel = placeLevels[placePath.length];

  const listOfItemsOnly = mostSpecificLevel == 'city'
    || (placePath.length && placePath[placePath.length - 1].path == 'all');

  const items = [...DATABASE.events, ...DATABASE.sources].filter((item, t) => {
    if (!placeMatch(item.location, placePath)) {
      return false;
    }

    if (listOfItemsOnly) {
      return true;
    }

    const itemPlace = item.location[mostSpecificLevel] || 'other';

    if (!foundPlaceAlready[itemPlace]) {
      placeList.push({
        path: itemPlace,
        text: itemPlace,
      });
      foundPlaceAlready[itemPlace] = true;
    }

    return true;
  });

  return [placeList, items];
}

function placeMatch(itemLocation, placePath) {
  for (let i = 0; i < placePath.length; i++) {
    let levelName = placeLevels[i];
    let itemPlace = itemLocation[levelName];
    let placeName = placePath[i].true;

    if (placeName == 'other') {
      if (itemPlace == null || itemPlace == '') {
        continue;
      }
    }

    if (placeName == 'all') {
      return true;
    }

    if (itemPlace == placeName) {
      continue;
    }

    return false;
  }

  return true;
}

function editPlaceNames(placePath, placeList) {
  let otherText = 'other';

  if (placePath.length == 0) {
    otherText = 'location not specified';
    placeList = placeList.map(place => {
      if (place.path == 'United States') {
        place.path = 'USA';
      }
      return place;
    });
  } else if (placePath.length == 1 && placePath[0].path == 'USA') {
    otherText = 'state not specified';
    placeList = placeList.map(place => {
      place.text = USA_STATES[place.text] || 'other';
      return place;
    });
  } else if (placePath.length == 2 && placePath[0].path == 'USA') {
    otherText = 'county not specified';
  }

  placeList.sort((a, b) => {
    let [str1, str2] = [b.text.toLowerCase(), a.text.toLowerCase()];
    const swap = (str1 > str2 || str1 == 'other') && str2 != 'other';
    return swap ? -1 : 1;
  });

  if (placeList.length && placeList[placeList.length - 1].text == 'other') {
    placeList[placeList.length - 1].text = otherText;
  }

  return placeList;
}

class Place {
  static getLinkPath(place) {
    let parts = ['places'];

    if (place.country == 'United States') {
      parts.push('USA');
    } else {
      parts.push(place.country);
    }

    parts = [...parts, place.region1, place.region2, place.city];

    return parts.filter(s => s).join('/');
  }

  static $iconLink(place, options = {}) {
    let path = Place.getLinkPath(place);

    let text = options.text || 'place...';

    const $icon = $makeIconLink(path, text, 'images/map-icon.svg');

    if (options.render) {
      rend($icon);
    }

    return $icon;
  }
}


function viewPlacesIndex(placePath, placeList) {
  let path = ['places', ...(placePath.map(place => place.path))].join('/') + '/';

  if (placeListShouldAllowViewAll(placePath)) {
    rend(
      '<p style="padding-top: 5px;">' +
        localLink(path + 'all', 'view all') +
      '</p>'
    );
  }

  placeList.forEach(place => {
    rend(
      '<p style="padding-top: 5px;">' +
        localLink(path + place.path, place.text) +
      '</p>'
    );
  });
}

function placeListShouldAllowViewAll(placePath) {
  if (placePath.length == 0) {
    return false;
  }
  if (placePath.length == 1 && placePath[0].path == 'USA') {
    return false;
  }
  return true;
}

class ViewPlace extends ViewPage {
  static byUrl() {
    let [base, country, region1, region2, city, extra] = PATH.split('/');

    if (base != 'places' || extra) {
      return false;
    }

    if (country == 'USA') {
      country = 'United States';
      if (region2) {
        region2 = region2.replace('%20', ' ');
      }
    }

    const place = { country, region1, region2, city };
    const story = ViewPlace.findStory(place);

    new ViewPlace(place, story).render();

    return true;
  }

  static findStory(place) {
    return DATABASE.stories.filter(story => {
      return story.type == 'place' && story.location
        && !['country', 'region1', 'region2', 'city'].some(part => {
          return story.location[part] != place[part];
        });
    })[0];
  }

  static new(place, story) {
    return new ViewPlace(place, story);
  }

  constructor(place = {}, story) {
    super(story);
    this.story = story;
    this.place = place;
    for (let key in place) {
      this[key] = place[key];
    }
    this.placePath = [this.country, this.region1, this.region2,
      this.city].filter(s => s);

    this.stories = DATABASE.stories.filter(story => {
      return !['country', 'region1', 'region2', 'city'].some(part => {
        return this[part] != story.location[part];
      });
    });
  }

  render() {
    setPageTitle('Places');
    this.headerTrail();
    this.viewTitle();
    this.viewStories('Landmarks', 'landmark');
    this.viewStories('Cemeteries', 'cemetery');
    this.viewStories('Newspapers', 'newspaper');
  }

  headerTrail() {
    let tempPath = 'places';
    let links = [['places', 'Places']];

    this.placePath.forEach(part => {
      tempPath += '/' + part;
      links.push([tempPath, part]);
    });

    headerTrail(...links.slice(0, links.length - 1));
  }

  viewTitle() {
    if (this.story) {
      h1(this.story.title);
    } else {
      h1(this.placePath.reverse().join(', '));
    }
  }

  viewStories(name, type) {
    const stories = this.stories.filter(story => story.type == type);

    if (stories.length == 0) {
      return;
    }

    h2(name);

    stories.forEach(story => {
      pg(linkToStory(story));
    });
  }
}

class SearchResults extends ViewPage {
  static byUrl() {
    setPageTitle('Search Results');

    const keywords = PATH.slice(7).toLowerCase().split('+')
      .filter(word => word.length > 0);

    $('#search-form [name="search"]').val(keywords.join(' '));

    if (keywords.length === 0) {
      return h1('Search Results');
    }

    h1('Search Results for "' + keywords.join(' ') + '"');
    pg().css('padding-top', '10px').attr('id', 'number-of-search-results');

    new SearchResultsTopics(keywords);
    new SearchResultsPeople(keywords);
    new SearchResultsPlaces(keywords);
    new SearchResultsLandmarks(keywords);
    new SearchResultsArtifacts(keywords);
    new SearchResultsDocuments(keywords);
    new SearchResultsCemeteries(keywords);
    new SearchResultsNewspapers(keywords);
    new SearchResultsBooks(keywords);
    new SearchResultsOtherSources(keywords);
    new SearchResultsEvents(keywords);

    const totalResults = $('.search-result-item').length;

    $('#number-of-search-results').append(totalResults
      + ' result'.pluralize(totalResults));
  }

  constructor(keywords, isTest) {
    super();
    this.keywords = keywords;
    this.isTest = isTest;
    this.resultsList = [];
  }

  execute() {
    this.getResults();

    if (this.resultsList.length == 0) {
      return;
    }

    this.sortResults();

    if (!this.isTest) {
      this.renderResults();
    }
  }

  isMatch(text) {
    return doesStrMatchKeywords(text, this.keywords);
  }

  add(obj) {
    this.resultsList.push(obj);
  }

  highlight(text) {
    return highlightKeywords(text, this.keywords);
  }

  title(text) {
    rend('<h2>' + text + '</h2>');
  }
}

class SearchResultsPeople extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.people.filter(person => {
      return this.isMatch(person.name);
    });
  }

  sortResults() {
    Person.sortListByAncestorDegree(this.resultsList);
  }

  renderResults() {
    this.title('People');
    rend($makePeopleList(this.resultsList, 'photo', {
      highlightKeywords: this.keywords,
      collapseIfAtLeast: 12,
      collapseAfterNumber: 10,
      collapseAll: false,
      collapseMessage: 'show HIDDENNUM more people',
      allowRehide: false,
    }));
  }
}

class SearchResultsTopics extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories.filter(story => {
      return story.type == 'topic' && this.isMatch(story.title);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Topics');
    this.resultsList.forEach(story => {
      pg(linkToStory(story, this.highlight(story.title))).css('margin', '10px');
    });
  }
}


class SearchResultsArtifacts extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories
    .filter(story => story.type == 'artifact').filter(story => {
      let searchStr = story.title;
      return this.isMatch(searchStr);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Artifacts');
    this.resultsList.forEach((story, i) => {
      artifactBlock(story, {
        firstItem: i == 0,
        largeHeader: false,
        people: [],
        highlightKeywords: this.keywords
      });
    });
  }
}

class SearchResultsLandmarks extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.stories
    .filter(story => story.type == 'landmark').filter(story => {
      let searchStr = story.title;
      return this.isMatch(searchStr);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Landmarks');
    this.resultsList.forEach(story => {
      rend('<p style="margin: 15px 0 0 15px;" class="search-result-item">'
        + linkToStory(story, this.highlight(story.title)) + '</p>');

      if (story.location.format) {
        rend('<p style="margin: 2px 0 0 15px;" class="search-result-item">'
          + story.location.format + '</p>');
      }
    });
  }
}


class SearchResultsBooks extends SearchResults {
  static newTest(...keywords) {
    return new SearchResultsBooks(keywords, true);
  }

  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.type = 'book';
    this.execute();
  }

  getResults() {
    DATABASE.stories
    .filter(story => story.type == this.type)
    .forEach(story => {
      const searchStringStory = ['title', 'notes', 'summary', 'content']
        .map(attr => story[attr] || '').join(',');

      let matchStory = this.isMatch(searchStringStory);
      let addedStory = matchStory;

      const matchingEntries = [];

      if (matchStory) {
        this.add({ isStory: true, matchingEntries, ...story });
      }

      story.entries.forEach(source => {
        const searchStringSource = ['title', 'notes', 'summary', 'content']
          .map(attr => source[attr] || '').join(',');

        const sourceMatch = this.isMatch(searchStringSource);
        const matchTotal = !matchStory
          && this.isMatch(searchStringSource + ',' + searchStringStory);

        if (sourceMatch || matchTotal) {
          if (!addedStory) {
            addedStory = true;
            this.add({ isStory: true, matchingEntries, ...story });
          }
          matchingEntries.push(source);
        }
      });
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title(this.type.pluralize().capitalize());

    this.resultsList.forEach((story, i) => {
      if (i > 0) {
        rend('<hr style="margin-top: 15px;">');
      }

      rend('<div style="display: none;" class="search-result-item">');

      pg(linkToStory(story, this.highlight(story.title)))
        .css('margin', '15px 0 0 5px');

      pg(this.highlight(this.summary)).css('margin', '5px');

      story.matchingEntries.forEach((source, j) => {
        if (j == 0) {
          pg('<i>Matching chapters/entries:</i>')
            .css('margin', '5px').css('color', 'gray');
        }

        rend(
          '<ul style="margin-left: 30px;">' +
            '<li style="margin: 5px;">' +
              linkToSource(source, this.highlight(source.title)) +
            '</li>' +
          '</ul>'
        );
      });
    });
  }
}

class SearchResultsCemeteriesOrNewspapers extends SearchResults {
  constructor(keywords, isTest, options) {
    super(keywords, isTest);

    this.storyType = options.storyType;
    this.sectionStoryTitle = options.sectionStoryTitle;
    this.sectionSourceTitle = options.sectionSourceTitle;
    this.entryName = options.entryName;

    this.resultsListStories = [];
    this.resultsListSources = [];

    this.getResults();
    this.renderGroupResults();
    this.renderIndividualResults();
  }

  getResults() {
    DATABASE.stories.forEach(story => {
      if (story.type != this.storyType) {
        return;
      }

      if (this.isMatch(story.title)) {
        this.resultsListStories.push(story);
      }

      story.entries.forEach(source => {
        let searchString = story.title + source.title + source.content;

        if (this.isMatch(searchString)) {
          this.resultsListSources.push(source);
        }
      });
    });
  }

  renderGroupResults() {
    if (this.resultsListStories.length == 0) {
      return;
    }

    this.title(this.sectionStoryTitle);

    this.resultsListStories.forEach(story => {
      let linkText = this.highlight(story.title);
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToStory(story, linkText) + '<br>' +
          story.location.format + '<br>' +
          story.entries.length + ' ' +
          this.entryName.pluralize(story.entries.length) +
        '</p>'
      );
    });
  }

  renderIndividualResults() {
    if (this.resultsListSources.length == 0 ) {
      return;
    }

    this.title(this.sectionSourceTitle);

    this.resultsListSources.forEach((source, i) => {
      pg(linkToSource(source, this.highlight(source.title)))
        .css('padding', '2px 10px')
        .css('padding-top', (i == 0 ? '5px' : '15px'))
        .addClass('search-result-item');

      pg(source.story.title).css('padding', '2px 10px');

      ['date', 'location'].forEach(attr => {
        if (source[attr].format) {
          pg(source[attr].format).css('padding', '2px 10px');
        } else if (source.story[attr].format) {
          pg(source.story[attr].format).css('padding', '2px 10px');
        }
      });

      if (source.content) {
        rend(formatTranscription(this.highlight(source.content)));
      }
    });
  }
}

class SearchResultsCemeteries extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, {
      storyType: 'newspaper',
      sectionStoryTitle: 'Newspapers',
      sectionSourceTitle: 'Newspaper Articles',
      entryName: 'article'
    });
  }
}

class SearchResultsNewspapers extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, {
      storyType: 'cemetery',
      sectionStoryTitle: 'Cemeteries',
      sectionSourceTitle: 'Graves',
      entryName: 'grave'
    });
  }
}

class SearchResultsDocuments extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      return source.type == 'document' && this.isMatch(source.title + source.content);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Documents');
    this.resultsList.forEach(source => {
      let linkText = source.story.title + ' - ' + source.title;
      linkText = this.highlight(linkText, this.keywords);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}


class SearchResultsEvents extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsListStories = DATABASE.stories
    .filter(story => story.type == 'event')
    .filter(story => {
      const searchItems = [story.title, story.summary];
      return this.isMatch(searchItems.join(' '));
    });

    this.resultsListRegular = DATABASE.events.filter(event => {
      const searchItems = [event.title, event.location.format, event.notes];
      return this.isMatch(searchItems.join(' '));
    });

    this.resultsList = [...this.resultsListStories, ...this.resultsListRegular];
  }

  sortResults() {
  }

  renderResults() {
    this.title('Events');
    this.showStoryEvents();
    this.showRegularEvents();
  }

  showStoryEvents() {
    this.resultsListStories.forEach(story => {
      pg(linkToStory(story));
    });
  }

  showRegularEvents() {
    this.resultsListRegular.forEach(event => {
      const lines = [];
      let line1 = this.highlight(event.title);

      const people = event.people.map(person => person.name);

      if (['birth', 'death', 'birth and death', 'marriage'].indexOf(event.title) >= 0) {
        line1 += ' - ' + people.join(' & ');
      } else {
        lines.push(people.join(', '));
      }

      lines.push(this.highlight(event.location.format));
      lines.push(this.highlight(event.date.format));
      lines.push(this.highlight(event.notes));

      rend(
        '<p class="search-result-item" style="padding-top: 10px">' + line1 + '</p>' +
        lines.map(str => {
          if (str == null || str == '') {
            return '';
          }
          return (
            '<p style="padding-top: 2px">' + str + '</p>'
          );
        }).join('')
      );
    });
  }
}


function doesStrMatchKeywords(str, keywords) {
  str = str.toLowerCase();

  for (let i = 0; i < keywords.length; i++) {
    if (str.match(keywords[i]) == null) {
      return false;
    }
  }

  return true;
}

function highlightKeywords(str, keywords, i) {
  if (str == null || str.length == 0) {
    return str;
  }

  if (i == null) {
    keywords = keywords.sort((a, b) => {
      return b.length - a.length;
    });
    i = 0;
  }

  if (i >= keywords.length) {
    return str;
  }

  let p1 = str.toLowerCase().indexOf(keywords[i]);

  if (p1 == -1) {
    return highlightKeywords(str, keywords, i + 1);
  }

  let p2 = p1 + keywords[i].length;

  return highlightKeywords(str.slice(0, p1), keywords, i + 1) +
    '<span class="highlight-search-result">' + str.slice(p1, p2) + '</span>' +
    highlightKeywords(str.slice(p2), keywords, i);

  return str;
}

class SearchResultsOtherSources extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      let searchString = ['title', 'content', 'notes', 'summary']
        .map(attr => source[attr] || '').join(',');
      return !['document', 'newspaper', 'book', 'cemetery']
        .includes(source.story.type) && this.isMatch(searchString);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Other Sources');
    this.resultsList.forEach(source => {
      let linkText = source.story.title + ' - ' + source.title;
      linkText = this.highlight(linkText);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}

class SearchResultsPlaces extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    // clean this up please

    const placeMarker = {};
    this.resultsList = [...DATABASE.sources, ...DATABASE.events].map(item => {
      if (!item.location) {
        return null;
      }

      const placeNameLinkArr = [];
      const placeNameDisplayArr = [];

      for (let r = 0; r < 4; r++) {
        let part = PLACE_PARTS[r];

        if (!item.location[part]) {
          continue;
        }

        let nextPartTextLink = item.location[part];
        let nextPartTextDisplay = nextPartTextLink;

        if (item.location.country == 'United States') {
          if (part == 'country') {
            nextPartTextLink = 'USA';
            nextPartTextDisplay = 'USA';
          } else if (part == 'region1') {
            nextPartTextDisplay = USA_STATES[nextPartTextDisplay];
          }
        }

        placeNameLinkArr.push(nextPartTextLink);
        placeNameDisplayArr.push(nextPartTextDisplay);

        let searchablePlaceName = placeNameDisplayArr.join(' ');

        if (placeMarker[searchablePlaceName]) {
          return null;
        }

        if (this.isMatch(searchablePlaceName)) {
          placeMarker[searchablePlaceName] = true;
          return [placeNameLinkArr, placeNameDisplayArr];
        }
      }

      return null;
    }).filter(p => p);
  }

  sortResults() {
  }

  renderResults() {
    this.title('Places');
    this.resultsList.forEach(([placePath, placeText]) => {
      const path = 'places/' + placePath.join('/');
      const text = this.highlight(placeText.reverse().join(', '));
      // rend('<p>' + localLink(path, text) + '</p>');
      rend($makeIconLink(path, text, 'images/map-icon.svg'))
    });
  }
}

function artifactBlock(story, specs) {
  const $box = $('<div>');

  if (specs.largeHeader) {
    $box.append('<h2>' + story.title + '</h2>');
  } else {
    $box.css('margin-left', '15px');
    const text = specs.highlightKeywords
      ? highlightKeywords(story.title, specs.highlightKeywords) : null;
    $box.append('<p>' + linkToStory(story, text) + '</p>');
    if (!specs.firstItem) {
      $box.css('margin-top', '20px');
    }
  }

  if (story.summary) {
    const summary = specs.highlightKeywords
      ? highlightKeywords(story.summary, specs.highlightKeywords) : story.summary;

    if (specs.largeHeader) {
      $box.append('<p style="margin-left: 10px">' + summary + '</p>');
    } else {
      $box.append('<p style="margin-top: 5px">' + summary + '</p>');
    }
  }

  $box.append($makePeopleList(specs.people || story.people, 'photo'));

  if (story.type == 'book') {
    $box.append(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  }

  rend($box);
}


const sourceCategories = [
  {
    path: 'all',
    title: 'All Sources',
    pathText: 'View All',
    route: viewSourcesAll,
  },
  {
    path: 'photos',
    title: 'Photographs',
    route: viewListOfPhotographs,
  },
  {
    fullPath: 'newspapers',
    title: 'Newspapers',
  },
  {
    fullPath: 'cemeteries',
    title: 'Cemeteries',
  },
  {
    fullPath: 'books',
    title: 'Books',
  },
  {
    path: 'censusUSA',
    title: 'US Federal Census',
    route: viewSourcesCensusUSA,
  },
  {
    path: 'censusState',
    title: 'US State Census',
    route: viewSourcesCensusState,
  },
  {
    path: 'censusOther',
    title: 'Other Census',
    route: viewSourcesCensusOther,
  },
  {
    path: 'draft',
    title: 'Military Draft Registration',
    route: viewSourcesDraft,
  },
  {
    path: 'indexOnly',
    title: 'Index-only Records',
    route: viewSourcesIndexOnly,
  },
  {
    path: 'other',
    title: 'Other Sources',
    route: viewSourcesOther,
  },
];

function routeSources() {
  if (PATH == 'sources') {
    return viewSourcesIndex();
  }

  if (PATH.match('source/')) {
    return ViewSource.byUrl();
  }

  const categoryPath = PATH.slice(8);

  const category = sourceCategories.filter(category => {
    return category.path === categoryPath;
  })[0];

  if (category === undefined) {
    return pageNotFound();
  }

  setPageTitle(category.title);
  headerTrail('sources');
  rend('<h1>' + category.title + '</h1>');

  if (category.route) {
    return category.route();
  }
}

function viewSourcesIndex() {
  setPageTitle('Sources');
  rend('<h1>Sources</h1>');

  pg('A "source" can be a document, photograph, artifact, landmark, ' +
    'website, or anything else that adds to the picture of a family tree.')
  .css('margin', '10px 0 15px 0');

  sourceCategories.forEach(category => {
    const path = category.fullPath || ('sources/' + category.path);
    const text = category.pathText || category.title;
    rend(
      '<p style="margin-top: 8px; font-size: 18px;">' +
        localLink(path, text) +
      '</p>'
    );
  });
}

function viewSourcesAll() {
  const $table = $('<table class="event-list" border="1">');

  rend($table);

  $table.append($headerRow(['type', 'group', 'title', 'date', 'location', 'people']));

  DATABASE.sources.forEach(source => {
    const $row = $('<tr>').appendTo($table);

    addTd($row, source.story.type);
    addTd($row, linkToStory(source.story));
    addTd($row, linkToSource(source, source.title));
    addTd($row, formatDate(source.date));
    addTd($row, formatLocation(source.location));
    addTd($row, $makePeopleList(source.people));
  });
}

function viewListOfPhotographs() {
  const photos = DATABASE.sources.filter(source => source.type == 'photo');

  photos.forEach(source => {
    rend('<h2>' + source.title + '</h2>');
    source.images.forEach(image => {
      rend(Image.make(image, 200).css('margin-right', '5px'));
    });

    if (source.content) {
      rend(formatTranscription(source.content));
    }

    rend($makePeopleList(source.people, 'photo'));

    if (source.summary) {
      source.summary.split('\n').forEach(text => {
        rend('<p>' + text + '</p>');
      });
    }

    if (source.notes) {
      source.notes.split('\n').forEach(text => {
        rend('<p>' + text + '</p>');
      });
    }

    rend(source.links.map(getFancyLink));
  });
}

function viewSourcesCensusUSA() {
  for (let year = 1790; year <= 1950; year += 10) {
    const story = DATABASE.stories.filter(story => {
      return story.title == 'Census USA ' + year;
    })[0];

    if (!story) {
      continue;
    }

    h2(year);

    if (year == 1890) {
      rend(
        '<p style="padding-left: 10px;">' +
          'Most of the 1890 census was destroyed in a 1921 fire.' +
        '</p>'
      );
    }

    showSourceList(story.entries, true, false, false);
  }
}

function viewSourcesCensusState() {
  const stories = DATABASE.stories.filter(isStoryStateCensus);

  stories.sortBy(story => story.title);

  let previousHeader;

  stories.forEach(story => {
    const headerName = USA_STATES[story.location.region1];

    if (previousHeader != headerName) {
      h2(headerName);
      previousHeader = headerName;
    }

    showSourceList(story.entries, true, true, true);
  });
}

function isStoryStateCensus(story) {
  return story.tags['Census US States'];
}

function viewSourcesCensusOther() {
  const storyList = DATABASE.stories.filter(story => {
    return story.title.match('Census')
      && !story.title.match('USA')
      && !isStoryStateCensus(story);
  });

  storyList.sortBy(story => story.title);

  showSourceCategoryList({
    showStoryTitles: true,
    showStoryInLink: false,
    stories: storyList
  });
}

function viewSourcesDraft() {
  ['World War I draft', 'World War II draft'].forEach(title => {
    showSourceCategoryList({
      title: title,
      stories: DATABASE.stories.filter(story => story.title == title),
      showStoryInLink: false
    });
  });
}

function viewSourcesIndexOnly() {
  const storiesIndex = DATABASE.stories.filter(story => story.type == 'index');

  storiesIndex.sortBy(story => story.title);

  rend(
    '<p style="padding: 10px 0;">' +
      'These sources come from online databases. Some of these records are transcribed from ' +
      'original documents and images which are not directly available online. Others are from ' +
      'web-only databases.' +
    '</p>'
  );

  showSourceCategoryList({
    title: 'Birth Index',
    stories: storiesIndex.filter(story => story.title.match('Birth Index'))
  });

  showSourceCategoryList({
    title: 'Death Index',
    stories: storiesIndex.filter(story => story.title.match('Death Index'))
  });

  showSourceCategoryList({
    title: 'Other',
    stories: storiesIndex.filter(story => {
      return !story.title.match('Birth Index')
        && !story.title.match('Death Index');
    })
  });
}

function viewSourcesOther() {
  const storiesOther = DATABASE.stories.filter(story => {
    return !['cemetery', 'newspaper', 'index', 'book'].includes(story.type)
      && !['World War I draft', 'World War II draft',
        'Photo'].includes(story.title)
      && !story.title.match('Census');
  });

  storiesOther.sortBy(story => story.title);

  showSourceCategoryList({
    title: 'Baptism',
    stories: storiesOther.filter(story => story.title.match('Baptism'))
  });

  showSourceCategoryList({
    title: 'Marriage',
    stories: storiesOther.filter(story => story.title.match('Marriage'))
  });

  showSourceCategoryList({
    title: 'Immigration & Travel',
    stories: storiesOther.filter(story => story.title.match('Passenger'))
  });

  showSourceCategoryList({
    title: 'Other',
    stories: storiesOther.filter(story => {
      return !story.title.match('Baptism')
        && !story.title.match('Marriage')
        && !story.title.match('Passenger');
    })
  });
}


function showSourceCategoryList(options) {
  showStory = options.showStoryInLink;
  if (showStory === undefined) {
    showStory = true;
  }

  if (options.title) {
    h2(options.title);
  }

  options.stories.forEach(story => {
    if (options.showStoryTitles) {
      h2(story.title);
    }
    showSourceList(story.entries, true, true, showStory);
  });
}

function showSourceList(sourceList, showLocation, showDate, showStory) {
  let previousHeader;
  let firstItem = true;

  sourceList.forEach(source => {
    let linkText;

    if (showStory) {
      linkText = source.story.title + ' - ' + source.title;
    } else {
      linkText = source.title;
    }

    rend(
      '<p style="padding-top: ' + (firstItem ? '5' : '15') + 'px; padding-left: 10px;">' +
        linkToSource(source, linkText) +
      '</p>'
    );

    if (showLocation) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.location.format +
        '</p>'
      );
    }

    if (showDate) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.date.format +
        '</p>'
      );
    }

    firstItem = false;
  });
}

class ViewSource extends ViewPage {
  static byUrl() {
    const sourceId = PATH.replace('source/', '');

    const source = DATABASE.sourceRef[sourceId];

    if (!source) {
      h1('Source not found');
      return;
    }

    new ViewSource(source).render();
  }

  constructor(source) {
    super(source);
    this.source = source;
    this.story = source.story;
    this.type = source.story.type;
  }

  render() {
    this.setTitle();
    this.headerTrail();
    this.viewTitles();
    this.viewSectionSummary();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionPeople();
    this.viewStories();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.otherEntries();
  }

  setTitle() {
    if (this.type == 'cemetery') {
      setPageTitle(this.story.title);
    } else {
      setPageTitle('Source');
    }
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail(
        'sources',
        pluralize(this.type),
        [this.type + '/' + this.story._id, this.story.title]
      );
    }

    if (this.type == 'document' && this.story.title.match('Census USA')) {
      return headerTrail('sources', ['sources/censusUSA', 'Census USA'],
        [false, this.source.date.year]);
    }

    return headerTrail('sources');
  }

  viewTitles() {
    if (this.type == 'cemetery') {
      pg(this.story.location.format);
      pg('<br>');
      h1(this.source.title);
      return;
    }

    if (this.type == 'newspaper') {
      h1(this.source.title);
      pg('newspaper article');
      pg(this.story.location.format);
      pg(this.source.date.format);
      return;
    }

    if (this.type == 'document') {
      if (this.story.title.match('Census USA')) {
        h1(this.source.title);
        pg(this.story.type);
      } else {
        h1('Document');
        pg(this.source.title);
      }
    } else {
      h1('Source');
      pg(this.story.type);
      pg(this.source.title);
    }

    pg(this.source.date.format || this.story.date.format);
    pg(this.source.location.format || this.story.location.format);
  }

  viewImages() {
    if (!this.source.images.length) {
      return;
    }

    h2('Images');

    if (this.source.tags.cropped) {
      rend('<p style="margin-bottom:10px">' +
        'The image is cropped to show the most relevent portion. ' +
        'See the "links" section below to see the full image.' +
      '</p>');
    }

    let measure = this.type == 'cemetery' ? 200 : null;

    this.source.images.forEach(image => {
      rend(Image.make(image, measure).css('margin-right', '5px'));
    });
  }

  viewStories() {
    if (this.source.stories.length == 0) {
      return;
    }
    h2('See Also');
    this.viewSectionList(this.source.stories, {
      type: 'stories',
      bullet: true,
      divider: false,
      summary: true,
      location: true,
      date: true,
    });
  }

  otherEntries() {
    if (this.type == 'document' && this.story.title.match('Census USA')) {
      const neighbors = this.story.entries.filter(source => {
        return source.location.format == this.source.location.format
          && source._id != this.source._id;
      });

      if (neighbors.length == 0) {
        return;
      }

      h2('Neighbors');

      pg('Other households in <b>' + this.source.location.format + '</b> in '
        + this.source.date.year + '.').css('margin-bottom', '10px');

      this.viewSectionList(neighbors, {
        type: 'sources',
        showStory: false,
        bullet: true,
        divider: false,
        summary: true,
        location: false,
        date: false,
      });

      return;
    }

    if (!['newspaper', 'cemetery'].includes(this.type)) {
      return;
    }

    const entries = this.story.entries.filter(s => s != this.source);

    if (entries.length == 0) {
      return;
    }

    h2('More from ' + this.story.title);

    if (this.type == 'cemetery') {
      entries.sortBy(source => source.title);
      ViewCemeteryOrNewspaper.showListOfGraves(entries);
    } else {
      entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
      ViewCemeteryOrNewspaper.showListOfArticles(entries);
    }
  }
}

class ViewStoryIndex extends ViewPage {
  static byUrl() {
    if (['artifacts', 'books', 'cemeteries', 'landmarks', 'newspapers']
        .includes(PATH)) {
      new ViewStoryIndex(PATH).render();
      return true;
    }
    return false;
  }

  constructor(storyType) {
    super();
    this.type = storyType.singularize();
    this.mainTitle = storyType.capitalize();
    this.stories = this.getStories();
    this.entryName = this.getEntryName();
  }

  getStories() {
    if (this.type == 'artifact') {
      return DATABASE.stories.filter(story => {
        return story.type == 'artifact' || story.tags.artifact;
      });
    }
    return DATABASE.stories.filter(story => {
      return story.type == this.type;
    });
  }

  getEntryName() {
    if (this.type == 'cemetery') {
      return 'grave';
    }
    if (this.type == 'newspaper') {
      return 'article';
    }
  }

  render() {
    this.headerTrail();
    this.setPageTitle();
    this.viewTitle();
    this.viewStories();
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      headerTrail('sources');
    }
  }

  setPageTitle() {
    setPageTitle(this.mainTitle);
  }

  viewTitle() {
    if (this.type == 'artifact') {
      return h1('Artifacts and family heirlooms');
    }
    if (this.type == 'landmark') {
      return h1('Landmarks and buildings');
    }
    h1(this.mainTitle);
  }

  viewStories() {
    if (['cemetery', 'newspaper'].includes(this.type)) {
      return this.viewCemeteriesNewspapers();
    }

    this.viewSectionList(this.stories, {
      type: 'stories',
      bullet: false,
      divider: true,
      summary: true,
      location: true,
      date: true,
    });
  }

  viewCemeteriesNewspapers() {
    const [placeList, storiesByPlace] = this.getStoriesByPlace();

    placeList.forEach(place => {
      h2(place);
      storiesByPlace[place].forEach(story => {
        pg(linkToStory(story)).css('margin', '15px 0 0 5px');
        pg(story.location.format).css('margin-left', '5px');

        let numEntries;

        if (this.type == 'cemetery') {
          numEntries = ViewStoryIndex.getNumberOfGravesInCemetery(story);
        } else {
          numEntries = story.entries.length;
        }

        pg(numEntries + ' ' + this.entryName.pluralize(numEntries))
          .css('margin-left', '5px');
      });
    });
  }

  getStoriesByPlace() {
    const placeList = [];
    const storiesByPlace = { Other: [] };
    const stories = DATABASE.stories.filter(s => s.type == this.type);

    stories.forEach(story => {
      let placeName = 'Other';
      if (story.location.country == 'United States' && story.location.region1) {
        placeName = USA_STATES[story.location.region1];
      }
      if (storiesByPlace[placeName] == undefined) {
        placeList.push(placeName);
        storiesByPlace[placeName] = [];
      }
      storiesByPlace[placeName].push(story);
    });

    placeList.sort();

    if (storiesByPlace.Other.length) {
      placeList.push('Other');
    }

    return [placeList, storiesByPlace];
  }

  static getNumberOfGravesInCemetery(story) {
    let count = 0;

    story.entries.forEach(source => {
      count += source.people.length || 1;
    });

    return count;
  }
}

class ViewStory extends ViewPage {
  static byId(storyId) {
    const story = DATABASE.storyRef[storyId];

    if (story) {
      new ViewStory(story);
      return true;
    }
  }

  constructor(story) {
    super(story);
    this.story = story;
    this.type = story.type;
    this.entries = story.entries;
  }

  headerTrail() {
    if (['book', 'cemetery', 'newspaper'].includes(this.type)) {
      return headerTrail('sources', pluralize(this.type));
    }

    if (['artifact', 'landmark'].includes(this.type)) {
      return headerTrail(pluralize(this.type));
    }

    return headerTrail('sources');
  }

  viewImages() {
    if (!this.story.images.length) {
      return;
    }
    h2('Images');
    this.story.images.forEach(image => {
      rend(Image.make(image, 100, 100).css('margin', '10px 5px 0 5px'));
    });
  }

  viewPhotos() {
    const images = [];

    const sources = DATABASE.sources.filter(source => {
      if (source.stories.includes(this.story)) {
        source.images.forEach(image => {
          if (image.tags.story) {
            images.push(image);
          }
        });
      }
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

  viewSources() {
    const sources = DATABASE.sources.filter(source => {
      return source.stories.includes(this.story);
    });
    if (sources.length == 0) {
      return;
    }
    h2('Sources');
    sources.forEach(source => {
      rend('<p style="margin: 10px">' + linkToSource(source, true) + '</p>');
    });
  }

  viewExcerpts() {
    const excerpts = this.story.notations.filter(notation => {
      return notation.title == 'excerpt';
    });
    if (excerpts.length == 0) {
      return;
    }
    h2('Excerpts');
    excerpts.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr style="margin: 20px 0;">');
      }
      pg(notation.text).css('margin-top', '20px');
      pg('from ' + linkToSource(notation.source, true))
        .css('margin', '10px 0 0 30px');
    });
  }

  viewSectionSources() {
    if (this.story.sources.length == 0) {
      return;
    }
    h2('Sources');
    this.story.sources.forEach(source => {
      pg(linkToSource(source, true)).css('margin', '10px 5px');
    });
  }
}

class ViewCemeteryOrNewspaper extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('newspaper/', '').replace('cemetery/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return pageNotFound();
    }

    new ViewCemeteryOrNewspaper(story).render();
    return true;
  }

  constructor(story) {
    super(story);

    if (this.type == 'cemetery') {
      this.entries.sortBy(source => source.title);
    } else if (this.type == 'newspaper') {
      this.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    }
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    rend('<p style="padding-top: 10px;">' + this.story.location.format + '</p>');

    this.viewSectionPeople();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
    this.showEntries();
  }

  showEntries() {
    if (this.type == 'cemetery') {
      h2('Graves');
      ViewCemeteryOrNewspaper.showListOfGraves(this.entries)
    } else {
      h2('Articles');
      ViewCemeteryOrNewspaper.showListOfArticles(this.entries);
    }
  }

  static showListOfGraves(sources) {
    sources.forEach((source, i) => {
      const $box = $('<div style="margin: 20px 10px;">');

      $box.append('<p>' + linkToSource(source) + '</p>');

      if (source.summary) {
        $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
      }

      rend($box);
    });
  }

  static showListOfArticles(sources) {
    sources.forEach((source, i) => {
      if (i > 0) {
        rend('<hr>');
      }

      const $box = $('<div style="margin: 20px 10px;">');

      $box.append('<p>' + linkToSource(source) + '</p>');

      if (source.date.format) {
        $box.append('<p style="margin-top: 5px">' + source.date.format + '</p>');
      }

      if (source.summary) {
        $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
      }

      rend($box);
    });
  }
}

class ViewStoryBook extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('book/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return pageNotFound();
    }

    new ViewStoryBook(story).render();
    return true;
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    ['date', 'location'].forEach(attr => {
      if (this.story[attr].format) {
        rend('<p style="padding-top: 10px;">' + this.story[attr].format + '</p>');
      }
    });

    this.viewSectionPeople();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
    this.showEntries();
  }

  showEntries() {
    h2('Chapters');

    if (this.entries.length == 0) {
      pg('<i>None</i>').css('margin', '15px 10px');
      return;
    }

    this.viewSectionList(this.entries, {
      type: 'sources',
      showStory: false,
      bullet: true,
      divider: false,
      summary: true,
    });
  }
}

class ViewStoryArtifactOrLandmark extends ViewStory {
  static byUrl() {
    const [storyType, storyId, extraText] = PATH.split('/');
    const story = DATABASE.storyRef[storyId];

    if (storyType != 'artifact' && storyType != 'landmark') {
      return false;
    }

    if (!story || extraText) {
      return pageNotFound();
    }

    new ViewStoryArtifactOrLandmark(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    this.headerTrail();

    setPageTitle(this.story.title);
    h1(this.story.title);

    rend('<p style="padding-top: 10px;">' + this.story.location.format + '</p>');

    this.viewSectionSummary();
    this.viewSectionPeople();
    this.viewPhotos();
    this.viewImages();
    this.viewSectionContent();
    this.viewSectionNotes();
    this.viewSectionLinks();
    this.viewSources();
    this.viewExcerpts();
  }
}

class ViewStoryTopic extends ViewStory {
  static byId(storyId) {
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryTopic(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);
    this.viewExcerpts();
    this.viewSources();
    this.viewSpecialTopic();
  }

  viewSpecialTopic() {
    if (this.story.title == 'Gravestone symbols') {
      return ViewSpecialTopicGravestones.gravestoneSymbols();
    }
    if (this.story.title == 'Masonry') {
      return ViewSpecialTopicGravestones.masonGravestones();
    }
  }
}

class ViewStoryEvent extends ViewStory {
  static byUrl() {
    const storyId = PATH.replace('event/', '');
    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryEvent(story).render();
    return true;
  }

  constructor(story) {
    super(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);

    ['date', 'location'].forEach(attr => {
      if (this.story[attr] && this.story[attr].format) {
        pg(this.story[attr].format).css('margin', '5px');
      }
    });

    this.viewSectionPeople();
    this.viewSectionSources();
    this.viewExcerpts();
  }
}

class ViewTopic extends ViewPage {
  static byUrl() {
    const topic = PATH.replace('topic/', '');

    if (topic == 'military') {
      viewTopicMilitary();
      return true;
    }

    if (topic == 'immigration') {
      viewTopicImmigration();
      return true;
    }

    if (topic == 'disease') {
      new ViewTopicDisease().render();
      return true;
    }

    if (topic == 'brickwalls') {
      viewTopicBrickwalls();
      return true;
    }

    if (topic == 'big-families') {
      viewTopicBigFamilies.new();
      return true;
    }

    return ViewStoryTopic.byId(topic);
  }
}

class viewTopicBigFamilies extends ViewPage {
  static new() {
    new viewTopicBigFamilies().render();
  }

  constructor() {
    super();
    this.eval();
  }

  eval() {
    this.listByNumber = [];

    DATABASE.people.forEach(person => {
      let i = Person.create(person).numberOfChildren();
      if (i == null || i < 6) {
        return;
      }
      this.listByNumber[i] = this.listByNumber[i] || [];
      this.listByNumber[i].push(person);
    });

    this.sectionNumbers = Object.keys(this.listByNumber).reverse();
  }

  render() {
    setPageTitle('Big Families');
    h1('Big Families');
    rend('<div style="height: 30px"> </div>');
    this.showLetter();
    rend('<hr style="margin: 30px 0">');
    this.showPhoto1();
    this.showPhoto2();
    this.showLists();
  }

  showLetter() {
    const person = Person.find('urania-aborn');
    const source = DATABASE.sourceRef['5d0084c360a5ff4d264d282e'];

    const quote = 'You will be supposing to have me say, "Here I am ' +
      'confined again" with a daughter a fortnight old yesterday... ' +
      'little did I think when I came to Georgia that I would have ' +
      'children oftener than once a year, but it is so; I must submit to it.';

    const $credit = $('<span>')
      .append(' - ')
      .append(linkToPerson(person, false, 'Urania Smith'))
      .append(', ')
      .append(linkToSource(source, 'letter to sister'))
      .append(', 1834');

    rend($quoteBlock({
      text: quote,
      credit: $credit,
      rightQuote: true,
      css: {
        'margin-top': '20px'
      },
      coverBackground: true,
    }));
  }

  showPhoto1() {
    const source = DATABASE.sourceRef['5d007bac60a5ff4d264d281d'];

    const caption = 'Frances and Sheldon Smith pose with 10 of ' +
      'their 13 children, circa 1870. (One child died and two were not ' +
      'yet born.) Frances came from a family of 12 children and Sheldon ' +
      'came from a family of 8 children. Their daughter Fannie (standing ' +
      'on far left) would later marry Harrison Clifton, himself from a ' +
      'family of 9 children, and have 13 children. ';

    rend(Image.make(source.images[0]));

    rend(
      $('<div style="margin: 10px 0;">')
      .append('<b>Above:</b> ')
      .append(caption)
      .append(linkToSource(source, '<i>(see more about this photo)</i>'))
    );
  }

  showPhoto2() {
    const source = DATABASE.sourceRef['5d9698b8e3a11b8ceb8ea6b7'];

    const caption = 'Frank and Christina Fencl with 10 of their children. ';

    rend(
      $('<div style="margin: 20px 0;">')
      .append('<b>Below:</b> ')
      .append(caption)
      .append(linkToSource(source, '<i>(see more about this photo)</i>'))
    );

    rend(Image.make(source.images[0]));
  }

  showLists() {
    this.sectionNumbers.forEach(number => {
      h2(number + ' children');
      rend($makePeopleList(this.listByNumber[number], 'photo'));
    });
  }
}

function viewTopicBrickwalls() {
  setPageTitle('Brick Walls');
  h1('Brick Walls & Mysteries');
  h2('Current questions');
  viewTopicBrickwallHelper('brick wall');
  h2('Solved');
  viewTopicBrickwallHelper('broken brick wall');
}

function viewTopicBrickwallHelper(tagName) {
  const people = DATABASE.people.filter(person => person.tags[tagName]);
  const notations = DATABASE.notations.filter(note => note.tags[tagName]);

  rend($makePeopleList(people, 'photo'));

  notations.forEach((notation, i) => {
    if (i > 0) {
      rend('<hr>');
    } else if (people.length > 0) {
      rend('<hr style="margin-top: 10px">');
    }
    rend($notationBlock(notation, {
      alwaysShowPeople: true,
      splitParagraphs: false
    }));
  });
}

class ViewTopicDisease extends ViewPage {
  constructor() {
    super();
    this.collectData();
  }

  collectData() {
    this.people = Person.filter(person => person.tags['died of disease']);

    this.timeline = new Timeline(false, false, {
      sourceFilter: this.sourceFilter.bind(this),
      eventFilter: this.eventFilter.bind(this),
      sort: true,
      keys: {
        'life': 'personal events',
        'historical': 'historical events',
        'source': 'sources',
      },
    });
  }

  render() {
    setPageTitle('Disease');
    h1('Disease');

    h2('People that died of disease');
    rend($makePeopleList(this.people, 'photo'));

    h2('Timeline');
    this.timeline.renderTimeline();
  }

  sourceFilter(source) {
    return source.tags['disease'];
  }

  eventFilter(event) {
    if (event.title.match('illness')) {
      return true;
    }
    if (event.title == 'death'
        && Person.isInList(this.people, event.people[0])) {
      return true;
    }
    if (event.tags['disease']) {
      return true;
    }
    return false;
  }
}

function viewTopicImmigration() {
  const countries = [];
  const peopleByCountry = {};

  const people = DATABASE.people.filter(person => person.tags.immigrant);

  people.forEach(person => {
    (person.tags.country || 'Other').split(',').forEach(country => {
      if (!countries.includes(country)) {
        countries.push(country);
        peopleByCountry[country] = [];
      }
      peopleByCountry[country].push(person);
    });
  });

  countries.trueSort((a, b) => a < b && a != 'Other');

  setPageTitle('Immigration');
  h1('Immigration');

  if (ENV == 'dev') {
    pg(localLink('audit/immigration', 'immigration audit page'))
      .css('margin', '20px 10px');
  }

  countries.forEach(country => {
    h2(country);
    rend($makePeopleList(peopleByCountry[country], 'photo'));
  });

  h2('Timeline');

  new Timeline(null, null, {
    sourceFilter: source => source.tags.immigration,
    eventFilter: event => event.title == 'immigration' || event.tags.immigration,
    sort: true,
    render: true
  });
}

function viewTopicMilitary() {
  const veterans = DATABASE.people.filter(person => person.tags.veteran);
  const americanRevolution = veterans.filter(person => person.tags.war == 'American Revolution');
  const civilWar = veterans.filter(person => person.tags.war == 'CSA');
  const wwi = veterans.filter(person => person.tags.war == 'WWI');
  const wwii = veterans.filter(person => person.tags.war == 'WWII');
  const otherVeterans = veterans.filter(person => {
    return !['American Revolution', 'CSA', 'WWI', 'WWII'].includes(person.tags.war);
  });
  const diedAtWar = DATABASE.people.filter(person => person.tags['died at war']);

  const militaryTimeline = new Timeline();
  const addedAlready = {};

  DATABASE.events.filter(event => {
    return event.tags.military
      || event.title.match('military')
      || event.title == 'enlistment'
      || event.title.match('Battle')
      || (event.notes || '').match('battle');
  }).forEach(event => {
    addedAlready[event._id] = true;
    militaryTimeline.insertItem({
      ...event,
      event: true
    });
  });

  DATABASE.sources.filter(source => source.tags.military).forEach(source => {
    militaryTimeline.insertItem({
      ...source,
      source: true
    });
  });

  diedAtWar.forEach(person => {
    if (person.death && !addedAlready[person.death._id]) {
      militaryTimeline.insertItem({
        ...person.death,
        event: true
      });
    }
  });

  militaryTimeline.sortList();

  setPageTitle('Military');
  h1('Military');

  h2('American Revolution veterans');
  rend($makePeopleList(americanRevolution, 'photo'));

  h2('Civil War veterans');
  rend($makePeopleList(civilWar, 'photo'));

  h2('World War I veterans');
  rend($makePeopleList(wwi, 'photo'));

  h2('World War II veterans');
  rend($makePeopleList(wwii, 'photo'));

  if (otherVeterans.length) {
    h2('Other wars');
    rend($makePeopleList(otherVeterans, 'photo'));
  }

  h2('People who died at war');
  rend($makePeopleList(diedAtWar, 'photo'));

  h2('Timeline');
  militaryTimeline.renderTimeline();
}

class ViewSpecialTopicGravestones extends ViewPage {
  static forEachGravestoneImage(callback) {
    DATABASE.stories
    .filter(story => story.type == 'cemetery')
    .forEach(story => {
      story.entries.forEach(source => {
        source.images.forEach(image => {
          callback(image);
        });
      });
    });
  }

  static gravestoneSymbols() {
    pg('Click any image for more information about the grave.')
      .css('margin-top', '15px');

    const categories = {};
    const noCategory = [];

    ViewSpecialTopicGravestones.forEachGravestoneImage(image => {
      if (image.tags['gravestone symbol']) {
        const cat = image.tags['gravestone symbol'] || 'none';
        categories[cat] = categories[cat] || [];
        categories[cat].push(image);
      } else {
        noCategory.push(image);
      }
    });

    // categories.none = noCategory;

    for (let cat in categories) {
      h2(cat);
      categories[cat].forEach(image => {
        const $link = Image.asLink(image, 300);
        $link.find('img')
          .prop('title', image.item.title)
          .css('margin', '5px');
        rend($link);
      });
    }
  }

  static masonGravestones() {
    h2('Gravestones');

    pg('These gravestones show the Mason symbol. Click any image for more '
      + 'information about the grave.').css('margin', '15px 0');

    ViewSpecialTopicGravestones.forEachGravestoneImage(image => {
      if (image.tags['gravestone symbol'] == 'Freemasons') {
        const $link = Image.asLink(image, 250);
        $link.find('img')
          .prop('title', image.item.title)
          .css('margin', '5px');
        rend($link);
      }
    });
  }
}
