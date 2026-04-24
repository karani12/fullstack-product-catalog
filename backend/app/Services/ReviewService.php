<?php

namespace App\Services;

use App\Models\Review;

class ReviewService
{
    public function list()
    {
        return Review::with('product')
            ->latest()
            ->paginate(10);
    }

    public function approve(Review $review): Review
    {
        $review->update([
            'is_approved' => true,
        ]);

        return $review;
    }

    public function reject(Review $review): Review
    {
        $review->update([
            'is_approved' => false,
        ]);

        return $review;
    }

    public function delete(Review $review): void
    {
        $review->delete();
    }
}
