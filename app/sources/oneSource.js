
function viewOneSource() {
  const sourceId = PATH.replace('source/', '');

  const source = DATABASE.sources.filter(source => source._id == sourceId)[0];

  if (!source) {
    rend('<h1>Source not found</h1>');
    return;
  }

  if (source.type == 'grave') {
    viewSourceGrave(source);
  } else {
    viewSourceOther(source);
  }

  rend('<h2>People</h2>');
  rend($makePeopleList(source.people, 'photo'));

  viewSourceNotes(source);
  viewSourceLinks(source);

  if (['newspaper', 'grave'].includes(source.type)) {
    viewSourceStoryEntryList(source);
  }
}

function viewSourceGrave(source) {
  const story = source.story;

  setPageTitle(story.title);

  headerTrail('sources', 'cemeteries',
    ['cemetery/' + story._id, story.title]);

  rend('<p>' + story.location.format + '</p>');
  rend('<p><br></p>');
  h1(source.title);

  viewSourceSummary(source);

  if (source.images.length) {
    rend('<h2>Images</h2>');
    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 200).css('margin-right', '5px'));
    });
  }
}

function viewSourceOther(source) {
  const story = source.story;

  setPageTitle('Source');

  if (source.type == 'newspaper') {
    headerTrail('sources', 'newspapers',
      story ? ['newspaper/' + story._id, story.title] : null);
  }

  rend('<h1>Source</h1>');
  rend('<p>' + source.type + '</p>');
  rend('<p>' + source.group + '</p>');
  rend('<p>' + source.title + '</p>');
  rend('<p>' + formatDate(source.date) + '</p>');
  rend('<p>' + formatLocation(source.location) + '</p>');

  viewSourceSummary(source);

  if (source.images.length) {
    rend('<h2>Images</h2>');

    if (source.tags.cropped) {
      rend('<p style="margin-bottom:10px">The image is cropped to show the most relevent ' +
        'portion. See the "links" section below to see the full image.</p>');
    }

    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i).css('margin-right', '5px'));
    });
  }

  if (source.content) {
    rend('<h2>Transcription</h2>');
    rend(formatTranscription(source.content));
  }
}

function viewSourceSummary(source) {
  if (source.summary) {
    rend('<h2>Summary</h2>');
    rend(source.summary.split('\n').map(text => '<p>' + text + '</p>').join(''));
  }
}

function viewSourceNotes(source) {
  if (source.notes) {
    rend('<h2>Notes</h2>');
    rend('<ul class="bullet"><li>' + source.notes.split('\n').join('</li><li>') + '</li></ul>');
  }
}

function viewSourceLinks(source) {
  if (source.links.length) {
    rend('<h2>Links</h2>');
    rend(source.links.map(getFancyLink));
  }
}

function viewSourceStoryEntryList(source) {
  const story = source.story;

  if (!story) {
    return;
  }

  const entries = story.entries.filter(s => s != source);

  if (entries.length == 0) {
    return;
  }

  h2('More from ' + story.title);

  if (source.type == 'grave') {
    entries.trueSort((a, b) => a.title < b.title);
    showListOfGraves(entries)
  } else {
    entries.trueSort((a, b) => isDateBeforeDate(a.date, b.date));
    showListOfArticles(entries);
  }
}
