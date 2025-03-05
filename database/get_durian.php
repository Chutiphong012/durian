<?php

require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // ✅ เพิ่ม treatment.treatment_id เข้าไปใน Query
    $sql = "SELECT treatment.treatment_id, severity.severity_id, severity.severity_level, treatment.treatment_methods 
            FROM severity 
            LEFT JOIN treatment ON severity.severity_id = treatment.severity_id
            ORDER BY severity.severity_id ASC";
    
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = [
                "treatment_id" => $row["treatment_id"] ?? null, // ✅ เพิ่ม treatment_id
                "severity_id" => $row["severity_id"],
                "severity_level" => $row["severity_level"],
                "treatment_methods" => $row["treatment_methods"] ?? "No treatment available"
            ];
        }
        echo json_encode(["status" => "success", "data" => $data], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["status" => "error", "message" => "No data found"], JSON_UNESCAPED_UNICODE);
    }
} 

?>
