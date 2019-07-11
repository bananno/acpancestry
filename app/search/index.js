
function viewSearch() {
  setPageTitle('Search Results');

  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  if (keywords.length === 0) {
    rend('<h1>Search Results</h1>');
    return;
  }

  rend('<h1>Search Results for "' + keywords.join(' ') + '"</h1>');
  rend('<p style="padding-top:10px;" id="number-of-search-results"></p>');

  new SearchResultsPeople(keywords);
  new SearchResultsPlaces(keywords);
  new SearchResultsDocuments(keywords);
  new SearchResultsCemeteries(keywords);
  new SearchResultsNewspapers(keywords);
  new SearchResultsBooks(keywords);
  new SearchResultsOtherSources(keywords);
  new SearchResultsEvents(keywords);

  const totalResults = $('.search-result-item').length;

  $('#number-of-search-results').append(totalResults == 1 ? '1 result' : totalResults +
    ' results');
}

class SearchResults {
  constructor(keywords, isTest) {
    this.keywords = keywords;
    this.isTest = isTest;
    this.resultsList = [];
  }

  execute() {
    this.getResults();

    if (this.resultsList.length == 0) {
      return;
    }

    this.sortResults();

    if (!this.isTest) {
      this.renderResults();
    }
  }

  isMatch(text) {
    return doesStrMatchKeywords(text, this.keywords);
  }

  add(obj) {
    this.resultsList.push(obj);
  }

  highlight(text) {
    return highlightKeywords(text, this.keywords);
  }

  title(text) {
    rend('<h2>' + text + '</h2>');
  }
}

class SearchResultsPeople extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    this.resultsList = DATABASE.people.filter(person => {
      return this.isMatch(person.name);
    });
  }

  sortResults() {
  }

  renderResults() {
    this.title('People');
    rend($makePeopleList(this.resultsList, 'photo', this.keywords));
  }
}

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
      rend($makeIconLink('places/' + path, text, 'images/map-icon.svg'))
    });
  }
}
