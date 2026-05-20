<?php

namespace App\Http\Controllers\user;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

Carbon::setLocale('id');

class login extends Controller
{
    protected $connection = 'mysql3';
    protected $siteConnections = [
    'TTC Teling'  => 'mysql',
    'TTC Paniki'  => 'mysql2',
];

    protected function getConnectionBySite($site)
{
    return $this->siteConnections[$site] ?? $this->connection;
}


    protected function addActivity($username, $activity, $connection)
{
    try {
        DB::connection($connection)
            ->table('user_activity')
            ->insert([
                'username' => $username,
                'activity' => $activity,
                'time'     => Carbon::now('Asia/Makassar'),
            ]);
    } catch (\Exception $e) {
        \Log::error("Gagal insert user_activity ({$connection}): " . $e->getMessage());
    }
}


    public function cekLogin(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required|string'
        ]);

        $username = $request->input('username');
        $password = $request->input('password');

        $user = DB::connection($this->connection)
            ->table('user')
            ->where('id', $username) 
            ->first();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (!Hash::check($password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Password salah'
            ], 401);
        }

        $bio = DB::connection($this->connection)
            ->table('user_bio')
            ->where('id', $user->id)
            ->first();

        if (!$bio) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Data bio tidak ditemukan'
            ], 404);
        }

        $targetConnection = $this->getConnectionBySite($bio->site);

$this->addActivity(
    $user->id,
    "Login",
    $targetConnection
);


        return response()->json([
            'status'  => 'success',
            'message' => 'Login berhasil',
            'data'    => array_merge(
                ['auth' => $user->auth],
                (array) $bio
            )
        ]);
    }
}
