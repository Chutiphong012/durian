<?php 

require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    $uid = $data['uid'];
    


    try {
        $sql = "SELECT * FROM user WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':user_id' => $uid]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
       
        // Debugging: Output the result for testing
       

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