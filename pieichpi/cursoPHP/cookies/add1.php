<?php

$value = $_COOKIE['count'];
$value++;

setcookie('count', $value);

echo '<p>Adding 1</p>';