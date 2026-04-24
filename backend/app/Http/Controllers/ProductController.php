<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $service
    ) {}

    /**
     * Paginated listing (cached)
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
     * Show single product (cached)
     */
    public function show(Product $product)
    {
        $product = $this->service->find($product);

        return response()->api(
            new ProductResource($product)
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

        return response()->api(
            null,
            'Product deleted',
            204
        );
    }
}
