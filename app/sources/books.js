function viewBook() {
  if (PATH == 'books') {
    return viewBooksIndex();
  }

  ViewStoryBook.byUrl();
}

function viewBooksIndex() {
  headerTrail('sources');
  setPageTitle('Books');
  h1('Books');

  const books = DATABASE.stories.filter(story => story.type == 'book');

  books.forEach(story => {
    h2(story.title);

    if (story.summary) {
      rend('<p style="margin-left: 10px">' + story.summary + '</p>');
    }

    rend($makePeopleList(story.people, 'photo').css('margin-top', '15px'));

    rend(
      '<p style="margin: 10px">' +
        localLink('book/' + story._id, 'read book ' + RIGHT_ARROW) +
      '</p>'
    );
  });
}
