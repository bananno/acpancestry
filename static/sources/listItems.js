
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

function showSourceList(sourceList, showLocation, showDate, showGroup, getHeaderName) {
  let previousHeader;
  let firstItem = true;

  sourceList.forEach(source => {
    if (getHeaderName) {
      let newHeader = getHeaderName(source);
      if (newHeader != previousHeader) {
        rend('<h2>' + newHeader + '</h2>');
        previousHeader = newHeader;
        firstItem = true;
      }
    }

    rend(
      '<p style="padding-top: ' + (firstItem ? '5' : '15') + 'px; padding-left: 10px;">' +
        linkToSource(source, (showGroup ? source.group + ' - ' : '') + source.title) +
      '</p>'
    );

    if (showLocation) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.location.format +
        '</p>'
      );
    }

    if (showDate) {
      rend(
        '<p style="padding-top: 2px; padding-left: 10px;">' +
          source.date.format +
        '</p>'
      );
    }

    firstItem = false;
  });
}
