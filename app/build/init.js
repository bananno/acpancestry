$(document).ready(() => {
  setupLayout();
  setPageTitle();
  processDatabase();
  runTests();

  $(document).on('click', '.local-link', clickLocalLink);

  getRoute();
});

function runTests() {} // overwritten in dev version
