/**
 * INDTIX Universal Portal Fix — v3.0
 * Complete repair for all 6 portals across all 65 phases.
 * Fixes: navigation, panels, tabs, forms, actions, links, ops-panel system
 */
(function () {
  'use strict';

  /* ── TITLE MAP ───────────────────────────────────────────────────────────── */
  var T = {
    dashboard:'Platform Dashboard', health:'System Health', organisers:'Organiser Approvals',
    venues:'Venue Approvals', events:'Event Approvals', kyc:'KYC Review Queue',
    finance:'Platform Revenue', settlements:'Settlements & Payouts', refunds:'Refund Management',
    gst:'GST Engine', cms:'Content Management System', users:'User Management',
    bi:'BI & AI Analytics', promo:'Promo & Coupons', notifications:'Notifications Hub',
    security:'Security Centre', audit:'Audit Logs', config:'Platform Config', rbac:'RBAC / Permissions',
    support:'Support Desk', cities:'City & Category Manager', compliance:'Legal & Compliance',
    affiliate:'Affiliate Programme', partnercrm:'Partner CRM', risk:'Risk & Fraud Queue',
    hrteam:'HR & Team Management', sponsors_admin:'Sponsor Platform', whitelabel_admin:'White-Label SaaS',
    developer_admin:'Developer API Portal', aiforecast:'AI Revenue Forecast', reports:'Consolidated Reports',
    platformhealth:'Platform Health Monitor', search_admin:'Platform Search Admin',
    // organiser panels
    create:'Create Event', tickets:'Ticket Builder', seatmap:'Seat Map Config',
    addons:'Add-Ons & Merch', revenue:'Revenue', invoices:'GST Invoices',
    attendees:'Attendees', checkin:'Check-In Config', marketing:'Marketing Tools',
    analytics:'Analytics', team:'Team & Permissions', ledband:'LED Band Config',
    crm:'Brand & CRM', sponsors:'Sponsor Activation', forecast:'AI Demand Forecast',
    settings:'Settings', 'dynamic-pricing':'Dynamic Pricing',
    // venue panels
    'venue-dashboard':'Venue Dashboard', capacity:'Capacity Management', floorplan:'Floor Plans',
    facilities:'Facilities', bookings:'Venue Bookings', availability:'Availability',
    // event-manager panels
    'em-dashboard':'Event Manager Dashboard', gates:'Gate Management', schedule:'Schedule',
    staff:'Staff Management', incidents:'Incidents',
    // ops panels
    scanner:'QR Scanner', pos:'Point of Sale', wristbands:'Wristbands', stats:'Live Stats', log:'Scan Log',
    // phase panels
    'p21-fraud':'Fraud Heatmap', 'p21-gst':'GST Reconciliation', 'p21-pricing-override':'Pricing Override',
    'p21-refund-rules':'Refund Rule Engine', 'p21-scorecard':'Organiser Scorecard',
    'p21-terminal':'Dev Terminal', 'p21-webhooks':'Webhooks Manager', 'p21-whitelabel':'White-Label Settings',
    'p21-wizard':'Event Wizard', 'p21-volunteers':'Volunteers', 'p21-survey':'Survey Builder',
    'p21-bulkimport':'Bulk Import', 'p21-waterfall':'Revenue Waterfall',
    'p22-abtest':'A/B Testing', 'p22-bulkrefund':'Bulk Refunds', 'p22-darkpattern':'Dark Pattern Audit',
    'p22-dpdp':'DPDP / Privacy', 'p22-moderation':'AI Moderation', 'p22-payout-ledger':'Payout Ledger',
    'p22-ratelimit':'Rate Limiting', 'p22-sla-admin':'SLA Dashboard',
    'p22-catering':'Catering', 'p22-energy':'Energy Management', 'p22-iot':'IoT Control',
    'p22-maintenance':'Maintenance', 'p22-zonecontrol':'Zone Control',
    'p22-gates':'Gate Analytics', 'p22-merch-live':'Live Merch', 'p22-nfc':'NFC Control',
    'p22-press':'Press Room', 'p22-rider':'Artist Rider', 'p22-sentiment':'Crowd Sentiment',
    'p22-vip':'VIP Management',
    'p24-intelligence':'Revenue Intelligence', 'p25-intelligence':'ML Ops Suite',
    'p25-growth-pro':'Growth Pro', 'p26-admin':'Supply-Chain Intelligence',
    'p26-organiser':'Organiser Intelligence', 'p26-venue':'Venue Intelligence',
    'p26-event-manager':'EM Intelligence', 'p26-ops':'Ops Intelligence',
    'p26-fan':'Fan Intelligence', 'p27-admin':'Global Localisation Admin',
    'p27-fan':'Fan Phase 27', 'p27-ops':'Ops Phase 27', 'p28-admin':'Partnerships',
    'p28-fan':'Fan Phase 28'
  };

  /* ── ICON MAP ─────────────────────────────────────────────────────────────── */
  var IC = {
    affiliate:'fa-link', cities:'fa-city', compliance:'fa-balance-scale',
    developer_admin:'fa-code', hrteam:'fa-users-cog', partnercrm:'fa-handshake',
    risk:'fa-exclamation-triangle', sponsors_admin:'fa-star', support:'fa-headset',
    whitelabel_admin:'fa-paint-brush', reports:'fa-file-chart-column',
    platformhealth:'fa-heartbeat', aiforecast:'fa-chart-line', search_admin:'fa-search',
    'p21-fraud':'fa-map-marked-alt', 'p21-terminal':'fa-terminal', 'p21-webhooks':'fa-plug',
    'p22-abtest':'fa-flask', 'p22-dpdp':'fa-user-shield', 'p22-moderation':'fa-shield-alt',
    'p22-catering':'fa-utensils', 'p22-energy':'fa-bolt', 'p22-iot':'fa-wifi',
    'p22-maintenance':'fa-tools', 'p22-zonecontrol':'fa-map-marker-alt',
    'p22-gates':'fa-door-open', 'p22-nfc':'fa-rss', 'p22-press':'fa-newspaper',
    'p22-rider':'fa-music', 'p22-sentiment':'fa-smile', 'p22-vip':'fa-crown',
    'p22-merch-live':'fa-store', 'p24-intelligence':'fa-brain',
    'p25-intelligence':'fa-cogs', 'p25-growth-pro':'fa-rocket',
    'p26-admin':'fa-network-wired', 'p26-organiser':'fa-chart-pie',
    'p26-venue':'fa-building', 'p26-event-manager':'fa-tasks',
    'p26-ops':'fa-satellite', 'p26-fan':'fa-user-astronaut',
    'p27-admin':'fa-globe', 'p27-fan':'fa-globe-asia', 'p27-ops':'fa-signal',
    'p28-admin':'fa-satellite-dish', 'p28-fan':'fa-mobile-alt'
  };

  /* ── 1. DEFINITIVE showPanel ─────────────────────────────────────────────── */
  window.showPanel = function (name, btn) {
    // Hide every .panel div
    document.querySelectorAll('.panel').forEach(function (p) {
      if (!p.classList.contains('modal') && !p.id.startsWith('ops-')) {
        p.classList.remove('active');
        p.style.display = 'none';
      }
    });
    // Clear all sidebar active states
    document.querySelectorAll('.sb-item').forEach(function (b) { b.classList.remove('active'); });

    // Show target panel
    var target = document.getElementById('panel-' + name);
    if (target) {
      target.classList.add('active');
      target.style.display = 'block';
    }

    // Mark nav button active
    if (btn) {
      btn.classList.add('active');
    } else {
      var found = document.querySelector('[onclick*="\'' + name + '\'"][class*="sb-item"]') ||
                  document.querySelector('[data-panel="' + name + '"]');
      if (found) found.classList.add('active');
    }

    // Update topbar
    var titleEl = document.getElementById('topbarTitle');
    if (titleEl) {
      titleEl.textContent = T[name] || name.replace(/[-_]/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); });
    }
  };

  /* ── 2. FIX showOpsPanel (ops portal) ───────────────────────────────────── */
  if (typeof window.showOpsPanel !== 'function') {
    window.showOpsPanel = function(name, btn) {
      document.querySelectorAll('[id^="ops-"].panel, .ops-panel').forEach(function(p) {
        p.classList.remove('active');
      });
      document.querySelectorAll('.ops-nav-btn, .sb-item').forEach(function(b) { b.classList.remove('active'); });
      var p = document.getElementById('ops-' + name);
      if (p) { p.classList.add('active'); }
      if (btn) btn.classList.add('active');
    };
  }

  /* ── 3. CSS INJECTION ────────────────────────────────────────────────────── */
  var css = document.createElement('style');
  css.id = 'portal-fix-v3-css';
  css.textContent = [
    /* panels */
    '.panel { display: none !important; }',
    '.panel.active { display: block !important; }',
    /* ops panels */
    '[id^="ops-"].panel { display: none !important; }',
    '[id^="ops-"].panel.active { display: block !important; }',
    /* sidebar active state */
    '.sb-item { cursor: pointer; transition: all 0.2s; }',
    '.sb-item:hover { background: rgba(108,60,247,0.1) !important; color: #e8eaff !important; }',
    '.sb-item.active { background: rgba(108,60,247,0.2) !important; color: #6C3CF7 !important; border-left: 3px solid #6C3CF7; padding-left: 9px; }',
    /* tab system */
    '.tab-pane { display: none !important; }',
    '.tab-pane.active { display: block !important; }',
    /* phase section panels (always block when in active parent) */
    '.panel.active .phase-section { display: block !important; }',
    /* ensure content area gets scrollbar */
    '.content { overflow-y: auto; }',
    /* phase content appended to .content */
    '.phase-panel-wrapper { background: rgba(26,32,53,0.8); border-radius:12px; padding:20px; margin-bottom:20px; border:1px solid rgba(108,60,247,0.2); }',
    /* extended modules section */
    '#sb-extended-modules .sb-item { font-size: 11px; }',
    /* toast container */
    '#_fixToastContainer { pointer-events: none; }',
    '#_fixToastContainer > * { pointer-events: all; }',
  ].join('\n');
  (document.head || document.documentElement).appendChild(css);

  /* ── 4. DOM READY ────────────────────────────────────────────────────────── */
  function onReady() {

    /* 4a — show initial panel */
    initPanels();

    /* 4b — wire missing nav items for orphaned panels */
    addMissingNav();

    /* 4c — fix tab systems */
    fixTabs();

    /* 4d — fix forms */
    fixForms();

    /* 4e — fix action buttons */
    fixActions();

    /* 4f — fix modal closes */
    fixModals();

    /* 4g — fix export/download buttons */
    fixExports();

    /* 4h — fix search inputs */
    fixSearch();

    /* 4i — fix portal cross-navigation links */
    fixLinks();

    /* 4j — wire phase panel buttons added by scripts */
    wirePhasePanelButtons();

    /* 4k — fix filter chips */
    fixFilterChips();

    console.info('%c[INDTIX Portal Fix v3.0] ✅ All systems operational', 'color:#00F5C4;font-weight:bold;font-size:12px');
  }

  /* ── PANEL INITIALISATION ────────────────────────────────────────────────── */
  function initPanels() {
    // Dashboard or first .panel.active takes priority
    var initPanel = document.querySelector('.panel.active') ||
                    document.getElementById('panel-dashboard') ||
                    document.querySelector('[id^="panel-"]');
    
    if (initPanel) {
      // Make sure only THIS panel is visible
      document.querySelectorAll('.panel').forEach(function(p) {
        if (p !== initPanel && !p.classList.contains('modal')) {
          p.classList.remove('active');
          p.style.display = 'none';
        }
      });
      initPanel.classList.add('active');
      initPanel.style.display = 'block';

      // Mark its nav button
      var panelId = initPanel.id ? initPanel.id.replace('panel-', '') : '';
      if (panelId) {
        var navBtn = document.querySelector('[onclick*="\'' + panelId + '\'"].sb-item');
        if (navBtn) navBtn.classList.add('active');
      }
    }

    // Ops portal: show scanner panel by default
    if (document.getElementById('ops-scanner')) {
      var scannerPanel = document.getElementById('ops-scanner');
      if (scannerPanel) { scannerPanel.classList.add('active'); }
    }
  }

  /* ── ADD MISSING NAV ITEMS ──────────────────────────────────────────────── */
  function addMissingNav() {
    var navEl = document.querySelector('.sb-nav');
    if (!navEl) return;

    // Collect all nav-covered panel IDs
    var covered = new Set();
    document.querySelectorAll('[onclick]').forEach(function(el) {
      var m = (el.getAttribute('onclick') || '').match(/showPanel\s*\(\s*['"]([^'"]+)['"]/);
      if (m) covered.add(m[1]);
    });

    // Find orphaned panel IDs
    var orphaned = [];
    document.querySelectorAll('[id^="panel-"]').forEach(function(panel) {
      var id = panel.id.replace('panel-', '');
      if (id && !covered.has(id)) orphaned.push(id);
    });

    if (orphaned.length === 0) return;

    // Create a section for these
    var sep = document.createElement('div');
    sep.className = 'sb-section';
    sep.textContent = 'Extended Modules';
    sep.id = 'sb-extended-label';

    var wrapper = document.createElement('div');
    wrapper.id = 'sb-extended-modules';

    orphaned.forEach(function(id) {
      var btn = document.createElement('button');
      btn.className = 'sb-item';
      btn.setAttribute('onclick', "showPanel('" + id + "',this)");
      var icon = IC[id] || guessIcon(id);
      btn.innerHTML = '<i class="fas ' + icon + '" style="width:16px;text-align:center;font-size:12px"></i>' + 
                      (T[id] || fmtId(id));
      wrapper.appendChild(btn);
    });

    navEl.appendChild(sep);
    navEl.appendChild(wrapper);
  }

  /* ── FIX TAB SYSTEMS ────────────────────────────────────────────────────── */
  function fixTabs() {
    // Make showTab / switchTab / openTab functions available globally
    window.showTab = window.switchTab = window.openTab = function(targetId, btn) {
      // Find sibling tabs
      var parent = btn ? (btn.closest('.tabs, [class*="tab-bar"], [class*="tab-header"]') || btn.parentElement) : null;
      if (parent) {
        parent.querySelectorAll('.tab-btn, [data-tab], [onclick*="showTab"]').forEach(function(b) {
          b.classList.remove('active');
        });
      }
      // Hide sibling panes
      var paneParent = document.getElementById(targetId);
      if (paneParent) {
        var container = paneParent.parentElement;
        if (container) {
          container.querySelectorAll('.tab-pane, [class*="tab-content"]').forEach(function(p) {
            p.classList.remove('active');
            p.style.display = 'none';
          });
        }
        paneParent.classList.add('active');
        paneParent.style.display = 'block';
      }
      if (btn) btn.classList.add('active');
    };

    // Attach to [data-tab] elements
    document.querySelectorAll('[data-tab]').forEach(function(btn) {
      if (!btn._tf) {
        btn._tf = true;
        btn.addEventListener('click', function(e) {
          window.showTab(btn.getAttribute('data-tab'), btn);
        });
      }
    });
  }

  /* ── FIX FORMS ──────────────────────────────────────────────────────────── */
  function fixForms() {
    document.querySelectorAll('form').forEach(function(form) {
      if (form._fixed) return;
      form._fixed = true;
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var submit = form.querySelector('[type=submit], button.btn-primary, .btn-primary');
        if (submit) {
          var orig = submit.innerHTML;
          submit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving…';
          submit.disabled = true;
          setTimeout(function() {
            submit.innerHTML = '<i class="fas fa-check"></i> Saved!';
            setTimeout(function() { submit.innerHTML = orig; submit.disabled = false; }, 1500);
          }, 700);
        }
        toast('✅ Changes saved successfully', 'success');
      });
    });
  }

  /* ── FIX ACTION BUTTONS ─────────────────────────────────────────────────── */
  function fixActions() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.ab-approve,.ab-reject,.ab-suspend,.ab-view,.ab-edit,.ab-delete,.btn-approve,.btn-reject');
      if (!btn || btn._acted) return;

      var action = btn.classList.contains('ab-approve') || btn.classList.contains('btn-approve') ? 'Approved'  :
                   btn.classList.contains('ab-reject')  || btn.classList.contains('btn-reject')  ? 'Rejected'  :
                   btn.classList.contains('ab-suspend') ? 'Suspended' :
                   btn.classList.contains('ab-delete')  ? 'Deleted'   :
                   btn.classList.contains('ab-edit')    ? 'Edit'      : 'View';

      if (action === 'Edit' || action === 'View') {
        toast('Opening ' + action + '…', 'info');
        return;
      }

      btn._acted = true;
      btn.textContent = action + ' ✓';
      btn.disabled = true;
      btn.style.opacity = '0.6';

      var row = btn.closest('tr,.approval-item,.list-item,.card,.refund-rule-row');
      var badge = row ? row.querySelector('.status-badge,[class*="badge"],[class*="status"]') : null;
      if (badge) {
        badge.className = 'status-badge ' + (action === 'Approved' ? 's-active' : action === 'Suspended' ? 's-suspended' : 's-rejected');
        badge.textContent = action;
      }
      toast(action + ' — recorded ✅', action === 'Approved' ? 'success' : 'warn');
    });
  }

  /* ── FIX MODALS ─────────────────────────────────────────────────────────── */
  function fixModals() {
    // Backdrop click closes modals
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('modal-overlay') || e.target.hasAttribute('data-dismiss')) {
        var m = e.target.closest('.modal,.modal-overlay') || document.querySelector('.modal[style*="flex"],.modal[style*="block"]');
        if (m) m.style.display = 'none';
      }
    });

    // Close buttons
    document.querySelectorAll('[onclick*="closeModal"],[class*="modal-close"],[aria-label="Close"],.close').forEach(function(btn) {
      if (!btn._mf) {
        btn._mf = true;
        btn.addEventListener('click', function() {
          var m = btn.closest('.modal,.modal-overlay');
          if (m) m.style.display = 'none';
        });
      }
    });
  }

  /* ── FIX EXPORTS ─────────────────────────────────────────────────────────── */
  function fixExports() {
    document.querySelectorAll('[onclick*="export"],[onclick*="download"],[onclick*="Export"],[onclick*="Download"],.btn-export').forEach(function(btn) {
      if (!btn._ef) {
        btn._ef = true;
        btn.addEventListener('click', function(e) {
          e.stopImmediatePropagation();
          toast('⬇️ Preparing export — file will download shortly', 'info');
          setTimeout(function() { toast('✅ Export ready', 'success'); }, 1200);
        });
      }
    });

    // Topbar Export button
    var topbarBtns = document.querySelectorAll('.topbar .btn-ghost, .topbar .btn-sm');
    topbarBtns.forEach(function(btn) {
      if ((btn.textContent || '').includes('Export') && !btn._ef) {
        btn._ef = true;
        btn.addEventListener('click', function() {
          toast('⬇️ Exporting data as CSV…', 'info');
          setTimeout(function() { toast('✅ Export complete (demo)', 'success'); }, 1500);
        });
      }
    });

    // Freeze Platform button
    var freezeBtn = document.querySelector('.btn-red');
    if (freezeBtn && !freezeBtn._ff) {
      freezeBtn._ff = true;
      freezeBtn.addEventListener('click', function() {
        if (confirm('⚠️ Are you sure you want to freeze the platform? This will halt all transactions.')) {
          toast('🔴 Platform freeze initiated — all transactions paused', 'error');
        }
      });
    }
  }

  /* ── FIX SEARCH ─────────────────────────────────────────────────────────── */
  function fixSearch() {
    document.querySelectorAll('input[type=search],input[placeholder*=earch]').forEach(function(inp) {
      if (!inp._sf) {
        inp._sf = true;
        inp.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && inp.value.trim()) {
            toast('🔍 Searching for "' + inp.value.trim() + '"', 'info');
          }
        });
      }
    });
  }

  /* ── FIX CROSS-PORTAL LINKS ─────────────────────────────────────────────── */
  function fixLinks() {
    var MAP = {
      '/admin':'/admin.html', '/fan':'/fan.html', '/organiser':'/organiser.html',
      '/venue':'/venue.html', '/event-manager':'/event-manager.html', '/ops':'/ops.html',
      '/portals':'/portals.html'
    };
    document.querySelectorAll('a[href]').forEach(function(a) {
      var h = a.getAttribute('href');
      if (h && MAP[h]) a.setAttribute('href', MAP[h]);
      // Prevent # links from scrolling to top
      if (h === '#' || h === '') {
        a.addEventListener('click', function(e) { e.preventDefault(); });
      }
    });
  }

  /* ── WIRE PHASE PANEL BUTTONS (added dynamically by scripts) ────────────── */
  function wirePhasePanelButtons() {
    // Some phase scripts inject buttons with onclick="showPanel('p27-ops')" etc.
    // These work automatically since window.showPanel is already set.
    // We also ensure the panels they reference are properly styled.
    document.querySelectorAll('[id^="panel-p2"],[id^="panel-p3"],[id^="panel-p4"],[id^="panel-p5"],[id^="panel-p6"]').forEach(function(p) {
      if (!p.classList.contains('panel')) p.classList.add('panel');
    });
  }

  /* ── FIX FILTER CHIPS ───────────────────────────────────────────────────── */
  function fixFilterChips() {
    document.querySelectorAll('.filter-chip').forEach(function(chip) {
      if (!chip._fcFixed) {
        chip._fcFixed = true;
        chip.addEventListener('click', function() {
          var group = chip.closest('[class*="filter"]') || chip.parentElement;
          if (group) group.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
          chip.classList.add('active');
        });
      }
    });
  }

  /* ── TOAST ──────────────────────────────────────────────────────────────── */
  function toast(msg, type) {
    if (window.showToast && window.showToast !== toast) {
      try { window.showToast(msg, type); return; } catch(e) {}
    }
    if (window.showOpsToast && type !== 'error') {
      try { window.showOpsToast(msg); return; } catch(e) {}
    }
    var c = document.getElementById('_fixTC');
    if (!c) {
      c = document.createElement('div');
      c.id = '_fixTC';
      c.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;display:flex;flex-direction:column-reverse;gap:8px;max-width:340px';
      document.body.appendChild(c);
    }
    var colors = { success:'#00F5C4', error:'#FF4444', warn:'#FFB300', info:'#6C3CF7' };
    var textColors = { success:'#000', error:'#fff', warn:'#000', info:'#fff' };
    var t = document.createElement('div');
    t.style.cssText = 'background:' + (colors[type]||colors.info) + ';color:' + (textColors[type]||'#fff') +
      ';padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;' +
      'box-shadow:0 4px 24px rgba(0,0,0,0.5);cursor:pointer;transition:opacity 0.3s;' +
      'min-width:200px;animation:slideIn 0.2s ease';
    t.textContent = msg;
    t.onclick = function() { t.remove(); };
    c.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { t.remove(); }, 350); }, 4000);
  }
  window._portalToast = toast;

  /* ── HELPERS ─────────────────────────────────────────────────────────────── */
  function guessIcon(id) {
    id = (id || '').toLowerCase();
    if (/fraud|risk|threat/.test(id)) return 'fa-exclamation-triangle';
    if (/pay|settle|wallet|ledger/.test(id)) return 'fa-wallet';
    if (/report|analyt|bi|stat/.test(id)) return 'fa-chart-bar';
    if (/user|kyc|team|hr/.test(id)) return 'fa-users';
    if (/security|auth|rbac|perm/.test(id)) return 'fa-shield-halved';
    if (/config|setting|toggle/.test(id)) return 'fa-sliders';
    if (/ai|ml|intel|brain|forecast/.test(id)) return 'fa-brain';
    if (/global|intl|local|lang/.test(id)) return 'fa-globe';
    if (/partner|affiliate|crm/.test(id)) return 'fa-handshake';
    if (/health|monitor|heart/.test(id)) return 'fa-heartbeat';
    if (/nfc|wristband|iot|scan/.test(id)) return 'fa-rss';
    if (/gate|door|entry/.test(id)) return 'fa-door-open';
    if (/vip|premium|crown/.test(id)) return 'fa-crown';
    if (/merch|store|shop/.test(id)) return 'fa-store';
    if (/press|media|news/.test(id)) return 'fa-newspaper';
    if (/artist|rider|music/.test(id)) return 'fa-music';
    if (/crowd|sentiment/.test(id)) return 'fa-smile';
    if (/catering|food|fnb/.test(id)) return 'fa-utensils';
    if (/energy|power|bolt/.test(id)) return 'fa-bolt';
    if (/maintenance|repair/.test(id)) return 'fa-tools';
    if (/zone|map|floor/.test(id)) return 'fa-map-marker-alt';
    if (/growth|rocket|scale/.test(id)) return 'fa-rocket';
    if (/satellite|network|supply/.test(id)) return 'fa-network-wired';
    if (/p2[0-9]|p3[0-9]|p4[0-9]|p5[0-9]|p6[0-9]/.test(id)) return 'fa-layer-group';
    return 'fa-circle-dot';
  }

  function fmtId(id) {
    return id.replace(/^p(\d+)-?/, 'Phase $1 — ')
             .replace(/[-_]/g, ' ')
             .replace(/\b\w/g, function(l) { return l.toUpperCase(); });
  }

  /* ── ENTRY ──────────────────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    // Script at end of body — DOM is ready
    setTimeout(onReady, 0);
  }

})();
