
class SearchResultsBooks extends SearchResults {
  constructor(keywords, isTest) {
    super(keywords, isTest);
    this.execute();
  }

  getResults() {
    DATABASE.sources.filter(source => source.type == 'book').forEach(source => {
      let searchStringSource = ['title', 'notes', 'summary', 'content']
        .map(attr => source[attr] || '').join(',');

      let searchStringGroup = '';

      if (source.sourceGroup) {
        searchStringGroup = ['group', 'notes', 'summary', 'content']
          .map(attr => source.sourceGroup[attr] || '').join(',');
      } else {
        searchStringSource += source.group;
      }

      const matchSource = this.isMatch(searchStringSource);
      const matchGroup = this.isMatch(searchStringGroup);
      const matchTotal = this.isMatch(searchStringSource + ',' + searchStringGroup);

      // The group is included if any match was found - whether it's the group, the sub-source,
      // or if combined properties are required for a match.
      if (source.sourceGroup && (matchGroup || matchTotal)) {
        this.add(source.sourceGroup);
      }

      // The sub-source is included if it matches on its own OR if the combination is required
      // for a match. The sub-source is excluded if the keywords were only found in the group
      // properties.
      if (matchSource || (matchTotal && !matchGroup)) {
        this.add(source);
      }
    });

    // Add any source groups that don't contain sub-sources.
    DATABASE.sourceGroups.filter(source => source.sourceList.length == 0).forEach(source => {
      let searchString = ['group', 'notes', 'summary', 'content']
        .map(attr => source[attr] || '').join(',');

      if (this.isMatch(searchString)) {
        this.add(source);
      }
    });

    this.resultsList = removeDuplicatesById(this.resultsList);
  }

  sortResults() {
    this.resultsList.trueSort((a, b) => {
      if (a.group != b.group) {
        return a.group < b.group;
      }
      return a.isGroupMain || (a.title < b.title && !b.isGroupMain);
    });
  }

  renderResults() {
    this.title('Books');

    let previousBookGroup = null;

    this.resultsList.forEach((source, i) => {

      let linkText;

      if (previousBookGroup != source.group) {
        linkText = source.group + ' - ' + source.title;
        previousBookGroup = source.group;
      } else {
        linkText = ' ------- ' + source.title;
      }

      linkText = this.highlight(linkText, this.keywords);

      rend(
        '<p style="padding: 5px;" class="search-result-item">' +
          linkToSource(source, linkText) +
        '</p>'
      );

      if (source.isGroupMain && source.summary) {
        rend(
          '<p style="padding: 2px;" class="search-result-item">' +
            '<i>' + source.summary + '</i>' +
          '</p>'
        );
      }

      if (source.sourceGroup && source.sourceGroup.summary) {
        rend(
          '<p style="padding: 2px;" class="search-result-item">' +
            '<i>' + source.sourceGroup.summary + '</i>' +
          '</p>'
        );
      }
    });
  }
}
