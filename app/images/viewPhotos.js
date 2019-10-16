class ViewPhotos extends ViewPage {
  static byUrl() {
    if (PATH == 'photos') {
      new ViewPhotos().render();
      return true;
    }
    return false;
  }

  constructor() {
    super();
    this.makeList();
  }

  makeList() {
    this.list = DATABASE.images.filter(image => image.tags.gallery);
  }

  render() {
    setPageTitle('Photos');
    h1('Photos');
    this.list.forEach(image => {
      const $link = Image.asLink(image, 200, 300);
      $link.find('img')
        .prop('title', image.item.title)
        .css('margin', '5px');
      rend($link);
    });
  }
}
