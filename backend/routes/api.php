<?php

use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
        Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
    });

    // PUBLIC
    Route::post('reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:5,1');

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    // PRIVATE
    Route::prefix('admin')->group(function () {
        Route::middleware('auth:sanctum')->group(function () {

            Route::apiResource('products', AdminProductController::class);

            Route::apiResource('reviews', AdminReviewController::class)->only(['index', 'update', 'destroy']);
        });
    });
});
