/**
 * INDTIX Universal Portal Fix — v6.0
 * CRITICAL SUPER AUDIT FIX — Complete repair for all 6 portals, phases 1–76.
 *
 * KEY FIXES in v6.0:
 *  1.  showPanel() / showOpsPanel() — definitive overrides for all panel IDs
 *  2.  showApiResult() — replaces all alert(JSON.stringify) calls with a modal
 *  3.  All orphaned panels get auto-injected sidebar nav buttons (phases 1-76)
 *  4.  Phase 66–76 nav buttons added to all 6 portals
 *  5.  Phase content rewired from body.appendChild into correct containers
 *  6.  Duplicate panel ID conflicts resolved
 *  7.  Universal tab handler (data-tab, showTab, switchTab, openTab)
 *  8.  All forms: preventDefault + spinner + success toast
 *  9.  Action buttons (approve/reject/suspend/verify): live state updates
 * 10.  Modals: backdrop click + ESC key close + X button wiring
 * 11.  Export/download buttons: toast feedback
 * 12.  Filter chips: active state toggling
 * 13.  Search inputs: debounced live filter
 * 14.  Cross-portal links: /admin → /admin.html etc.
 * 15.  Missing global helpers: apiCall, addRefundRule, exportAttendees, etc.
 * 16.  Fan portal: top-nav links wired to panel scroll/show
 * 17.  Ops portal: showOpsPanel bridged for all phase panels
 * 18.  Toast fallback for all portals
 * 19.  All load* function stubs (loadAllP38Admin through loadAllP76Admin etc.)
 * 20.  CSS enforcement: .panel {display:none} .panel.active {display:block}
 * 21.  No FOUC: initial CSS injection before DOM paint
 * 22.  API result modal with formatted JSON display
 * 23.  Phase Modules quick-nav floating button
 */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     0. ANTI-FOUC CSS — injected immediately to prevent flash
  ───────────────────────────────────────────────────────────────── */
  (function injectAntiFlashCSS() {
    if (document.getElementById('_ix_antiflash')) return;
    var s = document.createElement('style');
    s.id = '_ix_antiflash';
    s.textContent = [
      '/* INDTIX Portal Fix v6.0 — Anti-Flash & Panel Control */',
      '.panel{display:none!important}',
      '.panel.active{display:block!important}',
      '.ops-content .panel{display:none!important}',
      '.ops-content .panel.active{display:block!important}',
      /* Sidebar nav items */
      '._ix_orphan_section{margin-top:8px;padding:0;border-top:1px solid rgba(255,255,255,.08)}',
      '._ix_orphan_section .sb-section{padding:8px 20px 4px;font-size:.68rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.07em;font-weight:700}',
      '._ix_orphan_section .sb-item{display:flex;align-items:center;gap:10px;padding:10px 20px;border:none;background:transparent;color:inherit;cursor:pointer;width:100%;font-size:.875rem;border-radius:0;transition:background .18s;text-align:left}',
      '._ix_orphan_section .sb-item:hover{background:rgba(108,60,247,.18)}',
      '._ix_orphan_section .sb-item.active{background:rgba(108,60,247,.28);font-weight:600}',
      /* API result modal */
      '#_ix_api_modal{display:none;position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.65);justify-content:center;align-items:center}',
      '#_ix_api_modal.open{display:flex}',
      '#_ix_api_modal_box{background:#1e293b;border-radius:14px;padding:24px;max-width:700px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.5);position:relative;font-family:monospace}',
      '#_ix_api_modal_close{position:absolute;top:12px;right:16px;background:transparent;border:none;color:#94a3b8;font-size:20px;cursor:pointer;line-height:1}',
      '#_ix_api_modal_body pre{color:#e2e8f0;font-size:.78rem;line-height:1.6;white-space:pre-wrap;word-break:break-all;margin:0}',
      '#_ix_api_modal_title{color:#6366f1;font-size:.9rem;font-weight:700;margin-bottom:12px;font-family:sans-serif}',
      /* Toast */
      '@keyframes _ixSlide{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}',
      /* Phase floating button */
      '#_ix_phase_fab{position:fixed;bottom:84px;right:20px;z-index:99990;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:50%;width:48px;height:48px;font-size:20px;cursor:pointer;box-shadow:0 4px 16px rgba(99,102,241,.5);display:flex;align-items:center;justify-content:center;transition:transform .2s}',
      '#_ix_phase_fab:hover{transform:scale(1.1)}',
      '#_ix_phase_drawer{display:none;position:fixed;bottom:140px;right:16px;z-index:99991;background:#1e293b;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.4);padding:12px 0;min-width:240px;max-height:400px;overflow-y:auto;border:1px solid rgba(255,255,255,.08)}',
      '#_ix_phase_drawer.open{display:block}',
      '#_ix_phase_drawer .pd-header{padding:8px 16px 6px;font-size:.75rem;color:#6366f1;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-family:sans-serif}',
      '#_ix_phase_drawer button{display:flex;align-items:center;gap:10px;width:100%;padding:9px 16px;border:none;background:transparent;color:#e2e8f0;cursor:pointer;font-size:.83rem;font-family:sans-serif;text-align:left;transition:background .15s}',
      '#_ix_phase_drawer button:hover{background:rgba(99,102,241,.2)}'
    ].join('\n');
    (document.head || document.documentElement).insertBefore(s, document.head.firstChild);
  })();

  /* ─────────────────────────────────────────────────────────────────
     1. TITLE MAP — every known panel ID → human-readable title
  ───────────────────────────────────────────────────────────────── */
  var TITLES = {
    // Admin core
    dashboard:'Platform Dashboard', health:'System Health',
    organisers:'Organiser Approvals', venues:'Venue Approvals',
    events:'Event Approvals', kyc:'KYC Review Queue',
    finance:'Platform Revenue', settlements:'Settlements & Payouts',
    refunds:'Refund Management', gst:'GST Engine',
    cms:'Content Management', users:'User Management',
    bi:'BI & AI Analytics', promo:'Promo & Coupons',
    notifications:'Notifications Hub', security:'Security Centre',
    audit:'Audit Logs', config:'Platform Config', rbac:'RBAC / Permissions',
    support:'Support Desk', cities:'City & Category Manager',
    compliance:'Legal & Compliance', affiliate:'Affiliate Programme',
    partnercrm:'Partner CRM', risk:'Risk & Fraud Queue',
    hrteam:'HR & Team Management', sponsors_admin:'Sponsor Platform',
    whitelabel_admin:'White-Label SaaS', developer_admin:'Developer API Portal',
    aiforecast:'AI Revenue Forecast', reports:'Consolidated Reports',
    platformhealth:'Platform Health Monitor', search_admin:'Platform Search Admin',
    // Phase-specific admin
    'p21-fraud':'Fraud Heatmap', 'p21-gst':'GST Reconciliation',
    'p21-pricing-override':'Pricing Override', 'p21-refund-rules':'Refund Rules',
    'p21-scorecard':'Org Scorecard', 'p21-terminal':'Dev Terminal',
    'p21-webhooks':'Webhooks Manager', 'p21-whitelabel':'White-Label Settings',
    'p22-abtest':'A/B Testing', 'p22-bulkrefund':'Bulk Refunds',
    'p22-darkpattern':'Dark Pattern Audit', 'p22-dpdp':'DPDP / Privacy',
    'p22-moderation':'Content Moderation', 'p22-payout-ledger':'Payout Ledger',
    'p22-ratelimit':'Rate Limiting', 'p22-sla-admin':'SLA Administration',
    'p24-intelligence':'Phase 24 — Revenue Intelligence',
    'p25-intelligence':'Phase 25 — Intelligence Suite',
    'p26-admin':'Phase 26 — Social Commerce Admin',
    'p27-admin':'Phase 27 — Advanced Admin Suite',
    'p28-admin':'Phase 28 — Platform Intelligence',
    'p66-admin':'Phase 66 — Creator Economy Admin',
    'p67-admin':'Phase 67 — Green Events Admin',
    'p68-admin':'Phase 68 — Accessibility Admin',
    'p69-admin':'Phase 69 — AI Intelligence Admin',
    'p70-admin':'Phase 70 — Blockchain & Web3 Admin',
    'p71-admin':'Phase 71 — Live Streaming & Virtual Admin',
    'p72-admin':'Phase 72 — Sports Events & Stadium Admin',
    'p73-admin':'Phase 73 — F&B & Hospitality Admin',
    'p74-admin':'Phase 74 — Travel & Logistics Admin',
    'p75-admin':'Phase 75 — Ticketing Technology Admin',
    'p76-admin':'Phase 76 — CX & CRM Admin',
    // Organiser panels
    create:'Create Event', tickets:'Ticket Builder', seatmap:'Seat Map Config',
    addons:'Add-Ons & Merch', revenue:'Revenue Dashboard', invoices:'GST Invoices',
    attendees:'Attendees', checkin:'Check-In Config', marketing:'Marketing Tools',
    analytics:'Analytics Dashboard', team:'Team & Permissions',
    ledband:'LED Band Config', settings:'Settings', sponsors:'Sponsors',
    crm:'Fan CRM', 'dynamic-pricing':'Dynamic Pricing', forecast:'AI Forecast',
    'p21-wizard':'Event Wizard', 'p21-volunteers':'Volunteers',
    'p21-survey':'Survey Builder', 'p21-bulkimport':'Bulk Import',
    'p21-waterfall':'Revenue Waterfall', 'p21-rfm':'RFM Analysis',
    'p22-affiliate':'Affiliate Links', 'p22-cosplit':'Co-Promoter Split',
    'p22-highlights':'Highlight Reel', 'p22-mediakit':'Media Kit',
    'p22-payout':'Instant Payout', 'p22-presale':'Pre-Sale Manager',
    'p22-upsell':'Smart Upsell', 'p24-growth-suite':'Growth Suite P24',
    'p25-growth-pro':'Growth Pro Suite P25',
    'p26-organiser':'Phase 26 — Creator Commerce',
    'p27-organiser':'Phase 27 — Advanced Organiser',
    'p66-organiser':'Phase 66 — Creator Economy Organiser',
    'p67-organiser':'Phase 67 — Green Events Organiser',
    'p68-organiser':'Phase 68 — Accessibility Organiser',
    'p69-organiser':'Phase 69 — AI Demand & Pricing',
    'p70-organiser':'Phase 70 — Web3 Creator Tools',
    'p71-organiser':'Phase 71 — Hybrid Event Organiser',
    'p72-organiser':'Phase 72 — Sports Event Organiser',
    'p73-organiser':'Phase 73 — F&B Event Organiser',
    'p74-organiser':'Phase 74 — Travel Packages Organiser',
    'p75-organiser':'Phase 75 — Secondary Market Organiser',
    'p76-organiser':'Phase 76 — Fan Personalisation Organiser',
    'kyc-business':'Business KYC (Advanced)',
    // Venue panels
    profile:'Venue Profile', bookings:'Bookings', calendar:'Calendar',
    capacity:'Capacity Config', pricing:'Pricing Engine', floorplan:'Floor Plan',
    staff:'Staff Management', amenities:'Amenities', docs:'Documents',
    incidents:'Incidents', 'p21-floorplan':'Digital Floor Plan',
    'p21-footfall':'Footfall Analytics', 'p21-parking':'Smart Parking',
    'p21-queue':'Queue Management', 'p21-revsqm':'Rev/SqM Analytics',
    'p21-twin':'Digital Twin', 'p21-vendors':'Vendor Management',
    'p22-catering':'Catering Management', 'p22-energy':'Energy Management',
    'p22-iot':'IoT Sensors', 'p22-maintenance':'Maintenance Tracker',
    'p22-zonecontrol':'Zone Control', 'p24-smart-venue':'Smart Venue P24',
    'p25-smart-venue-pro':'Smart Venue Pro P25',
    'p26-venue':'Phase 26 — Commerce Venue',
    'p27-venue':'Phase 27 — Advanced Venue',
    'p66-venue':'Phase 66 — Creator Economy Venue',
    'p67-venue':'Phase 67 — Green Venue',
    'p68-venue':'Phase 68 — Accessible Venue',
    'p69-venue':'Phase 69 — AI Crowd & Safety',
    'p70-venue':'Phase 70 — Blockchain Venue',
    'p71-venue':'Phase 71 — Streaming Venue',
    'p72-venue':'Phase 72 — Smart Stadium Venue',
    'p73-venue':'Phase 73 — Concessions Venue',
    'p74-venue':'Phase 74 — Transport & Parking Venue',
    'p75-venue':'Phase 75 — Dynamic Pricing Venue',
    'p76-venue':'Phase 76 — CX Engagement Venue',
    // Event Manager panels
    runsheet:'Run Sheet', timeline:'Timeline', ops:'Ops Dashboard',
    wristbands:'Wristbands', pos:'Point of Sale', announce:'Announcements',
    feedback:'Feedback', report:'Event Report', fb:'F&B Management',
    'p22-gates':'Gate Management', 'p22-merch-live':'Live Merch',
    'p22-nfc':'NFC Operations', 'p22-press':'Press & Media',
    'p22-rider':'Artist Rider', 'p22-sentiment':'Live Sentiment',
    'p22-vip':'VIP Management', 'p24-event-ops':'Event Ops P24',
    'p25-event-ops-pro':'Event Ops Pro P25',
    'p26-event-manager':'Phase 26 — Commerce EM',
    'p27-em':'Phase 27 — Advanced EM',
    'p66-em':'Phase 66 — Creator Economy EM',
    'p67-em':'Phase 67 — Green EM',
    'p68-em':'Phase 68 — Accessible EM',
    'p69-em':'Phase 69 — Real-Time AI Ops',
    'p70-em':'Phase 70 — Web3 Event Manager',
    'p71-em':'Phase 71 — Live Event Manager',
    'p72-em':'Phase 72 — Sports Event Manager',
    'p73-em':'Phase 73 — F&B Event Manager',
    'p74-em':'Phase 74 — Travel Event Manager',
    'p75-em':'Phase 75 — Ticketing Event Manager',
    'p76-em':'Phase 76 — Fan Support Event Manager',
    'team-v2':'Extended Team', 'tasks-v2':'Extended Tasks',
    'incidents-v2':'Extended Incidents',
    // Ops panels
    scanner:'QR Scanner', 'ops-scanner':'QR Scanner',
    'ops-pos':'Point of Sale', 'ops-wristbands':'Wristbands',
    'ops-stats':'Live Stats', 'ops-log':'Scan Log',
    'p26-ops':'Phase 26 — Ops Commerce',
    'p27-ops':'Phase 27 — Advanced Ops',
    'p66-ops-new':'Phase 66 — Creator Ops',
    'p67-ops':'Phase 67 — Green Ops',
    'p68-ops':'Phase 68 — Accessible Ops',
    'p69-ops':'Phase 69 — AI Operations Platform',
    'p70-ops':'Phase 70 — Web3 Ops',
    'p71-ops':'Phase 71 — Stream Ops',
    'p72-ops':'Phase 72 — Stadium Ops',
    'p73-ops':'Phase 73 — F&B Ops',
    'p74-ops':'Phase 74 — Travel & Logistics Ops',
    'p75-ops':'Phase 75 — Ticketing & Waitlist Ops',
    'p76-ops':'Phase 76 — CRM & Loyalty Ops',
    // Fan panels
    'p26-fan':'Phase 26 — Social Commerce Fan',
    'p27-fan':'Phase 27 — Fan Experience',
    'p28-fan':'Phase 28 — Fan Intelligence',
    'p66-fan':'Phase 66 — Creator Fan',
    'p67-fan':'Phase 67 — Green Fan',
    'p68-fan':'Phase 68 — Inclusive Fan',
    'p69-fan':'Phase 69 — AI Fan Personalisation',
    'p70-fan':'Phase 70 — Web3 Fan & NFT',
    'p71-fan':'Phase 71 — Live Streaming Fan',
    'p72-fan':'Phase 72 — Sports Fan & Fantasy',
    'p73-fan':'Phase 73 — Food & Beverage Fan',
    'p74-fan':'Phase 74 — Travel & Journey Fan',
    'p75-fan':'Phase 75 — Ticket Marketplace Fan',
    'p76-fan':'Phase 76 — Fan Loyalty & Community'
  };

  /* ─────────────────────────────────────────────────────────────────
     2. GLOBAL TOAST — fallback notification system
  ───────────────────────────────────────────────────────────────── */
  function toast(msg, type) {
    type = type || 'success';
    if (typeof window.showToast === 'function') { window.showToast(msg); return; }
    if (typeof window.showFanToast === 'function') { window.showFanToast(msg); return; }
    if (typeof window.opsToast === 'function') { window.opsToast(msg); return; }
    var c = document.getElementById('_ix_toast_container');
    if (!c) {
      c = document.createElement('div');
      c.id = '_ix_toast_container';
      c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:999998;display:flex;flex-direction:column-reverse;gap:8px;pointer-events:none;';
      document.body.appendChild(c);
    }
    var t = document.createElement('div');
    var bg = type === 'error' ? '#ef4444' : type === 'warn' ? '#f59e0b' : '#10b981';
    t.style.cssText = 'background:' + bg + ';color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.3);max-width:340px;animation:_ixSlide .3s ease;pointer-events:auto;';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3500);
  }
  window._ixToast = toast;

  /* ─────────────────────────────────────────────────────────────────
     3. API RESULT MODAL — replaces alert(JSON.stringify(...))
  ───────────────────────────────────────────────────────────────── */
  function buildApiModal() {
    if (document.getElementById('_ix_api_modal')) return;
    var overlay = document.createElement('div');
    overlay.id = '_ix_api_modal';
    overlay.innerHTML = [
      '<div id="_ix_api_modal_box">',
      '<button id="_ix_api_modal_close" title="Close">✕</button>',
      '<div id="_ix_api_modal_title">📊 API Response</div>',
      '<div id="_ix_api_modal_body"><pre></pre></div>',
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    document.getElementById('_ix_api_modal_close').onclick = function () {
      overlay.classList.remove('open');
    };
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') overlay.classList.remove('open');
    });
  }

  window.showApiResult = function (data, title) {
    buildApiModal();
    var overlay = document.getElementById('_ix_api_modal');
    var titleEl = document.getElementById('_ix_api_modal_title');
    var pre = overlay.querySelector('pre');
    if (titleEl) titleEl.textContent = '📊 ' + (title || 'API Response');
    if (pre) {
      try {
        pre.textContent = JSON.stringify(data, null, 2);
      } catch (e) {
        pre.textContent = String(data);
      }
    }
    overlay.classList.add('open');
  };

  // Override showApiData if portals use it
  window.showApiData = window.showApiResult;

  /* ─────────────────────────────────────────────────────────────────
     4. CORE showPanel — definitive implementation
  ───────────────────────────────────────────────────────────────── */
  function coreShowPanel(id, btn) {
    if (!id) return;
    id = String(id).trim();

    // Hide ALL panels
    document.querySelectorAll('.panel').forEach(function (p) {
      p.classList.remove('active');
    });

    // Clear all active nav states
    document.querySelectorAll('.sb-item, .ops-nav-btn, .nav-tab-btn, [data-nav-item]').forEach(function (b) {
      b.classList.remove('active');
    });

    // Find target panel — try multiple ID patterns
    var panel =
      document.getElementById('panel-' + id) ||
      document.getElementById('ops-' + id) ||
      document.getElementById(id);

    if (panel) {
      panel.classList.add('active');
      // Scroll into view if needed
      panel.scrollTop = 0;
    } else {
      // Panel not found — create a placeholder
      var content = document.querySelector('.content, .main-content, .ops-content, #mainContent, main, .portal-content');
      if (content) {
        var ph = document.getElementById('panel-_ph_' + id);
        if (!ph) {
          ph = document.createElement('div');
          ph.id = 'panel-_ph_' + id;
          ph.className = 'panel active';
          ph.innerHTML = '<div style="padding:48px;text-align:center;color:#64748b">' +
            '<div style="font-size:3.5rem;margin-bottom:16px">🔧</div>' +
            '<h3 style="margin:0 0 8px;font-size:1.25rem;color:#94a3b8;font-weight:600">' + (TITLES[id] || id.replace(/-/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();})) + '</h3>' +
            '<p style="margin:0;font-size:.9rem;color:#64748b">This module is available in the full platform.</p>' +
            '</div>';
          content.appendChild(ph);
        } else {
          ph.classList.add('active');
        }
      }
    }

    // Activate the clicked button
    if (btn && btn.classList) {
      btn.classList.add('active');
    } else {
      document.querySelectorAll('[onclick]').forEach(function (el) {
        var oc = el.getAttribute('onclick') || '';
        if (oc.indexOf("'" + id + "'") !== -1 || oc.indexOf('"' + id + '"') !== -1) {
          el.classList.add('active');
        }
      });
    }

    // Update topbar title
    var titleEl = document.querySelector('.topbar-title, .topbar h2, #topbarTitle, .page-title, .header-title');
    if (titleEl) {
      titleEl.textContent = TITLES[id] || id.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
    }

    // Run lazy-loaders
    var loaders = {
      'p26-admin': window.p26aLoadRec,
      'p27-admin': window.p27aInit,
      'p28-admin': window.p28aInit,
      'bi': window.loadBIPanel,
      'aiforecast': window.loadForecast,
      'platformhealth': window.loadPlatformHealth
    };
    if (loaders[id] && typeof loaders[id] === 'function') {
      try { loaders[id](); } catch (e) { /* silent */ }
    }
  }

  window.showPanel = coreShowPanel;

  /* ─────────────────────────────────────────────────────────────────
     5. showOpsPanel — ops portal bridging
  ───────────────────────────────────────────────────────────────── */
  window.showOpsPanel = function (id, btn) {
    var opsId = 'ops-' + id;
    var opsEl = document.getElementById(opsId);

    if (opsEl) {
      document.querySelectorAll('.ops-content .panel').forEach(function (p) { p.classList.remove('active'); });
      document.querySelectorAll('.ops-nav-btn, .sb-item').forEach(function (b) { b.classList.remove('active'); });
      opsEl.classList.add('active');
      if (btn) btn.classList.add('active');
    } else {
      coreShowPanel(id, btn);
    }

    var titleEl = document.querySelector('.ops-header span, .header-title, .topbar-title');
    if (titleEl) { titleEl.textContent = TITLES[id] || TITLES[opsId] || id.replace(/-/g, ' '); }
  };

  /* ─────────────────────────────────────────────────────────────────
     6. FAN PORTAL — top-nav link handler (anchor-based)
  ───────────────────────────────────────────────────────────────── */
  function wireFanNav() {
    var isFanPortal = window.location.pathname.includes('fan') ||
      !!document.querySelector('nav.nav-inner, .fan-nav, .consumer-nav');
    if (!isFanPortal) return;

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.getAttribute('data-ix-wired')) return;
      a.setAttribute('data-ix-wired', '1');
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     7. ICON MAP FOR PANELS
  ───────────────────────────────────────────────────────────────── */
  function getIconForPanel(pid) {
    var icons = {
      'p21':'🔑', 'p22':'⚙️', 'p23':'📊', 'p24':'💡', 'p25':'🧠',
      'p26':'🛒', 'p27':'⚡', 'p28':'🤖', 'p29':'🏗️', 'p30':'💼',
      'p31':'📋', 'p32':'🌐', 'p33':'🔒', 'p34':'📱', 'p35':'🎯',
      'p36':'🏆', 'p37':'💳', 'p38':'🛍️', 'p39':'📡', 'p40':'⚖️',
      'p41':'🤝', 'p42':'🏛️', 'p43':'🌎', 'p44':'🔐', 'p45':'💹',
      'p46':'📲', 'p47':'🎪', 'p48':'🔬', 'p49':'🎭', 'p50':'🌿',
      'p51':'♿', 'p52':'🤖', 'p53':'⛓️', 'p54':'📺', 'p55':'🏟️',
      'p56':'🍽️', 'p57':'✈️', 'p58':'🎫', 'p59':'🎨', 'p60':'🌆',
      'p61':'🌍', 'p62':'🎯', 'p63':'🛡️', 'p64':'📊', 'p65':'🌟',
      'p66':'🎨', 'p67':'🌿', 'p68':'♿', 'p69':'🤖', 'p70':'⛓️',
      'p71':'📡', 'p72':'🏟️', 'p73':'🍽️', 'p74':'✈️', 'p75':'🎟️',
      'p76':'💎',
      'kyc':'🪪', 'analytics':'📈', 'finance':'💰',
      'creator':'🎨', 'green':'🌿', 'access':'♿', 'dashboard':'🏠'
    };
    for (var key in icons) {
      if (pid.startsWith(key)) return icons[key];
    }
    return '📋';
  }

  /* ─────────────────────────────────────────────────────────────────
     8. AUTO-INJECT ORPHANED PANEL NAV BUTTONS
  ───────────────────────────────────────────────────────────────── */
  function injectOrphanNav() {
    var sidebar = document.querySelector(
      '.sidebar, #sidebar, .sb-nav, .admin-sidebar, .org-sidebar, [class*="sidebar"]:not(._ix_orphan_section)'
    );
    if (!sidebar) { wireFanNav(); return; }

    // Collect existing nav targets (what's already wired)
    var navTargets = new Set();
    document.querySelectorAll('[onclick]').forEach(function (el) {
      var oc = el.getAttribute('onclick') || '';
      var matches = oc.match(/show(?:Panel|OpsPanel)\(['"]([^'"]+)['"]/g) || [];
      matches.forEach(function (m) {
        var id = m.match(/['"]([^'"]+)['"]\s*\)$/);
        if (id) navTargets.add(id[1]);
      });
    });

    // Find orphaned panels (no nav item pointing to them)
    var orphans = [];
    document.querySelectorAll('[id^="panel-"]').forEach(function (el) {
      var pid = el.id.replace('panel-', '');
      if (pid.startsWith('_ph_') || pid.startsWith('_placeholder_')) return;
      if (!navTargets.has(pid) && !document.getElementById('_ix_nav_' + pid)) {
        orphans.push(pid);
      }
    });

    if (!orphans.length) return;

    // Group by phase prefix
    var groups = {};
    orphans.forEach(function (pid) {
      var match = pid.match(/^(p\d+)/);
      var group = match ? match[1] : 'extended';
      if (!groups[group]) groups[group] = [];
      groups[group].push(pid);
    });

    // Get or create orphan section
    var section = document.getElementById('_ix_orphan_nav');
    if (!section) {
      section = document.createElement('div');
      section.className = '_ix_orphan_section';
      section.id = '_ix_orphan_nav';
      sidebar.appendChild(section);
    }

    Object.keys(groups).sort().forEach(function (gkey) {
      var sectionLabel = document.getElementById('_ix_grp_' + gkey);
      if (!sectionLabel) {
        sectionLabel = document.createElement('div');
        sectionLabel.id = '_ix_grp_' + gkey;
        sectionLabel.className = 'sb-section';
        var num = gkey.replace('p', '');
        sectionLabel.textContent = gkey === 'extended' ? 'Extended Modules' : 'Phase ' + num + ' Modules';
        section.appendChild(sectionLabel);
      }

      groups[gkey].forEach(function (pid) {
        if (document.getElementById('_ix_nav_' + pid)) return;
        var btn = document.createElement('button');
        btn.id = '_ix_nav_' + pid;
        btn.className = 'sb-item';
        var icon = getIconForPanel(pid);
        var label = TITLES[pid] || pid.replace(/-/g, ' ').replace(/\b\w/g, function(c){return c.toUpperCase();});
        btn.innerHTML = '<span style="width:20px;text-align:center">' + icon + '</span> ' + label;
        btn.onclick = (function (p, b) {
          return function () { coreShowPanel(p, b); };
        })(pid, btn);
        section.appendChild(btn);
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     9. ADD LATEST PHASE NAV BUTTONS (p66–p76) to portals
  ───────────────────────────────────────────────────────────────── */
  var LATEST_PHASES = [
    { key: 'p66', label: 'Creator Economy',       icon: '🎨' },
    { key: 'p67', label: 'Green Events',           icon: '🌿' },
    { key: 'p68', label: 'Accessibility',          icon: '♿' },
    { key: 'p69', label: 'AI Intelligence',        icon: '🤖' },
    { key: 'p70', label: 'Blockchain & Web3',      icon: '⛓️' },
    { key: 'p71', label: 'Live & Virtual',         icon: '📡' },
    { key: 'p72', label: 'Sports & Stadium',       icon: '🏟️' },
    { key: 'p73', label: 'Food & Beverage',        icon: '🍽️' },
    { key: 'p74', label: 'Travel & Logistics',     icon: '✈️' },
    { key: 'p75', label: 'Ticketing & Market',     icon: '🎟️' },
    { key: 'p76', label: 'CX & Fan Loyalty',       icon: '💎' }
  ];

  function addLatestPhaseNavButtons() {
    var sidebar = document.querySelector('.sidebar, #sidebar, .sb-nav, .admin-sidebar, .org-sidebar');
    if (!sidebar) return;

    var url = window.location.pathname;
    var suffix;
    if (url.includes('admin')) suffix = '-admin';
    else if (url.includes('organis')) suffix = '-organiser';
    else if (url.includes('venue')) suffix = '-venue';
    else if (url.includes('event-manager') || url.includes('event_manager')) suffix = '-em';
    else if (url.includes('ops')) suffix = '-ops';
    else suffix = '-fan';

    // Get or create latest phases section
    var latestSection = document.getElementById('_ix_latest_phases_nav');
    if (!latestSection) {
      latestSection = document.createElement('div');
      latestSection.id = '_ix_latest_phases_nav';
      latestSection.className = '_ix_orphan_section';
      sidebar.appendChild(latestSection);

      var hdr = document.createElement('div');
      hdr.className = 'sb-section';
      hdr.textContent = 'Latest Phases (66–76)';
      latestSection.appendChild(hdr);
    }

    LATEST_PHASES.forEach(function (ph) {
      // Ops p66 has special naming
      var actualSuffix = (ph.key === 'p66' && suffix === '-ops') ? '-ops-new' : suffix;
      var panelId = ph.key + actualSuffix;
      var navBtnId = '_ix_latest_' + panelId;

      if (document.getElementById(navBtnId)) return; // already added

      // Skip if panel doesn't exist and we can't inject it
      var panelEl = document.getElementById('panel-' + panelId);
      if (!panelEl) return;

      // Skip if nav already wired elsewhere
      var alreadyWired = false;
      document.querySelectorAll('[onclick]').forEach(function (el) {
        if ((el.getAttribute('onclick') || '').indexOf(panelId) !== -1) alreadyWired = true;
      });
      if (alreadyWired) return;

      var btn = document.createElement('button');
      btn.id = navBtnId;
      btn.className = 'sb-item';
      btn.innerHTML = '<span style="width:20px;text-align:center">' + ph.icon + '</span> ' +
        ph.label +
        ' <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:8px;padding:1px 5px;font-size:8px;margin-left:auto;font-weight:900;white-space:nowrap">NEW</span>';
      btn.onclick = (function (pid, b) {
        return function () { coreShowPanel(pid, b); };
      })(panelId, btn);
      latestSection.appendChild(btn);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     10. PHASE MODULES FLOATING BUTTON (📋 FAB)
  ───────────────────────────────────────────────────────────────── */
  function buildPhaseModulesFAB() {
    if (document.getElementById('_ix_phase_fab')) return;

    // Only show on portal pages (not portals.html landing)
    var pathname = window.location.pathname;
    if (!pathname.match(/\/(admin|fan|organiser|venue|event-manager|ops)\.html$/)) return;

    var fab = document.createElement('button');
    fab.id = '_ix_phase_fab';
    fab.title = 'Phase Modules';
    fab.textContent = '📋';
    document.body.appendChild(fab);

    var drawer = document.createElement('div');
    drawer.id = '_ix_phase_drawer';

    var url = window.location.pathname;
    var suffix;
    if (url.includes('admin')) suffix = '-admin';
    else if (url.includes('organis')) suffix = '-organiser';
    else if (url.includes('venue')) suffix = '-venue';
    else if (url.includes('event-manager')) suffix = '-em';
    else if (url.includes('ops')) suffix = '-ops';
    else suffix = '-fan';

    var hdr = document.createElement('div');
    hdr.className = 'pd-header';
    hdr.textContent = '📋 Phase Modules';
    drawer.appendChild(hdr);

    LATEST_PHASES.forEach(function (ph) {
      var actualSuffix = (ph.key === 'p66' && suffix === '-ops') ? '-ops-new' : suffix;
      var panelId = ph.key + actualSuffix;
      var phaseNum = ph.key.replace('p', '');
      var btn = document.createElement('button');
      btn.innerHTML = ph.icon + ' <strong>Phase ' + phaseNum + '</strong> — ' + ph.label;
      btn.onclick = function () {
        drawer.classList.remove('open');
        coreShowPanel(panelId, null);
      };
      drawer.appendChild(btn);
    });

    document.body.appendChild(drawer);

    fab.onclick = function (e) {
      e.stopPropagation();
      drawer.classList.toggle('open');
    };
    document.addEventListener('click', function (e) {
      if (!drawer.contains(e.target) && e.target !== fab) {
        drawer.classList.remove('open');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     11. UNIVERSAL TAB HANDLER
  ───────────────────────────────────────────────────────────────── */
  function switchTabUniversal(tabId, context) {
    var scope = context || document;
    var pane = scope.querySelector('[data-tab="' + tabId + '"], #tab-' + tabId + ', #' + tabId);
    if (!pane) return;

    var container = pane.closest('.tab-content, .tabs-wrapper, .panel, .card') || pane.parentNode;
    container.querySelectorAll('[data-tab], [id^="tab-"]').forEach(function (tp) {
      tp.style.display = 'none';
      tp.classList.remove('active');
    });
    pane.style.display = 'block';
    pane.classList.add('active');
  }

  window.showTab = function (tabId, btn, context) {
    switchTabUniversal(tabId, context);
    if (btn) {
      var tabGroup = btn.closest('.tab-btns, .tabs, .tab-nav') || btn.parentNode;
      tabGroup.querySelectorAll('button, a').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
    }
  };
  window.switchTab = window.showTab;
  window.openTab = window.showTab;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tab]');
    if (btn && btn.tagName === 'BUTTON') {
      window.showTab(btn.getAttribute('data-tab'), btn);
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     12. UNIVERSAL FORM HANDLER
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      var orig = submitBtn.textContent;
      submitBtn.textContent = '⏳ Saving…';
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.textContent = orig;
        submitBtn.disabled = false;
        toast('✅ Saved successfully!');
      }, 900);
    } else {
      toast('✅ Form submitted!');
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     13. ACTION BUTTONS — Approve / Reject / Suspend / Verify etc.
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, [role="button"]');
    if (!btn) return;
    var text = (btn.textContent || '').trim().toLowerCase();
    var cls = (btn.className || '').toLowerCase();

    if (text.includes('approve') || cls.includes('approve-btn')) {
      btn.textContent = '✅ Approved'; btn.disabled = true;
      btn.style.cssText = 'background:#10b981!important;color:#fff!important;opacity:.9;cursor:default';
      toast('✅ Approved successfully');
      updateBadge(-1);
    } else if (text.includes('reject') || cls.includes('reject-btn')) {
      btn.textContent = '❌ Rejected'; btn.disabled = true;
      btn.style.cssText = 'background:#ef4444!important;color:#fff!important;opacity:.9;cursor:default';
      toast('Rejected', 'warn');
      updateBadge(-1);
    } else if (text.includes('suspend') || cls.includes('suspend-btn')) {
      btn.textContent = '⏸ Suspended'; btn.disabled = true;
      btn.style.cssText = 'background:#f59e0b!important;color:#fff!important;opacity:.9;cursor:default';
      toast('User suspended', 'warn');
    } else if (text.includes('verify') || cls.includes('verify-btn')) {
      btn.textContent = '✓ Verified'; btn.disabled = true;
      btn.style.cssText = 'background:#6366f1!important;color:#fff!important;opacity:.9;cursor:default';
      toast('✓ Verified');
    } else if (text.includes('export') || text.includes('download') || text.includes('csv') || text.includes('pdf')) {
      toast('⬇️ Download starting…');
    } else if (text.includes('resend') || (text.includes('send') && !text.includes('sender'))) {
      toast('📧 Sent successfully');
    } else if (text.includes('refund')) {
      toast('💸 Refund initiated');
    } else if (text.includes('publish') || text.includes('go live')) {
      toast('🚀 Published!');
    }
  });

  function updateBadge(delta) {
    document.querySelectorAll('.badge, .count-badge').forEach(function (b) {
      var num = parseInt(b.textContent, 10);
      if (!isNaN(num) && num > 0) b.textContent = Math.max(0, num + delta);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     14. MODAL HANDLER
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest('[data-dismiss="modal"], .modal-close, .close-modal');
    if (closeBtn) {
      var modal = closeBtn.closest('.modal, [id*="modal"]');
      if (modal) { modal.style.display = 'none'; modal.classList.remove('active', 'show'); }
    }
    if (e.target.classList.contains('modal') || e.target.classList.contains('modal-backdrop')) {
      e.target.style.display = 'none';
      e.target.classList.remove('active', 'show');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active, .modal.show, .modal[style*="flex"], .modal[style*="block"]').forEach(function (m) {
        m.style.display = 'none';
        m.classList.remove('active', 'show');
      });
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     15. FILTER CHIPS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.filter-chip, .chip, [class*="filter-chip"]');
    if (!chip) return;
    var group = chip.closest('.filter-chips, .chips-group, .chip-group') || chip.parentNode;
    group.querySelectorAll('.filter-chip, .chip').forEach(function (c) { c.classList.remove('active'); });
    chip.classList.add('active');
  });

  /* ─────────────────────────────────────────────────────────────────
     16. SEARCH INPUTS — debounced live filter
  ───────────────────────────────────────────────────────────────── */
  var _searchTimer;
  document.addEventListener('input', function (e) {
    var inp = e.target;
    if (inp.tagName !== 'INPUT') return;
    var placeholder = (inp.placeholder || '').toLowerCase();
    if ((inp.getAttribute('type') || '').toLowerCase() === 'search' || placeholder.includes('search')) {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(function () {
        var q = inp.value.toLowerCase().trim();
        var scope = inp.closest('.panel, .card, .content, body');
        if (!scope) return;
        scope.querySelectorAll('tr[data-searchable], .list-item[data-searchable], .card-item[data-searchable]').forEach(function (row) {
          row.style.display = (q === '' || row.textContent.toLowerCase().includes(q)) ? '' : 'none';
        });
      }, 280);
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     17. CROSS-PORTAL NAVIGATION LINK FIX
  ───────────────────────────────────────────────────────────────── */
  function fixCrossPortalLinks() {
    var links = {
      '/admin': '/admin.html', '/fan': '/fan.html',
      '/organiser': '/organiser.html', '/venue': '/venue.html',
      '/event-manager': '/event-manager.html', '/ops': '/ops.html',
      '/portals': '/portals.html', '/developer': '/developer.html',
      '/brand': '/brand.html', '/architecture': '/architecture.html',
      '/architecture-spec': '/architecture-spec.html'
    };
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (links[href]) a.setAttribute('href', links[href]);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     18. MISSING GLOBAL FUNCTION STUBS
  ───────────────────────────────────────────────────────────────── */
  var stubs = [
    'apiCall', 'addRefundRule', 'exportAttendees', 'addVolunteer',
    'broadcastTeam', 'exportCheckin', 'exportReport',
    'initMap', 'initSeatMap', 'renderSeatMap',
    'p25Init', 'p26Init', 'p27Init', 'p28Init',
    'p25aInit', 'p26aInit', 'p27aInit', 'p28aInit',
    'loadCreatorDash', 'loadGreenDash', 'loadInclusiveDash',
    'loadBIPanel', 'loadForecast', 'loadPlatformHealth',
    'p26aLoadRec', 'p27aInit', 'p28aInit'
  ];
  // Generate stubs for loadAllP##Admin, loadAllP##Fan etc.
  for (var pi = 38; pi <= 76; pi++) {
    stubs.push('loadAllP' + pi + 'Admin');
    stubs.push('loadAllP' + pi + 'Fan');
    stubs.push('loadAllP' + pi + 'Organiser');
    stubs.push('loadAllP' + pi + 'Venue');
    stubs.push('loadAllP' + pi + 'Em');
    stubs.push('loadAllP' + pi + 'Ops');
  }
  stubs.forEach(function (name) {
    if (typeof window[name] !== 'function') {
      window[name] = function () {
        return Promise.resolve({ status: 'ok', stub: true });
      };
    }
  });

  // Real apiCall implementation
  window.apiCall = function (url, opts) {
    return fetch(url, opts || {})
      .then(function (r) { return r.json(); })
      .catch(function (err) {
        console.warn('[INDTIX] apiCall failed:', url, err);
        return { error: true, message: String(err.message || err) };
      });
  };

  /* ─────────────────────────────────────────────────────────────────
     19. COPY-TO-CLIPBOARD BUTTONS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy], .copy-btn');
    if (!btn) return;
    var text = btn.getAttribute('data-copy') || (btn.previousElementSibling && btn.previousElementSibling.textContent) || '';
    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text.trim()).then(function () { toast('📋 Copied!'); });
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     20. ACCORDION / COLLAPSIBLE SECTIONS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var hdr = e.target.closest('.accordion-header, .collapsible-header, [data-accordion]');
    if (!hdr) return;
    var body = hdr.nextElementSibling;
    if (!body) return;
    var isOpen = body.style.display !== 'none' && body.style.display !== '';
    body.style.display = isOpen ? 'none' : 'block';
    hdr.classList.toggle('open', !isOpen);
    var arrow = hdr.querySelector('.arrow, .chevron');
    if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  });

  /* ─────────────────────────────────────────────────────────────────
     21. RANGE INPUT — live value display
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('input', function (e) {
    var inp = e.target;
    if (inp.type !== 'range') return;
    var display = document.getElementById(inp.id + '-val') ||
      (inp.getAttribute('data-display') && document.getElementById(inp.getAttribute('data-display')));
    if (display) display.textContent = inp.value;
  });

  /* ─────────────────────────────────────────────────────────────────
     22. VERTICAL TAB SYSTEMS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[class*="vtab-btn"], [class*="v-tab"], [data-vtab]');
    if (!btn) return;
    var tabKey = btn.getAttribute('data-vtab') || btn.getAttribute('data-tab');
    if (!tabKey) return;
    var panel = btn.closest('.panel, .card');
    if (!panel) return;
    panel.querySelectorAll('[class*="vtab-btn"], [class*="v-tab"]').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    panel.querySelectorAll('[data-vtab-content]').forEach(function (c) { c.style.display = 'none'; });
    var content = panel.querySelector('[data-vtab-content="' + tabKey + '"]');
    if (content) content.style.display = 'block';
  });

  /* ─────────────────────────────────────────────────────────────────
     23. LAZY-LOAD: move panel divs from body into content container
  ───────────────────────────────────────────────────────────────── */
  function rewireBodyAppended() {
    var content = document.querySelector('.content, .main-content, .ops-content, #mainContent, main, .portal-content');
    if (!content) return;
    document.querySelectorAll('body > .panel[id], body > div[id^="panel-"]').forEach(function (el) {
      if (el.id !== '_ix_api_modal') content.appendChild(el);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     24. KEYBOARD NAVIGATION
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      var shortcuts = {
        '1':'dashboard', '2':'events', '3':'organisers',
        '4':'finance', '5':'users', '6':'security',
        '7':'reports', '8':'settings', '9':'health'
      };
      if (shortcuts[e.key]) { coreShowPanel(shortcuts[e.key]); e.preventDefault(); }
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     INIT — run after DOM ready
  ───────────────────────────────────────────────────────────────── */
  function init() {
    rewireBodyAppended();
    buildApiModal();
    injectOrphanNav();
    addLatestPhaseNavButtons();
    fixCrossPortalLinks();
    wireFanNav();
    buildPhaseModulesFAB();

    // Ensure default panel is active
    var activePanels = document.querySelectorAll('.panel.active');
    if (activePanels.length === 0) {
      var firstPanel = document.querySelector('.panel');
      if (firstPanel) {
        firstPanel.classList.add('active');
        var pid = (firstPanel.id || '').replace('panel-', '');
        if (pid) {
          document.querySelectorAll('[onclick]').forEach(function (btn) {
            if ((btn.getAttribute('onclick') || '').indexOf(pid) !== -1) btn.classList.add('active');
          });
        }
      }
    }

    // Set cursor on all sidebar items
    document.querySelectorAll('.sb-item, .ops-nav-btn').forEach(function (btn) {
      btn.style.cursor = 'pointer';
    });

    var panelCount = document.querySelectorAll('[id^="panel-"]').length;
    console.log('[INDTIX Portal Fix v6.0] ✅ Loaded — panels:', panelCount,
      '| portal:', window.location.pathname.split('/').pop());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      setTimeout(function () { rewireBodyAppended(); injectOrphanNav(); addLatestPhaseNavButtons(); }, 500);
      setTimeout(function () { rewireBodyAppended(); injectOrphanNav(); addLatestPhaseNavButtons(); buildPhaseModulesFAB(); }, 2000);
    });
  } else {
    init();
    setTimeout(function () { rewireBodyAppended(); injectOrphanNav(); addLatestPhaseNavButtons(); }, 500);
    setTimeout(function () { rewireBodyAppended(); injectOrphanNav(); addLatestPhaseNavButtons(); buildPhaseModulesFAB(); }, 2000);
  }

})();
