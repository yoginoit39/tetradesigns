<?php
require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

function respond(bool $success, string $message): void {
    http_response_code($success ? 200 : 400);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed');
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    respond(false, 'Form is not configured yet');
}
$config = require $configPath;

// Cap request body size — real enquiries are small, bots dump megabytes
$raw = file_get_contents('php://input', false, null, 0, 20000);
if (strlen($raw) >= 20000) {
    respond(false, 'Message too large');
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    respond(false, 'Invalid request');
}

// Honeypot: hidden field bots fill in, humans never see
if (!empty($data['website'])) {
    respond(true, 'Message sent'); // silently drop, pretend success
}

// Rate limit per IP — min gap between sends + hourly cap.
// File-based counter in the system temp dir, no DB needed.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rlFile = sys_get_temp_dir() . '/tetra_contact_' . md5($ip) . '.json';
$now = time();
$minGap = 30;       // seconds between two submissions
$maxPerHour = 5;    // submissions allowed per rolling hour
$hits = [];
if (is_readable($rlFile)) {
    $decoded = json_decode((string)file_get_contents($rlFile), true);
    if (is_array($decoded)) {
        // keep only timestamps within the last hour
        $hits = array_filter($decoded, fn($t) => is_int($t) && $t > $now - 3600);
    }
}
if ($hits && ($now - max($hits)) < $minGap) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Please wait a moment before sending again']);
    exit;
}
if (count($hits) >= $maxPerHour) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many messages. Please try again later.']);
    exit;
}
$hits[] = $now;
@file_put_contents($rlFile, json_encode(array_values($hits)), LOCK_EX);

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$projectType = trim((string)($data['projectType'] ?? ''));
$message = trim((string)($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
    respond(false, 'Please fill in all required fields');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please provide a valid email address');
}

// Per-field length caps — block oversized junk
if (mb_strlen($name) > 120 || mb_strlen($email) > 200 ||
    mb_strlen($phone) > 40 || mb_strlen($projectType) > 80 ||
    mb_strlen($message) > 5000) {
    respond(false, 'One or more fields are too long');
}

// Header-injection guard: CR/LF in name or email means someone is
// trying to smuggle extra mail headers through Reply-To. Reject.
if (preg_match('/[\r\n]/', $name . $email)) {
    respond(false, 'Invalid characters in submission');
}

// Link flood: legit enquiries rarely carry many URLs; spam does.
if (preg_match_all('#https?://#i', $message) > 4) {
    respond(false, 'Message flagged as spam');
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = 'New enquiry from ' . $name;
    $mail->Body =
        "Name: {$name}\n" .
        "Email: {$email}\n" .
        "Phone: {$phone}\n" .
        "Project Type: {$projectType}\n\n" .
        "Message:\n{$message}\n";

    $mail->send();
    respond(true, 'Message sent');
} catch (Exception $e) {
    respond(false, 'Message could not be sent, please try again later');
}
