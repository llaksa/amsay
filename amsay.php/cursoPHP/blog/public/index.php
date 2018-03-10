<?php

/* CAMBIAREMOS EL ARCHIVO PARA MEJORAR LA AUTENTICACIÓN
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../vendor/autoload.php'; // para poder usar las librerías de terceros
// ya no la config.php porque se hará la conexió con eloquent
// include_once '../config.php'; // la conexión de base de datos

session_start(); // con esto se podrá inciar la sesión en cualquier parte

// var_dump($_SERVER['SCRIPT_NAME']); "localhost/my/path/to/the/thisfile.php" i.e.: "localhost/cursoPHP/blog/public/index.php"
// var_dump(basename($_SERVER['SCRIPT_NAME'])) // "thisfile.php" i.e.: "index.php"
$baseDir = str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']); // "localhost/my/path/to/the/"
$baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . $baseDir;
define('BASE_URL', $baseUrl);

$dotenv = new \Dotenv\Dotenv(__DIR__ . '/..'); // recibe el directorio en que se encuentra el "".env""
$dotenv->load();

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => getenv('DB_HOST'), // getenv() es un método para obtener los datos del archivo .env
    'database'  => getenv('DB_NAME'),
    'username'  => getenv('DB_USER'),
    'password'  => getenv('DB_PASS'),
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$route = $_GET['route'] ?? '/';

/* USANDO TWIG YA NO NECESITAMOS la funcion render
function render ($fileName, $params = []) {
    ob_start(); // omite cualquier salida de la app, todo lo almacena internamente en un buffer que es posible modificar
    extract($params); // convierte los índices de un arreglo en variables y las pone como públicas
    include $fileName;

    return ob_get_clean(); // regresa como string todo lo que se hizo después de ob_start() , limpia el buffer
}
*/

// USANDO UN FRONT-CONTROLLER SIMPLE:

/*
switch($route) {
    case '/';
        require '../index.php';
        break;
    case '/admin';
        require '../admin/index.php';
        break;
    case '/admin/posts';
        require '../admin/posts.php';
        break;
}*/

// USANDO LA LIBRERÍA PHROUTER DE COMPOSER


// descomentar - use Phroute\Phroute\RouteCollector;

// descomentar - $router = new RouteCollector();

/*
$router->get('/admin', function () {
    return render('../views/admin/index.php');
});
*/
// EN REEMPLAZO DE $ROUTER->GET()
//descomentar - $router->controller('/admin', app\controllers\admin\IndexController::class);



/*
$router->get('/admin/posts', function () use ($pdo) {
    $query = $pdo->prepare('SELECT * FROM blog_posts ORDER BY id DESC');
    $query->execute();

    $blogPosts = $query->fetchAll(PDO::FETCH_ASSOC);
    return render('../views/admin/posts.php', ['blogPosts' => $blogPosts]);
});
*/
// EN REEMPLAZO DE LO $ROUTER->get
// descometar - $router->controller('/admin/posts', app\controllers\admin\PostController::class);



// descomentar - $router->controller('/admin/users', app\controllers\admin\UserController::class);



/*
$router->get('admin/posts/create', function () {
    return render('../views/admin/insert-post.php');
});
*/



/*
$router->post('admin/posts/create', function () use ($pdo) {
    // $result = false;

    // if (!empty($_POST)) {
    $sql = 'INSERT INTO blog_posts (title, content) VALUE (:title, :content)';
    $query = $pdo->prepare($sql);
    $result = $query->execute([
        'title' => $_POST['title'],
        'content' => $_POST['content']
    ]);
    // }

    return render('../views/admin/insert-post.php', ['result' => $result]);
});
*/



// $router->get('/', function () use ($pdo) { // "use" es para pasar una variable como argumento una función específicca (ponerla en su scope)
    /* Passing it to indexController.php
    $query = $pdo->prepare('SELECT * FROM blog_posts ORDER BY id DESC');
    $query->execute();

    $blogPosts = $query->fetchAll(PDO::FETCH_ASSOC);
    // include '../views/index.php';
    return render('../views/index.php', ['blogPosts' => $blogPosts]); // en lugar de include ../views/index.php
    // return 'Route /';
    */
// });
// EN REEMPLAZO DE router->get();
// descomentar - $router->controller('/', app\controllers\IndexController::Class); // referencia a la clase controller (IndexController)

// descomentar - $dispatcher = new Phroute\Phroute\Dispatcher($router->getData());
// descomentar - $response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $route);

// descomentar - echo $response;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../vendor/autoload.php';

session_start();

$baseDir = str_replace(basename($_SERVER['SCRIPT_NAME']), '', $_SERVER['SCRIPT_NAME']);
$baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . $baseDir;
define('BASE_URL', $baseUrl);

$dotenv = new \Dotenv\Dotenv(__DIR__ . '/..');
$dotenv->load();

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => getenv('DB_HOST'),
    'database'  => getenv('DB_NAME'),
    'username'  => getenv('DB_USER'),
    'password'  => getenv('DB_PASS'),
    'charset'   => 'utf8',
    'collation' => 'utf8_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$route = $_GET['route'] ?? '/';

use Phroute\Phroute\RouteCollector;

$router = new RouteCollector();

$router->filter('auth', function () {
   if (!isset($_SESSION['userId'])) {
       header('Location: ' . BASE_URL . 'auth/login');
       return false;
   }
});

$router->controller('/auth', App\Controllers\AuthController::class);

$router->group(['before' => 'auth'], function ($router) {
    $router->controller('/admin', App\Controllers\Admin\IndexController::class);
    $router->controller('/admin/posts', App\Controllers\Admin\PostController::class);
    $router->controller('/admin/users', App\Controllers\Admin\UserController::class);
});
$router->controller('/', App\Controllers\IndexController::class);

$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());
$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], $route);

echo $response;
