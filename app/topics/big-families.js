class ViewTopicBigFamilies extends ViewPage {
  static new() {
    new viewTopicBigFamilies().render();
  }

  constructor() {
    super();
    this.eval();
  }

  eval() {
    this.listByNumber = [];

    DATABASE.people.forEach(person => {
      let i = Person.create(person).numberOfChildren();
      if (i == null || i < 6) {
        return;
      }
      this.listByNumber[i] = this.listByNumber[i] || [];
      this.listByNumber[i].push(person);
    });

    this.sectionNumbers = Object.keys(this.listByNumber).reverse();
  }

  render() {
    rend('<div style="height: 30px"> </div>');
    this.showLetter();
    rend('<hr style="margin: 30px 0">');
    this.showPhoto1();
    this.showPhoto2();
    this.showLists();
  }

  showLetter() {
    const person = Person.find('urania-aborn');
    const source = DATABASE.sourceRef['5d0084c360a5ff4d264d282e'];

    const quote = 'You will be supposing to have me say, "Here I am ' +
      'confined again" with a daughter a fortnight old yesterday... ' +
      'little did I think when I came to Georgia that I would have ' +
      'children oftener than once a year, but it is so; I must submit to it.';

    const $credit = $('<span>')
      .append(' - ')
      .append(linkToPerson(person, false, 'Urania Smith'))
      .append(', ')
      .append(linkToSource(source, 'letter to sister'))
      .append(', 1834');

    rend($quoteBlock({
      text: quote,
      credit: $credit,
      rightQuote: true,
      css: {
        'margin-top': '20px'
      },
      coverBackground: true,
    }));
  }

  showPhoto1() {
    const source = DATABASE.sourceRef['5d007bac60a5ff4d264d281d'];

    const caption = 'Frances and Sheldon Smith pose with 10 of ' +
      'their 13 children, circa 1870. (One child died and two were not ' +
      'yet born.) Frances came from a family of 12 children and Sheldon ' +
      'came from a family of 8 children. Their daughter Fannie (standing ' +
      'on far left) would later marry Harrison Clifton, himself from a ' +
      'family of 9 children, and have 13 children. ';

    rend(Image.make(source.images[0]));

    rend(
      $('<div style="margin: 10px 0;">')
      .append('<b>Above:</b> ')
      .append(caption)
      .append(linkToSource(source, '<i>(see more about this photo)</i>'))
    );
  }

  showPhoto2() {
    const source = DATABASE.sourceRef['5d9698b8e3a11b8ceb8ea6b7'];

    const caption = 'Frank and Christina Fencl with 10 of their children. ';

    rend(
      $('<div style="margin: 20px 0;">')
      .append('<b>Below:</b> ')
      .append(caption)
      .append(linkToSource(source, '<i>(see more about this photo)</i>'))
    );

    rend(Image.make(source.images[0]));
  }

  showLists() {
    this.sectionNumbers.forEach(number => {
      h2(number + ' children');
      rend($makePeopleList(this.listByNumber[number], 'photo'));
    });
  }
}
