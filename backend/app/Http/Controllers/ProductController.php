<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service
    ) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->service->list(
            $request->query('page', 1),
            true,
            $request->query('category')
        );

        return response()->api(
            ProductResource::collection($products),
            ttl: 60
        );
    }

    public function show(Product $product)
    {
        $product = $this->service->find($product);

        return response()->api(
            new ProductResource($product),
            ttl: 60
        );
    }
}
