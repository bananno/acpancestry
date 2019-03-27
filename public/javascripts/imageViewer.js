
function makeImage(url, maxHeight, maxWidth) {
  const $div = $('<div class="image-thumbnail">');

  $div.append('<img src="' + url + '">');

  if (maxHeight) {
    $div.find('img').css('max-height', maxHeight + 'px');
  }

  if (maxWidth) {
    $div.find('img').css('max-width', maxWidth + 'px');
  }

  $div.append('click to enlarge');

  return $div;
}
