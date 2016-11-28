<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 11/28/16
 * Time: 10:44 AM
 */

namespace Kwizz\Api\Controller;

use Kwizz\Utils\Controller;
use Symfony\Component\HttpFoundation as Http;

class RootController extends Controller
{
    public function index(Http\Request $request) {
        return new Http\Response("{}", 200);
    }
}