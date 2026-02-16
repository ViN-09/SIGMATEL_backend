<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function show($id)
    {
        $user = DB::table('user_bio')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'Nama' => $user->Nama,
                'jabatan' => $user->jabatan,
                'site' => 'TTC Paniki',
                'tl' => $user->tl,
                'Alamat' => $user->Alamat,
                'noTELP' => $user->noTELP,
                'email' => $user->email,
                'gambar' => $user->gambar,
                'idx' => $user->idx
            ]
        ]);
    }
}
