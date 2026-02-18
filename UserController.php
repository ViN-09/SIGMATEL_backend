<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{

    private function resolveConnectionBySite($site)
    {
        $site = strtolower(trim($site));

        if ($site === 'ttc_paniki') return 'mysql2';
        if ($site === 'ttc_teling') return 'mysql';

        return 'mysql2';
    }

    private function normalizeJabatan($jabatanRaw)
    {
        if (!$jabatanRaw) return null;

        $j = strtoupper(trim($jabatanRaw));

        if (strpos($j, 'ME') !== false) return "ME";
        if (strpos($j, 'HK') !== false) return "HK";
        if (strpos($j, 'BM') !== false) return "BM";
        if (strpos($j, 'SEC') !== false) return "SECURITY";

        // kalau tidak cocok, balikin aslinya
        return strtoupper(trim($jabatanRaw));
    }

    public function show($id)
    {
        $connection = 'mysql2';

        $user = DB::connection($connection)
            ->table('user_bio')
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
                'Nama' => $user->Nama ?? null,
                'jabatan' => $this->normalizeJabatan($user->jabatan ?? null),
                'site' => 'TTC Paniki',
                'tl' => $user->tl ?? null,
                'Alamat' => $user->Alamat ?? null,
                'noTELP' => $user->noTELP ?? null,
                'email' => $user->email ?? null,
                'gambar' => $user->gambar ?? null,
                'idx' => $user->idx ?? null
            ]
        ]);
    }

    public function staffList($site, $jabatan)
    {
        $connection = $this->resolveConnectionBySite($site);

        $jabatan = strtoupper(trim($jabatan));
        if ($jabatan === 'SEC') $jabatan = 'SECURITY';

        $allowed = ["ME", "HK", "BM", "SECURITY"];

        if (!in_array($jabatan, $allowed)) {
            return response()->json([
                "success" => false,
                "message" => "Jabatan hanya boleh: ME, HK, BM, SECURITY"
            ], 400);
        }

        $staff = DB::connection($connection)
            ->table('user_bio')
            ->orderBy('Nama', 'asc')
            ->get(['id', 'Nama', 'jabatan']);

        $filtered = [];

        foreach ($staff as $s) {
            $jab = $this->normalizeJabatan($s->jabatan ?? null);

            if ($jab === $jabatan) {
                $filtered[] = [
                    "id" => $s->id,
                    "Nama" => $s->Nama
                ];
            }
        }

        array_unshift($filtered, [
            "id" => "-",
            "Nama" => "-"
        ]);

        return response()->json($filtered);
    }
}
