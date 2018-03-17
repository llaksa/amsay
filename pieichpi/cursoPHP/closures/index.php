<?php

// $var2 = 1;

// $var = function () use ($var2) {
//     echo 'This is a closure<br>';
//     echo 'value ' . $var2;
// };

// $var();

$z = 3;

$numbers = [1, 2, 3, 4, 5];

$closure = function ($n) use ($z) {
    return $n * $z;
};

$z = 4;

$result = array_map($closure, $numbers);

var_dump($result);