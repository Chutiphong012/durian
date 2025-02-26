<?php
require_once 'conn.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// รับ JSON ที่ส่งมาและแปลงเป็นอาร์เรย์
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ตรวจสอบว่าค่าที่จำเป็นถูกส่งมาหรือไม่
    if (!isset($data["severity_lvl"], $data["treatment"], $data["uid"], $data["latitude_detec"], $data["longitude_detec"])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'ข้อมูลไม่ครบถ้วน ต้องมี severity_lvl, treatment, uid, latitude_detec และ longitude_detec'
        ]);
        exit();
    }

    // กำหนดค่าจาก JSON
    $severity = $data["severity_lvl"];
    $treatment = $data["treatment"];
    $uid = $data["uid"];
    $latitude = $data["latitude_detec"];
    $longitude = $data["longitude_detec"];

    try {
        // เริ่ม Transaction
        $conn->beginTransaction();

        // บันทึกระดับความรุนแรงของโรค
        $sql1 = 'INSERT INTO severity (severity_level) VALUES (:severity_level)';
        $stmt1 = $conn->prepare($sql1);
        $stmt1->execute([':severity_level' => $severity]);
        $severity_id = $conn->lastInsertId(); // ดึง ID ของ severity ที่เพิ่งเพิ่ม

        // บันทึกตำแหน่งผู้ใช้ลงในตาราง detection
        $sql2 = 'INSERT INTO detection (severity_id, user_id, latitude_detec, longitude_detec) 
                 VALUES (:severity_id, :uid, :latitude_detec, :longitude_detec)';
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute([
            ':severity_id' => $severity_id,
            ':uid' => $uid,
            ':latitude_detec' => $latitude,
            ':longitude_detec' => $longitude
        ]);

        // บันทึกวิธีการรักษา
        $sql3 = 'INSERT INTO treatment (severity_id, treatment_methods) 
                 VALUES (:severity_id, :treatment_methods)';
        $stmt3 = $conn->prepare($sql3);
        $stmt3->execute([
            ':severity_id' => $severity_id,
            ':treatment_methods' => $treatment
        ]);

        // บันทึกข้อมูลสำเร็จ
        $conn->commit();
        http_response_code(201);
        echo json_encode([
            'status' => 'Success',
            'message' => "เพิ่มข้อมูลสำเร็จ"
        ]);

    } catch (PDOException $e) {
        // ยกเลิกหากเกิดข้อผิดพลาด
        $conn->rollBack();
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'เกิดข้อผิดพลาด: ' . $e->getMessage()
        ]);
    }
}
?>
