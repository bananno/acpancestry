
function viewPlaces() {
  const placePath = getPathPlaces();

  const [placeList, items] = getItemsByPlace(placePath);

  showPageTitleAndHeader(placePath);

  if (items.length == 0) {
    rend('<p style="margin-top: 10px;">There is no information available for this place.</p>');
  } else if (placePath.length == 4) {
    viewPlacesItemList(items);
  } else {
    viewPlacesIndex(placePath, placeList);
  }
}

function getPathPlaces() {
  if (PATH == 'places') {
    return [];
  }

  let places = PATH.replace('places/', '').split('/').map(place => {
    let placeFix = place.replace(/\%20/g, ' ').replace(/\+/g, ' ');
    return {
      path: place,
      true: placeFix,
      text: placeFix,
    };
  });

  if (places.length == 0) {
    return [];
  }

  if (places[0].text == 'United States' || places[0].text == 'USA') {
    places[0].path = 'USA';
    places[0].text = 'United States';
    places[0].true = 'United States';

    if (places.length > 1) {
      if (USA_STATES[places[1].text]) {
        places[1].text = USA_STATES[places[1].text];
      }
    }
  }

  return places;
}

function getItemsByPlace(placePath) {
  const placeLevels = ['country', 'region1', 'region2', 'city'];
  const placeList = [];
  const foundPlaceAlready = [];
  const mostSpecificLevel = placeLevels[placePath.length];

  const items = [...DATABASE.events, ...DATABASE.sources].filter((item, t) => {
    for (let i = 0; i < placePath.length; i++) {
      if (item.location[placeLevels[i]] != placePath[i].true) {
        return false;
      }
    }

    if (placePath.length == 4) {
      return true;
    }

    const itemPlace = item.location[mostSpecificLevel];

    if (!foundPlaceAlready[itemPlace]) {
      placeList.push(itemPlace);
      foundPlaceAlready[itemPlace] = true;
    }

    return true;
  });

  return [placeList, items];
}

function showPageTitleAndHeader(placePath) {
  if (placePath.length == 0) {
    setPageTitle('Places');
    rend('<h1>Places</h1>');
    return;
  }

  let mostSpecificPlace = placePath[placePath.length - 1].text;

  setPageTitle(mostSpecificPlace);

  let tempPath = 'places';
  let links = [localLink('places', 'Places')];

  for (let i = 0; i < placePath.length - 1; i++) {
    tempPath += '/' + placePath[i].path;
    links.push(localLink(tempPath, placePath[i].text));
  }

  rend('<p class="header-trail">' + links.join(' &#8594; ') + '</p>');

  rend('<h1>' + mostSpecificPlace + '</h1>');
}

function viewPlacesIndex(placePath, placeList) {
  let path = 'places/';
  placeList.forEach(place => {
    rend('<p>' + localLink(path + place, place) + '</p>');
  });
}

function viewPlacesItemList(items) {
  items.forEach(item => {
    rend('<p>' + item.title + '</p>');
  });
}
