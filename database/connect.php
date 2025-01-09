<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "durian_db";


$conn = new mysqli($servername, $username, $password, $dbname);


if ($conn->connect_error) {
    die("การเชื่อมต่อล้มเหลว: " . $conn->connect_error);
}

echo "เชื่อมต่อฐานข้อมูลสำเร็จ!";


$conn->close();
?>
