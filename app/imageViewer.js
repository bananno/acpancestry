
function makeImage(source, imageNumber, maxHeight, maxWidth) {
  const imageAddress = source.images[imageNumber];
  const linkAddress = 'image/' + source._id + '/' + imageNumber;

  const $imageViewer = $(
    '<div class="image-viewer">' +
      localLink(linkAddress, '<img src="' + imageAddress + '">click to enlarge', true) +
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

function viewImage() {
  const [sourceId, imageNumber] = PATH.replace('image/', '').split('/');

  setPageTitle('Image');

  $('body').html('');

  $('body').css({
    'background': 'none',
    'background-color': 'black',
    'margin': '10px',
  });

  const $image = $('<img>')
    .prop('src', DATABASE.sourceRef[sourceId].images[imageNumber])
    .addClass('full-screen-image pre-zoom')
    .appendTo('body')
    .click(() => {
      if ($image.hasClass('pre-zoom')) {
        $image.removeClass('pre-zoom');
      } else {
        $image.addClass('pre-zoom');
      }
    });
}
