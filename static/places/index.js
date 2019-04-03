
function viewPlaces() {
  setPageTitle('Places');
  rend('<h1>Places</h1>');

  const countryList = [];
  const listByCountry = {};
  listByCountry['Not Specified'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    let country = item.location.country;

    if (country) {
      if (!listByCountry[country]) {
        countryList.push(country);
        listByCountry[country] = [];
      }
    } else {
      country = 'Not Specified';
    }

    listByCountry[country].push(item);
  });

  countryList.forEach(country => {
    rend('<p>' + country + ' (' + listByCountry[country].length + ')</p>');
  });
}
