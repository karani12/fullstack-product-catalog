<?php

use App\Models\Product;

test('guest can submit a review', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/v1/reviews', [
        'product_id'    => $product->id,
        'reviewer_name' => 'John',
        'email'         => 'john@test.com',
        'rating'        => 5,
        'body'          => 'Good product',
    ])
        ->assertCreated();

    $this->assertDatabaseHas('reviews', [
        'product_id'    => $product->id,
        'reviewer_name' => 'John',
        'is_approved'   => false,
    ]);
});

test('review defaults to unapproved on submission', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/v1/reviews', [
        'product_id'    => $product->id,
        'reviewer_name' => 'Jane',
        'email'         => 'jane@test.com',
        'rating'        => 4,
        'body'          => 'Nice product',
    ])->assertCreated();

    $this->assertDatabaseHas('reviews', [
        'email'       => 'jane@test.com',
        'is_approved' => false,
    ]);
});

test('cannot submit review with invalid data', function () {
    $this->postJson('/api/v1/reviews', [])
        ->assertStatus(422)
        ->assertJsonStructure([
            'message',
            'errors' => ['product_id', 'reviewer_name', 'email', 'rating', 'body'],
        ]);
});

test('cannot submit review with invalid rating', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/v1/reviews', [
        'product_id'    => $product->id,
        'reviewer_name' => 'John',
        'email'         => 'john@test.com',
        'rating'        => 10,
        'body'          => 'Good product',
    ])
        ->assertStatus(422)
        ->assertJsonStructure([
            'message',
            'errors' => ['rating'],
        ]);
});
