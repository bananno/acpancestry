class ViewTopicImmigration extends ViewStoryTopic {
  static homePageSummary() {
    return (
      'People in the Family Tree immigrated to the United States from ' +
      DATABASE.countryList.length + ' different countries. See a list ' +
      'of immigrants by county and a timeline of events.'
    );
  }

  constructor(story) {
    super(story);
  }

  render() {
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

    if (ENV == 'dev') {
      pg(localLink('audit/immigration', 'immigration audit page'))
        .css('margin', '20px 10px');
    }

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
}
