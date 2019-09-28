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
