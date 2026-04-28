<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Services\ReviewService;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $service
    ) {}


    public function store(StoreReviewRequest $request)
    {
        $this->service->create($request->validated());

        return response()->api(
            [],
            'Review submitted successfully',
            status: 201
        );
    }
}
