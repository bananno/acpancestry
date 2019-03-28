
function makeImage(url, maxHeight, maxWidth) {
  const $imageViewer = $('<div class="image-viewer">');

  const $thumbnail = $('<div class="image-thumbnail">').appendTo($imageViewer);
  const $popup = $('<div class="image-popup">').appendTo($imageViewer);
  const $inset = $('<div class="image-inset">').appendTo($popup);

  $thumbnail.append('<img src="' + url + '">');
  $thumbnail.append('click to enlarge');

  $inset.append('<div>Close</div>');
  $inset.append('<img src="' + url + '">');

  if (maxHeight) {
    $thumbnail.find('img').css('max-height', maxHeight + 'px');
  }

  if (maxWidth) {
    $thumbnail.find('img').css('max-width', maxWidth + 'px');
  }

  $thumbnail.click(() => {
    $popup.show();
  });

  $popup.click(() => {
    $popup.hide();
  });

  $popup.find('div').click(() => {
    $popup.hide();
  });

  return $imageViewer;
}
