
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

const citationItemOrder = [
  'name',
  'birth',
  'christening',
  'baptism',
  'marriage',
  'marriage - spouse',
  'marriage 1',
  'marriage 1 - spouse',
  'marriage 2',
  'marriage 2 - spouse',
  'divorce',
  'immigration',
  'naturalization',
  'death',
  'funeral',
  'obituary',
  'residence',
];

function $makeCitationList(citations) {
  citations = sortCitations(citations);

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

function sortCitations(citationList, endPoint) {
  let madeChange = false;
  endPoint = endPoint || citationList.length - 1;

  for (let i = 0; i < endPoint; i++) {
    const citation1 = citationList[i];
    const citation2 = citationList[i + 1];

    if (citationsShouldSwap(citation1, citation2)) {
      madeChange = true;
      citationList[i] = citation2;
      citationList[i + 1] = citation1;
    }
  }

  if (madeChange) {
    return sortCitations(citationList, endPoint - 1);
  }

  return citationList;
}

function citationsShouldSwap(citation1, citation2) {
  return compareItems(citation1.item, citation2.item,
    citation1.information, citation2.information);
}

function compareItems(item1, item2, information1, information2) {
  for (let i = 0; i < citationItemOrder.length; i++) {
    if (item1 == item2) {
      return information1 > information2;
    }

    if (item1 == citationItemOrder[i]) {
      return false;
    }

    if (item2 == citationItemOrder[i]) {
      return true;
    }

    if (item1 == citationItemOrder[i] + ' - date') {
      return false;
    }

    if (item2 == citationItemOrder[i] + ' - date') {
      return true;
    }

    if (item1 == citationItemOrder[i] + ' - place') {
      return false;
    }

    if (item2 == citationItemOrder[i] + ' - place') {
      return true;
    }

    if (item1.match(citationItemOrder[i])) {
      return false;
    }

    if (item2.match(citationItemOrder[i])) {
      return true;
    }
  }

  return item1 > item2;
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


const [ORIGIN, PATH, ENV] = getFilePaths();

$(document).ready(() => {
  setupLayout();
  setPageTitle();
  processDatabase();
  loadContent();
  runTests();
});

function getFilePaths() {
  let url = window.location.href;
  let path = '';
  let env;

  if (url.match('\\?')) {
    path = url.slice(url.indexOf('\?') + 1);
    url = url.slice(0, url.indexOf('\?'));
  }

  if (url.match('localhost')) {
    env = 'dev';
  }

  return [url, path, env];
}

Array.prototype.trueSort = function(callback) {
  this.sort((a, b) => {
    return callback(a, b) ? -1 : 0;
  });
};

Array.prototype.sortBy = function(callback) {
  this.sort((a, b) => {
    return callback(a) < callback(b) ? -1 : 0;
  });
};


function loadContent() {
  if (PATH == '') {
    return viewMain();
  }

  if (PATH == 'people') {
    return viewPeople();
  }

  if (PATH.match('person/')) {
    return viewPerson();
  }

  if (PATH == 'events') {
    return viewEvents();
  }

  if (PATH.length > 5 && PATH.slice(0, 6) == 'source') {
    return routeSources();
  }

  if (PATH.match('search')) {
    return viewSearch();
  }

  if (PATH.match('place')) {
    return viewPlaces();
  }

  if (PATH == 'test' && ENV == 'dev') {
    return viewTests();
  }

  if (PATH.match('image/')) {
    return viewImage();
  }

  if (PATH.match('topic/')) {
    return viewTopic();
  }

  if (PATH.match('year/')) {
    return viewYear();
  }

  if (PATH.match('about/')) {
    return viewAbout();
  }

  if (PATH.match('artifact') || PATH.match('landmark')) {
    return viewArtifactOrLandmark();
  }

  if (PATH.match('cemeter') || PATH.match('newspaper')) {
    return viewCemeteriesOrNewspapers();
  }

  if (PATH.match('book')) {
    return viewBook();
  }

  return pageNotFound();
}

function viewMain() {
  setPageTitle();
  h1(SITE_TITLE);

  h2('featured');
  rend($makePeopleList(DATABASE.people.filter(person => person.tags.featured), 'photo'));

  [
    ['USA/MN/Pipestone%20County/Ruthton', 'Ruthton, Minnesota'],
  ].forEach(([path, name]) => rend($makeIconLink('places/' + path, name, 'images/map-icon.svg')));

  DATABASE.stories.filter(s => s.tags.featured).forEach(story => {
    let path, icon;
    if (story.type == 'cemetery') {
      path = story.type + '/' + story._id;
      image = 'images/map-icon.svg';
    } else if (story.type == 'newspaper') {
      path = story.type + '/' + story._id;
      image = 'images/newspaper-icon.jpg';
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

  h2('photos');
  DATABASE.sources.filter(s => s.story.title == 'Photo').forEach(source => {
    if (source.images.length) {
      rend(
        localLink('source/' + source._id, '<img src="' + source.images[0] +
        '" style="height: 100px; max-width: 300px; margin: 5px;" title="' +
        source.title + '">')
      );
    }
  });

  h2('topics');
  bulletList([
    ['landmarks', 'landmarks and buildings'],
    ['artifacts', 'artifacts and family heirlooms'],
    ['topic/brickwalls', 'brick walls and mysteries'],
    ['topic/military', 'military'],
    ['topic/immigration', 'immigration'],
    ['topic/disease', 'disease'],
  ].map(([path, text]) => localLink(path, text)));

  h2('browse');
  bulletList([localLink('year/1904', 'browse by year')]);
}

function viewPeople() {
  setPageTitle('People');
  rend('<h1>All People</h1>');
  rend($makePeopleList(DATABASE.people, 'photo'));
}

function viewTests() {
  setPageTitle('Tests');
  rend('<h1>Tests</h1>');
}

function pageNotFound() {
  setPageTitle('Page Not Found');
  rend('<h1>Page Not Found</h1>');
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

function localLink(target, text, newTab) {
  return '<a href="' + ORIGIN + '?' + target + '"'
    + (newTab ? ' target="_blank"' : '') + '>' + text + '</a>';
}

function linkToPerson(person, leaf, text, keywords) {
  text = text || fixSpecialCharacters(person.name);
  if (keywords) {
    text = highlightKeywords(text, keywords);
  }
  return localLink('person/' + person.customId, text
    + (leaf && person.star ? '&#160;<span class="person-leaf"></span>' : ''));
}

function linkToStory(story, text) {
  let path = story.type;
  text = text || story.title;
  return localLink(path + '/' + story._id, text);
}

function linkToSource(source, text) {
  text = text || source.title;
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
        '<img src="images/' + imageName + '">' + linkText +
      '</a>' +
    '</div>'
  );
}

const RIGHT_ARROW = '&#8594;';

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

function h1(content) {
  rend($('<h1>').append(content));
}

function h2(content) {
  rend($('<h2>').append(content));
}

function bulletList(array, skipRender) {
  const $list = $('<ul class="bullet">');
  array.forEach(content => $list.append($('<li>').append(content)));
  if (!skipRender) {
    rend($list);
  }
  return $list;
}

function $makePeopleList(people, format, keywords) {
  if (format == 'photo') {
    const $list = $('<div class="people-list">');

    people.forEach(person => {
      const $item = $('<div class="icon-link">').appendTo($list);
      $item.attr('data-person', person._id);
      if (keywords) {
        $item.addClass('search-result-item');
      }
      $item.append(linkToPerson(person, false, '<img src="' + person.profileImage + '">'));
      $item.append(linkToPerson(person, true, null, keywords));
    });

    return $list;
  }

  const $list = $('<ul class="people-list">');

  people.forEach(person => {
    const $item = $('<li>').appendTo($list);
    $item.attr('data-person', person._id);
    $item.append(linkToPerson(person, true, null, keywords));
  });

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
    .replace('”', '"');
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
  const dateParts1 = [date1.year, date1.month, date1.day];
  const dateParts2 = [date2.year, date2.month, date2.day];

  for (let i = 0; i < 3; i++) {
    if (dateParts2[i] == null) {
      return true;
    }

    if (dateParts1[i] == null) {
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

function $notationBlock(notation, alwaysShowPeople) {
  const $div = $('<div class="notation-block">');
  $div.append('<p style="margin-bottom: 10px"><b>' + notation.title + '</b></p>');
  $div.append('<p>' + notation.text + '</p>');
  if (notation.people.length > 1 || alwaysShowPeople) {
    $div.append($makePeopleList(notation.people, 'photo'));
  }
  return $div;
}


function makeImage(sourceOrStory, imageNumber, maxHeight, maxWidth) {
  const imageAddress = sourceOrStory.images[imageNumber];
  const linkAddress = 'image/' + sourceOrStory._id + '/' + imageNumber;

  const $imageViewer = $(
    '<div class="image-viewer">' +
      localLink(linkAddress, '<img src="' + imageAddress + '">click to enlarge', true) +
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

function viewImage() {
  const [sourceId, imageNumber] = PATH.replace('image/', '').split('/');

  setPageTitle('Image');

  $('body').html('');

  $('body').css({
    'background': 'none',
    'background-color': 'black',
    'margin': '10px',
  });

  const sourceOrStory = DATABASE.sourceRef[sourceId]
    || DATABASE.storyRef[sourceId];

  const $image = $('<img>')
    .prop('src', sourceOrStory.images[imageNumber])
    .addClass('full-screen-image pre-zoom')
    .appendTo('body')
    .click(() => {
      if ($image.hasClass('pre-zoom')) {
        $image.removeClass('pre-zoom');
      } else {
        $image.addClass('pre-zoom');
      }
    });
}


function setupLayout() {
  $(document).on('click', '#menu-icon', openSideMenu);
  $(document).on('click', '#main-navigation .close-me', closeSideMenu);
  $(document).on('click', '#menu-backdrop', closeSideMenu);
  createHeaderLinks();
}

function openSideMenu() {
  $('#main-navigation, #menu-backdrop').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation, #menu-backdrop').removeClass('open');
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '">' + SITE_TITLE + '</a>');
  const $list = $('#main-navigation ul');

  $list.append('<li><a href="' + ORIGIN + '">Home</a></li>');

  ['People', 'Events', 'Sources', 'Places'].forEach(nav => {
    $list.append('<li>' + localLink(nav.toLowerCase(), nav) + '</li>');
  });
}


function viewPerson() {
  let personId = PATH.replace('person/', '');
  let subPath;

  if (personId.match('/')) {
    subPath = personId.slice(personId.indexOf('/') + 1);
    personId = personId.slice(0, personId.indexOf('/'));
  }

  const person = DATABASE.personRef[personId];

  if (person == null) {
    setPageTitle('Person Not Found');
    rend(`<h1>Person not found: ${personId}</h1>`);
    return;
  }

  showPersonHeader(person);

  if (subPath) {
    rend(
      '<p style="margin-left: 10px; margin-top: 10px;">' +
        linkToPerson(person, false, '&#10229; back to profile') +
      '</p>'
    );

    if (subPath.match('source')) {
      const sourceId = subPath.replace('source/', '');
      return viewPersonSource(person, sourceId);
    }

    return pageNotFound();
  }

  showPersonProfileSummary(person);
  showPersonBiographies(person);
  showPersonFamily(person);
  showPersonDescendants(person);

  rend('<h2>Tree</h2>');
  rend('<div class="person-tree">' + personTree(person) + '</div>');

  if (person.links.length) {
    rend('<h2>Links</h2>');
    person.links.forEach(nextLink => {
      rend(getFancyLink(nextLink));
    });
  }

  showPersonResearchNotes(person);
  showPersonArtifacts(person);
  showPersonTimeline(person);

  if (person.citations.length) {
    rend('<h2>Citations</h2>');
    rend($makeCitationList(person.citations));
  }
}

function showPersonHeader(person) {
  let pageTitle = removeSpecialCharacters(person.name);

  if (person.birth || person.death) {
    pageTitle += ' (' +
      ((person.birth ? person.birth.date.year : ' ') || ' ') + '-' +
      ((person.death ? person.death.date.year : ' ') || ' ') + ')';
  }

  setPageTitle(pageTitle);

  rend(
    '<div class="person-header">' +
      '<img src="' + person.profileImage + '">' +
      '<div class="person-header-content">' +
        '<h1>' +
          fixSpecialCharacters(person.name) +
          (person.star ? '&#160;<img src="images/leaf.png" style="height:40px">' : '') +
        '</h1>' +
        personShowHeaderEvent(person, 'B', person.birth) +
        personShowHeaderEvent(person, 'D', person.death) +
      '</div>' +
    '</div>'
  );

  if (person.private) {
    rend('<p class="person-summary">Some information is hidden to protect the ' +
      'privacy of living people.</p>');
  }
}

function personShowHeaderEvent(person, abbr, event) {
  if (person.private || event === undefined) {
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

function showPersonProfileSummary(person) {
  DATABASE.notations.filter(notation => {
    return notation.title == 'profile summary'
      && notation.people.includes(person);
  }).forEach(notation => {
    notation.text.split('\n').forEach(s => {
      rend('<p style="margin-top: 20px;">' + s + '</p>');
    });
  });
}

function showPersonBiographies(person) {
  const bios = DATABASE.sources.filter(source => {
    return source.people[0] == person && source.tags.biography;
  });

  if (bios.length == 0) {
    return;
  }

  rend('<h2>Biography</h2>');

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
          localLink('person/' + person.customId + '/source/' + source._id, 'continue reading') +
          '</i>' +
        '</p>' +
      '</div>'
    );
  });
}

function showPersonFamily(person) {
  rend('<h2>Family</h2>');

  const isRelative = {};
  const siblings = [...person.siblings];

  person.parents.forEach(rel => isRelative[rel._id] = true);
  person.children.forEach(rel => isRelative[rel._id] = true);

  ['step-parents', 'step-siblings', 'half-siblings', 'siblings', 'step-children']
    .forEach(rel => person[rel] = []);

  siblings.forEach(sibling => {
    if (person.parents.length == 2 && sibling.parents.length == 2
        && person.parents[0] == sibling.parents[0] && person.parents[1] == sibling.parents[1]) {
      person.siblings.push(sibling);
    } else {
      person['half-siblings'].push(sibling);
    }
    isRelative[sibling._id] = true;
  });

  person.parents.forEach(parent => {
    parent.spouses.forEach(parent => {
      if (!isRelative[parent._id]) {
        person['step-parents'].push(parent);
        parent.children.forEach(sibling => {
          if (!isRelative[sibling._id]) {
            person['step-siblings'].push(sibling);
          }
        });
      }
    })
  });

  person.spouses.forEach(spouse => {
    spouse.children.forEach(child => {
      if (!isRelative[child._id]) {
        person['step-children'].push(child);
      }
    });
  });

  ['parents', 'step-parents', 'siblings', 'step-siblings', 'half-siblings', 'spouses',
    'children', 'step-children'].forEach(relationship => {
    if (person[relationship].length == 0) {
      return;
    }

    const $box = $('<div class="person-family">');
    $box.append(`<h3>${relationship}:</h3>`);
    if (relationship == 'siblings' || relationship == 'children') {
      person[relationship].trueSort((a, b) => {
        return a.birthSort < b.birthSort;
      });
    }
    $box.append($makePeopleList(person[relationship], 'photo'));
    rend($box);
  });
}

function showPersonDescendants(person) {
  const addDesc = (person, gen) => {
    descendants[gen] = descendants[gen] || [];
    descendants[gen].push(person);
    person.children.forEach(child => addDesc(child, gen + 1));
  };

  const descendants = [];
  addDesc(person, 0);

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

function personTree(person, safety, n) {
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
    return '<div class="treecell unknown">unknown '
      + ['father', 'mother'][n] + '</div>';
  }

  // Offset the parents array if the mother is included but not the father.
  let p1 = 0, p2 = 1;
  if (person.parents.length == 1
      && person.parents[0].tags.gender == 'female') {
    p1 = null;
    p2 = 0;
  }

  return (
    '<table' + treeStyle + '>' +
      '<tr>' +
        '<td valign="bottom">' +
          personTree(person.parents[p1], safety + 1, 0) +
        '</td>' +
        '<td valign="bottom">' +
          personTree(person.parents[p2], safety + 1, 1) +
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

function showPersonResearchNotes(person) {
  const notations = DATABASE.notations.filter(note => {
    return note.people.includes(person) && note.tags['research notes'];
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

function showPersonArtifacts(person) {
  const stories = DATABASE.stories.filter(story => {
    return story.people.includes(person) && story.type == 'artifact';
  });

  if (stories.length == 0) {
    return;
  }

  h2('Artifacts');

  stories.forEach((story, i) => {
    artifactBlock(story, {
      firstItem: i == 0,
      largeHeader: false,
      people: story.people.filter(p => p != person),
    });
  });
}


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


function viewSearch() {
  setPageTitle('Search Results');

  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  if (keywords.length === 0) {
    rend('<h1>Search Results</h1>');
    return;
  }

  rend('<h1>Search Results for "' + keywords.join(' ') + '"</h1>');
  rend('<p style="padding-top:10px;" id="number-of-search-results"></p>');

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

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
}

class SearchResults {
  constructor(keywords, isTest) {
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
  }

  renderResults() {
    this.title('People');
    rend($makePeopleList(this.resultsList, 'photo', this.keywords));
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
      rend($makeIconLink('places/' + path, text, 'images/map-icon.svg'))
    });
  }
}


class SearchResultsBooks extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    DATABASE.sources.filter(source => source.type == 'book').forEach(source => {
      let searchStringSource = ['title', 'notes', 'summary', 'content']
        .map(attr => source[attr] || '').join(',');

      let searchStringGroup = '';

      if (source.sourceGroup) {
        searchStringGroup = ['group', 'notes', 'summary', 'content']
          .map(attr => source.sourceGroup[attr] || '').join(',');
      } else {
        searchStringSource += source.group;
      }

      const matchSource = this.isMatch(searchStringSource);
      const matchGroup = this.isMatch(searchStringGroup);
      const matchTotal = this.isMatch(searchStringSource + ',' + searchStringGroup);

      // The group is included if any match was found - whether it's the group, the sub-source,
      // or if combined properties are required for a match.
      if (source.sourceGroup && (matchGroup || matchTotal)) {
        this.add(source.sourceGroup);
      }

      // The sub-source is included if it matches on its own OR if the combination is required
      // for a match. The sub-source is excluded if the keywords were only found in the group
      // properties.
      if (matchSource || (matchTotal && !matchGroup)) {
        this.add(source);
      }
    });

    // Add any source groups that don't contain sub-sources.
    DATABASE.sourceGroups.filter(source => source.sourceList.length == 0).forEach(source => {
      let searchString = ['group', 'notes', 'summary', 'content']
        .map(attr => source[attr] || '').join(',');

      if (this.isMatch(searchString)) {
        this.add(source);
      }
    });

    this.resultsList = removeDuplicatesById(this.resultsList);
  }

  sortResults() {
    this.resultsList.trueSort((a, b) => {
      if (a.group != b.group) {
        return a.group < b.group;
      }
      return a.isGroupMain || (a.title < b.title && !b.isGroupMain);
    });
  }

  renderResults() {
    this.title('Books');

    let previousBookGroup = null;
    let justPrintedGroup = false;

    this.resultsList.forEach((source, i) => {
      if (previousBookGroup == source.group && source.sourceGroup) {
        if (justPrintedGroup) {
          rend('<p style="padding: 5px;">Matching chapters/entries:</p>');
          justPrintedGroup = false;
        }

        rend(
          '<ul style="margin-left: 30px;">' +
            '<li style="margin: 5px;">' +
              linkToSource(source, this.highlight(source.title)) +
            '</li>' +
          '</ul>'
        );

        return;
      }

      // Could be a new group section or could be the next item in a group that has no
      // designated "source group".
      if (i > 0 && previousBookGroup != source.group) {
        rend('<hr style="margin: 10px 0">');
      }

      previousBookGroup = source.group;
      justPrintedGroup = true;

      if (source.isGroupMain) {
        rend(
          '<p style="padding: 5px" class="search-result-item">' +
            linkToSourceGroup(source, this.highlight(source.group)) +
          '</p>'
        );

        if (source.summary) {
          rend(
            '<p style="padding: 2px;" class="search-result-item">' +
              '<i>' + source.summary + '</i>' +
            '</p>'
          );
        }

        return;
      }

      let linkText = source.group;

      if (source.title != 'null') {
        linkText += ' - ' + source.title;
      }

      // Stand-alone sources are not chapters under a group.
      rend(
        '<p style="padding: 5px" class="search-result-item">' +
          linkToSource(source, this.highlight(linkText)) +
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
    this.resultsList = DATABASE.events.filter(event => {
      const searchItems = [event.title, event.location.format, event.notes];
      return this.isMatch(searchItems.join(' '));
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Events');

    this.resultsList.forEach(event => {
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
      let linkText = source.group + ' - ' + source.title;
      linkText = this.highlight(linkText, this.keywords);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
    });
  }
}

class SearchResultsCemeteriesOrNewspapers extends SearchResults {
  constructor(keywords, isTest, sourceType, groupTitle, entryTitle, entrySingular) {
    super(keywords, isTest);
    this.sourceType = sourceType;
    this.groupTitle = groupTitle;
    this.entryTitle = entryTitle;
    this.entrySingular = entrySingular;
    this.groupList = [];
    this.groupEntryCount = {};
    this.individualList = [];
    this.getResults();
    this.renderGroupResults();
    this.renderIndividualResults();
  }

  getResults() {
    DATABASE.sources.forEach(source => {
      if (source.type != this.sourceType) {
        return;
      }

      if (this.isMatch(source.group)) {
        if (this.groupEntryCount[source.group]) {
          this.groupEntryCount[source.group] += 1;
        } else {
          this.groupEntryCount[source.group] = 1;
          this.groupList.push(source);
        }
      }

      let searchString = source.title + source.content;

      if (this.isMatch(searchString)) {
        this.individualList.push(source);
      }
    });
  }

  renderGroupResults() {
    if (this.groupList.length == 0) {
      return;
    }

    this.title(this.groupTitle);

    this.groupList.forEach(source => {
      let linkText = this.highlight(source.group);
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToSourceGroup(source, linkText) + '<br>' +
          source.location.format + '<br>' +
          this.groupEntryCount[source.group] + ' ' + this.entrySingular +
          (this.groupEntryCount[source.group] == 1 ? '' : 's') +
        '</p>'
      );
    });
  }

  renderIndividualResults() {
    if (this.individualList.length == 0 ) {
      return;
    }

    this.title(this.entryTitle);

    this.individualList.forEach(source => {
      rend(
        '<p style="padding: 5px 10px" class="search-result-item">' +
          linkToSource(source, this.highlight(source.title)) + '<br>' +
          source.group + '<br>' +
          (source.date.format ? source.date.format + '<br>' : '') +
          (source.location.format ? source.location.format + '<br>' : '') +
        '</p>'
      );

      rend(formatTranscription(this.highlight(source.content)));
    });
  }
}

class SearchResultsCemeteries extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, 'newspaper', 'Newspapers', 'Newspaper Articles', 'article');
  }
}

class SearchResultsNewspapers extends SearchResultsCemeteriesOrNewspapers {
  constructor(keywords, isTest) {
    super(keywords, isTest, 'grave', 'Cemeteries', 'Graves', 'grave');
  }
}

class SearchResultsOtherSources extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.sources.filter(source => {
      let searchString = ['group', 'title', 'content', 'notes', 'summary']
        .map(attr => source[attr] || '').join(',');
      return !['document', 'newspaper', 'book', 'grave'].includes(source.type)
        && this.isMatch(searchString);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('Other Sources');
    this.resultsList.forEach(source => {
      let linkText = source.group + ' - ' + source.title;
      linkText = this.highlight(linkText);
      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );
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
        + linkToStory(story) + '</p>');

      if (story.location.format) {
        rend('<p style="margin: 2px 0 0 15px;" class="search-result-item">'
          + story.location.format + '</p>');
      }
    });
  }
}


function viewArtifactOrLandmark() {
  if (PATH == 'artifacts') {
    return viewArtifactsIndex();
  }
  if (PATH == 'landmarks') {
    return viewLandmarksIndex();
  }

  const [storyType, storyId, extraText] = PATH.split('/');
  const story = DATABASE.storyRef[storyId];

  if (!story || extraText) {
    return pageNotFound();
  }

  if (storyType == 'artifact' || storyType == 'landmark') {
    return viewOneArtifactOrLandmark(storyType, story);
  }

  return pageNotFound();
}

function viewArtifactsIndex() {
  setPageTitle('Artifacts');
  h1('Artifacts and family heirlooms');

  const artifacts = DATABASE.stories.filter(story => {
    return story.type == 'artifact' || story.tags.artifact;
  });

  artifacts.forEach((story, i) => {
    artifactBlock(story, {
      largeHeader: true,
    });
  });
}

function viewLandmarksIndex() {
  setPageTitle('Landmarks');
  h1('Landmarks and buildings');

  const stories = DATABASE.stories.filter(story => {
    return story.type == 'landmark';
  });

  stories.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo'));
  });
}

function viewOneArtifactOrLandmark(storyType, story) {
  headerTrail([storyType]);
  h1(story.title);

  [story.date.format, story.location.format, story.summary].forEach(val => {
    if (val) {
      rend('<p style="margin-top: 20px;">' + val + '</p>');
    }
  });

  if (story.people.length) {
    h2('People');
    rend($makePeopleList(story.people, 'photo'));
  }
}

function artifactBlock(story, specs) {
  const $box = $('<div>');

  if (specs.largeHeader) {
    $box.append('<h2>' + story.title + '</h2>');
  } else {
    $box.css('margin-left', '15px');
    $box.append('<p>' + linkToStory(story) + '</p>');
    if (!specs.firstItem) {
      $box.css('margin-top', '20px');
    }
  }

  if (story.summary) {
    if (specs.largeHeader) {
      $box.append('<p style="margin-left: 10px">' + story.summary + '</p>');
    } else {
      $box.append('<p style="margin-top: 5px">' + story.summary + '</p>');
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

function viewBook() {
  if (PATH == 'books') {
    return viewBooksIndex();
  }

  const storyId = PATH.replace('book/', '');

  const story = DATABASE.storyRef[storyId];

  if (story) {
    return viewOneBook(story);
  }

  return pageNotFound();
}

function viewBooksIndex() {
  headerTrail('sources');
  setPageTitle('Books');
  h1('Books');

  const books = DATABASE.stories.filter(story => story.type == 'book');

  books.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo').css('margin-top', '15px'));

    rend(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  });
}

function viewOneBook(story) {
  headerTrail('sources', 'books');
  setPageTitle(story.title);
  h1(story.title);

  ['date', 'location'].forEach(attr => {
    if (story[attr].format) {
      rend('<p style="padding-top: 10px;">' + story[attr].format + '</p>');
    }
  });

  story.images.forEach((imageUrl, i) => {
    rend(makeImage(story, i, 100, 100).css('margin', '10px 5px 0 5px'));
  });

  rend($makePeopleList(story.people, 'photo').css('margin', '15px 0'));

  if (story.notes) {
    rend('<p>' + story.notes + '</p>');
  }

  story.links.forEach(linkUrl => {
    rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
  });

  story.entries.forEach(showBookEntry);
}

function showBookEntry(source) {
  h2(source.title);

  if (source.date.format) {
    rend('<p style="margin-left: 10px; margin-bottom: 10px;">' +
      source.date.format + '</p>');
  }

  source.images.forEach((imageUrl, i) => {
    rend(makeImage(source, i, 100, 100).css('margin', '0 5px'));
  });

  rend($makePeopleList(source.people, 'photo'));

  if (source.notes) {
    rend('<p>' + source.notes + '</p>');
  }

  source.links.forEach(linkUrl => {
    rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
  });

  if (source.content) {
    rend(formatTranscription(source.content));
  } else if (source.type == 'newspaper') {
    rend('<p style="margin: 10px"><i>Transcription not available.</i></p>');
  }
}


function viewCemeteriesOrNewspapers() {
  if (PATH == 'cemeteries') {
    return viewCemeteriesNewspapersIndex('Cemeteries', 'cemetery', 'grave');
  }

  if (PATH.match('cemetery')) {
    return viewCemeteryOrNewspaper('cemetery');
  }

  if (PATH == 'newspapers') {
    return viewCemeteriesNewspapersIndex('Newspapers', 'newspaper', 'article');
  }

  if (PATH.match('newspaper')) {
    return viewCemeteryOrNewspaper('newspaper');
  }

  return pageNotFound();
}

function viewCemeteriesNewspapersIndex(title, storyType, entryName) {
  const [placeList, storiesByPlace] = getStoriesByPlace(storyType);

  headerTrail('sources');
  setPageTitle(title);
  h1(title);

  placeList.forEach(place => {
    h2(place);
    storiesByPlace[place].forEach(story => {
      let numEntries;

      if (storyType == 'cemetery') {
        numEntries = getNumberOfGravesInCemetery(story);
      } else {
        numEntries = story.entries.length;
      }

      rend(
        '<p style="padding: 15px 0 0 5px;">' +
          localLink(storyType + '/' + story._id, story.title) +
          (story.location.format ? '<br>' : '') + story.location.format +
          '<br>' + numEntries + ' ' + pluralize(entryName, numEntries) +
        '</p>'
      );
    });
  });
}

function getStoriesByPlace(storyType) {
  const placeList = [];
  const storiesByPlace = { Other: [] };
  const stories = DATABASE.stories.filter(s => s.type == storyType);

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

function viewCemeteryOrNewspaper(storyType) {
  const storyId = PATH.replace(storyType + '/', '');
  const story = DATABASE.storyRef[storyId];

  if (!story) {
    return pageNotFound();
  }

  if (storyType == 'newspaper') {
    story.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
  }

  headerTrail('sources', pluralize(storyType));
  setPageTitle(story.title);
  h1(story.title);

  rend('<p style="padding-top: 10px;">' + story.location.format + '</p>');

  rend($makePeopleList(story.people, 'photo'));

  if (story.notes) {
    rend('<p>' + story.notes + '</p>');
  }

  if (story.images.length) {
    h2('Images');
    story.images.forEach((imageUrl, i) => {
      rend(makeImage(story, i, 100, 100).css('margin', '10px 5px 0 5px'));
    });
  }

  if (story.links.length) {
    h2('Links');
    story.links.forEach(linkUrl => {
      rend($(getFancyLink(linkUrl)).css('margin-left', '10px'));
    });
  }

  if (storyType == 'cemetery') {
    story.entries.trueSort((a, b) => a.title < b.title);
    h2('Graves');
    showListOfGraves(story.entries)
  } else {
    story.entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    h2('Articles');
    showListOfArticles(story.entries);
  }
}

function getNumberOfGravesInCemetery(story) {
  let count = 0;

  story.entries.forEach(source => {
    count += source.people.length || 1;
  });

  return count;
}

function showListOfGraves(sources) {
  sources.forEach((source, i) => {
    const $box = $('<div style="margin: 20px 10px;">');

    $box.append('<p>' + linkToSource(source) + '</p>');

    if (source.summary) {
      $box.append('<p style="margin-top: 5px">' + source.summary + '</p>');
    }

    rend($box);
  });
}

function showListOfArticles(sources) {
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
    return viewOneSource();
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
    source.images.forEach((img, i) => {
      rend(makeImage(source, i, 200).css('margin-right', '5px'));
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


function viewOneSource() {
  const sourceId = PATH.replace('source/', '');

  const source = DATABASE.sources.filter(source => source._id == sourceId)[0];

  if (!source) {
    rend('<h1>Source not found</h1>');
    return;
  }

  if (source.type == 'grave') {
    viewSourceGrave(source);
  } else {
    viewSourceOther(source);
  }

  rend('<h2>People</h2>');
  rend($makePeopleList(source.people, 'photo'));

  viewSourceNotes(source);
  viewSourceLinks(source);

  if (['newspaper', 'grave'].includes(source.type)) {
    viewSourceStoryEntryList(source);
  }
}

function viewSourceGrave(source) {
  const story = source.story;

  setPageTitle(story.title);

  headerTrail('sources', 'cemeteries',
    ['cemetery/' + story._id, story.title]);

  rend('<p>' + story.location.format + '</p>');
  rend('<p><br></p>');
  h1(source.title);

  viewSourceSummary(source);

  if (source.images.length) {
    rend('<h2>Images</h2>');
    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 200).css('margin-right', '5px'));
    });
  }
}

function viewSourceOther(source) {
  const story = source.story;

  setPageTitle('Source');

  if (source.type == 'newspaper') {
    headerTrail('sources', 'newspapers',
      story ? ['newspaper/' + story._id, story.title] : null);
  }

  rend('<h1>Source</h1>');
  rend('<p>' + source.type + '</p>');
  rend('<p>' + source.group + '</p>');
  rend('<p>' + source.title + '</p>');
  rend('<p>' + formatDate(source.date) + '</p>');
  rend('<p>' + formatLocation(source.location) + '</p>');

  viewSourceSummary(source);

  if (source.images.length) {
    rend('<h2>Images</h2>');

    if (source.tags.cropped) {
      rend('<p style="margin-bottom:10px">The image is cropped to show the most relevent ' +
        'portion. See the "links" section below to see the full image.</p>');
    }

    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i).css('margin-right', '5px'));
    });
  }

  if (source.content) {
    rend('<h2>Transcription</h2>');
    rend(formatTranscription(source.content));
  }
}

function viewSourceSummary(source) {
  if (source.summary) {
    rend('<h2>Summary</h2>');
    rend(source.summary.split('\n').map(text => '<p>' + text + '</p>').join(''));
  }
}

function viewSourceNotes(source) {
  if (source.notes) {
    rend('<h2>Notes</h2>');
    rend('<ul class="bullet"><li>' + source.notes.split('\n').join('</li><li>') + '</li></ul>');
  }
}

function viewSourceLinks(source) {
  if (source.links.length) {
    rend('<h2>Links</h2>');
    rend(source.links.map(getFancyLink));
  }
}

function viewSourceStoryEntryList(source) {
  const story = source.story;

  if (!story) {
    return;
  }

  const entries = story.entries.filter(s => s != source);

  if (entries.length == 0) {
    return;
  }

  h2('More from ' + story.title);

  if (source.type == 'grave') {
    entries.trueSort((a, b) => a.title < b.title);
    showListOfGraves(entries)
  } else {
    entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    showListOfArticles(entries);
  }
}

function viewTopic() {
  const topic = PATH.replace('topic/', '');

  if (topic == 'military') {
    return viewTopicMilitary();
  }

  if (topic == 'immigration') {
    return viewTopicImmigration();
  }

  if (topic == 'disease') {
    return viewTopicDisease();
  }

  if (topic == 'brickwalls') {
    return viewTopicBrickwalls();
  }

  return pageNotFound();
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
    rend($notationBlock(notation, true));
  });
}

function viewTopicDisease() {
  const people = DATABASE.people.filter(person => person.tags['died of disease']);

  const events = DATABASE.events.filter(event => {
    if (event.title.match('illness')) {
      return true;
    }
    if (event.title == 'death' && people.map(person => person._id).includes(event.people[0]._id)) {
      return true;
    }
    return false;
  });

  events.trueSort((a, b) => a.date.sort < b.date.sort);

  setPageTitle('Disease');
  h1('Disease');

  h2('People that died of disease');
  rend($makePeopleList(people, 'photo'));

  h2('Events');
  events.forEach(event => {
    rend(eventBlock(event));
  });
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
  const wwii = veterans.filter(person => person.tags.war == 'WWII');
  const wwi = veterans.filter(person => person.tags.war == 'WWI');
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

  h2('World War II veterans');
  rend($makePeopleList(wwii, 'photo'));

  if (wwi.length) {
    h2('World War I veterans');
    rend($makePeopleList(wwi, 'photo'));
  }

  if (otherVeterans.length) {
    h2('Other wars');
    rend($makePeopleList(otherVeterans, 'photo'));
  }

  h2('People who died at war');
  rend($makePeopleList(diedAtWar, 'photo'));

  h2('Timeline');
  militaryTimeline.renderTimeline();
}
