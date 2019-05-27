
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

    const methods = {
      setTitle: this.displayOnPage ? this.setTitle : (() => {}),
      stubDatabase: this.stubDatabase.bind(this),
      assertEqual: this.assertEqual.bind(this),
    };

    testList.forEach(callback => {
      this.clearDatabase();
      callback(methods);
    });

    this.restoreVariables();

    if (this.testsFailing) {
      console.warn(this.testsFailing + ' test' + (this.testsFailing > 1 ? 's' : '') + ' failing');
    }

    console.log(this.testsPassing + ' tests passing.');
  }

  clearDatabase() {
    DATABASE.people = [];
    DATABASE.sources = [];
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
  }

  setTitle(str) {
    rend('<h2> ' + str + '</h2>');
  }

  assertEqual(subtitle, expectedValue, actualValue) {
    const pass = areValuesEqual(expectedValue, actualValue);

    if (pass) {
      this.testsPassing += 1;
    } else {
      this.testsFailing += 1;
    }

    if (this.displayOnPage) {
      rend('<p class="unit-test test-passing-' + pass + '"> ' + subtitle + '</p>');
    }
  }
}

function areValuesEqual(val1, valu2) {
  return val1 === valu2;
}
