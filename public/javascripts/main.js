
$(document).on('click', '#menu-icon', openSideMenu);

$(document).on('click', '#main-navigation .close-me', closeSideMenu);

function openSideMenu() {
  $('#main-navigation').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation').removeClass('open');
}
