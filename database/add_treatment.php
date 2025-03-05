<?php
require_once "conn.php"; //1

header("Access-Control-Allow-Origin: *"); // อนุญาตทุกโดเมน (สามารถเปลี่ยน * เป็น http://localhost:3000 ได้)
header("Access-Control-Allow-Methods: POST, OPTIONS"); // อนุญาตเฉพาะ POST และ OPTIONS
header("Access-Control-Allow-Headers: Content-Type"); // อนุญาตให้ใช้ Content-Type ใน Header
header("Content-Type: application/json");

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$severity_id = $data["severity_id"] ?? "";
$treatment_methods = $data["treatment_methods"] ?? "";

if (!$severity_id || !$treatment_methods) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

$sql = "INSERT INTO treatment (severity_id, treatment_methods) VALUES ('$severity_id', '$treatment_methods')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}

$conn->close();
?>
