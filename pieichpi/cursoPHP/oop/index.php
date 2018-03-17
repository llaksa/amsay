<?php

include 'vehicles/Car.php';
include 'vehicles/Truck.php';
include 'vehicles/ToyCar.php';

// debemos usar el 'use' para que funcione el enlace
// use namespace-name\{object1, object2};
use Vehicles\{Car,Truck, ToyCar};

// $car = new Car();
// $car2 = new Car();

try {
    echo 'Class ToyCar ============<br>';
    $toyCar = new ToyCar('Arberto');
    $toyCar->move();
} catch (Exception $e) {
    echo 'This is a toy<br>';
    // log ...
} finally {
    echo 'finally<br><br>';
}

echo 'Class Car ============<br>';
$car = new Car('Alex');
$car->move();
// echo 'Owner car: ' . $car->getOwner() . '<br>';
echo 'GPS pos: ' . $car->getPos();

// $car->setOwner('Alex');
// $car2 ->setOwner('Max');

echo 'Class Truck 1 ===========<br>';
$truck = new Truck('Max', 'Pickup');
$truck->move();
// echo 'Owner truck: ' . $truck->getOwner();

echo 'Class Truck 2 ===========<br>';
$truck = new Truck('Max', 'Pickup');
$truck->move();

echo 'Total Trucks: ' . Truck::getTotal() . '<br>';

// se genera un error porque vehicleBase es una clase abstarct que no permite ser instanciada en sí misma
// $v1 = new \Vehicles\VehicleBase('Alex');
// $v1->move();

$ser = serialize($car);
$newCar = unserialize($ser);

echo 'NewCar Owner: ' . $newCar->getOwner();