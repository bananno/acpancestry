
function viewSearch() {
  setPageTitle('Search Results');
  rend('<h1>Search Results</h1>');
  const keywords = PATH.slice(7).toLowerCase().split('+').filter(word => word.length > 0);
  $('.search-form [name="search"]').val(keywords.join(' '));

  let peopleList = DATABASE.people.filter(person => {
    for (let i = 0; i < keywords.length; i++) {
      if (person.name.toLowerCase().match(keywords[i]) == null) {
        return false;
      }
    }
    return true;
  });

  rend($makePeopleList(peopleList));
}
