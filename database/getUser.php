<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'conn.php'; // ไฟล์เชื่อมต่อฐานข้อมูล

// ตรวจสอบว่าเป็น POST request หรือไม่
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// รับ user_id จาก request
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data["user_id"]) || !is_numeric($data["user_id"])) {
    http_response_code(400); // Bad Request
    echo json_encode(["error" => "Invalid user ID"]);
    exit;
}

$user_id = (int) $data["user_id"];

// เชื่อมต่อกับฐานข้อมูล
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// คำสั่ง SQL เพื่อดึงพิกัด latitude และ longitude
$sql = "SELECT latitude, longitude FROM user WHERE id = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "SQL prepare failed"]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// ตรวจสอบว่าพบข้อมูลหรือไม่
if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    http_response_code(200); // OK
    echo json_encode([
        "latitude" => $row["latitude"],
        "longitude" => $row["longitude"]
    ]);
} else {
    http_response_code(404); // Not Found
    echo json_encode(["error" => "User not found"]);
}

// ปิดการเชื่อมต่อ
$stmt->close();
$conn->close();
?>
