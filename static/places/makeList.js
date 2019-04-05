
const placeLevels = ['country', 'region1', 'region2', 'city'];

function getItemsByPlace(placePath) {
  const placeList = [];
  const foundPlaceAlready = [];
  const mostSpecificLevel = placeLevels[placePath.length];

  const listOfItemsOnly = mostSpecificLevel == 'city'
    || (placePath.length && placePath[placePath.length - 1].path == 'all');

  const items = [...DATABASE.events, ...DATABASE.sources].filter((item, t) => {
    if (!placeMatch(item.location, placePath)) {
      return false;
    }

    if (listOfItemsOnly) {
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

function placeMatch(itemLocation, placePath) {
  for (let i = 0; i < placePath.length; i++) {
    let levelName = placeLevels[i];
    let itemPlace = itemLocation[levelName];
    let placeName = placePath[i].true;

    if (placeName == 'other') {
      if (itemPlace == null || itemPlace == '') {
        continue;
      }
    }

    if (placeName == 'all') {
      return true;
    }

    if (itemPlace == placeName) {
      continue;
    }

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

  if (placeList.length && placeList[placeList.length - 1].text == 'other') {
    placeList[placeList.length - 1].text = otherText;
  }

  return placeList;
}
