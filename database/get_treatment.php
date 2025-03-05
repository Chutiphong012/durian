<?php
header('Content-Type: application/json');

// เริ่มต้นการเชื่อมต่อฐานข้อมูล
require_once "conn.php";

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// รับข้อมูล JSON ที่ส่งมาจาก client
$data = json_decode(file_get_contents("php://input"));

// ตรวจสอบว่าได้ข้อมูล severity_lvl หรือไม่
if (isset($data->severity_lvl)) {
    // กำหนด severity_level
    $severity_lvl = $data->severity_lvl;

    // ตรวจสอบ severity_lvl ว่าเป็นค่าที่ถูกต้อง
    if (in_array($severity_lvl, [1, 2, 3])) {
        // สร้าง SQL เพื่อดึงข้อมูลการรักษาตาม severity_lvl
        $sql = "SELECT treatment_methods FROM treatment
        JOIN severity ON treatment.severity_id = severity.severity_id 
        WHERE treatment.severity_id = :severity_lvl";
        
        
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':severity_lvl', $severity_lvl, PDO::PARAM_INT);

        // Execute query
        $stmt->execute();

        // ดึงข้อมูลการรักษาที่พบ
        $treatment = $stmt->fetchall(PDO::FETCH_ASSOC);

        // ตรวจสอบว่าพบข้อมูลหรือไม่
        if ($treatment) {
            // ส่งข้อมูลการรักษากลับไปยัง client
            echo json_encode([
                'success' => true,
                'treatment' => $treatment
            ]);
        } else {
            // ถ้าไม่พบข้อมูลการรักษา
            echo json_encode([
                'success' => false,
                'message' => 'No treatment found for the given severity level.'
            ]);
        }
    } else {
        // หากไม่พบ severity_lvl ที่ถูกต้อง
        echo json_encode([
            'success' => false,
            'message' => 'Invalid severity level provided.'
        ]);
    }
} else {
    // หากไม่ได้รับ severity_lvl
    echo json_encode([
        'success' => false,
        'message' => 'Severity level is missing.'
    ]);
}
?>
