<?php
header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once "conn.php";

$data = json_decode(file_get_contents("php://input"), true);

// ✅ บันทึกค่าที่ได้รับจาก Frontend ลงไฟล์ error_log เพื่อตรวจสอบ
file_put_contents("php://stderr", print_r($data, true));

// รับข้อมูลจาก request
$uid = isset($data["uid"]) ? $data["uid"] : null;
$severity_lvl = isset($data["severity_lvl"]) ? $data["severity_lvl"] : null;
$latitude = isset($data["latitude_detec"]) ? $data["latitude_detec"] : null;
$longitude = isset($data["longitude_detec"]) ? $data["longitude_detec"] : null;

// ✅ ตรวจสอบค่าที่รับมา
error_log("UID: " . $uid);
error_log("Severity Level: " . $severity_lvl);
error_log("Latitude: " . $latitude);
error_log("Longitude: " . $longitude);

if ($severity_lvl) {
    // ดึง severity_id จากตาราง severity
    $sql = "SELECT severity_id FROM severity WHERE severity_id = :severity_lvl";
    $stmt = $conn->prepare($sql);
    $stmt->execute([":severity_lvl" => $severity_lvl]);

    if ($stmt->rowCount() > 0) {
        $severity = $stmt->fetch(PDO::FETCH_ASSOC);
        $severity_id = $severity['severity_id'];

        // บันทึกข้อมูลลงตาราง detection
        $sql2 = 'INSERT INTO detection (severity_id, user_id, latitude_detec, longitude_detec) 
                 VALUES (:severity_id, :uid, :latitude_detec, :longitude_detec)';
        $stmt2 = $conn->prepare($sql2);
        $stmt2->execute([
            ':severity_id' => $severity_id,
            ':uid' => $uid,
            ':latitude_detec' => $latitude,
            ':longitude_detec' => $longitude
        ]);

        echo json_encode(["status" => "success", "message" => "Data inserted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Severity level not found"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Severity level is missing"]);
}

?>
