<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class login extends Controller
{
    public function cekLogin(Request $request)
    {
        $id = $request->input('id');           // username = kolom id
        $password = $request->input('password'); // password = kolom password

        // cari user di tabel
        $user = DB::table('user')
            ->where('id', $id)
            ->where('password', $password)
            ->first();

        if ($user) {
            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil',
                'user' => [
                    'id' => $user->id,
                    'auth' => $user->auth
                ]
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'ID atau password salah'
            ], 401);
        }
    }
}
