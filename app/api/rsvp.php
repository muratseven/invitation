<?php
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$guest_id = intval($data["guest_id"]);
$status   = $data["status"]; // 'yes' veya 'no'

$stmt = $conn->prepare("UPDATE guests SET rsvp_status=? WHERE id=?");
$stmt->bind_param("si", $status, $guest_id);
$stmt->execute();

echo json_encode(["success" => true]);
?>