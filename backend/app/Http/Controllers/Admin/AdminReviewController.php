<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use App\Services\ReviewService;
use App\Http\Resources\ReviewResource;

class AdminReviewController extends Controller
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

    public function update(UpdateReviewRequest $request, Review $review)
    {
        $review = $this->service->update(
            $review,
            $request->validated()
        );

        return response()->api(
            new ReviewResource($review),
            'Review updated successfully'
        );
    }

    public function destroy(Review $review)
    {
        $this->service->delete($review);

        return response()->noContent();
    }
}
