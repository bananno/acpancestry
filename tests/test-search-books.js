(() => {

test(t => {
  const bookStory1 = t.fakeStory({
    type: 'book',
    title: 'History Book',
    summary: 'American Revolution',
  });

  const bookStory2 = t.fakeStory({
    type: 'book',
    title: 'Some Other Book',
    summary: 'More information',
  });

  const bookSource1 = t.fakeSource({
    title: 'John Smith biography',
    story: bookStory1._id,
  });

  const bookSource2 = t.fakeSource({
    title: 'Jane Doe biography',
    story: bookStory1._id,
  });

  t.stubDatabase();

  let search;

  t.setTitle('search results');
  t.setTitle2('books');

  /*
    Search results structure:
    1. All applicable stories are added to the resultsList.
    2. Each story is given a matchingEntries list attribute. All of its
        matching entries are added to that list.
  */

  search = SearchResultsBooks.newTest('history');
  t.assertArrayEqualById('include story, exclude its entries, if the story ' +
      'name is the only match (part 1)',
    [bookStory1],
    search.resultsList,
  );
  t.assertEqual('include story, exclude its entries, if the story ' +
      'name is the only match (part 2)',
    [],
    search.resultsList[0].matchingEntries,
  );

  search = SearchResultsBooks.newTest('revolution');
  t.assertArrayEqualById('include story, exclude its entries, if other ' +
      'story properties are the only match',
    [bookStory1],
    search.resultsList,
  );

  search = SearchResultsBooks.newTest('jane');
  t.assertArrayEqualById('include non-matching story if any of its entries ' +
      'match (part 1)',
    [bookStory1],
    search.resultsList,
  );
  t.assertArrayEqualById('include non-matching story if any of its entries ' +
      'match (part 2)',
    [bookSource2],
    search.resultsList[0].matchingEntries,
  );

  search = SearchResultsBooks.newTest('revolution', 'john');
  t.assertArrayEqualById('include source if it partly matches and the rest ' +
      'of the keywords are found in the story properties',
    [bookSource1],
    search.resultsList[0].matchingEntries,
  );

  search = SearchResultsBooks.newTest('other');
  t.assertArrayEqualById('matching stories are included even if they ' +
      'contain no entries',
    [bookStory2],
    search.resultsList,
  );
});

})();
