<?php
/**
 * Created by PhpStorm.
 * User: ldavid
 * Date: 11/28/16
 * Time: 10:48 AM
 */

namespace Kwizz\Utils;

use Silex\Application;

class Controller
{
    private $app;

    public function setApp(Application $app) {
        $this->app = $app;
    }

}