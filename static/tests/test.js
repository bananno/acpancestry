
function runTests() {
  if (ENV == 'dev') {
    new RunTests();
  }
}

class RunTests {
  constructor() {
    this.realDatabase = {...DATABASE};
    this.stubDatabase();
    this.restoreVariables();
  }

  stubDatabase() {
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
}
