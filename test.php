<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class test extends Controller
{
    protected $connection = 'mysql2';

    protected $fields = [
        'kw_lv1','kva_lv1','kw_lv2','kva_lv2',
        'total_kva_pln','total_load_pln',
        'kw_ups1','kva_ups1','kw_ups2','kva_ups2',
        'kw_rec1','kva_rec1','kw_rec2','kva_rec2',
        'kw_rec3','kva_rec3','kw_rec4','kva_rec4',
        'total_kva_it_telco','total_load_it_telco','pue',
        'r_lv1', 's_lv1', 't_lv1', 'r_lv2', 's_lv2', 't_lv2',
        'a_rec1', 'a_rec2', 'a_rec3', 'a_rec4',
    ];

    public function post_test(Request $request)
    {
        return response()->json([
            'data' => $request->all()
        ]);
    }

    /**
     * Insert data mentah ke cacepue
     */
    public function pushDPS(Request $request)
    {
        // Ambil hanya field yang diizinkan
        $data = $request->only($this->fields);

        // Tambahkan timestamp manual (optional, kalau DB tidak auto)
        $data['created_at'] = Carbon::now();

        DB::connection($this->connection)
            ->table('cacepue')
            ->insert($data);

        return response()->json([
            'message' => 'Data inserted successfullyyyy',
            'to-check' => $request->only($this->fields),
            'data' => $data
        ]);
    }

    /**
     * Hitung rata-rata dan pindahkan ke data_pue
     */
    public function pushDPM(Request $request)
    {
        // Build query AVG dinamis biar clean
        $selectRaw = collect($this->fields)
            ->map(fn($field) => "AVG($field) as $field")
            ->implode(",\n");

        $avgData = DB::connection($this->connection)
            ->table('cacepue')
            ->selectRaw($selectRaw)
            ->first();

        // Cek jika tidak ada data
        if (!$avgData) {
            return response()->json([
                'message' => 'No data to process'
            ], 400);
        }

        // Convert ke array + pastikan numeric
        $insertData = [];
        foreach ((array) $avgData as $key => $value) {
            $insertData[$key] = is_null($value) ? 0 : (float) $value;
        }

        // Tambahkan kolom date (gunakan DATE saja)
        $insertData['date'] = $insertData['date'] = Carbon::now('Asia/Makassar')->toDateTimeString();

        DB::connection($this->connection)->beginTransaction();

        try {
            // Insert ke data_pue
            DB::connection($this->connection)
                ->table('data_pue')
                ->insert($insertData);

            // Kosongkan tabel cacepue (lebih aman pakai delete)
            DB::connection($this->connection)
                ->table('cacepue')
                ->delete();

            DB::connection($this->connection)->commit();

            return response()->json([
                'message' => 'Data averaged and moved successfully',
                'data' => $insertData
            ]);

        } catch (\Exception $e) {
            DB::connection($this->connection)->rollBack();

            return response()->json([
                'message' => 'Failed to process data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}