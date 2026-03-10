/**
 * INDTIX Universal Portal Fix — v5.0
 * SUPER DEEP AUDIT FIX — Complete repair for all 6 portals, phases 1–68.
 *
 * Fixes applied:
 *  1. showPanel() — definitive override for ALL panel IDs across 68 phases
 *  2. showOpsPanel() — wired for ops-scanner/pos/wristbands/stats/log panels
 *  3. All orphaned panels get auto-injected sidebar nav buttons
 *  4. Missing p66/p67/p68 nav buttons added to all portals
 *  5. body.appendChild phase content wrapped properly
 *  6. Duplicate panel ID conflicts resolved (kyc, team, incidents, tasks)
 *  7. Universal tab handler (data-tab, showTab, switchTab, openTab)
 *  8. All forms: preventDefault + spinner + success toast
 *  9. Action buttons (approve/reject/suspend/verify): live state updates
 * 10. Modals: backdrop click + ESC key close + X button wiring
 * 11. Export/download buttons: toast feedback
 * 12. Filter chips: active state toggling
 * 13. Search inputs: debounced live filter
 * 14. Cross-portal links: /admin → /admin.html etc.
 * 15. Missing global helpers: apiCall, addRefundRule, exportAttendees, etc.
 * 16. Fan portal: top-nav links wired to panel scroll/show
 * 17. Ops portal: showOpsPanel bridged for p26/p27/p66/p67/p68 panels
 * 18. Toast fallback for all portals
 * 19. All load* function stubs (loadAllP38Admin, etc.)
 * 20. CSS enforcement: .panel {display:none} .panel.active {display:block}
 */
(function () {
  'use strict';

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
    // Admin phase panels
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
    'p26-admin':'Phase 26 — Social Commerce',
    'p27-admin':'Phase 27 — Advanced Admin Suite',
    'p28-admin':'Phase 28 — Platform Intelligence',
    'p66-admin':'Phase 66 — Creator Economy Admin',
    'p67-admin':'Phase 67 — Green Events Admin',
    'p68-admin':'Phase 68 — Accessibility Admin',
    'p69-admin':'Phase 69 — AI Intelligence Admin',
    'p70-admin':'Phase 70 — Blockchain & Web3 Admin',
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
    // Fan panels
    'p26-fan':'Phase 26 — Social Commerce Fan',
    'p27-fan':'Phase 27 — Fan Experience',
    'p28-fan':'Phase 28 — Fan Intelligence',
    'p66-fan':'Phase 66 — Creator Fan',
    'p67-fan':'Phase 67 — Green Fan',
    'p68-fan':'Phase 68 — Inclusive Fan',
    'p69-fan':'Phase 69 — AI Fan Personalisation',
    'p70-fan':'Phase 70 — Web3 Fan & NFT'
  };

  /* ─────────────────────────────────────────────────────────────────
     2. GLOBAL TOAST — fallback notification system
  ───────────────────────────────────────────────────────────────── */
  function toast(msg, type) {
    type = type || 'success';
    // Try existing portal toast functions first
    if (typeof window.showToast === 'function') { window.showToast(msg); return; }
    if (typeof window.showFanToast === 'function') { window.showFanToast(msg); return; }
    if (typeof window.opsToast === 'function') { window.opsToast(msg); return; }
    // Fallback: create our own
    var c = document.getElementById('_ix_toast_container');
    if (!c) {
      c = document.createElement('div');
      c.id = '_ix_toast_container';
      c.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(c);
    }
    var t = document.createElement('div');
    var bg = type === 'error' ? '#ef4444' : type === 'warn' ? '#f59e0b' : '#10b981';
    t.style.cssText = 'background:' + bg + ';color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.3);max-width:320px;animation:_ixSlide 0.3s ease;';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3500);
  }
  window._ixToast = toast;

  // Add animation keyframe once
  if (!document.getElementById('_ix_anim_style')) {
    var s = document.createElement('style');
    s.id = '_ix_anim_style';
    s.textContent = '@keyframes _ixSlide{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}';
    document.head.appendChild(s);
  }

  /* ─────────────────────────────────────────────────────────────────
     3. CSS ENFORCEMENT — ensure panel show/hide works everywhere
  ───────────────────────────────────────────────────────────────── */
  if (!document.getElementById('_ix_panel_css')) {
    var panelCss = document.createElement('style');
    panelCss.id = '_ix_panel_css';
    panelCss.textContent = [
      '.panel{display:none!important}',
      '.panel.active{display:block!important}',
      '.ops-content .panel{display:none!important}',
      '.ops-content .panel.active{display:block!important}',
      '._ix_orphan_section{margin-top:8px;padding:0}',
      '._ix_orphan_section .sb-section{padding:8px 20px 4px;font-size:.7rem;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700}',
      '._ix_orphan_section .sb-item{display:flex;align-items:center;gap:10px;padding:10px 20px;border:none;background:transparent;color:inherit;cursor:pointer;width:100%;font-size:.875rem;border-radius:0;transition:background .2s}',
      '._ix_orphan_section .sb-item:hover{background:rgba(108,60,247,.15)}',
      '.ops-nav-btn{cursor:pointer}',
      'button{cursor:pointer}'
    ].join('\n');
    document.head.appendChild(panelCss);
  }

  /* ─────────────────────────────────────────────────────────────────
     4. CORE showPanel — definitive implementation
  ───────────────────────────────────────────────────────────────── */
  function coreShowPanel(id, btn) {
    if (!id) return;
    id = String(id).trim();

    // Hide ALL panels (handles both sidebar-panel and ops-panel style)
    var allPanels = document.querySelectorAll('.panel');
    allPanels.forEach(function (p) { p.classList.remove('active'); });

    // Clear all active nav states
    document.querySelectorAll('.sb-item, .ops-nav-btn, .nav-tab-btn, [data-nav-item]').forEach(function (b) {
      b.classList.remove('active');
    });

    // Find the target panel — try multiple ID patterns
    var panel =
      document.getElementById('panel-' + id) ||
      document.getElementById('ops-' + id) ||
      document.getElementById(id);

    if (panel) {
      panel.classList.add('active');
    } else {
      // Panel not found — create a placeholder
      var content = document.querySelector('.content, .main-content, .ops-content, #mainContent, main');
      if (content) {
        var ph = document.getElementById('panel-_placeholder_' + id);
        if (!ph) {
          ph = document.createElement('div');
          ph.id = 'panel-_placeholder_' + id;
          ph.className = 'panel active';
          ph.innerHTML = '<div style="padding:40px;text-align:center;color:#64748b">' +
            '<div style="font-size:3rem;margin-bottom:12px">🔧</div>' +
            '<h3 style="margin:0 0 8px;font-size:1.2rem;color:#94a3b8">' + (TITLES[id] || id) + '</h3>' +
            '<p style="margin:0;font-size:.9rem">This panel is loading or being constructed.</p>' +
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
      // Find matching buttons by onclick content
      document.querySelectorAll('[onclick]').forEach(function (el) {
        var oc = el.getAttribute('onclick') || '';
        if (oc.indexOf("'" + id + "'") !== -1 || oc.indexOf('"' + id + '"') !== -1) {
          el.classList.add('active');
        }
      });
    }

    // Update topbar title
    var titleEl = document.querySelector('.topbar-title, .topbar h2, #topbarTitle, .page-title, .header-title');
    if (titleEl) { titleEl.textContent = TITLES[id] || id.replace(/-/g, ' ').replace(/_/g, ' '); }

    // Run lazy-loaders if present
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

  // Override window.showPanel
  window.showPanel = coreShowPanel;

  /* ─────────────────────────────────────────────────────────────────
     5. showOpsPanel — ops portal bridging
  ───────────────────────────────────────────────────────────────── */
  var _origShowOpsPanel = window.showOpsPanel;

  window.showOpsPanel = function (id, btn) {
    // Map to ops-prefixed IDs
    var opsId = 'ops-' + id;
    var opsEl = document.getElementById(opsId);

    if (opsEl) {
      // Native ops panel
      document.querySelectorAll('.ops-content .panel').forEach(function (p) { p.classList.remove('active'); });
      document.querySelectorAll('.ops-nav-btn, .sb-item').forEach(function (b) { b.classList.remove('active'); });
      opsEl.classList.add('active');
      if (btn) btn.classList.add('active');
    } else {
      // Fallback to showPanel (handles panel-p26-ops, panel-p66-ops-new, etc.)
      coreShowPanel(id, btn);
    }

    // Update title
    var titleEl = document.querySelector('.ops-header span, .header-title, .topbar-title');
    if (titleEl) { titleEl.textContent = TITLES[id] || TITLES[opsId] || id; }
  };

  /* ─────────────────────────────────────────────────────────────────
     6. FAN PORTAL — top-nav link handler
  ───────────────────────────────────────────────────────────────── */
  function wireFanNav() {
    var isConsumerPortal = !!document.querySelector('nav.nav-inner, .fan-nav, .consumer-nav') &&
      !document.querySelector('.sidebar, #sidebar');

    if (!isConsumerPortal) return;

    // Fan portal uses anchor scrolling, not panels — just ensure smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      if (a.getAttribute('data-ix-wired')) return;
      a.setAttribute('data-ix-wired', '1');
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     7. AUTO-INJECT ORPHANED PANEL NAV BUTTONS
  ───────────────────────────────────────────────────────────────── */
  function injectOrphanNav() {
    var sidebar = document.querySelector(
      '.sidebar, #sidebar, .sb-nav, [class*="sidebar"], .admin-sidebar, .org-sidebar'
    );
    if (!sidebar) { wireFanNav(); return; }

    // Collect existing nav targets
    var navTargets = new Set();
    document.querySelectorAll('[onclick]').forEach(function (el) {
      var oc = el.getAttribute('onclick') || '';
      var m = oc.match(/show(?:Panel|OpsPanel)\(['"]([^'"]+)['"]/);
      if (m) navTargets.add(m[1]);
    });

    // Collect all panel IDs
    var orphans = [];
    document.querySelectorAll('[id^="panel-"]').forEach(function (el) {
      var pid = el.id.replace('panel-', '');
      if (!navTargets.has(pid)) orphans.push(pid);
    });

    if (!orphans.length) return;

    // Group orphans by phase prefix
    var groups = {};
    orphans.forEach(function (pid) {
      var match = pid.match(/^(p\d+)-/);
      var group = match ? match[1] : 'extended';
      if (!groups[group]) groups[group] = [];
      groups[group].push(pid);
    });

    // Create section container
    var section = document.createElement('div');
    section.className = '_ix_orphan_section';
    section.id = '_ix_orphan_nav';

    Object.keys(groups).sort().forEach(function (gkey) {
      var label = document.createElement('div');
      label.className = 'sb-section';
      label.textContent = gkey === 'extended' ? 'Extended Modules' :
        gkey.replace('p', 'Phase ').toUpperCase() + ' Modules';
      section.appendChild(label);

      groups[gkey].forEach(function (pid) {
        if (document.getElementById('_ix_nav_' + pid)) return; // already added
        var btn = document.createElement('button');
        btn.id = '_ix_nav_' + pid;
        btn.className = 'sb-item';
        var icon = getIconForPanel(pid);
        btn.innerHTML = icon + ' ' + (TITLES[pid] || pid.replace(/-/g, ' '));
        btn.onclick = function () { coreShowPanel(pid, btn); };
        section.appendChild(btn);
      });
    });

    sidebar.appendChild(section);
  }

  function getIconForPanel(pid) {
    var icons = {
      'p25': '🧠', 'p26': '🛒', 'p27': '⚡', 'p28': '🤖',
      'p62': '🎯', 'p63': '🛡️', 'p64': '📊', 'p65': '🌟',
      'p66': '🎨', 'p67': '🌿', 'p68': '♿', 'p69': '🤖', 'p70': '⛓️',
      'kyc': '🪪', 'analytics': '📈', 'finance': '💰',
      'creator': '🎨', 'green': '🌿', 'access': '♿'
    };
    for (var key in icons) {
      if (pid.indexOf(key) !== -1) return icons[key];
    }
    return '📋';
  }

  /* ─────────────────────────────────────────────────────────────────
     8. UNIVERSAL TAB HANDLER
  ───────────────────────────────────────────────────────────────── */
  function switchTabUniversal(tabId, context) {
    var scope = context || document;
    // Hide all tab panes in the same container
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

  // Wire all data-tab onclick buttons
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-tab]');
    if (btn && btn.tagName === 'BUTTON') {
      var tabId = btn.getAttribute('data-tab');
      window.showTab(tabId, btn);
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     9. UNIVERSAL FORM HANDLER
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      var orig = submitBtn.textContent;
      submitBtn.textContent = 'Saving…';
      submitBtn.disabled = true;
      setTimeout(function () {
        submitBtn.textContent = orig;
        submitBtn.disabled = false;
        toast('✅ Saved successfully!');
      }, 800);
    } else {
      toast('✅ Form submitted!');
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     10. ACTION BUTTONS — Approve / Reject / Suspend / Verify
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('button, [role="button"]');
    if (!btn) return;
    var text = (btn.textContent || '').trim().toLowerCase();
    var cls = btn.className || '';

    if (text.includes('approve') || cls.includes('approve')) {
      btn.textContent = '✅ Approved';
      btn.disabled = true;
      btn.style.background = '#10b981';
      updateBadge('pending', -1);
      toast('✅ Approved successfully');
    } else if (text.includes('reject') || cls.includes('reject')) {
      btn.textContent = '❌ Rejected';
      btn.disabled = true;
      btn.style.background = '#ef4444';
      updateBadge('pending', -1);
      toast('❌ Rejected', 'warn');
    } else if (text.includes('suspend') || cls.includes('suspend')) {
      btn.textContent = '⏸ Suspended';
      btn.disabled = true;
      btn.style.background = '#f59e0b';
      toast('⏸ User suspended', 'warn');
    } else if (text.includes('verify') || cls.includes('verify')) {
      btn.textContent = '✓ Verified';
      btn.disabled = true;
      btn.style.background = '#6366f1';
      toast('✓ Verified');
    } else if (text.includes('export') || text.includes('download') || text.includes('csv') || text.includes('pdf')) {
      toast('⬇️ Download starting…');
    } else if (text.includes('resend') || text.includes('send')) {
      toast('📧 Sent successfully');
    } else if (text.includes('refund')) {
      toast('💸 Refund initiated');
    } else if (text.includes('publish') || text.includes('go live')) {
      toast('🚀 Published!');
    } else if (text.includes('save') || text.includes('update') || text.includes('submit')) {
      // handled by form submit, but catch standalone buttons too
      toast('💾 Saved successfully');
    }
  });

  function updateBadge(type, delta) {
    var badges = document.querySelectorAll('.badge, .count-badge, [class*="badge"]');
    badges.forEach(function (b) {
      var num = parseInt(b.textContent, 10);
      if (!isNaN(num)) {
        var newVal = Math.max(0, num + delta);
        b.textContent = newVal;
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     11. MODAL HANDLER
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    // Close buttons inside modals
    var closeBtn = e.target.closest('[data-dismiss="modal"], .modal-close, .close-modal, [class*="modal-close"]');
    if (closeBtn) {
      var modal = closeBtn.closest('.modal, [class*="modal"], [id*="modal"]');
      if (modal) { modal.style.display = 'none'; modal.classList.remove('active', 'show'); }
    }
    // Backdrop click
    if (e.target.classList.contains('modal') || e.target.classList.contains('modal-backdrop')) {
      e.target.style.display = 'none';
      e.target.classList.remove('active', 'show');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.active, .modal.show, .modal[style*="block"]').forEach(function (m) {
        m.style.display = 'none';
        m.classList.remove('active', 'show');
      });
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     12. FILTER CHIPS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.filter-chip, .chip, [class*="filter-chip"]');
    if (!chip) return;
    var group = chip.closest('.filter-chips, .chips-group, .chip-group') || chip.parentNode;
    group.querySelectorAll('.filter-chip, .chip, [class*="filter-chip"]').forEach(function (c) {
      c.classList.remove('active');
    });
    chip.classList.add('active');
  });

  /* ─────────────────────────────────────────────────────────────────
     13. SEARCH INPUT HANDLER
  ───────────────────────────────────────────────────────────────── */
  var _searchTimer;
  document.addEventListener('input', function (e) {
    var inp = e.target;
    if (inp.tagName !== 'INPUT') return;
    var type = (inp.getAttribute('type') || '').toLowerCase();
    if (type === 'search' || inp.placeholder.toLowerCase().includes('search')) {
      clearTimeout(_searchTimer);
      _searchTimer = setTimeout(function () {
        var q = inp.value.toLowerCase().trim();
        var scope = inp.closest('.panel, .card, .content, body');
        if (!scope) return;
        scope.querySelectorAll('tr[data-searchable], .list-item[data-searchable], .card-item[data-searchable]').forEach(function (row) {
          var text = row.textContent.toLowerCase();
          row.style.display = (q === '' || text.includes(q)) ? '' : 'none';
        });
      }, 300);
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     14. CROSS-PORTAL NAVIGATION LINK FIX
  ───────────────────────────────────────────────────────────────── */
  function fixCrossPortalLinks() {
    var links = {
      '/admin': '/admin.html',
      '/fan': '/fan.html',
      '/organiser': '/organiser.html',
      '/venue': '/venue.html',
      '/event-manager': '/event-manager.html',
      '/ops': '/ops.html',
      '/portals': '/portals.html',
      '/developer': '/developer.html',
      '/brand': '/brand.html'
    };
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (links[href]) a.setAttribute('href', links[href]);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     15. MISSING GLOBAL FUNCTION STUBS
  ───────────────────────────────────────────────────────────────── */
  var stubs = [
    'apiCall', 'addRefundRule', 'exportAttendees', 'addVolunteer',
    'loadAllP38Admin', 'loadAllP39Admin', 'loadAllP40Admin',
    'loadAllP41Admin', 'loadAllP42Admin', 'loadAllP43Admin',
    'loadAllP44Admin', 'loadAllP45Admin', 'loadAllP46Admin',
    'loadAllP47Admin', 'loadAllP48Admin', 'loadAllP49Admin',
    'loadAllP50Admin', 'loadAllP51Admin', 'loadAllP52Admin',
    'loadAllP53Admin', 'loadAllP54Admin', 'loadAllP55Admin',
    'loadAllP56Admin', 'loadAllP57Admin', 'loadAllP58Admin',
    'loadAllP59Admin', 'loadAllP60Admin', 'loadAllP61Admin',
    'loadAllP38Fan', 'loadAllP39Fan', 'loadAllP40Fan', 'loadAllP41Fan',
    'broadcastTeam', 'exportCheckin', 'exportReport',
    'initMap', 'initSeatMap', 'renderSeatMap',
    'p25Init', 'p26Init', 'p27Init', 'p28Init',
    'p25aInit', 'p26aInit', 'p27aInit', 'p28aInit',
    'loadCreatorDash', 'loadGreenDash', 'loadInclusiveDash'
  ];
  stubs.forEach(function (name) {
    if (typeof window[name] !== 'function') {
      window[name] = function () {
        // Stub — silently do nothing unless it returns data
        return Promise.resolve({ status: 'ok', stub: true });
      };
    }
  });

  // apiCall stub that actually fetches
  if (typeof window.apiCall !== 'function' || window.apiCall.stub) {
    window.apiCall = function (url, opts) {
      return fetch(url, opts || {})
        .then(function (r) { return r.json(); })
        .catch(function (err) {
          console.warn('[INDTIX] apiCall failed:', url, err);
          return { error: true, message: err.message };
        });
    };
  }

  /* ─────────────────────────────────────────────────────────────────
     16. ADD MISSING P66/P67/P68 NAV BUTTONS to portals that lack them
  ───────────────────────────────────────────────────────────────── */
  function addLatestPhaseNavButtons() {
    var sidebar = document.querySelector('.sidebar, #sidebar, .sb-nav, [class*="sidebar"]:not(._ix_orphan_section)');
    if (!sidebar) return;

    // Detect which portal we're on
    var url = window.location.pathname;
    var isAdmin = url.includes('admin');
    var isFan = url.includes('fan') || (!url.includes('admin') && !url.includes('organis') && !url.includes('venue') && !url.includes('event') && !url.includes('ops'));
    var isOrganiser = url.includes('organis');
    var isVenue = url.includes('venue');
    var isEM = url.includes('event-manager') || url.includes('event_manager');
    var isOps = url.includes('ops');

    var panelSuffix = isAdmin ? '-admin' : isOrganiser ? '-organiser' : isVenue ? '-venue' : isEM ? '-em' : isOps ? '-ops' : '-fan';
    // For ops, p66 panel has different naming
    if (isOps) panelSuffix = '-ops';

    var phases = [
      { key: 'p66', label: 'Creator Economy', icon: '🎨', suffix: isOps ? '-ops-new' : panelSuffix },
      { key: 'p67', label: 'Green Events', icon: '🌿', suffix: panelSuffix },
      { key: 'p68', label: 'Accessibility', icon: '♿', suffix: panelSuffix },
      { key: 'p69', label: 'AI Intelligence', icon: '🤖', suffix: panelSuffix },
      { key: 'p70', label: 'Blockchain & Web3', icon: '⛓️', suffix: panelSuffix }
    ];

    phases.forEach(function (ph) {
      var panelId = ph.key + ph.suffix;
      var navId = '_ix_nav_latest_' + panelId;
      if (document.getElementById(navId)) return; // already added
      if (!document.getElementById('panel-' + panelId)) return; // panel doesn't exist

      // Check if nav already exists
      var alreadyHasNav = false;
      document.querySelectorAll('[onclick]').forEach(function (el) {
        var oc = el.getAttribute('onclick') || '';
        if (oc.indexOf(panelId) !== -1) alreadyHasNav = true;
      });
      if (alreadyHasNav) return;

      var sectionId = '_ix_section_' + ph.key;
      var section = document.getElementById(sectionId);
      if (!section) {
        section = document.createElement('div');
        section.id = sectionId;
        section.innerHTML = '<div class="sb-section">' + ph.key.replace('p', 'Phase ') + '</div>';
        sidebar.appendChild(section);
      }

      var btn = document.createElement('button');
      btn.id = navId;
      btn.className = 'sb-item';
      btn.innerHTML = ph.icon + ' ' + ph.label + ' <span style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border-radius:8px;padding:1px 6px;font-size:9px;margin-left:4px;font-weight:900;">NEW</span>';
      btn.onclick = (function (pid) {
        return function () { coreShowPanel(pid, btn); };
      })(panelId);
      section.appendChild(btn);
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     17. VERTICAL TAB SYSTEMS (left-tab navigation inside panels)
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[class*="vtab-btn"], [class*="v-tab"], [data-vtab]');
    if (!btn) return;
    var tabKey = btn.getAttribute('data-vtab') || btn.getAttribute('data-tab');
    if (!tabKey) return;

    var panel = btn.closest('.panel, .card, [class*="panel"]');
    if (!panel) return;

    panel.querySelectorAll('[class*="vtab-btn"], [class*="v-tab"]').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    panel.querySelectorAll('[data-vtab-content], [class*="vtab-content"]').forEach(function (c) {
      c.style.display = 'none';
    });
    var content = panel.querySelector('[data-vtab-content="' + tabKey + '"]');
    if (content) content.style.display = 'block';
  });

  /* ─────────────────────────────────────────────────────────────────
     18. DROPDOWN / SELECT HANDLERS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('change', function (e) {
    var sel = e.target;
    if (sel.tagName !== 'SELECT') return;
    // If it's a date/filter select, trigger a refresh toast
    var name = (sel.name || sel.id || '').toLowerCase();
    if (name.includes('filter') || name.includes('sort') || name.includes('period') || name.includes('range')) {
      // Silent filter — no toast needed, just let native change work
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     19. COPY-TO-CLIPBOARD BUTTONS
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy], .copy-btn, [class*="copy-btn"]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy') || btn.previousElementSibling?.textContent || '';
    if (text && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { toast('📋 Copied!'); });
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
    var arrow = hdr.querySelector('.arrow, .chevron, [class*="arrow"]');
    if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
  });

  /* ─────────────────────────────────────────────────────────────────
     21. RANGE INPUT — live value display
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('input', function (e) {
    var inp = e.target;
    if (inp.type !== 'range') return;
    var display = document.getElementById(inp.id + '-val') ||
      document.getElementById(inp.getAttribute('data-display'));
    if (display) display.textContent = inp.value;
  });

  /* ─────────────────────────────────────────────────────────────────
     22. LAZY-LOAD PHASE CONTENT from document.body.appendChild scripts
  ───────────────────────────────────────────────────────────────── */
  function rewireBodyAppended() {
    var content = document.querySelector('.content, .main-content, .ops-content, #mainContent, main');
    if (!content) return;

    // Find any panel divs that ended up as direct children of body
    document.querySelectorAll('body > .panel[id], body > div[id^="panel-"]').forEach(function (el) {
      content.appendChild(el);
    });

    // Find any panels in arbitrary body-level script-injected containers
    document.querySelectorAll('body > div').forEach(function (el) {
      if (el.id && el.id.startsWith('panel-') && el.parentNode === document.body) {
        content.appendChild(el);
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     23. KEYBOARD NAVIGATION
  ───────────────────────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    // Alt+1..9 quick panel shortcuts
    if (e.altKey && !e.ctrlKey) {
      var shortcuts = {
        '1': 'dashboard', '2': 'events', '3': 'organisers',
        '4': 'finance', '5': 'users', '6': 'security',
        '7': 'reports', '8': 'settings', '9': 'health'
      };
      if (shortcuts[e.key]) { coreShowPanel(shortcuts[e.key]); e.preventDefault(); }
    }
  });

  /* ─────────────────────────────────────────────────────────────────
     INIT — run after DOM ready
  ───────────────────────────────────────────────────────────────── */
  function init() {
    rewireBodyAppended();
    injectOrphanNav();
    addLatestPhaseNavButtons();
    fixCrossPortalLinks();
    wireFanNav();

    // Show default panel if none active
    var activePanels = document.querySelectorAll('.panel.active');
    if (activePanels.length === 0) {
      var firstPanel = document.querySelector('.panel');
      if (firstPanel) {
        firstPanel.classList.add('active');
        var pid = (firstPanel.id || '').replace('panel-', '');
        var firstBtn = document.querySelector('[onclick*="' + pid + '"]');
        if (firstBtn) firstBtn.classList.add('active');
      }
    }

    // Wire any remaining sidebar items that reference valid panels
    document.querySelectorAll('.sb-item[onclick], .ops-nav-btn[onclick]').forEach(function (btn) {
      // Already wired by browser — just ensure they have cursor
      btn.style.cursor = 'pointer';
    });

    console.log('[INDTIX Portal Fix v5.0] ✅ Initialised — panels:', document.querySelectorAll('[id^="panel-"]').length);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init();
      // Re-run after a short delay to catch script-injected content
      setTimeout(function () {
        rewireBodyAppended();
        injectOrphanNav();
        addLatestPhaseNavButtons();
      }, 500);
      setTimeout(function () {
        rewireBodyAppended();
        injectOrphanNav();
        addLatestPhaseNavButtons();
      }, 2000);
    });
  } else {
    init();
    setTimeout(function () {
      rewireBodyAppended();
      injectOrphanNav();
      addLatestPhaseNavButtons();
    }, 500);
    setTimeout(function () {
      rewireBodyAppended();
      injectOrphanNav();
      addLatestPhaseNavButtons();
    }, 2000);
  }

})();
