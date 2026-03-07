export function superAdminHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Super Admin / ERP – INDTIX</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{--brand:#6C3CF7;--brand2:#FF3CAC;--brand3:#00F5C4;--dark:#080B14;--dark2:#0F1320;--dark3:#161B2E;--card:#1A2035;--border:rgba(108,60,247,0.2);--text:#E8EAFF;--muted:#8B93B8;--grad1:linear-gradient(135deg,#6C3CF7,#FF3CAC);--red:#FF4444;--green:#00F5C4;--gold:#FFB300}
*{margin:0;padding:0;box-sizing:border-box}body{background:var(--dark);color:var(--text);font-family:'Inter',sans-serif;display:flex;min-height:100vh}
.sidebar{width:260px;background:var(--dark3);border-right:1px solid var(--border);display:flex;flex-direction:column;position:fixed;top:0;bottom:0;left:0;z-index:100;overflow-y:auto}
.sb-logo{padding:20px;border-bottom:1px solid var(--border)}.sb-logo a{text-decoration:none;color:inherit}
.logo-wrap{display:flex;align-items:center;gap:10px}.logo-mark{width:34px;height:34px;background:var(--grad1);border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:'Space Grotesk',sans-serif}
.logo-text{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px}.logo-text span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-badge{background:rgba(255,68,68,0.15);border:1px solid rgba(255,68,68,0.4);color:var(--red);font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;margin-left:auto;align-self:center}
.sb-user{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
.sb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#FF4444,#6C3CF7);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px}
.sb-uname{font-size:13px;font-weight:600}.sb-role{font-size:11px;color:var(--muted)}.sb-status{width:8px;height:8px;border-radius:50%;background:var(--red);margin-left:auto}
.sb-nav{flex:1;padding:12px}.sb-section{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);padding:8px 8px 4px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:10px;cursor:pointer;transition:all 0.2s;margin-bottom:1px;color:var(--muted);font-size:12px;font-weight:500;border:none;background:transparent;width:100%;text-align:left;font-family:'Inter',sans-serif}
.sb-item:hover,.sb-item.active{background:rgba(108,60,247,0.15);color:var(--text)}.sb-item.active{color:var(--brand)}.sb-item i{width:16px;text-align:center;font-size:13px}
.sb-dot{margin-left:auto;width:6px;height:6px;border-radius:50%}
.sb-footer{padding:16px 20px;border-top:1px solid var(--border)}.sb-footer a{display:flex;align-items:center;gap:8px;color:var(--muted);text-decoration:none;font-size:13px}.sb-footer a:hover{color:var(--brand)}
.main{margin-left:260px;flex:1;display:flex;flex-direction:column}
.topbar{background:var(--dark2);border-bottom:1px solid var(--border);padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}
.topbar-title{font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700}.topbar-actions{display:flex;align-items:center;gap:12px}
.btn-sm{padding:7px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s}
.btn-primary{background:var(--grad1);color:#fff}.btn-ghost{background:transparent;border:1px solid var(--border);color:var(--text)}.btn-ghost:hover{border-color:var(--brand);color:var(--brand)}
.btn-red{background:rgba(255,68,68,0.15);border:1px solid rgba(255,68,68,0.4);color:var(--red)}
.content{flex:1;padding:24px}
.panel{display:none}.panel.active{display:block}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;position:relative;overflow:hidden}
.stat-label{font-size:11px;color:var(--muted);font-weight:500;text-transform:uppercase;letter-spacing:0.5px}
.stat-value{font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:700;margin:6px 0 4px}
.stat-change{font-size:11px;font-weight:600}.stat-change.up{color:var(--green)}.stat-change.dn{color:var(--red)}
.stat-icon{position:absolute;top:18px;right:18px;font-size:22px;opacity:0.5}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;margin-bottom:16px}
.card-title{font-size:14px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between}
.card-title span{color:var(--muted);font-size:12px;font-weight:400}
.table-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:12px}
th{padding:9px 10px;text-align:left;font-weight:600;color:var(--muted);border-bottom:1px solid var(--border);text-transform:uppercase;letter-spacing:0.5px;font-size:11px}
td{padding:10px 10px;border-bottom:1px solid rgba(255,255,255,0.04)}
tr:hover td{background:rgba(108,60,247,0.04)}
.status-badge{padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase}
.s-active{background:rgba(0,245,196,0.15);color:var(--green)}.s-pending{background:rgba(255,180,0,0.15);color:var(--gold)}.s-rejected{background:rgba(255,68,68,0.15);color:var(--red)}.s-suspended{background:rgba(255,68,68,0.1);color:var(--red)}
.action-btns{display:flex;gap:6px}
.ab{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;font-family:'Inter',sans-serif;transition:all 0.2s}
.ab-approve{background:rgba(0,245,196,0.2);color:var(--green)}.ab-approve:hover{background:rgba(0,245,196,0.35)}
.ab-reject{background:rgba(255,68,68,0.2);color:var(--red)}.ab-reject:hover{background:rgba(255,68,68,0.35)}
.ab-view{background:rgba(108,60,247,0.2);color:var(--brand)}.ab-view:hover{background:rgba(108,60,247,0.35)}
.ab-suspend{background:rgba(255,60,172,0.2);color:var(--brand2)}
.platform-health{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:20px}
.health-item{background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center}
.health-dot{width:10px;height:10px;border-radius:50%;margin:0 auto 6px}
.health-label{font-size:11px;color:var(--muted)}
.health-val{font-size:14px;font-weight:700;margin-top:2px}
.chart-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.chart-bar-label{font-size:12px;min-width:80px;color:var(--muted)}
.chart-bar-track{flex:1;background:var(--dark3);border-radius:4px;height:8px;overflow:hidden}
.chart-bar-fill{height:100%;border-radius:4px;background:var(--grad1)}
.chart-bar-val{font-size:12px;font-weight:600;min-width:45px;text-align:right}
.approval-list{display:flex;flex-direction:column;gap:8px}
.approval-item{background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:12px;display:flex;align-items:center;gap:12px}
.ai-icon{font-size:28px}
.ai-info{flex:1}.ai-name{font-size:13px;font-weight:700}.ai-sub{font-size:11px;color:var(--muted)}
.ai-actions{display:flex;gap:6px}
.revenue-big{font-family:'Space Grotesk',sans-serif;font-size:48px;font-weight:800;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-align:center;padding:20px 0}
.cms-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cms-item{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:16px;cursor:pointer;transition:all 0.2s}
.cms-item:hover{border-color:var(--brand);background:rgba(108,60,247,0.08)}
.cms-icon{font-size:28px;margin-bottom:8px}
.cms-name{font-size:13px;font-weight:700}
.cms-desc{font-size:11px;color:var(--muted);margin-top:3px}
.security-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.sec-item{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:10px}
.sec-icon{font-size:24px}
.sec-info{flex:1}.sec-name{font-size:13px;font-weight:600}.sec-desc{font-size:11px;color:var(--muted)}
.sec-toggle{background:var(--brand);border:none;border-radius:20px;padding:3px 10px;color:#fff;font-size:11px;font-weight:600;cursor:pointer}
</style>
</head>
<body>
<div class="sidebar">
  <div class="sb-logo"><a href="/"><div class="logo-wrap"><div class="logo-mark">IX</div><span class="logo-text">IND<span>TIX</span></span><span class="sb-badge">ROOT</span></div></a></div>
  <div class="sb-user"><div class="sb-avatar">SA</div><div><div class="sb-uname">Super Admin</div><div class="sb-role">Oye Imagine Pvt Ltd · Root</div></div><div class="sb-dot" style="background:var(--red)"></div></div>
  <nav class="sb-nav">
    <div class="sb-section">Command Centre</div>
    <button class="sb-item active" onclick="showPanel('dashboard',this)"><i class="fas fa-globe"></i>Platform Dashboard</button>
    <button class="sb-item" onclick="showPanel('health',this)"><i class="fas fa-heartbeat"></i>System Health</button>
    <div class="sb-section">Approvals</div>
    <button class="sb-item" onclick="showPanel('organisers',this)"><i class="fas fa-user-tie"></i>Organiser Approvals<span class="sb-dot" style="background:var(--gold);margin-left:auto"></span></button>
    <button class="sb-item" onclick="showPanel('venues',this)"><i class="fas fa-building"></i>Venue Approvals</button>
    <button class="sb-item" onclick="showPanel('events',this)"><i class="fas fa-calendar-check"></i>Event Approvals<span class="sb-dot" style="background:var(--gold);margin-left:auto"></span></button>
    <button class="sb-item" onclick="showPanel('kyc',this)"><i class="fas fa-id-card"></i>KYC Review Queue</button>
    <div class="sb-section">Finance / ERP</div>
    <button class="sb-item" onclick="showPanel('finance',this)"><i class="fas fa-chart-line"></i>Platform Revenue</button>
    <button class="sb-item" onclick="showPanel('settlements',this)"><i class="fas fa-wallet"></i>Settlements & Payouts</button>
    <button class="sb-item" onclick="showPanel('refunds',this)"><i class="fas fa-rotate-left"></i>Refund Management</button>
    <button class="sb-item" onclick="showPanel('gst',this)"><i class="fas fa-file-invoice-dollar"></i>GST Engine</button>
    <div class="sb-section">Platform</div>
    <button class="sb-item" onclick="showPanel('cms',this)"><i class="fas fa-newspaper"></i>CMS</button>
    <button class="sb-item" onclick="showPanel('users',this)"><i class="fas fa-users"></i>User Management</button>
    <button class="sb-item" onclick="showPanel('bi',this)"><i class="fas fa-brain"></i>BI & AI Analytics</button>
    <button class="sb-item" onclick="showPanel('promo',this)"><i class="fas fa-percent"></i>Promo / Coupons</button>
    <button class="sb-item" onclick="showPanel('notifications',this)"><i class="fas fa-bell"></i>Notifications Hub</button>
    <div class="sb-section">Security / Ops</div>
    <button class="sb-item" onclick="showPanel('security',this)"><i class="fas fa-shield-halved"></i>Security Centre</button>
    <button class="sb-item" onclick="showPanel('audit',this)"><i class="fas fa-scroll"></i>Audit Logs</button>
    <button class="sb-item" onclick="showPanel('config',this)"><i class="fas fa-sliders"></i>Platform Config</button>
    <button class="sb-item" onclick="showPanel('rbac',this)"><i class="fas fa-user-lock"></i>RBAC / Permissions</button>
  </nav>
  <div class="sb-footer"><a href="/"><i class="fas fa-arrow-left"></i>Back to Fan Portal</a></div>
</div>

<div class="main">
  <div class="topbar">
    <div class="topbar-title" id="topbarTitle">Platform Dashboard</div>
    <div class="topbar-actions">
      <span style="font-size:12px;color:var(--muted)">All systems operational</span>
      <span style="width:8px;height:8px;border-radius:50%;background:var(--green);display:inline-block"></span>
      <button class="btn-sm btn-ghost"><i class="fas fa-download"></i> Export</button>
      <button class="btn-sm btn-red"><i class="fas fa-lock"></i> Freeze Platform</button>
    </div>
  </div>
  <div class="content">

    <!-- PLATFORM DASHBOARD -->
    <div class="panel active" id="panel-dashboard">
      <div class="stats-row">
        <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Platform GMV (MTD)</div><div class="stat-value">₹4.2Cr</div><div class="stat-change up">↑ 31% MoM</div></div>
        <div class="stat-card"><div class="stat-icon">🎟️</div><div class="stat-label">Tickets Sold (MTD)</div><div class="stat-value">1,24,500</div><div class="stat-change up">↑ 18%</div></div>
        <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-label">Live Events Today</div><div class="stat-value">12</div><div class="stat-change up">4 cities</div></div>
        <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-label">Active Users (DAU)</div><div class="stat-value">84,200</div><div class="stat-change up">↑ 12%</div></div>
      </div>
      <div class="stats-row">
        <div class="stat-card"><div class="stat-icon">🏢</div><div class="stat-label">Active Organisers</div><div class="stat-value">342</div><div class="stat-change up">18 pending KYC</div></div>
        <div class="stat-card"><div class="stat-icon">🏟️</div><div class="stat-label">Listed Venues</div><div class="stat-value">528</div><div class="stat-change up">12 pending</div></div>
        <div class="stat-card"><div class="stat-icon">💸</div><div class="stat-label">Platform Revenue (MTD)</div><div class="stat-value">₹42L</div><div class="stat-change up">10% take rate</div></div>
        <div class="stat-card"><div class="stat-icon">⚠️</div><div class="stat-label">Pending Approvals</div><div class="stat-value">23</div><div class="stat-change dn">Needs attention</div></div>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px">
        <div class="card">
          <div class="card-title">Revenue Trend (Last 12 Months) <span>Platform take rate: 10%</span></div>
          <div style="display:flex;align-items:flex-end;gap:6px;height:100px;margin-bottom:8px">
            ${[22,28,35,42,38,55,68,72,58,65,80,95].map((h,i)=>`
              <div style="flex:1;background:var(--grad1);border-radius:3px 3px 0 0;height:${h}%;opacity:0.75;cursor:pointer" title="Month ${i+1}: ₹${h*4}L GMV" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.75'"></div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted)">
            ${['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'].map(m=>`<span>${m}</span>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-title">Revenue Mix</div>
          ${[['Ticket Platform Fee',42],['Convenience Fee',28],['Ads & Promoted Listings',15],['Wristband/NFC',10],['F&B Commission',5]].map(([n,p])=>`
            <div class="chart-bar-row"><div class="chart-bar-label">${n}</div><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${p}%"></div></div><div class="chart-bar-val">${p}%</div></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- ORGANISER APPROVALS -->
    <div class="panel" id="panel-organisers">
      <div class="approval-list">
        <div style="background:rgba(255,180,0,0.08);border:1px solid rgba(255,180,0,0.3);border-radius:10px;padding:12px;font-size:12px;color:var(--gold);margin-bottom:12px">⚠️ 18 organiser applications pending review. Approving grants full event creation access.</div>
        ${[['🏢','Oye Events Pvt Ltd','GST: 27AABCO1234A1Z5 · PAN: AABCO1234A','Mumbai','Pending KYC'],['👨‍💼','Ravescape Productions','GST: 29AABCR5678A1Z5 · PAN: AABCR5678A','Bengaluru','Docs Uploaded'],['🎪','Horizon Live','GST: 27AABCH9012A1Z5 · PAN: AABCH9012A','Pune','Under Review']].map(([icon,name,gst,city,stage])=>`
          <div class="approval-item">
            <div class="ai-icon">${icon}</div>
            <div class="ai-info"><div class="ai-name">${name} <span style="color:var(--muted);font-weight:400;font-size:11px">· ${city}</span></div><div class="ai-sub">${gst} · ${stage}</div></div>
            <div class="ai-actions">
              <button class="ab ab-view" onclick="viewOrg('${name}')">View</button>
              <button class="ab ab-approve" onclick="approveOrg('${name}')">✓ Approve</button>
              <button class="ab ab-reject" onclick="rejectOrg('${name}')">✗ Reject</button>
            </div>
          </div>`).join('')}
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-title">All Organisers <span>342 total</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr>${['Organiser','City','Events','GMV','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${[['Sunburn India','Mumbai',12,'₹2.4Cr','Active'],['BookMyShow Live','Mumbai',28,'₹8.1Cr','Active'],['Comedy Store India','Delhi',45,'₹1.2Cr','Active'],['Percept Live','Mumbai',8,'₹1.8Cr','Active'],['FLY Entertainment','Pune',6,'₹45L','Suspended']].map(([n,c,e,g,s])=>`
                <tr><td style="font-weight:600">${n}</td><td>${c}</td><td>${e}</td><td style="color:var(--green);font-weight:600">${g}</td><td><span class="status-badge ${s==='Active'?'s-active':'s-suspended'}">${s}</span></td><td><div class="action-btns"><button class="ab ab-view">View</button><button class="ab ab-suspend">Suspend</button></div></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- EVENT APPROVALS -->
    <div class="panel" id="panel-events">
      <div class="card">
        <div class="card-title">Events Pending Approval <span>5 events awaiting review</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr>${['Event','Organiser','Date','Venue','Cap','Docs','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${[['Tech Summit 2025','India Tech Consortium','Jun 10','HITEX, Hyderabad','1,200','✅ All Submitted','Pending'],['Rao Fest 2025','Rao Productions','Jul 4','MMRDA Grounds','25,000','⚠️ NOC Missing','On Hold'],['Comedy Night Out','Laugh Club','May 3','Habitat Centre','800','✅ All Submitted','Pending'],['Indie Rocks','Indie Artists Coll.','Jun 22','Hard Rock Cafe','400','✅ All Submitted','Pending'],['Kala Ghoda 2025','KGAF Trust','Jan 28','Kala Ghoda Area','5,000','❌ Fire NOC Missing','On Hold']].map(([e,o,d,v,c,docs,s])=>`
                <tr><td style="font-weight:600">${e}</td><td>${o}</td><td>${d}</td><td>${v}</td><td>${c}</td><td style="font-size:11px">${docs}</td><td><span class="status-badge ${s==='Pending'?'s-pending':'s-rejected'}">${s}</span></td><td><div class="action-btns"><button class="ab ab-view">View</button><button class="ab ab-approve" onclick="approveEvent('${e}')">✓</button><button class="ab ab-reject" onclick="rejectEvent('${e}')">✗</button></div></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- FINANCE -->
    <div class="panel" id="panel-finance">
      <div class="revenue-big">₹4.2 Crore GMV This Month</div>
      <div class="stats-row">
        <div class="stat-card"><div class="stat-icon">💳</div><div class="stat-label">UPI Transactions</div><div class="stat-value">68,420</div><div class="stat-change up">55% of volume</div></div>
        <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-label">Card Payments</div><div class="stat-value">28,340</div><div class="stat-change up">23% of volume</div></div>
        <div class="stat-card"><div class="stat-icon">🔄</div><div class="stat-label">Refunds Processed</div><div class="stat-value">₹8.4L</div><div class="stat-change dn">2% refund rate</div></div>
        <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-label">GST Collected</div><div class="stat-value">₹75.6L</div><div class="stat-change up">Auto-calculated</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="card">
          <div class="card-title">Payment Gateway Split</div>
          ${[['Razorpay',45],['PayU',28],['Stripe (Intl)',12],['Paytm',10],['PhonePe',5]].map(([n,p])=>`
            <div class="chart-bar-row"><div class="chart-bar-label">${n}</div><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${p}%"></div></div><div class="chart-bar-val">${p}%</div></div>`).join('')}
        </div>
        <div class="card">
          <div class="card-title">Pending Settlements</div>
          ${[['Sunburn India','₹5,38,650','Apr 20','Ready'],['NH7 Weekender','₹7,26,750','Apr 22','Processing'],['Comedy Store','₹1,24,000','Apr 25','Pending']].map(([org,amt,date,status])=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="flex:1"><div style="font-size:13px;font-weight:600">${org}</div><div style="font-size:11px;color:var(--muted)">Due: ${date}</div></div>
              <span style="font-size:14px;font-weight:700;color:var(--green)">${amt}</span>
              <span class="status-badge ${status==='Ready'?'s-active':status==='Processing'?'s-pending':'s-pending'}">${status}</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- CMS -->
    <div class="panel" id="panel-cms">
      <div class="cms-grid">
        ${[['🏠','Homepage Banners','Manage hero banners, featured events, and promotional sections'],['📣','Promotions','Create and schedule platform-wide promotional campaigns'],['📧','Email Templates','Edit transactional and marketing email templates'],['💬','WhatsApp Templates','Manage WhatsApp Business API message templates'],['📋','Static Pages','Edit About, FAQ, Terms, Privacy Policy, and Help pages'],['🎨','Design Tokens','Update brand colours, fonts, and design system variables'],['🔍','SEO Manager','Meta titles, descriptions, and sitemap configuration'],['📱','Push Notifications','Configure and send push notification campaigns'],['🎁','Featured Events','Manually curate homepage featured event slots'],['🏷️','Category Manager','Add, edit, and reorder event categories and sub-categories'],['🌐','City Manager','Add new cities, manage city-level settings and banners'],['📊','Banners & Ads','Manage sponsored banner placements across all portals']].map(([icon,name,desc])=>`
          <div class="cms-item" onclick="openCMS('${name}')"><div class="cms-icon">${icon}</div><div class="cms-name">${name}</div><div class="cms-desc">${desc}</div></div>`).join('')}
      </div>
    </div>

    <!-- BI / AI ANALYTICS -->
    <div class="panel" id="panel-bi">
      <div class="stats-row">
        <div class="stat-card"><div class="stat-icon">🧠</div><div class="stat-label">AI Recommendations Served</div><div class="stat-value">2.4M</div><div class="stat-change up">↑ 34% CTR lift</div></div>
        <div class="stat-card"><div class="stat-icon">🔮</div><div class="stat-label">Demand Forecast Accuracy</div><div class="stat-value">91.2%</div><div class="stat-change up">ML model v3.1</div></div>
        <div class="stat-card"><div class="stat-icon">🤖</div><div class="stat-label">Fraud Detected</div><div class="stat-value">234</div><div class="stat-change up">₹4.2L saved</div></div>
        <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-label">Dynamic Pricing Events</div><div class="stat-value">18</div><div class="stat-change up">+12% revenue lift</div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="card">
          <div class="card-title">AI Model Performance</div>
          ${[['Recommendation Engine','91.2%','Active'],['Demand Forecasting','88.7%','Active'],['Fraud Detection','96.4%','Active'],['Dynamic Pricing','84.1%','Beta'],['Churn Prediction','79.3%','Training']].map(([m,acc,s])=>`
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
              <div style="flex:1"><div style="font-size:13px;font-weight:600">${m}</div></div>
              <span style="font-size:13px;font-weight:700;color:var(--green)">${acc}</span>
              <span class="status-badge ${s==='Active'?'s-active':s==='Beta'?'s-pending':'s-rejected'}">${s}</span>
            </div>`).join('')}
        </div>
        <div class="card">
          <div class="card-title">Top Performing Cities</div>
          ${[['Mumbai','₹1.8Cr',43],['Delhi','₹98L',23],['Bengaluru','₹72L',17],['Pune','₹48L',11],['Hyderabad','₹26L',6]].map(([c,r,p])=>`
            <div class="chart-bar-row"><div class="chart-bar-label">${c}</div><div class="chart-bar-track"><div class="chart-bar-fill" style="width:${p*2}%"></div></div><div class="chart-bar-val" style="color:var(--green)">${r}</div></div>`).join('')}
        </div>
      </div>
    </div>

    <!-- SECURITY CENTRE -->
    <div class="panel" id="panel-security">
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat-card"><div class="stat-icon">🛡️</div><div class="stat-label">Threats Blocked (24h)</div><div class="stat-value">1,284</div><div class="stat-change up">WAF active</div></div>
        <div class="stat-card"><div class="stat-icon">🔐</div><div class="stat-label">Failed Login Attempts</div><div class="stat-value">342</div><div class="stat-change dn">12 IPs blocked</div></div>
        <div class="stat-card"><div class="stat-icon">🕵️</div><div class="stat-label">Fraud Flags (24h)</div><div class="stat-value">18</div><div class="stat-change up">8 auto-blocked</div></div>
      </div>
      <div class="security-grid">
        ${[['🛡️','WAF (Web Application Firewall)','Cloudflare WAF — blocking SQLi, XSS, CSRF'],['🔐','MFA Enforcement','Mandatory 2FA for all admin and organiser accounts'],['🔒','Data Encryption','AES-256 at rest, TLS 1.3 in transit'],['🔑','API Rate Limiting','100 req/min for public, 1000 for authenticated'],['🕵️','Bot Protection','ML-based bot detection with CAPTCHA challenges'],['📊','Audit Logging','Immutable audit logs for all sensitive operations'],['💳','PCI-DSS Compliance','Card data never stored — tokenised via payment gateway'],['🚨','Incident Response','24/7 on-call security team, 15-min SLA']].map(([icon,name,desc])=>`
          <div class="sec-item">
            <div class="sec-icon">${icon}</div>
            <div class="sec-info"><div class="sec-name">${name}</div><div class="sec-desc">${desc}</div></div>
            <button class="sec-toggle">ON</button>
          </div>`).join('')}
      </div>
    </div>

    <!-- AUDIT LOGS -->
    <div class="panel" id="panel-audit">
      <div class="card">
        <div class="card-title">Audit Log Stream <span>Real-time · Last 100 actions</span></div>
        <div class="table-wrap">
          <table>
            <thead><tr>${['Timestamp','User','Role','Action','Resource','IP','Status'].map(h=>`<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${[
                ['2025-04-15 18:42:11','admin@oyeimagine.com','Super Admin','APPROVE_EVENT','Event #E-2025-0045','103.24.x.x','SUCCESS'],
                ['2025-04-15 18:38:44','rahul@sunburn.com','Organiser','UPDATE_EVENT','Event #E-2025-0042','49.36.x.x','SUCCESS'],
                ['2025-04-15 18:31:02','system','AI Engine','FLAG_FRAUD','Order #ORD-98423','AUTO','BLOCKED'],
                ['2025-04-15 18:28:15','admin@oyeimagine.com','Super Admin','REJECT_KYC','Organiser #O-1204','103.24.x.x','SUCCESS'],
                ['2025-04-15 18:15:39','unknown','—','BRUTE_FORCE','Login','185.220.x.x','BLOCKED'],
              ].map(([ts,user,role,action,res,ip,status])=>`
                <tr>
                  <td style="font-size:11px;color:var(--muted)">${ts}</td>
                  <td style="font-size:12px">${user}</td>
                  <td><span class="status-badge s-active" style="font-size:10px">${role}</span></td>
                  <td style="font-size:12px;font-weight:600;color:var(--brand)">${action}</td>
                  <td style="font-size:11px">${res}</td>
                  <td style="font-size:11px;color:var(--muted)">${ip}</td>
                  <td><span class="status-badge ${status==='SUCCESS'?'s-active':status==='BLOCKED'?'s-rejected':'s-pending'}">${status}</span></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PLATFORM CONFIG -->
    <div class="panel" id="panel-config">
      <div class="card">
        <div class="card-title">Platform Configuration</div>
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px">
          ${[['Default Ticket Cap per User','10','Override per event allowed'],['Platform Commission Rate','10%','Applied to gross ticket sales'],['Convenience Fee (flat)','₹20','Per order'],['GST on Platform Fee','18%','GSTIN: 27AABCO1234A1Z5'],['Settlement Window','T+7 days','After event date'],['TDS Deduction Rate','5%','On payments to organisers'],['Minimum Event Price','₹1','Per ticket'],['Maximum Ticket Qty Override','100','Admin approval required'],['KYC SLA','24 hours','Business hours only'],['Refund Processing Time','5-7 business days','NEFT/UPI'],['Cancellation Window','48 hours before event','50% refund'],['Age Verification','Aadhaar OTP','For 18+ events']].map(([k,v,note])=>`
            <div style="background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:14px">
              <div style="font-size:12px;color:var(--muted);margin-bottom:4px">${k}</div>
              <div style="font-size:18px;font-weight:700;color:var(--brand)">${v}</div>
              <div style="font-size:11px;color:var(--muted);margin-top:4px">${note}</div>
            </div>`).join('')}
        </div>
        <div style="margin-top:16px;display:flex;justify-content:flex-end">
          <button class="btn-sm btn-primary" onclick="alert('Configuration saved!')"><i class="fas fa-save"></i> Save Configuration</button>
        </div>
      </div>
    </div>

    <!-- DEFAULT PANELS -->
    <div class="panel" id="panel-health"><div class="card"><div class="card-title">System Health Monitor</div><div class="platform-health">${[['API','99.9%','var(--green)'],['DB','99.8%','var(--green)'],['CDN','100%','var(--green)'],['Queue','99.7%','var(--green)'],['Search','99.5%','var(--green)'],['Cache','100%','var(--green)']].map(([s,u,c])=>`<div class="health-item"><div class="health-dot" style="background:${c}"></div><div class="health-label">${s}</div><div class="health-val" style="color:${c}">${u}</div></div>`).join('')}</div></div></div>
    <div class="panel" id="panel-venues"><div class="card"><div class="card-title">Venue Approvals</div><p style="color:var(--muted)">528 venues listed · 12 pending verification.</p></div></div>
    <div class="panel" id="panel-kyc"><div class="card"><div class="card-title">KYC Review Queue</div><p style="color:var(--muted)">18 organiser KYC submissions pending review.</p></div></div>
    <div class="panel" id="panel-settlements"><div class="card"><div class="card-title">Settlements & Payouts</div><p style="color:var(--muted)">₹18.4L pending payout to organisers this week.</p></div></div>
    <div class="panel" id="panel-refunds"><div class="card"><div class="card-title">Refund Management</div><p style="color:var(--muted)">₹8.4L in refunds processed this month. 2% refund rate.</p></div></div>
    <div class="panel" id="panel-gst"><div class="card"><div class="card-title">GST Engine</div><p style="color:var(--muted)">Auto-calculated GST on all transactions. GSTIN: 27AABCO1234A1Z5. Monthly GSTR-1 auto-generated.</p></div></div>
    <div class="panel" id="panel-users"><div class="card"><div class="card-title">User Management</div><p style="color:var(--muted)">2.4M registered users · 84,200 DAU · 12 accounts under fraud review.</p></div></div>
    <div class="panel" id="panel-promo"><div class="card"><div class="card-title">Promotions & Coupons</div><p style="color:var(--muted)">Create platform-wide promo codes, referral campaigns, and loyalty programmes.</p></div></div>
    <div class="panel" id="panel-notifications"><div class="card"><div class="card-title">Notifications Hub</div><p style="color:var(--muted)">Manage WhatsApp Business API, email (SES), SMS (Twilio), and push notification templates.</p></div></div>
    <div class="panel" id="panel-rbac"><div class="card"><div class="card-title">RBAC & Permissions</div><p style="color:var(--muted)">Manage role-based access control for all portal users. Roles: Super Admin, Admin, Finance, Support, Organiser, Venue Manager, Event Manager, Scanner, POS Operator.</p></div></div>
  </div>
</div>

<script>
function showPanel(name,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('active'));
  const p=document.getElementById('panel-'+name);if(p)p.classList.add('active');if(btn)btn.classList.add('active');
  const t={dashboard:'Platform Dashboard',health:'System Health',organisers:'Organiser Approvals',venues:'Venue Approvals',events:'Event Approvals',kyc:'KYC Review Queue',finance:'Platform Revenue',settlements:'Settlements & Payouts',refunds:'Refund Management',gst:'GST Engine',cms:'Content Management',users:'User Management',bi:'BI & AI Analytics',promo:'Promotions & Coupons',notifications:'Notifications Hub',security:'Security Centre',audit:'Audit Logs',config:'Platform Config',rbac:'RBAC & Permissions'};
  document.getElementById('topbarTitle').textContent=t[name]||'Dashboard';
}
function approveOrg(n){if(confirm('Approve organiser: '+n+'?'))alert('✅ '+n+' approved! WhatsApp notification sent.');}
function rejectOrg(n){const r=prompt('Reason for rejecting '+n+'?');if(r)alert('❌ '+n+' rejected. Reason sent via email.');}
function viewOrg(n){alert('Opening full KYC dossier for: '+n);}
function approveEvent(e){if(confirm('Approve event: '+e+'?'))alert('✅ '+e+' is now LIVE on INDTIX!');}
function rejectEvent(e){const r=prompt('Reason for rejecting '+e+'?');if(r)alert('❌ Event rejected. Organiser notified.');}
function openCMS(n){alert('Opening CMS editor: '+n);}
</script>
</body>
</html>`
}
