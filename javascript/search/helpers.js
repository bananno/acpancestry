
function doesStrMatchKeywords(str, keywords) {
  str = str.toLowerCase();

  for (let i = 0; i < keywords.length; i++) {
    if (str.match(keywords[i]) == null) {
      return false;
    }
  }

  return true;
}

function highlightKeywords(str, keywords, i) {
  if (str == null || str.length == 0) {
    return str;
  }

  if (i == null) {
    keywords = keywords.sort((a, b) => {
      return b.length - a.length;
    });
    i = 0;
  }

  if (i >= keywords.length) {
    return str;
  }

  let p1 = str.toLowerCase().indexOf(keywords[i]);

  if (p1 == -1) {
    return highlightKeywords(str, keywords, i + 1);
  }

  let p2 = p1 + keywords[i].length;

  return highlightKeywords(str.slice(0, p1), keywords, i + 1) +
    '<span class="highlight-search-result">' + str.slice(p1, p2) + '</span>' +
    highlightKeywords(str.slice(p2), keywords, i);

  return str;
}
