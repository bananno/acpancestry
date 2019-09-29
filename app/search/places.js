class SearchResultsPlaces extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    // clean this up please

    const placeMarker = {};
    this.resultsList = [...DATABASE.sources, ...DATABASE.events].map(item => {
      if (!item.location) {
        return null;
      }

      const placeNameLinkArr = [];
      const placeNameDisplayArr = [];

      for (let r = 0; r < 4; r++) {
        let part = PLACE_PARTS[r];

        if (!item.location[part]) {
          continue;
        }

        let nextPartTextLink = item.location[part];
        let nextPartTextDisplay = nextPartTextLink;

        if (item.location.country == 'United States') {
          if (part == 'country') {
            nextPartTextLink = 'USA';
            nextPartTextDisplay = 'USA';
          } else if (part == 'region1') {
            nextPartTextDisplay = USA_STATES[nextPartTextDisplay];
          }
        }

        placeNameLinkArr.push(nextPartTextLink);
        placeNameDisplayArr.push(nextPartTextDisplay);

        let searchablePlaceName = placeNameDisplayArr.join(' ');

        if (placeMarker[searchablePlaceName]) {
          return null;
        }

        if (this.isMatch(searchablePlaceName)) {
          placeMarker[searchablePlaceName] = true;
          return [placeNameLinkArr, placeNameDisplayArr];
        }
      }

      return null;
    }).filter(p => p);
  }

  sortResults() {
  }

  renderResults() {
    this.title('Places');
    this.resultsList.forEach(([placePath, placeText]) => {
      const path = 'places/' + placePath.join('/');
      const text = this.highlight(placeText.reverse().join(', '));
      // rend('<p>' + localLink(path, text) + '</p>');
      rend($makeIconLink(path, text, 'images/map-icon.svg'))
    });
  }
}
