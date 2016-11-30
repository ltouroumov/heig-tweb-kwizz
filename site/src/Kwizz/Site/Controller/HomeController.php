<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 11/28/16
 * Time: 10:47 AM
 */

namespace Kwizz\Site\Controller;

use Kwizz\Utils\Controller;
use Symfony\Component\HttpFoundation as Http;

class HomeController extends Controller
{
    public function index(Http\Request $request) {
        return $this->render('home.twig');
    }
}