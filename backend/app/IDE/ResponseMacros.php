<?php

namespace App\IDE;

/**
 * @mixin \Illuminate\Routing\ResponseFactory
 * @mixin \Illuminate\Http\Response
 */
class ResponseMacros
{
    /**
     * Send a standardized JSON API response.
     *
     * @param  mixed                  $data     Payload (model, array, ResourceCollection…)
     * @param  string                 $message  Human-readable status message
     * @param  int                    $status   HTTP status code
     * @param  array                  $errors   Validation / domain errors
     * @param  int                    $ttl      Cache max-age in seconds (GET only)
     * @return \Illuminate\Http\JsonResponse
     */
    public function api(
        mixed $data = null,
        string $message = 'OK',
        int $status = 200,
        array $errors = [],
        int $ttl = 60
    ): \Illuminate\Http\JsonResponse {
        throw new \RuntimeException('Macro not registered.');
    }
}
