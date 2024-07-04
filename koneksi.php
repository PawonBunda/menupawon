<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "if0_35380407_db_pbf";

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Memeriksa koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Query contoh
$sql = "SELECT * FROM tabel_contoh";
$result = $conn->query($sql);

// Menggunakan hasil query
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "Nama: " . $row["nama"] . "<br>";
    }
} else {
    echo "Tidak ada data.";
}

// Menutup koneksi
$conn->close();
?>
