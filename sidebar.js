// sidebar.js — single source of truth for all portal sidebar HTML, CSS, and behaviour.
// Each page needs one mount point inside .layout, e.g.:
//   <div id="sidebarMount" data-active="profile|compliance|users"></div>
// This script injects the mobile overlay, mobile sidebar, and desktop sidebar,
// then wires up openSidebar / closeSidebar and the collapse / drag handle.

(function () {

  // ── CSS ──────────────────────────────────────────────────────────────────
  var CSS = [
    // Mobile overlay & sidebar
    '.mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100}',
    '.mob-overlay.is-visible{display:block}',
    '.mob-sidebar{position:fixed;inset:0;background:#0f172a;z-index:101;display:flex;flex-direction:column;padding:32px 16px 24px;gap:32px;transform:translateX(-100%);transition:transform .25s ease;overflow-y:auto}',
    '.mob-sidebar.is-open{transform:translateX(0)}',
    '@media(min-width:768px){.mob-overlay,.mob-sidebar{display:none!important}}',
    // Desktop sidebar
    '.sidebar-wrap{flex-shrink:0;display:flex;align-items:stretch}',
    '@media(max-width:767px){.sidebar-wrap{display:none}}',
    '.sidebar{background:#0f172a;width:280px;height:100%;border-radius:8px;display:flex;flex-direction:column;padding:32px 16px 24px;gap:24px;overflow:hidden;transition:width .25s ease,padding .25s ease;flex-shrink:0}',
    '.sidebar-wrap.is-collapsed .sidebar{width:64px;padding-left:8px;padding-right:8px}',
    // Handle
    '.sidebar-handle{width:8px;display:flex;align-items:center;justify-content:center;cursor:col-resize;flex-shrink:0;user-select:none}',
    '.sidebar-handle-pill{width:4px;height:54px;background:#0f172a;border-radius:2px;transition:background .15s;flex-shrink:0}',
    '.sidebar-handle:hover .sidebar-handle-pill{background:#334155}',
    // Sidebar text (fades when collapsed)
    '.sidebar-text{overflow:hidden;white-space:nowrap;transition:opacity .2s ease,max-width .25s ease;max-width:200px}',
    '.sidebar-wrap.is-collapsed .sidebar-text{opacity:0;max-width:0;padding:0;pointer-events:none}',
    // Logo
    '.sidebar-logo{display:flex;align-items:center;gap:16px;padding:0 16px;transition:padding .25s ease,gap .25s ease}',
    '.sidebar-wrap.is-collapsed .sidebar-logo{justify-content:center;padding:0 8px;gap:0}',
    '.logo-icon{width:24px;height:24px;flex-shrink:0}',
    '.logo-text{color:#fff;font-weight:600}',
    '.sidebar .logo-text{font-size:18px;letter-spacing:-.72px;line-height:22px}',
    '.mob-sidebar .logo-text{font-size:24px;letter-spacing:-.96px;line-height:28px}',
    // Close button
    '.close-btn{background:none;border:none;cursor:pointer;color:#fff;padding:0;width:24px;height:24px;flex-shrink:0;margin-left:auto;display:flex;align-items:center;justify-content:center}',
    // Nav items
    '.nav-item{display:flex;align-items:center;gap:16px;padding:8px 16px;border-radius:8px;cursor:pointer;width:100%;text-align:left;background:none;border:none;font-family:inherit}',
    '.nav-item:hover{background:rgba(255,255,255,.06)}',
    '.sidebar-wrap.is-collapsed .nav-item{justify-content:center;padding:8px;gap:0}',
    '.nav-icon{width:24px;height:24px;flex-shrink:0;color:#fff}',
    '.nav-label{flex:1;color:#fff;font-weight:500;white-space:nowrap}',
    '.sidebar .nav-label{font-size:14px;letter-spacing:-.28px;line-height:24px}',
    '.mob-sidebar .nav-label{font-size:20px;letter-spacing:-.4px;line-height:24px}',
    '.badge{background:#ef4444;color:#fff;font-weight:600;border-radius:12px;flex-shrink:0}',
    '.sidebar .badge{font-size:10px;line-height:11px;padding:2px 6px}',
    '.mob-sidebar .badge{font-size:14px;line-height:18px;padding:2px 8px}',
    '.nav-group{display:flex;flex-direction:column}',
    '.chevron{width:24px;height:24px;flex-shrink:0;color:#fff;transition:transform .2s ease}',
    '.sidebar-spacer{flex:1;min-height:0}',
    // Profile footer
    '.profile-footer{display:flex;flex-direction:column;flex-shrink:0}',
    '.sign-out-wrap{overflow:hidden;max-height:0;transition:max-height .25s cubic-bezier(.4,0,.2,1)}',
    '.profile-footer.is-open .sign-out-wrap{max-height:60px}',
    '.sign-out-row{display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:8px;cursor:pointer;color:#fff;transform:translateY(100%);transition:transform .25s cubic-bezier(.4,0,.2,1)}',
    '.sign-out-row:hover{background:rgba(255,255,255,.08)}',
    '.profile-footer.is-open .sign-out-row{transform:translateY(0)}',
    '.sign-out-label{color:#fff;font-size:14px;font-weight:500;letter-spacing:-.28px;line-height:24px;flex:1}',
    '.mob-sidebar .sign-out-label{font-size:16px;letter-spacing:-.32px;line-height:24px}',
    '.profile-row{display:flex;align-items:center;gap:12px;padding:8px 16px;border-radius:8px;cursor:pointer}',
    '.profile-row:hover{background:rgba(255,255,255,.05)}',
    '.profile-footer.is-open .profile-row .chevron{transform:rotate(180deg)}',
    '.sidebar-wrap.is-collapsed .profile-row{justify-content:center;padding:8px;gap:0}',
    '.sidebar-wrap.is-collapsed .profile-info,.sidebar-wrap.is-collapsed .profile-row .chevron{display:none}',
    '.sidebar-wrap.is-collapsed .sign-out-wrap{display:none!important}',
    '.avatar{border-radius:50%;background:#64748b;flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600}',
    '.sidebar .avatar{width:32px;height:32px;font-size:11px}',
    '.mob-sidebar .avatar{width:40px;height:40px;font-size:13px}',
    '.profile-info{flex:1;min-width:0}',
    '.profile-name{color:#fff;font-weight:500}',
    '.profile-email{color:rgba(255,255,255,.7);font-weight:400}',
    '.sidebar .profile-name{font-size:14px;letter-spacing:-.28px;line-height:18px}',
    '.sidebar .profile-email{font-size:12px;letter-spacing:-.24px;line-height:16px}',
    '.mob-sidebar .profile-name{font-size:20px;letter-spacing:-.4px;line-height:24px}',
    '.mob-sidebar .profile-email{font-size:16px;letter-spacing:-.32px;line-height:20px}',
  ].join('');

  // ── Nav item definitions ─────────────────────────────────────────────────
  // To add/remove/rename nav items or change their links, edit ITEMS only.
  var ITEMS = [
    {
      key: 'profile',
      label: 'Profile',
      href: 'company-details.html',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      badge: null,
    },
    {
      key: 'compliance',
      label: 'Compliance',
      href: 'portal.html',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      badge: '4',
    },
    {
      key: 'users',
      label: 'Users',
      href: 'users.html',
      icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      badge: null,
    },
  ];

  // ── Helpers ──────────────────────────────────────────────────────────────
  function svgIcon(path) {
    return '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="' + path + '"/></svg>';
  }

  function buildNavItem(item, isActive, isDesktop) {
    var activeStyle = isActive ? ' style="background:rgba(44,102,239,0.12);"' : '';
    var dataHref    = isActive ? '' : ' data-href="' + item.href + '"';
    var labelClass  = isDesktop ? 'sidebar-text nav-label' : 'nav-label';
    var badgeClass  = isDesktop ? 'sidebar-text badge'     : 'badge';
    var badge       = item.badge ? '<span class="' + badgeClass + '">' + item.badge + '</span>' : '';
    return '<button class="nav-item"' + activeStyle + dataHref + '>' +
      svgIcon(item.icon) +
      '<span class="' + labelClass + '">' + item.label + '</span>' +
      badge + '</button>';
  }

  // ── HTML builders ────────────────────────────────────────────────────────
  function buildDesktop(active) {
    var items = ITEMS.map(function (i) { return buildNavItem(i, i.key === active, true); }).join('');
    return (
      '<div class="sidebar-wrap" id="sidebarWrap">' +
        '<nav class="sidebar">' +
          '<div class="sidebar-logo">' +
            '<div class="logo-icon"></div>' +
            '<span class="sidebar-text logo-text">Platypus Plumbing</span>' +
          '</div>' +
          '<div class="nav-group">' + items + '</div>' +
          '<div class="sidebar-spacer"></div>' +
          '<div class="profile-footer"></div>' +
        '</nav>' +
        '<div class="sidebar-handle" id="sidebarHandle">' +
          '<div class="sidebar-handle-pill"></div>' +
        '</div>' +
      '</div>'
    );
  }

  function buildMobile(active) {
    var items = ITEMS.map(function (i) { return buildNavItem(i, i.key === active, false); }).join('');
    return (
      '<div class="mob-overlay" id="mobOverlay" onclick="closeSidebar()"></div>' +
      '<aside class="mob-sidebar" id="mobSidebar">' +
        '<div class="sidebar-logo mob-sidebar-logo">' +
          '<div class="logo-icon"></div>' +
          '<span class="logo-text">Platypus Plumbing</span>' +
          '<button class="close-btn" onclick="closeSidebar()" aria-label="Close menu">' +
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="nav-group">' + items + '</div>' +
        '<div class="sidebar-spacer"></div>' +
        '<div class="profile-footer"></div>' +
      '</aside>'
    );
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    var mount = document.getElementById('sidebarMount');
    if (!mount) return;
    var active = mount.getAttribute('data-active') || '';

    // Inject CSS
    if (!document.getElementById('sidebar-core-css')) {
      var s = document.createElement('style');
      s.id = 'sidebar-core-css';
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    // Replace mount point with desktop sidebar
    var tmp = document.createElement('div');
    tmp.innerHTML = buildDesktop(active);
    mount.parentNode.replaceChild(tmp.firstChild, mount);

    // Inject mobile overlay + sidebar immediately before .layout
    var layout = document.querySelector('.layout');
    if (layout) {
      var mob = document.createElement('div');
      mob.innerHTML = buildMobile(active);
      while (mob.firstChild) {
        layout.parentNode.insertBefore(mob.firstChild, layout);
      }
    }

    // Wire up nav item navigation via data-href (avoids inline onclick handlers)
    document.querySelectorAll('.nav-item[data-href]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        location.href = btn.getAttribute('data-href');
      });
    });

    // openSidebar / closeSidebar (called from ham-btn and close-btn)
    window.openSidebar = function () {
      document.getElementById('mobSidebar').classList.add('is-open');
      document.getElementById('mobOverlay').classList.add('is-visible');
    };
    window.closeSidebar = function () {
      document.getElementById('mobSidebar').classList.remove('is-open');
      document.getElementById('mobOverlay').classList.remove('is-visible');
    };

    // Collapse / expand handle
    var wrap   = document.getElementById('sidebarWrap');
    var handle = document.getElementById('sidebarHandle');
    if (!wrap || !handle) return;

    var EXPANDED = 280, COLLAPSED = 64;
    var dragging = false, startX = 0, wasCollapsed = false;

    function setCollapsed(v) {
      wrap.classList.toggle('is-collapsed', v);
      localStorage.setItem('sidebarCollapsed', v ? '1' : '0');
    }

    handle.addEventListener('click', function () {
      if (dragging) return;
      setCollapsed(!wrap.classList.contains('is-collapsed'));
    });

    handle.addEventListener('mousedown', function (e) {
      dragging = false;
      startX = e.clientX;
      wasCollapsed = wrap.classList.contains('is-collapsed');

      function onMove(ev) {
        var dx = ev.clientX - startX;
        if (Math.abs(dx) > 4) dragging = true;
        if (!dragging) return;
        var newW = (wasCollapsed ? COLLAPSED : EXPANDED) + dx;
        setCollapsed(newW < (EXPANDED + COLLAPSED) / 2);
      }
      function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
        setTimeout(function () { dragging = false; }, 0);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      e.preventDefault();
    });

    // Restore collapse state from previous page
    if (localStorage.getItem('sidebarCollapsed') === '1') setCollapsed(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
