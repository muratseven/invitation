<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

include "config.php";

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || empty($data['token'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Missing token',
    ]);
    exit;
}

$tokenInput = trim($data['token']);

// Token'ı bul
$stmt = $conn->prepare("
    SELECT id, maxGuests, usedGuests
    FROM tokens
    WHERE token = ? AND isActive = 1
    LIMIT 1
");
$stmt->bind_param("s", $tokenInput);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid token',
    ]);
    exit;
}

$tokenRow   = $res->fetch_assoc();
$tokenId    = (int)$tokenRow['id'];
$maxGuests  = (int)$tokenRow['maxGuests'];

$stmtGuests = $conn->prepare("
    SELECT id, event_id, token_id, guest_name, guest_slug, created_at, rsvp_status, visit_count
    FROM guests
    WHERE token_id = ?
    ORDER BY id ASC
");
$stmtGuests->bind_param("i", $tokenId);
$stmtGuests->execute();
$guestsRes = $stmtGuests->get_result();

$linkBase = "http://localhost:3000";

$guests = [];
while ($row = $guestsRes->fetch_assoc()) {
    $guests[] = [
        'id'          => (int)$row['id'],
        'event_id'    => (int)$row['event_id'],
        'token_id'    => (int)$row['token_id'],
        'guest_name'  => $row['guest_name'],
        'guest_slug'  => $row['guest_slug'],
        'created_at'  => $row['created_at'],
        'rsvp_status' => $row['rsvp_status'],
        'visit_count' => (int)$row['visit_count'],
        'link'        => $linkBase
                         . "/invite/" . urlencode($row['guest_slug'])
                         . "?token=" . urlencode($tokenInput),
    ];
}

// Bu token'a ait gerçek guest sayısı
$usedGuests = count($guests);

echo json_encode([
    'success'    => true,
    'maxGuests'  => $maxGuests,
    'usedGuests' => $usedGuests,
    'guests'     => $guests,
]);
