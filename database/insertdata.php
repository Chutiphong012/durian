<?php
require_once 'conn.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

// ตรวจสอบว่าตารางมีข้อมูลอยู่แล้วหรือไม่ เพื่อป้องกันการเพิ่มข้อมูลซ้ำ
$check_severity = $conn->query("SELECT COUNT(*) FROM severity")->fetchColumn();
$check_treatment = $conn->query("SELECT COUNT(*) FROM treatment")->fetchColumn();

if ($check_severity == 0) {
    $sql = "INSERT INTO severity (severity_id, severity_level) VALUES
        (1, 'Early stage'),
        (2, 'Intermediate stage'),
        (3, 'Severe stage')";
    $conn->exec($sql);
}

if ($check_treatment == 0) {
    $sql = "INSERT INTO treatment (treatment_id, treatment_methods, severity_id) VALUES
        (1, 'Use 40 percent phosphonic acid SL mixed with clean water at a ratio of 1:1, inject into the trunk, or drench the soil with 80 percent WP fosetyl-aluminum at 30-50 grams per 20 liters of water.', 1),
        (2, 'Scrape or peel off the affected bark and apply 80 percent WP fosetyl-aluminum (80-100 grams per 1 liter of water) or 25 percent WP metalaxyl (50-60 grams per 1 liter of water).', 2),
        (3, 'Uproot and burn severely infected trees outside the plantation. Apply lime to the soil, let it dry, and improve the soil with organic fertilizer or compost before replanting.', 3)";
    $conn->exec($sql);
}

?>
