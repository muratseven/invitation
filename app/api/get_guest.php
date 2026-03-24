<?php
include "config.php";

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || empty($data['token']) || empty($data['slug'])) {
    echo json_encode([
        'success' => false,
        'error'   => 'Missing token or slug',
    ]);
    exit;
}

$tokenInput = trim($data['token']);
$slugInput  = trim($data['slug']);

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

        e.id          AS event_pk,
        e.event_slug,
        e.event_name
        FROM guests g
        JOIN tokens t ON g.token_id = t.id
        JOIN events e ON g.event_id = e.id
        WHERE t.token = ?
          AND g.guest_slug = ?
          AND t.isActive = 1
    LIMIT 1
");
$stmt->bind_param("ss", $tokenInput, $slugInput);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'Guest not found',
    ]);
    exit;
}

$row = $res->fetch_assoc();

echo json_encode([
    'success' => true,
    'guest'   => [
        'id'          => (int)$row['guest_id'],
        'guest_name'  => $row['guest_name'],
        'guest_slug'  => $row['guest_slug'],
        'event_id'    => (int)$row['event_id'],
        'token_id'    => (int)$row['token_id'],
        'rsvp_status' => $row['rsvp_status'],
        'visit_count' => (int)$row['visit_count'],
        'created_at'  => $row['created_at'],
    ],
    'event'   => [
        'id'         => (int)$row['event_pk'],
        'event_slug' => $row['event_slug'],
        'event_name' => $row['event_name'],
    ],
    'token'   => [
        'id'     => (int)$row['token_pk'],
        'token'  => $row['token_value'],
    ],
]);
