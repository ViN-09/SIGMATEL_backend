<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    public function show($id)
    {

        $user = DB::connection('db_user')
            ->table('user_bio')
            ->where('id',$id)
            ->whereRaw("LOWER(site) LIKE '%paniki%'")
            ->first();


        if(!$user){
            return response()->json([
                "success"=>false,
                "message"=>"User Paniki tidak ditemukan"
            ],404);
        }


        return response()->json([
            "success"=>true,
            "data"=>[
                "id"=>$user->id,
                "Nama"=>$user->Nama,
                "jabatan"=>$user->jabatan,
                "site"=>"TTC Paniki",
                "tl"=>$user->tl,
                "Alamat"=>$user->Alamat,
                "noTELP"=>$user->noTELP,
                "email"=>$user->email,
                "gambar"=>$user->gambar,
                "idx"=>$user->idx
            ]
        ]);

    }

public function staffList($site, $jabatan)
{
    $jabatan = strtoupper(trim($jabatan));
    $site = strtolower(trim($site));

    $staff = DB::connection('db_user')
        ->table('user_bio')
        ->whereRaw("UPPER(jabatan) LIKE ?", ["%$jabatan%"])
        ->whereRaw("LOWER(site) LIKE ?", ["%$site%"])
        ->orderBy('Nama','asc')
        ->get(['id','Nama']);

    $result = [];

    foreach ($staff as $s) {
        $result[] = [
            "id" => $s->id,
            "Nama" => $s->Nama
        ];
    }

    array_unshift($result, [
        "id" => "-",
        "Nama" => "-"
    ]);

    return response()->json($result);
}

}