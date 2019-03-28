
function makeImage(url, maxHeight, maxWidth) {
  const $imageViewer = $(
    '<div class="image-viewer">' +
      '<a href="' + url + '" target=_"blank"><img src="' + url + '">click to enlarge</a>' +
    '</div>'
  );

  if (maxHeight) {
    $imageViewer.find('img').css('max-height', maxHeight + 'px');
  }

  if (maxWidth) {
    $imageViewer.find('img').css('max-width', maxWidth + 'px');
  } else {
    $imageViewer.find('img').css('max-width', '100%');
  }

  return $imageViewer;
}
