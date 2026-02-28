(function () {
  // ── Inject styles ────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent =
    '.map-modal-backdrop{' +
      'position:fixed;inset:0;z-index:10000;' +
      'background:rgba(15,23,42,0.55);' +
      'display:flex;align-items:center;justify-content:center;' +
      'opacity:0;pointer-events:none;' +
      'transition:opacity 0.2s ease;' +
    '}' +
    '.map-modal-backdrop.is-open{opacity:1;pointer-events:auto;}' +
    '.map-modal{' +
      'position:relative;' +
      'width:calc(100vw - 80px);height:calc(100vh - 80px);' +
      'border-radius:16px;overflow:hidden;' +
      'box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);' +
      'transform:scale(0.96);transition:transform 0.2s ease;' +
    '}' +
    '.map-modal-backdrop.is-open .map-modal{transform:scale(1);}' +
    '.map-modal iframe{width:100%;height:100%;border:none;display:block;}' +
    '.map-modal-close{' +
      'position:absolute;top:12px;right:12px;z-index:10;' +
      'width:32px;height:32px;border-radius:50%;' +
      'background:rgba(0,0,0,0.45);border:none;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;' +
      'color:#fff;transition:background 0.15s;' +
    '}' +
    '.map-modal-close:hover{background:rgba(0,0,0,0.7);}' +
    '.map-modal-close svg{width:16px;height:16px;flex-shrink:0;}' +
    /* Button reset + active state for the Map button in proto-nav */
    'button.proto-nav-library{' +
      'background:none;border:none;padding:0;cursor:pointer;font-family:inherit;' +
    '}' +
    'button.proto-nav-library.is-active{' +
      'background:rgba(255,255,255,0.15);border-radius:6px;' +
      'padding:2px 8px;margin:-2px -8px;' +
    '}';
  document.head.appendChild(style);

  // ── Build modal DOM ──────────────────────────────────────────────────────────
  var backdrop = document.createElement('div');
  backdrop.className = 'map-modal-backdrop';

  var modal = document.createElement('div');
  modal.className = 'map-modal';

  var closeBtn = document.createElement('button');
  closeBtn.className = 'map-modal-close';
  closeBtn.setAttribute('aria-label', 'Close map');
  closeBtn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
      '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>' +
    '</svg>';

  var frame = document.createElement('iframe');
  frame.id = 'mapModalFrame';

  modal.appendChild(closeBtn);
  modal.appendChild(frame);
  backdrop.appendChild(modal);

  function attach() { document.body.appendChild(backdrop); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // ── Open / Close ─────────────────────────────────────────────────────────────
  function getMapBtn() { return document.querySelector('.proto-nav-map'); }

  function openMapModal(currentKey) {
    if (backdrop.classList.contains('is-open')) {
      closeMapModal();
      return;
    }
    frame.src = 'map.html' + (currentKey ? '?current=' + currentKey : '');
    backdrop.classList.add('is-open');
    var btn = getMapBtn();
    if (btn) btn.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMapModal() {
    backdrop.classList.remove('is-open');
    setTimeout(function () { frame.src = ''; }, 220);
    var btn = getMapBtn();
    if (btn) btn.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  // Map button — event delegation, reads key from data attribute (no inline JS)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.proto-nav-map');
    if (!btn) return;
    var key = btn.getAttribute('data-map-key') || '';
    openMapModal(key);
  });

  // Close on backdrop click
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeMapModal();
  });

  // Close button
  closeBtn.addEventListener('click', closeMapModal);

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      closeMapModal();
    }
  });
})();
