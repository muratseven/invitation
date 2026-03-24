<?php
// /backend/api/save_event.php

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

function respond($data, $statusCode = 200)
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// 1) Body oku
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data) || empty($data["token"]) || empty($data["settings"])) {
    respond([
        "success" => false,
        "error"   => "Missing token or settings",
    ], 400);
}

$token    = trim($data["token"]);
$settings = $data["settings"];

// 2) Token satırını çek
$stmt = $conn->prepare("
    SELECT id, eventId, isActive
    FROM tokens
    WHERE token = ?
    LIMIT 1
");
$stmt->bind_param("s", $token);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    respond([
        "success" => false,
        "error"   => "Token not found",
    ], 401);
}

$tokenRow  = $res->fetch_assoc();
$tokenId   = (int)$tokenRow["id"];
$eventId   = (int)$tokenRow["eventId"];
$isActive  = (int)$tokenRow["isActive"];

if (!$isActive) {
    respond([
        "success" => false,
        "error"   => "Token is not active",
    ], 401);
}

// 3) settings içinden temel alanları çek
$brideName    = isset($settings["brideName"])    ? trim($settings["brideName"])    : "";
$groomName    = isset($settings["groomName"])    ? trim($settings["groomName"])    : "";
$dateRaw      = isset($settings["dateRaw"])      ? trim($settings["dateRaw"])      : "";
$time         = isset($settings["time"])         ? trim($settings["time"])         : "";
$locationText = isset($settings["locationText"]) ? trim($settings["locationText"]) : "";
$mapsUrl      = isset($settings["mapsUrl"])      ? trim($settings["mapsUrl"])      : "";

$settingsJson = json_encode($settings, JSON_UNESCAPED_UNICODE);

// 4) Event adı ve slug
$eventName = ($brideName && $groomName)
    ? ($brideName . " & " . $groomName)
    : "Davetly Etkinliği";

function slugify_local($str) {
    $str = mb_strtolower(trim($str), "UTF-8");
    $map = [
        "ç" => "c", "ğ" => "g", "ı" => "i", "ö" => "o",
        "ş" => "s", "ü" => "u",
    ];
    $str = strtr($str, $map);
    $str = preg_replace("/[^a-z0-9\s-]/", "", $str);
    $str = preg_replace("/\s+/", "-", $str);
    $str = preg_replace("/-+/", "-", $str);
    $str = trim($str, "-");
    return $str ?: "etkinlik";
}

$eventSlug = slugify_local($eventName);

// 5) Insert / Update
if ($eventId > 0) {
    // VAR OLAN EVENTİ GÜNCELLE
    $stmtUpd = $conn->prepare("
        UPDATE events
        SET
            bride_name    = ?,
            groom_name    = ?,
            date_raw      = ?,
            time          = ?,
            location_text = ?,
            maps_url      = ?,
            settings_json = ?
        WHERE id = ?
    ");
    $stmtUpd->bind_param(
        "sssssssi",
        $brideName,
        $groomName,
        $dateRaw,
        $time,
        $locationText,
        $mapsUrl,
        $settingsJson,
        $eventId
    );

    if (!$stmtUpd->execute()) {
        respond([
            "success" => false,
            "error"   => "Event update failed",
            "details" => $conn->error,
        ], 500);
    }
} else {
    // YENİ EVENT OLUŞTUR
    $stmtIns = $conn->prepare("
    INSERT INTO events
        (bride_name, groom_name, date_raw, time, location_text, maps_url,
         settings_json, event_slug, event_name, created_at)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
");
$stmtIns->bind_param(
    "sssssssss",  // 9 tane s
    $brideName,
    $groomName,
    $dateRaw,
    $time,
    $locationText,
    $mapsUrl,
    $settingsJson,
    $eventSlug,
    $eventName
);

if (!$stmtIns->execute()) {
    respond([
        "success" => false,
        "error"   => "Event insert failed",
        "details" => $conn->error,
    ], 500);
}

$eventId = (int)$stmtIns->insert_id;

    // Token'a eventId yaz
    $stmtTok = $conn->prepare("
    UPDATE tokens
    SET eventId = ?
    WHERE id = ?
");
$stmtTok->bind_param("ii", $eventId, $tokenId);
$stmtTok->execute();

    // licenses tablosuna da ilişki yaz (yoksa)
    $stmtLic = $conn->prepare("
        INSERT INTO licenses (token, event_id)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE event_id = VALUES(event_id)
    ");
    $stmtLic->bind_param("si", $token, $eventId);
    $stmtLic->execute();
}

respond([
    "success"   => true,
    "eventId"   => $eventId,
    "eventSlug" => $eventSlug,
    "eventName" => $eventName,
]);
