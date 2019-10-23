
function setupLayout() {
  $(document).on('click', '#menu-icon', openSideMenu);
  $(document).on('click', '#main-navigation .close-me', closeSideMenu);
  $(document).on('click', '#main-navigation .local-link', closeSideMenu);
  $(document).on('click', '#menu-backdrop', closeSideMenu);
  createHeaderLinks();
  addFooterQuote();
}

function openSideMenu() {
  $('#main-navigation, #menu-backdrop').addClass('open');
}

function closeSideMenu() {
  $('#main-navigation, #menu-backdrop').removeClass('open');
}

function createHeaderLinks() {
  $('#page-header h1').append('<a href="' + ORIGIN + '" class="local-link">'
    + SITE_TITLE + '</a>');

  const $list = $('#main-navigation ul');

  $list.append('<li><a href="' + ORIGIN + '" class="local-link">Home</a></li>');

  ['People', 'Events', 'Sources', 'Places'].forEach(nav => {
    $list.append('<li>' + localLink(nav.toLowerCase(), nav) + '</li>');
  });

  if (ENV == 'dev') {
    ['Test', 'Audit'].forEach(nav => {
      $list.append('<li>' + localLink(nav.toLowerCase(), nav.slice(0, 1))
        + '</li>');
    });
  }
}

function addFooterQuote() {
  const quotes = DATABASE.notations.filter(n => n.tags['featured quote']);
  $('#page-footer').append(quotes.random().text);
}
