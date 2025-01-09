<?php
require_once 'conn.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $severity = $data["severity_lvl"];
    $treatment = $data["treatment"];
    $uid = $data["uid"];
   try{
   $sql1 = 'INSERT INTO severity (severity_level) Values (:severity_level)';
   $sql2 = 'INSERT INTO detection (severity_id,user_id) Values (:severity_id,:uid)'; 
   $sql3 = 'INSERT INTO treatment (severity_id,treatment_methods) Values (:severity_id,:treatment_methods)';
   
   
    $conn->beginTransaction();

    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute([':severity_level' => $severity]);

    
    $severity_id = $conn->lastInsertId();

   
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute([
        ':severity_id' => $severity_id,
        ':uid' => $uid 
    ]);

   
    $stmt3 = $conn->prepare($sql3);
    $stmt3->execute([
        ':severity_id' => $severity_id,
        ':treatment_methods' => $treatment 
    ]);

    
    $conn->commit();
    http_response_code(201);
    echo json_encode([
        'status'=> 'Success',
        'message'=> "เพิ่มข้อมูลสำเร็จ"
    ]);
}catch(PDOException $e){
    $conn->rollBack();
    http_response_code(400);
    echo json_encode([
        'status'=> 'error',
        'message'=> $e->getMessage()
    ]);
   }
}
    




?>