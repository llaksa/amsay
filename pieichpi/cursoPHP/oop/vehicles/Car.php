<?php

namespace Vehicles;

require_once 'VehicleBase.php';
require_once 'GPSTrait.php';

class Car extends VehicleBase implements \Serializable {

    use GPSTrait;

    public function move () {
        echo $this->startEngine() . '<br>';
        echo'Car. moving<br>';
    }

    public function startEngine () {
        return 'Car: Start engine';
    }

    // una función propia de una clase de php es serialize de la interfaz serializable
    public function serialize () {
        echo 'Serialize<br>';
        return $this->owner;
    }

    // una función propia de una clase de php es unserialize de la interfaz serializable
    public function unserialize($serialized) {
        echo 'Unserialize<br>';
        $this->owner = $serialized;
    }
}