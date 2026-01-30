<?php

namespace App\Http\Controllers\ttc_paniki_controllers_test;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

Carbon::setLocale('id');

class summary_pue extends Controller
{
    protected $connection = 'mysql2';


    private function pull_row_table($id, $table)
    {
        $columnMap = [
            'report_lvmdp1' => 'id_report_lvmdp1',
            'report_lvmdp2' => 'id_report_lvmdp2',
            'report_kwh' => 'id_report_kwh',
            'report_suhu' => 'id_report_suhu',
            'report_info' => 'no_report',
            // Default primary key untuk tabel lainnya
            'default' => 'id'
        ];

        $column = $columnMap[$table] ?? $columnMap['default'];

        $data = DB::connection($this->connection)
            ->table($table)
            ->where($column, $id)
            ->first();

        if (!$data) {
            return null;
        }

        return $data;
    }

    private function pull_row_latest($table)
    {
        $columnMap = [
            'report_lvmdp1' => 'id_report_lvmdp1',
            'report_lvmdp2' => 'id_report_lvmdp2',
            'report_kwh' => 'id_report_kwh',
            'report_suhu' => 'id_report_suhu',
            'report_info' => 'no_report',
            'default' => 'id'
        ];

        $column = $columnMap[$table] ?? $columnMap['default'];

        $data = DB::connection($this->connection)
            ->table($table)
            ->orderBy($column, 'desc')
            ->first();

        return $data;
    }

    private function getDialyActivityList($startDate = null, $endDate = null, $jenisReport = ['Ceklist'])
    {
        // Jika tidak ada tanggal diberikan, ambil dari awal sampai akhir bulan berjalan
        if (!$startDate || !$endDate) {
            $startDate = now()->startOfMonth()->toDateString();
            $endDate = now()->endOfMonth()->toDateString();
        }

        // Jika $jenisReport berupa string, ubah jadi array agar bisa pakai whereIn
        if (!is_array($jenisReport)) {
            $jenisReport = [$jenisReport];
        }

        return DB::connection($this->connection)
            ->table('report_info')
            ->select(
                'no_report',
                'petugasME',
                'petugasME2',
                'petugasME3',
                'petugasME4',
                'jenis_report',
                'date_time',
                'status'
            )
            ->whereIn('jenis_report', $jenisReport)
            ->whereBetween('date_time', [$startDate, $endDate])
            ->orderBy('date_time', 'desc')
            ->limit(500)
            ->get();
    }

    private function safeMulDiv($a, $b, $divisor = 1000)
    {
        // kalau salah satu operand null atau bukan numeric
        if (!is_numeric($a) || !is_numeric($b)) {
            return null;
        }

        // kalau divisor null atau 0, biar aman
        if (!is_numeric($divisor) || $divisor == 0) {
            return null;
        }

        return ($a * $b) / $divisor;
    }



    public function tableReportList($type, $startDate = null, $endDate = null)
    {
        $categories = [
            'pue' => [
                'report_lvmdp1',
                'report_lvmdp2',
                'load_trafo',
                'rec1',
                'rec2',
                'rec3',
                'rec4',
                'ups1',
                'ups2',
                'report_suhu'
            ],
            'pln' => [
                'report_lvmdp1',
                'report_lvmdp2',
                'load_trafo'
            ],
            'kwh' => ['report_kwh'],
            'suhu' => ['report_suhu'],
            'rectifier' => ['rec1', 'rec2', 'rec3', 'rec4'],
            'ups' => ['ups1', 'ups2'],
            'pac' => ['pac1', 'pac2', 'pac3', 'pac4', 'pac5', 'pac6', 'pac7', 'pac8', 'pac9', 'pac10', 'pac11', 'pac12', 'pac13', 'pac14', 'pac15'],
            'genset1' => ['genset1'],
            'genset2' => ['genset2'],
        ];

        try {
            if (!array_key_exists($type, $categories)) {
                return response()->json([
                    'success' => false,
                    'message' => "Kategori '$type' tidak ditemukan."
                ], 400);
            }

            switch ($type) {
                case 'genset1':
                    $jenisReport = ['Genset1'];
                    break;
                case 'genset2':
                    $jenisReport = ['Genset2'];
                    break;
                case 'kwh':
                case 'suhu':
                    $jenisReport = ['Ceklist', 'KWH & Suhu'];
                    break;
                default:
                    $jenisReport = ['Ceklist'];
                    break;
            }

            $report_property = $this->getDialyActivityList($startDate, $endDate, $jenisReport);
            $data = [];


            switch ($type) {
                case 'genset1':
                    break;
                case 'genset2':
                    break;
                case 'kwh':
                case 'suhu':
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $modify_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;
                        // ambil data dari semua tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw_data[$table] = $this->pull_row_table($row->no_report, $table);

                            // ← tutup foreach tabel di sini
                            // gabung semua hasil jadi satu array datar
                            $data[] = array_merge([
                                'no_report' => $no_report,
                                'date_time' => $date_report,
                            ], $raw_data);
                        }
                    }
                    break;
                case 'pac':
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $modify_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;
                        // ambil data dari semua tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw_data[$table] = $this->pull_row_table($row->no_report, $table);

                            // ← tutup foreach tabel di sini

                            // gabung semua hasil jadi satu array datar
                        }
                        $data[] = array_merge([
                            'no_report' => $no_report,
                            'date_time' => $date_report,
                        ], $raw_data);
                    }
                    break;
                case 'ups':
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $modify_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;
                    
                        // ambil data dari semua tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw = $this->pull_row_table($row->no_report, $table);
                    
                            // fallback aman kalau null
                            if (!$raw) {
                                $raw = (object) [
                                    'no' => $table,
                                    'brand' => '-',
                                    'type' => 0,
                                    'kw' => 0,
                                    'kva' => 0,
                                    'battery' => 0,
                                    'runtime' => 0,
                                    'A' => 0,
                                ];
                            }
                    
                            // hitung occupancy aman (hindari bagi nol)
                            $occupancy = ($raw->type > 0)
                                ? round(($raw->kw * 100) / $raw->type, 2)
                                : 0;
                    
                            // simpan hasil ke array
                            $label = "{$raw->no}-{$raw->brand} ({$raw->type}KW)";
                            $modify_data[$label] = [
                                'kw' => $raw->kw,
                                'kva' => $raw->kva,
                                'occupancy' => $occupancy . '%',
                            ];
                    
                            $raw_data[$table] = $raw; // simpan untuk debug opsional
                        }
                    
                        // gabungkan hasil
                        $data[] = array_merge([
                            'no_report' => $no_report,
                            'date_time' => $date_report,
                        ], $modify_data);
                    }
                    
                    

                    break;
                case 'pln':
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;

                        // 🔹 Ambil data dari semua tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw_data[$table] = $this->pull_row_table($row->no_report, $table) ?? (object) [];
                        }

                        // 🔹 Ambil nilai dengan aman (fallback ke 0 kalau null)
                        $lvmdp1_kw = isset($raw_data['report_lvmdp1']->kw) ? floatval($raw_data['report_lvmdp1']->kw) : 0;
                        $lvmdp2_kw = isset($raw_data['report_lvmdp2']->kw) ? floatval($raw_data['report_lvmdp2']->kw) : 0;
                        $pf = isset($raw_data['load_trafo']->PF) ? floatval($raw_data['load_trafo']->PF) : 0;

                        // 🔹 Hitung total load dan occupancy dengan perlindungan pembagian nol
                        $total_load = $lvmdp1_kw + $lvmdp2_kw;
                        $occupancy = ($pf > 0) ? ($total_load / ($pf * 500)) : 0;

                        // 🔹 Simpan hasil ke dalam array aman
                        $raw_data['total'] = [
                            'load' => $total_load,
                            'occupancy' => round($occupancy, 2) . "%",
                        ];

                        // 🔹 Gabungkan semua hasil jadi satu array datar
                        $data[] = array_merge([
                            'no_report' => $no_report,
                            'date_time' => $date_report,
                        ], $raw_data);
                    }

                    break;
                case 'rectifier':
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $modify_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;

                        // 🔹 Loop tiap tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw = $this->pull_row_table($row->no_report, $table);

                            // kalau null, kasih objek kosong biar gak error
                            if (!$raw) {
                                $raw = (object) [
                                    'Nama' => $table,
                                    'Brand' => '-',
                                    'BebanTotal' => 0,
                                    'CapsRec' => 0,
                                    'TotalLoad' => 0,
                                    'Status' => '-',
                                ];
                            }

                            // ambil nilai aman (gunakan fallback kalau null)
                            $nama = $raw->Nama ?? $table;
                            $brand = $raw->Brand ?? '-';
                            $beban_total = isset($raw->BebanTotal) ? floatval($raw->BebanTotal) : 0;
                            $capacity = isset($raw->CapsRec) ? floatval($raw->CapsRec) : 0;
                            $load = isset($raw->TotalLoad) ? floatval($raw->TotalLoad) : 0;
                            $status = $raw->Status ?? '-';

                            // 🔹 hitung occupancy aman (hindari pembagian nol)
                            $occupancy = $beban_total > 0
                                ? round(($load * 100) / $beban_total, 2) . '%'
                                : '0%';

                            // 🔹 simpan ke array
                            $key = "{$nama} ({$brand})";
                            $modify_data[$key] = [
                                'total_beban' => $beban_total,
                                'capacity' => $capacity,
                                'load' => $load,
                                'Power' => $status,
                                'occupancy' => $occupancy,
                            ];

                            // simpan juga raw kalau mau debugging
                            $raw_data[$table] = $raw;
                        }

                        // 🔹 gabungkan hasil akhir ke array utama
                        $data[] = array_merge([
                            'no_report' => $no_report,
                            'date_time' => $date_report,
                        ], $modify_data);
                    }

                    break;
                default:
                    foreach ($report_property as $row) {
                        $raw_data = [];
                        $modify_data = [];
                        $no_report = $row->no_report;
                        $date_report = $row->date_time;
                        // ambil data dari semua tabel dalam kategori
                        foreach ($categories[$type] as $table) {
                            $raw_data[$table] = $this->pull_row_table($row->no_report, $table);



                            switch ($table) {
                                case 'report_lvmdp1':
                                    $modify_data['lvmdp1']['r'] = $raw_data['report_lvmdp1']->R ?? null;
                                    $modify_data['lvmdp1']['s'] = $raw_data['report_lvmdp1']->S ?? null;
                                    $modify_data['lvmdp1']['t'] = $raw_data['report_lvmdp1']->T ?? null;
                                    $modify_data['lvmdp1']['rn'] = $raw_data['report_lvmdp1']->RN ?? null;
                                    $modify_data['lvmdp1']['sn'] = $raw_data['report_lvmdp1']->SN ?? null;
                                    $modify_data['lvmdp1']['tn'] = $raw_data['report_lvmdp1']->TN ?? null;
                                    $modify_data['lvmdp1']['rs'] = $raw_data['report_lvmdp1']->RS ?? null;
                                    $modify_data['lvmdp1']['st'] = $raw_data['report_lvmdp1']->ST ?? null;
                                    $modify_data['lvmdp1']['tr'] = $raw_data['report_lvmdp1']->TR ?? null;
                                    $modify_data['lvmdp1']['load'] = is_numeric($raw_data['report_lvmdp1']->kw ?? null)
                                        ? $raw_data['report_lvmdp1']->kw : null;
                                    break;

                                case 'report_lvmdp2':
                                    $modify_data['lvmdp2']['r'] = $raw_data['report_lvmdp2']->R ?? null;
                                    $modify_data['lvmdp2']['s'] = $raw_data['report_lvmdp2']->S ?? null;
                                    $modify_data['lvmdp2']['t'] = $raw_data['report_lvmdp2']->T ?? null;
                                    $modify_data['lvmdp2']['rn'] = $raw_data['report_lvmdp2']->RN ?? null;
                                    $modify_data['lvmdp2']['sn'] = $raw_data['report_lvmdp2']->SN ?? null;
                                    $modify_data['lvmdp2']['tn'] = $raw_data['report_lvmdp2']->TN ?? null;
                                    $modify_data['lvmdp2']['rs'] = $raw_data['report_lvmdp2']->RS ?? null;
                                    $modify_data['lvmdp2']['st'] = $raw_data['report_lvmdp2']->ST ?? null;
                                    $modify_data['lvmdp2']['tr'] = $raw_data['report_lvmdp2']->TR ?? null;
                                    $modify_data['lvmdp2']['load'] = is_numeric($raw_data['report_lvmdp2']->kw ?? null)
                                        ? $raw_data['report_lvmdp2']->kw : null;
                                    break;

                                case 'load_trafo':
                                    $modify_data['total_pln']['pf'] = is_numeric($raw_data['load_trafo']->PF ?? null)
                                        ? $raw_data['load_trafo']->PF : null;

                                    $lvmdp1_load = $modify_data['lvmdp1']['load'] ?? 0;
                                    $lvmdp2_load = $modify_data['lvmdp2']['load'] ?? 0;

                                    $sum_load = $lvmdp1_load + $lvmdp2_load;
                                    $modify_data['total_pln']['load'] = ($sum_load > 0) ? round($sum_load, 2) : null;
                                    break;

                                case 'rec1':
                                case 'rec2':
                                case 'rec3':
                                case 'rec4':
                                    $val = $this->safeMulDiv(
                                        $raw_data[$table]->CapsRec ?? null,
                                        $raw_data[$table]->TotalLoad ?? null
                                    );
                                    $modify_data['it_load'][$table] = is_numeric($val) ? round($val, 1) : null;
                                    break;

                                case 'ups1':
                                case 'ups2':
                                    $modify_data['it_load'][$table] = is_numeric($raw_data[$table]->kw ?? null)
                                        ? $raw_data[$table]->kw : null;
                                    break;
                                case 'report_suhu':
                                    $modify_data['suhu_ruang'] = $raw_data[$table];
                                    break;
                                default:
                                    break;
                            }

                            // --- setelah semua rec & ups sudah diisi ---
                            $rec_keys = ['rec1', 'rec2', 'rec3', 'rec4', 'ups1', 'ups2'];
                            $rec_values = array_map(fn($k) => $modify_data['it_load'][$k] ?? null, $rec_keys);
                            $valid_values = array_filter($rec_values, 'is_numeric');

                            $modify_data['it_load']['total'] = count($valid_values)
                                ? round(array_sum($valid_values), 1)
                                : null;

                            // --- hitungan turunan ---
                            $total_pln = $modify_data['total_pln']['load'] ?? null;
                            $total_it = $modify_data['it_load']['total'] ?? null;
                            $pf = $modify_data['total_pln']['pf'] ?? null;

                            $modify_data['calculate']['load_facility'] =
                                (is_numeric($total_pln) && is_numeric($total_it))
                                ? round($total_pln - $total_it, 2)
                                : null;

                            $modify_data['calculate']['pue'] =
                                (is_numeric($total_pln) && is_numeric($total_it) && $total_it > 0)
                                ? round($total_pln / $total_it, 2)
                                : null;

                            $modify_data['calculate']['occ_pln'] =
                                (is_numeric($total_pln) && is_numeric($pf) && $pf > 0)
                                ? round($total_pln / ($pf * 555), 2)
                                : null;
                        }

                        // 🧩 Tambahkan urutan key it_load biar konsisten:
                        $ordered_keys = ['lvmdp1', 'lvmdp2', 'total_pln', 'it_load', 'calculate', 'suhu_ruang'];
                        $modify_data = array_replace(
                            array_fill_keys($ordered_keys, null),
                            $modify_data ?? []
                        );


                        // ← tutup foreach tabel di sini

                        // gabung semua hasil jadi satu array datar
                        $data[] = array_merge([
                            'no_report' => $no_report,
                            'date_time' => $date_report,
                        ], $modify_data);
                    } // ← tutup foreach report di sini

                    break;
            }

            return response()->json([
                'success' => true,
                'message' => "Data report '$type' berhasil diambil",
                'data' => $data,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }







}


