<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['app' => 'Mushroom Kingdom Asset Explorer API', 'version' => '1.0'];
});
