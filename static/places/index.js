
function viewPlaces() {
  const places = getPlacesList();

  if (places.length == 0) {
    return viewPlacesIndex();
  }

  if (places[0] == 'USA') {
    places[0] = 'United States';
  }

  if (places.length == 1) {
    setPageTitle(places[0]);
    rend('<p class="header-trail">' + localLink('places', 'Places') + '</p>');
    rend('<h1>' + places[0] + '</h1>');
    return viewPlacesByCountry(places[0]);
  }

  if (places.length == 2) {
    rend(
      '<p class="header-trail">' +
        localLink('places', 'Places') +
        ' &#8594; ' +
        localLink('places/' + places[0], places[0]) +
      '</p>'
    );
  }

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
  listByCountry['none'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    let country = item.location.country;

    if (country) {
      if (!listByCountry[country]) {
        countryList.push(country);
        listByCountry[country] = [];
      }
    } else {
      country = 'none';
    }

    listByCountry[country].push(item);
  });

  countryList.sort((a, b) => {
    let diff = listByCountry[b].length - listByCountry[a].length;
    return diff == 0 ? (a < b ? -1 : 1) : diff;
  });

  [...countryList, 'none'].forEach(country => {
    let [linkPath, linkText] = [country, country];

    if (country == 'United States') {
      linkPath = 'USA';
    } else if (country == 'none') {
      linkText = 'Country not specified';
    }

    linkPath = linkPath.replace(/ /g, '+');

    rend(
      '<p>' +
        localLink('places/' + linkPath, linkText) +
        ' (' + listByCountry[country].length + ')' +
      '</p>'
    );
  });
}

function viewPlacesByCountry(country) {
  const region1List = [];
  const listByRegion = {};
  listByRegion['Not Specified'] = [];

  [...DATABASE.events, ...DATABASE.sources].forEach(item => {
    if (item.location.country != country) {
      return;
    }

    let region = item.location.region1;

    if (region) {
      if (!listByRegion[region]) {
        region1List.push(region);
        listByRegion[region] = [];
      }
    } else {
      region = 'Not Specified';
    }

    listByRegion[region].push(item);
  });

  region1List.sort((a, b) => {
    return a < b ? -1 : 1;
  });

  [...region1List, 'Not Specified'].forEach(region => {
    let regionPath = region;
    let regionText = region;

    if (regionPath == 'Not Specified') {
      regionPath = 'State not specified';
    } if (country == 'United States') {
      regionText = USA_STATES[regionPath || ''] || regionPath;
    }

    let path = (country + '/' + regionPath).replace(/ /g, '+');

    rend(
      '<p>' +
        localLink('places/' + path, regionText) +
        ' (' + listByRegion[region].length + ')' +
      '</p>'
    );
  });
}
