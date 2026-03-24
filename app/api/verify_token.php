<?php
// /backend/api/verify_token.php
include "config.php";

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    echo json_encode(["success" => true]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || empty($data["token"])) {
    echo json_encode([
        "success" => false,
        "valid"   => false,
        "message" => "Token gerekli.",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$token = trim($data["token"]);

$stmt = $conn->prepare("
    SELECT id, plan, maxGuests, usedGuests, expiresAt, eventId, isActive
    FROM tokens
    WHERE token = ?
    LIMIT 1
");
$stmt->bind_param("s", $token);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "valid"   => false,
        "message" => "Token bulunamadı.",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$row = $res->fetch_assoc();

// aktif mi?
if ((int)$row["isActive"] !== 1) {
    echo json_encode([
        "success" => false,
        "valid"   => false,
        "message" => "Token pasif.",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// (opsiyonel) süresi dolmuş mu?
if (!empty($row["expiresAt"]) && strtotime($row["expiresAt"]) < time()) {
    echo json_encode([
        "success" => false,
        "valid"   => false,
        "message" => "Token süresi dolmuş.",
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    "success"   => true,
    "valid"     => true,
    "maxGuests" => (int)$row["maxGuests"],
    "usedGuests"=> (int)$row["usedGuests"],
    "eventId"   => $row["eventId"] ? (int)$row["eventId"] : null,
    "plan"      => $row["plan"],
], JSON_UNESCAPED_UNICODE);
exit;
