<?php

$intVar = 7;

// comillas simples se usan cuando es texto tal y como está
$stringVar1 = 'Hello $intVar <br>';
echo $stringVar1;

// comillas dobles se usan cuando queremos salir temporalmente del código o evaluar variables
$stringVar2 = "Hello $intVar <br>";
echo $stringVar2;

// php tiene un tipado débil y dinámico:
$someVar2 = 'Hello <br>';
$someVar1 = 7;
$someVar3 = '89';
// - ejemplo con concatenación: predomina el tipo string
echo $someVar1 . $someVar2;
// - ejemplo con una operación aritmética: predomina el tipo númerico
echo $someVar1 + $someVar3;