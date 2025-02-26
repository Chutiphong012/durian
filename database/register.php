<?php
require_once 'conn.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    $username = $data['username'];
    $email = $data['email'];
   $password = $data['password'];
   $longitude = $data['longitude'];
   $latitude = $data['latitude'];
   $occupation = $data['occupation'];
   $hash_password = password_hash($password, PASSWORD_DEFAULT);
   try{
   $sql = 'INSERT INTO user (username,email,password,latitude,longitude,occupation) VALUES (:username,:email,:password,:latitude,:longitude,:occupation)';
   $stmt = $conn->prepare($sql);
   $result = $stmt->execute([
    ':username'=> $username,
    ':email'=> $email,
    ':password'=> $hash_password,
    ':latitude'=> $latitude,
    ':longitude'=> $longitude,
    ':occupation'=> $occupation,
   ]);

   if ($result) {
    http_response_code(201);
    echo json_encode([
        'status'=> 'success',
        'message'=> 'สมัครสำเร็จ'
    ]);
   }else{
    http_response_code(400);
    echo json_encode([
        'status'=> 'error',
        'message'=> 'สมัครไม่สำเร็จ'
    ]);
   }
}catch(PDOException $e){
    http_response_code(409);
    echo json_encode([
        'status'=> 'duplicate',
        'message'=> $e->getMessage()
    ]);
   }
}
    
?>