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
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->api(
                null,
                'Invalid credentials',
                401,
                ['auth' => ['Unauthorized']]
            );
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('api-token')->plainTextToken;

        return response()
            ->api(null, 'Login successful')
            ->header('Authorization', 'Bearer ' . $token);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->api(null, 'Logged out');
    }
}
