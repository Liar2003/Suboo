<?php
/**
 * Suboo — Monthly Savings Management
 * Single-file PHP API + static file server. Uses SQLite for storage.
 *
 * Usage:
 *   php -S 0.0.0.0:3000 server.php
 *
 * Env:
 *   PORT     (used by the built-in server when launched via this file directly)
 *   ADMIN_PIN default 9876
 */

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

const ADMIN_PIN = '9876';
const DB_FILE   = __DIR__ . '/data.sqlite';

// ---------- DB bootstrap ----------

function db(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $isNew = !file_exists(DB_FILE);
        $pdo = new PDO('sqlite:' . DB_FILE, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec('PRAGMA journal_mode = WAL');
        $pdo->exec('PRAGMA foreign_keys = ON');
        $pdo->exec('PRAGMA busy_timeout = 5000');
        if ($isNew) initSchema($pdo);
        else ensureSchema($pdo);
    }
    return $pdo;
}

function initSchema(PDO $pdo): void {
    $pdo->exec(<<<SQL
        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS members (
            id    TEXT PRIMARY KEY,
            name  TEXT NOT NULL,
            ord   INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS payments (
            id          TEXT PRIMARY KEY,
            member_id   TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
            month       TEXT NOT NULL,
            amount      REAL NOT NULL,
            amount_input TEXT,
            note        TEXT,
            created_at  TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
        CREATE INDEX IF NOT EXISTS idx_payments_month  ON payments(month);
        CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
    SQL);
    seedMembers($pdo);
    seedSettings($pdo);
}

function ensureSchema(PDO $pdo): void {
    // Make sure required tables exist (idempotent upgrade path)
    $pdo->exec(<<<SQL
        CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS members (
            id    TEXT PRIMARY KEY,
            name  TEXT NOT NULL,
            ord   INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS payments (
            id          TEXT PRIMARY KEY,
            member_id   TEXT NOT NULL,
            month       TEXT NOT NULL,
            amount      REAL NOT NULL,
            amount_input TEXT,
            note        TEXT,
            created_at  TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);
        CREATE INDEX IF NOT EXISTS idx_payments_month  ON payments(month);
        CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);
    SQL);
    // If members table is empty, seed default members.
    $count = (int) $pdo->query('SELECT COUNT(*) FROM members')->fetchColumn();
    if ($count === 0) seedMembers($pdo);
    if ((int) $pdo->query('SELECT COUNT(*) FROM settings')->fetchColumn() === 0) seedSettings($pdo);
}

function seedMembers(PDO $pdo): void {
    $defaults = [
        ['member_001', 'Ko chit ko'],
        ['member_002', 'zaw Oo'],
        ['member_003', 'Kyaw myint aye'],
        ['member_004', 'toewaoo'],
        ['member_005', 'min min Aung'],
        ['member_006', 'Kyaw Kyaw Htet'],
        ['member_007', 'arkar'],
        ['member_008', 'min khant kyaw1'],
        ['member_009', 'min khant kyaw2'],
        ['member_010', 'win Myat tun'],
        ['member_011', 'sai zaw zaw'],
        ['member_012', 'Wai moe'],
        ['member_013', 'Hein thiha'],
        ['member_014', 'bobo Aung'],
        ['member_015', 'win moe aung'],
        ['member_016', 'aung myo thant'],
    ];
    $stmt = $pdo->prepare('INSERT OR REPLACE INTO members (id, name, ord) VALUES (?, ?, ?)');
    foreach ($defaults as $i => [$id, $name]) {
        $stmt->execute([$id, $name, $i + 1]);
    }
}

function seedSettings(PDO $pdo): void {
    $defaults = [
        'defaultAmount'       => '10000',
        'defaultAmountInput'  => '၁သောင်း',
        'language'            => 'my',
        'displayMode'         => 'myanmarDigits',
        'memberAmounts'       => '{}',
    ];
    $stmt = $pdo->prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    foreach ($defaults as $k => $v) {
        $stmt->execute([$k, $v]);
    }
}

// ---------- helpers ----------

function jsonResponse($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $msg, int $status = 400): void {
    jsonResponse(['error' => $msg], $status);
}

function readJsonBody(): array {
    static $cache = null;
    if ($cache !== null) return $cache;
    $raw = file_get_contents('php://input') ?: '';
    $data = $raw === '' ? [] : json_decode($raw, true);
    $cache = is_array($data) ? $data : [];
    return $cache;
}

function getAdminPin(): string {
    $env = getenv('ADMIN_PIN');
    if ($env !== false && $env !== '') return $env;
    $file = __DIR__ . '/admin-pin.txt';
    if (file_exists($file)) {
        $contents = trim((string) file_get_contents($file));
        if ($contents !== '') return $contents;
    }
    return ADMIN_PIN;
}

function isAdmin(): bool {
    $header = $_SERVER['HTTP_X_ADMIN_PIN'] ?? '';
    $body   = readJsonBody();
    $bodyPin = is_array($body) && isset($body['pin']) ? (string) $body['pin'] : '';
    $pin = trim((string) ($header ?: $bodyPin));
    return $pin !== '' && $pin === getAdminPin();
}

function loadSettings(PDO $pdo): array {
    $rows = $pdo->query('SELECT key, value FROM settings')->fetchAll();
    $out = [];
    foreach ($rows as $r) {
        $out[$r['key']] = $r['value'];
    }
    // Decode JSON-encoded values
    $out['defaultAmount']  = (int) ($out['defaultAmount'] ?? 10000);
    $out['defaultAmountInput'] = (string) ($out['defaultAmountInput'] ?? '၁သောင်း');
    $out['language']       = (string) ($out['language'] ?? 'my');
    $out['displayMode']    = (string) ($out['displayMode'] ?? 'myanmarDigits');
    $out['memberAmounts']  = json_decode($out['memberAmounts'] ?? '{}', true) ?: [];
    return $out;
}

function saveSettings(PDO $pdo, array $s): void {
    $stmt = $pdo->prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    if (isset($s['defaultAmount']))     $stmt->execute(['defaultAmount', (string) (int) $s['defaultAmount']]);
    if (isset($s['defaultAmountInput']))$stmt->execute(['defaultAmountInput', (string) $s['defaultAmountInput']]);
    if (isset($s['language']))          $stmt->execute(['language', (string) $s['language']]);
    if (isset($s['displayMode']))       $stmt->execute(['displayMode', (string) $s['displayMode']]);
    if (isset($s['memberAmounts']))     $stmt->execute(['memberAmounts', json_encode($s['memberAmounts'])]);
}

function loadMembers(PDO $pdo): array {
    $stmt = $pdo->query('SELECT id, name FROM members ORDER BY ord, id');
    return $stmt->fetchAll();
}

function loadPayments(PDO $pdo): array {
    $stmt = $pdo->query('SELECT id, member_id AS memberId, month, amount, amount_input AS amountInput, note, created_at AS createdAt FROM payments ORDER BY created_at DESC');
    return $stmt->fetchAll();
}

function requireAdmin(): void {
    if (!isAdmin()) jsonError('Admin PIN required or incorrect.', 401);
}

function nextPaymentId(): string {
    return 'pay_' . (string) (int) (microtime(true) * 1000) . '_' . bin2hex(random_bytes(3));
}

// ---------- routing ----------

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$methodReq = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($path === '/api/health') {
    $pdo = db();
    jsonResponse([
        'ok' => true,
        'members' => (int) $pdo->query('SELECT COUNT(*) FROM members')->fetchColumn(),
        'payments' => (int) $pdo->query('SELECT COUNT(*) FROM payments')->fetchColumn(),
    ]);
}

if ($path === '/api/state') {
    $pdo = db();
    jsonResponse([
        'members'  => loadMembers($pdo),
        'payments' => loadPayments($pdo),
        'settings' => loadSettings($pdo),
        'meta'     => ['updatedAt' => gmdate('c'), 'version' => 2],
    ]);
}

if ($path === '/api/members') {
    jsonResponse(loadMembers(db()));
}

if ($path === '/api/payments') {
    if ($methodReq === 'POST') {
        requireAdmin();
        $body = readJsonBody();
        $memberId = (string) ($body['memberId'] ?? '');
        $month    = (string) ($body['month'] ?? '');
        $amount   = $body['amount'] ?? null;
        if ($memberId === '' || $month === '' || !is_numeric($amount) || (float) $amount <= 0) {
            jsonError('memberId, month, and numeric amount > 0 required');
        }
        $pdo = db();
        $exists = $pdo->prepare('SELECT 1 FROM members WHERE id = ?');
        $exists->execute([$memberId]);
        if (!$exists->fetchColumn()) jsonError('Unknown memberId', 400);
        $payment = [
            'id'         => nextPaymentId(),
            'memberId'   => $memberId,
            'month'      => $month,
            'amount'     => (float) $amount,
            'amountInput'=> (string) ($body['amountInput'] ?? ''),
            'note'       => (string) ($body['note'] ?? ''),
            'createdAt'  => gmdate('c'),
        ];
        $stmt = $pdo->prepare('INSERT INTO payments (id, member_id, month, amount, amount_input, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$payment['id'], $payment['memberId'], $payment['month'], $payment['amount'], $payment['amountInput'], $payment['note'], $payment['createdAt']]);
        jsonResponse($payment, 201);
    }
    jsonResponse(loadPayments(db()));
}

if ($path === '/api/payments/clear') {
    if ($methodReq !== 'POST') jsonError('Method not allowed', 405);
    requireAdmin();
    $pdo = db();
    $pdo->exec('DELETE FROM payments');
    jsonResponse(['ok' => true]);
}

if (preg_match('#^/api/payments/([^/]+)$#', $path, $m)) {
    $id = $m[1];
    if ($methodReq === 'DELETE') {
        requireAdmin();
        $pdo = db();
        $stmt = $pdo->prepare('DELETE FROM payments WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) jsonError('Payment not found', 404);
        jsonResponse(['ok' => true]);
    }
    jsonError('Method not allowed', 405);
}

if (preg_match('#^/api/members/([^/]+)/amount$#', $path, $m)) {
    $id = $m[1];
    $pdo = db();
    if ($methodReq === 'PUT') {
        requireAdmin();
        $body = readJsonBody();
        if (!isset($body['amount']) || !is_numeric($body['amount']) || (float) $body['amount'] < 0) {
            jsonError('Numeric amount >= 0 required');
        }
        $exists = $pdo->prepare('SELECT 1 FROM members WHERE id = ?');
        $exists->execute([$id]);
        if (!$exists->fetchColumn()) jsonError('Member not found', 404);
        $settings = loadSettings($pdo);
        $settings['memberAmounts'][$id] = (float) $body['amount'];
        saveSettings($pdo, $settings);
        jsonResponse(['ok' => true, 'memberId' => $id, 'amount' => (float) $body['amount']]);
    }
    if ($methodReq === 'DELETE') {
        requireAdmin();
        $settings = loadSettings($pdo);
        unset($settings['memberAmounts'][$id]);
        saveSettings($pdo, $settings);
        jsonResponse(['ok' => true]);
    }
    jsonError('Method not allowed', 405);
}

if ($path === '/api/settings') {
    if ($methodReq === 'PUT') {
        requireAdmin();
        $body = readJsonBody();
        $pdo = db();
        $current = loadSettings($pdo);
        // merge, but never overwrite memberAmounts via this endpoint
        if (isset($body['defaultAmount']))     $current['defaultAmount'] = (int) $body['defaultAmount'];
        if (isset($body['defaultAmountInput']))$current['defaultAmountInput'] = (string) $body['defaultAmountInput'];
        if (isset($body['language']))          $current['language'] = (string) $body['language'];
        if (isset($body['displayMode']))       $current['displayMode'] = (string) $body['displayMode'];
        saveSettings($pdo, $current);
        jsonResponse(['ok' => true, 'settings' => loadSettings($pdo)]);
    }
    jsonResponse(loadSettings(db()));
}

if ($path === '/api/auth/check') {
    if ($methodReq !== 'POST') jsonError('Method not allowed', 405);
    if (isAdmin()) jsonResponse(['ok' => true]);
    jsonResponse(['ok' => false, 'error' => 'Invalid PIN'], 401);
}

if ($path === '/api/admin-pin') {
    if ($methodReq !== 'PUT') jsonError('Method not allowed', 405);
    requireAdmin();
    $body = readJsonBody();
    $newPin = (string) ($body['newPin'] ?? '');
    if (strlen($newPin) < 4) jsonError('newPin must be a string of length >= 4');
    // Persist in a small file alongside the DB so it survives restarts.
    file_put_contents(__DIR__ . '/admin-pin.txt', $newPin);
    jsonResponse(['ok' => true]);
}

// CORS preflight
if ($methodReq === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, x-admin-pin');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    http_response_code(204);
    exit;
}

// ---------- Static files ----------

function serveStatic(string $path): void {
    // Map "/" -> "/index.html"
    $rel = ltrim($path, '/');
    if ($rel === '') $rel = 'index.html';
    $full = __DIR__ . '/' . $rel;
    // Prevent path traversal
    $realBase = realpath(__DIR__);
    $realFile = realpath($full);
    if ($realFile === false || $realBase === false || strpos($realFile, $realBase) !== 0) {
        // SPA fallback: serve index.html for non-asset routes
        if (!preg_match('#\.[a-z0-9]{1,5}$#i', $rel)) {
            $realFile = realpath(__DIR__ . '/index.html');
            if ($realFile === false) {
                http_response_code(404);
                echo 'Not found';
                return;
            }
            $rel = 'index.html';
        } else {
            http_response_code(404);
            echo 'Not found';
            return;
        }
    }
    $ext = strtolower(pathinfo($realFile, PATHINFO_EXTENSION));
    $types = [
        'html' => 'text/html; charset=utf-8',
        'js'   => 'application/javascript; charset=utf-8',
        'css'  => 'text/css; charset=utf-8',
        'json' => 'application/json; charset=utf-8',
        'svg'  => 'image/svg+xml',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'ico'  => 'image/x-icon',
        'txt'  => 'text/plain; charset=utf-8',
        'md'   => 'text/markdown; charset=utf-8',
    ];
    header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
    header('Cache-Control: no-cache');
    readfile($realFile);
}

// JSON 404 for unmatched /api/* requests, otherwise serve static files
if (strpos($path, '/api/') === 0) {
    jsonError('Not found', 404);
}

if (PHP_SAPI !== 'cli' || isset($_SERVER['REQUEST_METHOD'])) {
    header('Access-Control-Allow-Origin: *');
    serveStatic($path);
}