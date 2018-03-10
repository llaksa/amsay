<?php

namespace App\Controllers;

use App\Log;
use App\Models\User;
use Sirius\Validation\Validator;

class AuthController extends BaseController {

    public function getLogin() {
        return $this->render('login.twig');
    }

    public function postLogin() {
        $validator = new Validator();
        $validator->add('email', 'required');
        $validator->add('email', 'email');
        $validator->add('password', 'required');

        if ($validator->validate($_POST)) {
            $user = User::where('email', $_POST['email'])->first(); // compara el campo email de la base de datos con el valor 'email' del post y devuelve el first() element
            if ($user) {
                if (password_verify($_POST['password'], $user->password) // compara el pasword del post con el hash del password de la database) {
                    $_SESSION['userId'] = $user->id; // si la combinación ingresada existe, se crea un usuario de sesión
                    Log::logInfo('Login userId:' . $user->id);
                    header('Location:' . BASE_URL . 'admin'); // permite enviar encabezados en la respuesta
                    return null;
                }
            }

            $validator->addMessage('email', 'Username and/or password does not match'); // mensaje en caso el password ingresado no coincida
        }

        $errors = $validator->getMessages();

        return $this->render('login.twig', [
            'errors' => $errors
        ]);
    }

    public function getLogout() {
        Log::logError('Logout userId:' . $_SESSION['userId']);
        unset($_SESSION['userId']); // borra la sessión
        header('Location: ' . BASE_URL . 'auth/login');
    }
}
