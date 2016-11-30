<?php


use Silex\Application;
/**
 * Configures application routes
 */
return function(Application $app) {
    $app->get('/', 'HomeController::index');
    $app->get('/app', 'AppController::index');
    $app->get('/app/login', 'AppController::login');
    $app->get('/app/student', 'AppController::student');
    $app->get('/app/prof', 'AppController::prof');
};