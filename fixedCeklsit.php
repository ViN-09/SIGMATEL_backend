<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

Carbon::setLocale('id');

class fixedCeklsit extends Controller
{
    protected $connection = 'mysql2';
    protected $connection2 = 'mysql3';


    //Helper BBM
    private function calculateBulanan1($tinggi): float
{
    // Radius tangki
    $r = 85.0;

    // Panjang silinder utama
    $length = 413.0;

    // Parameter head/end cap
    $headLength = 20.0;

    // Validasi sensor
    $t = max(
        0.0,
        min((float) $tinggi, $r * 2)
    );

    // Safety acos()
    $acosInput = ($r - $t) / $r;
    $acosInput = max(-1.0, min(1.0, $acosInput));

    // Safety sqrt()
    $sqrtInput = (2 * $r * $t) - ($t * $t);
    $sqrtInput = max(0.0, $sqrtInput);

    // Segment volume (silinder utama)
    $segment =
        ($r * $r * acos($acosInput))
        -
        (($r - $t) * sqrt($sqrtInput));

    // Volume silinder utama
    $mainVolume = $segment * $length;

    // Volume tambahan (head / end cap)
    $volumeTambahan =
        (pi() * $headLength * (3 * $r - $t) * $t * $t)
        / (3 * $r);

    // Total volume
    $total = $mainVolume + $volumeTambahan;

    return round($total, 2);
}

    private function calculateBulanan2($tinggi): float
    {
        // Radius tangki
    $r = 85.0;

    // Panjang silinder utama
    $length = 413.0;

    // Parameter head/end cap
    $headLength = 20.0;

    // Validasi sensor
    $t = max(
        0.0,
        min((float) $tinggi, $r * 2)
    );

    // Safety acos()
    $acosInput = ($r - $t) / $r;
    $acosInput = max(-1.0, min(1.0, $acosInput));

    // Safety sqrt()
    $sqrtInput = (2 * $r * $t) - ($t * $t);
    $sqrtInput = max(0.0, $sqrtInput);

    // Segment volume (silinder utama)
    $segment =
        ($r * $r * acos($acosInput))
        -
        (($r - $t) * sqrt($sqrtInput));

    // Volume silinder utama
    $mainVolume = $segment * $length;

    // Volume tambahan (head / end cap)
    $volumeTambahan =
        (pi() * $headLength * (3 * $r - $t) * $t * $t)
        / (3 * $r);

    // Total volume
    $total = $mainVolume + $volumeTambahan;

    return round($total, 2);
    }

    private function calculateHarian1($tinggi): float
    {
        // Radius tangki
        $r = 45.0;

        // Panjang tangki
        $length = 157.2;

        // Validasi & clamp nilai sensor
        $t = max(
            0.0,
            min((float) $tinggi, $r * 2)
        );

        // Hindari domain error acos()
        $acosInput = ($r - $t) / $r;
        $acosInput = max(-1.0, min(1.0, $acosInput));

        // Hitung akar dengan safety check
        $sqrtInput = (2 * $r * $t) - ($t * $t);
        $sqrtInput = max(0.0, $sqrtInput);

        // Luas segmen lingkaran
        $segmentArea =
            ($r * $r * acos($acosInput))
            -
            (($r - $t) * sqrt($sqrtInput));

        // Volume total
        $hasil = $segmentArea * $length;

        return round($hasil, 2);
    }

    private function calculateHarian2($tinggi): float
    {
        // Radius tangki
        $r = 45.0;

        // Panjang tangki
        $length = 157.2;

        // Validasi & clamp nilai sensor
        $t = max(
            0.0,
            min((float) $tinggi, $r * 2)
        );

        // Hindari domain error acos()
        $acosInput = ($r - $t) / $r;
        $acosInput = max(-1.0, min(1.0, $acosInput));

        // Hitung akar dengan safety check
        $sqrtInput = (2 * $r * $t) - ($t * $t);
        $sqrtInput = max(0.0, $sqrtInput);

        // Luas segmen lingkaran
        $segmentArea =
            ($r * $r * acos($acosInput))
            -
            (($r - $t) * sqrt($sqrtInput));

        // Volume total
        $hasil = $segmentArea * $length;

        return round($hasil, 2);
    }
    //______________________________________________

    // ─────────────────────────────────────────────
    //  HELPERS: DB connection wrappers
    // ─────────────────────────────────────────────

    private function db()
    {
        return DB::connection($this->connection);
    }

    private function db2()
    {
        return DB::connection($this->connection2);
    }

    // ─────────────────────────────────────────────
    //  DAILY ACTIVITY
    // ─────────────────────────────────────────────

    private function getDialyActivityList($monthYear = null)
    {
        $now = now()->setTimezone('Asia/Makassar');

        if ($monthYear && preg_match('/^\d{4}-\d{2}$/', $monthYear)) {
            [$year, $month] = explode('-', $monthYear);
        } else {
            $month = $now->month;
            $year = $now->year;
        }

        return $this->db()
            ->table('report_info')
            ->select('no_report', 'petugasME', 'petugasME2', 'petugasME3', 'petugasME4', 'jenis_report', 'date_time', 'status')
            ->whereIn('jenis_report', ['Ceklist', 'KWH & Suhu', 'Genset1', 'Genset2'])
            ->whereMonth('date_time', $month)
            ->whereYear('date_time', $year)
            ->orderBy('date_time', 'desc')
            ->limit(200)
            ->get();
    }

    private function getUserInfo($id, $field)
    {
        if (empty($id))
            return null;

        $user = $this->db2()
            ->table('user_bio')
            ->select($field)
            ->where('id', $id)
            ->first();

        return $user ? $user->$field : null;
    }

    public function showDialyActivity($monthYear = null)
    {
        $data = $this->getDialyActivityList($monthYear);
        $dialyActivityList = [];

        foreach ($data as $list) {

            $baseData = [
                'no_report' => $list->no_report,
                'Petugas1' => $this->getUserInfo($list->petugasME, 'Nama'),
                'Petugas2' => $this->getUserInfo($list->petugasME2, 'Nama'),
                'Petugas3' => $this->getUserInfo($list->petugasME3, 'Nama'),
                'Petugas4' => $this->getUserInfo($list->petugasME4, 'Nama'),
                'Report' => $list->jenis_report,
                'Date' => $list->date_time,
            ];

            $dialyActivityList[] = $baseData;

            if ($list->jenis_report === 'Ceklist') {
                $extra = $baseData;
                $extra['Report'] = 'KWH_Ceklist';
                $dialyActivityList[] = $extra;
            }
        }

        return response()->json(['DialyActivityList' => $dialyActivityList]);
    }

    // ─────────────────────────────────────────────
    //  TABLE CONFIG
    // ─────────────────────────────────────────────

    private function tableReportList($category = null)
    {
        $data = [
            'staffform' => ['report_info'],
            'property' => ['trafof_c'],
            'power' => ['report_lvmdp1', 'report_lvmdp2', 'load_trafo'],
            'suhu_kwh' => ['report_kwh', 'report_suhu', 'trafof_c'],
            'it_load' => ['rec1', 'rec2', 'rec3', 'rec4', 'ups1', 'ups2', 'dcpdu_1', 'dcpdu_2', 'dcpdu_3'],
            'coling_system' => ['pac1', 'pac2', 'pac3', 'pac4', 'pac5', 'pac6', 'pac7', 'pac8', 'pac9', 'pac10', 'pac11', 'pac12', 'pac13', 'pac14', 'pac15'],
            'genset' => ['genset1', 'genset2'],
        ];

        return $category ? ($data[$category] ?? []) : $data;
    }

    private function getTableConfigByType($type)
    {
        $config = [
            'suhu & kwh' => ['suhu_kwh'],
            'kwh & suhu' => ['suhu_kwh'],
            'kwh_ceklist' => ['suhu_kwh'],
            'genset1' => ['genset'],
            'genset2' => ['genset'],
            'ceklist' => ['suhu_kwh', 'property', 'power', 'it_load', 'coling_system', 'genset'],
        ];

        return $config[$type] ?? [];
    }

    // ─────────────────────────────────────────────
    //  GET SINGLE REPORT
    // ─────────────────────────────────────────────

    public function getReport($id, $type)
    {
        $data = [];
        $data['genset'] = ['genset1' => null, 'genset2' => null];

        $type = strtolower(trim(urldecode($type)));

        if (str_contains($type, 'kwh') && str_contains($type, 'suhu')) {
            $type = 'kwh & suhu';
        }

        $report_info = $this->pull_row_table($id, 'report_info');
        if ($report_info) {
            $data['report_info'] = $this->processReportInfo($report_info);
        }

        $forgensetIndex = $data['report_info']['date_time'] ?? null;
        $tableConfig = $this->getTableConfigByType($type);

        foreach ($tableConfig as $tableCategory) {
            $tables = $this->tableReportList($tableCategory);

            // Closure hitung liter BBM
            $hitungLiter = function ($row, $genset) {
                if (!$row)
                    return null;

                $Tangki_bulanan = $row->tanki_bulanan ?? 0;
                $Tangki_harian = $row->tangki_harian ?? 0;

                if ($genset === 'genset1') {
                    $row->liter_bulanan = round($this->calculateBulanan1($Tangki_bulanan)/1000,2);
                    $row->liter_harian = round($this->calculateHarian1($Tangki_harian)/1000,2);
                } else {
                    $row->liter_bulanan = round($this->calculateBulanan2($Tangki_bulanan)/1000,2);
                    $row->liter_harian = $this->calculateHarian2($Tangki_harian);
                }

                return $row;
            };

            // Kasus ceklist — ambil genset terdekat berdasar tanggal
            if ($tableCategory === 'genset' && $type === 'ceklist') {
                $data['genset'] = [
                    'genset1' => $hitungLiter($this->getGensetRelatedReport('genset1', $forgensetIndex), 'genset1'),
                    'genset2' => $hitungLiter($this->getGensetRelatedReport('genset2', $forgensetIndex), 'genset2'),
                ];
                continue;
            }

            // Kasus genset1 / genset2 spesifik
            if ($tableCategory === 'genset' && in_array($type, ['genset1', 'genset2'])) {
                $data['genset'] = ['genset1' => null, 'genset2' => null];

                foreach ($tables as $table) {
                    if ($type === 'genset1' && str_contains($table, 'genset1')) {
                        $data['genset']['genset1'] = $hitungLiter($this->pull_row_table($id, $table), 'genset1');
                    }
                    if ($type === 'genset2' && str_contains($table, 'genset2')) {
                        $data['genset']['genset2'] = $hitungLiter($this->pull_row_table($id, $table), 'genset2');
                    }
                }
                continue;
            }

            // Loop tabel normal
            foreach ($tables as $table) {
                $data[$table] = $this->pull_row_table($id, $table);
            }
        }

        if (empty($tableConfig)) {
            return response()->json([
                'success' => false,
                'message' => "Kategori '$type' tidak dikenali",
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    // ─────────────────────────────────────────────
    //  PROCESS REPORT INFO
    // ─────────────────────────────────────────────

    private function processReportInfo($reportInfo)
    {
        $processed = [];
        $petugasFields = ['petugasME', 'petugasME2', 'petugasME3', 'petugasME4'];

        foreach ((array) $reportInfo as $key => $value) {
            if (in_array($key, $petugasFields)) {
                $processed[$key] = $this->getUserInfo($value, 'Nama');
                $processed[$key . 'Phone'] = $this->getUserInfo($value, 'noTELP');
            } elseif ($key === 'date_time') {
                $processed[$key] = $value;
            }
        }

        return $processed;
    }

    // ─────────────────────────────────────────────
    //  DB PULL HELPERS
    // ─────────────────────────────────────────────

    private function primaryKeyFor($table): string
    {
        $map = [
            'report_lvmdp1' => 'id_report_lvmdp1',
            'report_lvmdp2' => 'id_report_lvmdp2',
            'report_kwh' => 'id_report_kwh',
            'report_suhu' => 'id_report_suhu',
            'report_info' => 'no_report',
        ];

        return $map[$table] ?? 'id';
    }

    private function pull_row_table($id, $table)
    {
        return $this->db()
            ->table($table)
            ->where($this->primaryKeyFor($table), $id)
            ->first();
    }

    private function pull_row_latest($table)
    {
        $pk = $this->primaryKeyFor($table);

        return $this->db()
            ->table($table)
            ->orderBy($pk, 'desc')
            ->first();
    }

    // ─────────────────────────────────────────────
    //  STAFF LIST
    // ─────────────────────────────────────────────

    public function stafflist($jabatan)
    {
        $data = $this->db()
            ->table('user_bio')
            ->select('id', 'Nama')
            ->where('jabatan', $jabatan)
            ->get()
            ->prepend(['id' => '-', 'Nama' => '-']);

        return response()->json($data);
    }

    // ─────────────────────────────────────────────
    //  FORM GENERATOR — TABLE STRUCTURE
    // ─────────────────────────────────────────────

    private function getTableStructure($tableName)
    {
        $query = "
            SELECT 
                COLUMN_NAME AS Field,
                UPPER(SUBSTRING_INDEX(COLUMN_TYPE, '(', 1)) AS Type
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME   = ?
              AND COLUMN_KEY  <> 'PRI'
            ORDER BY ORDINAL_POSITION
        ";

        return $this->db()->select($query, [$tableName]);
    }

    public function requestTableStructure($table)
    {
        $categories = [
            'staffform' => ['report_info'],
            'property' => ['trafof_c'],
            'power' => ['report_lvmdp1', 'report_lvmdp2', 'load_trafo'],
            'suhu_kwh' => ['report_kwh', 'report_suhu'],
            'it_load' => ['rec1', 'rec2', 'rec3', 'rec4', 'ups1', 'ups2', 'dcpdu_1', 'dcpdu_2', 'dcpdu_3'],
            'coling_system' => ['pac1', 'pac2', 'pac3', 'pac4', 'pac5', 'pac6', 'pac7', 'pac8', 'pac9', 'pac10', 'pac11', 'pac12', 'pac13', 'pac14', 'pac15'],
            'genset1' => ['genset1'],
            'genset2' => ['genset2'],
        ];

        if (!array_key_exists($table, $categories)) {
            return response()->json([
                'error' => "Kategori tabel '{$table}' tidak ditemukan.",
            ], 404);
        }

        $columns = [];

        foreach ($categories[$table] as $tbl) {
            $structure = $this->getTableStructure($tbl);
            $latestRow = $this->pull_row_latest($tbl);

            $columns[$tbl] = array_map(function ($col) use ($latestRow) {
                $field = $col->Field;
                $col->latestValue = $latestRow->$field ?? null;
                return $col;
            }, $structure);
        }

        return response()->json($columns);
    }

    // ─────────────────────────────────────────────
    //  CREATE REPORT ID
    // ─────────────────────────────────────────────

    public function cereateReportID(Request $request)
    {
        $data = $request->all();
        $no_report = null;
        $report_type = null;
        $table = null;
        $payload = null;

        $this->db()->beginTransaction();

        try {
            foreach ($data as $table => $payload) {
                $id = $this->db()->table($table)->insertGetId($payload);
                $row = $this->db()->table($table)->where('no_report', $id)->first();

                if ($row && isset($row->no_report)) {
                    $no_report = $row->no_report;
                    $report_type = $row->jenis_report ?? null;
                }
            }

            $this->db()->commit();

            return response()->json([
                'status' => 'success',
                'no_report' => $no_report,
                'report_type' => $report_type,
            ], 200);

        } catch (\Throwable $e) {
            $this->db()->rollBack();
            Log::error('cereateReportID failed: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat report',
                'debug' => [
                    'table' => $table,
                    'payload' => $payload,
                    'error' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile(),
                ],
            ], 500);
        }
    }

    // ─────────────────────────────────────────────
    //  CREATE REPORT (submit form)
    // ─────────────────────────────────────────────

    public function createReport(Request $request)
    {
        $userInfo = json_decode($request->header('X-User-Info'), true);
        $id = $userInfo['id'] ?? null;
        $data = $request->all();
        $no_report = $data['no_report'] ?? null;
        $report_type = $data['report_type'] ?? null;

        unset($data['no_report'], $data['report_type'], $data['user_report']);

        foreach ($data as $key => &$value) {
            $columnName = $this->primaryKeyFor($key);
            $value = array_merge([$columnName => $no_report], $value);
        }
        unset($value);

        foreach ($data as $table => $fields) {
            $this->insertToDBData([$table => $fields]);
        }

        $response = [
            'status' => 'success',
            'pesan' => 'Data berhasil diterima',
            'no_report' => $no_report,
            'report_type' => $report_type,
            'data' => $data,
            'debug_info' => [
                'received_at' => now()->toDateTimeString(),
                'data_count' => is_array($data) ? count($data) : 'N/A',
                'from_header' => $userInfo ?? null,
            ],
        ];

        $json = json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);

        $this->addActivity($id, 'Submit ' . $report_type);
        $this->fixedSubmit($no_report);

        return response($json, 200)->header('Content-Type', 'application/json');
    }

    // ─────────────────────────────────────────────
    //  DB INSERT HELPERS
    // ─────────────────────────────────────────────

    private function insertToDB(array $data): void
    {
        try {
            foreach ($data as $table => $fields) {
                if (!is_array($fields) || empty($fields))
                    continue;

                $filtered = array_filter($fields, fn($v, $k) => !is_null($v) && $k !== '', ARRAY_FILTER_USE_BOTH);
                if (empty($filtered))
                    continue;

                $this->db()->table($table)->insert($filtered);
            }
        } catch (\Exception $e) {
            Log::error("insertToDB [{$table}] failed: " . $e->getMessage());
            throw $e;
        }
    }

    private function insertToDBData(array $data): void
    {
        try {
            foreach ($data as $table => $fields) {
                if (!is_array($fields) || empty($fields))
                    continue;

                $filtered = array_filter($fields, fn($v, $k) => !is_null($v) && $k !== '', ARRAY_FILTER_USE_BOTH);
                if (empty($filtered))
                    continue;

                $firstKey = array_key_first($filtered);

                $this->db()->table($table)->updateOrInsert(
                    [$firstKey => $filtered[$firstKey]],
                    $filtered
                );
            }
        } catch (\Exception $e) {
            Log::error("insertToDBData [{$table}] failed: " . $e->getMessage());
            throw $e;
        }
    }

    // ─────────────────────────────────────────────
    //  MISC HELPERS
    // ─────────────────────────────────────────────

    private function fixedSubmit($no_report): int
    {
        return $this->db()
            ->table('report_info')
            ->where('no_report', $no_report)
            ->update(['status' => 1]);
    }

    protected function addActivity($username, $activity): void
    {
        try {
            $this->db()->table('user_activity')->insert([
                'username' => $username,
                'activity' => $activity,
                'time' => Carbon::now('Asia/Makassar'),
            ]);
        } catch (\Exception $e) {
            Log::error('addActivity failed: ' . $e->getMessage());
        }
    }

    protected function getGensetRelatedReport($table, $date)
    {
        return $this->db()
            ->table($table)
            ->where('date', '<=', $date)
            ->orderBy('date', 'desc')
            ->limit(1)
            ->first();
    }
}