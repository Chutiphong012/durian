<?php
require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    
    try {
        // Query to fetch all users' data
        $sql = "SELECT detection.date as date,detection.user_id as uid,
                       severity.severity_level as svt_lvl
                        from detection left join severity on
                         detection.severity_id = severity.severity_id ORDER BY date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

      for ($i = 0; $i < count($result); $i++){
        list($date, $time) = explode(" ", $result[$i]['date']);
        $result[$i]['date'] = $date;
    }
        // echo '<pre>';
        // print_r($result);
        
        // echo '</pre>';
        // return;

        if ($result) {
            http_response_code(200);
            echo json_encode([
                'message' => "fetch successful",
                'data' => $result,
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'message' => "No user data found"
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