<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'conn.php'; // รวมไฟล์การเชื่อมต่อฐานข้อมูล
require_once '../vendor/autoload.php'; // รวมไฟล์ของ PhpSpreadsheet

use PhpOffice\PhpSpreadsheet\IOFactory;

// เชื่อมต่อฐานข้อมูล
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error], JSON_UNESCAPED_UNICODE);
    exit();
}

// ถ้ารับคำขอเป็น GET
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['file']['tmp_name'];
        $fileType = $_FILES['file']['type'];

        // ตรวจสอบไฟล์ที่อัปโหลดว่าเป็น Excel หรือ CSV
        $allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(["status" => "error", "message" => "Invalid file format. Please upload an Excel (.xlsx) or CSV file."], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // อ่านข้อมูลจากไฟล์
        try {
            $spreadsheet = IOFactory::load($fileTmpPath);
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();
            if (count($data) <= 1) {
                echo json_encode(["status" => "error", "message" => "File is empty or invalid"], JSON_UNESCAPED_UNICODE);
                exit();
            }
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Error reading file: " . $e->getMessage()], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // ข้ามแถวแรก (header) ถ้ามี
        array_shift($data);

        // เตรียม SQL สำหรับเพิ่มข้อมูล
        $insertSeveritySql = "INSERT INTO severity (severity_level) VALUES (?)";
        $insertTreatmentSql = "INSERT INTO treatment (severity_id, treatment_methods) VALUES (?, ?)";
        $stmtSeverity = $conn->prepare($insertSeveritySql);
        $stmtTreatment = $conn->prepare($insertTreatmentSql);

        foreach ($data as $row) {
            $severity_level = trim($row[0]);
            $treatment_methods = trim($row[1] ?? "No treatment available");

            // เพิ่ม severity
            $stmtSeverity->bind_param("s", $severity_level);
            if ($stmtSeverity->execute()) {
                $severity_id = $stmtSeverity->insert_id;

                // เพิ่ม treatment
                $stmtTreatment->bind_param("is", $severity_id, $treatment_methods);
                $stmtTreatment->execute();
            }
        }

        // ใช้ LEFT JOIN ดึงข้อมูลจาก severity และ treatment
        $sql = "SELECT severity.severity_level, treatment.treatment_methods 
                FROM severity 
                LEFT JOIN treatment ON severity.severity_id = treatment.severity_id";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = [
                    "severity_level" => $row["severity_level"],
                    "treatment_methods" => $row["treatment_methods"] ?? "No treatment available"
                ];
            }
            echo json_encode(["status" => "success", "data" => $data], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["status" => "error", "message" => "No data found"], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No file uploaded or file error"], JSON_UNESCAPED_UNICODE);
    }
} 
// ถ้ารับคำขอเป็น POST
elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    $inputData = json_decode(file_get_contents("php://input"), true);
    if (isset($inputData['severity_level'], $inputData['treatment_methods'], $inputData['severity_id'])) {
        $severity_level = $inputData['severity_level'];
        $treatment_methods = $inputData['treatment_methods'];
        $severity_id = $inputData['severity_id'];

        // อัปเดต severity_level
        $updateSeveritySql = "UPDATE severity SET severity_level = ? WHERE severity_id = ?";
        $stmt = $conn->prepare($updateSeveritySql);
        $stmt->bind_param("si", $severity_level, $severity_id);
        if (!$stmt->execute()) {
            echo json_encode(["status" => "error", "message" => "Failed to update severity level"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        // อัปเดต treatment_methods
        $updateTreatmentSql = "UPDATE treatment SET treatment_methods = ? WHERE severity_id = ?";
        $stmt = $conn->prepare($updateTreatmentSql);
        $stmt->bind_param("si", $treatment_methods, $severity_id);
        if (!$stmt->execute()) {
            echo json_encode(["status" => "error", "message" => "Failed to update treatment methods"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        echo json_encode(["status" => "success", "message" => "Data updated successfully"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid data provided"], JSON_UNESCAPED_UNICODE);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"], JSON_UNESCAPED_UNICODE);
}

// ปิดการเชื่อมต่อฐานข้อมูล
$conn->close();
?>
