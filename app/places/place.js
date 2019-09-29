class Place {
  static getLinkPath(place) {
    let parts = ['places'];

    if (place.country == 'United States') {
      parts.push('USA');
    } else {
      parts.push(place.country);
    }

    parts = [...parts, place.region1, place.region2, place.city];

    return parts.filter(s => s).join('/');
  }

  static $iconLink(place, options = {}) {
    let path = Place.getLinkPath(place);

    let text = options.text || 'place...';

    const $icon = $makeIconLink(path, text, 'images/map-icon.svg');

    if (options.render) {
      rend($icon);
    }

    return $icon;
  }
}
