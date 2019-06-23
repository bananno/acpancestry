
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
}

function viewSourceGrave(source) {
  setPageTitle(source.group);
  rend('<h1>' + source.group + '</h1>');
  rend('<p>' + formatLocation(source.location) + '</p>');
  rend('<p><br></p>');
  rend('<h1>' + source.title + '</h1>');

  viewSourceSummary(source);

  if (source.images.length) {
    rend('<h2>Images</h2>');
    source.images.forEach((imageUrl, i) => {
      rend(makeImage(source, i, 200));
    });
  }
}

function viewSourceOther(source) {
  setPageTitle('Source');
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
      rend(makeImage(source, i));
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