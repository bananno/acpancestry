
function setupLayout() {
  $(document).on('click', '#menu-icon', openSideMenu);
  $(document).on('click', '#main-navigation .close-me', closeSideMenu);
  $(document).on('click', '#menu-backdrop', closeSideMenu);
  createHeaderLinks();
}

function openSideMenu() {
  $('#main-navigation, #menu-backdrop').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation, #menu-backdrop').removeClass('open');
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '">' + SITE_TITLE + '</a>');
  const $list = $('#main-navigation ul');

  $list.append('<li><a href="' + ORIGIN + '">Home</a></li>');

  ['People', 'Events', 'Sources', 'Places'].forEach(nav => {
    $list.append('<li>' + localLink(nav.toLowerCase(), nav) + '</li>');
  });
}
