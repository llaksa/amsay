<?php

namespace app\Controllers;

use Twig_Loader_Filesystem;

class BaseController {

    protected $templateEngine;

    public function __construct () {
        $loader = new Twig_Loader_Filesystem('../views'); // se especifica desde dónde se cargarán las vistas
        $this->templateEngine = new \Twig_Environment($loader,[
            'debug' => true,
            'cache' => false
        ]);

        $this->templateEngine->addFilter(new \Twig_SimpleFilter('url', function ($path) {
            return BASE_URL . $path;
        })); // filtros: tomar una cadena y formatearla dentro de nuestro template: 'some/endpoint' + BASE_URL!!!
    }

    public function render ($fileName, $data = []) {
        return $this->templateEngine->render($fileName, $data);
    }
}