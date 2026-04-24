<?php

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('guest can submit a review', function () {
    $product = Product::factory()->create();

    $this->postJson('/api/v1/reviews', [
        'product_id'    => $product->id,
        'reviewer_name' => 'John',
        'email'         => 'john@test.com',
        'rating'        => 5,
        'body'          => 'Good product',
    ])
        ->assertCreated()
        ->assertJsonStructure([
            'message',
            'data' => ['id', 'reviewer_name', 'rating', 'body', 'is_approved'],
        ]);

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

test('admin can approve a review', function () {
    Sanctum::actingAs(User::factory()->create());

    $review = Review::factory()->create(['is_approved' => false]);

    $this->patchJson("/api/v1/reviews/{$review->id}/approve")
        ->assertOk()
        ->assertJsonStructure(['message', 'data']);

    $this->assertDatabaseHas('reviews', [
        'id'          => $review->id,
        'is_approved' => true,
    ]);
});

test('admin can reject a review', function () {
    Sanctum::actingAs(User::factory()->create());

    $review = Review::factory()->create(['is_approved' => true]);

    $this->patchJson("/api/v1/reviews/{$review->id}/reject")
        ->assertOk();

    $this->assertDatabaseHas('reviews', [
        'id'          => $review->id,
        'is_approved' => false,
    ]);
});

test('guest cannot approve a review', function () {
    $review = Review::factory()->create(['is_approved' => false]);

    $this->patchJson("/api/v1/reviews/{$review->id}/approve")
        ->assertUnauthorized();
});

test('guest cannot reject a review', function () {
    $review = Review::factory()->create(['is_approved' => true]);

    $this->patchJson("/api/v1/reviews/{$review->id}/reject")
        ->assertUnauthorized();
});
