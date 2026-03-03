<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class monitoring extends Controller
{
    protected $connection = 'mysql2';
    public function getLastCachePue()
    {
        try {
            if (!Schema::connection($this->connection)->hasTable('cache_pue')) {
                return response()->json(['error' => 'Table cache_pue not found'], 404);
            }

            $data = DB::connection($this->connection)
                ->table('cache_pue')
                ->orderBy('id', 'desc')
                ->first();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAllPue()
    {
        try {
            if (!Schema::connection($this->connection)->hasTable('pue')) {
                return response()->json(['error' => 'Table pue not found'], 404);
            }

            $data = DB::connection($this->connection)
                ->table('pue')
                ->get();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getAverageData()
{
    try {
        if (!Schema::connection($this->connection)->hasTable('pue')) {
            return response()->json(['error' => 'Table pue not found'], 404);
        }

        $data = DB::connection($this->connection)
            ->table('pue')
            ->selectRaw('
                DATE(tgl) as date,
                ROUND(AVG(avg_it_telco), 2)   as avg_it_telco,
                ROUND(AVG(avg_pln), 2)        as avg_pln,
                ROUND(AVG(avg_pue), 2)        as avg_pue,
                ROUND(AVG(avg_kw_ups1), 2)    as avg_kw_ups1,
                ROUND(AVG(avg_kva_ups1), 2)   as avg_kva_ups1,
                ROUND(AVG(avg_kw_ups2), 2)    as avg_kw_ups2,
                ROUND(AVG(avg_kva_ups2), 2)   as avg_kva_ups2,
                ROUND(AVG(avg_kw_lvmdp1), 2)  as avg_kw_lvmdp1,
                ROUND(AVG(avg_kva_lvmdp1), 2) as avg_kva_lvmdp1,
                ROUND(AVG(avg_kw_lvmdp2), 2)  as avg_kw_lvmdp2,
                ROUND(AVG(avg_kva_lvmdp2), 2) as avg_kva_lvmdp2,
                ROUND(AVG(avg_kw_rec1), 2)    as avg_kw_rec1,
                ROUND(AVG(avg_kva_rec1), 2)   as avg_kva_rec1,
                ROUND(AVG(avg_kw_rec2), 2)    as avg_kw_rec2,
                ROUND(AVG(avg_kva_rec2), 2)   as avg_kva_rec2,
                ROUND(AVG(avg_kw_rec3), 2)    as avg_kw_rec3,
                ROUND(AVG(avg_kva_rec3), 2)   as avg_kva_rec3,
                ROUND(AVG(avg_kw_rec4), 2)    as avg_kw_rec4,
                ROUND(AVG(avg_kva_rec4), 2)   as avg_kva_rec4
            ')
            ->groupBy(DB::raw('DATE(tgl)'))
            ->orderByDesc(DB::raw('DATE(tgl)'))
            ->limit(7)
            ->get();

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function getLastSuhu()
{
    try {
        if (!Schema::connection($this->connection)->hasTable('suhu')) {
            return response()->json(['error' => 'Table suhu not found'], 404);
        }

        $data = DB::connection($this->connection)
            ->table('suhu')
            ->orderByDesc('tgl')
            ->first();

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function getLastTank()
{
    try {
        if (!Schema::connection($this->connection)->hasTable('tank')) {
            return response()->json(['error' => 'Table tank not found'], 404);
        }

        $data = DB::connection($this->connection)
            ->table('tank')
            ->orderByDesc('tgl')
            ->first();

        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

}