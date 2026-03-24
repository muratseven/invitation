<?php
// backend/api/get_invite_data.php

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

function respond($payload, $status = 200) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || empty($data['token']) || empty($data['slug'])) {
    respond([
        'success' => false,
        'error'   => 'Missing token or slug',
    ], 400);
}

$tokenInput = trim($data['token']);
$slugInput  = trim($data['slug']);

// Davetliyi + token + event'i çek
$stmt = $conn->prepare("
    SELECT
        g.id          AS guest_id,
        g.guest_name,
        g.guest_slug,
        g.event_id,
        g.token_id,
        g.rsvp_status,
        g.visit_count,
        g.created_at,

        t.id          AS token_pk,
        t.token       AS token_value,
        t.eventId     AS token_event_id,
        t.isActive    AS token_is_active,

        e.id          AS event_pk,
        e.event_slug,
        e.event_name,
        e.bride_name,
        e.groom_name,
        e.date_raw,
        e.time,
        e.location_text,
        e.maps_url,
        e.settings_json
        FROM guests g
        JOIN tokens t ON g.token_id = t.id
        JOIN events e ON g.event_id = e.id
        WHERE t.token = ?
          AND g.guest_slug = ?
          AND t.isActive = 1
        LIMIT 1
");
if (!$stmt) {
    respond([
        'success' => false,
        'error'   => 'DB error (prepare)',
        'details' => $conn->error,
    ], 500);
}

$stmt->bind_param("ss", $tokenInput, $slugInput);

if (!$stmt->execute()) {
    respond([
        'success' => false,
        'error'   => 'DB error (execute)',
        'details' => $stmt->error,
    ], 500);
}

$res = $stmt->get_result();
if (!$res) {
    respond([
        'success' => false,
        'error'   => 'DB error (get_result)',
        'details' => $conn->error,
    ], 500);
}

if ($res->num_rows === 0) {
    respond([
        'success' => false,
        'error'   => 'Guest not found',
    ], 404);
}

$row = $res->fetch_assoc();

// settings_json'u decode et
$rawSettings = $row['settings_json'] ?? '{}';
$settings = json_decode($rawSettings, true);
if (!is_array($settings)) {
    $settings = [];
}

// FRONTEND KONTRATI
$out = [
    'brideName'    => $row['bride_name']    ?? null,
    'groomName'    => $row['groom_name']    ?? null,
    'dateRaw'      => $row['date_raw']      ?? '',
    'time'         => $row['time']          ?? '',
    'locationText' => $row['location_text'] ?? '',
    'mapsUrl'      => $row['maps_url']      ?? '',
    'guestName'    => $row['guest_name']    ?? null,
    'settings'     => $settings,
];

respond([
    'success' => true,
    'data'    => $out,
]);
