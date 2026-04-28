<?php

namespace App\IDE;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;

/**
 * @mixin ResponseFactory
 * @mixin Response
 */
class ResponseMacros
{
    /**
     * Send a standardized JSON API response.
     *
     * @param  mixed  $data  Payload (model, array, ResourceCollection…)
     * @param  string  $message  Human-readable status message
     * @param  int  $status  HTTP status code
     * @param  array  $errors  Validation / domain errors
     * @param  int  $ttl  Cache max-age in seconds (GET only)
     */
    public function api(
        mixed $data = null,
        string $message = 'OK',
        int $status = 200,
        array $errors = [],
        int $ttl = 60
    ): JsonResponse {
        throw new \RuntimeException('Macro not registered.');
    }
}
