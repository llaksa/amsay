<?php

namespace Vehicles;

abstract class VehicleBase {
    // private $owner; si se usa parent::__construct... en las clases hijas puede usarse "private" nada más
    protected $owner; // el $type sigue siendo privado pero puede ser manipulado por clases hijas

    public function __construct($ownerName) {
        $this->owner = $ownerName;
        echo 'construct<br>'; // por lo general el constructor se usa para inicializar valores o recibir parámetros para el objeto
    }

    // public function __destruct() { // después que terminan las instancias $car y #car2 , inmediatamente se ejecuta la función destructor automaticamente
    //     echo 'destructor<br>';
    // }

    public function move() {
        echo $this->startEngine();
        echo 'moving<br><br>';
    }

    public function getOwner() {
        return $this->owner;
    }

    /* Ya no es necesario porque existe el método constructor
    public function setOwner($owner) {
        $this->owner = $owner;
    }
    */

    public abstract function startEngine ();
}