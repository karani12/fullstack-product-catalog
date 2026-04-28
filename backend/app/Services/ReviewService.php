<?php

namespace App\Services;

use App\Models\Review;
use Illuminate\Support\Facades\Cache;

class ReviewService
{
    public function list()
    {
        return Cache::remember(
            'reviews.all',
            300,
            fn() => Review::with('product')
                ->latest()
                ->get()
        );
    }

    public function create(array $data): Review
    {

        Cache::forget('reviews.all');
        Cache::forget('products.all');
        Cache::forget('products.all');

        return Review::create([
            'product_id' => $data['product_id'],
            'reviewer_name' => $data['reviewer_name'],
            'email' => $data['email'],
            'rating' => $data['rating'],
            'body' => $data['body'],
            'is_approved' => false,
        ]);
    }

    public function update(Review $review, array $data): Review
    {

        Cache::forget('reviews.all');
        Cache::forget('products.all');
        Cache::forget('products.published.page.1');

        $review->update($data);
        return $review->refresh();
    }

    public function delete(Review $review): void
    {

        Cache::forget('reviews.all');
        $review->delete();
    }
}
