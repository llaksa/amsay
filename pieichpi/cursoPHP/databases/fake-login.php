<?php

$user = null;
$query = null;

if (!empty($_POST)) {
    require_once 'config.php';

    // Permitiendo SQL injection:
    // $query = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "' AND password = '" . md5($_POST['password']) . "'";
    // $queryResult = $pdo->query($query);

    // $user = $queryResult->fetch(PDO::FETCH_ASSOC);
   
    $query = "SELECT * FROM users WHERE email = :email AND password = :password";
    $prepared = $pdo->prepare($query);
    $prepared->execute([
        'email' => $_POST['email'],
        'password' => md5($_POST['password'])
    ]);

    $user = $prepared->fetch(PDO::FETCH_ASSOC);
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
        <h1>Fake Login</h1>
        <a href="index.php">Home</a>
        <form action="fake-login.php" method="post">
            <label for="">Email</label>
            <input type="text" name="email" id="email">
            <br>
            <label for="">Password</label>
            <input type="password" name="password" id="password">
            <br>
            <input type="submit" value="save">
        </form>
        <h2>Query</h2>
        <div>
            <?php
                print_r($query);
            ?>
        </div>
        <h2>User Data</h2>
        <div>
            <?php
                print_r($user);
            ?>
        </div>
    </div>
</body>
</html>