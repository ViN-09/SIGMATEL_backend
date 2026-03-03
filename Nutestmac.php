<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Nutestmac extends Controller
{
    protected $connection2 = 'mysql3';
    // Ubah private → public
    public function test()
    {
        return response()->json([
            'message' => 'hallo ini nau'
        ]);
    }

    public function getAllUsers()
    {
        $allUsers = DB::connection($this->connection2)->table('user_bio')->get();

        return response()->json([
            'data' => $allUsers,
            'fetched_at' => Carbon::now()->toDateTimeString()
        ]);
    }
}
