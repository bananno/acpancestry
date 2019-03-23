
$(document).on('click', '#menu-icon', openSideMenu);

$(document).on('click', '#main-navigation .close-me', closeSideMenu);

function openSideMenu() {
  $('#main-navigation').css('width', '250px');
}

function closeSideMenu() {
  $('#main-navigation').css('width', '0');
}
