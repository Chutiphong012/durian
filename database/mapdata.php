<?php 

require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    
    


    try {
        $sql = "SELECT detection.latitude_detec AS latitude_detec, detection.longitude_detec AS longitude_detec, severity.severity_level AS svt_lvl 
          FROM detection 
          LEFT JOIN severity ON detection.severity_id = severity.severity_id 
          ORDER BY svt_lvl DESC, date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
       
       
     

        if ($result) {
            http_response_code(200);
            echo json_encode([
                'message' => "fetch successful",
                'data' => $result
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'message' => "fetch fail"
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(402);
        echo json_encode([
            'message' => "Error, " . $e->getMessage()
        ]);
    }

}




?>