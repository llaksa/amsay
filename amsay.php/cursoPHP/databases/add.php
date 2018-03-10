<?php
//var_dump($_GET);
//var_dump($_POST);

require_once 'config.php';
$result = false;

if (!empty($_POST)) {
    $name = $_POST['name'];
    $email = $_POST['email'];

    $password = md5($_POST['password']);

$sql = "INSERT INTO users(name, email, password) VALUES (:name, :email, :password)";
$query = $pdo->prepare($sql);

$result = $query->execute([
    'name' => $name,
    'email' => $email,
    'password' => $password
]);
}
?>

<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <title>Databases in PHP project</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <h1>Add User</h1>
        <a href="index.php">Home</a>
        <?php
            if ($result == true) {
                echo '<div class="alert alert-success">Success!!!</div>';
            }
        ?>
        <form action="add.php" method="post">
            <label for="">Name</label>
            <input type="text" name="name" id="name">
            <br>
            <label for="">Email</label>
            <input type="text" name="email" id="email">
            <br>
            <label for="">Password</label>
            <input type="password" name="password" id="password">
            <br>
            <input type="submit" value="save">
        </form>
    </div>
</body>
</html>