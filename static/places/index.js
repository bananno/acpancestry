
function viewPlaces() {
  const places = getPlacesList();

  if (places.length == 0) {
    return viewPlacesIndex();
  }

  rend('<p>' + localLink('places', 'Places') + '</p>');

  places.forEach(place => {
    rend('<p>' + place  + '</p>');
  });
}

function getPlacesList() {
  if (PATH == 'places') {
    return [];
  }

  return PATH.replace('places/', '').replace(/\+/g, ' ').split('/');
}

function viewPlacesIndex() {
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
    let path = country.replace(/ /g, '+');
    rend(
      '<p>' +
        localLink('places/' + path, country) +
        ' (' + listByCountry[country].length + ')' +
      '</p>'
    );
  });
}
