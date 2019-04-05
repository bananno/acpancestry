
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
      if (!placeMatch(item.location[placeLevels[i]], placePath[i].true)) {
        return false;
      }
    }

    if (placePath.length == 4) {
      return true;
    }

    const itemPlace = item.location[mostSpecificLevel] || 'other';

    if (!foundPlaceAlready[itemPlace]) {
      placeList.push({
        path: itemPlace,
        text: itemPlace,
      });
      foundPlaceAlready[itemPlace] = true;
    }

    return true;
  });

  return [placeList, items];
}

function placeMatch(itemPlace, compareStr) {
  if (compareStr == 'other') {
    return itemPlace == null || itemPlace == '';
  }
  return itemPlace == compareStr;
}

function showPageTitleAndHeader(placePath) {
  if (placePath.length == 0) {
    setPageTitle('Places');
    rend('<h1>Places</h1>');
    return;
  }

  let mostSpecificPlace = placePath[placePath.length - 1].text;
  let showAll = false;

  if (mostSpecificPlace == 'all') {
    mostSpecificPlace = placePath[placePath.length - 2].text;
    showAll = true;
  }

  setPageTitle(mostSpecificPlace);

  let tempPath = 'places';
  let links = [localLink('places', 'Places')];

  for (let i = 0; i < placePath.length - 1; i++) {
    tempPath += '/' + placePath[i].path;
    links.push(localLink(tempPath, placePath[i].text));
  }

  rend('<p class="header-trail">' + links.join(' &#8594; ') + '</p>');

  rend('<h1>' + mostSpecificPlace + (showAll ? ' - all' : '') + '</h1>');
}

function viewPlacesIndex(placePath, placeList) {
  placeList = editPlaceNames(placePath, placeList);

  let path = ['places', ...(placePath.map(place => place.path))].join('/') + '/';

  if (placeListShouldAllowViewAll(placePath)) {
    rend(
      '<p style="padding-top: 5px;">' +
        localLink(path + 'all', 'view all') +
      '</p>'
    );
  }

  placeList.forEach(place => {
    rend(
      '<p style="padding-top: 5px;">' +
        localLink(path + place.path, place.text) +
      '</p>'
    );
  });
}

function placeListShouldAllowViewAll(placePath) {
  if (placePath.length == 0) {
    return false;
  }
  if (placePath.length == 1 && placePath[0].path == 'USA') {
    return false;
  }
  return true;
}

function editPlaceNames(placePath, placeList) {
  let otherText = 'other';

  if (placePath.length == 0) {
    otherText = 'location not specified';
    placeList = placeList.map(place => {
      if (place.path == 'United States') {
        place.path = 'USA';
      }
      return place;
    });
  } else if (placePath.length == 1 && placePath[0].path == 'USA') {
    otherText = 'state not specified';
    placeList = placeList.map(place => {
      place.text = USA_STATES[place.text] || 'other';
      return place;
    });
  } else if (placePath.length == 2 && placePath[0].path == 'USA') {
    otherText = 'county not specified';
  }

  placeList.sort((a, b) => {
    let [str1, str2] = [b.text.toLowerCase(), a.text.toLowerCase()];
    const swap = (str1 > str2 || str1 == 'other') && str2 != 'other';
    return swap ? -1 : 1;
  });

  if (placeList[placeList.length - 1].text == 'other') {
    placeList[placeList.length - 1].text = otherText;
  }

  return placeList;
}
