class Image {
  static find(image) {
    if (image._id) {
      return image;
    }
    return DATABASE.imageRef[image];
  }

  static make(image, maxHeight, maxWidth) {
    image = Image.find(image);

    const linkAddress = 'image/' + image._id;

    const $imageViewer = $(
      '<div class="image-viewer">' +
        localLink(linkAddress, '<img src="' + image.url + '">click to enlarge', true) +
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

  static asLink(image, maxHeight, maxWidth) {
    image = Image.find(image);

    const linkAddress = 'image/' + image._id;

    const img = '<img src="' + image.url + '">';

    const $link = $(image.story ? linkToStory(image.item, img)
      : linkToSource(image.item, img));

    if (maxHeight) {
      $link.find('img').css('max-height', maxHeight + 'px');
    }

    if (maxWidth) {
      $link.find('img').css('max-width', maxWidth + 'px');
    } else {
      $link.find('img').css('max-width', '100%');
    }

    return $link;
  }
}

class ViewImage extends ViewPage {
  static byUrl() {
    const imageId = PATH.replace('image/', '');
    const image = Image.find(imageId);

    if (!image) {
      return false;
    }

    setPageTitle('Image');

    $('body').html('');

    $('body').css({
      'background': 'none',
      'background-color': 'black',
      'margin': '10px',
    });

    const $image = $('<img>')
      .prop('src', image.url)
      .addClass('full-screen-image pre-zoom')
      .appendTo('body')
      .click(() => {
        if ($image.hasClass('pre-zoom')) {
          $image.removeClass('pre-zoom');
        } else {
          $image.addClass('pre-zoom');
        }
      });

    return true;
  }
}
