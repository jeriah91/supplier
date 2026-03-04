// Shared sidebar logo component.
// Update the src here to change the logo across all portal pages.
(function () {
  var LOGO_HTML = '<img src="logo-icon.svg" alt="Zipline" width="24" height="24">';

  function init() {
    var icons = document.querySelectorAll('.logo-icon');
    for (var i = 0; i < icons.length; i++) {
      icons[i].innerHTML = LOGO_HTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
