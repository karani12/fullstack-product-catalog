<?php

use App\Models\Category;
use App\Models\Product;

test('can list categories', function () {
    Category::factory()->count(3)->create();

    $this->getJson('/api/v1/categories')
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'data' => [
                '*' => ['id', 'name']
            ],
        ])
        ->assertJsonCount(3, 'data');
});

test('can view category with products', function () {
    $category = Category::factory()
        ->has(Product::factory()->count(2))
        ->create();

    $this->getJson("/api/v1/categories/{$category->id}")
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'data' => [
                'id',
                'name',
                'products' => [
                    '*' => ['id', 'name', 'price']
                ],
            ],
        ]);
});

test('returns 404 for non-existent category', function () {
    $this->getJson('/api/v1/categories/999')
        ->assertNotFound()
        ->assertJsonStructure(['message']);
});
