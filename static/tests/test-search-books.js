
test(t => {
  const sourceGroup1 = {
    _id: '0001',
    type: 'book',
    group: 'History Book',
    title: 'SOURCE GROUP',
    summary: 'American Revolution',
  };

  const sourceBook1 = {
    _id: '0002',
    type: 'book',
    group: 'History Book',
    title: 'John Smith biography',
  };

  const sourceBook2 = {
    _id: '0003',
    type: 'book',
    group: 'History Book',
    title: 'Jane Doe biography',
  };

  DATABASE.sources = [sourceGroup1, sourceBook1, sourceBook2];

  t.stubDatabase();

  let search;

  function help(arr) {
    return arr.map(obj => obj._id).join(', ');
  }

  t.setTitle('search results');

  t.setTitle2('books');

  search = new SearchResultsBooks('revolution', true);
  t.assertEqual('include matching source group if none of the sub-sources match',
    help([sourceGroup1]),
    help(search.resultsList),
  );
});
