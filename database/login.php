<?php
require_once 'conn.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
    
if($_SERVER['REQUEST_METHOD'] == "POST"){
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    $email = $data['email'];
    $password = $data['password'];

    
    $sql = 'SELECT * FROM user WHERE email = :email';
    $stmt = $conn->prepare($sql);

     $data = [':email' => $email];

    $stmt->execute($data);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row && password_verify($password, $row['password'])){
        $response = [
            'userId'=>$row['user_id'],
            'occupation'=>$row['occupation'],
        ];
        http_response_code(200);
        echo json_encode($response);
    }else{
        http_response_code(401);
        echo json_encode(['data'=>$row]);
    }
    
}
