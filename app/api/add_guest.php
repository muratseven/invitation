<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Preflight için
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include "config.php";

// Basit slugify (frontend'deki slugifyName'in PHP versiyonu)
function slugify($str) {
    $str = trim(mb_strtolower($str, 'UTF-8'));
    $map = [
        'ç' => 'c', 'ğ' => 'g', 'ı' => 'i', 'ö' => 'o',
        'ş' => 's', 'ü' => 'u',
    ];
    $str = strtr($str, $map);
    $str = preg_replace('/[^a-z0-9\s-]/', ' ', $str);
    $str = preg_replace('/\s+/', ' ', $str);
    $str = preg_replace('/\s+/', '-', $str);
    return trim($str, '-');
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || empty($data['token']) || empty(trim($data['guest_name']))) {
    echo json_encode([
        'success' => false,
        'error'   => 'Eksik parametre',
    ]);
    exit;
}

$tokenInput = trim($data['token']);
$guestName  = trim($data['guest_name']);

// 1) Token bilgisi
$stmt = $conn->prepare("
    SELECT id, maxGuests, eventId
    FROM tokens
    WHERE token = ? AND isActive = 1
    LIMIT 1
");

if (!$stmt) {
    echo json_encode([
        'success' => false,
        'error'   => 'Token sorgusu hazırlanamadı: ' . $conn->error,
    ]);
    exit;
}
$stmt->bind_param("s", $tokenInput);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'Geçersiz token',
    ]);
    exit;
}

$tokenRow  = $res->fetch_assoc();
$tokenId   = (int)$tokenRow['id'];
$maxGuests = (int)$tokenRow['maxGuests'];
$eventId   = (int)($tokenRow['eventId'] ?? 0);

// 2) Bu token’a ait mevcut misafir sayısı
if ($eventId <= 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'Bu token için henüz etkinlik kaydedilmemiş. Önce davetiyeyi kaydedin.',
    ]);
    exit;
}

$stmtCount = $conn->prepare("
    SELECT COUNT(*) AS cnt
    FROM guests
    WHERE token_id = ?
");
if (!$stmtCount) {
    echo json_encode([
        'success' => false,
        'error'   => 'Misafir sayısı sorgusu hazırlanamadı: ' . $conn->error,
    ]);
    exit;
}
$stmtCount->bind_param("i", $tokenId);
$stmtCount->execute();
$countRes     = $stmtCount->get_result()->fetch_assoc();
$currentCount = (int)$countRes['cnt'];

// 3) Limit kontrolü
if ($currentCount >= $maxGuests) {
    echo json_encode([
        'success' => false,
        'error'   => 'Lisansınızın davetli sınırına ulaştınız',
    ]);
    exit;
}

// 4) Yeni misafiri ekle
$slug = slugify($guestName);

if ($slug === '') {
    echo json_encode([
        'success' => false,
        'error'   => 'Geçersiz davetli ismi (slug üretilemedi).',
    ]);
    exit;
}

// Aynı token + slug için çakışma kontrolü
$checkStmt = $conn->prepare("
    SELECT id FROM guests
    WHERE token_id = ? AND guest_slug = ?
    LIMIT 1
");
if ($checkStmt) {
    $checkStmt->bind_param("is", $tokenId, $slug);
    $checkStmt->execute();
    $checkRes = $checkStmt->get_result();
    if ($checkRes->num_rows > 0) {
        $slug = $slug . '-' . ($currentCount + 1);
    }
}

$stmtInsert = $conn->prepare("
    INSERT INTO guests (event_id, token_id, guest_name, guest_slug, created_at)
    VALUES (?, ?, ?, ?, NOW())
");
if (!$stmtInsert) {
    echo json_encode([
        'success' => false,
        'error'   => 'Insert sorgusu hazırlanamadı: ' . $conn->error,
    ]);
    exit;
}

// DİKKAT: event_id ARTIK GERÇEK $eventId
$stmtInsert->bind_param("iiss", $eventId, $tokenId, $guestName, $slug);
if (!$stmtInsert->execute()) {
    echo json_encode([
        'success' => false,
        'error'   => 'Misafir eklenirken bir hata oluştu: ' . $stmtInsert->error,
    ]);
    exit;
}

$guestId = $stmtInsert->insert_id;

// 5) Son durumda bu token için kullanılan misafir sayısını tekrar say
$stmtCount2 = $conn->prepare("
    SELECT COUNT(*) AS cnt
    FROM guests
    WHERE token_id = ?
");
if (!$stmtCount2) {
    echo json_encode([
        'success' => false,
        'error'   => 'Misafir sayısı (2) sorgusu hazırlanamadı: ' . $conn->error,
    ]);
    exit;
}
$stmtCount2->bind_param("i", $tokenId);
$stmtCount2->execute();
$countRes2   = $stmtCount2->get_result()->fetch_assoc();
$usedGuests2 = (int)$countRes2['cnt'];

$linkBase = "http://localhost:3000";
$link = $linkBase . "/invite/" . urlencode($slug) . "?token=" . urlencode($tokenInput);

echo json_encode([
    'success'    => true,
    'guestId'    => $guestId,
    'guestName'  => $guestName,
    'slug'       => $slug,
    'link'       => $link,
    'maxGuests'  => $maxGuests,
    'usedGuests' => $usedGuests2,
]);
