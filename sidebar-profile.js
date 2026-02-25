// Shared sidebar profile component.
// Update USER to change the name/email/initials across all portal pages.
(function () {
  var USER = { name: 'John Doe', email: 'email@example.com', initials: 'JD' };

  var CSS =
    '.profile-footer{display:flex;flex-direction:column;flex-shrink:0}' +
    '.sign-out-wrap{overflow:hidden;max-height:0;transition:max-height .25s cubic-bezier(.4,0,.2,1)}' +
    '.profile-footer.is-open .sign-out-wrap{max-height:60px}' +
    '.sign-out-row{display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:8px;cursor:pointer;color:#fff;transform:translateY(100%);transition:transform .25s cubic-bezier(.4,0,.2,1)}' +
    '.sign-out-row:hover{background:rgba(255,255,255,.08)}' +
    '.profile-footer.is-open .sign-out-row{transform:translateY(0)}' +
    '.sign-out-label{color:#fff;font-size:14px;font-weight:500;letter-spacing:-.28px;line-height:24px;flex:1}' +
    '.mob-sidebar .sign-out-label{font-size:16px;letter-spacing:-.32px;line-height:24px}' +
    '.profile-row{display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:8px;cursor:pointer}' +
    '.profile-row:hover{background:rgba(255,255,255,.05)}' +
    '.profile-footer.is-open .profile-row .chevron{transform:rotate(180deg)}' +
    '.avatar{border-radius:50%;background:#64748b;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600}' +
    '.sidebar .avatar{width:32px;height:32px;font-size:11px}' +
    '.mob-sidebar .avatar{width:40px;height:40px;font-size:13px}' +
    '.profile-info{flex:1;min-width:0}' +
    '.profile-name{color:#fff;font-weight:500}' +
    '.profile-email{color:rgba(255,255,255,.7);font-weight:400}' +
    '.sidebar .profile-name{font-size:14px;letter-spacing:-.28px;line-height:18px}' +
    '.sidebar .profile-email{font-size:12px;letter-spacing:-.24px;line-height:16px}' +
    '.mob-sidebar .profile-name{font-size:20px;letter-spacing:-.4px;line-height:24px}' +
    '.mob-sidebar .profile-email{font-size:16px;letter-spacing:-.32px;line-height:20px}';

  function injectCSS() {
    if (document.getElementById('sidebar-profile-css')) return;
    var style = document.createElement('style');
    style.id = 'sidebar-profile-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildHTML() {
    return (
      '<div class="sign-out-wrap">' +
        '<div class="sign-out-row" onclick="location.href=\'login.html\'">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="flex-shrink:0">' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>' +
          '</svg>' +
          '<span class="sign-out-label">Sign out</span>' +
        '</div>' +
      '</div>' +
      '<div class="profile-row" onclick="toggleSignOut(this)">' +
        '<div class="avatar">' + USER.initials + '</div>' +
        '<div class="profile-info">' +
          '<div class="profile-name">' + USER.name + '</div>' +
          '<div class="profile-email">' + USER.email + '</div>' +
        '</div>' +
        '<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>' +
        '</svg>' +
      '</div>'
    );
  }

  window.toggleSignOut = function (profileRow) {
    profileRow.closest('.profile-footer').classList.toggle('is-open');
  };

  function init() {
    injectCSS();
    var footers = document.querySelectorAll('.profile-footer');
    for (var i = 0; i < footers.length; i++) {
      footers[i].innerHTML = buildHTML();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
