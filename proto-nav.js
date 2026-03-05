(function () {
  // Inject canonical CSS
  var s = document.createElement('style');
  s.id = 'proto-nav-css';
  s.textContent =
    '.proto-nav{position:fixed;top:0;left:0;right:0;z-index:9999;height:40px;background:#000;' +
    'display:flex;align-items:center;gap:12px;padding:0 16px;font-family:\'Inter\',system-ui,sans-serif;}' +
    '.proto-nav-library{display:flex;align-items:center;gap:8px;text-decoration:none;color:#fff;' +
    'font-size:14px;font-weight:500;letter-spacing:-0.28px;line-height:24px;white-space:nowrap;' +
    'flex-shrink:0;background:none;border:none;cursor:pointer;font-family:inherit;padding:0;}' +
    '.proto-nav-library:hover{opacity:0.75;}' +
    '.proto-nav-library svg{width:20px;height:20px;flex-shrink:0;}' +
    '.proto-nav-title{flex:1;color:#fff;font-size:14px;font-weight:500;letter-spacing:-0.28px;line-height:24px;}' +
    '.proto-nav-updated{color:rgba(255,255,255,0.5);font-size:13px;font-weight:400;' +
    'letter-spacing:-0.26px;line-height:24px;text-align:right;white-space:nowrap;flex-shrink:0;}' +
    '.updated-short{display:none;}' +
    '@media(max-width:767px){.nav-label{display:none;}.updated-full{display:none;}.updated-short{display:inline;}}';
  document.head.appendChild(s);

  // Find nav element
  var nav = document.querySelector('.proto-nav');
  if (!nav) return;

  var title  = nav.dataset.title  || 'Prototype';
  var mapKey = nav.dataset.mapKey || '';

  var MAP_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>' +
    '</svg>';

  var LIB_SVG =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>' +
    '</svg>';

  // Render nav contents
  nav.innerHTML =
    '<span class="proto-nav-title">' + title + '</span>' +
    (mapKey
      ? '<button data-map-key="' + mapKey + '" class="proto-nav-library proto-nav-map">' +
        MAP_SVG + '<span class="nav-label">Map</span></button>'
      : '') +
    '<a href="index.html" class="proto-nav-library">' +
      LIB_SVG + '<span class="nav-label">Library</span>' +
    '</a>' +
    '<span class="proto-nav-updated" id="protoLastUpdated">' +
      '<span class="updated-full"></span>' +
      '<span class="updated-short"></span>' +
    '</span>';

  // Last updated timestamp
  var d  = new Date(document.lastModified);
  var p  = function (n) { return String(n).padStart(2, '0'); };
  var ds = p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  nav.querySelector('.updated-full').textContent =
    'Last updated ' + ds + ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  nav.querySelector('.updated-short').textContent = ds;

  // Hide when rendered inside an iframe (thumbnail)
  if (window.self !== window.top) {
    nav.style.display = 'none';
    document.body.style.paddingTop = '0';
  }
}());
