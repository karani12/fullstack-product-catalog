<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryService
{
    public function list()
    {
        return Cache::rememberForever('categories.list', function () {
            return Category::paginate(10);
        });
    }

    public function show(Category $category)
    {
        return Cache::remember(
            "categories.show.{$category->id}",
            300,
            function () use ($category) {
                return $category->load('products');
            }
        );
    }
}
