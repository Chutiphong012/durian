<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// เชื่อมต่อฐานข้อมูล
require_once 'conn.php';

// เช็คการเชื่อมต่อ Database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Debug: ตรวจสอบค่าที่ได้รับจาก React
$input = file_get_contents("php://input");
file_put_contents("debug_log.txt", "Received JSON: " . print_r($input, true) . PHP_EOL, FILE_APPEND);
$data = json_decode($input, true);

if (!$data || !isset($data['startDate']) || !isset($data['endDate'])) {
    echo json_encode(["error" => "Invalid JSON input", "raw" => $input]);
    exit;
}

$startDate = $data['startDate'];
$endDate = $data['endDate'];

// Debug: ตรวจสอบค่าของวันที่
file_put_contents("debug_log.txt", "Start Date: $startDate, End Date: $endDate" . PHP_EOL, FILE_APPEND);

$query = "SELECT 
            detection.date AS date, 
            detection.latitude_detec AS latitude_detec, 
            detection.longitude_detec AS longitude_detec, 
            severity.severity_level AS svt_lvl,
            user.username AS username
          FROM detection 
          LEFT JOIN severity ON detection.severity_id = severity.severity_id 
          LEFT JOIN user ON detection.user_id = user.user_id 
          WHERE detection.date BETWEEN ? AND ?
          ORDER BY date DESC";


$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["error" => "SQL Prepare failed", "message" => $conn->error]);
    exit;
}
$stmt->bind_param("ss", $startDate, $endDate);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

// Debug: ตรวจสอบค่าหลังจาก Query
file_put_contents("debug_log.txt", "Fetched Data: " . print_r($data, true) . PHP_EOL, FILE_APPEND);

// ส่งข้อมูลกลับเป็น JSON
echo json_encode(["data" => $data], JSON_UNESCAPED_UNICODE);

$stmt->close();
$conn->close();
?>
