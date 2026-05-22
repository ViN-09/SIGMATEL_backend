<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Monitoring extends Controller
{
    protected $connection = 'mysql2';

    // =====================
    // Clock helper (WITA)
    // =====================
    public function clock(): string
    {
        return Carbon::now('Asia/Makassar')->format('Y-m-d H:i:s');
    }

    // =====================
    // Generate latest PUE
    // =====================
    private function generatePUE(): float
    {
        $latest = DB::connection($this->connection)
            ->table('cacepue')
            ->orderBy('created_at', 'desc')
            ->first();

        return ($latest && isset($latest->pue)) ? (float) $latest->pue : 0.0;
    }

    // =====================
    // Generate daily PUE
    // =====================
    private function generateDailyPUE(): array
    {
        $today = Carbon::parse($this->clock())->toDateString();

        $results = DB::connection($this->connection)->select("
        SELECT DATE_FORMAT(MIN(`date`), '%H:%i') AS jam_interval,
               AVG(pue) AS avg_pue
        FROM data_pue
        WHERE DATE(`date`) = ?
        GROUP BY HOUR(`date`), FLOOR(MINUTE(`date`) / 10)
        ORDER BY jam_interval ASC
    ", [$today]);

        $pueData = [];
        foreach ($results as $row) {
            $pueData[$row->jam_interval] = round((float) $row->avg_pue, 2);
        }

        return $pueData;
    }

    // =====================
    // Generate latest load
    // dari cacepue (kolom sudah individual: kw_rec1..4)
    // =====================
    private function generateLoad(): array
    {
        $latest = DB::connection($this->connection)
            ->table('cacepue')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($latest) {
            $pln = isset($latest->total_load_pln) ? (float) $latest->total_load_pln : 0.0;
            $it = isset($latest->total_load_it_telco) ? (float) $latest->total_load_it_telco : 0.0;
            $facility = $pln - $it;

            return [
                'PLN' => $pln,
                'IT' => $it,
                'Facility' => round($facility, 2),
            ];
        }

        return [
            'PLN' => mt_rand(10, 30) / 10,
            'IT' => mt_rand(10, 30) / 10,
            'Facility' => 0.0,
        ];
    }

    // =====================
    // Generate daily load
    // dari data_pue (kolom sama)
    // =====================
    private function generateDailyLoad(): array
    {
        $today = Carbon::parse($this->clock())->toDateString();

        $results = DB::connection($this->connection)->select("
        SELECT DATE_FORMAT(MIN(`date`), '%H:%i') AS jam_interval,
               AVG(total_load_pln)      AS avg_total_load_pln,
               AVG(total_load_it_telco) AS avg_total_load_it_telco
        FROM data_pue
        WHERE DATE(`date`) = ?
        GROUP BY HOUR(`date`), FLOOR(MINUTE(`date`) / 10)
        ORDER BY jam_interval ASC
    ", [$today]);

        $dailyLoad = [];
        foreach ($results as $row) {
            $pln = round((float) $row->avg_total_load_pln, 2);
            $it = round((float) $row->avg_total_load_it_telco, 2);

            $dailyLoad[$row->jam_interval] = [
                'PLN' => $pln,
                'IT' => $it,
                'Facility' => round($pln - $it, 2),
            ];
        }

        return $dailyLoad;
    }

    // =====================
    // Generate random suhu/humidity
    // =====================
    public function suhu(): array
    {
        $rooms = ['Trafo', 'Genset', 'Battery', 'Transmissi', 'RAN', 'Core', 'CRoom'];
        $SuhuTemp = [];

        foreach ($rooms as $room) {
            if (in_array($room, ['Trafo', 'Genset'])) {
                $SuhuTemp[$room] = [
                    'Suhu' => rand(29, 31),
                    'Humidity' => rand(29, 31),
                ];
            } else {
                $SuhuTemp[$room] = [
                    'Suhu' => 24,
                    'Humidity' => rand(40, 60),
                ];
            }
        }

        return $SuhuTemp;
    }

    // =====================
    // Weekly PUE
    // Disesuaikan: kolom rec individual + tambah ups1/ups2
    // =====================
    public function weeklyPUE(): array
{
    $results = DB::connection($this->connection)->select("
        SELECT
            DATE(`date`)             AS tgl,
            AVG(kw_lv1)              AS avg_kw_lv1,
            AVG(kva_lv1)             AS avg_kva_lv1,
            AVG(kw_lv2)              AS avg_kw_lv2,
            AVG(kva_lv2)             AS avg_kva_lv2,
            AVG(total_kva_pln)       AS avg_total_kva_pln,
            AVG(total_load_pln)      AS avg_total_load_pln,
            AVG(kw_ups1)             AS avg_kw_ups1,
            AVG(kva_ups1)            AS avg_kva_ups1,
            AVG(kw_ups2)             AS avg_kw_ups2,
            AVG(kva_ups2)            AS avg_kva_ups2,
            AVG(kw_rec1)             AS avg_kw_rec1,
            AVG(kva_rec1)            AS avg_kva_rec1,
            AVG(kw_rec2)             AS avg_kw_rec2,
            AVG(kva_rec2)            AS avg_kva_rec2,
            AVG(kw_rec3)             AS avg_kw_rec3,
            AVG(kva_rec3)            AS avg_kva_rec3,
            AVG(kw_rec4)             AS avg_kw_rec4,
            AVG(kva_rec4)            AS avg_kva_rec4,
            AVG(total_kva_it_telco)  AS avg_total_kva_it_telco,
            AVG(total_load_it_telco) AS avg_total_load_it_telco,
            AVG(pue)                 AS avg_pue
        FROM data_pue
        WHERE `date` >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(`date`)
        ORDER BY tgl ASC
    ");

    $weeklyData = [];
    $i = 1;
    foreach ($results as $row) {
        $pln          = round((float) $row->avg_total_load_pln, 2);
        $it           = round((float) $row->avg_total_load_it_telco, 2);
        $loadFacility = round($pln - $it, 2);

        $weeklyData[$i] = [
            'tanggal'             => $row->tgl,
            'kw_lv1'              => round((float) $row->avg_kw_lv1, 2),
            'kw_lv2'              => round((float) $row->avg_kw_lv2, 2),
            'total_load_pln'      => $pln,
            'kw_ups1'             => round((float) $row->avg_kw_ups1, 2),
            'kw_ups2'             => round((float) $row->avg_kw_ups2, 2),
            'kw_rec1'             => round((float) $row->avg_kw_rec1, 2),
            'kw_rec2'             => round((float) $row->avg_kw_rec2, 2),
            'kw_rec3'             => round((float) $row->avg_kw_rec3, 2),
            'kw_rec4'             => round((float) $row->avg_kw_rec4, 2),
            'total_load_it_telco' => $it,
            'load_facility'       => $loadFacility,
            'pue'                 => round((float) $row->avg_pue, 3),
        ];
        $i++;
    }

    return $weeklyData;
}

    // =====================
    // Genset
    // Catatan: genset1 & genset2 pakai 'tanki_bulanan' (typo di DB, ikuti apa adanya)
    // =====================
    private function genset(): array
    {
        $row = DB::connection($this->connection)->selectOne("
            SELECT
                MAX(CASE WHEN src = 'g1' THEN tangki_harian  END) AS g1harian,
                MAX(CASE WHEN src = 'g1' THEN tanki_bulanan  END) AS g1bulanan,
                MAX(CASE WHEN src = 'g2' THEN tangki_harian  END) AS g2harian,
                MAX(CASE WHEN src = 'g2' THEN tanki_bulanan  END) AS g2bulanan
            FROM (
                SELECT * FROM (
                    SELECT 'g1' AS src, tangki_harian, tanki_bulanan, `date`
                    FROM genset1
                    ORDER BY `date` DESC
                    LIMIT 1
                ) g1
                UNION ALL
                SELECT * FROM (
                    SELECT 'g2' AS src, tangki_harian, tanki_bulanan, `date`
                    FROM genset2
                    ORDER BY `date` DESC
                    LIMIT 1
                ) g2
            ) x
        ");

        $g1Harian = (float) ($row->g1harian ?? 0);
        $g1Bulanan = (float) ($row->g1bulanan ?? 0);
        $g2Harian = (float) ($row->g2harian ?? 0);
        $g2Bulanan = (float) ($row->g2bulanan ?? 0);

        // Konversi tinggi tangki → liter (rumus segmen silinder horizontal)
        $g1bulananLiter = round(
            (((90 ** 2) * acos((90 - $g1Bulanan) / 90)
                - ((90 - $g1Bulanan) * sqrt((2 * 90 * $g1Bulanan) - ($g1Bulanan ** 2))))
                * 400) / 1000
        );

        $g1harianLiter = round(
            (((50 ** 2) * acos((50 - $g1Harian) / 50)
                - ((50 - $g1Harian) * sqrt((2 * 50 * $g1Harian) - ($g1Harian ** 2))))
                * 200) / 1000
        );

        $g2bulananLiter = round(
            (((80 ** 2) * acos((80 - $g2Bulanan) / 80)
                - ((80 - $g2Bulanan) * sqrt((2 * 80 * $g2Bulanan) - ($g2Bulanan ** 2))))
                * 500) / 1000
        );

        $g2harianLiter = round(
            (((42.5 ** 2) * acos((42.5 - $g2Harian) / 42.5)
                - ((42.5 - $g2Harian) * sqrt((2 * 42.5 * $g2Harian) - ($g2Harian ** 2))))
                * 180) / 1000
        );

        return [
            'g1harian' => $g1harianLiter,
            'g1bulanan' => $g1bulananLiter,
            'g2harian' => $g2harianLiter,
            'g2bulanan' => $g2bulananLiter,
        ];
    }

    // =====================
    // Public Endpoints
    // =====================
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'pue' => $this->generatePUE(),
        ]);
    }

    public function dailyPUE()
    {
        return response()->json([
            'status' => 'success',
            'value' => $this->generateDailyPUE(),
        ]);
    }

    public function load()
    {
        return response()->json([
            'status' => 'success',
            'load' => $this->generateLoad(),
        ]);
    }

    public function dataMonitoring()
    {
        return response()->json([
            'status' => 'success',
            'pue' => $this->generatePUE(),
            'dailyPUE' => $this->generateDailyPUE(),
            'load' => $this->generateLoad(),
            'dailyLOAD' => $this->generateDailyLoad(),
            'suhuTemp' => $this->suhu(),
            'genset' => $this->genset(),
            'weeklypue' => $this->weeklyPUE(),
            'timestamp' => $this->clock(),
        ]);
    }
}