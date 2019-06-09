
test(t => {
  const sourceBook1 = {
    _id: '0001',
    type: 'book',
    group: 'History Book',
    title: 'SOURCE GROUP',
    summary: 'American Revolution',
  };

  const sourceBook2 = {
    _id: '0002',
    type: 'book',
    group: 'History Book',
    title: 'John Smith biography',
  };

  const sourceBook3 = {
    _id: '0003',
    type: 'book',
    group: 'History Book',
    title: 'Jane Doe biography',
  };

  DATABASE.sources = [sourceBook1, sourceBook2, sourceBook3];

  t.stubDatabase();

  let search;

  t.setTitle('search results');

  t.setTitle2('books');

  search = new SearchResultsBooks(['history'], true);
  t.assertEqual('include group, exclude sub-sources, if the group name is the only match',
    [sourceBook1],
    search.resultsList,
  );

  search = new SearchResultsBooks(['revolution'], true);
  t.assertEqual('include group, exclude sub-sources, if other group properties are the only match',
    [sourceBook1],
    search.resultsList,
  );

  search = new SearchResultsBooks(['jane'], true);
  t.assertEqual('include non-matching source group if any of its sub-sources match',
    [sourceBook1, sourceBook3],
    search.resultsList,
  );

  search = new SearchResultsBooks(['revolution', 'john'], true);
  t.assertEqual('include source if it partly matches and the rest of the keywords are found ' +
      'in the source group properties',
    [sourceBook1, sourceBook2],
    search.resultsList,
  );

  console.log(search.resultsList)

  search = new SearchResultsBooks(['biography'], true);
  t.assertEqual('sub-sources are ordered alphabetically by title',
    [sourceBook1, sourceBook3, sourceBook2],
    search.resultsList,
  );
});
