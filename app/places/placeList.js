
function viewPlacesIndex(placePath, placeList) {
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
