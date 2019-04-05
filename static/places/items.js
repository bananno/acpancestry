
function viewPlacesItemList(items) {
  items.forEach(item => {
    rend('<p>' + item.title + '</p>');
  });
}
