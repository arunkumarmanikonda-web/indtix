export function opsPortalHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
<title>On-Ground Ops / POS – INDTIX</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{--brand:#6C3CF7;--brand2:#FF3CAC;--brand3:#00F5C4;--dark:#080B14;--dark2:#0F1320;--dark3:#161B2E;--card:#1A2035;--border:rgba(108,60,247,0.2);--text:#E8EAFF;--muted:#8B93B8;--grad1:linear-gradient(135deg,#6C3CF7,#FF3CAC);--green:#00F5C4;--red:#FF4444;--gold:#FFB300}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--dark);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh}
.ops-header{background:var(--dark3);border-bottom:1px solid var(--border);padding:12px 20px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.ops-logo{display:flex;align-items:center;gap:8px}
.logo-mark{width:32px;height:32px;background:var(--grad1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;color:#fff;font-family:'Space Grotesk',sans-serif}
.logo-text{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:16px}
.logo-text span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.ops-badge{background:rgba(100,200,255,0.15);border:1px solid rgba(100,200,255,0.3);color:#64C8FF;font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:1px}
.ops-user{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.ops-user i{font-size:16px}
.ops-nav{display:flex;background:var(--dark2);border-bottom:1px solid var(--border);overflow-x:auto;-webkit-overflow-scrolling:touch}
.ops-nav-btn{flex:1;min-width:80px;padding:12px 8px;background:transparent;border:none;color:var(--muted);font-size:12px;font-weight:600;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all 0.2s;white-space:nowrap;font-family:'Inter',sans-serif;border-bottom:2px solid transparent}
.ops-nav-btn i{font-size:18px}
.ops-nav-btn.active{color:var(--brand);border-bottom-color:var(--brand);background:rgba(108,60,247,0.08)}
.ops-nav-btn:hover{color:var(--text)}
.ops-content{padding:16px;max-width:600px;margin:0 auto}
.panel{display:none}.panel.active{display:block}

/* SCANNER */
.scanner-box{background:var(--dark3);border:2px solid var(--border);border-radius:20px;padding:24px;text-align:center;margin-bottom:16px}
.scanner-viewfinder{width:200px;height:200px;margin:0 auto 20px;border:2px solid var(--brand);border-radius:16px;position:relative;display:flex;align-items:center;justify-content:center;background:rgba(108,60,247,0.05)}
.scanner-corner{position:absolute;width:24px;height:24px;border-color:var(--brand);border-style:solid}
.scanner-corner.tl{top:-2px;left:-2px;border-width:3px 0 0 3px;border-radius:4px 0 0 0}
.scanner-corner.tr{top:-2px;right:-2px;border-width:3px 3px 0 0;border-radius:0 4px 0 0}
.scanner-corner.bl{bottom:-2px;left:-2px;border-width:0 0 3px 3px;border-radius:0 0 0 4px}
.scanner-corner.br{bottom:-2px;right:-2px;border-width:0 3px 3px 0;border-radius:0 0 4px 0}
.scanner-line{position:absolute;width:80%;height:2px;background:var(--brand);animation:scan 2s ease-in-out infinite;opacity:0.8;box-shadow:0 0 10px var(--brand)}
@keyframes scan{0%,100%{top:20%}50%{top:80%}}
.scanner-qr-icon{font-size:60px;color:rgba(108,60,247,0.3)}
.scanner-text{font-size:14px;font-weight:600;margin-bottom:8px}
.scanner-sub{font-size:12px;color:var(--muted);margin-bottom:16px}
.btn-scan{background:var(--grad1);border:none;color:#fff;padding:14px 32px;border-radius:14px;font-size:16px;font-weight:700;cursor:pointer;width:100%;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 24px rgba(108,60,247,0.4);transition:all 0.2s}
.btn-scan:hover{transform:scale(1.02)}
.btn-manual{background:var(--card);border:1px solid var(--border);color:var(--text);padding:12px 24px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;width:100%;font-family:'Inter',sans-serif;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:8px}
.scan-result{border-radius:14px;padding:16px;margin-bottom:12px;display:none}
.scan-result.valid{background:rgba(0,245,196,0.1);border:1px solid rgba(0,245,196,0.4)}
.scan-result.invalid{background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.4)}
.scan-result.duplicate{background:rgba(255,180,0,0.1);border:1px solid rgba(255,180,0,0.4)}
.scan-result-icon{font-size:36px;text-align:center;margin-bottom:8px}
.scan-result-title{font-size:18px;font-weight:800;text-align:center;margin-bottom:6px}
.scan-result-name{font-size:16px;font-weight:600;text-align:center;margin-bottom:12px}
.scan-result-details{background:rgba(0,0,0,0.2);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:6px}
.scan-detail{display:flex;justify-content:space-between;font-size:13px}
.scan-detail-label{color:var(--muted)}
.scan-detail-value{font-weight:600}
.stats-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
.stat-mini{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center}
.stat-mini-val{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.stat-mini-label{font-size:11px;color:var(--muted);margin-top:3px}

/* POS */
.pos-layout{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pos-products{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px}
.pos-cart{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px}
.pos-title{font-size:14px;font-weight:700;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}
.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.product-item{background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:10px;cursor:pointer;transition:all 0.2s;text-align:center}
.product-item:hover,.product-item:active{border-color:var(--brand);background:rgba(108,60,247,0.1)}
.product-emoji{font-size:24px;margin-bottom:4px}
.product-name{font-size:11px;font-weight:600}
.product-price{font-size:13px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-top:2px}
.cart-items{min-height:120px;margin-bottom:12px}
.cart-item{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.ci-name{flex:1;font-size:12px;font-weight:600}
.ci-qty{display:flex;align-items:center;gap:6px}
.ci-qty-btn{width:22px;height:22px;border-radius:50%;border:1px solid var(--border);background:var(--dark);color:var(--text);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ci-qty-num{font-size:13px;font-weight:700;min-width:16px;text-align:center}
.ci-price{font-size:13px;font-weight:700;color:var(--brand3)}
.cart-empty{text-align:center;padding:20px;color:var(--muted);font-size:13px}
.cart-total{background:var(--dark3);border-radius:10px;padding:12px;margin-bottom:10px}
.cart-total-row{display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px}
.cart-total-row.main{font-size:16px;font-weight:800;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)}
.cart-total-row.main span:last-child{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.pay-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:10px}
.pay-method-btn{background:var(--dark3);border:1px solid var(--border);border-radius:8px;padding:8px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;color:var(--text);text-align:center}
.pay-method-btn.active{border-color:var(--brand);background:rgba(108,60,247,0.15);color:var(--brand)}
.btn-pay{background:var(--grad1);border:none;color:#fff;padding:12px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;width:100%;font-family:'Inter',sans-serif}
.btn-clear{background:transparent;border:1px solid var(--border);color:var(--muted);padding:8px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;width:100%;font-family:'Inter',sans-serif;margin-bottom:8px}

/* WRISTBAND OPS */
.wb-ops-list{display:flex;flex-direction:column;gap:8px}
.wb-ops-item{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px}
.wb-color-dot{width:20px;height:20px;border-radius:50%;flex-shrink:0}
.wb-ops-info{flex:1}
.wb-ops-name{font-size:14px;font-weight:700}
.wb-ops-access{font-size:11px;color:var(--muted)}
.wb-ops-stats{text-align:right}
.wb-issued{font-size:16px;font-weight:700}
.wb-total{font-size:11px;color:var(--muted)}
.wb-progress{height:4px;background:var(--dark3);border-radius:2px;margin-top:6px;overflow:hidden}
.wb-prog-fill{height:100%;border-radius:2px;background:var(--grad1)}
.scan-log{display:flex;flex-direction:column;gap:6px;margin-top:12px}
.log-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;font-size:12px;animation:fadeIn 0.3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}
.log-valid{background:rgba(0,245,196,0.1);border:1px solid rgba(0,245,196,0.2)}
.log-invalid{background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.2)}
.log-dup{background:rgba(255,180,0,0.1);border:1px solid rgba(255,180,0,0.2)}
.log-icon{font-size:14px;flex-shrink:0}
.log-text{flex:1;font-weight:500}
.log-time{color:var(--muted);font-size:10px}
</style>
</head>
<body>

<div class="ops-header">
  <div class="ops-logo">
    <div class="logo-mark">IX</div>
    <span class="logo-text">IND<span>TIX</span></span>
    <span class="ops-badge">OPS</span>
  </div>
  <div class="ops-user">
    <i class="fas fa-wifi"></i>
    <span id="operatorName">Ankit Kumar · Gate 2</span>
  </div>
</div>

<div class="ops-nav">
  <button class="ops-nav-btn active" onclick="showOpsPanel('scanner',this)"><i class="fas fa-qrcode"></i>Scanner</button>
  <button class="ops-nav-btn" onclick="showOpsPanel('pos',this)"><i class="fas fa-cash-register"></i>POS</button>
  <button class="ops-nav-btn" onclick="showOpsPanel('wristbands',this)"><i class="fas fa-hand-sparkles"></i>Wristbands</button>
  <button class="ops-nav-btn" onclick="showOpsPanel('stats',this)"><i class="fas fa-chart-bar"></i>Live Stats</button>
  <button class="ops-nav-btn" onclick="showOpsPanel('log',this)"><i class="fas fa-list"></i>Scan Log</button>
</div>

<div class="ops-content">

  <!-- SCANNER -->
  <div class="panel active" id="ops-scanner">
    <div class="stats-mini">
      <div class="stat-mini"><div class="stat-mini-val" id="liveCheckin">2,841</div><div class="stat-mini-label">Checked In</div></div>
      <div class="stat-mini"><div class="stat-mini-val">4,200</div><div class="stat-mini-label">Total Expected</div></div>
      <div class="stat-mini"><div class="stat-mini-val" style="background:var(--brand3);-webkit-background-clip:text;-webkit-text-fill-color:transparent" id="livePct">68%</div><div class="stat-mini-label">Capacity</div></div>
    </div>

    <!-- Scan Result (shows after scan) -->
    <div class="scan-result valid" id="scanResult">
      <div class="scan-result-icon" id="resultIcon">✅</div>
      <div class="scan-result-title" id="resultTitle">VALID TICKET</div>
      <div class="scan-result-name" id="resultName">Arjun Sharma</div>
      <div class="scan-result-details">
        <div class="scan-detail"><span class="scan-detail-label">Ticket Type</span><span class="scan-detail-value" id="resultType">General Admission</span></div>
        <div class="scan-detail"><span class="scan-detail-label">Order ID</span><span class="scan-detail-value" id="resultOrderId">BK1744123456</span></div>
        <div class="scan-detail"><span class="scan-detail-label">Seat / Zone</span><span class="scan-detail-value" id="resultSeat">Floor GA</span></div>
        <div class="scan-detail"><span class="scan-detail-label">Entry</span><span class="scan-detail-value" id="resultEntry">Gate 2</span></div>
      </div>
    </div>

    <div class="scanner-box">
      <div class="scanner-viewfinder">
        <div class="scanner-corner tl"></div>
        <div class="scanner-corner tr"></div>
        <div class="scanner-corner bl"></div>
        <div class="scanner-corner br"></div>
        <div class="scanner-line" id="scanLine"></div>
        <i class="fas fa-qrcode scanner-qr-icon" id="scannerQRIcon"></i>
      </div>
      <div class="scanner-text">Point camera at QR code</div>
      <div class="scanner-sub">Or tap Scan to simulate scanning</div>
      <button class="btn-scan" onclick="simulateScan()"><i class="fas fa-camera"></i> Scan Ticket / NFC</button>
      <button class="btn-manual" onclick="manualEntry()"><i class="fas fa-keyboard"></i> Manual Ticket Entry</button>
    </div>
  </div>

  <!-- POS -->
  <div class="panel" id="ops-pos">
    <div class="pos-layout">
      <div class="pos-products">
        <div class="pos-title">Products <span style="font-size:11px;color:var(--muted)">Tap to add</span></div>
        <div class="product-grid" id="productGrid">
          ${[['🍔','Burger','₹180'],['🥤','Cold Drink','₹80'],['🍕','Pizza Slice','₹220'],['☕','Coffee','₹120'],['🌮','Wrap','₹160'],['🍺','Beer','₹350'],['🧃','Juice','₹90'],['🎁','Event Merch','₹899']].map(([e,n,p])=>`
            <div class="product-item" onclick="addToCart('${n}',${parseInt(p.replace('₹',''))})">
              <div class="product-emoji">${e}</div>
              <div class="product-name">${n}</div>
              <div class="product-price">${p}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="pos-cart">
        <div class="pos-title">Cart <button onclick="clearCart()" style="background:transparent;border:none;color:var(--muted);font-size:11px;cursor:pointer;font-family:'Inter',sans-serif">Clear</button></div>
        <div class="cart-items" id="cartItems"><div class="cart-empty"><i class="fas fa-shopping-basket" style="font-size:24px;margin-bottom:8px;display:block;opacity:0.4"></i>Cart is empty</div></div>
        <div class="cart-total" id="cartTotal" style="display:none">
          <div class="cart-total-row"><span>Subtotal</span><span id="cartSubtotal">₹0</span></div>
          <div class="cart-total-row"><span>GST (18%)</span><span id="cartGST">₹0</span></div>
          <div class="cart-total-row main"><span>Total</span><span id="cartTotalAmt">₹0</span></div>
        </div>
        <div class="pay-methods">
          <button class="pay-method-btn active" onclick="selectPay(this,'cash')">💵 Cash</button>
          <button class="pay-method-btn" onclick="selectPay(this,'upi')">📱 UPI</button>
          <button class="pay-method-btn" onclick="selectPay(this,'card')">💳 Card</button>
        </div>
        <button class="btn-pay" onclick="processPOSPayment()">💳 Process Payment</button>
      </div>
    </div>
  </div>

  <!-- WRISTBANDS -->
  <div class="panel" id="ops-wristbands">
    <div class="card" style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">💡 LED Band Control</div>
      <div style="text-align:center;padding:12px">
        <div style="font-size:28px;margin-bottom:8px">💡 2,400 bands synced</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px">
          ${['#FF0000','#00AAFF','#00FF88','#FFB300','#FF3CAC','#FFFFFF'].map(c=>`<button onclick="setLED('${c}')" style="background:${c};border:none;border-radius:8px;height:32px;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'"></button>`).join('')}
          <button onclick="setLED('rainbow')" style="background:var(--grad1);border:none;border-radius:8px;height:32px;cursor:pointer;color:#fff;font-size:12px">🌈</button>
          <button onclick="setLED('off')" style="background:var(--dark3);border:1px solid var(--border);border-radius:8px;height:32px;cursor:pointer;color:var(--muted);font-size:11px">OFF</button>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          ${['Pulse','Wave','Strobe','Beat Sync','Fade','Sparkle'].map(e=>`<button onclick="ledMode('${e}')" style="background:var(--dark3);border:1px solid var(--border);border-radius:8px;padding:6px 12px;color:var(--text);cursor:pointer;font-size:12px;font-family:'Inter',sans-serif">${e}</button>`).join('')}
        </div>
      </div>
    </div>
    <div class="wb-ops-list">
      ${[['#6C3CF7','VIP Platinum',340,400,'All Access + Backstage','85'],['#FF3CAC','VIP Gold',820,1000,'VIP Lounge + Stage View','82'],['#00F5C4','Premium',1180,1500,'Premium Zone Access','79'],['#FFB300','General',501,1300,'General Floor','39']].map(([c,n,iss,tot,acc,pct])=>`
        <div class="wb-ops-item">
          <div class="wb-color-dot" style="background:${c}"></div>
          <div class="wb-ops-info"><div class="wb-ops-name">${n}</div><div class="wb-ops-access">${acc}</div></div>
          <div class="wb-ops-stats">
            <div class="wb-issued">${iss}</div>
            <div class="wb-total">/ ${tot} issued</div>
            <div class="wb-progress"><div class="wb-prog-fill" style="width:${pct}%"></div></div>
          </div>
        </div>`).join('')}
    </div>
  </div>

  <!-- LIVE STATS -->
  <div class="panel" id="ops-stats">
    <div class="stats-mini">
      <div class="stat-mini"><div class="stat-mini-val">2,841</div><div class="stat-mini-label">Checked In</div></div>
      <div class="stat-mini"><div class="stat-mini-val">1,359</div><div class="stat-mini-label">Remaining</div></div>
      <div class="stat-mini"><div class="stat-mini-val" style="background:var(--brand3);-webkit-background-clip:text;-webkit-text-fill-color:transparent">68%</div><div class="stat-mini-label">Filled</div></div>
    </div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px;margin-bottom:12px">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">Gate-wise Entry</div>
      ${[['Gate 1 — Main','892','1000',89],['Gate 2 — General','1240','1600',78],['Gate 3 — VIP','342','400',86],['Gate 4 — CLOSED','0','200',0]].map(([g,c,t,p])=>`
        <div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span style="font-weight:600">${g}</span>
            <span style="color:var(--muted)">${c} / ${t}</span>
          </div>
          <div style="background:var(--dark3);border-radius:4px;height:8px;overflow:hidden">
            <div style="width:${p}%;height:100%;background:var(--grad1);border-radius:4px"></div>
          </div>
        </div>`).join('')}
    </div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px">
      <div style="font-size:14px;font-weight:700;margin-bottom:12px">POS Summary</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        ${[['Total Orders','840'],['Revenue','₹2.94L'],['Avg Order','₹350'],['Cash Payments','42%']].map(([l,v])=>`
          <div style="background:var(--dark3);border:1px solid var(--border);border-radius:10px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:700;background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent">${v}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:3px">${l}</div>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- SCAN LOG -->
  <div class="panel" id="ops-log">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="font-size:14px;font-weight:700">Recent Scans</div>
      <span style="font-size:12px;color:var(--muted)">Gate 2 · Live</span>
    </div>
    <div class="scan-log" id="scanLog">
      <div class="log-item log-valid"><span class="log-icon">✅</span><span class="log-text">Arjun Sharma — GA · BK174412</span><span class="log-time">18:42:31</span></div>
      <div class="log-item log-valid"><span class="log-icon">✅</span><span class="log-text">Priya Nair — Premium · BK174411</span><span class="log-time">18:42:28</span></div>
      <div class="log-item log-dup"><span class="log-icon">⚠️</span><span class="log-text">DUPLICATE — BK174408 already used</span><span class="log-time">18:42:19</span></div>
      <div class="log-item log-valid"><span class="log-icon">✅</span><span class="log-text">Rohan Mehta — VIP Gold · BK174407</span><span class="log-time">18:42:14</span></div>
      <div class="log-item log-invalid"><span class="log-icon">❌</span><span class="log-text">INVALID — QR code tampered or fake</span><span class="log-time">18:42:05</span></div>
      <div class="log-item log-valid"><span class="log-icon">✅</span><span class="log-text">Sneha Kapoor — GA · BK174406</span><span class="log-time">18:41:58</span></div>
    </div>
  </div>

</div>

<script>
function showOpsPanel(name,btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ops-nav-btn').forEach(b=>b.classList.remove('active'));
  const p=document.getElementById('ops-'+name);if(p)p.classList.add('active');if(btn)btn.classList.add('active');
}

const scanNames=['Arjun Sharma','Priya Nair','Rohan Mehta','Sneha Kapoor','Vikram Iyer','Anjali Singh','Dev Patel','Meera Rao','Kabir Khan','Ishaan Tiwari'];
const ticketTypes=['General Admission','Premium Standing','VIP Gold','VIP Platinum'];
let scanCount=2841;

function simulateScan(){
  const r=Math.random();
  const result=document.getElementById('scanResult');
  result.style.display='block';
  result.scrollIntoView({behavior:'smooth'});

  if(r>0.85){
    result.className='scan-result invalid';
    document.getElementById('resultIcon').textContent='❌';
    document.getElementById('resultTitle').textContent='INVALID TICKET';
    document.getElementById('resultTitle').style.color='var(--red)';
    document.getElementById('resultName').textContent='Ticket not recognised or tampered';
    addToLog('invalid','INVALID — QR code tampered or fake');
    playBeep(false);
  } else if(r>0.75){
    result.className='scan-result duplicate';
    document.getElementById('resultIcon').textContent='⚠️';
    document.getElementById('resultTitle').textContent='ALREADY USED';
    document.getElementById('resultTitle').style.color='var(--gold)';
    document.getElementById('resultName').textContent='This ticket was already scanned';
    addToLog('dup','DUPLICATE — Ticket already used');
    playBeep(false);
  } else {
    result.className='scan-result valid';
    const name=scanNames[Math.floor(Math.random()*scanNames.length)];
    const type=ticketTypes[Math.floor(Math.random()*ticketTypes.length)];
    const orderId='BK'+Math.floor(Math.random()*9000000+1000000);
    document.getElementById('resultIcon').textContent='✅';
    document.getElementById('resultTitle').textContent='VALID TICKET';
    document.getElementById('resultTitle').style.color='var(--green)';
    document.getElementById('resultName').textContent=name;
    document.getElementById('resultType').textContent=type;
    document.getElementById('resultOrderId').textContent=orderId;
    document.getElementById('resultSeat').textContent=type.includes('VIP')?'VIP Zone A':'Floor GA';
    document.getElementById('resultEntry').textContent='Gate 2';
    scanCount++;
    document.getElementById('liveCheckin').textContent=scanCount.toLocaleString('en-IN');
    document.getElementById('livePct').textContent=Math.round(scanCount/4200*100)+'%';
    addToLog('valid',name+' — '+type.split(' ')[0]+' · '+orderId.slice(0,9));
    playBeep(true);
  }
  setTimeout(()=>{result.style.display='none';},4000);
}

function manualEntry(){
  const id=prompt('Enter Ticket ID or Order Number:');
  if(id){simulateScan();}
}

function addToLog(type,text){
  const log=document.getElementById('scanLog');
  if(!log)return;
  const now=new Date();
  const time=now.getHours()+':'+String(now.getMinutes()).padStart(2,'0')+':'+String(now.getSeconds()).padStart(2,'0');
  const div=document.createElement('div');
  div.className='log-item log-'+type;
  div.innerHTML='<span class="log-icon">'+(type==='valid'?'✅':type==='invalid'?'❌':'⚠️')+'</span><span class="log-text">'+text+'</span><span class="log-time">'+time+'</span>';
  log.insertBefore(div,log.firstChild);
  if(log.children.length>20)log.removeChild(log.lastChild);
}

function playBeep(success){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    const o=ctx.createOscillator();const g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    o.frequency.value=success?880:220;
    o.type=success?'sine':'square';
    g.gain.setValueAtTime(0.3,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+(success?0.3:0.5));
    o.start(ctx.currentTime);o.stop(ctx.currentTime+(success?0.3:0.5));
  }catch(e){}
}

// POS
let cart={};
function addToCart(name,price){
  if(!cart[name])cart[name]={price,qty:0};
  cart[name].qty++;
  updateCart();
}

function updateCart(){
  const items=document.getElementById('cartItems');
  const total=document.getElementById('cartTotal');
  const keys=Object.keys(cart).filter(k=>cart[k].qty>0);
  if(!keys.length){
    items.innerHTML='<div class="cart-empty"><i class="fas fa-shopping-basket" style="font-size:24px;margin-bottom:8px;display:block;opacity:0.4"></i>Cart is empty</div>';
    total.style.display='none';return;
  }
  const sub=keys.reduce((s,k)=>s+cart[k].price*cart[k].qty,0);
  const gst=Math.round(sub*0.18);
  items.innerHTML=keys.map(k=>`<div class="cart-item"><div class="ci-name">${k}</div><div class="ci-qty"><button class="ci-qty-btn" onclick="changeCartQty('${k}',-1)">−</button><span class="ci-qty-num">${cart[k].qty}</span><button class="ci-qty-btn" onclick="changeCartQty('${k}',1)">+</button></div><div class="ci-price">₹${(cart[k].price*cart[k].qty).toLocaleString('en-IN')}</div></div>`).join('');
  document.getElementById('cartSubtotal').textContent='₹'+sub.toLocaleString('en-IN');
  document.getElementById('cartGST').textContent='₹'+gst.toLocaleString('en-IN');
  document.getElementById('cartTotalAmt').textContent='₹'+(sub+gst).toLocaleString('en-IN');
  total.style.display='block';
}

function changeCartQty(name,delta){
  cart[name].qty=Math.max(0,cart[name].qty+delta);
  updateCart();
}

function clearCart(){cart={};updateCart();}

function selectPay(btn,method){
  document.querySelectorAll('.pay-method-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function processPOSPayment(){
  const keys=Object.keys(cart).filter(k=>cart[k].qty>0);
  if(!keys.length){alert('Cart is empty!');return;}
  const sub=keys.reduce((s,k)=>s+cart[k].price*cart[k].qty,0);
  alert('✅ Payment of ₹'+Math.round(sub*1.18).toLocaleString('en-IN')+' processed!\nReceipt sent via WhatsApp.');
  clearCart();
}

function setLED(c){alert('LED bands set to: '+(c==='rainbow'?'Rainbow':c==='off'?'Off':c));}
function ledMode(m){alert('LED mode: '+m+' activated for all 2,400 bands.');}
</script>
</body>
</html>`
}

export function architectureHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>INDTIX Architecture Blueprint</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{--brand:#6C3CF7;--brand2:#FF3CAC;--brand3:#00F5C4;--dark:#080B14;--dark2:#0F1320;--dark3:#161B2E;--card:#1A2035;--border:rgba(108,60,247,0.2);--text:#E8EAFF;--muted:#8B93B8;--grad1:linear-gradient(135deg,#6C3CF7,#FF3CAC)}
*{margin:0;padding:0;box-sizing:border-box}body{background:var(--dark);color:var(--text);font-family:'Inter',sans-serif;line-height:1.6}
nav{position:sticky;top:0;background:rgba(8,11,20,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);z-index:100}
.nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;justify-content:space-between}
.logo-wrap{display:flex;align-items:center;gap:10px;text-decoration:none}.logo-mark{width:32px;height:32px;background:var(--grad1);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#fff;font-family:'Space Grotesk',sans-serif}
.logo-text{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;color:#fff}.logo-text span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:4px}.nav-links a{color:var(--muted);text-decoration:none;padding:6px 12px;border-radius:8px;font-size:13px;transition:all 0.2s}.nav-links a:hover{color:#fff;background:rgba(108,60,247,0.15)}
.hero-doc{background:linear-gradient(135deg,rgba(108,60,247,0.15),rgba(255,60,172,0.08));border-bottom:1px solid var(--border);padding:60px 24px;text-align:center}
.hero-doc h1{font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,5vw,56px);font-weight:700;letter-spacing:-2px;margin-bottom:12px}
.hero-doc h1 span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-doc p{font-size:16px;color:var(--muted);max-width:600px;margin:0 auto 24px}
.doc-tags{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.doc-tag{background:rgba(108,60,247,0.15);border:1px solid rgba(108,60,247,0.3);color:var(--brand);padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
.doc-content{max-width:1100px;margin:0 auto;padding:40px 24px}
.section{margin-bottom:48px}
.section-badge{display:inline-block;background:rgba(108,60,247,0.15);border:1px solid rgba(108,60,247,0.3);color:var(--brand);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px}
h2{font-family:'Space Grotesk',sans-serif;font-size:clamp(22px,3vw,32px);font-weight:700;letter-spacing:-0.5px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border)}
h2 span{background:var(--grad1);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
h3{font-size:18px;font-weight:700;margin:20px 0 10px;color:var(--text)}
p{color:var(--muted);margin-bottom:12px;font-size:15px}
.grid-2{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.info-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:20px;position:relative;overflow:hidden}
.info-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--grad1)}
.info-card h4{font-size:15px;font-weight:700;margin-bottom:8px}
.info-card p{font-size:13px;margin-bottom:0}
.info-card ul{list-style:none;display:flex;flex-direction:column;gap:4px}
.info-card ul li{font-size:13px;color:var(--muted);display:flex;align-items:flex-start;gap:6px}
.info-card ul li::before{content:'▸';color:var(--brand);flex-shrink:0;margin-top:1px}
code{font-family:'Fira Code',monospace;background:var(--dark3);padding:2px 6px;border-radius:4px;font-size:12px;color:var(--brand3)}
pre{background:var(--dark3);border:1px solid var(--border);border-radius:12px;padding:20px;overflow-x:auto;margin:12px 0}
pre code{background:transparent;padding:0;color:var(--text);font-size:12px;line-height:1.7}
.table-wrap{overflow-x:auto;margin:12px 0}
table{width:100%;border-collapse:collapse;font-size:13px}
th{padding:10px 12px;text-align:left;font-weight:600;color:var(--muted);border-bottom:1px solid var(--border);font-size:12px;text-transform:uppercase;letter-spacing:0.5px}
td{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,0.04);vertical-align:top}
.tag{display:inline-block;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600}
.tag-blue{background:rgba(108,60,247,0.2);color:var(--brand)}.tag-green{background:rgba(0,245,196,0.15);color:var(--brand3)}.tag-pink{background:rgba(255,60,172,0.15);color:var(--brand2)}.tag-gold{background:rgba(255,180,0,0.15);color:#FFB300}
.arch-diagram{background:var(--dark3);border:1px solid var(--border);border-radius:16px;padding:24px;margin:16px 0;font-family:'Fira Code',monospace;font-size:12px;line-height:1.8;overflow-x:auto}
.arch-layer{margin-bottom:16px;padding:12px;border-radius:10px}
.layer-cdn{background:rgba(108,60,247,0.08);border-left:3px solid var(--brand)}
.layer-edge{background:rgba(0,245,196,0.06);border-left:3px solid var(--brand3)}
.layer-api{background:rgba(255,60,172,0.06);border-left:3px solid var(--brand2)}
.layer-data{background:rgba(255,180,0,0.06);border-left:3px solid #FFB300}
.layer-infra{background:rgba(100,200,255,0.06);border-left:3px solid #64C8FF}
.layer-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.roadmap-item{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;display:flex;gap:16px;margin-bottom:10px}
.roadmap-phase{min-width:90px;font-weight:700;font-size:13px}
.phase-mvp{color:var(--brand)}
.phase-p2{color:var(--brand3)}
.phase-ent{color:var(--brand2)}
.risk-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
.risk-level{min-width:60px;font-size:11px;font-weight:700;padding:3px 8px;border-radius:20px;text-align:center;height:fit-content;margin-top:3px}
.risk-high{background:rgba(255,68,68,0.2);color:#FF4444}.risk-med{background:rgba(255,180,0,0.2);color:#FFB300}.risk-low{background:rgba(0,245,196,0.2);color:var(--brand3)}
.portal-nav{display:flex;gap:12px;margin-top:24px;flex-wrap:wrap}
.portal-nav a{display:flex;align-items:center;gap:8px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:10px 16px;text-decoration:none;color:var(--text);font-size:13px;font-weight:600;transition:all 0.2s}
.portal-nav a:hover{border-color:var(--brand);background:rgba(108,60,247,0.1)}
</style>
</head>
<body>
<nav><div class="nav-inner"><a href="/" class="logo-wrap"><div class="logo-mark">IX</div><span class="logo-text">IND<span>TIX</span></span></a><div class="nav-links"><a href="/">Fan Portal</a><a href="/organiser">Organiser</a><a href="/venue">Venue</a><a href="/admin">Admin</a><a href="/ops">Ops</a></div></div></nav>

<div class="hero-doc">
  <div class="doc-tag" style="margin-bottom:12px;display:inline-block">Confidential · Oye Imagine Private Limited</div>
  <h1><span>INDTIX</span> Architecture Blueprint</h1>
  <p>Complete technical specification, system architecture, tech stack, database schema, API design, security, compliance, and launch roadmap for India's next-generation event commerce platform.</p>
  <div class="doc-tags">
    <span class="doc-tag">v1.0 · March 2025</span><span class="doc-tag">Multi-tenant · Edge-first</span><span class="doc-tag">Enterprise-grade Security</span><span class="doc-tag">AI-powered</span><span class="doc-tag">GST-compliant</span>
  </div>
</div>

<div class="doc-content">

  <!-- EXECUTIVE VISION -->
  <div class="section" id="vision">
    <div class="section-badge">01 · Executive Vision</div>
    <h2>Platform <span>Vision & Mission</span></h2>
    <p>INDTIX is Oye Imagine Private Limited's flagship B2C2B event commerce platform — purpose-built to dominate India's ₹12,000 Cr live events industry by 2027. We serve six distinct stakeholders through purpose-built portals, powered by AI, secured at enterprise grade, and built for the youth of India.</p>
    <div class="grid-2">
      <div class="info-card"><h4>🎯 Mission</h4><p>Democratise live event access for 500M+ Indians by eliminating friction from discovery to on-ground redemption, while giving every organiser and venue a world-class management platform.</p></div>
      <div class="info-card"><h4>🏆 Positioning</h4><p>Original, youth-forward, and trust-first. Not a clone of District or BookMyShow — INDTIX sets new standards with AI recommendations, deep seat mapping, NFC wristbands, and GST-accurate commerce.</p></div>
      <div class="info-card"><h4>💼 Legal Entity</h4><ul><li>Oye Imagine Private Limited (Operator)</li><li>GSTIN: 27AABCO1234A1Z5</li><li>RBI Payment Aggregator licence (applied)</li><li>PCI-DSS Level 1 compliance target</li><li>IT Act 2000 + DPDP Act 2023 compliant</li></ul></div>
      <div class="info-card"><h4>📊 Revenue Model</h4><ul><li>Platform commission: 8–12% of ticket GMV</li><li>Convenience fee: ₹20–₹50 per order</li><li>Promoted listings: ₹5,000–₹50,000/event</li><li>F&B/Merch commission: 5–15%</li><li>Wristband/NFC hardware margin</li><li>White-label SaaS licensing</li></ul></div>
    </div>
  </div>

  <!-- PORTALS & ROLES -->
  <div class="section" id="portals">
    <div class="section-badge">02 · Information Architecture</div>
    <h2>Six <span>Portals & Roles</span></h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Portal</th><th>Primary Users</th><th>Core Functions</th><th>Auth Level</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td><strong>Fan / Customer</strong></td><td>General public, event-goers</td><td>Discovery, booking, seat selection, add-ons, tickets, profile</td><td>Email / OTP / Social</td><td><span class="tag tag-green">Live</span></td></tr>
          <tr><td><strong>Organiser</strong></td><td>Event promoters, agencies</td><td>Event creation (with approval), ticket builder, seat map, analytics, settlements</td><td>KYC-verified only</td><td><span class="tag tag-green">Live</span></td></tr>
          <tr><td><strong>Venue Manager</strong></td><td>Venue owners, managers</td><td>Venue listing, floor plan, availability, booking management, docs</td><td>KYC-verified only</td><td><span class="tag tag-green">Live</span></td></tr>
          <tr><td><strong>Event Manager</strong></td><td>On-day ops team, producers</td><td>Run sheet, tasks, live check-in, wristband control, incidents, POS</td><td>Invited by organiser</td><td><span class="tag tag-green">Live</span></td></tr>
          <tr><td><strong>Super Admin / ERP</strong></td><td>Oye Imagine team</td><td>All approvals, finance, CMS, BI, user management, security, config</td><td>Root / MFA required</td><td><span class="tag tag-green">Live</span></td></tr>
          <tr><td><strong>On-Ground Ops / POS</strong></td><td>Gate staff, F&B cashiers</td><td>QR scanner, NFC scan, POS sales, LED band control, live stats</td><td>Event-scoped token</td><td><span class="tag tag-green">Live</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- TECH STACK -->
  <div class="section" id="techstack">
    <div class="section-badge">03 · Tech Stack</div>
    <h2>Recommended <span>Technology Stack</span></h2>
    <div class="grid-3">
      <div class="info-card"><h4>🎨 Frontend</h4><ul><li><strong>Web:</strong> Next.js 14 (App Router) + TypeScript</li><li><strong>Mobile:</strong> React Native (Expo) for iOS/Android</li><li><strong>Styling:</strong> TailwindCSS + shadcn/ui</li><li><strong>State:</strong> Zustand + React Query</li><li><strong>Animations:</strong> Framer Motion</li></ul></div>
      <div class="info-card"><h4>⚙️ Backend</h4><ul><li><strong>API:</strong> Node.js + Hono (edge) / NestJS (core)</li><li><strong>Architecture:</strong> Modular monolith → microservices</li><li><strong>Auth:</strong> JWT + Refresh tokens + OTP</li><li><strong>Realtime:</strong> Socket.io / Cloudflare Durable Objects</li><li><strong>Jobs:</strong> BullMQ + Redis</li></ul></div>
      <div class="info-card"><h4>🗄️ Database</h4><ul><li><strong>Primary:</strong> PostgreSQL (Supabase/Neon)</li><li><strong>Cache:</strong> Redis (Upstash)</li><li><strong>Search:</strong> Algolia / Typesense</li><li><strong>File Storage:</strong> Cloudflare R2 / AWS S3</li><li><strong>Edge DB:</strong> Cloudflare D1 (SQLite)</li></ul></div>
      <div class="info-card"><h4>💳 Payments</h4><ul><li><strong>Primary:</strong> Razorpay (UPI, Card, Wallet, EMI)</li><li><strong>International:</strong> Stripe</li><li><strong>Refunds:</strong> Automated via Razorpay API</li><li><strong>Payouts:</strong> Razorpay Route (T+7)</li><li><strong>GST:</strong> Custom engine + GSTN API</li></ul></div>
      <div class="info-card"><h4>📬 Notifications</h4><ul><li><strong>WhatsApp:</strong> Meta Business API (360dialog)</li><li><strong>Email:</strong> AWS SES / Resend</li><li><strong>SMS:</strong> Twilio / Fast2SMS</li><li><strong>Push:</strong> Firebase FCM</li><li><strong>In-App:</strong> Custom notification centre</li></ul></div>
      <div class="info-card"><h4>🚀 Infrastructure</h4><ul><li><strong>Hosting:</strong> Cloudflare Pages + Workers</li><li><strong>CDN:</strong> Cloudflare (global PoP)</li><li><strong>Containers:</strong> Docker + Kubernetes (GKE)</li><li><strong>CI/CD:</strong> GitHub Actions + Wrangler</li><li><strong>Monitoring:</strong> Sentry + Datadog + Grafana</li></ul></div>
      <div class="info-card"><h4>🤖 AI / ML</h4><ul><li><strong>Recommendations:</strong> OpenAI Embeddings + custom CF</li><li><strong>Fraud Detection:</strong> Custom ML (Vertex AI)</li><li><strong>Dynamic Pricing:</strong> Prophet + custom model</li><li><strong>Chatbot:</strong> OpenAI GPT-4o API + fine-tuning</li><li><strong>Analytics:</strong> BigQuery + Looker Studio</li></ul></div>
      <div class="info-card"><h4>🔐 Security</h4><ul><li><strong>WAF:</strong> Cloudflare WAF + Bot Protection</li><li><strong>Auth:</strong> Aadhaar OTP (age verify) + MFA</li><li><strong>Encryption:</strong> AES-256 at rest, TLS 1.3 transit</li><li><strong>Secrets:</strong> HashiCorp Vault</li><li><strong>Audit:</strong> Immutable audit log (WORM storage)</li></ul></div>
      <div class="info-card"><h4>📊 Analytics</h4><ul><li><strong>Product:</strong> Mixpanel + Hotjar</li><li><strong>Business:</strong> BigQuery + Looker</li><li><strong>Error:</strong> Sentry + LogRocket</li><li><strong>Performance:</strong> Datadog APM</li><li><strong>A/B Testing:</strong> LaunchDarkly</li></ul></div>
    </div>
  </div>

  <!-- ARCHITECTURE DIAGRAM -->
  <div class="section" id="architecture">
    <div class="section-badge">04 · System Architecture</div>
    <h2>System <span>Architecture Overview</span></h2>
    <div class="arch-diagram">
      <div class="arch-layer layer-cdn">
        <div class="layer-title">🌍 CDN & EDGE LAYER (Cloudflare Global Network — 300+ PoPs)</div>
        <span style="color:var(--brand)">DDoS Protection</span> · <span style="color:var(--brand3)">WAF Rules</span> · <span style="color:var(--brand2)">Bot Management</span> · <span style="color:#FFB300">Image Optimisation</span> · <span style="color:#64C8FF">Rate Limiting</span>
      </div>
      <div style="text-align:center;color:var(--muted);font-size:18px;padding:4px">↕</div>
      <div class="arch-layer layer-edge">
        <div class="layer-title">⚡ EDGE FUNCTIONS (Cloudflare Workers — 0ms cold start)</div>
        <span style="color:var(--brand3)">Fan Portal (Next.js SSR)</span> · <span style="color:var(--brand)">API Gateway (Hono)</span> · <span style="color:var(--brand2)">Auth Middleware</span> · <span style="color:#FFB300">A/B Testing</span> · <span style="color:#64C8FF">Geo-routing</span>
      </div>
      <div style="text-align:center;color:var(--muted);font-size:18px;padding:4px">↕</div>
      <div class="arch-layer layer-api">
        <div class="layer-title">🔧 CORE API SERVICES (Node.js / NestJS Microservices)</div>
        <span style="color:var(--brand2)">Event Service</span> · <span style="color:var(--brand)">Booking Service</span> · <span style="color:var(--brand3)">Payment Service</span> · <span style="color:#FFB300">User/Auth Service</span> · <span style="color:#64C8FF">Notification Service</span> · <span style="color:var(--brand2)">Search Service</span> · <span style="color:var(--brand)">Analytics Service</span> · <span style="color:var(--brand3)">Admin/ERP Service</span>
      </div>
      <div style="text-align:center;color:var(--muted);font-size:18px;padding:4px">↕</div>
      <div class="arch-layer layer-data">
        <div class="layer-title">🗄️ DATA LAYER</div>
        <span style="color:#FFB300">PostgreSQL (Primary DB)</span> · <span style="color:var(--brand3)">Redis (Cache + Sessions)</span> · <span style="color:var(--brand)">Algolia (Search)</span> · <span style="color:var(--brand2)">Cloudflare R2 (Media)</span> · <span style="color:#64C8FF">BigQuery (Analytics)</span> · <span style="color:#FFB300">BullMQ (Job Queue)</span>
      </div>
      <div style="text-align:center;color:var(--muted);font-size:18px;padding:4px">↕</div>
      <div class="arch-layer layer-infra">
        <div class="layer-title">🏗️ EXTERNAL INTEGRATIONS</div>
        <span style="color:#64C8FF">Razorpay (Payments)</span> · <span style="color:var(--brand3)">Meta WhatsApp Business API</span> · <span style="color:var(--brand)">AWS SES (Email)</span> · <span style="color:#FFB300">GSTN API (GST)</span> · <span style="color:var(--brand2)">Aadhaar OTP (KYC)</span> · <span style="color:#64C8FF">OpenAI GPT-4o (AI)</span>
      </div>
    </div>
  </div>

  <!-- DATABASE SCHEMA -->
  <div class="section" id="database">
    <div class="section-badge">05 · Database Schema</div>
    <h2>Core <span>Database Schema</span></h2>
    <pre><code>-- USERS TABLE
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT UNIQUE,
  full_name     TEXT NOT NULL,
  avatar_url    TEXT,
  role          TEXT DEFAULT 'fan', -- fan | organiser | venue | event_manager | admin | ops
  kyc_status    TEXT DEFAULT 'pending', -- pending | submitted | verified | rejected
  gst_number    TEXT,
  pan_number    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_login    TIMESTAMPTZ,
  is_active     BOOLEAN DEFAULT TRUE,
  mfa_enabled   BOOLEAN DEFAULT FALSE
);

-- EVENTS TABLE
CREATE TABLE events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organiser_id  UUID REFERENCES users(id),
  venue_id      UUID REFERENCES venues(id),
  title         TEXT NOT NULL,
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL, -- music | comedy | sports | theatre | conference | etc.
  subcategory   TEXT,
  event_date    TIMESTAMPTZ NOT NULL,
  end_date      TIMESTAMPTZ,
  city          TEXT NOT NULL,
  status        TEXT DEFAULT 'draft', -- draft | pending_approval | approved | live | cancelled | completed
  max_capacity  INTEGER DEFAULT 1000,
  ticket_cap_per_user INTEGER DEFAULT 10, -- default 10, overrideable
  age_restriction TEXT DEFAULT 'all_ages',
  banner_url    TEXT,
  gst_applicable BOOLEAN DEFAULT TRUE,
  is_featured   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  approved_at   TIMESTAMPTZ,
  approved_by   UUID REFERENCES users(id)
);

-- TICKET TYPES TABLE
CREATE TABLE ticket_types (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID REFERENCES events(id),
  name          TEXT NOT NULL, -- GA | Premium | VIP | etc.
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  quantity      INTEGER NOT NULL,
  sold_count    INTEGER DEFAULT 0,
  sort_order    INTEGER DEFAULT 0,
  sale_start    TIMESTAMPTZ,
  sale_end      TIMESTAMPTZ,
  min_qty       INTEGER DEFAULT 1,
  max_qty       INTEGER DEFAULT 10
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref   TEXT UNIQUE NOT NULL, -- BK + timestamp
  user_id       UUID REFERENCES users(id),
  event_id      UUID REFERENCES events(id),
  status        TEXT DEFAULT 'pending', -- pending | confirmed | cancelled | refunded
  subtotal      DECIMAL(10,2),
  convenience_fee DECIMAL(10,2) DEFAULT 20,
  gst_amount    DECIMAL(10,2),
  total_amount  DECIMAL(10,2),
  payment_method TEXT, -- upi | card | netbanking | wallet | emi
  payment_gateway_id TEXT,
  payment_status TEXT DEFAULT 'pending', -- pending | paid | failed | refunded
  qr_code_data  TEXT,
  nfc_uid       TEXT,
  checkin_time  TIMESTAMPTZ,
  checkin_gate  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  gst_invoice_no TEXT
);

-- VENUES TABLE  
CREATE TABLE venues (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES users(id),
  name          TEXT NOT NULL,
  venue_type    TEXT, -- indoor | outdoor | theatre | stadium
  city          TEXT NOT NULL,
  address       TEXT NOT NULL,
  lat           DECIMAL(10,8),
  lng           DECIMAL(11,8),
  capacity      INTEGER,
  parking       INTEGER,
  status        TEXT DEFAULT 'pending_approval',
  gstin         TEXT,
  fire_noc_expiry DATE,
  liquor_license BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);</code></pre>
  </div>

  <!-- API DESIGN -->
  <div class="section" id="api">
    <div class="section-badge">06 · API Design</div>
    <h2>RESTful <span>API Reference</span></h2>
    <p>All APIs use <code>https://api.indtix.com/v1</code> as base URL. Authentication via Bearer JWT token.</p>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr></thead>
        <tbody>
          ${[
            ['GET','/events','Public','List events with filters (city, category, date, price range)'],
            ['GET','/events/:slug','Public','Get single event details with ticket types and seat map'],
            ['POST','/events','Organiser','Create new event (triggers approval workflow)'],
            ['PUT','/events/:id','Organiser','Update event details'],
            ['DELETE','/events/:id','Organiser/Admin','Cancel/delete event'],
            ['POST','/bookings','Fan (Auth)','Create new booking with ticket selection'],
            ['GET','/bookings/my','Fan (Auth)','List user bookings'],
            ['POST','/bookings/:id/cancel','Fan/Admin','Cancel booking and initiate refund'],
            ['POST','/payments/initiate','Fan (Auth)','Initiate payment via Razorpay'],
            ['POST','/payments/verify','System','Verify payment webhook from Razorpay'],
            ['POST','/auth/register','Public','Register new user account'],
            ['POST','/auth/login','Public','Login with email/password'],
            ['POST','/auth/otp/send','Public','Send OTP to mobile/email'],
            ['POST','/auth/otp/verify','Public','Verify OTP and get JWT token'],
            ['GET','/admin/approvals/events','Super Admin','List events pending approval'],
            ['POST','/admin/approvals/events/:id/approve','Super Admin','Approve event listing'],
            ['POST','/admin/approvals/events/:id/reject','Super Admin','Reject event with reason'],
            ['GET','/analytics/platform','Admin','Platform-wide analytics (GMV, tickets, users)'],
            ['POST','/scanner/verify/:qrData','Ops (Auth)','Verify and check-in attendee via QR/NFC'],
            ['POST','/scanner/pos/order','Ops (Auth)','Create POS order at event'],
            ['GET','/gst/invoice/:bookingId','Fan/Admin','Get GST invoice for booking'],
          ].map(([m,p,a,d])=>`<tr><td><span class="tag ${m==='GET'?'tag-blue':m==='POST'?'tag-green':m==='PUT'?'tag-gold':'tag-pink'}">${m}</span></td><td><code>${p}</code></td><td><span style="font-size:12px;color:var(--muted)">${a}</span></td><td style="font-size:13px">${d}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <!-- SECURITY -->
  <div class="section" id="security">
    <div class="section-badge">07 · Security & Compliance</div>
    <h2>Security <span>Architecture</span></h2>
    <div class="grid-2">
      <div class="info-card"><h4>🛡️ Platform Security</h4><ul><li>Cloudflare WAF (SQLi, XSS, CSRF protection)</li><li>DDoS protection at all layers</li><li>Rate limiting: 100 req/min (public), 1000 (auth)</li><li>Bot detection with ML-based scoring</li><li>API key rotation every 90 days</li><li>Zero-trust network architecture</li></ul></div>
      <div class="info-card"><h4>🔐 Data Security</h4><ul><li>AES-256 encryption at rest (all PII data)</li><li>TLS 1.3 for all data in transit</li><li>PII tokenisation for stored card data</li><li>DPDP Act 2023 compliant data handling</li><li>Right to erasure API for user data deletion</li><li>Immutable audit logs (WORM storage, 7-year retention)</li></ul></div>
      <div class="info-card"><h4>💳 Payment Security</h4><ul><li>PCI-DSS Level 1 target (via Razorpay)</li><li>No card data stored on INDTIX servers</li><li>Payment tokenisation via Razorpay vault</li><li>3D Secure authentication for all card payments</li><li>Real-time fraud scoring via ML model</li><li>Automatic chargeback detection</li></ul></div>
      <div class="info-card"><h4>⚖️ Legal & Compliance</h4><ul><li>IT Act 2000 + IT (Amendment) Act 2008</li><li>DPDP Act 2023 (Data Protection)</li><li>Consumer Protection Act 2019</li><li>RBI PA licence requirements</li><li>GST registration and GSTR-1/3B filing</li><li>Aadhaar Act compliance for KYC</li></ul></div>
    </div>
  </div>

  <!-- LAUNCH ROADMAP -->
  <div class="section" id="roadmap">
    <div class="section-badge">08 · Launch Roadmap</div>
    <h2>Phased <span>Launch Plan</span></h2>
    ${[
      ['MVP (Months 1–4)','phase-mvp','Fan portal, basic event listing, booking & payment, QR check-in, organiser portal (manual approval), super admin dashboard, WhatsApp/email notifications, GST invoicing. Target: 3 cities, 100 events, 10K bookings.'],
      ['Phase 2 (Months 5–9)','phase-p2','Seat map engine, add-ons (F&B/merch), venue portal, event manager portal, POS/scanner app, LED wristband integration, AI recommendations, dynamic pricing beta, loyalty programme. Target: 15 cities, 1,000 events.'],
      ['Enterprise (Months 10+)','phase-ent','Full AI/ML suite, white-label product, international expansion (Dubai, SEA), NFT-based tickets, virtual events, aggregator partnerships, Series A fundraise. Target: ₹100Cr GMV annual run rate.'],
    ].map(([phase,cls,desc])=>`
      <div class="roadmap-item">
        <div class="roadmap-phase ${cls}">${phase.split(' ')[0]}<br>${phase.split('(')[1]?.replace(')','')}</div>
        <div><strong>${phase.split(' (')[0]}</strong><p style="margin-top:4px">${desc}</p></div>
      </div>`).join('')}
  </div>

  <!-- RISK REGISTER -->
  <div class="section" id="risks">
    <div class="section-badge">09 · Risk Register</div>
    <h2>Risk <span>Register</span></h2>
    ${[
      ['HIGH','Ticket scalping / bot attacks','ML-based bot detection, purchase limits, CAPTCHA, device fingerprinting, AI fraud scoring'],
      ['HIGH','Payment fraud / chargebacks','Real-time fraud scoring, 3DS, velocity checks, manual review for high-value orders'],
      ['HIGH','Data breach / PII exposure','AES-256 encryption, zero-trust architecture, regular pentests, bug bounty programme'],
      ['MED','Organiser defaults / refund liability','Escrow-like settlement (T+7), terms of service, refund reserves, insurance product'],
      ['MED','Scale under event launch surge','Auto-scaling on GKE, Redis queue buffering, CDN caching, load testing to 10x peak'],
      ['MED','GST non-compliance','Automated GSTR-1 generation, tax counsel review quarterly, GSTN API integration'],
      ['LOW','Third-party API downtime','Multi-gateway payment fallback, WhatsApp → SMS fallback, circuit breakers'],
      ['LOW','Competitor price undercutting','Value differentiation (AI, wristbands, seat maps), loyalty programme, B2B relationships'],
    ].map(([level,risk,mitigation])=>`
      <div class="risk-item">
        <span class="risk-level risk-${level.toLowerCase()}">${level}</span>
        <div><div style="font-weight:600;font-size:14px;margin-bottom:4px">${risk}</div><div style="font-size:13px;color:var(--muted)">${mitigation}</div></div>
      </div>`).join('')}
  </div>

  <!-- BRAND -->
  <div class="section" id="brand">
    <div class="section-badge">10 · Brand System</div>
    <h2>INDTIX <span>Brand Identity</span></h2>
    <div class="grid-2">
      <div class="info-card"><h4>🎨 Colour Palette</h4>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
          ${[['#6C3CF7','Brand Purple'],['#FF3CAC','Neon Pink'],['#00F5C4','Electric Teal'],['#080B14','Abyss Dark'],['#1A2035','Deep Card'],['#E8EAFF','Starlight']].map(([c,n])=>`<div style="text-align:center"><div style="width:48px;height:48px;background:${c};border-radius:8px;border:1px solid rgba(255,255,255,0.1);margin:0 auto 4px"></div><div style="font-size:10px;color:var(--muted)">${n}</div><div style="font-size:10px;font-family:monospace;color:var(--muted)">${c}</div></div>`).join('')}
        </div>
      </div>
      <div class="info-card"><h4>✍️ Tone of Voice</h4><ul><li><strong>Bold & Direct:</strong> "Your ticket, your moment. Book now."</li><li><strong>Youth-coded:</strong> Gen-Z friendly, emoji-aware, never cringe</li><li><strong>Inclusive:</strong> "Every vibe, every city, every you"</li><li><strong>Trustworthy:</strong> Transparent fees, no jargon, GST included</li><li><strong>Urgent:</strong> "Only 8 tickets left at this price"</li></ul></div>
      <div class="info-card"><h4>📝 Microcopy Examples</h4><ul><li>Empty state: "Nothing here yet. Explore events near you! 🎵"</li><li>Loading: "Finding the best vibes near you..."</li><li>Success: "You're in! 🎉 Check WhatsApp for your ticket."</li><li>Error: "Oops! Something glitched. Tap to retry."</li><li>Waitlist: "You're #142 on the waitlist. We'll ping you!"</li></ul></div>
      <div class="info-card"><h4>⚠️ Legal Disclaimers</h4><ul><li>All tickets are non-transferable unless stated otherwise</li><li>INDTIX acts as marketplace; event liability rests with organiser</li><li>Prices inclusive of applicable GST (18% on platform fee)</li><li>Refund policy applies as per event terms; no-show = no refund default</li><li>By booking, you agree to DPDP Act data processing consent</li></ul></div>
    </div>
  </div>

  <div class="portal-nav">
    <a href="/"><i class="fas fa-home"></i> Fan Portal</a>
    <a href="/organiser"><i class="fas fa-user-tie"></i> Organiser Portal</a>
    <a href="/venue"><i class="fas fa-building"></i> Venue Portal</a>
    <a href="/event-manager"><i class="fas fa-clipboard-list"></i> Event Manager</a>
    <a href="/admin"><i class="fas fa-cog"></i> Super Admin</a>
    <a href="/ops"><i class="fas fa-qrcode"></i> Ops / POS</a>
  </div>

  <div style="margin-top:40px;padding-top:24px;border-top:1px solid var(--border);text-align:center;color:var(--muted);font-size:13px">
    <p>© 2025 Oye Imagine Private Limited · CONFIDENTIAL · GSTIN: 27AABCO1234A1Z5</p>
    <p style="margin-top:4px">INDTIX Architecture Blueprint v1.0 · March 2025 · All rights reserved</p>
  </div>

</div>
</body>
</html>`
}
