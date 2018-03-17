<?php

// "$A == $B" this means "$A is equivalent to $B"

$v1 = 10;
$v2 = 12;

$result = $v1 == $v2;
var_dump($result);  // bool(false)

echo '<br>';

$v3 = 10;
$v4 = '10';

$result = $v3 == $v4;
var_dump($result);  // bool(true)

echo '<br>';

// "$A === $B" this means "$A is the same than $B"

$v5 = 10;
$v6 = '10';

$result = $v5 === $v6;
var_dump($result);  // bool(true)

echo '<br>';

// The "spaceship" : <=> , only allow since the php versión 7
// "$A <=> $B" this means "$A es igual (0), mayor (1) o menor (-1) $B"

$v7 = 10;
$v8 = 20;

$result = $v7 <=> $v8;
var_dump($result);  // bool(true)

