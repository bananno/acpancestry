
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

  bornThisYear.trueSort((a, b) => a.birthSort < b.birthSort);
  aliveThisYear.trueSort((a, b) => a.birthSort < b.birthSort);

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
