<?php

require __DIR__ . '/../vendor/autoload.php';

$app = (require __DIR__ . '/../twig-app/boot.php')();
$app['debug'] = true;
$app->run();