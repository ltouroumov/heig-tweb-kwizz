<?php

/**
 * Configures application services
 */
use Kwizz\Utils\ClassControllerResolver;

return function(Silex\Application $app) {

    $app->extend('resolver', function ($resolver, $app) {
        return new ClassControllerResolver($app, 'Kwizz\\Api\\Controller', $resolver, $app['callback_resolver']);
    });

};