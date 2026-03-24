<?php
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

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || !isset($data['token']) || !isset($data['guest_id'])) {
    echo json_encode([
        'success' => false,
        'error'   => 'Missing token or guest_id',
    ]);
    exit;
}

$tokenInput = trim($data['token']);
$guestId    = (int)$data['guest_id'];

// 1) Token'ı doğrula
$stmtToken = $conn->prepare("
    SELECT id, maxGuests
    FROM tokens
    WHERE token = ? AND isActive = 1
    LIMIT 1
");
if (!$stmtToken) {
    echo json_encode([
        'success' => false,
        'error'   => 'Token query prepare failed: ' . $conn->error,
    ]);
    exit;
}
$stmtToken->bind_param("s", $tokenInput);
$stmtToken->execute();
$resToken = $stmtToken->get_result();

if ($resToken->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'error'   => 'Invalid token',
    ]);
    exit;
}

$tokenRow = $resToken->fetch_assoc();
$tokenId  = (int)$tokenRow['id'];
$maxGuests = (int)$tokenRow['maxGuests'];

// 2) Guest gerçekten bu token'a ait mi?
$stmtGuest = $conn->prepare("
    SELECT id
    FROM guests
    WHERE id = ? AND token_id = ?
    LIMIT 1
");
if (!$stmtGuest) {
    echo json_encode([
        'success' => false,
        'error'   => 'Guest query prepare failed: ' . $conn->error,
    ]);
    exit;
}
$stmtGuest->bind_param("ii", $guestId, $tokenId);
$stmtGuest->execute();
$resGuest = $stmtGuest->get_result();

if ($resGuest->num_rows === 0) {
    // Bu token'a ait böyle bir guest yok
    // usedGuests'i bu token için tekrar sayıp döndürürüz
    $countStmt = $conn->prepare("
        SELECT COUNT(*) AS cnt
        FROM guests
        WHERE token_id = ?
    ");
    if ($countStmt) {
        $countStmt->bind_param("i", $tokenId);
        $countStmt->execute();
        $countRes   = $countStmt->get_result()->fetch_assoc();
        $usedGuests = (int)$countRes['cnt'];
    } else {
        $usedGuests = 0;
    }

    echo json_encode([
        'success'    => false,
        'error'      => 'Guest not found for this token',
        'usedGuests' => $usedGuests,
        'maxGuests'  => $maxGuests,
    ]);
    exit;
}

// 3) Transaction ile sil ve SONRA gerçek sayıyı COUNT ile hesapla
$conn->begin_transaction();

try {
    // 3a) Guest'i sil
    $stmtDel = $conn->prepare("DELETE FROM guests WHERE id = ? AND token_id = ?");
    if (!$stmtDel) {
        throw new Exception('Delete query prepare failed: ' . $conn->error);
    }
    $stmtDel->bind_param("ii", $guestId, $tokenId);
    $stmtDel->execute();

    // 3b) Bu token için güncel guest sayısını tekrar say
    $stmtCount = $conn->prepare("
        SELECT COUNT(*) AS cnt
        FROM guests
        WHERE token_id = ?
    ");
    if (!$stmtCount) {
        throw new Exception('Count query prepare failed: ' . $conn->error);
    }
    $stmtCount->bind_param("i", $tokenId);
    $stmtCount->execute();
    $countRes   = $stmtCount->get_result()->fetch_assoc();
    $usedGuests = (int)$countRes['cnt'];

    // 3c) İstersen tokens.usedGuests kolonunu bu sayıyla senkronize et (opsiyonel ama tutarlı olur)
    $stmtUpdate = $conn->prepare("
        UPDATE tokens
        SET usedGuests = ?
        WHERE id = ?
    ");
    if ($stmtUpdate) {
        $stmtUpdate->bind_param("ii", $usedGuests, $tokenId);
        $stmtUpdate->execute();
    }

    $conn->commit();

    echo json_encode([
        'success'    => true,
        'usedGuests' => $usedGuests,
        'maxGuests'  => $maxGuests,
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success'    => false,
        'error'      => 'DB error: ' . $e->getMessage(),
    ]);
}
