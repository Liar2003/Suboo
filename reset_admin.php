<?php
/**
 * Reset admin password to "admin123".
 * Usage:
 *   php reset_admin.php                          -> resets to admin123
 *   php reset_admin.php <new-password>           -> resets to given password
 *
 * Reads DB path from the same SQLite file the app uses (./savings.sqlite).
 */
declare(strict_types=1);

$dbPath = __DIR__ . '/savings.sqlite';
if (!is_file($dbPath)) {
    fwrite(STDERR, "DB not found at $dbPath\n");
    exit(1);
}

$newPw = $argv[1] ?? 'admin123';
if (strlen($newPw) < 6) {
    fwrite(STDERR, "Password must be at least 6 characters.\n");
    exit(1);
}

try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $hash = password_hash($newPw, PASSWORD_BCRYPT);

    $pdo->prepare("INSERT OR REPLACE INTO settings(key,value) VALUES('admin_password_hash', ?)")
        ->execute([$hash]);

    // Also clear failed-login attempts so the IP isn't locked out
    $pdo->exec("DELETE FROM login_attempts");

    echo "Admin password reset to: $newPw\n";
    echo "Hash written to settings.admin_password_hash\n";
    echo "login_attempts cleared\n";
} catch (Throwable $e) {
    fwrite(STDERR, "Error: " . $e->getMessage() . "\n");
    exit(1);
}