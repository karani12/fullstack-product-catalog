<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewService;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $service
    ) {}


    public function store(StoreReviewRequest $request)
    {
        $review = $this->service->create($request->validated());

        return response()->api(
            new ReviewResource($review),
            'Review submitted successfully',
            201
        );
    }
}
