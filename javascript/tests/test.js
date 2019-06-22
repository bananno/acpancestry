
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

    const methods = {
      setTitle: this.displayOnPage ? this.setTitle : (() => {}),
      setTitle2: this.displayOnPage ? this.setTitle2 : (() => {}),
      stubDatabase: this.stubDatabase.bind(this),
      assertEqual: this.assertEqual.bind(this),
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
    DATABASE.sourceGroups = [];
    DATABASE.events = [];
    DATABASE.citations = [];
    DATABASE.personRef = {};
    DATABASE.sourceRef = {};
  }

  restoreVariables() {
    for (let db in DATABASE) {
      DATABASE[db] = this.realDatabase[db];
    }
  }

  stubDatabase() {
    DATABASE.sources.forEach(source => {
      source.people = source.people || [];
    });
    processDatabase();
  }

  setTitle(str) {
    if (str != this.currentTitle) {
      rend('<h2>' + str + '</h2>');
      this.currentTitle = str;
    }
  }

  setTitle2(str) {
    rend('<p><b>' + str + '</b></h2>');
  }

  assertEqual(subtitle, expectedValue, actualValue) {
    const pass = areValuesEqual(expectedValue, actualValue);

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
