
function processDatabase() {
  DATABASE.personRef = {};
  DATABASE.storyRef = {};
  DATABASE.sourceRef = {};

  DATABASE.people.forEach(person => {
    DATABASE.personRef[person._id] = person;
    DATABASE.personRef[person.customId] = person;
  });

  DATABASE.stories.forEach(story => {
    DATABASE.storyRef[story._id] = story;
  });

  DATABASE.sources.forEach(source => {
    DATABASE.sourceRef[source._id] = source;
  });

  DATABASE.people = DATABASE.people.map(getProcessedPerson);
  DATABASE.people.forEach(addPersonChildSiblings);

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
  ['parents', 'spouses', 'children'].forEach(relationship => {
    person[relationship] = person[relationship].map(otherPerson => {
      return DATABASE.personRef[otherPerson];
    });

    person[relationship] = removeNullValues(person[relationship]);
  });

  person.tags = person.tags || {};
  person.siblings = [];
  person.links = person.links || [];
  person.citations = [];
  person.profileImage = person.profileImage || 'images/generic-profile-picture.png';

  return person;
}

function addPersonChildSiblings(person) {
  person.children.forEach((sibling1, i) => {
    const otherSiblings = person.children.slice(i + 1);
    otherSiblings.forEach(sibling2 => {
      if (sibling1.siblings.indexOf(sibling2) === -1) {
        sibling1.siblings.push(sibling2);
        sibling2.siblings.push(sibling1);
      }
    });
  });
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
  story.entries = [];
  return story;
}

function getProcessedSource(source) {
  source.people = source.people.map(person => {
    return DATABASE.personRef[person];
  });

  source.people = removeNullValues(source.people);

  source.story = DATABASE.storyRef[source.story];
  source.story.entries.push(source);

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
  notation.people = notation.people.map(person => {
    return DATABASE.personRef[person];
  });
  return notation;
}

function removeNullValues(array) {
  return array.filter(value => value != null);
}
