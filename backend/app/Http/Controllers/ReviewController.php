<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Models\Review;
use App\Services\ReviewService;
use App\Http\Resources\ReviewResource;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $service
    ) {}

    public function index()
    {
        return response()->api(
            ReviewResource::collection($this->service->list())
        );
    }

    public function store(StoreReviewRequest $request)
    {
        $review = $this->service->create($request->validated());

        return response()->api(
            new ReviewResource($review),
            'Review submitted successfully',
            201
        );
    }

    public function approve(Review $review)
    {
        return response()->api(
            new ReviewResource($this->service->approve($review)),
            'Review approved'
        );
    }

    public function reject(Review $review)
    {
        return response()->api(
            new ReviewResource($this->service->reject($review)),
            'Review rejected'
        );
    }

    public function destroy(Review $review)
    {
        $this->service->delete($review);

        return response()->api(
            null,
            'Review deleted',
            204
        );
    }
}
