<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\BagController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/assets', [AssetController::class, 'index']);
Route::get('/assets/{id}', [AssetController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/bag', [BagController::class, 'index']);
    Route::post('/bag/{assetId}', [BagController::class, 'add']);
    Route::delete('/bag/{assetId}', [BagController::class, 'remove']);
});
