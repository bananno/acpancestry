
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

    const methods = {
      title: this.setTitle,
      stub: this.stubDatabase,
      assertEqual: this.assertEqual,
    };

    testList.forEach(callback => {
      this.clearDatabase();
      callback(methods);
    });

    this.restoreVariables();
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
    rend('<h2 style="color:red">[title] ' + str + '</h2>');
  }

  assertEqual(subtitle, expectedValue, actualValue) {
    rend('<p style="color:blue">[test] ' + subtitle + '</p>')
  }
}
