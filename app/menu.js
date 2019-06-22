
$(document).on('click', '#menu-icon', openSideMenu);
$(document).on('click', '#main-navigation .close-me', closeSideMenu);
$(document).on('click', '#menu-backdrop', closeSideMenu);

function openSideMenu() {
  $('#main-navigation, #menu-backdrop').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation, #menu-backdrop').removeClass('open');
}
