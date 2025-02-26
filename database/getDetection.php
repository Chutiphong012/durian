<?php
require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    
    try {
        // ดึงข้อมูลจากตาราง detection พร้อม severity และพิกัด
        $sql = "SELECT detection.date as date, 
                       detection.user_id as uid,
                       user.username AS username, 
                       severity.severity_level as svt_lvl, 
                       detection.latitude_detec, 
                       detection.longitude_detec
                FROM detection 
                LEFT JOIN severity ON detection.severity_id = severity.severity_id
                LEFT JOIN user ON detection.user_id = user.user_id 
                ORDER BY date DESC";

        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // แปลงรูปแบบวันที่ ตัดเวลาทิ้ง
        for ($i = 0; $i < count($result); $i++){
            list($date, $time) = explode(" ", $result[$i]['date']);
            $result[$i]['date'] = $date;
        }

        if ($result) {
            http_response_code(200);
            echo json_encode([
                'message' => "Fetch successful",
                'data' => $result,
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'message' => "No data found"
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'message' => "Error: " . $e->getMessage()
        ]);
    }
}
?>
