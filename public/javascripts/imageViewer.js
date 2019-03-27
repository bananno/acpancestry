
function makeImage(url, maxHeight, maxWidth) {
  const $div = $('<div class="image-thumbnail">');

  $div.append('<img src="' + url + '">');

  $div.append('click to enlarge');

  return $div;
}
