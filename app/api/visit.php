<?php
include "config.php";

$guest_id = intval($_GET["guest_id"]);
$ip = $_SERVER["REMOTE_ADDR"];

$conn->query("INSERT INTO guest_visits(guest_id, ip) VALUES($guest_id, '$ip')");
$conn->query("UPDATE guests SET visit_count=visit_count+1 WHERE id=$guest_id");

echo json_encode(["ok" => true]);
?>