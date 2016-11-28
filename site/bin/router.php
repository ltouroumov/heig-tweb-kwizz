<?php

$file = __DIR__ . $_SERVER['REQUEST_URI'];
if (is_file($file)) {
    return false;
} else {
    require __DIR__ . '/public/app.php';
}