<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('user can login and receive token', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email'    => $user->email,
        'password' => 'password',
    ])
        ->assertOk()
        ->assertJsonStructure([
            'message',
            'data' => ['token'],
        ]);
});

test('user can logout with valid token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('api')->plainTextToken;

    $this->withToken($token)
        ->postJson('/api/v1/auth/logout')
        ->assertOk();
});

test('user cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email'    => $user->email,
        'password' => 'wrongpassword',
    ])
        ->assertStatus(401);
});

test('unauthenticated user cannot logout', function () {
    $this->postJson('/api/v1/auth/logout')
        ->assertUnauthorized();
});
