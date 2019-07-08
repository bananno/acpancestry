
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
