<?php
// =========================================================================
// Monthly Savings Management System
// Single-file PHP application (PHP 8.2+, SQLite, PDO)
// =========================================================================
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ----------------------------- Paths ------------------------------------
$ROOT      = __DIR__;
$DB_FILE   = $ROOT . '/savings.sqlite';
$BACKUP_DIR = $ROOT . '/backups';

// ----------------------------- API router -------------------------------
$asset = isset($_GET['asset']) ? (string)$_GET['asset'] : '';
if ($asset === 'css') {
    header('Content-Type: text/css; charset=utf-8');
    header('Cache-Control: public, max-age=300');
    readfile(__DIR__ . '/assets/app.css');
    exit;
}
if ($asset === 'js') {
    header('Content-Type: application/javascript; charset=utf-8');
    header('Cache-Control: public, max-age=300');
    readfile(__DIR__ . '/assets/app.js');
    exit;
}

$api = isset($_GET['api']) ? (string)$_GET['api'] : '';
if ($api !== '') {
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    try {
        $handler = 'api_' . preg_replace('/[^a-z0-9_]/i', '', $api);
        if (function_exists($handler)) {
            $resp = $handler();
            if (is_array($resp)) {
                echo json_encode($resp, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Unknown API endpoint']);
        }
    } catch (Throwable $e) {
        error_log('[savings] API error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error']);
    }
    exit;
}

// ------------------------- Database bootstrap ---------------------------
function db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $file = $GLOBALS['DB_FILE'];
    $needInit = !file_exists($file);
    $pdo = new PDO('sqlite:' . $file);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON;');
    $pdo->exec('PRAGMA journal_mode = WAL;');
    $pdo->exec('PRAGMA synchronous = NORMAL;');
    init_schema($pdo, $needInit);
    return $pdo;
}

function init_schema(PDO $pdo, bool $firstRun): void {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            active INTEGER NOT NULL DEFAULT 1,
            monthly_amount INTEGER NOT NULL DEFAULT 10000,
            note TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_id INTEGER NOT NULL,
            month TEXT NOT NULL,
            amount INTEGER NOT NULL,
            amount_input TEXT,
            paid INTEGER NOT NULL DEFAULT 1,
            paid_at TEXT,
            note TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
            UNIQUE(member_id, month)
        );
    ");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_payments_member ON payments(member_id);");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_payments_month  ON payments(month);");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_payments_paid   ON payments(paid);");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS payment_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            payment_id INTEGER NOT NULL,
            member_id INTEGER NOT NULL,
            month TEXT NOT NULL,
            old_amount INTEGER,
            new_amount INTEGER NOT NULL,
            old_paid INTEGER,
            new_paid INTEGER,
            changed_at TEXT NOT NULL,
            FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
        );
    ");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_history_payment ON payment_history(payment_id);");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS schema_meta (
            key TEXT PRIMARY KEY,
            value TEXT
        );
    ");
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS login_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            success INTEGER NOT NULL DEFAULT 0,
            attempted_at TEXT NOT NULL
        );
    ");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_login_ip_time ON login_attempts(ip, attempted_at);");

    $defaults = [
        'default_amount'      => '10000',
        'currency'            => 'MMK',
        'language'            => 'mm',
        'theme'               => 'system',
        'display_mode'        => 'both',   // exact|units|both|auto
        'group_name'          => 'Monthly Savings',
    ];
    $ins = $pdo->prepare("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)");
    foreach ($defaults as $k => $v) $ins->execute([$k, $v]);

    $cur = (int)($pdo->query("SELECT value FROM schema_meta WHERE key='schema_version'")->fetchColumn() ?: 0);
    if ($cur < 1) {
        // First run: insert the 16 default members
        $names = [
            'Ko chit ko', 'zaw Oo', 'Kyaw myint aye', 'toewaoo',
            'min min Aung', 'Kyaw Kyaw Htet', 'arkar', 'min khant kyaw1',
            'min khant kyaw2', 'win Myat tun', 'sai zaw zaw', 'Wai moe',
            'Hein thiha', 'bobo Aung', 'win moe Aung', 'Aung myo thant',
        ];
        $now = now();
        $insM = $pdo->prepare("INSERT INTO members(name,active,monthly_amount,note,created_at,updated_at) VALUES(?,?,?,?,?,?)");
        foreach ($names as $n) $insM->execute([$n, 1, 10000, null, $now, $now]);
        $pdo->prepare("INSERT OR REPLACE INTO schema_meta(key,value) VALUES('schema_version',?)")->execute(['1']);
    }
    if ($cur < 2) {
        // Schema v2: add admin password (default: 'admin123' — must be changed in Settings)
        $pdo->prepare("INSERT OR IGNORE INTO settings(key,value) VALUES('admin_password_hash', ?)")
            ->execute([password_hash('admin123', PASSWORD_BCRYPT)]);
        $pdo->prepare("INSERT OR REPLACE INTO schema_meta(key,value) VALUES('schema_version',?)")->execute(['2']);
    }
}

// ----------------------- Admin authentication -----------------------------
function start_session_once(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.cookie_httponly', '1');
    ini_set('session.cookie_samesite', 'Lax');
    ini_set('session.use_strict_mode', '1');
    ini_set('session.gc_maxlifetime', '7200');
    session_name('SUBOOSESSID');
    session_start();
}
function is_authed(): bool {
    start_session_once();
    return !empty($_SESSION['auth_ok']) && $_SESSION['auth_ok'] === true;
}
function require_auth(): void {
    if (!is_authed()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'auth_required', 'message' => 'Admin login required']);
        exit;
    }
}
function client_ip(): string {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}
function too_many_attempts(string $ip): bool {
    $pdo = db();
    $since = gmdate('Y-m-d H:i:s', time() - 900); // 15 min
    $st = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip=? AND success=0 AND attempted_at>=?");
    $st->execute([$ip, $since]);
    return ((int)$st->fetchColumn()) >= 8;
}
function record_attempt(string $ip, bool $success): void {
    db()->prepare("INSERT INTO login_attempts(ip,success,attempted_at) VALUES(?,?,?)")
        ->execute([$ip, $success ? 1 : 0, now()]);
}

// ----------------------------- Helpers -----------------------------------
function now(): string { return gmdate('Y-m-d\TH:i:s'); }
function today(): string { return gmdate('Y-m-d'); }
function json_in(): array {
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') return $_POST;
    $j = json_decode($raw, true);
    if (is_array($j)) return $j;
    return [];
}
function sval(string $key, ?string $default = null): ?string {
    if (isset($_GET[$key])) return (string)$_GET[$key];
    if (isset($_POST[$key])) return (string)$_POST[$key];
    $j = json_in();
    if (isset($j[$key])) return (string)$j[$key];
    return $default;
}
function sint(string $key, int $default = 0): int {
    $v = sval($key, null);
    if ($v === null || $v === '') return $default;
    return (int)$v;
}
function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function ok(array $data = []): array { return ['success' => true, 'data' => $data]; }
function fail(string $msg, int $code = 400): array { http_response_code($code); return ['success' => false, 'error' => $msg]; }
function get_setting(string $key, ?string $default = null): ?string {
    $st = db()->prepare("SELECT value FROM settings WHERE key=?");
    $st->execute([$key]);
    $v = $st->fetchColumn();
    return $v === false ? $default : (string)$v;
}
function set_setting(string $key, string $value): void {
    db()->prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value")
        ->execute([$key, $value]);
}
function require_post(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        echo json_encode(fail('POST required', 405));
        exit;
    }
}

// ----------------------- Myanmar digit & number -------------------------
function mm_to_en_digits(string $s): string {
    static $map = [
        '၀'=>'0','၁'=>'1','၂'=>'2','၃'=>'3','၄'=>'4','၅'=>'5','၆'=>'6','၇'=>'7','၈'=>'8','၉'=>'9',
        '०'=>'0','१'=>'1','२'=>'2','३'=>'3','४'=>'4','५'=>'5','६'=>'6','७'=>'7','८'=>'8','९'=>'9',
    ];
    return strtr($s, $map);
}
function en_to_mm_digits(string $s): string {
    static $map = ['0'=>'၀','1'=>'၁','2'=>'၂','3'=>'၃','4'=>'၄','5'=>'၅','6'=>'၆','7'=>'၇','8'=>'၈','9'=>'၉'];
    return strtr($s, $map);
}
function normalize_num(string $s): string {
    $s = mm_to_en_digits($s);
    $s = preg_replace('/[\s,]/u', '', $s) ?? '';
    $s = str_replace(['ကျပ်','MMK','mmk'], '', $s);
    return trim($s);
}

// ----------------------- Myanmar amount parser --------------------------
/**
 * Parse a user-entered amount string into an integer kyat.
 * Supports Arabic/Myanmar digits, commas, "10k/100k/1 lakh", and
 * Myanmar unit expressions like "၁သိန်းခွဲ", "၂သိန်း ၅ထောင်".
 */
function parse_my_amount(string $raw): ?int {
    $orig = trim($raw);
    if ($orig === '') return null;
    $work = mm_to_en_digits($orig);
    $work = str_replace(['ကျပ်','MMK','mmk'], '', $work);

    // If it contains any Myanmar unit token, skip the pure-digits shortcut
    $mmUnits = ['ကုဋေ','သန်း','သိန်း','သောင်း','ထောင်','ရာ','ခွဲ'];
    $hasMmUnit = false;
    foreach ($mmUnits as $u) { if (mb_strpos($work, $u) !== false) { $hasMmUnit = true; break; } }

    // k / lakh shortcuts (English)
    if (preg_match('/^(-?\d+(?:\.\d+)?)\s*k$/i', $work, $m)) {
        return (int)round(((float)$m[1]) * 1000);
    }
    if (preg_match('/^(-?\d+(?:\.\d+)?)\s*(?:lakh|la)$/i', $work, $m)) {
        return (int)round(((float)$m[1]) * 100000);
    }
    if (preg_match('/^(-?\d+(?:\.\d+)?)\s*(?:m|million)$/i', $work, $m)) {
        return (int)round(((float)$m[1]) * 1000000);
    }

    // Pure digits (with optional commas / Myanmar commas) — only if no Myanmar unit present
    if (!$hasMmUnit) {
        $digits = preg_replace('/[^\d.\-]/u', '', $work) ?? '';
        if ($digits !== '' && preg_match('/^-?\d+(?:\.\d+)?$/', $digits)) {
            return (int)round((float)$digits);
        }
    }

    if (!$hasMmUnit) return null;

    // Myanmar unit expression: combine tokens of <number><unit>
    $units = [
        'ကုဋေ' => 1000000000000,
        'သန်း'  => 1000000,
        'သိန်း' => 100000,
        'သောင်း'=> 10000,
        'ထောင်'=> 1000,
        'ရာ'   => 100,
    ];

    // Normalize separators: replace Myanmar comma ၊ and any spaces
    $norm = preg_replace('/[,\s၊]+/u', ' ', $work) ?? '';
    // Insert spaces around Myanmar units and ခွဲ so we can tokenize cleanly
    foreach (array_keys($units) as $u) {
        $norm = preg_replace('/' . preg_quote($u, '/') . '/u', ' ' . $u . ' ', $norm);
    }
    $norm = preg_replace('/ခွဲ/u', ' ခွဲ ', $norm);
    $norm = preg_replace('/\s+/u', ' ', $norm);
    $tokens = preg_split('/\s+/u', trim($norm)) ?: [];
    if (!$tokens) return null;

    $total = 0.0;
    $i = 0; $n = count($tokens);
    while ($i < $n) {
        $tok = $tokens[$i];
        if ($tok === '' || $tok === '-') { $i++; continue; }
        if (is_numeric($tok)) {
            $num = (float)$tok;
            $unit = null;
            if ($i + 1 < $n && isset($units[$tokens[$i+1]])) {
                $unit = $units[$tokens[$i+1]]; $i += 2;
            } else {
                $i++;
            }
            $half = ($i < $n && $tokens[$i] === 'ခွဲ');
            if ($half) { $i++; $total += $num * (float)$unit + (($unit ?: 1) * 0.5); }
            else { $total += $num * (float)$unit; }
        } elseif (isset($units[$tok])) {
            // bare unit like "သိန်းခွဲ"
            $unit = $units[$tok];
            $i++;
            $half = ($i < $n && $tokens[$i] === 'ခွဲ');
            if ($half) { $i++; $total += $unit + $unit * 0.5; }
            else { $total += $unit; }
        } else {
            $i++;
        }
    }
    return $total > 0 ? (int)round($total) : null;
}

// ----------------------- Myanmar amount formatter -----------------------
function format_money(int $n): string { return number_format($n); }
function format_money_mm(int $n): string { return en_to_mm_digits(number_format($n)); }

function format_mm_units(int $n, bool $withKyat = true): string {
    if ($n < 0) return '-' . format_mm_units(-$n, $withKyat);
    $suffix = $withKyat ? ' ကျပ်' : '';
    if ($n === 0) return '၀' . $suffix;
    $kyat  = $n % 1000; $n = (int)($n/1000);
    $thou  = $n % 100;  $n = (int)($n/100);
    $lakhs = $n % 100;  $n = (int)($n/100);
    $mil   = $n % 100;  $n = (int)($n/100);
    $bil   = $n;

    $parts = [];
    $push = function(string $numEn, string $unit) use (&$parts) {
        if ((int)$numEn > 0) $parts[] = en_to_mm_digits($numEn) . ($unit !== '' ? ' ' . $unit : '');
    };
    $push((string)$bil,   'ကုဋေ');
    $push((string)$mil,   'သန်း');
    if ((int)$lakhs > 0) {
        $l = (int)$lakhs; $t = (int)$thou; $k = (int)$kyat;
        if ($l >= 1 && $t === 50 && $k === 0) {
            $parts[] = en_to_mm_digits((string)$l) . ' သိန်းခွဲ';
        } else {
            $push((string)$l, 'သိန်း');
            $rem = $t * 1000 + $k;
            if ($rem >= 10000) { $push((string)intdiv($rem, 10000), 'သောင်း'); $rem = $rem % 10000; }
            if ($rem >= 1000)  { $push((string)intdiv($rem, 1000), 'ထောင်'); $rem = $rem % 1000; }
            // Express small remaining (<1000) as ရာ if possible
            if ($rem >= 100)   { $push((string)intdiv($rem, 100), 'ရာ'); $rem = $rem % 100; }
            if ($rem > 0) $push((string)$rem, '');
        }
    } else {
        $rem = (int)$thou * 1000 + (int)$kyat;
        if ($rem >= 10000) { $push((string)intdiv($rem, 10000), 'သောင်း'); $rem = $rem % 10000; }
        if ($rem >= 1000)  { $push((string)intdiv($rem, 1000), 'ထောင်'); $rem = $rem % 1000; }
        if ($rem >= 100)   { $push((string)intdiv($rem, 100), 'ရာ'); $rem = $rem % 100; }
        if ($rem > 0) $push((string)$rem, '');
    }
    $out = $parts ? implode(' ', $parts) : '၀';
    return $out . $suffix;
}
function format_mm_units_combined(int $n): string {
    return format_mm_units($n, true);
}

// ----------------------- API: settings ----------------------------------
function api_settings(): array {
    $pdo = db();
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
        require_auth();
        require_post();
        $in = json_in();
        $allowed = ['default_amount','currency','language','theme','display_mode','group_name'];
        $upd = $pdo->prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
        foreach ($allowed as $k) {
            if (array_key_exists($k, $in)) {
                $v = (string)$in[$k];
                if ($k === 'default_amount') {
                    $parsed = parse_my_amount($v);
                    if ($parsed === null || $parsed < 0) return fail('Invalid default amount');
                    $v = (string)$parsed;
                }
                $upd->execute([$k, $v]);
            }
        }
    }
    $rows = $pdo->query("SELECT key,value FROM settings")->fetchAll();
    $out = [];
    foreach ($rows as $r) {
        // Never expose the password hash to the browser
        if ($r['key'] === 'admin_password_hash') continue;
        $out[$r['key']] = $r['value'];
    }
    return ok($out);
}

// ----------------------- API: auth (login/logout/status/change) ---------
function api_login(): array {
    require_post();
    start_session_once();
    $ip = client_ip();
    if (too_many_attempts($ip)) {
        http_response_code(429);
        return ['success' => false, 'error' => 'Too many attempts. Please wait a few minutes.'];
    }
    $in = json_in();
    $pw = (string)($in['password'] ?? '');
    if ($pw === '') { record_attempt($ip, false); return fail('Password required'); }
    $hash = get_setting('admin_password_hash', '');
    if (!$hash || !password_verify($pw, $hash)) {
        record_attempt($ip, false);
        return fail('Invalid password');
    }
    record_attempt($ip, true);
    // Regenerate session ID to prevent fixation
    session_regenerate_id(true);
    $_SESSION['auth_ok'] = true;
    $_SESSION['auth_at'] = time();
    return ok(['auth' => true]);
}
function api_logout(): array {
    start_session_once();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
    return ok(['auth' => false]);
}
function api_auth_status(): array {
    return ok(['auth' => is_authed()]);
}
function api_change_password(): array {
    require_auth();
    require_post();
    $in = json_in();
    $cur = (string)($in['current'] ?? '');
    $new = (string)($in['new'] ?? '');
    if (strlen($new) < 6) return fail('New password must be at least 6 characters');
    $hash = get_setting('admin_password_hash', '');
    if (!$hash || !password_verify($cur, $hash)) return fail('Current password is incorrect');
    set_setting('admin_password_hash', password_hash($new, PASSWORD_BCRYPT));
    return ok(['changed' => true]);
}

// ----------------------- API: members -----------------------------------
function api_members(): array {
    $pdo = db();
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $action = sval('action', 'list');

    if ($method === 'POST' && $action === 'save') {
        require_auth();
        require_post();
        $in = json_in();
        $id   = isset($in['id']) ? (int)$in['id'] : 0;
        $name = trim((string)($in['name'] ?? ''));
        $amt  = $in['monthly_amount'] ?? null;
        $amt  = is_string($amt) ? (parse_my_amount($amt) ?? 0) : (int)$amt;
        $active = !empty($in['active']) ? 1 : 0;
        $note  = isset($in['note']) ? (string)$in['note'] : null;
        if ($name === '') return fail('Name required');
        if ($amt <= 0)    return fail('Monthly amount must be > 0');
        $t = now();
        if ($id > 0) {
            $pdo->prepare("UPDATE members SET name=?,monthly_amount=?,active=?,note=?,updated_at=? WHERE id=?")
                ->execute([$name,$amt,$active,$note,$t,$id]);
            return ok(['id'=>$id]);
        } else {
            $pdo->prepare("INSERT INTO members(name,active,monthly_amount,note,created_at,updated_at) VALUES(?,?,?,?,?,?)")
                ->execute([$name,$active,$amt,$note,$t,$t]);
            return ok(['id'=>(int)$pdo->lastInsertId()]);
        }
    }
    if ($method === 'POST' && $action === 'delete') {
        require_auth();
        require_post();
        $id = sint('id', 0);
        if ($id <= 0) return fail('Invalid id');
        $pdo->prepare("DELETE FROM members WHERE id=?")->execute([$id]);
        return ok(['id'=>$id]);
    }
    if ($method === 'POST' && $action === 'toggle') {
        require_auth();
        require_post();
        $id = sint('id', 0);
        $pdo->prepare("UPDATE members SET active = 1 - active, updated_at=? WHERE id=?")
            ->execute([now(),$id]);
        return ok();
    }

    // LIST
    $q = trim((string)sval('q', ''));
    $active = sval('active', null);
    $sort = sval('sort', 'name');
    $dir  = strtolower((string)sval('dir', 'asc')) === 'desc' ? 'DESC' : 'ASC';
    $allowedSort = ['id','name','monthly_amount','active','created_at'];
    if (!in_array($sort, $allowedSort, true)) $sort = 'name';

    $sql = "SELECT m.*,
        (SELECT COALESCE(SUM(amount),0) FROM payments p WHERE p.member_id=m.id AND p.paid=1) AS total_saved,
        (SELECT COUNT(*) FROM payments p WHERE p.member_id=m.id AND p.paid=1) AS paid_months
        FROM members m WHERE 1=1";
    $args = [];
    if ($q !== '') { $sql .= " AND m.name LIKE ?"; $args[] = '%' . str_replace(['%','_'], ['\%','\_'], $q) . '%'; }
    if ($active === '1' || $active === '0') { $sql .= " AND m.active=?"; $args[] = (int)$active; }
    $sql .= " ORDER BY m.$sort $dir, m.id ASC";
    $st = $pdo->prepare($sql);
    $st->execute($args);
    $rows = $st->fetchAll();
    return ok(['items' => $rows]);
}

function api_member(): array {
    $id = sint('id', 0);
    if ($id <= 0) return fail('Invalid id');
    $pdo = db();
    $m = $pdo->prepare("SELECT * FROM members WHERE id=?");
    $m->execute([$id]);
    $mem = $m->fetch();
    if (!$mem) return fail('Not found', 404);
    $pays = $pdo->prepare("SELECT * FROM payments WHERE member_id=? ORDER BY month DESC");
    $pays->execute([$id]);
    $payments = $pays->fetchAll();
    // Build complete month list (paid/unpaid) from earliest payment up to current month
    $months = [];
    $paidMap = [];
    foreach ($payments as $p) $paidMap[$p['month']] = $p;
    // Determine range
    $earliest = null;
    if ($payments) {
        $monthsAll = array_column($payments, 'month');
        sort($monthsAll);
        $earliest = $monthsAll[0];
    }
    $start = $earliest ?: gmdate('Y-m');
    $end = gmdate('Y-m');
    $cursor = $start;
    while (strcmp($cursor, $end) <= 0) {
        $months[] = $cursor;
        $cursor = date_add_month($cursor, 1);
    }
    $rows = [];
    $expected = (int)$mem['monthly_amount'];
    foreach ($months as $mo) {
        if (isset($paidMap[$mo])) {
            $p = $paidMap[$mo];
            $rows[] = [
                'month' => $mo, 'paid' => 1, 'amount' => (int)$p['amount'],
                'amount_input' => $p['amount_input'], 'paid_at' => $p['paid_at'], 'note' => $p['note'],
                'id' => (int)$p['id'], 'expected' => $expected,
            ];
        } else {
            $rows[] = ['month' => $mo, 'paid' => 0, 'amount' => 0, 'expected' => $expected];
        }
    }
    $totals = [
        'total_saved' => array_sum(array_map(fn($r)=>$r['paid']?$r['amount']:0, $rows)),
        'paid_months' => count(array_filter($rows, fn($r)=>$r['paid'])),
        'expected_months' => count($rows),
    ];
    $totals['unpaid_months'] = $totals['expected_months'] - $totals['paid_months'];
    $totals['avg'] = $totals['paid_months'] > 0 ? (int)round($totals['total_saved']/$totals['paid_months']) : 0;
    $totals['rate'] = $totals['expected_months'] > 0 ? round($totals['paid_months']*100/$totals['expected_months'], 2) : 0;
    return ok(['member' => $mem, 'months' => $rows, 'totals' => $totals]);
}

// ----------------------- API: payments ----------------------------------
function api_payments(): array {
    $pdo = db();
    $month = sval('month', null);
    $memberId = sint('member_id', 0);
    $status = sval('status', null); // paid|unpaid|all
    $sql = "SELECT p.*, m.name AS member_name, m.monthly_amount AS expected_amount
            FROM payments p JOIN members m ON m.id=p.member_id WHERE 1=1";
    $args = [];
    if ($month) { $sql .= " AND p.month=?"; $args[] = $month; }
    if ($memberId > 0) { $sql .= " AND p.member_id=?"; $args[] = $memberId; }
    if ($status === 'paid' || $status === 'unpaid') {
        $sql .= " AND p.paid=?"; $args[] = $status === 'paid' ? 1 : 0;
    }
    $sql .= " ORDER BY p.month DESC, m.id ASC";
    $st = $pdo->prepare($sql);
    $st->execute($args);
    return ok(['items' => $st->fetchAll()]);
}

function api_save_payment(): array {
    require_auth();
    require_post();
    $pdo = db();
    $in = json_in();
    $memberId = (int)($in['member_id'] ?? 0);
    $month    = (string)($in['month'] ?? '');
    $amountIn = (string)($in['amount'] ?? '');
    $paidAt   = (string)($in['paid_at'] ?? today());
    $note     = isset($in['note']) ? (string)$in['note'] : null;
    $forceUnpaid = !empty($in['unpaid']);
    $id       = isset($in['id']) ? (int)$in['id'] : 0;

    if ($memberId <= 0) return fail('member_id required');
    if (!preg_match('/^\d{4}-\d{2}$/', $month)) return fail('month must be YYYY-MM');

    $amount = parse_my_amount($amountIn);
    $isPaid = !$forceUnpaid && $amount !== null && $amount > 0;
    if (!$isPaid) $amount = $amount ?? 0;

    $t = now();
    $pdo->beginTransaction();
    try {
        $existing = null;
        if ($id > 0) {
            $st = $pdo->prepare("SELECT * FROM payments WHERE id=?");
            $st->execute([$id]);
            $existing = $st->fetch();
        }
        if (!$existing) {
            $st = $pdo->prepare("SELECT * FROM payments WHERE member_id=? AND month=?");
            $st->execute([$memberId, $month]);
            $existing = $st->fetch();
        }
        if ($existing) {
            $oldAmount = (int)$existing['amount']; $oldPaid = (int)$existing['paid'];
            if ($isPaid) {
                $pdo->prepare("UPDATE payments SET amount=?, amount_input=?, paid=1, paid_at=?, note=?, updated_at=? WHERE id=?")
                    ->execute([$amount, $amountIn, $paidAt, $note, $t, $existing['id']]);
            } else {
                $pdo->prepare("UPDATE payments SET amount=0, amount_input=?, paid=0, paid_at=NULL, note=?, updated_at=? WHERE id=?")
                    ->execute([$amountIn, $note, $t, $existing['id']]);
            }
            $pdo->prepare("INSERT INTO payment_history(payment_id,member_id,month,old_amount,new_amount,old_paid,new_paid,changed_at) VALUES(?,?,?,?,?,?,?,?)")
                ->execute([$existing['id'],$memberId,$month,$oldAmount,$isPaid?$amount:0,$oldPaid,$isPaid?1:0,$t]);
            $pdo->commit();
            return ok(['id'=>(int)$existing['id'], 'updated' => true]);
        } else {
            $pdo->prepare("INSERT INTO payments(member_id,month,amount,amount_input,paid,paid_at,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)")
                ->execute([$memberId, $month, $isPaid?$amount:0, $amountIn, $isPaid?1:0, $isPaid?$paidAt:null, $note, $t, $t]);
            $newId = (int)$pdo->lastInsertId();
            $pdo->prepare("INSERT INTO payment_history(payment_id,member_id,month,old_amount,new_amount,old_paid,new_paid,changed_at) VALUES(?,?,?,?,?,?,?,?)")
                ->execute([$newId,$memberId,$month,null,$isPaid?$amount:0,null,$isPaid?1:0,$t]);
            $pdo->commit();
            return ok(['id'=>$newId, 'created' => true]);
        }
    } catch (Throwable $e) {
        $pdo->rollBack();
        return fail('Save failed: ' . $e->getMessage(), 500);
    }
}

function api_delete_payment(): array {
    require_auth();
    require_post();
    $pdo = db();
    $in = json_in();
    $id = (int)($in['id'] ?? 0);
    if ($id <= 0) return fail('id required');
    $pdo->prepare("DELETE FROM payments WHERE id=?")->execute([$id]);
    return ok();
}

function api_bulk_pay(): array {
    require_auth();
    require_post();
    $pdo = db();
    $in = json_in();
    $month = (string)($in['month'] ?? '');
    $ids   = (array)($in['member_ids'] ?? []);
    $amountIn = (string)($in['amount'] ?? '');
    $paidAt = (string)($in['paid_at'] ?? today());
    if (!preg_match('/^\d{4}-\d{2}$/', $month)) return fail('month required');
    $parsed = null;
    if (trim($amountIn) !== '') {
        $parsed = parse_my_amount($amountIn);
        if ($parsed === null || $parsed <= 0) return fail('Valid amount required');
    }
    $t = now();
    $saved = 0;
    $pdo->beginTransaction();
    try {
        $sel = $pdo->prepare("SELECT id, monthly_amount FROM members WHERE id=?");
        $ins = $pdo->prepare("INSERT INTO payments(member_id,month,amount,amount_input,paid,paid_at,note,created_at,updated_at) VALUES(?,?,?,?,1,?,NULL,?,?)
            ON CONFLICT(member_id,month) DO UPDATE SET amount=excluded.amount, amount_input=excluded.amount_input, paid=1, paid_at=excluded.paid_at, updated_at=excluded.updated_at");
        $hist = $pdo->prepare("INSERT INTO payment_history(payment_id,member_id,month,old_amount,new_amount,old_paid,new_paid,changed_at) VALUES((SELECT id FROM payments WHERE member_id=? AND month=?),?,?,?,?,?,?,?)");
        foreach ($ids as $mid) {
            $mid = (int)$mid;
            $sel->execute([$mid]);
            $m = $sel->fetch();
            if (!$m) continue;
            $use = ($parsed === null) ? (int)$m['monthly_amount'] : $parsed;
            $old = $pdo->prepare("SELECT id,amount,paid FROM payments WHERE member_id=? AND month=?");
            $old->execute([$mid, $month]);
            $prev = $old->fetch();
            $ins->execute([$mid,$month,$use,$amountIn,$paidAt,$t,$t]);
            $hist->execute([$mid,$month,$mid,$month,$prev?$prev['amount']:null,$use,$prev?$prev['paid']:null,1,$t]);
            $saved++;
        }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        return fail('Bulk save failed', 500);
    }
    return ok(['saved'=>$saved]);
}

// ----------------------- API: dashboard / reports -----------------------
function api_dashboard(): array {
    $pdo = db();
    $month = sval('month', gmdate('Y-m'));
    $year  = sval('year',  (string)((int)gmdate('Y')));

    // members
    $totalMembers   = (int)$pdo->query("SELECT COUNT(*) FROM members")->fetchColumn();
    $activeMembers  = (int)$pdo->query("SELECT COUNT(*) FROM members WHERE active=1")->fetchColumn();
    $expectedActive = (int)$pdo->query("SELECT COALESCE(SUM(monthly_amount),0) FROM members WHERE active=1")->fetchColumn();
    $defaultAmount  = (int)(get_setting('default_amount', '10000') ?: 10000);

    // selected month aggregates
    $st = $pdo->prepare("SELECT COALESCE(SUM(amount),0) AS collected, COUNT(*) AS paid_cnt FROM payments WHERE month=? AND paid=1");
    $st->execute([$month]);
    $row = $st->fetch();
    $collected = (int)$row['collected'];
    $paidCnt   = (int)$row['paid_cnt'];

    // all-time totals
    $all = $pdo->query("SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt FROM payments WHERE paid=1")->fetch();
    $allTime = (int)$all['total'];

    // this year
    $yst = $pdo->prepare("SELECT COALESCE(SUM(amount),0) FROM payments WHERE paid=1 AND substr(month,1,4)=?");
    $yst->execute([$year]);
    $yearTotal = (int)$yst->fetchColumn();

    // monthly trend (group by month)
    $trend = $pdo->query("SELECT month, COALESCE(SUM(amount),0) AS collected, SUM(CASE WHEN paid=1 THEN 1 ELSE 0 END) AS paid_cnt, COUNT(*) AS total_cnt FROM payments GROUP BY month ORDER BY month ASC")->fetchAll();
    $expectedPerMonth = $expectedActive; // for months with no data, expected is 0 (we'll handle in JS)
    foreach ($trend as &$t) {
        $t['collected'] = (int)$t['collected'];
        $t['paid_cnt']  = (int)$t['paid_cnt'];
        $t['total_cnt'] = (int)$t['total_cnt'];
    }
    unset($t);

    // paid/unpaid for selected month
    $paid   = $paidCnt;
    $unpaid = max(0, $activeMembers - $paid);
    $expected = $expectedActive;
    $remaining = max(0, $expected - $collected);
    $surplus   = $collected > $expected ? $collected - $expected : 0;
    $rate      = $expected > 0 ? round(min($collected,$expected)*10000/$expected)/100 : 0;

    // top contributors
    $top = $pdo->query("SELECT m.id, m.name, COALESCE(SUM(p.amount),0) AS total,
        COUNT(p.id) AS paid_months
        FROM members m LEFT JOIN payments p ON p.member_id=m.id AND p.paid=1
        GROUP BY m.id ORDER BY total DESC, m.name ASC LIMIT 10")->fetchAll();
    foreach ($top as &$t) { $t['total'] = (int)$t['total']; $t['paid_months'] = (int)$t['paid_months']; }
    unset($t);

    // member status current month
    $pdo->prepare("SELECT id, name, monthly_amount FROM members WHERE active=1 ORDER BY id ASC");
    $memberStatus = [];
    $ms = $pdo->prepare("
        SELECT m.id, m.name, m.monthly_amount,
        (SELECT amount FROM payments p WHERE p.member_id=m.id AND p.month=?) AS amt,
        (SELECT paid FROM payments p WHERE p.member_id=m.id AND p.month=?) AS paid
        FROM members m WHERE m.active=1 ORDER BY m.id ASC");
    $ms->execute([$month, $month]);
    foreach ($ms->fetchAll() as $r) {
        $memberStatus[] = [
            'id' => (int)$r['id'],
            'name' => $r['name'],
            'expected' => (int)$r['monthly_amount'],
            'paid' => (int)($r['paid'] ?? 0) === 1,
            'amount' => (int)($r['amt'] ?? 0),
        ];
    }

    return ok([
        'month' => $month,
        'year'  => (int)$year,
        'default_amount' => $defaultAmount,
        'members' => [
            'total' => $totalMembers,
            'active' => $activeMembers,
            'expected' => $expectedActive,
        ],
        'current' => [
            'expected' => $expected,
            'collected' => $collected,
            'remaining' => $remaining,
            'surplus' => $surplus,
            'paid' => $paid,
            'unpaid' => $unpaid,
            'rate' => $rate,
        ],
        'all_time' => $allTime,
        'year_total' => $yearTotal,
        'trend' => $trend,
        'top' => $top,
        'member_status' => $memberStatus,
    ]);
}

function api_reports(): array {
    $pdo = db();
    $type = sval('type', 'all_month');
    if ($type === 'all_month') {
        // For each month present: expected = sum of active members * target; collected = sum(amount)
        $rows = $pdo->query("SELECT month, COUNT(*) AS paid_cnt, COALESCE(SUM(amount),0) AS collected FROM payments WHERE paid=1 GROUP BY month ORDER BY month ASC")->fetchAll();
        $activeExpected = (int)$pdo->query("SELECT COALESCE(SUM(monthly_amount),0) FROM members WHERE active=1")->fetchColumn();
        $out = [];
        foreach ($rows as $r) {
            $expected = $activeExpected;
            $collected = (int)$r['collected'];
            $remaining = max(0, $expected - $collected);
            $surplus   = $collected > $expected ? $collected - $expected : 0;
            $rate = $expected > 0 ? round(min($collected,$expected)*10000/$expected)/100 : 0;
            $out[] = [
                'month' => $r['month'],
                'expected' => $expected,
                'collected' => $collected,
                'remaining' => $remaining,
                'surplus' => $surplus,
                'paid' => (int)$r['paid_cnt'],
                'unpaid' => max(0, (int)$pdo->query("SELECT COUNT(*) FROM members WHERE active=1")->fetchColumn() - (int)$r['paid_cnt']),
                'rate' => $rate,
            ];
        }
        return ok(['rows' => $out]);
    }
    if ($type === 'yearly') {
        $rows = $pdo->query("SELECT substr(month,1,4) AS year, COALESCE(SUM(amount),0) AS collected, COUNT(*) AS paid_cnt FROM payments WHERE paid=1 GROUP BY year ORDER BY year ASC")->fetchAll();
        $out = [];
        foreach ($rows as $r) {
            $out[] = ['year' => $r['year'], 'collected' => (int)$r['collected'], 'paid' => (int)$r['paid_cnt']];
        }
        return ok(['rows' => $out]);
    }
    if ($type === 'member') {
        $rows = $pdo->query("SELECT m.id, m.name, m.monthly_amount,
            COALESCE((SELECT SUM(amount) FROM payments p WHERE p.member_id=m.id AND p.paid=1),0) AS total,
            (SELECT COUNT(*) FROM payments p WHERE p.member_id=m.id AND p.paid=1) AS paid
            FROM members m ORDER BY m.name ASC")->fetchAll();
        $out = [];
        foreach ($rows as $r) {
            $paid = (int)$r['paid'];
            $avg = $paid > 0 ? (int)round((int)$r['total']/$paid) : 0;
            $out[] = [
                'id' => (int)$r['id'],
                'name' => $r['name'],
                'total' => (int)$r['total'],
                'paid_months' => $paid,
                'avg' => $avg,
                'rate' => 0,
            ];
        }
        return ok(['rows' => $out]);
    }
    return fail('Unknown report type');
}

// ----------------------- API: search ------------------------------------
function api_search(): array {
    $pdo = db();
    $q = trim((string)sval('q', ''));
    if ($q === '') return ok(['members'=>[], 'payments'=>[]]);
    $like = '%' . str_replace(['%','_'], ['\%','\_'], $q) . '%';
    $m = $pdo->prepare("SELECT id,name,monthly_amount,active FROM members WHERE name LIKE ? ORDER BY name LIMIT 20");
    $m->execute([$like]);
    $p = $pdo->prepare("SELECT p.*, m.name AS member_name FROM payments p JOIN members m ON m.id=p.member_id WHERE p.note LIKE ? OR p.amount_input LIKE ? OR m.name LIKE ? ORDER BY p.month DESC LIMIT 50");
    $p->execute([$like, $like, $like]);
    return ok(['members' => $m->fetchAll(), 'payments' => $p->fetchAll()]);
}

// ----------------------- API: backup/restore ---------------------------
function api_export(): array {
    require_auth();
    $pdo = db();
    $fmt = sval('format', 'json');
    if ($fmt === 'csv') {
        $rows = $pdo->query("SELECT p.id,p.member_id,m.name AS member_name,p.month,p.amount,p.amount_input,p.paid,p.paid_at,p.note,p.created_at,p.updated_at FROM payments p JOIN members m ON m.id=p.member_id ORDER BY p.month DESC, m.id")->fetchAll();
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=payments-' . gmdate('Y-m-d') . '.csv');
        $out = fopen('php://output', 'w');
        fputcsv($out, ['id','member_id','member_name','month','amount','amount_input','paid','paid_at','note','created_at','updated_at']);
        foreach ($rows as $r) fputcsv($out, $r);
        exit;
    }
    if ($fmt === 'sqlite') {
        if (!is_dir($GLOBALS['BACKUP_DIR'])) @mkdir($GLOBALS['BACKUP_DIR'], 0775, true);
        $dest = $GLOBALS['BACKUP_DIR'] . '/savings-backup-' . gmdate('Y-m-d') . '.sqlite';
        // Safely copy via SQLite backup API
        $pdo->exec('VACUUM INTO ' . $pdo->quote($dest));
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename=' . basename($dest));
        readfile($dest);
        exit;
    }
    $payload = [
        'version' => 1,
        'exported_at' => now(),
        'settings' => $pdo->query("SELECT * FROM settings")->fetchAll(),
        'members'  => $pdo->query("SELECT * FROM members")->fetchAll(),
        'payments' => $pdo->query("SELECT * FROM payments")->fetchAll(),
    ];
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename=savings-backup-' . gmdate('Y-m-d') . '.json');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function api_import(): array {
    require_auth();
    require_post();
    if (empty($_FILES['file']['tmp_name'])) {
        $in = json_in();
        $json = (string)($in['data'] ?? '');
    } else {
        $json = file_get_contents($_FILES['file']['tmp_name']) ?: '';
    }
    $data = json_decode($json, true);
    if (!is_array($data)) return fail('Invalid JSON');
    $mode = sval('mode', 'merge'); // merge|replace
    $pdo = db();
    $pdo->beginTransaction();
    try {
        if ($mode === 'replace') {
            $pdo->exec("DELETE FROM payments; DELETE FROM members; DELETE FROM settings;");
        }
        if (!empty($data['settings']) && is_array($data['settings'])) {
            $u = $pdo->prepare("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value");
            foreach ($data['settings'] as $k => $v) {
                if (is_array($v) && isset($v['key'],$v['value'])) { $k = $v['key']; $v = $v['value']; }
                $u->execute([(string)$k, (string)$v]);
            }
        }
        if (!empty($data['members']) && is_array($data['members'])) {
            $ins = $pdo->prepare("INSERT INTO members(id,name,active,monthly_amount,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?)
                ON CONFLICT(id) DO UPDATE SET name=excluded.name, active=excluded.active, monthly_amount=excluded.monthly_amount, note=excluded.note, updated_at=excluded.updated_at");
            foreach ($data['members'] as $m) {
                $ins->execute([
                    (int)$m['id'], (string)$m['name'], (int)($m['active'] ?? 1),
                    (int)($m['monthly_amount'] ?? 10000), $m['note'] ?? null,
                    $m['created_at'] ?? now(), $m['updated_at'] ?? now(),
                ]);
            }
        }
        if (!empty($data['payments']) && is_array($data['payments'])) {
            $ins = $pdo->prepare("INSERT INTO payments(id,member_id,month,amount,amount_input,paid,paid_at,note,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(member_id,month) DO UPDATE SET amount=excluded.amount, amount_input=excluded.amount_input, paid=excluded.paid, paid_at=excluded.paid_at, note=excluded.note, updated_at=excluded.updated_at");
            foreach ($data['payments'] as $p) {
                $ins->execute([
                    (int)$p['id'], (int)$p['member_id'], (string)$p['month'],
                    (int)$p['amount'], $p['amount_input'] ?? null,
                    (int)($p['paid'] ?? 1), $p['paid_at'] ?? null, $p['note'] ?? null,
                    $p['created_at'] ?? now(), $p['updated_at'] ?? now(),
                ]);
            }
        }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        return fail('Import failed: ' . $e->getMessage(), 500);
    }
    return ok();
}

// ----------------------- API: parser test (optional) -------------------
function api_parse(): array {
    $v = (string)sval('value', '');
    $p = parse_my_amount($v);
    return ok(['value' => $v, 'amount' => $p]);
}

// ----------------------- Util: month math -------------------------------
function date_add_month(string $yyyymm, int $delta): string {
    $y = (int)substr($yyyymm, 0, 4); $m = (int)substr($yyyymm, 5, 2);
    $m += $delta; while ($m < 1) { $m += 12; $y--; } while ($m > 12) { $m -= 12; $y++; }
    return sprintf('%04d-%02d', $y, $m);
}

// ----------------------------- Render UI --------------------------------
// First request warms DB so file gets created if missing.
db();
$groupName = get_setting('group_name', 'Monthly Savings') ?: 'Monthly Savings';
$defaultLang = get_setting('language', 'mm') ?: 'mm';
$defaultTheme = get_setting('theme', 'system') ?: 'system';
$defaultMode  = get_setting('display_mode', 'both') ?: 'both';
?><!doctype html>
<html lang="<?php echo h($defaultLang); ?>" data-theme="<?php echo h($defaultTheme); ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title><?php echo h($groupName); ?> — Monthly Savings</title>
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#0b1220">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%23123b8a'/><text x='50%25' y='58%25' font-size='38' text-anchor='middle' fill='%23ffd166' font-family='Arial'>က</text></svg>">
<link rel="stylesheet" href="?asset=css&amp;v=2">
</head>
<body>
<div id="app" class="app">
  <div class="sidebar-backdrop" id="sidebar-backdrop" hidden></div>
  <aside class="sidebar" id="sidebar">
    <div class="brand">
      <div class="brand-mark">က</div>
      <div class="brand-text">
        <div class="brand-title" data-i18n="app.title">Monthly Savings</div>
        <div class="brand-sub" data-i18n="app.subtitle">Group savings manager</div>
      </div>
    </div>
    <nav class="nav">
      <a href="#/dashboard"  class="nav-item" data-route="dashboard"><span class="nav-ico">▦</span><span data-i18n="nav.dashboard">Dashboard</span></a>
      <a href="#/monthly"    class="nav-item" data-route="monthly"><span class="nav-ico">▤</span><span data-i18n="nav.monthly">Monthly</span></a>
      <a href="#/members"    class="nav-item" data-route="members"><span class="nav-ico">◉</span><span data-i18n="nav.members">Members</span></a>
      <a href="#/reports"    class="nav-item" data-route="reports"><span class="nav-ico">▣</span><span data-i18n="nav.reports">Reports</span></a>
      <a href="#/calendar"   class="nav-item" data-route="calendar"><span class="nav-ico">▦</span><span data-i18n="nav.calendar">Calendar</span></a>
      <a href="#/backup"     class="nav-item" data-route="backup"><span class="nav-ico">◈</span><span data-i18n="nav.backup">Backup</span></a>
      <a href="#/settings"   class="nav-item" data-route="settings"><span class="nav-ico">⚙</span><span data-i18n="nav.settings">Settings</span></a>
    </nav>
    <div class="sidebar-foot">
      <button class="ghost-btn" id="lang-toggle" type="button">EN / မြန်</button>
      <button class="ghost-btn" id="theme-toggle" type="button" title="Theme">◐</button>
    </div>
  </aside>

  <div class="main">
    <header class="topbar">
      <button class="icon-btn" id="sidebar-toggle" type="button" aria-label="Menu">☰</button>
      <div class="page-title" id="page-title">Dashboard</div>
      <div class="topbar-tools">
        <div class="search-wrap">
          <input id="global-search" type="search" placeholder="Search…" autocomplete="off">
          <div class="search-results" id="search-results" hidden></div>
        </div>
        <select id="month-picker" class="select" aria-label="Month"></select>
        <select id="year-picker" class="select" aria-label="Year"></select>
        <button class="primary-btn admin-only" id="quick-pay" type="button" data-i18n="action.quick_pay">+ Quick Pay</button>
        <button class="primary-btn" id="auth-btn" type="button" data-i18n="login.submit">Sign in</button>
      </div>
    </header>

    <main class="content" id="content"></main>

    <nav class="bottom-nav" id="bottom-nav">
      <a href="#/dashboard" data-route="dashboard">▦<span data-i18n="nav.dashboard">Dashboard</span></a>
      <a href="#/monthly"   data-route="monthly">▤<span data-i18n="nav.monthly">Monthly</span></a>
      <a href="#/members"   data-route="members">◉<span data-i18n="nav.members">Members</span></a>
      <a href="#/reports"   data-route="reports">▣<span data-i18n="nav.reports">Reports</span></a>
      <a href="#/settings"  data-route="settings">⚙<span data-i18n="nav.settings">Settings</span></a>
    </nav>
  </div>
</div>

<!-- Modal & Toast containers -->
<div id="modal-root"></div>
<div id="toast-root" class="toast-root"></div>

<!-- Login overlay (shown when not authed; has Continue as Guest option) -->
<div id="login-screen" class="login-screen" hidden>
  <div class="login-card">
    <div class="login-brand">
      <div class="brand-mark" style="width:56px;height:56px;font-size:26px">က</div>
      <div>
        <div class="login-title"><?php echo h($groupName); ?></div>
        <div class="login-sub" data-i18n="login.subtitle">Admin sign-in</div>
      </div>
    </div>
    <form id="login-form" autocomplete="off">
      <label class="field"><span data-i18n="login.password">Admin password</span>
        <input type="password" name="password" autofocus>
      </label>
      <div class="login-error" id="login-error" hidden></div>
      <button class="primary-btn" type="submit" data-i18n="login.submit">Sign in</button>
    </form>
    <button class="ghost-btn login-guest" id="guest-btn" type="button" data-i18n="login.guest">Continue as Guest</button>
    <div class="login-hint muted" data-i18n="login.hint">Default: admin123 — change it in Settings.</div>
  </div>
</div>

<!-- Templates -->
<template id="tpl-payment-modal">
  <form class="modal-card">
    <header class="modal-head">
      <h3 data-i18n="payment.title">Record Payment</h3>
      <button type="button" class="icon-btn modal-close" data-close>✕</button>
    </header>
    <div class="modal-body">
      <div class="grid-2">
        <label class="field"><span data-i18n="field.member">Member</span>
          <select name="member_id" required></select></label>
        <label class="field"><span data-i18n="field.month">Month</span>
          <input name="month" type="month" required></label>
      </div>
      <label class="field"><span data-i18n="field.amount">Amount</span>
        <input name="amount" type="text" inputmode="text" autocomplete="off" placeholder="၁သောင်း / 10,000 / 10k" required>
        <div class="amount-preview" data-amount-preview></div>
      </label>
      <div class="grid-2">
        <label class="field"><span data-i18n="field.paid_at">Payment Date</span>
          <input name="paid_at" type="date" required></label>
        <label class="field"><span data-i18n="field.note">Note</span>
          <input name="note" type="text" maxlength="200"></label>
      </div>
    </div>
    <footer class="modal-foot">
      <button type="button" class="ghost-btn" data-close data-i18n="action.cancel">Cancel</button>
      <button type="submit" class="primary-btn" data-i18n="action.save">Save</button>
    </footer>
  </form>
</template>

<template id="tpl-member-modal">
  <form class="modal-card">
    <header class="modal-head">
      <h3 data-i18n="member.title">Member</h3>
      <button type="button" class="icon-btn modal-close" data-close>✕</button>
    </header>
    <div class="modal-body">
      <div class="grid-2">
        <label class="field"><span data-i18n="field.name">Name</span>
          <input name="name" type="text" required maxlength="80"></label>
        <label class="field"><span data-i18n="field.monthly_amount">Monthly Amount</span>
          <input name="monthly_amount" type="text" inputmode="text" required>
          <div class="amount-preview" data-amount-preview></div>
        </label>
      </div>
      <label class="field"><span data-i18n="field.note">Note</span>
        <input name="note" type="text" maxlength="200"></label>
      <label class="checkbox"><input type="checkbox" name="active" checked> <span data-i18n="field.active">Active</span></label>
    </div>
    <footer class="modal-foot">
      <button type="button" class="ghost-btn" data-close data-i18n="action.cancel">Cancel</button>
      <button type="submit" class="primary-btn" data-i18n="action.save">Save</button>
    </footer>
  </form>
</template>

<template id="tpl-bulk-modal">
  <form class="modal-card">
    <header class="modal-head">
      <h3 data-i18n="bulk.title">Bulk Pay</h3>
      <button type="button" class="icon-btn modal-close" data-close>✕</button>
    </header>
    <div class="modal-body">
      <div class="grid-2">
        <label class="field"><span data-i18n="field.month">Month</span>
          <input name="month" type="month" required></label>
        <label class="field"><span data-i18n="field.paid_at">Payment Date</span>
          <input name="paid_at" type="date" required></label>
      </div>
      <label class="field"><span data-i18n="bulk.amount_label">Amount (leave blank to use each member's monthly target)</span>
        <input name="amount" type="text" inputmode="text" placeholder="optional">
        <div class="amount-preview" data-amount-preview></div>
      </label>
      <div class="bulk-list" data-bulk-list></div>
    </div>
    <footer class="modal-foot">
      <span class="muted" data-bulk-summary></span>
      <button type="button" class="ghost-btn" data-close data-i18n="action.cancel">Cancel</button>
      <button type="submit" class="primary-btn" data-i18n="bulk.confirm">Mark Selected Paid</button>
    </footer>
  </form>
</template>

<template id="tpl-confirm-modal">
  <div class="modal-card">
    <header class="modal-head"><h3 data-i18n="confirm.title">Confirm</h3><button type="button" class="icon-btn" data-close>✕</button></header>
    <div class="modal-body"><p data-confirm-msg></p></div>
    <footer class="modal-foot">
      <button type="button" class="ghost-btn" data-close data-i18n="action.cancel">Cancel</button>
      <button type="button" class="primary-btn" data-confirm-ok data-i18n="action.confirm">Confirm</button>
    </footer>
  </div>
</template>

<script>window.__APP__ = {
  groupName: <?php echo json_encode($groupName); ?>,
  defaultLang: <?php echo json_encode($defaultLang); ?>,
  defaultTheme: <?php echo json_encode($defaultTheme); ?>,
  defaultMode: <?php echo json_encode($defaultMode); ?>,
};</script>
<script src="?asset=js&amp;v=2"></script>
</body>
</html>
