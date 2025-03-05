<?php

require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // ตรวจสอบข้อมูลที่ได้รับ
    $treatment_id = $data['treatment_id'] ?? null;
    $severity_id = $data['severity_id'] ?? null;
    $treatment_methods = $data['treatment_methods'] ?? null;

    if (!$treatment_id || !$treatment_methods) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid data']);
        exit();
    }

    try {
        // เตรียมคำสั่ง UPDATE
        $sql = "UPDATE treatment 
        SET treatment_methods = :treatment_methods, severity_id = :severity_id 
        WHERE treatment_id = :treatment_id";
$stmt = $conn->prepare($sql);

$stmt->execute([
    ':treatment_methods' => $treatment_methods,
    ':severity_id' => $severity_id,
    ':treatment_id' => $treatment_id
]);

        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Update successful']);
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'No changes made']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([ 'status' => 'error', 'message' => "Error: " . $e->getMessage() ]);
    }
}
?>
