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


class ViewAbout extends ViewPage {
  static load(params) {
    return false;
  }
}

class ViewAboutPersonProfile extends ViewPage {
  static load(params) {
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

    $('#example-tree').append('insert tree');
  }
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


const SITE_TITLE = 'Anna\'s Ancestors';

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

class ViewEvents extends ViewPage {
  static load(params) {
    new ViewEvents().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('Events');
    h1('All Events');

    const $table = $('<table class="event-list" border="1">');
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

  static eventBlock(event) {
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

    DATABASE.stories.filter(story => story.type == 'topic').forEach(story => {
      let storyId = story.tags.customId || story._id;
      this.viewBrowseSection({
        path: 'topic/' + storyId,
        title: story.title.toLowerCase(),
        text: ViewStoryTopic.homePageSummary(story)
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


class ViewYear extends ViewPage {
  static load(params) {
    const year = parseInt(params.year);

    if (isNaN(year)) {
      return false;
    }

    new ViewYear(year).render();

    return true;
  }

  constructor(year) {
    super();

    this.year = year;

    this.bornThisYear = DATABASE.people.filter(person => {
      return person.birth && person.birth.date && person.birth.date.year === year;
    });

    this.diedThisYear = DATABASE.people.filter(person => {
      return person.death && person.death.date && person.death.date.year === year;
    });

    this.aliveThisYear = DATABASE.people.filter(person => {
      return person.birth && person.birth.date && person.birth.date.year < year
        && person.death && person.death.date && person.death.date.year > year;
    });

    this.events = DATABASE.events.filter(event => {
      return event.date && event.date.year == year
        && event.title != 'birth' && event.title != 'death';
    });

    this.bornThisYear.sortBy(person => person.birthSort);
    this.aliveThisYear.sortBy(person => person.birthSort);
    this.events.sortBy(event => event.date.sort);
  }

  render() {
    setPageTitle(this.year);
    h1(this.year);

    rend(
      '<p>' +
        localLink('year/' + (this.year - 1), '&#10229;' + (this.year - 1)) +
        ' &#160; &#160; &#160; ' +
        localLink('year/' + (this.year + 1), (this.year + 1) + '&#10230;') +
      '</p>'
    );

    let $list;

    h2('Events');
    this.events.forEach(event => {
      rend(ViewEvents.eventBlock(event).css('margin-left', '10px'));
    });

    h2('Born this year');
    $list = $makePeopleList(this.bornThisYear, 'photo');
    rend($list);

    h2('Died this year');
    $list = $makePeopleList(this.diedThisYear, 'photo');
    rend($list);

    h2('Lived during this year');
    $list = $makePeopleList(this.aliveThisYear, 'photo');
    rend($list);
    this.aliveThisYear.forEach(person => {
      const age = this.year - person.birth.date.year;
      $list.find('[data-person="' + person._id + '"]').append(' (age: ' + age + ')');
    });
  }
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


function PATHS() {
  return [
    ['', ViewHome],
    ['year/:year', ViewYear],

    // people
    ['people', ViewPeople],
    ['person/:personId', ViewPerson],
    ['person/:personId/source/:sourceId', ViewPerson],
    ['person/:personId/test', ViewPerson],

    // documents
    ['sources', ViewSourcesIndex],
    ['sources/all', ViewSourcesAll],
    ['sources/censusUSA', ViewSourcesCensusUSA],
    ['sources/censusState', ViewSourcesCensusState],
    ['sources/censusOther', ViewSourcesCensusOther],
    ['sources/draft', ViewSourcesDraft],
    ['sources/indexOnly', ViewSourcesIndexOnly],
    ['sources/other', ViewSourcesOther],

    // source/story/etc. categories
    ['artifacts', ViewStoryIndexArtifacts],
    ['books', ViewStoryIndexBooks],
    ['cemeteries', ViewStoryIndexCemeteries],
    ['landmarks', ViewStoryIndexLandmarks],
    ['newspapers', ViewStoryIndexNewspapers],
    ['events', ViewEvents],
    ['photos', ViewPhotos],

    // source/story records
    ['artifact/:storyId', ViewStoryArtifactOrLandmark],
    ['book/:storyId', ViewStoryBook],
    ['cemetery/:storyId', ViewCemeteryOrNewspaper],
    ['event/:storyId', ViewStoryEvent],
    ['image/:imageId', ViewImage],
    ['landmark/:storyId', ViewStoryArtifactOrLandmark],
    ['newspaper/:storyId', ViewCemeteryOrNewspaper],
    ['topic/:storyId', ViewStoryTopic],

    // places
    ['places', ViewPlace],
    ['places/all', ViewPlace],
    ['places/:country', ViewPlace],
    ['places/:country/:region1', ViewPlace],
    ['places/:country/:region1/:region2', ViewPlace],
    ['places/:country/:region1/:region2/:city', ViewPlace],

    ['about', ViewAbout],
    ['about/person-profile', ViewAboutPersonProfile],

    ['audit', ViewAudit],
    ['audit/age-at-death', ViewAuditAgeAtDeath],
    ['audit/census/:year', ViewAuditCensus],
    ['audit/children', ViewAuditChildren],
    ['audit/immigration', ViewAuditImmigration],
  ].map(([path, pageClass]) => {
    return {
      load: pageClass.load || pageClass.byUrl,
      path,
      pathParts: path.split('/'),
      exact: !path.match(':')
    };
  });
}

function loadContent() {
  if (PATH.slice(0, 6) === 'search') {
    return SearchResults.byUrl();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  const route = findRoute();

  if (route) {
    return route.load(route.params) || pageNotFound();
  }

  pageNotFound();
}

function findRoute() {
  const exactPath = PATHS().find(route => {
    return route.exact && route.path === PATH;
  });

  if (exactPath) {
    console.log('Found exact route.');
    return exactPath;
  }

  const parts = PATH.split('/');

  const dynamicPath = PATHS().filter(route => {
    return !route.exact && parts.length == route.pathParts.length;
  }).map(route => {
    route.params = {};
    for (let index = 0; index < route.pathParts.length; index++) {
      const pathPart = route.pathParts[index];
      if (pathPart[0] === ':') {
        route.params[pathPart.slice(1)] = parts[index];
        continue;
      }
      if (pathPart !== parts[index]) {
        return false;
      }
    }
    return route;
  }).filter(Boolean);

  if (dynamicPath.length === 0) {
    console.error('Route not found.');
    return false;
  }

  if (dynamicPath.length > 1) {
    console.error('Found multiple matching routes.');
  }

  console.log('Found dynamic route.');
  return dynamicPath[0];
}

function viewTests() {
  setPageTitle('Tests');
  h1('Tests');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  h1('Page Not Found');
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

    if (options.showText) {
      $item.append(' ' + (options.showText(person) || ''));
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

class ViewPeople extends ViewPage {
  static load(params) {
    new ViewPeople().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('People');
    h1('All People');
    const peopleList = [...DATABASE.people];
    Person.sortListByAncestorDegree(peopleList);
    rend($makePeopleList(peopleList, 'photo'));
  }
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

  static getDatabaseList() {
    const allItems = [
      ...DATABASE.events,
      ...DATABASE.stories,
      ...DATABASE.sources
    ];

    const places = {};

    const tempParts = ['country', 'region1', 'region2', 'city'];

    allItems.forEach(item => {
      let {country, region1, region2, city} = item.location || {};

      if (country == 'United States' && region1) {
        region1 = USA_STATES[region1];
      }

      const pathParts = [country, region1, region2, city]
        .filter(Boolean)
        .map(pathTitle => {
          return {
            title: pathTitle,
            path: pathTitle.toLowerCase().replace(/ /g, '')
          };
        });

      if (pathParts.length < 4) {
        pathParts.push({title: '(none)', path: '(none)'});
      }

      const pathOnly = pathParts.map(part => part.path);

      pathParts.forEach((path, i) => {
        const fullPath = pathOnly.slice(0, i + 1).join('/');
        if (!places[fullPath]) {
          places[fullPath] = {
            title: path.title,
            items: [],
            list: [],
            level: i
          };
          const parentPath = pathOnly.slice(0, i).join('/');
          if (parentPath) {
            places[parentPath].list.push(fullPath);
          }
        }
      });

      places[pathOnly.join('/')].items.push(item);
    });

    return places;
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
    if (PATH == 'places') {
      ViewPlace.renderIndex();
      return true;
    }

    if (PATH == 'places/all') {
      ViewPlace.renderListAll();
      return true;
    }

    const placeParts = PATH.split('/');
    let [base, country, region1, region2, city, extra] = placeParts;

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

  static renderIndex() {
    const places = Place.getDatabaseList();

    const keys = Object.keys(places).sort();

    const countries = keys.filter(key => {
      return places[key].level == 0 && places[key].title != '(none)';
    }).map(key => places[key]);

    h1('Places');

    pg(localLink('/places/all', 'See all places'))
      .css('margin', '12px 0 20px 0');

    countries.forEach(country => {
      pg(country.title).css('margin', '10px 0');
    });
  }

  static renderListAll() {
    const places = Place.getDatabaseList();

    const keys = Object.keys(places).sort();

    headerTrail(['/places', 'Places']);

    h1('All places');

    keys.forEach(placePath => {
      const place = places[placePath];
      if (place.title == '(none)') {
        return;
      }
      pg(place.title).css('margin', '10px ' + (place.level * 30) + 'px');
    });
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

class ViewSourcesIndex extends ViewPage {
  static load(params) {
    new ViewSourcesIndex().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    setPageTitle('Sources');
    h1('Sources');

    pg('A "source" can be a document, photograph, artifact, landmark, ' +
      'website, or anything else that adds to the picture of a family tree.')
    .css('margin', '10px 0 15px 0');

    [
      ['All Sources', 'sources/all'],
      ['Photographs', 'photos'],
      ['Newspapers', 'newspapers'],
      ['Cemeteries', 'cemeteries'],
      ['Books', 'books'],
      ['US Federal Census', 'sources/censusUSA'],
      ['US State Census', 'sources/censusState'],
      ['Other Census', 'sources/censusOther'],
      ['Military Draft Registration', 'sources/draft'],
      ['Index-only Records', 'sources/indexOnly'],
      ['Other Sources', 'sources/other'],
    ].forEach(([text, path]) => {
      rend(
        '<p style="margin-top: 8px; font-size: 18px;">' +
          localLink(path, text) +
        '</p>'
      );
    });
  }
}

class ViewSourcesAll extends ViewPage {
  static load(params) {
    new ViewSourcesAll().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('All Sources');
    h1('All Sources');

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
}

class ViewSourcesCensusUSA extends ViewPage {
  static load(params) {
    new ViewSourcesCensusUSA().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('United States Federal Census');
    h1('United States Federal Census');

    for (let year = 1790; year <= 1950; year += 10) {
      const story = Story.findByTitle('Census USA ' + year);

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
}

class ViewSourcesCensusState extends ViewPage {
  static load(params) {
    new ViewSourcesCensusState().render();
    return true;
  }

  constructor() {
    super();
    this.stories = DATABASE.stories.filter(isStoryStateCensus);
    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('US State Census');
    h1('US State Census');

    let previousHeader;

    this.stories.forEach(story => {
      const headerName = USA_STATES[story.location.region1];

      if (previousHeader != headerName) {
        h2(headerName);
        previousHeader = headerName;
      }

      showSourceList(story.entries, true, true, true);
    });
  }
}

function isStoryStateCensus(story) {
  return story.tags['Census US States'];
}

class ViewSourcesCensusOther extends ViewPage {
  static load(params) {
    new ViewSourcesCensusOther().render();
    return true;
  }

  constructor() {
    super();

    this.stories = DATABASE.stories.filter(story => {
      return story.title.match('Census')
        && !story.title.match('USA')
        && !isStoryStateCensus(story);
    });

    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Other Census');
    h1('Other Census');

    showSourceCategoryList({
      showStoryTitles: true,
      showStoryInLink: false,
      stories: this.stories
    });
  }
}

class ViewSourcesDraft extends ViewPage {
  static load(params) {
    new ViewSourcesDraft().render();
    return true;
  }

  constructor() {
    super();
  }

  render() {
    headerTrail('sources');
    setPageTitle('Military Draft Registration');
    h1('Military Draft Registration');

    ['World War I draft', 'World War II draft'].forEach(title => {
      showSourceCategoryList({
        title: title,
        stories: DATABASE.stories.filter(story => story.title == title),
        showStoryInLink: false
      });
    });
  }
}

class ViewSourcesIndexOnly extends ViewPage {
  static load(params) {
    new ViewSourcesIndexOnly().render();
    return true;
  }

  constructor() {
    super();
    this.stories = DATABASE.stories.filter(story => story.type == 'index');
    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Index-only Records');
    h1('Index-only Records');

    pg(
      'These sources come from online databases. Some of these records ' +
      'are transcribed from original documents and images which are not ' +
      'directly available online. Others are from web-only databases.'
    ).css('padding', '10px 0');

    showSourceCategoryList({
      title: 'Birth Index',
      stories: this.stories.filter(story => story.title.match('Birth Index'))
    });

    showSourceCategoryList({
      title: 'Death Index',
      stories: this.stories.filter(story => story.title.match('Death Index'))
    });

    showSourceCategoryList({
      title: 'Other',
      stories: this.stories.filter(story => {
        return !story.title.match('Birth Index')
          && !story.title.match('Death Index');
      })
    });
  }
}

class ViewSourcesOther extends ViewPage {
  static load(params) {
    new ViewSourcesOther().render();
    return true;
  }

  constructor() {
    super();

    this.stories = DATABASE.stories.filter(story => {
      return !['cemetery', 'newspaper', 'index', 'book'].includes(story.type)
        && !['World War I draft', 'World War II draft',
          'Photo'].includes(story.title)
        && !story.title.match('Census');
    });

    this.stories.sortBy(story => story.title);
  }

  render() {
    headerTrail('sources');
    setPageTitle('Other Sources');
    h1('Other Sources');

    showSourceCategoryList({
      title: 'Baptism',
      stories: this.stories.filter(story => story.title.match('Baptism'))
    });

    showSourceCategoryList({
      title: 'Marriage',
      stories: this.stories.filter(story => story.title.match('Marriage'))
    });

    showSourceCategoryList({
      title: 'Immigration & Travel',
      stories: this.stories.filter(story => story.title.match('Passenger'))
    });

    showSourceCategoryList({
      title: 'Other',
      stories: this.stories.filter(story => {
        return !story.title.match('Baptism')
          && !story.title.match('Marriage')
          && !story.title.match('Passenger');
      })
    });
  }
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
        this.type.pluralize(),
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

class Story {
  static filter(callback) {
    return DATABASE.stories.filter(callback);
  }

  static filterByType(storyType) {
    return DATABASE.stories.filter(story => story.type === storyType);
  }

  static findByTitle(storyName) {
    return DATABASE.stories.find(story => {
      return story.title === 'Census USA ' + year;
    });
  }

  static getNumberOfGravesInCemetery(story) {
    let count = 0;

    story.entries.forEach(source => {
      count += source.people.length || 1;
    });

    return count;
  }
}

class ViewStoryIndex extends ViewPage {
  constructor(options = {}) {
    super();
    this.type = options.storyType.singularize();
    this.mainTitle = options.storyType.capitalize();
    this.h1Title = options.h1Title || this.mainTitle;
    this.entryName = options.entryName;
    this.stories = this.getStories();
  }

  getStories() {
    return Story.filterByType(this.type);
  }

  render() {
    this.headerTrail();
    setPageTitle(this.mainTitle);
    h1(this.h1Title);
    this.renderStories();
  }

  headerTrail() {
    // skip for most story types
  }

  renderStories() {
    this.viewSectionList(this.stories, {
      type: 'stories',
      bullet: false,
      divider: true,
      summary: true,
      location: true,
      date: true,
    });
  }
}

class ViewStoryIndexArtifacts extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexArtifacts().render();
  }

  constructor() {
    super({
      storyType: 'artifacts',
      h1Title: 'Artifacts and family heirlooms',
    });
  }

  getStories() {
    return Story.filter(story => {
      return story.type == 'artifact' || story.tags.artifact;
    });
  }
}

class ViewStoryIndexBooks extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexBooks().render();
  }

  constructor() {
    super({
      storyType: 'books',
    });
  }

  headerTrail() {
    headerTrail('sources');
  }
}

class ViewStoryIndexLandmarks extends ViewStoryIndex {
  static load(params) {
    new ViewStoryIndexLandmarks().render();
  }

  constructor() {
    super({
      storyType: 'landmarks',
      h1Title: 'Landmarks and buildings'
    });
  }
}

class ViewStoryIndexCemeteryOrNewspaper extends ViewStoryIndex {
  // Cemeteries and newspapers have more functionality in common with
  // each other than with any of the other story types.

  constructor(options) {
    super(options);
    this.getStoriesByPlace();
  }

  headerTrail() {
    headerTrail('sources');
  }

  getStoriesByPlace() {
    this.placeList = [];
    this.storiesByPlace = {Other: []};

    this.stories.forEach(story => {
      let placeName = 'Other';
      if (story.location.country == 'United States' && story.location.region1) {
        placeName = USA_STATES[story.location.region1];
      }
      if (this.storiesByPlace[placeName] == undefined) {
        this.placeList.push(placeName);
        this.storiesByPlace[placeName] = [];
      }
      this.storiesByPlace[placeName].push(story);
    });

    this.placeList.sort();

    if (this.storiesByPlace.Other.length) {
      this.placeList.push('Other');
    }
  }

  renderStories() {
    this.placeList.forEach(place => {
      h2(place);
      this.storiesByPlace[place].forEach(story => {
        pg(linkToStory(story)).css('margin', '15px 0 0 5px');
        pg(story.location.format).css('margin-left', '5px');

        let numEntries;

        if (this.type == 'cemetery') {
          numEntries = Story.getNumberOfGravesInCemetery(story);
        } else {
          numEntries = story.entries.length;
        }

        pg(numEntries + ' ' + this.entryName.pluralize(numEntries))
          .css('margin-left', '5px');
      });
    });
  }
}

class ViewStoryIndexCemeteries extends ViewStoryIndexCemeteryOrNewspaper {
  static load(params) {
    new ViewStoryIndexCemeteries().render();
  }

  constructor() {
    super({
      storyType: 'cemeteries',
      entryName: 'grave',
    });
  }
}

class ViewStoryIndexNewspapers extends ViewStoryIndexCemeteryOrNewspaper {
  static load(params) {
    new ViewStoryIndexNewspapers().render();
  }

  constructor() {
    super({
      storyType: 'newspapers',
      entryName: 'article',
    });
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
      return headerTrail('sources', this.type.pluralize());
    }

    if (['artifact', 'landmark'].includes(this.type)) {
      return headerTrail(this.type.pluralize());
    }

    return headerTrail('sources');
  }

  renderSectionPeople(options = {}) {
    h2(options.title || 'Known members');

    if (options.subtext) {
      pg(options.subtext).css('margin', '15px 0');
    }

    rend($makePeopleList(options.people || this.story.people, 'photo'));
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

class ViewStoryTopic extends ViewStory {
  static byUrl() {
    const [isTopic, storyId, leftovers] = PATH.split('/');

    if (isTopic != 'topic' || !storyId || leftovers) {
      return false;
    }

    const story = DATABASE.storyRef[storyId];

    if (!story) {
      return false;
    }

    new ViewStoryTopic(story).render();
    return true;
  }

  static getStoryClass(story) {
    let matchTitle = story.title.toLowerCase();

    const exactNames = {
      'big families': ViewTopicBigFamilies,
      'cause of death': ViewTopicCauseOfDeath,
      'disease': ViewTopicDisease,
      'gravestone symbols': ViewTopicGravestones,
      'immigration': ViewTopicImmigration,
      'military': ViewTopicMilitary,
      'masonry': ViewTopicMasonry,
    };

    if (exactNames[matchTitle]) {
      return exactNames[matchTitle];
    }

    if (matchTitle.match('brick wall')) {
      return ViewTopicBrickWalls;
    }

    return ViewTopicOther;
  }

  static homePageSummary(story) {
    if (!story) {
      return;
    }

    const storyClass = ViewStoryTopic.getStoryClass(story);

    if (storyClass.homePageSummary) {
      return storyClass.homePageSummary();
    }
  }

  constructor(story) {
    super(story);
    this.topicClass = ViewStoryTopic.getStoryClass(story);
  }

  render() {
    setPageTitle(this.story.title);
    h1(this.story.title);
    new this.topicClass(this.story).render();
    return true;
  }
}

class ViewTopicBigFamilies extends ViewPage {
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

class ViewTopicBrickWalls extends ViewStoryTopic {
  static new() {
    const story = DATABASE.stories.find(story => story.title.match('Brick'));
    new ViewTopicBrickWalls(story).render();
    return true;
  }

  constructor(story) {
    super(story);

    this.current = {};
    this.solved = {};

    ['people', 'notations'].forEach(itemType => {
      this.current[itemType] = [];
      this.solved[itemType] = [];

      this.story[itemType].forEach(item => {
        if (item.tags['broken brick wall']) {
          this.solved[itemType].push(item);
        } else {
          this.current[itemType].push(item);
        }
      });
    });
  }

  render() {
    h2('Current questions');
    this.renderSection('current');
    h2('Solved');
    this.renderSection('solved');
  }

  renderSection(section) {
    rend($makePeopleList(this[section].people, 'photo'));

    this[section].notations.forEach((notation, i) => {
      if (i > 0) {
        rend('<hr>');
      } else if (this[section].people.length > 0) {
        rend('<hr style="margin-top: 10px">');
      }
      rend($notationBlock(notation, {
        alwaysShowPeople: true,
        splitParagraphs: false
      }));
    });
  }
}

class ViewTopicCauseOfDeath extends ViewStoryTopic {
  static getPersonList(causeOfDeath) {
    return DATABASE.people.filter(person => {
      return (person.tags['cause of death'] || '').split(',')
        .map(s => s.trim()).includes(causeOfDeath);
    });
  }

  constructor(story) {
    super(story);
  }

  render() {
    this.viewExcerpts();
    this.viewSources();
    this.renderAccident();
    this.renderDisease();
    this.renderWar();
    this.renderOther();
    this.renderUnknown();
  }

  subtitle(text) {
    pg(text).css('margin', '0 0 10px 5px');
  }

  printList(people, showText) {
    showText = showText || this.printListShowText;
    rend($makePeopleList(people, 'photo', {showText}));
  }

  printListShowText(person) {
    if (person.tags['cause of death note']) {
      return ' - ' + person.tags['cause of death note'];
    }
  }

  renderAccident() {
    h2('Accident');
    const people = ViewTopicCauseOfDeath.getPersonList('accident');
    this.printList(people);
  }

  renderDisease() {
    h2('Disease');
    this.subtitle('See also: '
      + localLink('/topic/disease', 'disease timeline'));
    const people = ViewTopicCauseOfDeath.getPersonList('disease');
    people.sortBy(person => person.tags['cause of death note'].toLowerCase());
    this.printList(people);
  }

  renderWar() {
    h2('War');
    this.subtitle('See also: '
      + localLink('/topic/military', 'more about military'));
    const people = ViewTopicCauseOfDeath.getPersonList('war');
    this.printList(people);
  }

  renderOther() {
    // Person has a cause of death and at least one of the values (separated
    // by comma, if multiple) is not accounted for in the other sections.
    h2('Other');
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death']
        && person.tags['cause of death'].split(',').some(causeOfDeath => {
          return !['accident', 'disease', 'war', 'unknown']
              .includes(causeOfDeath);
          });
    });
    people.sortBy(person => person.tags['cause of death']);
    this.printList(people, person => (' - ' + person.tags['cause of death']));
  }

  renderUnknown() {
    // Person cause of death is "unknown" or they died young and their
    // cause of death is not specified.
    h2('Unknown');
    this.subtitle('Died young or under odd circumstances, but cause of ' +
      'death not yet found.');
    const people = DATABASE.people.filter(person => {
      return person.tags['cause of death'] == 'unknown'
        || (!person.tags['cause of death'] && person.tags['died young']);
    });
    this.printList(people);
  }
}

class ViewTopicDisease extends ViewStoryTopic {
  static homePageSummary() {
    const people = ViewTopicDisease.getListOfPeople();

    const diseases = [];

    people.forEach(person => {
      let note = person.tags['cause of death note'];
      if (note && !diseases.includes(note)) {
        diseases.push(note);
      }
    });

    return ('At least ' + people.length + ' people in the Family Tree ' +
      ' have died of ' + diseases.length + ' different diseases. See a ' +
      'list of people, historical events, and newspaper articles.');
  }

  static getListOfPeople() {
    return ViewTopicCauseOfDeath.getPersonList('disease');
  }

  constructor(story) {
    super(story);
    this.collectData();
  }

  collectData() {
    this.people = ViewTopicDisease.getListOfPeople();

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
    h2('People that died of disease');

    rend($makePeopleList(this.people, 'photo', {
      showText: this.printListShowText
    }));

    h2('Timeline');
    this.timeline.renderTimeline();
  }

  printListShowText(person) {
    if (person.tags['cause of death note']) {
      return ' - ' + person.tags['cause of death note'];
    }
  }

  sourceFilter(source) {
    return source.tags['disease'];
  }

  eventFilter(event) {
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

class ViewTopicGravestones extends ViewStoryTopic {
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

  constructor(story) {
    super(story);
  }

  render() {
    pg('Click any image for more information about the grave.')
      .css('margin-top', '15px');

    const categories = {};
    const noCategory = [];

    ViewTopicGravestones.forEachGravestoneImage(image => {
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
}

class ViewTopicImmigration extends ViewStoryTopic {
  static homePageSummary() {
    return (
      'People in the Family Tree immigrated to the United States from ' +
      DATABASE.countryList.length + ' different countries. See a list ' +
      'of immigrants by county and a timeline of events.'
    );
  }

  constructor(story) {
    super(story);
  }

  render() {
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
}

class ViewTopicMasonry extends ViewStoryTopic {
  constructor(story) {
    super(story);
  }

  render() {
    this.renderSectionPeople();
    this.renderSectionGravestones();
    super.viewSources();
    super.viewExcerpts();
  }

  renderSectionPeople() {
    super.renderSectionPeople({
      title: 'Known members',
      subtext: 'Members are often identified in their obituary or by a ' +
        'symbol on their gravestone.'
    });
  }

  renderSectionGravestones() {
    h2('Gravestones');

    pg('These gravestones show the Mason symbol. Click any image for more '
      + 'information about the grave.').css('margin', '15px 0');

    ViewTopicGravestones.forEachGravestoneImage(image => {
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

class ViewTopicMilitary extends ViewStoryTopic {
  constructor(story) {
    super(story);
    this.veterans = ViewTopicMilitary.collectDataVeterans();
    this.diedAtWar = ViewTopicCauseOfDeath.getPersonList('war');
    this.timeline = ViewTopicMilitary.createTimeline(this.diedAtWar);
  }

  static collectDataVeterans() {
    const veteransAll = DATABASE.people.filter(person => person.tags.veteran);

    const veterans = {};

    function getVeterans(tagValue) {
      return veteransAll.filter(person => person.tags.veteran == tagValue);
    }

    veterans.americanRevolution = getVeterans('American Revolution');
    veterans.civilWar = getVeterans('CSA');
    veterans.wwi = getVeterans('WWI');
    veterans.wwii = getVeterans('WWII');

    veterans.other = veteransAll.filter(person => {
      return !['American Revolution', 'CSA', 'WWI', 'WWII']
        .includes(person.tags.veteran);
    });

    return veterans;
  }

  static createTimeline(diedAtWar) {
    const timeline = new Timeline();
    const addedAlready = {};

    DATABASE.events.filter(event => {
      return event.tags.military
        || event.title.match('military')
        || event.title == 'enlistment'
        || event.title.match('Battle')
        || (event.notes || '').match('battle');
    }).forEach(event => {
      addedAlready[event._id] = true;
      timeline.insertItem({
        ...event,
        event: true
      });
    });

    DATABASE.sources.filter(source => source.tags.military).forEach(source => {
      timeline.insertItem({
        ...source,
        source: true
      });
    });

    diedAtWar.forEach(person => {
      if (person.death && !addedAlready[person.death._id]) {
        timeline.insertItem({
          ...person.death,
          event: true
        });
      }
    });

    timeline.sortList();

    return timeline;
  }

  render() {
    [
      ['American Revolution veterans', 'americanRevolution'],
      ['Civil War veterans', 'civilWar'],
      ['World War I veterans', 'wwi'],
      ['World War II veterans', 'wwii'],
      ['Other wars', 'other']
    ].forEach(([title, warKey]) => {
      if (this.veterans[warKey].length) {
        h2(title);
        this.printList(this.veterans[warKey]);
      }
    });

    h2('People who died at war');
    this.printList(this.diedAtWar, person => {
      return ' - ' + person.tags['cause of death note'];
    });

    h2('Timeline');
    this.timeline.renderTimeline();
  }

  printList(people, showText) {
    rend($makePeopleList(people, 'photo', {showText}));
  }
}

class ViewTopicOther extends ViewStoryTopic {
  constructor(story) {
    super(story);
  }

  render() {
    super.viewExcerpts();
    super.viewSources();
  }
}
