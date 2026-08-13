<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DataDashboard extends Controller
{
    protected $connection = 'mysql2';

    /**
     * Helper: ambil query builder dengan koneksi yang sudah ditentukan
     */
    private function db()
    {
        return DB::connection($this->connection)->table('data_pue');
    }

    public function hello()
    {
        return response()->json(['message' => 'Hello from Laravel!']);
    }

    /**
     * @param string $tanggal format yyyy-mm-dd
     * @param string $jenis all|daily|3hour|perhour|lowest3hour
     */
    public function puedatadashboard($tanggal, $jenis)
    {
        try {
            $carbonDate = Carbon::parse($tanggal);

            $avgColumns = "
                DATE(`date`) as tanggal,
                HOUR(`date`) as jam,
                AVG(r_lv1) as r_lv1,
                AVG(r_lv1) as s_lv1,
                AVG(r_lv1) as t_lv1,
                AVG(kw_lv1) as kw_lv1,
                AVG(kva_lv1) as kva_lv1,
                AVG(r_lv1) as r_lv2,
                AVG(r_lv1) as s_lv2,
                AVG(r_lv1) as t_lv2,
                AVG(kw_lv2) as kw_lv2,
                AVG(kva_lv2) as kva_lv2,
                AVG(total_kva_pln) as total_kva_pln,
                AVG(total_load_pln) as total_load_pln,
                AVG(kw_ups1) as kw_ups1,
                AVG(kva_ups1) as kva_ups1,
                AVG(kw_ups2) as kw_ups2,
                AVG(kva_ups2) as kva_ups2,
                AVG(a_rec1) as a_rec1,
                AVG(kw_rec1) as kw_rec1,
                AVG(kva_rec1) as kva_rec1,
                AVG(a_rec2) as a_rec2,
                AVG(kw_rec2) as kw_rec2,
                AVG(kva_rec2) as kva_rec2,
                AVG(a_rec3) as a_rec3,
                AVG(kw_rec3) as kw_rec3,
                AVG(kva_rec3) as kva_rec3,
                AVG(a_rec4) as a_rec4,
                AVG(kw_rec4) as kw_rec4,
                AVG(kva_rec4) as kva_rec4,
                AVG(total_kva_it_telco) as total_kva_it_telco,
                AVG(total_load_it_telco) as total_load_it_telco,
                AVG(pue) as pue
            ";

            if ($jenis === 'all') {
                $data = $this->db()
                    ->whereDate('date', $carbonDate->toDateString())
                    ->get();

            } elseif ($jenis === 'daily') {
                $startOfMonth = $carbonDate->copy()->startOfMonth()->toDateString();
                $endOfMonth   = $carbonDate->copy()->endOfMonth()->toDateString();

                $data = $this->db()
                    ->selectRaw($avgColumns)
                    ->whereBetween('date', [$startOfMonth, $endOfMonth])
                    ->groupByRaw("DATE(`date`), HOUR(`date`)")
                    ->orderByRaw("tanggal ASC, jam ASC")
                    ->get();

            } elseif ($jenis === '3hour') {
                $startOfMonth = $carbonDate->copy()->startOfMonth()->toDateString();
                $endOfMonth   = $carbonDate->copy()->endOfMonth()->toDateString();

                $data = $this->db()
                    ->selectRaw($avgColumns)
                    ->whereBetween('date', [$startOfMonth, $endOfMonth])
                    ->whereIn(DB::connection($this->connection)->raw('HOUR(date)'), [8, 15, 20])
                    ->groupByRaw("DATE(`date`), HOUR(`date`)")
                    ->orderByRaw("tanggal ASC, jam ASC")
                    ->get();

            } elseif ($jenis === 'perhour') {
                $data = $this->db()
                    ->selectRaw($avgColumns)
                    ->whereDate('date', $carbonDate->toDateString())
                    ->groupByRaw("DATE(`date`), HOUR(`date`)")
                    ->orderByRaw("jam ASC")
                    ->get();

            } elseif ($jenis === 'lowest3hour') {
                $startOfMonth = $carbonDate->copy()->startOfMonth()->toDateString();
                $endOfMonth   = $carbonDate->copy()->endOfMonth()->toDateString();

                $sub = DB::connection($this->connection)->table('data_pue')
                    ->selectRaw('DATE(date) as tanggal, HOUR(date) as jam, MIN(pue) as min_pue')
                    ->whereBetween('date', [$startOfMonth, $endOfMonth])
                    ->whereIn(DB::connection($this->connection)->raw('HOUR(date)'), [8, 15, 20])
                    ->groupByRaw('DATE(date), HOUR(date)');

                $data = DB::connection($this->connection)->table('data_pue as dp')
                    ->joinSub($sub, 'min_table', function ($join) {
                        $join->on(DB::raw('DATE(dp.date)'), '=', 'min_table.tanggal')
                            ->on(DB::raw('HOUR(dp.date)'), '=', 'min_table.jam')
                            ->on('dp.pue', '=', 'min_table.min_pue');
                    })
                    ->select(
                        DB::raw('DATE(dp.date) as tanggal'),
                        DB::raw('HOUR(dp.date) as jam'),
                        'dp.r_lv1','dp.s_lv1','dp.t_lv1',
                        'dp.kw_lv1',  'dp.kva_lv1',
                        'dp.r_lv2','dp.s_lv2','dp.t_lv2',
                        'dp.kw_lv2',  'dp.kva_lv2',
                        'dp.total_kva_pln',
                        'dp.total_load_pln',
                        'dp.kw_ups1', 'dp.kva_ups1',
                        'dp.kw_ups2', 'dp.kva_ups2',
                        'dp.a_rec1','dp.kw_rec1', 'dp.kva_rec1',
                        'dp.a_rec2','dp.kw_rec2', 'dp.kva_rec2',
                        'dp.a_rec3','dp.kw_rec3', 'dp.kva_rec3',
                        'dp.a_rec4','dp.kw_rec4', 'dp.kva_rec4',
                        'dp.total_kva_it_telco',
                        'dp.total_load_it_telco',
                        'dp.pue'
                    )
                    ->orderByRaw('tanggal ASC, jam ASC')
                    ->get();

            } else {
                return response()->json(['message' => 'Jenis request tidak valid'], 400);
            }

            return response()->json($data);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Terjadi kesalahan', 'error' => $e->getMessage()], 500);
        }
    }
}