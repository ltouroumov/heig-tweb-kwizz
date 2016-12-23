<?php


use Silex\Application;
/**
 * Configures application routes
 */
return function(Application $app) {
    $app->get('/', 'HomeController::index');
    $app->get('/app', 'AppController::index');
    $app->match('/app/login', 'AppController::login');
    $app->match('/app/logout', 'AppController::logout');
    $app->get('/app/student', 'AppController::student');
    $app->get('/app/prof', 'AppController::prof');
};