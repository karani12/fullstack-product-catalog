<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->api(
                null,
                'Invalid credentials',
                401,
                ['auth' => ['Unauthorized']]
            );
        }

        $user = $request->user();

        return response()->api([
            'token' => $user->createToken('api-token')->plainTextToken,
            'user' => $user,
        ], 'Login successful');
    }

    public function me(Request $request)
    {
        return response()->api($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->api(null, 'Logged out');
    }
}
