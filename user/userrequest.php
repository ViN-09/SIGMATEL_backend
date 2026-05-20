<?php

namespace App\Http\Controllers\user;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

Carbon::setLocale('id');

class userrequest extends Controller
{
    protected $connection = 'mysql3';

    public function stafflist($site, $jabatan)
{
    // mapping site dari URL ke DB
    $siteMap = [
        'ttc_teling'  => 'TTC Teling',
        'ttc_paniki' => 'TTC Paniki',
    ];

    // validasi site
    if (!isset($siteMap[$site])) {
        return response()->json([
            'message' => 'Site tidak valid'
        ], 400);
    }

    $dbSite = $siteMap[$site];

    $data = DB::connection($this->connection)
        ->table('user_bio')
        ->select('id', 'Nama')
        ->where('site', $dbSite)
        ->where('jabatan', $jabatan)
        ->orderBy('Nama', 'asc')
        ->get()
        ->prepend([
            'id' => '-',
            'Nama' => '-'
        ]);

    return response()->json($data);
}



// private function fetchUserBio($username)
//     {
//         $bio = DB::connection($this->connection)
//             ->table('user_bio')
//             ->where('id', $username) // join pake user_activity.username ↔ user_bio.id
//             ->select('Nama', 'gambar')
//             ->first();

//         if (!$bio) {
//             return null;
//         }

//         // Ambil kata pertama dari Nama
//         $firstName = explode(' ', trim($bio->Nama))[0];

//         return [
//             'nama'   => $firstName,
//             'gambar' => $bio->gambar,
//         ];
//     }



}