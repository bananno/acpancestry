
function sourceListitemCemetery(rootSource, numEntries, hideLocation) {
  return sourceListitemCemeteryOrNewspaper(rootSource, 'grave', numEntries, hideLocation);
}

function sourceListitemNewspaper(rootSource, numEntries, hideLocation) {
  return sourceListitemCemeteryOrNewspaper(rootSource, 'article', numEntries, hideLocation);
}

function sourceListitemCemeteryOrNewspaper(rootSource, entryName, numEntries, hideLocation) {
  if (numEntries == undefined) {
    numEntries = DATABASE.sources.filter(source => {
      return source.type == rootSource.type && source.group == rootSource.group;
    }).length;
  }

  return (
    '<p style="padding-top: 15px">' +
      linkToSourceGroup(rootSource, rootSource.group) +
      '<br>' +
      ((rootSource.location.format && !hideLocation)
        ? rootSource.location.format + '<br>' : '') +
      numEntries + ' ' + entryName + (numEntries == 1 ? '' : 's') +
    '</p>'
  );
}
