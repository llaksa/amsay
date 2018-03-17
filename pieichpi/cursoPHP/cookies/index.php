<?php

// nombre - valor - tiempo actual más 3600 minutos
setcookie('count', '1', time() + 3600);

echo '<p>Cookies</p>';