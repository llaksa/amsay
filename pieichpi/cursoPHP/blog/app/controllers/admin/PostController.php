<?php


namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\BlogPost;
use Sirius\Validation\Validator;

class PostController extends BaseController {

    public function getIndex() {
        $blogPosts = BlogPost::all();
        return $this->render('admin/posts.twig', ['blogPosts' => $blogPosts]);
    }

    public function getCreate() {
        return $this->render('admin/insert-post.twig');
    }

    public function postCreate() {
        $errors = [];
        $result = false;

        $validator = new Validator();
        $validator->add('title', 'required'); // validaciones
        $validator->add('content', 'required');

        if ($validator->validate($_POST)) {
            $blogPost = new BlogPost([
                'title' => $_POST['title'],
                'content' => $_POST['content']
            ]);
            if ($_POST['img']) {
                $blogPost->img_url = $_POST['img'];
            }
            $blogPost->save();
            $result = true;
        } else {
            $errors = $validator->getMessages(); // en caso de errores
        }

        return $this->render('admin/insert-post.twig', [
            'result' => $result,
            'errors' => $errors
        ]);
    }
}

/* CAMBIO DEBIDO AL USO DE ELOQUENT
namespace app\controllers\admin;

use app\controllers\BaseController;

class PostController extends BaseController {
    public function getIndex () { // or anyIndex () {
        // respnderá a admin/posts or admin/posts/index como por arte de magia pero solo métodos GET, get + Index ---> / or /index
        global $pdo;

        $query = $pdo->prepare('SELECT * FROM blog_posts ORDER BY id DESC');
        $query->execute();

        $blogPosts = $query->fetchAll(\PDO::FETCH_ASSOC); // "\" before PDO to access to a class out the definied namespace
        // $blogPosts = $query->fetchAll(PDO::FETCH_ASSOC);
        return $this->render('admin/posts.twig', ['blogPosts' => $blogPosts]);
    }

    public function getCreate () {
        // responderá a admin/posts/create como por arte de magia solo GET methods, get + Create ---> /create
        return $this->render('admin/insert-post.twig');
    }

    public function postCreate () {
        // responderá a admin/posts/create como por arte de magia solo POST methods, post + Create ---> /create        
        global $pdo;

        $sql = 'INSERT INTO blog_posts (title, content) VALUE (:title, :content)';
        $query = $pdo->prepare($sql);
        $result = $query->execute([
            'title' => $_POST['title'],
            'content' => $_POST['content']
        ]);

        return $this->render('admin/insert-post.twig', ['result' => $result]);
    }

*/
