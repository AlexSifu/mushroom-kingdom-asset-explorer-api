<?php
// Router for PHP built-in server: send all non-file requests to Laravel front controller.
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$public = __DIR__ . '/public';
if ($uri !== '/' && file_exists($public . $uri) && !is_dir($public . $uri)) {
    return false;
}
chdir(__DIR__);
require $public . '/index.php';
