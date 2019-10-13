
const testList = [];

function test(callback) {
  testList.push(callback);
}

function runTests() {
  if (ENV == 'dev') {
    new RunTests();
  }
}

class RunTests {
  constructor() {
    this.realDatabase = {...DATABASE};
    this.testsPassing = 0;
    this.testsFailing = 0;
    this.displayOnPage = PATH == 'test';
    this.currentTitle = null;

    if (this.displayOnPage) {
      h2('Check pages');

      this.setTitle2('person profile');
      [
        'anthony-hroch',
        'hans-johansen',
        'peter-winblad',
        'william-winblad',
      ].forEach(personId => {
        const person = DATABASE.personRef[personId];
        if (person) {
          this.listLink('person/' + personId + '/test', person.name);
        } else {
          console.error('Tests - person not found: ' + personId);
        }
      });

      this.setTitle2('search results');
      [
        'clifton',
        'marriage',
      ].forEach(str => {
        this.listLink('search=' + str, str);
      });

      this.setTitle2('other');
      this.listLink('about/person-profile', 'About person profile');
    }

    const methods = {
      setTitle: this.displayOnPage ? this.setTitle : (() => {}),
      setTitle2: this.displayOnPage ? this.setTitle2 : (() => {}),
      stubDatabase: this.stubDatabase.bind(this),
      assertEqual: this.assertEqual.bind(this),
      assertArrayEqualById: this.assertArrayEqualById.bind(this),
      assertTrue: this.assertTrue.bind(this),
      assertFalse: this.assertFalse.bind(this),
      assertArrayContains: this.assertArrayContains.bind(this),
      fakePerson: this.fakePerson,
      fakeEvent: this.fakeEvent,
      fakeStory: this.fakeStory,
      fakeSource: this.fakeSource,
    };

    testList.forEach(callback => {
      this.clearDatabase();
      callback(methods);
    });

    this.restoreVariables();

    let percentage = 100;

    if (this.testsFailing) {
      console.warn(this.testsFailing + ' test' + (this.testsFailing > 1 ? 's' : '') + ' failing');
      percentage = Math.round(this.testsPassing / (this.testsFailing + this.testsPassing) * 100);
    }

    console.log(this.testsPassing + ' tests passing (' + percentage + '%)');
  }

  clearDatabase() {
    DATABASE.people = [];
    DATABASE.sources = [];
    DATABASE.stories = [];
    DATABASE.events = [];
    DATABASE.notations = [];
    DATABASE.citations = [];
    DATABASE.personRef = {};
    DATABASE.sourceRef = {};
    DATABASE.storyRef = {};
  }

  restoreVariables() {
    for (let db in DATABASE) {
      DATABASE[db] = this.realDatabase[db];
    }
  }

  stubDatabase() {
    DATABASE.people.forEach(person => {
      ['parents', 'spouses', 'children'].forEach(relationship => {
        person[relationship] = person[relationship] || [];
      });
    });

    DATABASE.sources.forEach(source => {
      source.people = source.people || [];
    });

    DATABASE.events.forEach(event => {
      event.people = event.people || [];
    });

    processDatabase();
  }

  setTitle(str) {
    if (str != this.currentTitle) {
      h2(str);
      this.currentTitle = str;
    }
  }

  setTitle2(str) {
    pg('<b>' + str + '</b>').css('margin', '5px');
  }

  addAssertion(subtitle, pass) {
    if (pass) {
      this.testsPassing += 1;
    } else {
      this.testsFailing += 1;
    }

    if (this.displayOnPage) {
      rend('<ul><li class="unit-tests test-passing-' + pass + '">'
        + subtitle + '</li></ul>');
    }
  }

  listLink(path, text) {
    rend('<ul><li class="unit-tests">' + localLink(path, text) + '</li></ul>');
  }

  assertArrayEqualById(subtitle, expectedValue, actualValue) {
    this.addAssertion(subtitle, expectedValue.length == actualValue.length
      && expectedValue.map(v => v._id).join(',') == actualValue.map(v => v._id).join(','));
  }

  assertEqual(subtitle, expectedValue, actualValue) {
    this.addAssertion(subtitle, areValuesEqual(expectedValue, actualValue));
  }

  assertTrue(subtitle, actualValue) {
    this.addAssertion(subtitle, areValuesEqual(true, actualValue));
  }

  assertFalse(subtitle, actualValue) {
    this.addAssertion(subtitle, areValuesEqual(false, actualValue));
  }

  assertArrayContains(subtitle, array, expectedValue) {
    this.addAssertion(subtitle, array.some(value => {
      return areValuesEqual(value, expectedValue);
    }));
  }

  fakePerson(person = {}) {
    person._id = person._id || makeRandomId();
    person.name = person.name || 'Test Person ' + person._id;

    ['parents', 'spouses', 'children'].forEach(relationship => {
      person[relationship] = person[relationship] || [];
    });

    person.tags = person.tags || {};

    DATABASE.people.push(person);
    return person;
  }

  fakeEvent(event = {}) {
    event._id = event._id || makeRandomId();
    event.people = event.people || [];
    event.tags = event.tags || [];

    DATABASE.events.push(event);
    return event;
  }

  fakeStory(story = {}) {
    story._id = story._id || makeRandomId();
    story.title = story.title || 'story-' + story._id;
    story.people = story.people || [];
    story.images = story.images || [];

    DATABASE.stories.push(story);
    return story;
  }

  fakeSource(source = {}) {
    source._id = source._id || makeRandomId();

    ['people', 'stories', 'tags', 'images'].forEach(attr => {
      source[attr] = source[attr] || [];
    });

    DATABASE.sources.push(source);
    return source;
  }
}

function makeRandomId() {
  return ('' + Math.random()).slice(2, 6);
}

function areValuesEqual(val1, val2) {
  if (val1 === val2) {
    return true;
  }

  if (typeof val1 !== 'object' || typeof val2 !== 'object'
      || Object.keys(val1).length != Object.keys(val2).length) {
    return false;
  }

  for (let key in val1) {
    if (!areValuesEqual(val1[key], val2[key])) {
      return false;
    }
  }

  return true;
}
