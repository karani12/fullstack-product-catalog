<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;

class UpdateReviewRequest extends BaseApiRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id'    => 'sometimes|exists:products,id',
            'reviewer_name' => 'sometimes|string|max:255',
            'email'         => 'sometimes|email',
            'rating'        => 'sometimes|integer|between:1,5',
            'body'          => 'sometimes|string',
            'is_approved'   => 'sometimes|boolean',
        ];
    }
}
