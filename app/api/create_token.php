<?php
// backend/api/create_token.php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

include "config.php";

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid JSON body',
    ]);
    exit;
}

$maxGuests = isset($data['maxGuests']) ? (int)$data['maxGuests'] : 0;
$plan      = isset($data['plan']) ? trim($data['plan']) : null;
$days      = isset($data['validDays']) ? (int)$data['validDays'] : 365;

if ($maxGuests <= 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'maxGuests must be > 0',
    ]);
    exit;
}

// Token üret
$random = strtoupper(substr(md5(uniqid('', true)), 0, 6));
$token  = "INV-{$maxGuests}-{$random}";

// expiresAt
$expiresAt = (new DateTime("+{$days} days"))->format('Y-m-d H:i:s');

$stmt = $conn->prepare("
    INSERT INTO tokens (token, plan, maxGuests, expiresAt, isActive, created_at)
    VALUES (?, ?, ?, ?, 1, NOW())
");
if (!$stmt) {
    echo json_encode([
        'success' => false,
        'error'   => 'DB error: ' . $conn->error,
    ]);
    exit;
}

$stmt->bind_param(
    "ssis",
    $token,
    $plan,
    $maxGuests,
    $expiresAt
);

if (!$stmt->execute()) {
    echo json_encode([
        'success' => false,
        'error'   => 'Insert failed: ' . $stmt->error,
    ]);
    exit;
}

echo json_encode([
    'success'   => true,
    'token'     => $token,
    'plan'      => $plan,
    'maxGuests' => $maxGuests,
    'expiresAt' => $expiresAt,
]);
