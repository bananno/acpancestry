
function processDatabase() {
  DATABASE.personRef = {};
  DATABASE.storyRef = {};
  DATABASE.sourceRef = {};
  DATABASE.imageRef = {};
  DATABASE.images = [];

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    if (person.customId) {
      DATABASE.personRef[person.customId] = person;
      let id = person.customId.toLowerCase().split('-').join('');
      DATABASE.personRef[id] = person;
    }
  });

  DATABASE.stories.forEach(story => {
    DATABASE.storyRef[story._id] = story;

    if (story.tags && story.tags.customId) {
      DATABASE.storyRef[story.tags.customId] = story;
    }

    story.images.forEach(image => {
      image.item = story;
      image.story = true;
      DATABASE.images.push(image);
      DATABASE.imageRef[image._id] = image;
    });
  });

  DATABASE.sources.forEach(source => {
    DATABASE.sourceRef[source._id] = source;
    source.images.forEach(image => {
      image.item = source;
      image.source = true;
      DATABASE.images.push(image);
      DATABASE.imageRef[image._id] = image;
    });
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);

  DATABASE.events = DATABASE.events.map(getProcessedEvent);

  DATABASE.people.forEach(person => {
    if (person.birth) {
      person.birthSort = person.birth.date.sort;
    } else {
      person.birthSort = 'XXXX-XX-XX';
    }
  });

  DATABASE.stories = DATABASE.stories.map(getProcessedStory);

  DATABASE.sources = DATABASE.sources.map(getProcessedSource);

  DATABASE.citations = DATABASE.citations.map(getProcessedCitation);

  DATABASE.notations = DATABASE.notations.map(getProcessedNotation);
}

function getProcessedPerson(person) {
  person.tags = person.tags || {};

  ['parents', 'spouses', 'children'].forEach(relationship => {
    let originalLength = person[relationship].length;

    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = removeNullValues(person[relationship]);

    if (originalLength != person[relationship].length) {
      person.tags[relationship + ' not shared'] = true;
    }
  });

  person.links = person.links || [];
  person.citations = [];

  if (!person.profileImage) {
    person.profileImage = '/images/profile-'
      + (['female', 'male'][person.gender - 1] || 'generic') + '.png';
  }

  return person;
}

function getProcessedEvent(event) {
  event.people = event.people.map(person => {
    person = DATABASE.personRef[person];

    if ((event.title === 'birth' || event.title === 'death')
        && person[event.title] === undefined) {
      person[event.title] = event;
    } else if (event.title === 'birth and death') {
      person.birth = person.birth || event;
      person.death = person.death || event;
    }

    return person;
  });

  event.date = event.date || {};
  event.date.format = formatDate(event.date);
  event.date.sort = getSortDate(event.date);
  event.location = event.location || {};
  event.location.format = formatLocation(event.location);

  return event;
}

function getProcessedStory(story) {
  story.people = story.people.map(person => {
    return DATABASE.personRef[person];
  });
  story.people = removeNullValues(story.people);
  story.date = story.date || {};
  story.date.format = formatDate(story.date);
  story.date.sort = getSortDate(story.date);
  story.location = story.location || {};
  story.location.format = formatLocation(story.location);
  story.tags = story.tags || {};
  story.sources = [];
  story.entries = [];
  story.notations = [];
  return story;
}

function getProcessedSource(source) {
  source.people = source.people.map(person => {
    return DATABASE.personRef[person];
  });

  source.people = removeNullValues(source.people);

  source.story = DATABASE.storyRef[source.story];
  source.story.entries.push(source);

  source.stories = source.stories.map(storyId => {
    const story = DATABASE.storyRef[storyId];
    story.sources.push(source);
    return story;
  });

  source.date = source.date || {};
  source.date.format = formatDate(source.date);
  source.date.sort = getSortDate(source.date);
  source.location = source.location || {};
  source.location.format = formatLocation(source.location);
  source.citations = [];
  source.tags = source.tags || {};

  if (source.story.title.match('Census')) {
    source.title += ' household';
  }

  return source;
}

function getSortDate(dateObj) {
  return [
    dateObj.year || 'XXXX',
    dateObj.month == null ? 'XX' : dateObj.month < 10 ? '0' + dateObj.month : dateObj.month,
    dateObj.day == null ? 'XX' : dateObj.day < 10 ? '0' + dateObj.day : dateObj.day,
  ].join('-');
}

function getProcessedCitation(citation) {
  citation.person = DATABASE.personRef[citation.person];
  citation.source = DATABASE.sourceRef[citation.source];
  citation.person.citations.push(citation);
  citation.source.citations.push(citation);
  return citation;
}

function getProcessedNotation(notation) {
  if (notation.source) {
    notation.source = DATABASE.sourceRef[notation.source];
  }
  notation.people = notation.people.map(person => {
    return DATABASE.personRef[person];
  });
  notation.stories = notation.stories.map(story => {
    story = DATABASE.storyRef[story];
    story.notations.push(notation);
    return story;
  });

  notation.date = notation.date || {};
  notation.date.format = formatDate(notation.date);
  notation.date.sort = getSortDate(notation.date);

  notation.location = notation.location || {};
  notation.location.format = formatLocation(notation.location);

  return notation;
}

function removeNullValues(array) {
  return array.filter(value => value != null);
}
