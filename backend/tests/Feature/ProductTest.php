<?php

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

test('can list paginated products', function () {
    Product::factory()->count(15)->create();

    $this->getJson('/api/v1/products')
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'data',
            'meta' => ['current_page', 'total', 'per_page', 'last_page'],
            'links' => ['first', 'last', 'prev', 'next'],
        ])
        ->assertJsonCount(10, 'data');
});

test('can view a product', function () {
    $product = Product::factory()->create();

    $this->getJson("/api/v1/products/{$product->slug}")
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'data' => ['id', 'name', 'price', 'category'],
        ]);
});

test('can create product', function () {
    $category = Category::factory()->create();

    $this->postJson('/api/v1/products', [
        'category_id' => $category->id,
        'name'        => 'Test Product',
        'price'       => 100,
    ])
        ->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => ['id', 'name', 'price', 'category'],
        ]);

    $this->assertDatabaseHas('products', ['name' => 'Test Product']);
});

test('cannot create product with invalid data', function () {
    $this->postJson('/api/v1/products', [])
        ->assertStatus(422)
        ->assertJsonStructure([
            'message',
            'errors' => ['name', 'price', 'category_id'],
        ]);
});

test('can update product', function () {
    $product = Product::factory()->create();

    $this->putJson("/api/v1/products/{$product->slug}", [
        'category_id' => $product->category_id,
        'name'        => 'Updated Name',
        'price'       => 200,
    ])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Name')
        ->assertJsonPath('data.price', '200.00');

    $this->assertDatabaseHas('products', ['name' => 'Updated Name']);
});

test('can delete product', function () {
    $product = Product::factory()->create();

    $this->deleteJson("/api/v1/products/{$product->slug}")
        ->assertStatus(204);

    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});
