<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends Controller
{

    public function __construct(
        private CategoryService $service
    ) {}
    public function index()
    {
        return response()->api(
            CategoryResource::collection($this->service->list()),
            ttl: 300
        );
    }

    public function show(Category $category)
    {
        return response()->api(
            new CategoryResource($this->service->show($category)),
            ttl: 300
        );
    }
}
