<?php
// Устанавливаем заголовки CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$servername = "mysql.bf0655846fbb.hosting.myjino.ru";
$username = "j33776368_vlados";
$password = "j33776368_vlados";
$dbname = "j33776368_vlados";

// Создаем соединение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Получаем данные из POST запроса
$name = $_POST['name'];
$tg = $_POST['tg'];
$phone = $_POST['phone'];
$message = $_POST['message'];

// Подготавливаем и выполняем SQL запрос
$stmt = $conn->prepare("INSERT INTO reports (name, tg, phone, message) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $tg, $phone, $message);

$response = array();

if ($stmt->execute()) {
  $response['type'] = 'success';
  $response['message'] = 'Данные успешно сохранены';
} else {
  $response['type'] = 'error';
  $response['message'] = 'Ошибка при сохранении данных: ' . $stmt->error;
}

$stmt->close();
$conn->close();

// Возвращаем ответ в формате JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
