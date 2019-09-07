
function viewPlacesItemList(itemList, hideLocation) {

  // view list of stories/sources in given location - REPAIR LATER
  return;

  [['Cemeteries', 'grave', 'grave'],
  ['Newspapers', 'newspaper', 'article']].forEach(([sectionTitle, sourceType, entryName]) => {
    const groupList = createListOfNewspapersOrCemeteries(sourceType, itemList)[1];
    let needHeader = true;

    for (let groupName in groupList) {
      if (needHeader) {
        rend('<h2>' + sectionTitle + '</h2>');
        needHeader = false;
      }

      const rootSource = groupList[groupName][0];
      const numItems = groupList[groupName].length;

      rend(sourceListitemCemeteryOrNewspaper(rootSource, entryName, numItems, hideLocation));
    }
  });

  const otherItems = itemList.filter(item => item.type != 'grave' && item.type != 'newspaper');

  if (otherItems.length) {
    rend('<h2>Other</h2>');
  }

  otherItems.forEach(item => {
    if (item.group) {
      viewPlacesItemSource(item);
    } else {
      viewPlacesItemEvent(item);
    }
  });
}

function viewPlacesItemSource(source) {
  rend(
    '<p style="margin-top: 10px;">' +
    linkToSource(source, source.type + ' - ' + source.group + ' - ' + source.title) +
    '</p>'
  );
}

function viewPlacesItemEvent(event) {
  rend(
    '<p style="margin-top: 10px;">' +
      event.title + ' - ' +
      event.people.map(person => linkToPerson(person)).join(', ') +
    '</p>'
  );
}
