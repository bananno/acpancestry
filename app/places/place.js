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

  static getDatabaseList() {
    const allItems = [
      ...DATABASE.events,
      ...DATABASE.stories,
      ...DATABASE.sources
    ];

    const places = {};

    const tempParts = ['country', 'region1', 'region2', 'city'];

    allItems.forEach(item => {
      let {country, region1, region2, city} = item.location || {};

      if (country == 'United States' && region1) {
        region1 = USA_STATES[region1];
      }

      const pathParts = [country, region1, region2, city]
        .filter(Boolean)
        .map(pathTitle => {
          return {
            title: pathTitle,
            path: pathTitle.toLowerCase().replace(/ /g, '')
          };
        });

      if (pathParts.length < 4) {
        pathParts.push({title: '(none)', path: '(none)'});
      }

      const pathOnly = pathParts.map(part => part.path);

      pathParts.forEach((path, i) => {
        const fullPath = pathOnly.slice(0, i + 1).join('/');
        if (!places[fullPath]) {
          places[fullPath] = {
            title: path.title,
            items: [],
            list: [],
            level: i
          };
          const parentPath = pathOnly.slice(0, i).join('/');
          if (parentPath) {
            places[parentPath].list.push(fullPath);
          }
        }
      });

      places[pathOnly.join('/')].items.push(item);
    });

    return places;
  }
}
