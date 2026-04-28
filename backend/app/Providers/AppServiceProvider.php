<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Response::macro('api', function (
            mixed $data = null,
            string $message = 'OK',
            int $status = 200,
            array $errors = [],
            int $ttl = 60
        ) {
            if ($data instanceof ResourceCollection) {
                $payload = $data->response()->getData(true);
                $body = [
                    'message' => $message,
                    'data' => $payload['data'],
                    'meta' => $payload['meta'] ?? [],
                    'links' => $payload['links'] ?? [],
                    'errors' => $errors,
                ];
            } else {
                $body = [
                    'message' => $message,
                    'data' => $data,
                    'errors' => $errors,
                ];
            }

            $response = response()->json($body, $status);

            if (request()->isMethod('GET')) {
                $response->header('Cache-Control', "public, max-age={$ttl}");
            }

            return $response;
        });
    }
}
