<?php
include "config.php";

$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;

$random = strtoupper(substr(md5(rand()),0,6));
$token = "INV-$limit-$random";

$stmt = $conn->prepare("INSERT INTO tokens(token, guest_limit) VALUES(?, ?)");
$stmt->bind_param("si", $token, $limit);
$stmt->execute();

echo json_encode([
    "token" => $token,
    "limit" => $limit
]);
?>