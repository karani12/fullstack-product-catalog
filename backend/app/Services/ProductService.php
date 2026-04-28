<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductService
{
    public function list(int $page = 1, bool $publishedOnly = false, ?string $category = null)
    {
        $query = Product::with('category')
            ->when($publishedOnly, fn($q) => $q->published())
            ->when($category, fn($q) => $q->whereHas('category', fn($q) => $q->where('slug', $category)));

        if ($publishedOnly) {
            $key = "products.published.page.{$page}.{$category}";
            return Cache::remember($key, 60, fn() => $query->paginate(10, ['*'], 'page', $page));
        }

        $key = "products.all.{$category}";
        return Cache::remember($key, 60, fn() => $query->get());
    }

    public function find(Product $product)
    {
        return Cache::remember(
            "products.detail.{$product->slug}",
            300,
            fn() => $product->load([
                'category',
                'reviews' => fn($q) => $q->where('is_approved', true),
            ])
        );
    }

    public function create(array $data): Product
    {
        $product = Product::create($data);
        $product->load('category');

        Cache::forget('products.all.page.1');
        Cache::forget('products.published.page.1');

        return $product;
    }

    public function update(Product $product, array $data): Product
    {
        $product->update($data);
        Cache::forget('products.all.page.1');
        Cache::forget('products.published.page.1');
        Cache::forget("products.detail.{$product->slug}");

        return $product;
    }

    public function delete(Product $product): void
    {
        Cache::forget('products.all.page.1');
        Cache::forget('products.published.page.1');
        Cache::forget("products.detail.{$product->slug}");
        $product->delete();
    }
}
