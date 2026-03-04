<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VisitorLog extends Controller
{
    protected $connection = 'mysql2';


    public function getAllLogs()
    {
        $logs = DB::connection($this->connection)
            ->table('user_activity')
            ->select('id', 'username', 'activity', 'time')
            ->whereMonth('time', now()->month)  
            ->whereYear('time', now()->year)    
            ->orderBy('id', 'desc')
            ->get();

        // Mapping data logs + info bio
        $logs = $logs->map(function ($log) {
            $bio = $this->fetchUserBio($log->username);

            return [
                'id'       => $log->id,
                'username' => $log->username,
                'activity' => $log->activity,
                'time'    => $log->waktu,
                'nama'     => $bio['nama'] ?? null,
                'gambar'   => $bio['gambar'] ?? null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data'   => $logs
        ]);
    }

    /**
     * 🔹 Ambil log berdasarkan username
     */
    public function getLogsByUsername($username)
    {
        $logs = DB::connection($this->connection)
            ->table('user_activity')
            ->where('username', $username)
            ->select('id', 'username', 'activity', 'time')
            ->orderBy('time', 'desc')
            ->get();

        return response()->json([
            'status'   => 'success',
            'username' => $username,
            'data'     => $logs
        ]);
    }

    
    public function addLog(Request $request)
    {
        $username = $request->input('username');
        $activity = $request->input('activity');

        // Validasi input
        if (!$username || !$activity) {
            return response()->json([
                'status'  => 'error',
                'message' => 'username dan activity wajib diisi'
            ], 400);
        }

        // Insert ke database
        DB::connection($this->connection)
            ->table('user_activity')
            ->insert([
                'username' => $username,
                'activity' => $activity,
                'time'    => Carbon::now('Asia/Makassar'),
            ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Log berhasil ditambahkan'
        ]);
    }

   
    private function fetchUserBio($username)
    {
        $bio = DB::connection($this->connection)
            ->table('user_bio')
            ->where('id', $username) 
            ->select('Nama', 'gambar')
            ->first();

        if (!$bio) {
            return [
                'nama'   => null,
                'gambar' => null,
            ];
        }

       
        $firstName = explode(' ', trim($bio->Nama))[0];

        return [
            'nama'   => $firstName,
            'gambar' => $bio->gambar,
        ];
    }
}