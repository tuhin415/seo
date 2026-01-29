<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// DB Config - Update with your Hostinger details
$host = "localhost";
$db_name = "u123456789_seopro"; 
$username = "u123456789_user";   
$password = "YourSecretPassword"; 

try {
    $db = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Auto-create tables if they don't exist
    $db->exec("CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        url TEXT,
        name TEXT,
        country VARCHAR(50),
        project_type VARCHAR(50),
        last_checked BIGINT
    )");
    
    $db->exec("CREATE TABLE IF NOT EXISTS snapshots (
        id VARCHAR(50) PRIMARY KEY,
        project_id VARCHAR(50),
        timestamp BIGINT,
        score INT,
        rank_position INT,
        page_number INT,
        meta_title TEXT,
        meta_description TEXT,
        h1_tag TEXT,
        alt_texts TEXT,
        top_keywords TEXT
    )");

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_SERVER['PATH_INFO']) ? trim($_SERVER['PATH_INFO'], '/') : '';
$request = explode('/', $path);

if ($method == 'OPTIONS') exit;

if ($method == 'GET' && $request[0] == 'projects') {
    $stmt = $db->query("SELECT * FROM projects ORDER BY last_checked DESC");
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($projects as &$p) {
        $st = $db->prepare("SELECT * FROM snapshots WHERE project_id = ? ORDER BY timestamp DESC");
        $st->execute([$p['id']]);
        $p['history'] = $st->fetchAll(PDO::FETCH_ASSOC);
        foreach($p['history'] as &$s) {
            $s['rank'] = (int)$s['rank_position'];
            $s['page'] = (int)$s['page_number'];
            $s['altTexts'] = json_decode($s['alt_texts']);
            $s['topKeywords'] = json_decode($s['top_keywords']);
        }
    }
    echo json_encode($projects);
}

if ($method == 'POST' && $request[0] == 'projects') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("REPLACE INTO projects (id, url, name, country, project_type, last_checked) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['id'], $data['url'], $data['name'], $data['country'], $data['type'], $data['lastChecked']]);
    echo json_encode(["status" => "success"]);
}

if ($method == 'POST' && $request[0] == 'snapshots') {
    $data = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("INSERT INTO snapshots (id, project_id, timestamp, score, rank_position, page_number, meta_title, meta_description, h1_tag, alt_texts, top_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['id'], $data['projectId'], $data['timestamp'], $data['score'], $data['rank'], $data['page'], $data['metaTitle'], $data['metaDescription'], $data['h1Tag'], json_encode($data['altTexts']), json_encode($data['topKeywords'])]);
    echo json_encode(["status" => "success"]);
}

if ($method == 'DELETE' && $request[0] == 'projects') {
    $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$request[1]]);
    echo json_encode(["status" => "deleted"]);
}
?>