<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReviewController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    //PUBLIC
    Route::post('reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:5,1');

    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{category}', [CategoryController::class, 'show']);

    Route::get('reviews', [ReviewController::class, 'index']);

    //PRIVATE
    Route::middleware('auth:sanctum')->group(function () {

        Route::apiResource('products', ProductController::class);
        Route::post('logout', [AuthController::class, 'logout']);

        Route::apiResource('categories', CategoryController::class)
            ->only(['store', 'update', 'destroy']);

        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
        Route::patch('reviews/{review}/approve', [ReviewController::class, 'approve']);
        Route::patch('reviews/{review}/reject', [ReviewController::class, 'reject']);
    });
});
