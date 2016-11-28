<?php

/**
 * Configures application services
 */
use Kwizz\Utils\ClassControllerResolver;
use Silex\Application;

return function(Application $app) {

    $app->extend('resolver', function ($resolver, $app) {
        return new ClassControllerResolver($app, 'Kwizz\\Site\\Controller', $resolver, $app['callback_resolver']);
    });

    $app->register(new Silex\Provider\TwigServiceProvider(), array(
        'twig.path' => __DIR__.'/../views',
    ));

};