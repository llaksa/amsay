<?php

namespace Vehicles;

require_once 'VehicleBase.php';

class Truck extends VehicleBase {
    private static $count = 0;
    private $type;    

    public function __construct($ownerName, $type) {
        $this->type = $type;
        // parent::__construct($ownerName);
        $this->owner = $ownerName;
        self::$count++; // NO se puede usar la palabra reservada $this para $count porque es estático, para eso PHP nos da la palabra reservada self::
    }

    public static function getTotal () {
        return self::$count;
    }

    public function startEngine () {
        return 'Truck: Start engine<br>';
    }
}