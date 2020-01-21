class ViewPlace extends ViewPage {
  static byUrl() {
    if (PATH == 'places') {
      ViewPlace.renderIndex();
      return true;
    }

    if (PATH == 'places/all') {
      ViewPlace.renderListAll();
      return true;
    }

    const placeParts = PATH.split('/');
    let [base, country, region1, region2, city, extra] = placeParts;

    if (base != 'places' || extra) {
      return false;
    }

    if (country == 'USA') {
      country = 'United States';
      if (region2) {
        region2 = region2.replace('%20', ' ');
      }
    }

    const place = { country, region1, region2, city };
    const story = ViewPlace.findStory(place);

    new ViewPlace(place, story).render();

    return true;
  }

  static findStory(place) {
    return DATABASE.stories.filter(story => {
      return story.type == 'place' && story.location
        && !['country', 'region1', 'region2', 'city'].some(part => {
          return story.location[part] != place[part];
        });
    })[0];
  }

  static new(place, story) {
    return new ViewPlace(place, story);
  }

  static renderIndex() {
    const places = Place.getDatabaseList();

    const keys = Object.keys(places).sort();

    const countries = keys.filter(key => {
      return places[key].level == 0 && places[key].title != '(none)';
    }).map(key => places[key]);

    h1('Places');

    pg(localLink('/places/all', 'See all places'))
      .css('margin', '12px 0 20px 0');

    countries.forEach(country => {
      pg(country.title).css('margin', '10px 0');
    });
  }

  static renderListAll() {
    const places = Place.getDatabaseList();

    const keys = Object.keys(places).sort();

    headerTrail(['/places', 'Places']);

    h1('All places');

    keys.forEach(placePath => {
      const place = places[placePath];
      if (place.title == '(none)') {
        return;
      }
      pg(place.title).css('margin', '10px ' + (place.level * 30) + 'px');
    });
  }

  constructor(place = {}, story) {
    super(story);
    this.story = story;
    this.place = place;
    for (let key in place) {
      this[key] = place[key];
    }
    this.placePath = [this.country, this.region1, this.region2,
      this.city].filter(s => s);

    this.stories = DATABASE.stories.filter(story => {
      return !['country', 'region1', 'region2', 'city'].some(part => {
        return this[part] != story.location[part];
      });
    });
  }

  render() {
    setPageTitle('Places');
    this.headerTrail();
    this.viewTitle();
    this.viewStories('Landmarks', 'landmark');
    this.viewStories('Cemeteries', 'cemetery');
    this.viewStories('Newspapers', 'newspaper');
  }

  headerTrail() {
    let tempPath = 'places';
    let links = [['places', 'Places']];

    this.placePath.forEach(part => {
      tempPath += '/' + part;
      links.push([tempPath, part]);
    });

    headerTrail(...links.slice(0, links.length - 1));
  }

  viewTitle() {
    if (this.story) {
      h1(this.story.title);
    } else {
      h1(this.placePath.reverse().join(', '));
    }
  }

  viewStories(name, type) {
    const stories = this.stories.filter(story => story.type == type);

    if (stories.length == 0) {
      return;
    }

    h2(name);

    stories.forEach(story => {
      pg(linkToStory(story));
    });
  }
}
