
function showPersonTimeline(person) {
  rend('<h2>Timeline</h2>');

  const items = getPersonTimelineItems(person);

  items.forEach(item => {
    rend('<p>' + item.title + '</p>');
  });
}

function getPersonTimelineItems(person) {
  return [...DATABASE.events, ...DATABASE.sources].filter(item => {
    return item.people.indexOf(person) >= 0;
  });
}
