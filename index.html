<!DOCTYPE html>
<html lang="my">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Monthly Savings Management</title>
<style>
  :root {
    --bg: #f4f6fb;
    --card: #ffffff;
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --success: #16a34a;
    --danger: #dc2626;
    --warning: #d97706;
    --text: #0f172a;
    --muted: #64748b;
    --border: #e2e8f0;
    --shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Pyidaungsu", "Myanmar Text", "Noto Sans Myanmar", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    font-size: 15px;
    line-height: 1.5;
  }
  header {
    background: linear-gradient(135deg, #1e3a8a, #2563eb);
    color: #fff;
    padding: 18px 20px;
    box-shadow: var(--shadow);
  }
  header h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
  }
  header .sub {
    font-size: 13px;
    opacity: 0.9;
    margin-top: 4px;
  }
  header .admin-bar {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 10px;
    flex-wrap: wrap;
  }
  header .admin-bar .badge-admin {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
  }
  header .admin-bar button {
    background: rgba(255,255,255,0.15);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.35);
    padding: 5px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-family: inherit;
    transition: background 0.15s;
  }
  header .admin-bar button:hover { background: rgba(255,255,255,0.3); }
  header .admin-bar input.pin {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.35);
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 13px;
    width: 130px;
    font-family: inherit;
  }
  header .admin-bar input.pin::placeholder { color: rgba(255,255,255,0.65); }
  header .admin-bar .pin-msg { font-size: 12px; }
  header .admin-bar .pin-msg.err { color: #fecaca; }
  header .admin-bar .pin-msg.ok { color: #bbf7d0; }
  nav {
    display: flex;
    gap: 4px;
    background: #fff;
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    overflow-x: auto;
  }
  nav button {
    background: none;
    border: none;
    padding: 14px 16px;
    cursor: pointer;
    color: var(--muted);
    font-size: 14px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    white-space: nowrap;
    font-family: inherit;
  }
  nav button:hover { color: var(--primary); }
  nav button.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }
  main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 20px;
  }
  .view { display: none; }
  .view.active { display: block; }
  .grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
  .card {
    background: var(--card);
    border-radius: 10px;
    padding: 18px;
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  .stat .label {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .stat .value {
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
  }
  .stat.success .value { color: var(--success); }
  .stat.warning .value { color: var(--warning); }
  .stat.primary .value { color: var(--primary); }
  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  form .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 6px;
    color: #334155;
  }
  input, select, textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 7px;
    font-size: 15px;
    font-family: inherit;
    background: #fff;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
  .amount-preview {
    margin-top: 6px;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 14px;
    background: #f1f5f9;
    color: var(--text);
    min-height: 20px;
  }
  .amount-preview.invalid {
    background: #fef2f2;
    color: var(--danger);
  }
  .quick-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .quick-buttons button {
    background: #f1f5f9;
    border: 1px solid var(--border);
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    color: var(--text);
    transition: all 0.15s;
  }
  .quick-buttons button:hover {
    background: var(--primary);
    color: #fff;
    border-color: var(--primary);
  }
  .btn {
    padding: 10px 16px;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    transition: all 0.15s;
  }
  .btn-primary {
    background: var(--primary);
    color: #fff;
  }
  .btn-primary:hover { background: var(--primary-dark); }
  .btn-ghost {
    background: transparent;
    color: var(--muted);
    padding: 6px 10px;
    font-size: 13px;
  }
  .btn-ghost:hover { color: var(--primary); }
  .btn-danger {
    background: transparent;
    color: var(--danger);
    padding: 4px 8px;
    font-size: 13px;
  }
  .btn-danger:hover { background: #fef2f2; }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }
  th, td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
  }
  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
    font-size: 13px;
  }
  tr:hover td { background: #f8fafc; }
  .table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: #fff;
  }
  .empty {
    padding: 40px;
    text-align: center;
    color: var(--muted);
  }
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    background: #dbeafe;
    color: var(--primary-dark);
    font-weight: 500;
  }
  .badge.success { background: #dcfce7; color: #166534; }
  .badge.warning { background: #fef3c7; color: #92400e; }
  .badge.danger { background: #fee2e2; color: #991b1b; }
  .toolbar {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
    align-items: center;
  }
  .toolbar input, .toolbar select {
    width: auto;
    flex: 0 0 auto;
  }
  .pill-row {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .pill {
    padding: 6px 10px;
    border-radius: 999px;
    background: #f1f5f9;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid transparent;
    font-family: inherit;
    color: var(--text);
  }
  .pill.active {
    background: var(--primary);
    color: #fff;
  }
  .help {
    font-size: 12px;
    color: var(--muted);
    margin-top: 6px;
  }
  .alert {
    padding: 10px 12px;
    border-radius: 6px;
    background: #fef3c7;
    border: 1px solid #fde68a;
    color: #92400e;
    font-size: 13px;
    margin-bottom: 12px;
  }
  .alert.danger {
    background: #fee2e2;
    border-color: #fecaca;
    color: #991b1b;
  }
  .alert.success {
    background: #dcfce7;
    border-color: #bbf7d0;
    color: #166534;
  }
  @media (max-width: 640px) {
    form .row { grid-template-columns: 1fr; }
    main { padding: 12px; }
    header { padding: 14px 14px; }
    header h1 { font-size: 18px; }
    header .admin-bar { gap: 6px; }
    header .admin-bar input.pin { width: 100px; }
    .stat .value { font-size: 18px; }
    .grid { grid-template-columns: 1fr 1fr !important; }
    .chart-card { padding: 14px; }
    .chart-svg-wrap { overflow-x: auto; }
    .legend { font-size: 12px; }
  }
  .locked {
    opacity: 0.55;
    pointer-events: none;
    filter: grayscale(0.4);
  }
  .lock-banner {
    background: #fef3c7;
    border: 1px solid #fde68a;
    color: #92400e;
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 14px;
    font-size: 14px;
  }
  .lock-banner strong { color: #78350f; }

  /* ----- Dashboard analytics ----- */
  .stat .sub {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    margin-top: 4px;
    word-break: break-word;
  }
  .stat .num {
    font-size: 13px;
    color: var(--muted);
    font-weight: 400;
    margin-top: 4px;
    font-variant-numeric: tabular-nums;
  }
  .dashboard-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(12, 1fr);
  }
  .col-3  { grid-column: span 3; }
  .col-4  { grid-column: span 4; }
  .col-5  { grid-column: span 5; }
  .col-6  { grid-column: span 6; }
  .col-7  { grid-column: span 7; }
  .col-8  { grid-column: span 8; }
  .col-12 { grid-column: span 12; }
  @media (max-width: 900px) {
    .col-3, .col-4, .col-5, .col-6, .col-7, .col-8 { grid-column: span 12; }
  }

  .chart-card {
    background: #fff;
    border-radius: 10px;
    padding: 18px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }
  .chart-card h3 {
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 600;
  }
  .chart-svg-wrap {
    width: 100%;
    overflow: hidden;
  }
  .chart-svg-wrap svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .legend {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px 12px;
    font-size: 13px;
    color: var(--muted);
  }
  .legend .swatch {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
  }
  .kpi-pair {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .kpi-pair .primary-val {
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
  }
  .kpi-pair .secondary-val {
    font-size: 13px;
    color: var(--muted);
    font-weight: 400;
  }
  .top-list { list-style: none; padding: 0; margin: 0; }
  .top-list li {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    gap: 8px;
    font-size: 14px;
  }
  .top-list li:last-child { border-bottom: none; }
  .top-list .rank {
    color: var(--muted);
    margin-right: 6px;
    min-width: 24px;
    display: inline-block;
  }
  .top-list .bar-track {
    background: #e2e8f0;
    height: 6px;
    border-radius: 4px;
    margin-top: 4px;
    overflow: hidden;
  }
  .top-list .bar-fill {
    background: var(--primary);
    height: 100%;
  }
  .empty-chart {
    padding: 40px 16px;
    text-align: center;
    color: var(--muted);
    font-size: 14px;
  }
</style>
</head>
<body>
<header>
  <h1>လစဉ်စုဆောင်းငွေ စီမံခန့ီခွဲမှု · Monthly Savings Management</h1>
  <div class="sub" id="headerSub">17 members · Default: ၁သောင်း</div>
  <div class="admin-bar" id="admin-bar">
    <span class="badge-admin" id="admin-status">Guest (view only)</span>
    <input type="password" inputmode="numeric" autocomplete="off" id="pin-input" class="pin" placeholder="Admin PIN" />
    <button id="btn-pin-signin">Sign in</button>
    <span class="pin-msg" id="pin-msg"></span>
  </div>
</header>

<nav id="nav">
  <button data-view="dashboard" class="active">Dashboard</button>
  <button data-view="payment">Add Payment</button>
  <button data-view="members">Members</button>
  <button data-view="payments">Payments</button>
  <button data-view="settings">Settings</button>
  <button data-view="tests">Tests</button>
</nav>

<main>
  <!-- DASHBOARD -->
  <section class="view active" id="view-dashboard">
    <div class="dashboard-grid" style="margin-bottom:16px;">
      <!-- All-time total -->
      <div class="card stat primary col-3">
        <div class="label">All-time Total</div>
        <div class="kpi-pair">
          <div class="primary-val" id="stat-all-text">—</div>
          <div class="secondary-val" id="stat-all-num">—</div>
        </div>
      </div>
      <!-- Current month -->
      <div class="card stat success col-3">
        <div class="label">Current Month (<span id="stat-month-label">—</span>)</div>
        <div class="kpi-pair">
          <div class="primary-val" id="stat-month-text">—</div>
          <div class="secondary-val" id="stat-month-num">—</div>
        </div>
      </div>
      <!-- Expected this month -->
      <div class="card stat warning col-3">
        <div class="label">Expected This Month</div>
        <div class="kpi-pair">
          <div class="primary-val" id="stat-expected-text">—</div>
          <div class="secondary-val" id="stat-expected-num">—</div>
        </div>
      </div>
      <!-- Outstanding -->
      <div class="card stat col-3">
        <div class="label">Outstanding</div>
        <div class="kpi-pair">
          <div class="primary-val" id="stat-out-text">—</div>
          <div class="secondary-val" id="stat-out-num">—</div>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="dashboard-grid" style="margin-bottom:16px;">
      <div class="chart-card col-7">
        <h3>Monthly Trend (Bar)</h3>
        <div class="chart-svg-wrap" id="chart-bar-wrap"></div>
      </div>
      <div class="chart-card col-5">
        <h3>Contribution Share (Pie)</h3>
        <div class="chart-svg-wrap" id="chart-pie-wrap"></div>
      </div>
    </div>

    <div class="dashboard-grid" style="margin-bottom:16px;">
      <div class="chart-card col-6">
        <h3>Monthly Trend (Line)</h3>
        <div class="chart-svg-wrap" id="chart-line-wrap"></div>
      </div>
      <div class="chart-card col-6">
        <h3>Expected vs Paid (Donut)</h3>
        <div class="chart-svg-wrap" id="chart-donut-wrap"></div>
      </div>
    </div>

    <!-- By-month and top members -->
    <div class="dashboard-grid" style="margin-bottom:16px;">
      <div class="card col-7">
        <h2 class="section-title">By Month</h2>
        <div class="table-wrap">
          <table id="month-summary">
            <thead>
              <tr>
                <th>Month</th>
                <th>Total (Text)</th>
                <th>Total (Number)</th>
                <th>Payments</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      <div class="card col-5">
        <h2 class="section-title">Top Contributors</h2>
        <ul class="top-list" id="top-members"></ul>
      </div>
    </div>

    <!-- Current month member status -->
    <div class="card">
      <h2 class="section-title">By Member (Current Month)</h2>
      <div class="table-wrap">
        <table id="member-summary">
          <thead>
            <tr>
              <th>#</th>
              <th>Member</th>
              <th>Expected</th>
              <th>Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- ADD PAYMENT -->
  <section class="view" id="view-payment">
    <div class="card">
      <h2 class="section-title">Add Payment</h2>
      <div id="payment-lock-banner"></div>
      <div id="payment-alert"></div>
      <div id="payment-locked-wrap">
      <form id="payment-form">
        <div class="row">
          <div>
            <label for="p-member">Member</label>
            <select id="p-member" required></select>
            <div class="help" id="p-member-help"></div>
          </div>
          <div>
            <label for="p-month">Month</label>
            <input type="month" id="p-month" required />
          </div>
        </div>
        <div style="margin-top:14px;">
          <label for="p-amount">Amount (ပမာဏ)</label>
          <input type="text" id="p-amount" placeholder="e.g. ၁သောင်း, 10,000, 1 lakh" autocomplete="off" required />
          <div class="amount-preview" id="p-amount-preview">= 0 MMK</div>
          <div class="quick-buttons" id="quick-buttons"></div>
          <div class="help">
            Supported: <code>၁သောင်း</code>, <code>၁သိန်း</code>, <code>၁သိန်းခွဲ</code>, <code>၁သိန်း ၅သောင်း</code>, <code>10000</code>, <code>10,000</code>, <code>100k</code>
          </div>
        </div>
        <div style="margin-top:14px;">
          <label for="p-note">Note (optional)</label>
          <input type="text" id="p-note" placeholder="Optional" />
        </div>
        <div style="margin-top:18px;">
          <button type="submit" class="btn btn-primary">Save Payment</button>
        </div>
      </form>
      </div>
    </div>
  </section>

  <!-- MEMBERS -->
  <section class="view" id="view-members">
    <div class="card">
      <h2 class="section-title">Members</h2>
      <div id="members-lock-banner"></div>
      <div id="members-locked-wrap">
      <div class="toolbar">
        <input type="text" id="member-search" placeholder="Search…" style="width:200px;" />
      </div>
      <div class="table-wrap">
        <table id="members-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Default Amount</th>
              <th>Lifetime Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      </div>
    </div>
  </section>

  <!-- PAYMENTS LIST -->
  <section class="view" id="view-payments">
    <div class="card">
      <h2 class="section-title">Payments</h2>
      <div id="payments-lock-banner"></div>
      <div id="payments-locked-wrap">
      <div class="toolbar">
        <select id="filter-month"><option value="">All months</option></select>
        <select id="filter-member"><option value="">All members</option></select>
        <button class="btn btn-ghost" id="btn-export">Export JSON</button>
        <button class="btn btn-ghost" id="btn-clear-all">Clear All Payments</button>
      </div>
      <div class="table-wrap">
        <table id="payments-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Member</th>
              <th>Amount</th>
              <th>Input</th>
              <th>Note</th>
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
      </div>
    </div>
  </section>

  <!-- SETTINGS -->
  <section class="view" id="view-settings">
    <div class="card">
      <h2 class="section-title">Settings</h2>
      <div id="settings-lock-banner"></div>
      <div id="settings-locked-wrap">
      <div class="row">
        <div>
          <label>Default Monthly Amount</label>
          <input type="text" id="set-default" />
          <div class="amount-preview" id="set-default-preview">= 0 MMK</div>
          <div class="help">Used when a member has no custom amount.</div>
        </div>
        <div>
          <label>Language</label>
          <select id="set-lang">
            <option value="my">Myanmar (မြန်မာ)</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      <div style="margin-top:14px;">
        <label>Amount Display Mode</label>
        <div class="pill-row" id="display-mode-pills">
          <button class="pill" data-mode="numeric">Numeric (100,000 MMK)</button>
          <button class="pill" data-mode="myanmarDigits">Myanmar Digits (၁၀၀,၀၀၀ ကျပ်)</button>
          <button class="pill" data-mode="myanmarUnit">Myanmar Unit (၁ သိန်း)</button>
          <button class="pill" data-mode="auto">Auto</button>
        </div>
        <div class="help">Default for Myanmar language: Myanmar Digits. For English: Numeric.</div>
      </div>
      <div style="margin-top:18px;">
        <button class="btn btn-primary" id="save-settings">Save Settings</button>
      </div>
      </div>

      <hr style="margin:24px 0;border:none;border-top:1px solid var(--border);" />
      <h3 style="margin:0 0 10px 0;font-size:15px;">Change Admin PIN</h3>
      <div class="row">
        <div>
          <label>Current PIN</label>
          <input type="password" inputmode="numeric" autocomplete="off" id="cur-pin" />
        </div>
        <div>
          <label>New PIN</label>
          <input type="password" inputmode="numeric" autocomplete="off" id="new-pin" />
        </div>
      </div>
      <div style="margin-top:12px;">
        <button class="btn btn-primary" id="change-pin">Change PIN</button>
        <span id="change-pin-msg" class="help" style="margin-left:8px;"></span>
      </div>
    </div>
  </section>

  <!-- TESTS -->
  <section class="view" id="view-tests">
    <div class="card">
      <h2 class="section-title">Parser Validation Tests</h2>
      <p class="help">Click <strong>Run Tests</strong> to verify the amount parser against all required cases.</p>
      <button class="btn btn-primary" id="run-tests">Run Tests</button>
      <div id="test-results" style="margin-top:16px;"></div>
    </div>
  </section>
</main>

<script>
/* ============================================================
   AMOUNT PARSER & FORMATTER
   ============================================================ */

const MY_DIGITS = ['၀','၁','၂','၃','၄','၅','၆','၇','၈','၉'];

function myanmarDigitToArabic(ch) {
  const idx = MY_DIGITS.indexOf(ch);
  return idx >= 0 ? String(idx) : ch;
}

function normalizeDigits(input) {
  // Convert Myanmar digits to Arabic digits
  return String(input).replace(/[၀-၉]/g, ch => myanmarDigitToArabic(ch));
}

function normalizeInput(raw) {
  if (raw == null) return '';
  let s = String(raw).trim();
  s = normalizeDigits(s);
  return s;
}

/**
 * parseMyanmarAmount(input)
 * Returns numeric MMK value, or null if cannot parse reliably.
 */
function parseMyanmarAmount(input) {
  if (input == null) return null;
  let s = String(input).trim();
  if (!s) return null;

  // Normalize Myanmar digits -> Arabic
  s = normalizeDigits(s);

  // 1) Pure numeric with commas/spaces (Arabic or already-normalized Myanmar)
  //    e.g. "10,000", "100000", "1 000 000", "10 000"
  const pureNumeric = s.replace(/[\s,]/g, '');
  if (/^\d+(\.\d+)?$/.test(pureNumeric)) {
    return Math.round(parseFloat(pureNumeric));
  }

  // 2) English shorthand: 10k, 100k, 1.5k, 1m, 1 lakh, 2 lakhs, 1 crore
  const enMatch = s.match(/^(\d+(?:\.\d+)?)\s*(k|thousand|m|million|lakh|lakhs|crore|crores)\b/i);
  if (enMatch) {
    const n = parseFloat(enMatch[1]);
    const u = enMatch[2].toLowerCase();
    if (/^k$|thousand/.test(u)) return Math.round(n * 1000);
    if (/^m$|million/.test(u)) return Math.round(n * 1_000_000);
    if (/lakh/.test(u)) return Math.round(n * 100_000);
    if (/crore/.test(u)) return Math.round(n * 10_000_000);
  }

  // 3) Myanmar units. Process token by token.
  // Strip stray ASCII commas and collapse whitespace
  s = s.replace(/,/g, ' ').replace(/\s+/g, ' ').trim();

  // "ခွဲ" is a half-unit modifier. It applies to the immediately preceding unit
  // and means "+ half of that unit".
  //   X သိန်းခွဲ = X*100000 + 50000
  //   X သောင်းခွဲ = X*10000 + 5000
  // Units (sorted longest first for greedy matching).
  const UNITS = [
    { name: 'ကုဋေ',       value: 100000000 },
    { name: 'သန်း',        value: 1000000 },
    { name: 'သိန်း',       value: 100000 },
    { name: 'သောင်း',      value: 10000 },
    { name: 'ထောင်',       value: 1000 },
    { name: 'ရာ',          value: 100 },
  ].sort((a, b) => b.name.length - a.name.length);

  const HALF = 'ခွဲ';

  let total = 0;
  let i = 0;
  let matchedSomething = false;

  while (i < s.length) {
    // skip whitespace
    while (i < s.length && s[i] === ' ') i++;
    if (i >= s.length) break;

    // Read optional Arabic digits
    let n = '';
    while (i < s.length && /[0-9]/.test(s[i])) {
      n += s[i]; i++;
    }
    let num = n === '' ? 1 : parseInt(n, 10);
    if (isNaN(num) || num < 0) return null;

    // Try matching a unit starting at position i (longest first)
    let matchedUnit = null;
    for (const u of UNITS) {
      if (s.startsWith(u.name, i)) {
        matchedUnit = u;
        break;
      }
    }

    if (!matchedUnit) {
      // Nothing matched here. If we already matched something AND the remaining
      // is just whitespace, we're fine. Otherwise, parse failure.
      while (i < s.length && s[i] === ' ') i++;
      if (i >= s.length) break;
      return null;
    }

    total += num * matchedUnit.value;
    matchedSomething = true;
    i += matchedUnit.name.length;

    // Check for half-unit modifier "ခွဲ"
    if (s.startsWith(HALF, i)) {
      total += matchedUnit.value / 2;
      i += HALF.length;
    }
  }

  if (!matchedSomething) return null;
  return total;
}

/**
 * Format amount in Myanmar unit style.
 * Examples (formatMyanmarAmount):
 *   1000    -> "၁,၀၀၀ ကျပ်"
 *   10000   -> "၁၀,၀၀၀ ကျပ်"
 *   50000   -> "၅၀,၀၀၀ ကျပ်"
 *   100000  -> "၁ သိန်း"
 *   150000  -> "၁ သိန်းခွဲ"
 *   125000  -> "၁ သိန်း ၂ သောင်း ၅ ထောင်"
 *   200000  -> "၂ သိန်း"
 *   250000  -> "၂ သိန်းခွဲ"
 *   1000000 -> "၁ သန်း"
 *
 * Rule:
 *  - Below 100,000 -> use digit form with commas + "ကျပ်".
 *  - At or above 100,000 -> use unit form, breaking down as needed.
 *  - Collapse trailing "X သောင်း" + "5 ထောင်" into "X သိန်းခွဲ"
 *    when the only remainder is exactly half a သိန်း.
 */
function formatMyanmarAmount(amount) {
  if (amount == null || isNaN(amount)) return '—';
  const n0 = Math.round(amount);
  if (n0 === 0) return '၀ ကျပ်';

  const LAKH = 100_000;
  const MILLION = 1_000_000;
  const KUTHI = 100_000_000;
  const THAW = 10_000;
  const THOUSAND = 1_000;
  const HUNDRED = 100;

  // Below one lakh -> digit form
  if (n0 < LAKH) {
    return toMyDigits(n0.toLocaleString('en-US')) + ' ကျပ်';
  }

  // From lakh and above -> unit form
  let n = n0;
  const parts = [];

  if (n >= KUTHI) {
    const k = Math.floor(n / KUTHI);
    parts.push(`${toMyDigits(k)} ကုဋေ`);
    n -= k * KUTHI;
  }
  if (n >= MILLION) {
    const m = Math.floor(n / MILLION);
    parts.push(`${toMyDigits(m)} သန်း`);
    n -= m * MILLION;
  }
  if (n >= LAKH) {
    const l = Math.floor(n / LAKH);
    parts.push(`${toMyDigits(l)} သိန်း`);
    n -= l * LAKH;
  }

  // Collapse trailing half-lakh into "သိန်းခွဲ" when remainder is exactly
  // half a သိန်း AND no smaller-unit remainder exists (otherwise we prefer
  // the explicit breakdown, e.g. 125000 -> "1 သိန်း 2 သောင်း 5 ထောင်").
  if (n === LAKH / 2) {
    const last = parts[parts.length - 1];
    if (last && last.endsWith(' သိန်း')) {
      parts[parts.length - 1] = last.replace(' သိန်း', ' သိန်းခွဲ');
      return parts.join(' ');
    }
  }

  if (n >= THAW) {
    const t = Math.floor(n / THAW);
    parts.push(`${toMyDigits(t)} သောင်း`);
    n -= t * THAW;
    // Half-thaw collapse: e.g. 55000 -> "5 သောင်းခွဲ"
    if (n === THOUSAND / 2) {
      const last = parts[parts.length - 1];
      if (last && last.endsWith(' သောင်း') && parts.length === 1) {
        parts[parts.length - 1] = last.replace(' သောင်း', ' သောင်းခွဲ');
        return parts.join(' ');
      }
    }
  }
  if (n >= THOUSAND) {
    const th = Math.floor(n / THOUSAND);
    parts.push(`${toMyDigits(th)} ထောင်`);
    n -= th * THOUSAND;
  }
  if (n >= HUNDRED) {
    const h = Math.floor(n / HUNDRED);
    parts.push(`${toMyDigits(h)} ရာ`);
    n -= h * HUNDRED;
  }
  if (n > 0) {
    parts.push(`${toMyDigits(n)} ကျပ်`);
  }

  return parts.join(' ');
}

function formatRest(n) { return []; }
function skipHalfFromRemaining(n) { return n; }

/**
 * Convert Arabic digits to Myanmar digits (with commas)
 */
function toMyDigits(n) {
  return String(n).replace(/[0-9]/g, d => MY_DIGITS[parseInt(d, 10)]);
}

function formatMyanmarDigits(amount) {
  if (amount == null || isNaN(amount)) return '—';
  return toMyDigits(Number(amount).toLocaleString('en-US')) + ' ကျပ်';
}

function formatNumeric(amount) {
  if (amount == null || isNaN(amount)) return '—';
  return Number(amount).toLocaleString('en-US') + ' MMK';
}

/**
 * Display amount based on settings.displayMode + settings.language
 */
function formatMoney(amount, settings) {
  const mode = settings.displayMode || (settings.language === 'my' ? 'myanmarDigits' : 'numeric');
  if (mode === 'numeric') return formatNumeric(amount);
  if (mode === 'myanmarDigits') return formatMyanmarDigits(amount);
  if (mode === 'myanmarUnit') return formatMyanmarAmount(amount);
  // auto
  if (settings.language === 'my') {
    // pick readable Myanmar representation
    if (amount >= 100000) return formatMyanmarAmount(amount);
    return formatMyanmarDigits(amount);
  }
  return formatNumeric(amount);
}

/* ============================================================
   STATE & STORAGE
   ============================================================ */

const STORAGE_KEY = 'suboo.app.v1'; // cache key for last server snapshot
const ADMIN_KEY = 'suboo.app.admin.v1';
const API_BASE = (window.SUBOO_API_BASE || ''); // empty = same origin

// Default admin PIN. Hash here is for "9876". Admin can change it from Settings once signed in.
const DEFAULT_ADMIN_PIN_HASH = '0001a9ffb1a2faab';

function sha256Hex(text) {
  // Synchronous-ish helper: use SubtleCrypto but return a promise-friendly sync.
  // For our purposes we use a tiny custom sync hash so we don't need async here.
  // Real production would use Web Crypto, but this is a client-side gate and
  // we only need a non-trivial transformation, not security.
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < text.length; i++) {
    ch = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

const DEFAULT_MEMBERS = [
  { id: 'member_001', name: 'Ko chit ko' },
  { id: 'member_002', name: 'zaw Oo' },
  { id: 'member_003', name: 'Kyaw myint aye' },
  { id: 'member_004', name: 'toewaoo' },
  { id: 'member_005', name: 'min min Aung' },
  { id: 'member_006', name: 'Kyaw Kyaw Htet' },
  { id: 'member_007', name: 'arkar' },
  { id: 'member_008', name: 'min khant kyaw1' },
  { id: 'member_009', name: 'min khant kyaw2' },
  { id: 'member_010', name: 'win Myat tun' },
  { id: 'member_011', name: 'sai zaw zaw' },
  { id: 'member_012', name: 'Wai moe' },
  { id: 'member_013', name: 'Hein thiha' },
  { id: 'member_014', name: 'bobo Aung' },
  { id: 'member_015', name: 'win moe aung' },
  { id: 'member_016', name: 'aung myo thant' },
];

const DEFAULT_SETTINGS = {
  defaultAmount: 10000,
  defaultAmountInput: '၁သောင်း',
  language: 'my',
  displayMode: 'myanmarDigits', // numeric | myanmarDigits | myanmarUnit | auto
  memberAmounts: {}, // memberId -> numeric amount
};

/* ============================================================
   STATE (server-backed)
   ============================================================
   All state lives on the server (data.json). The browser fetches
   the full snapshot via /api/state on load and after each write.
*/

function freshState() {
  return {
    members: DEFAULT_MEMBERS.slice(),
    payments: [],
    settings: Object.assign({}, DEFAULT_SETTINGS),
  };
}

let state = freshState();
let apiOnline = false;

function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({}, opts.headers || {});
  if (!headers['Content-Type'] && opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
  }
  if (adminSession && !headers['x-admin-pin']) {
    headers['x-admin-pin'] = currentPin || '';
  }
  const url = API_BASE + path;
  return fetch(url, Object.assign({}, opts, { headers }))
    .then(r => {
      if (!r.ok) {
        return r.text().then(t => { throw new Error('HTTP ' + r.status + ': ' + t); });
      }
      return r.json();
    });
}

async function loadStateFromServer() {
  try {
    const data = await api('/api/state');
    state = Object.assign(freshState(), data);
    if (!state.settings.memberAmounts) state.settings.memberAmounts = {};
    apiOnline = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
    return state;
  } catch (e) {
    apiOnline = false;
    console.warn('Could not reach server, falling back to local cache:', e.message);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = Object.assign(freshState(), JSON.parse(raw));
    } catch (e2) {}
    throw e;
  }
}

async function refreshState() {
  try {
    const data = await api('/api/state');
    state = Object.assign(freshState(), data);
    if (!state.settings.memberAmounts) state.settings.memberAmounts = {};
    apiOnline = true;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  } catch (e) {
    apiOnline = false;
    console.warn('Refresh failed:', e.message);
  }
}

/* ============================================================
   ADMIN AUTH
   ============================================================ */

let adminSession = false;
let currentPin = null;

function getAdminPinHash() {
  try {
    return localStorage.getItem(ADMIN_KEY) || DEFAULT_ADMIN_PIN_HASH;
  } catch (e) {
    return DEFAULT_ADMIN_PIN_HASH;
  }
}

function setAdminPinHash(hash) {
  try {
    localStorage.setItem(ADMIN_KEY, hash);
  } catch (e) { /* ignore */ }
}

function tryAdminSignIn(pin) {
  const expected = getAdminPinHash();
  const got = sha256Hex(String(pin || ''));
  return expected === got;
}

async function signInAdmin(pin) {
  // First check client-side hash (fast)
  if (!tryAdminSignIn(pin)) return false;
  // Then verify against the server's PIN (authoritative)
  try {
    await api('/api/auth/check', { method: 'POST', headers: { 'x-admin-pin': pin } });
    adminSession = true;
    currentPin = pin;
    return true;
  } catch (e) {
    return false;
  }
}

function signOutAdmin() {
  adminSession = false;
  currentPin = null;
  renderAdminBar();
  applyAdminLocks();
}

function renderAdminBar() {
  const status = document.getElementById('admin-status');
  const pin = document.getElementById('pin-input');
  const btn = document.getElementById('btn-pin-signin');
  const msg = document.getElementById('pin-msg');
  msg.textContent = '';
  msg.className = 'pin-msg';
  if (adminSession) {
    status.textContent = 'Admin ✓';
    status.style.background = 'rgba(34,197,94,0.25)';
    status.style.borderColor = 'rgba(34,197,94,0.6)';
    btn.textContent = 'Sign out';
    pin.style.display = 'none';
  } else {
    status.textContent = 'Guest (view only)';
    status.style.background = '';
    status.style.borderColor = '';
    btn.textContent = 'Sign in';
    pin.style.display = '';
    pin.value = '';
  }
}

function applyAdminLocks() {
  // Add/remove locked wrapper & banner
  const gatedViews = [
    { viewId: 'view-payment',  bannerId: 'payment-lock-banner',  wrapId: 'payment-locked-wrap' },
    { viewId: 'view-members',  bannerId: 'members-lock-banner',  wrapId: 'members-locked-wrap' },
    { viewId: 'view-payments', bannerId: 'payments-lock-banner', wrapId: 'payments-locked-wrap' },
    { viewId: 'view-settings', bannerId: 'settings-lock-banner', wrapId: 'settings-locked-wrap' },
  ];
  gatedViews.forEach(g => {
    const wrap = document.getElementById(g.wrapId);
    const banner = document.getElementById(g.bannerId);
    if (!wrap || !banner) return;
    if (adminSession) {
      wrap.classList.remove('locked');
      banner.innerHTML = '';
    } else {
      wrap.classList.add('locked');
      banner.innerHTML =
        '<div class="lock-banner">🔒 <strong>Admin only.</strong> Sign in with the PIN at the top to add or edit records.</div>';
    }
  });

  // Hide nav buttons that are admin-only? We keep them visible but show banner.
}

document.getElementById('btn-pin-signin').addEventListener('click', async () => {
  if (adminSession) {
    signOutAdmin();
    return;
  }
  const pin = document.getElementById('pin-input').value;
  const msg = document.getElementById('pin-msg');
  if (!pin) {
    msg.textContent = 'Enter a PIN.';
    msg.className = 'pin-msg err';
    return;
  }
  msg.textContent = 'Checking...';
  msg.className = 'pin-msg';
  const ok = await signInAdmin(pin);
  if (ok) {
    msg.textContent = '';
    msg.className = 'pin-msg';
    renderAdminBar();
    applyAdminLocks();
  } else {
    msg.textContent = 'Wrong PIN.';
    msg.className = 'pin-msg err';
  }
});
document.getElementById('pin-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    document.getElementById('btn-pin-signin').click();
  }
});

/* ============================================================
   UTILITIES
   ============================================================ */

function memberById(id) {
  return state.members.find(m => m.id === id);
}

function memberAmount(memberId) {
  const custom = state.settings.memberAmounts[memberId];
  if (custom != null && !isNaN(custom)) return custom;
  return state.settings.defaultAmount;
}

function getCurrentMonth() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}

function currentMonthKey() {
  return getCurrentMonth();
}

function paymentsForMonth(memberId, monthKey) {
  return state.payments.filter(p => p.memberId === memberId && p.month === monthKey);
}

function paidForMonth(memberId, monthKey) {
  return paymentsForMonth(memberId, monthKey).reduce((s, p) => s + (p.amount || 0), 0);
}

function lifetimeTotal(memberId) {
  return state.payments
    .filter(p => p.memberId === memberId)
    .reduce((s, p) => s + (p.amount || 0), 0);
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ============================================================
   VIEWS / ROUTING
   ============================================================ */

const navButtons = document.querySelectorAll('#nav button');
const views = document.querySelectorAll('.view');
navButtons.forEach(b => {
  b.addEventListener('click', () => switchView(b.dataset.view));
});

function switchView(name) {
  navButtons.forEach(b => b.classList.toggle('active', b.dataset.view === name));
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'dashboard') renderDashboard();
  if (name === 'payment') renderPaymentView();
  if (name === 'members') renderMembersView();
  if (name === 'payments') renderPaymentsView();
  if (name === 'settings') renderSettingsView();
  if (name === 'tests') renderTestsView();
}

/* ============================================================
   DASHBOARD
   ============================================================ */

// Color palette for charts
const CHART_COLORS = [
  '#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed',
  '#0891b2', '#db2777', '#65a30d', '#ca8a04', '#9333ea',
  '#0d9488', '#e11d48', '#1d4ed8', '#15803d', '#b45309',
  '#475569',
];

function svgEl(tag, attrs, text) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  if (text != null) el.textContent = text;
  return el;
}

function renderEmptyChart(host, msg) {
  host.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'empty-chart';
  div.textContent = msg || 'No data yet';
  host.appendChild(div);
}

function renderBarChart(host, data) {
  // data: [{label, value, color}]
  host.innerHTML = '';
  if (!data.length || data.every(d => !d.value)) {
    renderEmptyChart(host);
    return;
  }
  const W = 520, H = 240;
  const padL = 50, padR = 12, padT = 14, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const niceMax = niceCeil(maxV);

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' });

  // y-axis grid lines
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const y = padT + innerH - (i / steps) * innerH;
    const val = (niceMax * i / steps);
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: padL + innerW, y2: y, stroke: '#e2e8f0', 'stroke-width': 1 }));
    svg.appendChild(svgEl('text', { x: padL - 6, y: y + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#64748b' }, shortNum(val)));
  }

  const bw = innerW / data.length;
  const barW = Math.max(8, Math.min(48, bw * 0.6));
  data.forEach((d, i) => {
    const x = padL + i * bw + (bw - barW) / 2;
    const h = (d.value / niceMax) * innerH;
    const y = padT + innerH - h;
    const rect = svgEl('rect', {
      x, y, width: barW, height: h,
      fill: d.color || CHART_COLORS[i % CHART_COLORS.length],
      rx: 4,
    });
    const tip = svgEl('title', {}, `${d.label}: ${d.value.toLocaleString('en-US')} MMK`);
    rect.appendChild(tip);
    svg.appendChild(rect);
    // x label
    const lbl = svgEl('text', {
      x: x + barW / 2, y: padT + innerH + 14,
      'text-anchor': 'middle', 'font-size': 10, fill: '#475569'
    }, truncate(d.label, 8));
    svg.appendChild(lbl);
    // value label on top
    if (d.value > 0) {
      const vt = svgEl('text', {
        x: x + barW / 2, y: y - 4,
        'text-anchor': 'middle', 'font-size': 10, fill: '#0f172a'
      }, shortNum(d.value));
      svg.appendChild(vt);
    }
  });

  // y axis label
  svg.appendChild(svgEl('text', {
    x: 8, y: padT - 4, 'font-size': 10, fill: '#64748b'
  }, 'MMK'));

  host.appendChild(svg);
}

function renderLineChart(host, data) {
  host.innerHTML = '';
  if (!data.length || data.every(d => !d.value)) {
    renderEmptyChart(host);
    return;
  }
  const W = 520, H = 220;
  const padL = 50, padR = 12, padT = 14, padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxV = Math.max(...data.map(d => d.value), 1);
  const niceMax = niceCeil(maxV);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' });

  // grid
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const y = padT + innerH - (i / steps) * innerH;
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: padL + innerW, y2: y, stroke: '#e2e8f0', 'stroke-width': 1 }));
    svg.appendChild(svgEl('text', { x: padL - 6, y: y + 4, 'text-anchor': 'end', 'font-size': 10, fill: '#64748b' }, shortNum(niceMax * i / steps)));
  }

  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
  const points = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (d.value / niceMax) * innerH;
    return { x, y, d };
  });

  // line
  if (points.length > 1) {
    const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
    svg.appendChild(svgEl('path', { d: path, fill: 'none', stroke: '#2563eb', 'stroke-width': 2 }));
    // area fill
    const area = path + ` L ${points[points.length-1].x} ${padT+innerH} L ${points[0].x} ${padT+innerH} Z`;
    svg.appendChild(svgEl('path', { d: area, fill: 'rgba(37,99,235,0.12)' }));
  }
  // points
  points.forEach((p, i) => {
    const c = svgEl('circle', { cx: p.x, cy: p.y, r: 4, fill: '#2563eb', stroke: '#fff', 'stroke-width': 2 });
    c.appendChild(svgEl('title', {}, `${p.d.label}: ${p.d.value.toLocaleString('en-US')} MMK`));
    svg.appendChild(c);
    // x label
    if (data.length <= 24 || i % Math.ceil(data.length / 12) === 0) {
      svg.appendChild(svgEl('text', {
        x: p.x, y: padT + innerH + 14,
        'text-anchor': 'middle', 'font-size': 10, fill: '#475569'
      }, truncate(p.d.label, 6)));
    }
  });

  host.appendChild(svg);
}

function renderPieChart(host, data) {
  host.innerHTML = '';
  // data: [{label, value, color}]
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) {
    renderEmptyChart(host);
    return;
  }
  // Limit to top 10 + "Other"
  const sorted = data.slice().sort((a, b) => b.value - a.value);
  let top = sorted.slice(0, 10);
  if (sorted.length > 10) {
    const restSum = sorted.slice(10).reduce((s, d) => s + d.value, 0);
    if (restSum > 0) top.push({ label: 'Other', value: restSum, color: '#94a3b8' });
  }
  const W = 320, H = 220;
  const cx = 110, cy = 110, r = 90, ir = 0;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' });

  let start = -Math.PI / 2;
  top.forEach((d, i) => {
    const angle = (d.value / total) * Math.PI * 2;
    const end = start + angle;
    const large = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    const slice = svgEl('path', { d: path, fill: d.color || CHART_COLORS[i % CHART_COLORS.length], stroke: '#fff', 'stroke-width': 1.5 });
    slice.appendChild(svgEl('title', {}, `${d.label}: ${d.value.toLocaleString('en-US')} MMK (${((d.value/total)*100).toFixed(1)}%)`));
    svg.appendChild(slice);
    start = end;
  });

  // legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  top.slice(0, 6).forEach((d, i) => {
    const item = document.createElement('span');
    item.innerHTML = `<span class="swatch" style="background:${d.color || CHART_COLORS[i % CHART_COLORS.length]}"></span>${escapeHtml(truncate(d.label, 12))} ${((d.value/total)*100).toFixed(0)}%`;
    legend.appendChild(item);
  });
  if (top.length > 6) {
    const more = document.createElement('span');
    more.textContent = `+${top.length - 6} more`;
    legend.appendChild(more);
  }
  host.appendChild(svg);
  host.appendChild(legend);
}

function renderDonutChart(host, paid, expected) {
  host.innerHTML = '';
  const W = 280, H = 220;
  const cx = 110, cy = 110, r = 90, ir = 55;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: 'xMidYMid meet' });
  const total = Math.max(expected, paid, 1);
  const paidAngle = expected > 0 ? (paid / expected) * Math.PI * 2 : 0;
  const paidClamped = Math.min(paidAngle, Math.PI * 2);
  const remaining = Math.max(0, Math.PI * 2 - paidClamped);

  // Background full ring
  svg.appendChild(svgEl('circle', { cx, cy, r, fill: 'none', stroke: '#e2e8f0', 'stroke-width': r - ir }));
  // Paid arc
  if (paidClamped > 0) {
    const start = -Math.PI / 2;
    const end = start + paidClamped;
    const large = paidClamped > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const ix1 = cx + ir * Math.cos(end);
    const iy1 = cy + ir * Math.sin(end);
    const ix2 = cx + ir * Math.cos(start);
    const iy2 = cy + ir * Math.sin(start);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 0 ${ix2} ${iy2} Z`;
    svg.appendChild(svgEl('path', { d: path, fill: '#16a34a', stroke: '#fff', 'stroke-width': 1.5 }));
  }

  // center text
  const pct = expected > 0 ? Math.min(100, Math.round((paid / expected) * 100)) : 0;
  svg.appendChild(svgEl('text', { x: cx, y: cy + 4, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 700, fill: '#0f172a' }, pct + '%'));
  svg.appendChild(svgEl('text', { x: cx, y: cy + 22, 'text-anchor': 'middle', 'font-size': 11, fill: '#64748b' }, 'of expected'));

  // legend
  const legend = document.createElement('div');
  legend.className = 'legend';
  legend.innerHTML = `
    <span><span class="swatch" style="background:#16a34a"></span>Paid ${paid.toLocaleString('en-US')}</span>
    <span><span class="swatch" style="background:#e2e8f0"></span>Expected ${expected.toLocaleString('en-US')}</span>
  `;
  host.appendChild(svg);
  host.appendChild(legend);
}

function niceCeil(v) {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const m = v / base;
  let nice;
  if (m <= 1) nice = 1;
  else if (m <= 2) nice = 2;
  else if (m <= 2.5) nice = 2.5;
  else if (m <= 5) nice = 5;
  else nice = 10;
  return nice * base;
}

function shortNum(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(n >= 10_000 ? 0 : 1) + 'k';
  return String(Math.round(n));
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function memberTotals() {
  // lifetime total per member
  const totals = new Map();
  state.members.forEach(m => totals.set(m.id, 0));
  state.payments.forEach(p => {
    if (totals.has(p.memberId)) totals.set(p.memberId, totals.get(p.memberId) + (p.amount || 0));
  });
  return totals;
}

function monthTotals() {
  // total per month
  const totals = new Map();
  state.payments.forEach(p => {
    if (!p.month) return;
    totals.set(p.month, (totals.get(p.month) || 0) + (p.amount || 0));
  });
  return totals;
}

function monthPaymentCounts() {
  const counts = new Map();
  state.payments.forEach(p => {
    if (!p.month) return;
    counts.set(p.month, (counts.get(p.month) || 0) + 1);
  });
  return counts;
}

function renderDashboard() {
  const m = currentMonthKey();
  const monthLabel = formatMonthLabel(m);
  document.getElementById('stat-month-label').textContent = monthLabel;

  // All-time total
  const allTotal = state.payments.reduce((s, p) => s + (p.amount || 0), 0);
  document.getElementById('stat-all-text').textContent = formatMyanmarAmount(allTotal);
  document.getElementById('stat-all-num').textContent = allTotal.toLocaleString('en-US') + ' MMK';

  // Current month
  const totalSaved = state.payments.filter(p => p.month === m).reduce((s, p) => s + (p.amount || 0), 0);
  document.getElementById('stat-month-text').textContent = formatMyanmarAmount(totalSaved);
  document.getElementById('stat-month-num').textContent = totalSaved.toLocaleString('en-US') + ' MMK';

  // Expected
  const expected = state.members.reduce((s, mem) => s + memberAmount(mem.id), 0);
  document.getElementById('stat-expected-text').textContent = formatMyanmarAmount(expected);
  document.getElementById('stat-expected-num').textContent = expected.toLocaleString('en-US') + ' MMK';

  // Outstanding
  const outstanding = Math.max(0, expected - totalSaved);
  document.getElementById('stat-out-text').textContent = formatMyanmarAmount(outstanding);
  document.getElementById('stat-out-num').textContent = outstanding.toLocaleString('en-US') + ' MMK';

  // By month table
  const mt = monthTotals();
  const mc = monthPaymentCounts();
  const monthRows = Array.from(mt.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  const monthBody = document.querySelector('#month-summary tbody');
  monthBody.innerHTML = '';
  if (monthRows.length === 0) {
    monthBody.innerHTML = `<tr><td colspan="4" class="empty">No payments yet.</td></tr>`;
  } else {
    monthRows.forEach(([key, val]) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatMonthLabel(key)} <span class="badge">${key}</span></td>
        <td>${formatMyanmarAmount(val)}</td>
        <td>${val.toLocaleString('en-US')} MMK</td>
        <td>${mc.get(key) || 0}</td>
      `;
      monthBody.appendChild(tr);
    });
  }

  // Top contributors
  const totals = memberTotals();
  const topList = document.querySelector('#top-members');
  topList.innerHTML = '';
  const ranked = state.members
    .map(m => ({ id: m.id, name: m.name, total: totals.get(m.id) || 0 }))
    .sort((a, b) => b.total - a.total);
  const top = ranked.filter(m => m.total > 0).slice(0, 8);
  if (top.length === 0) {
    topList.innerHTML = `<li class="empty">No payments yet.</li>`;
  } else {
    const max = top[0].total || 1;
    top.forEach((m, i) => {
      const pct = (m.total / max) * 100;
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="flex:1;min-width:0;">
          <div><span class="rank">${i + 1}.</span>${escapeHtml(m.name)} <span class="badge">${m.id}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${CHART_COLORS[i % CHART_COLORS.length]}"></div></div>
        </div>
        <div style="text-align:right;white-space:nowrap;">
          <div style="font-weight:600;">${formatMyanmarAmount(m.total)}</div>
          <div style="font-size:12px;color:var(--muted);">${m.total.toLocaleString('en-US')}</div>
        </div>
      `;
      topList.appendChild(li);
    });
  }

  // Charts
  // Bar / line: monthly totals in chronological order
  const sortedMonths = Array.from(mt.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const barData = sortedMonths.map(([key, val]) => ({ label: key, value: val, color: '#2563eb' }));
  renderBarChart(document.getElementById('chart-bar-wrap'), barData);
  renderLineChart(document.getElementById('chart-line-wrap'), barData);

  // Pie: contribution share by member
  const pieData = state.members.map((mem, i) => ({
    label: mem.name,
    value: totals.get(mem.id) || 0,
    color: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(d => d.value > 0);
  renderPieChart(document.getElementById('chart-pie-wrap'), pieData);

  // Donut: expected vs paid (current month)
  renderDonutChart(document.getElementById('chart-donut-wrap'), totalSaved, expected);

  // By member (current month)
  const tbody = document.querySelector('#member-summary tbody');
  tbody.innerHTML = '';
  state.members.forEach((mem, idx) => {
    const exp = memberAmount(mem.id);
    const paid = paidForMonth(mem.id, m);
    const status = paid >= exp ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';
    const badgeClass = paid >= exp ? 'success' : paid > 0 ? 'warning' : 'danger';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(mem.name)} <span class="badge">${mem.id}</span></td>
      <td>${formatMyanmarAmount(exp)}<div style="font-size:12px;color:var(--muted);">${exp.toLocaleString('en-US')}</div></td>
      <td>${formatMyanmarAmount(paid)}<div style="font-size:12px;color:var(--muted);">${paid.toLocaleString('en-US')}</div></td>
      <td><span class="badge ${badgeClass}">${status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function formatMonthLabel(key) {
  // key like "2026-09"
  if (!key) return '';
  const [y, mo] = key.split('-').map(Number);
  if (!y || !mo) return key;
  const d = new Date(y, mo - 1, 1);
  return d.toLocaleDateString(state.settings.language === 'my' ? 'en-US' : 'en-US', { month: 'short', year: 'numeric' });
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ============================================================
   PAYMENT VIEW
   ============================================================ */

const QUICK_AMOUNTS = [
  { label: '၁ထောင်', value: 1000 },
  { label: '၅ထောင်', value: 5000 },
  { label: '၁သောင်း', value: 10000 },
  { label: '၂သောင်း', value: 20000 },
  { label: '၅သောင်း', value: 50000 },
  { label: '၁သိန်း', value: 100000 },
  { label: '၂သိန်း', value: 200000 },
];

function renderPaymentView() {
  const sel = document.getElementById('p-member');
  sel.innerHTML = state.members
    .map(m => `<option value="${m.id}">${escapeHtml(m.name)} (${m.id})</option>`)
    .join('');
  document.getElementById('p-month').value = currentMonthKey();

  // Quick buttons
  const qb = document.getElementById('quick-buttons');
  qb.innerHTML = '';
  QUICK_AMOUNTS.forEach(q => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = q.label;
    b.addEventListener('click', () => {
      const inp = document.getElementById('p-amount');
      inp.value = q.label;
      updateAmountPreview();
      inp.focus();
    });
    qb.appendChild(b);
  });

  updateMemberHelp();
  updateAmountPreview();
}

function updateMemberHelp() {
  const id = document.getElementById('p-member').value;
  const mem = memberById(id);
  if (!mem) return;
  const amt = memberAmount(id);
  const custom = state.settings.memberAmounts[id] != null;
  const customText = custom ? ' (custom)' : ' (default)';
  document.getElementById('p-member-help').textContent =
    `Expected: ${formatMoney(amt, state.settings)}${customText}`;
}

function updateAmountPreview() {
  const inp = document.getElementById('p-amount');
  const prev = document.getElementById('p-amount-preview');
  const raw = inp.value;
  if (!raw.trim()) {
    prev.textContent = '= 0 MMK';
    prev.classList.remove('invalid');
    return;
  }
  const parsed = parseMyanmarAmount(raw);
  if (parsed == null) {
    prev.textContent = '⚠ Amount could not be understood';
    prev.classList.add('invalid');
    return;
  }
  prev.classList.remove('invalid');
  prev.textContent = '= ' + formatMoney(parsed, state.settings);
}

document.getElementById('p-member').addEventListener('change', updateMemberHelp);
document.getElementById('p-amount').addEventListener('input', updateAmountPreview);

document.getElementById('payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const alert = document.getElementById('payment-alert');
  alert.innerHTML = '';
  if (!adminSession) {
    alert.innerHTML = `<div class="alert danger">🔒 Admin sign-in required to add a payment.</div>`;
    return;
  }
  const memberId = document.getElementById('p-member').value;
  const month = document.getElementById('p-month').value;
  const raw = document.getElementById('p-amount').value;
  const note = document.getElementById('p-note').value.trim();
  const amount = parseMyanmarAmount(raw);
  if (amount == null) {
    alert.innerHTML = `<div class="alert danger">⚠ Amount could not be understood. Please enter a valid amount.</div>`;
    return;
  }
  if (amount <= 0) {
    alert.innerHTML = `<div class="alert danger">Amount must be greater than 0.</div>`;
    return;
  }
  try {
    await api('/api/payments', {
      method: 'POST',
      body: JSON.stringify({ memberId, month, amount, amountInput: raw, note }),
    });
    await refreshState();
    alert.innerHTML = `<div class="alert success">✓ Payment saved: ${escapeHtml(memberById(memberId)?.name || '')} — ${formatMyanmarAmount(amount)} for ${month}</div>`;
    document.getElementById('p-amount').value = '';
    document.getElementById('p-note').value = '';
    updateAmountPreview();
    renderDashboard();
  } catch (err) {
    alert.innerHTML = `<div class="alert danger">Save failed: ${escapeHtml(err.message)}</div>`;
  }
});

/* ============================================================
   MEMBERS VIEW
   ============================================================ */

function renderMembersView() {
  const tbody = document.querySelector('#members-table tbody');
  const search = document.getElementById('member-search').value.trim().toLowerCase();
  const filtered = state.members.filter(m => !search || m.name.toLowerCase().includes(search) || m.id.includes(search));
  tbody.innerHTML = '';
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty">No members found.</td></tr>`;
    return;
  }
  filtered.forEach(mem => {
    const custom = state.settings.memberAmounts[mem.id];
    const amt = memberAmount(mem.id);
    const lifetime = lifetimeTotal(mem.id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge">${mem.id}</span></td>
      <td>${escapeHtml(mem.name)}</td>
      <td>
        <input type="text" data-id="${mem.id}" class="member-amt-input"
               value="${custom != null ? formatMyanmarAmount(custom) : formatMyanmarAmount(amt) + ' (default)'}"
               style="width:160px;" />
      </td>
      <td>${formatMoney(lifetime, state.settings)}</td>
      <td><button class="btn btn-ghost" data-save="${mem.id}">Save</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.member-amt-input').forEach(inp => {
    inp.addEventListener('input', e => {
      // optional: live preview - skip for simplicity
    });
  });
  tbody.querySelectorAll('[data-save]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!adminSession) {
        alert('Admin sign-in required.');
        return;
      }
      const id = btn.dataset.save;
      const inp = tbody.querySelector(`.member-amt-input[data-id="${id}"]`);
      const v = inp.value.trim();
      try {
        if (v === '' || /^default$/i.test(v)) {
          await api('/api/members/' + encodeURIComponent(id) + '/amount', { method: 'DELETE' });
        } else {
          const parsed = parseMyanmarAmount(v);
          if (parsed == null) {
            alert('Could not understand custom amount.');
            return;
          }
          await api('/api/members/' + encodeURIComponent(id) + '/amount', {
            method: 'PUT',
            body: JSON.stringify({ amount: parsed }),
          });
        }
        await refreshState();
        renderMembersView();
        renderDashboard();
      } catch (err) {
        alert('Save failed: ' + err.message);
      }
    });
  });
}

document.getElementById('member-search').addEventListener('input', renderMembersView);

/* ============================================================
   PAYMENTS LIST VIEW
   ============================================================ */

function renderPaymentsView() {
  // Filter month options
  const months = Array.from(new Set(state.payments.map(p => p.month).filter(Boolean))).sort();
  const fmonth = document.getElementById('filter-month');
  const cur = fmonth.value;
  fmonth.innerHTML = '<option value="">All months</option>' +
    months.map(m => `<option value="${m}">${m}</option>`).join('');
  fmonth.value = cur;

  // Filter member options
  const fmember = document.getElementById('filter-member');
  const curM = fmember.value;
  fmember.innerHTML = '<option value="">All members</option>' +
    state.members.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
  fmember.value = curM;

  const tbody = document.querySelector('#payments-table tbody');
  const fm = document.getElementById('filter-month').value;
  const fid = document.getElementById('filter-member').value;
  let list = state.payments.slice().sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  if (fm) list = list.filter(p => p.month === fm);
  if (fid) list = list.filter(p => p.memberId === fid);

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">No payments yet.</td></tr>`;
    return;
  }
  list.forEach(p => {
    const mem = memberById(p.memberId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(formatDate(p.createdAt))}</td>
      <td>${escapeHtml(mem ? mem.name : p.memberId)} <span class="badge">${escapeHtml(p.memberId)}</span></td>
      <td>${formatMoney(p.amount, state.settings)}</td>
      <td>${escapeHtml(p.amountInput || '')}</td>
      <td>${escapeHtml(p.note || '')}</td>
      <td><button class="btn btn-danger" data-del="${p.id}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!adminSession) {
        alert('Admin sign-in required.');
        return;
      }
      if (!confirm('Delete this payment?')) return;
      const id = btn.dataset.del;
      try {
        await api('/api/payments/' + encodeURIComponent(id), { method: 'DELETE' });
        await refreshState();
        renderPaymentsView();
        renderDashboard();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    });
  });
}

document.getElementById('filter-month').addEventListener('change', renderPaymentsView);
document.getElementById('filter-member').addEventListener('change', renderPaymentsView);
document.getElementById('btn-export').addEventListener('click', () => {
  const data = JSON.stringify({
    members: state.members,
    payments: state.payments,
    settings: state.settings,
  }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'suboo-export-' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(url);
});
document.getElementById('btn-clear-all').addEventListener('click', async () => {
  if (!adminSession) {
    alert('Admin sign-in required.');
    return;
  }
  if (!confirm('Delete ALL payments? This cannot be undone.')) return;
  try {
    await api('/api/payments/clear', { method: 'POST', body: '{}' });
    await refreshState();
    renderPaymentsView();
    renderDashboard();
  } catch (err) {
    alert('Failed: ' + err.message);
  }
});

/* ============================================================
   SETTINGS VIEW
   ============================================================ */

function renderSettingsView() {
  const s = state.settings;
  document.getElementById('set-default').value = s.defaultAmountInput || formatMyanmarAmount(s.defaultAmount);
  document.getElementById('set-lang').value = s.language;
  updateDefaultPreview();
  document.querySelectorAll('#display-mode-pills .pill').forEach(p => {
    p.classList.toggle('active', p.dataset.mode === s.displayMode);
  });
}

function updateDefaultPreview() {
  const v = document.getElementById('set-default').value;
  const p = document.getElementById('set-default-preview');
  const parsed = parseMyanmarAmount(v);
  if (parsed == null) {
    p.textContent = '⚠ Amount could not be understood';
    p.classList.add('invalid');
    return;
  }
  p.classList.remove('invalid');
  p.textContent = '= ' + formatMoney(parsed, state.settings);
}

document.getElementById('set-default').addEventListener('input', updateDefaultPreview);
document.getElementById('display-mode-pills').addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;
  document.querySelectorAll('#display-mode-pills .pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});
document.getElementById('save-settings').addEventListener('click', async () => {
  if (!adminSession) {
    alert('Admin sign-in required.');
    return;
  }
  const raw = document.getElementById('set-default').value;
  const parsed = parseMyanmarAmount(raw);
  if (parsed == null) {
    alert('Default amount could not be understood.');
    return;
  }
  const newSettings = {
    defaultAmount: parsed,
    defaultAmountInput: raw,
    language: document.getElementById('set-lang').value,
  };
  const activePill = document.querySelector('#display-mode-pills .pill.active');
  if (activePill) newSettings.displayMode = activePill.dataset.mode;
  try {
    await api('/api/settings', { method: 'PUT', body: JSON.stringify(newSettings) });
    await refreshState();
    alert('Settings saved.');
    renderDashboard();
    updateHeaderSub();
  } catch (err) {
    alert('Save failed: ' + err.message);
  }
});

function updateHeaderSub() {
  document.getElementById('headerSub').textContent =
    `${state.members.length} members · Default: ${formatMyanmarAmount(state.settings.defaultAmount)}`;
}

document.getElementById('change-pin').addEventListener('click', async () => {
  if (!adminSession) {
    document.getElementById('change-pin-msg').textContent = 'Sign in first.';
    return;
  }
  const cur = document.getElementById('cur-pin').value;
  const next = document.getElementById('new-pin').value;
  const msg = document.getElementById('change-pin-msg');
  msg.style.color = '';
  if (!tryAdminSignIn(cur)) {
    msg.textContent = 'Current PIN incorrect.';
    msg.style.color = 'var(--danger)';
    return;
  }
  if (!next || next.length < 4) {
    msg.textContent = 'New PIN must be at least 4 characters.';
    msg.style.color = 'var(--danger)';
    return;
  }
  try {
    await api('/api/admin-pin', {
      method: 'PUT',
      headers: { 'x-admin-pin': cur },
      body: JSON.stringify({ newPin: next }),
    });
    setAdminPinHash(sha256Hex(next));
    currentPin = next;
    msg.textContent = '✓ PIN updated on server.';
    msg.style.color = 'var(--success)';
    document.getElementById('cur-pin').value = '';
    document.getElementById('new-pin').value = '';
  } catch (err) {
    msg.textContent = 'Failed: ' + err.message;
    msg.style.color = 'var(--danger)';
  }
});

/* ============================================================
   TESTS VIEW
   ============================================================ */

const TEST_CASES = [
  { input: '၁သောင်း', expected: 10000 },
  { input: '၂သောင်း', expected: 20000 },
  { input: '၅သောင်း', expected: 50000 },
  { input: '၁သိန်း', expected: 100000 },
  { input: '၂သိန်း', expected: 200000 },
  { input: '၁သိန်းခွဲ', expected: 150000 },
  { input: '၂သိန်းခွဲ', expected: 250000 },
  { input: '၅သောင်းခွဲ', expected: 55000 },
  { input: '၁သိန်း ၅သောင်း', expected: 150000 },
  { input: '၁သိန်း၅သောင်း', expected: 150000 },
  { input: '၂သိန်း ၅သောင်း', expected: 250000 },
  { input: '၂သိန်း ၅ထောင်', expected: 205000 },
  { input: '၁သိန်း ၂သောင်း ၅ထောင်', expected: 125000 },
  { input: '၁ထောင်', expected: 1000 },
  { input: '၅ထောင်', expected: 5000 },
  { input: '၅ရာ', expected: 500 },
  { input: '၁သန်း', expected: 1000000 },
  { input: '10000', expected: 10000 },
  { input: '50,000', expected: 50000 },
  { input: '100,000', expected: 100000 },
  { input: '100000', expected: 100000 },
  { input: '၁၀,၀၀၀', expected: 10000 },
  { input: '၁၀၀,၀၀၀', expected: 100000 },
  { input: '10k', expected: 10000 },
  { input: '50k', expected: 50000 },
  { input: '100k', expected: 100000 },
  { input: '1 lakh', expected: 100000 },
  { input: '2 lakh', expected: 200000 },
];

function renderTestsView() {
  document.getElementById('test-results').innerHTML = '';
}

document.getElementById('run-tests').addEventListener('click', () => {
  const results = TEST_CASES.map(tc => {
    const got = parseMyanmarAmount(tc.input);
    const ok = got === tc.expected;
    return Object.assign({}, tc, { got, ok });
  });
  const passed = results.filter(r => r.ok).length;
  const total = results.length;
  const wrap = document.getElementById('test-results');
  let html = `<div class="alert ${passed === total ? 'success' : 'danger'}">${passed}/${total} tests passed</div>`;
  html += '<div class="table-wrap"><table><thead><tr><th>Input</th><th>Expected</th><th>Got</th><th></th></tr></thead><tbody>';
  results.forEach(r => {
    html += `<tr>
      <td><code>${escapeHtml(r.input)}</code></td>
      <td>${r.expected.toLocaleString('en-US')}</td>
      <td>${r.got == null ? 'null' : r.got.toLocaleString('en-US')}</td>
      <td><span class="badge ${r.ok ? 'success' : 'danger'}">${r.ok ? 'PASS' : 'FAIL'}</span></td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  wrap.innerHTML = html;
});

/* ============================================================
   INITIAL RENDER
   ============================================================ */

async function bootstrap() {
  renderAdminBar();
  applyAdminLocks();
  updateHeaderSub();
  try {
    await loadStateFromServer();
  } catch (e) {
    showOfflineBanner();
  }
  renderDashboard();

  // Periodic refresh so multiple users see each other's writes.
  setInterval(async () => {
    try {
      const before = JSON.stringify(state);
      await refreshState();
      const after = JSON.stringify(state);
      if (before !== after) {
        // re-render any visible views
        const active = document.querySelector('.view.active');
        if (active) {
          if (active.id === 'view-dashboard') renderDashboard();
          if (active.id === 'view-payments') renderPaymentsView();
          if (active.id === 'view-members') renderMembersView();
          if (active.id === 'view-settings') renderSettingsView();
        }
        updateHeaderSub();
      }
    } catch (e) {
      /* offline */
    }
  }, 8000);
}

function showOfflineBanner() {
  const host = document.querySelector('main');
  if (!host) return;
  const banner = document.createElement('div');
  banner.className = 'alert danger';
  banner.id = 'offline-banner';
  banner.textContent = '⚠ Server unreachable. Showing last cached data. Changes will not be saved until the server is back.';
  host.insertBefore(banner, host.firstChild);
}

bootstrap();

// Re-render charts on resize for best label fit (debounced)
let resizeTimer = null;
window.addEventListener('resize', () => {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const dash = document.getElementById('view-dashboard');
    if (dash && dash.classList.contains('active')) renderDashboard();
  }, 150);
});

// Expose for debugging
window.__app = { state, parseMyanmarAmount, formatMyanmarAmount, formatMoney, formatMyanmarDigits, formatNumeric };
</script>
</body>
</html>