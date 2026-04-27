<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminProductController extends Controller
{
    public function __construct(
        private ProductService $service
    ) {}

    /**
     * Paginated listing
     */
    public function index(Request $request): JsonResponse
    {
        $products = $this->service->list(
            $request->input('page', 1)
        );

        return response()->api(
            ProductResource::collection($products)
        );
    }

    /**
     * Store product
     */
    public function store(StoreProductRequest $request)
    {
        $product = $this->service->create(
            $request->validated()
        );

        return response()->api(
            new ProductResource($product->load('category')),
            'Product created',
            201
        );
    }

    /**
     * Update product
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $product = $this->service->update(
            $product,
            $request->validated()
        );

        return response()->api(
            new ProductResource($product->load('category')),
            'Product updated'
        );
    }

    /**
     * Delete product
     */
    public function destroy(Product $product)
    {
        $this->service->delete($product);
        return response()->noContent();
    }
}
