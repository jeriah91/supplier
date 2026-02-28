#!/usr/bin/env node
/**
 * check-components.js
 * Scans prototype HTML files for component class patterns and reports any
 * that don't appear to be documented in the design system's DS array.
 *
 * Usage:  node check-components.js
 * Exit:   0 = all good, 1 = potential new components found
 */

const fs   = require('fs');
const path = require('path');

// ── Known DS component fingerprints ───────────────────────────────────────────
// Map: CSS class (or prefix root) → DS component name.
// Sub-classes of documented components are also listed to suppress noise.
const DS_FINGERPRINTS = {
  // Buttons
  'btn-primary':      'Primary Button',
  'btn-secondary':    'Secondary Button',
  'btn-outline':      'Outline Button',
  'btn-disabled':     'Disabled Button',
  'btn-save':         'Primary Button',
  'btn-cancel':       'Secondary Button',
  'btn-signin':       'Primary Button',
  'btn-continue':     'Primary Button',
  'btn-next':         'Primary Button',
  'btn-back':         'Secondary Button',
  'btn-send':         'Primary Button',
  'pill-btn':         'Pill Button (Active)',
  // Form controls
  'form-input':       'Text Input',
  'form-select':      'Select',
  'form-checkbox':    'Checkbox',
  'form-field':       'Text Input',
  'form-label':       'Text Input',
  'form-fields':      'Text Input',
  'form-area':        'Text Input',
  'inline-edit':      'Inline Field Edit',
  // Badges & Tags
  'tag-caution':      'Tag: Caution',
  'status-approved':  'Status: Approved',
  'status-in-review': 'Status: In Review',
  'status-pill':      'Status Badge (Dot)',
  'status-active':    'Status Badge (Dot)',
  'status-inactive':  'Status Badge (Dot)',
  'status-row':       'Status Badge (Dot)',
  'status-count':     'Status Badge (Dot)',
  'badge':            'Badge: Count',
  // Cards
  'card':             'Basic Card',
  'card-section':     'Basic Card',
  'card-divider':     'Basic Card',
  'card-heading':     'Basic Card',
  'card-logo':        'Basic Card',
  'card-actions':     'Basic Card',
  'card-note':        'Basic Card',
  'notification':     'Notification Card',
  'notif-banner':     'Notification Card',
  'notif-icon':       'Notification Card',
  'notif-body':       'Notification Card',
  'notif-msg':        'Notification Card',
  'notif-dismiss':    'Notification Card',
  // Progress
  'progress-bar':     'Progress Bar',
  'progress-fill':    'Progress Bar',
  'progress-title':   'Progress Bar',
  // Navigation
  'nav-item':         'Sidebar Nav Item',
  'nav-row':          'Sidebar Nav Item',
  'nav-row-mobile':   'Sidebar Nav Item',
  'nav-spacer':       'Sidebar Nav Item',
  'avatar':           'Avatar',
  'tab-switcher':     'Tab Switcher',
  'tab-group':        'Tab Switcher',
  'tab-label':        'Tab Switcher',
  'tab':              'Tab Switcher',
  // Tables
  'data-table':         'Data Table',
  'table-wrap':         'Data Table',
  'table-section':      'Data Table',
  'table-toolbar':      'Data Table',
  'table-inner':        'Data Table',
  'table-scroll-wrap':  'Data Table',
  // Overlays
  'drawer':             'Right Drawer',
  'drawer-overlay':     'Right Drawer',
  'drawer-close':       'Right Drawer',
  'drawer-user-name':   'Right Drawer',
  'modal':              'Modal Dialog',
  'modal-backdrop':     'Modal Dialog',
  // Feedback
  'toast':            'Toast Notification',
  'empty-state':      'Empty State',
};

// ── Prototype pages to scan ────────────────────────────────────────────────────
const PROTOTYPE_PAGES = [
  'login.html',
  'onboarding-welcome.html',
  'onboarding-business-details.html',
  'onboarding-key-contact.html',
  'onboarding-business-address.html',
  'onboarding-compliance-docs.html',
  'onboarding-success.html',
  'portal.html',
  'todo.html',
  'company-details.html',
  'users.html',
  'user-detail.html',
  'add-user.html',
  'mobile-welcome.html',
  'mobile-requirements.html',
  'mobile-requirement-detail.html',
];

// ── Prefixes to ignore (infrastructure / utility classes) ─────────────────────
const IGNORE_PREFIXES = [
  'proto-', 'map-', 'is-', 'no-', 'ds-', 'check-',
  'ap-', 'cd-', 'deact-', 'share-',
  'page-', 'body-', 'main-', 'mob-', 'logo-',
];

// ── Component-like prefixes (candidates for DS documentation) ─────────────────
const COMPONENT_PREFIXES = [
  'btn', 'form', 'card', 'tab', 'drawer', 'modal', 'toast',
  'status', 'badge', 'tag', 'notif', 'avatar', 'progress', 'empty',
  'inline', 'pill', 'table', 'data', 'nav', 'sidebar',
];

const knownClasses  = new Set(Object.keys(DS_FINGERPRINTS));
const dir           = path.dirname(path.resolve(__filename));
const unknownMap    = {}; // cls → Set<pageName>
let   checkedCount  = 0;

for (const page of PROTOTYPE_PAGES) {
  const filePath = path.join(dir, page);
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');
  const classRe = /class=["']([^"']+)["']/g;
  let m;

  while ((m = classRe.exec(html)) !== null) {
    for (const cls of m[1].split(/\s+/)) {
      if (!cls || cls.length < 3) continue;
      if (knownClasses.has(cls)) continue;
      if (IGNORE_PREFIXES.some(p => cls.startsWith(p))) continue;

      const prefix = cls.split('-')[0];
      if (!COMPONENT_PREFIXES.includes(prefix)) continue;

      // Strip common suffix modifiers to find the base class
      const base = cls.replace(/[-_](wrap|inner|item|header|body|footer|label|title|icon|btn|row|col|list|text|desc|link|group|section|panel|card|name|img|tag|meta)$/, '');
      if (knownClasses.has(base)) continue;

      if (!unknownMap[cls]) unknownMap[cls] = new Set();
      unknownMap[cls].add(page);
    }
  }
  checkedCount++;
}

// ── Consolidate by root prefix ─────────────────────────────────────────────────
const grouped = {};
for (const [cls, pages] of Object.entries(unknownMap)) {
  const root = cls.split('-')[0];
  if (!grouped[root]) grouped[root] = { classes: [], pages: new Set() };
  grouped[root].classes.push(cls);
  for (const p of pages) grouped[root].pages.add(p);
}

const entries = Object.entries(grouped);

console.log(`\n🔍  Checked ${checkedCount} prototype page(s)\n`);

if (entries.length === 0) {
  console.log('✅  All component patterns are documented in the design system.\n');
  process.exit(0);
} else {
  console.log(`⚠️   ${entries.length} potential new component pattern(s) found:\n`);
  for (const [root, info] of entries) {
    const classes = info.classes.slice(0, 4).map(c => `.${c}`).join(', ');
    const pages   = [...info.pages].join(', ');
    console.log(`  • ${classes}`);
    console.log(`    Found on: ${pages}\n`);
  }
  console.log('  → Review these patterns and add them to the DS array in design-system.html\n');
  process.exit(1);
}
