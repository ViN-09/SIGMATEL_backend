<?php

namespace App\Http\Controllers\ttc_paniki_controllers_test;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class checklist extends Controller
{
    protected $connection = 'mysql2';
    protected $connection2 = 'mysql3';//

    private function getPetugasName($nik)
    {
        if (!$nik) return null;

        $petugas = DB::connection($this->connection2)
            ->table('user_bio')
            ->where('id', $nik)
            ->first();

        return $petugas->Nama ?? null;
    }

    private function getPetugasPhone($nik)
    {
        if (!$nik) return null;

        $petugas = DB::connection($this->connection2)
            ->table('user_bio')
            ->where('id', $nik)
            ->first();

        return $petugas->noTELP ?? null;
    }

    private function safeTableFirst($table, $column, $value)
    {
        try {
            return DB::connection($this->connection)
                ->table($table)
                ->where($column, $value)
                ->first();
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function literToCm($liter)
    {
        if ($liter === null || !is_numeric($liter)) {
            return null;
        }

        return round($liter / 60, 2);
    }

    private function cmToLiterHarian($h)
    {
        if ($h === null || !is_numeric($h)) {
            return null;
        }

        $R = 60;
        $L = 220;

        if ($h <= 0) return 0;
        if ($h >= (2 * $R)) $h = 2 * $R;

        $part1 = $R * $R * acos(($R - $h) / $R);
        $part2 = ($R - $h) * sqrt((2 * $R * $h) - ($h * $h));

        $V = ($part1 - $part2) * $L;

        return round($V / 1000, 2);
    }

    private function cmToLiterBulanan($h)
    {
        if ($h === null || !is_numeric($h)) {
            return null;
        }

        $R = 60;
        $L = 220;
        $a = 30;

        if ($h <= 0) return 0;
        if ($h >= (2 * $R)) $h = 2 * $R;

        $part1 = $R * $R * acos(($R - $h) / $R);
        $part2 = ($R - $h) * sqrt((2 * $R * $h) - ($h * $h));

        $V = ($part1 - $part2) * ($L + (2 * $a / (3 * $R)));

        return round($V / 1000, 2);
    }
    private function getGensetByReportDate($reportDateTime)
    {
        if (!$reportDateTime) {
            return [
                'genset1' => null,
                'genset2' => null
            ];
        }

        $reportTime = Carbon::parse($reportDateTime);

        $genset1 = DB::connection($this->connection)
            ->table('genset1')
            ->where('gen_on', '<=', $reportTime)
            ->orderByDesc('gen_on')
            ->first();

        if ($genset1) {

            $genset1->liter_bulanan = $this->cmToLiterBulanan($genset1->tanki_bulanan);
            $genset1->liter_harian  = $this->cmToLiterHarian($genset1->tangki_harian);
        }

        $genset2 = DB::connection($this->connection)
            ->table('genset2')
            ->where('gen_on', '<=', $reportTime)
            ->orderByDesc('gen_on')
            ->first();

        if ($genset2) {

            unset($genset2->tanki_bulanan);

            if (isset($genset2->hours_mater1)) {
                $genset2->hours_mater = $genset2->hours_mater1;
                unset($genset2->hours_mater1);
            }

            unset($genset2->hours_mater2);

            $genset2->liter_harian = $this->cmToLiterHarian($genset2->tangki_harian);
        }

        return [
            'genset1' => $genset1,
            'genset2' => $genset2
        ];
    }

    public function dialyActivityList()
    {
        $start = Carbon::now()->subMonth()->startOfDay();
        $end   = Carbon::now()->endOfDay();

        $rows = DB::connection($this->connection)
            ->table('report_info')
            ->whereBetween('date_time', [$start, $end])
            ->orderByDesc('no_report')
            ->get();

        $list = [];

        foreach ($rows as $r) {
            $jenis = strtolower($r->jenis_report ?? '');
            $report =
                in_array($jenis, ['ceklist', 'checklist']) ? 'Ceklist'
                : ($jenis === 'genset' ? 'Genset' : 'KWH & Suhu');

            $list[] = [
                'no_report' => $r->no_report,
                'Petugas1'  => $this->getPetugasName($r->petugasME),
                'Petugas2'  => $this->getPetugasName($r->petugasME2),
                'Petugas3'  => $this->getPetugasName($r->petugasME3),
                'Petugas4'  => $this->getPetugasName($r->petugasME4),
                'Report'    => $report,
                'Date'      => Carbon::parse($r->date_time)->format('Y-m-d H:i:s'),
            ];
        }

        return response()->json([
            'DialyActivityList' => $list
        ]);
    }

    public function dialyActivityListByMonth($ym)
    {
        if (!preg_match('/^\d{4}-\d{2}$/', $ym)) {
            return response()->json(['error' => 'Format harus YYYY-MM'], 400);
        }

        [$tahun, $bulan] = explode('-', $ym);

        $rows = DB::connection($this->connection)
            ->table('report_info')
            ->whereYear('date_time', (int)$tahun)
            ->whereMonth('date_time', (int)$bulan)
            ->orderByDesc('no_report')
            ->get();

        $list = [];

        foreach ($rows as $r) {
            $jenis = strtolower($r->jenis_report ?? '');
            $report =
                in_array($jenis, ['ceklist', 'checklist']) ? 'Ceklist'
                : ($jenis === 'genset' ? 'Genset' : 'KWH & Suhu');

            $list[] = [
                'no_report' => $r->no_report,
                'Petugas1'  => $this->getPetugasName($r->petugasME),
                'Petugas2'  => $this->getPetugasName($r->petugasME2),
                'Petugas3'  => $this->getPetugasName($r->petugasME3),
                'Petugas4'  => $this->getPetugasName($r->petugasME4),
                'Report'    => $report,
                'Date'      => Carbon::parse($r->date_time)->format('Y-m-d H:i:s'),
            ];
        }

        return response()->json([
            'DialyActivityList' => $list,
            'bulan' => (int)$bulan,
            'tahun' => (int)$tahun
        ]);
    }

    public function pullReport($id, $jenis)
    {
        $id = (int)$id;

        $info = DB::connection($this->connection)
            ->table('report_info')
            ->where('no_report', $id)
            ->first();

        if (!$info) {
            return response()->json([
                'success' => false,
                'message' => 'Report tidak ditemukan'
            ]);
        }

        $genset = $this->getGensetByReportDate($info->date_time);

        return response()->json([
            'success' => true,
            'data' => [

                'genset' => $genset,

            'report_info' => [
                'petugasME'       => $this->getPetugasName($info->petugasME),
                'petugasMEPhone'  => $this->getPetugasPhone($info->petugasME),

                'petugasME2'      => $this->getPetugasName($info->petugasME2),
                'petugasME2Phone' => $this->getPetugasPhone($info->petugasME2),

                'petugasME3'      => $this->getPetugasName($info->petugasME3),
                'petugasME3Phone' => $this->getPetugasPhone($info->petugasME3),

                'petugasME4'      => $this->getPetugasName($info->petugasME4),
                'petugasME4Phone' => $this->getPetugasPhone($info->petugasME4),

                'date_time'       => $info->date_time,
            ],

                'report_kwh'    => $this->safeTableFirst('report_kwh', 'id_report_kwh', $id),
                'report_suhu'   => $this->safeTableFirst('report_suhu', 'id_report_suhu', $id),
                'trafof_c'      => $this->safeTableFirst('trafof_c', 'id', $id),
                'report_lvmdp1' => $this->safeTableFirst('report_lvmdp1', 'id_report_lvmdp1', $id),
                'report_lvmdp2' => $this->safeTableFirst('report_lvmdp2', 'id_report_lvmdp2', $id),
                'load_trafo'    => $this->safeTableFirst('load_trafo', 'id', $id),

                'rec1' => $this->safeTableFirst('rec1', 'id', $id),
                'rec2' => $this->safeTableFirst('rec2', 'id', $id),
                'rec3' => $this->safeTableFirst('rec3', 'id', $id),
                'rec4' => $this->safeTableFirst('rec4', 'id', $id),

                'ups1' => $this->safeTableFirst('ups1', 'id', $id),
                'ups2' => $this->safeTableFirst('ups2', 'id', $id),

                'dcpdu_1' => $this->safeTableFirst('dcpdu_1', 'id', $id),
                'dcpdu_2' => $this->safeTableFirst('dcpdu_2', 'id', $id),
                'dcpdu_3' => $this->safeTableFirst('dcpdu_3', 'id', $id),

                'pac1'  => $this->safeTableFirst('pac1', 'id', $id),
                'pac2'  => $this->safeTableFirst('pac2', 'id', $id),
                'pac3'  => $this->safeTableFirst('pac3', 'id', $id),
                'pac4'  => $this->safeTableFirst('pac4', 'id', $id),
                'pac5'  => $this->safeTableFirst('pac5', 'id', $id),
                'pac6'  => $this->safeTableFirst('pac6', 'id', $id),
                'pac7'  => $this->safeTableFirst('pac7', 'id', $id),
                'pac8'  => $this->safeTableFirst('pac8', 'id', $id),
                'pac9'  => $this->safeTableFirst('pac9', 'id', $id),
                'pac10' => $this->safeTableFirst('pac10', 'id', $id),
                'pac11' => $this->safeTableFirst('pac11', 'id', $id),
                'pac12' => $this->safeTableFirst('pac12', 'id', $id),
                'pac13' => $this->safeTableFirst('pac13', 'id', $id),
                'pac14' => $this->safeTableFirst('pac14', 'id', $id),
                'pac15' => $this->safeTableFirst('pac15', 'id', $id),
            ]
        ]);
    }
}
