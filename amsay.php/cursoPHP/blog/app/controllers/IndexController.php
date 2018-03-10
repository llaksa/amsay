<?php

namespace app\controllers;

class IndexController extends BaseController {
    // public function getIndex () {
    public function getIndex () { // ya con el uso de Twig
        global $pdo; // importa la variable $pdo declarada fuera del scope actual

        $query = $pdo->prepare('SELECT * FROM blog_posts ORDER BY id DESC');
        $query->execute();

        $blogPosts = $query->fetchAll(\PDO::FETCH_ASSOC); // "\" before PDO to access to a class out the definied namespace
        // $blogPosts = $query->fetchAll(PDO::FETCH_ASSOC);
        // include '../views/index.php';
        return $this->render('index.twig', ['blogPosts' => $blogPosts]); // EN -lugar de include ../views/index.php
        // return render('../views/index.php', ['blogPosts' => $blogPosts]); // en lugar de include ../views/index.php
        // return 'Route /';
    }
}