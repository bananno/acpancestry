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
