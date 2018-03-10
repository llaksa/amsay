<?php

// array
$arrayVar1 = ['red', 'blue', 'black'];
var_dump($arrayVar1);

echo '<br>';
echo '<br>';

$arrayVar2 = [
    0 => 'red',
    1 => 'blue',
    2 => 'green'
];
var_dump($arrayVar2);

echo '<br>';
echo '<br>';

$arrayVar3 = [
    'color' => 'red',
    'color2' => 'blue',
    3 => 'black'
];
var_dump($arrayVar3);

echo '<br>';
echo '<br>';

// array[number]
var_dump($arrayVar3[3]);

echo '<br>';
echo '<br>';

$array1 = [
    0 => 'a',
    1 => 'b',
    2 => 'c'
];

$array2 = [
    3 => 'd',
    4 => 'e'
];

// Lo siguiente más que una suma es una operación de unión basada en índices
$result = $array1 + $array2;
var_dump($result);