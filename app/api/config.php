<?php
// CORS ayarları
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

// Geliştirme için localhost:3000'e izin ver
// İstersen '*' de bırakabilirsin ama tarayıcı bazen credential varsa takılır
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Preflight (OPTIONS) isteğini hemen döndür
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$host = "localhost";
$user = "root";       // MAMP default
$pass = "root";       // MAMP default
$db   = "davetiyem";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB Error: " . $conn->connect_error]);
    exit;
}
