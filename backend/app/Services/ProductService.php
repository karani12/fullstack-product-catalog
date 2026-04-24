<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductService
{
    public function list(int $page = 1)
    {
        return Cache::remember(
            "products.list.page.{$page}",
            60,
            fn() => Product::with('category')->paginate(10, ['*'], 'page', $page)
        );
    }

    public function find(Product $product)
    {
        return Cache::remember(
            "products.detail.{$product->slug}",
            120,
            fn() => $product->load('category')
        );
    }

    public function create(array $data): Product
    {
        $product = Product::create($data);

        Cache::forget("products.list.page.1");

        return $product;
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);

        Cache::forget("products.detail.{$product->slug}");

        return $product;
    }

    public function delete(Product $product): void
    {
        Cache::forget("products.detail.{$product->slug}");

        $product->delete();
    }
}
