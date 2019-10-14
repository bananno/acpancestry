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
    console.log('make list')
    this.list = DATABASE.images.filter(image => image.tags.gallery);
  }

  render() {
    setPageTitle('Photos');
    h1('Photos');
    this.list.forEach(image => {
      const img = '<img src="' + image.url +
        '" style="max-height: 200px; max-width: 300px; margin: 5px;" title="' +
        image.item.title + '">';

      if (image.story) {
        rend(linkToStory(image.item, img));
      } else {
        rend(linkToSource(image.item, img));
      }
    });
  }
}
