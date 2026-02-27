<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ProfilesController extends Controller
{
    protected $connection = 'mysql2';

    public function profiles()
    {
        try {

            // ==============================
            // CCTV (contoh hardcode / bisa dari DB)
            // ==============================
            $cctv = [
                "indoor" => 41,
                "outdoor" => 12,
                "merk" => "GRUNDIG",
                "recording_cap" => "56 TB",
                "record_duration" => "90 Hari",
                "jumlah" => 53
            ];

            // ==============================
            // PAC (kalau gagal, tampilkan error seperti contoh)
            // ==============================
            $pac = null;

            try {
                // Kalau nanti PAC sudah ada tabelnya, isi disini
                // $pac = DB::connection($this->connection)->table('pac_profile')->first();

                // sementara dibuat error seperti screenshot
                throw new \Exception("PAC belum dibuat");

            } catch (\Throwable $e) {
                $pac = [
                    "error" => "Failed to generate PAC profile"
                ];
            }

            // ==============================
            // UPS (contoh)
            // ==============================
            $ups = [
                "total_capacity" => 105,
                "total_load" => 4.3,
                "total_bank" => 11,
                "total_ah" => 27,
                "total_battery_cap" => 99,
                "qt_battery" => 464,
                "occupancy" => 4.1,
                "total_ne" => 3,
                "total_system" => 3
            ];

            // ==============================
            // REC (contoh)
            // ==============================
            $rec = [
                "total_capacity" => 666.5,
                "total_load" => 64.7,
                "total_bank" => 13,
                "total_ah" => 12300,
                "total_battery_cap" => 0,
                "occupancy" => 9.71,
                "total_ne" => 9,
                "total_system" => 9
            ];

            // ==============================
            // PLN (contoh)
            // ==============================
            $pln = [
                "kapasitas" => "555",
                "kapasitas_terpakai" => 144,
                "occupancy" => 25.95,
                "supply" => "TIDAK ADA DI DAPOT",
                "tagihan_listrik" => "TIDAK ADA DI DAPOT"
            ];

            // ==============================
            // TRAFO (contoh)
            // ==============================
            $trafo = [
                "jumlah" => 1,
                "capacity" => 1000,
                "occupancy" => 14.4
            ];

            // ==============================
            // GENSET (ambil dari DB atau hardcode)
            // ==============================
            $genset = [
                "1" => [
                    "merk" => "Komatsu",
                    "capacity" => "500",
                    "load" => "133",
                    "remarks" => "Genset 1"
                ],
                "2" => [
                    "merk" => "Komatsu",
                    "capacity" => "350",
                    "load" => "79",
                    "remarks" => "Genset 2a"
                ]
            ];

            return response()->json([
                "success" => true,
                "message" => "All profile data retrieved successfully",
                "data" => [
                    "CCTV" => $cctv,
                    "PAC" => $pac,
                    "UPS" => $ups,
                    "REC" => $rec,
                    "PLN" => $pln,
                    "TRAVO" => $trafo,
                    "GENSET" => $genset
                ]
            ]);

        } catch (\Throwable $e) {

            return response()->json([
                "success" => false,
                "message" => "Failed to retrieve profiles",
                "error" => $e->getMessage()
            ], 500);

        }
    }
}
