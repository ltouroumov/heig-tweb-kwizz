<?php

/**
 * Bootstraps Silex Application
 */
return function() {
    $app = new Silex\Application();

    (require __DIR__.'/config/services.php')($app);
    (require __DIR__.'/config/router.php')($app);

    return $app;
};