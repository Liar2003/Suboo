/**
 * Suboo - Monthly Savings Management
 * Shared file-storage backend.
 *
 * - Reads/writes a single data.json file on disk.
 * - All clients share the same state via REST API.
 * - Writes are gated by an admin PIN (default 9876), configurable via env.
 * - Uses a simple async mutex to serialize writes and prevent corruption.
 *
 * Endpoints:
 *   GET    /api/state                    -> full state (members, payments, settings)
 *   GET    /api/members                  -> list of members
 *   GET    /api/payments                 -> list of payments
 *   GET    /api/settings                 -> settings object
 *   POST   /api/payments                 -> add payment   (admin)
 *   DELETE /api/payments/:id             -> delete payment (admin)
 *   PUT    /api/members/:id/amount       -> set custom member amount (admin)
 *   DELETE /api/members/:id/amount       -> clear custom member amount (admin)
 *   PUT    /api/settings                 -> replace settings (admin)
 *   POST   /api/payments/clear           -> clear all payments (admin)
 *
 * Auth: header "x-admin-pin: <pin>" OR JSON body { pin: "<pin>" }.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data.json');
const ADMIN_PIN = process.env.ADMIN_PIN || '9876';

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
  displayMode: 'myanmarDigits',
  memberAmounts: {},
};

/* ---------- Storage ---------- */

function freshState() {
  return {
    members: DEFAULT_MEMBERS.slice(),
    payments: [],
    settings: Object.assign({}, DEFAULT_SETTINGS),
    meta: { updatedAt: new Date().toISOString(), version: 1 },
  };
}

function loadState() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const init = freshState();
      saveStateSync(init);
      return init;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const merged = Object.assign(freshState(), parsed);
    merged.settings = Object.assign({}, DEFAULT_SETTINGS, parsed.settings || {});
    if (!Array.isArray(merged.members) || merged.members.length === 0) {
      merged.members = DEFAULT_MEMBERS.slice();
    }
    if (!Array.isArray(merged.payments)) merged.payments = [];
    return merged;
  } catch (e) {
    console.error('Failed to load data, using fresh state:', e.message);
    return freshState();
  }
}

function saveStateSync(state) {
  state.meta = { updatedAt: new Date().toISOString(), version: (state.meta && state.meta.version) || 1 };
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// Simple async mutex for write serialization
let writeQueue = Promise.resolve();
function withLock(fn) {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.catch(() => {});
  return next;
}

let state = loadState();

/* ---------- Helpers ---------- */

function isAdmin(req) {
  const headerPin = req.get('x-admin-pin');
  const bodyPin = (req.body && req.body.pin) || '';
  const pin = String(headerPin || bodyPin || '').trim();
  return pin.length > 0 && pin === currentAdminPin;
}

function stripPin(body) {
  if (body && typeof body === 'object' && 'pin' in body) {
    const { pin, ...rest } = body;
    return rest;
  }
  return body;
}

function nextPaymentId() {
  return 'pay_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function requireAdmin(req, res) {
  if (!isAdmin(req)) {
    res.status(401).json({ error: 'Admin PIN required or incorrect.' });
    return false;
  }
  return true;
}

/* ---------- Express app ---------- */

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-pin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, members: state.members.length, payments: state.payments.length, updatedAt: state.meta && state.meta.updatedAt });
});

app.post('/api/auth/check', (req, res) => {
  if (isAdmin(req)) return res.json({ ok: true });
  return res.status(401).json({ ok: false, error: 'Invalid PIN' });
});

// In-memory admin PIN (loaded from env at startup). Allows admin to rotate
// it at runtime via /api/admin-pin. To persist across restarts, set the
// ADMIN_PIN env var when launching the server.
let currentAdminPin = ADMIN_PIN;

app.put('/api/admin-pin', (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Admin PIN required or incorrect.' });
  const body = stripPin(req.body) || {};
  if (typeof body.newPin !== 'string' || body.newPin.length < 4) {
    return res.status(400).json({ error: 'newPin must be a string of length >= 4' });
  }
  currentAdminPin = body.newPin;
  res.json({ ok: true });
});

app.get('/api/state', (req, res) => {
  res.json(state);
});

app.get('/api/members', (req, res) => {
  res.json(state.members);
});

app.get('/api/payments', (req, res) => {
  res.json(state.payments);
});

app.get('/api/settings', (req, res) => {
  res.json(state.settings);
});

app.post('/api/payments', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const body = stripPin(req.body) || {};
  const { memberId, month, amount, amountInput, note } = body;
  if (!memberId || !month || typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'memberId, month, and numeric amount > 0 required' });
  }
  const exists = state.members.find(m => m.id === memberId);
  if (!exists) return res.status(400).json({ error: 'Unknown memberId' });
  const payment = {
    id: nextPaymentId(),
    memberId,
    month,
    amount,
    amountInput: amountInput || '',
    note: note || '',
    createdAt: new Date().toISOString(),
  };
  withLock(() => {
    state.payments.push(payment);
    saveStateSync(state);
  }).then(() => res.json(payment));
});

app.delete('/api/payments/:id', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = req.params.id;
  withLock(() => {
    const before = state.payments.length;
    state.payments = state.payments.filter(p => p.id !== id);
    if (state.payments.length === before) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    saveStateSync(state);
    res.json({ ok: true });
  });
});

app.post('/api/payments/clear', (req, res) => {
  if (!requireAdmin(req, res)) return;
  withLock(() => {
    state.payments = [];
    saveStateSync(state);
    res.json({ ok: true });
  });
});

app.put('/api/members/:id/amount', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = req.params.id;
  const exists = state.members.find(m => m.id === id);
  if (!exists) return res.status(404).json({ error: 'Member not found' });
  const body = stripPin(req.body) || {};
  if (typeof body.amount !== 'number' || isNaN(body.amount) || body.amount < 0) {
    return res.status(400).json({ error: 'Numeric amount >= 0 required' });
  }
  withLock(() => {
    state.settings.memberAmounts[id] = body.amount;
    saveStateSync(state);
    res.json({ ok: true, memberId: id, amount: body.amount });
  });
});

app.delete('/api/members/:id/amount', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const id = req.params.id;
  withLock(() => {
    delete state.settings.memberAmounts[id];
    saveStateSync(state);
    res.json({ ok: true });
  });
});

app.put('/api/settings', (req, res) => {
  if (!requireAdmin(req, res)) return;
  const body = stripPin(req.body) || {};
  withLock(() => {
    state.settings = Object.assign({}, state.settings, body, { memberAmounts: state.settings.memberAmounts });
    saveStateSync(state);
    res.json({ ok: true, settings: state.settings });
  });
});

app.use(express.static(__dirname));

app.listen(PORT, HOST, () => {
  console.log(`Suboo server listening on http://${HOST}:${PORT}`);
  console.log(`Data file: ${DATA_FILE}`);
  console.log(`Admin PIN: ${ADMIN_PIN}  (set ADMIN_PIN env to change)`);
});