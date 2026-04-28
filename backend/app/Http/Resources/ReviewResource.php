<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product' => new ProductResource(
                $this->whenLoaded('product')
            ),
            'email' => $request->user() ? $this->email : null,
            'reviewer_name' => $this->reviewer_name,
            'rating' => $this->rating,
            'body' => $this->body,
            'is_approved' => $request->user() ? $this->is_approved : null,
            'created_at' => $this->created_at,
        ];
    }
}
