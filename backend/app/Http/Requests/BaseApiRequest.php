<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

abstract class BaseApiRequest extends FormRequest
{
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->api(
                data: null,
                message: 'Validation failed',
                status: 422,
                errors: $validator->errors()->toArray()
            )
        );
    }

    protected function failedAuthorization(): void
    {
        throw new HttpResponseException(
            response()->api(
                data: null,
                message: 'Unauthorized',
                status: 403,
                errors: []
            )
        );
    }
}
