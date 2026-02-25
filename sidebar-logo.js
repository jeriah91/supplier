// Shared sidebar logo component.
// Update the src here to change the logo across all portal pages.
(function () {
  var LOGO_HTML = '<img src="https://www.figma.com/api/mcp/asset/a4c90b34-4f6b-407e-a357-d7e7d1f57886" alt="Zipline" width="24" height="24">';

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
