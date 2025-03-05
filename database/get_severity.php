<?php
require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit();
}


$sql = "SELECT severity_id, severity_level FROM severity";
$result = $conn->query($sql);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "error", "message" => "No data found"]);
}

$conn->close();
?>
