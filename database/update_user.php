<?php

require_once "conn.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!$data) {
        // If the data is invalid, return an error response
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON input']);
        exit();
    }

    // Extract the data from the request
    $uid = $data['uid'] ?? null;
    $username = $data['username'] ?? null;
    $email = $data['email'] ?? null;
    $longitude = $data['longitude'] ?? null;
    $latitude = $data['latitude'] ?? null;
    $oldPassword = $data['oldPassword'] ?? null;
    $newpassword = $data['newPassword'] ?? null;

    

    try {
        $sql = "SELECT * FROM user WHERE user_id = :user_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([':user_id' => $uid]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        $hash_password = password_hash($newpassword, PASSWORD_DEFAULT);

        if (password_verify($oldPassword, $result['password'])) {
            $sql = "UPDATE user SET username = :username, email = :email, password = :password, longitude = :longitude, latitude = :latitude WHERE user_id = :user_id";

            $stmt = $conn->prepare($sql);
            // Execute the statement with an array of values
            $stmt->execute([
                ':username' => $username,
                ':email' => $email,
                ':password' => $hash_password,
                ':longitude' => $longitude,
                ':latitude' => $latitude,
                ':user_id' => $uid
            ]);

            // Check if rows were affected (update successful)
            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode([
                    'message' => "Update successful"
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'message' => "No changes made"
                ]);
            }
        }else{
            http_response_code(403);
            echo json_encode([
                'message' => "Password not match"
            ]);
        }
        
        // Debugging: Output the result for testing


    } catch (PDOException $e) {
        http_response_code(402);
        echo json_encode([
            'message' => "Error, " . $e->getMessage()
        ]);
    }

}




?>