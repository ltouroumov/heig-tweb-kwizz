<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 11/30/16
 * Time: 1:13 PM
 */

namespace Kwizz\Site\Controller;


use Kwizz\Utils\Controller;

class AppController extends Controller
{

    public function index() {
        return $this->render('app/index.twig');
    }

    public function login() {
        return $this->render('app/login.twig');
    }

    public function student() {
        return $this->render('app/student.twig');
    }

    public function prof() {
        return $this->render('app/prof.twig');
    }

}