<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProfilesController extends Controller
{
    protected $connection = 'mysql2';

    private function safeFirst($table)
    {
        try {
            return DB::connection($this->connection)
                ->table($table)
                ->orderByDesc('id')
                ->first();
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function safeGet($table)
    {
        try {
            return DB::connection($this->connection)
                ->table($table)
                ->orderByDesc('id')
                ->get();
        } catch (\Throwable $e) {
            return collect([]);
        }
    }

    private function getCCTVProfile()
    {
        $row = $this->safeFirst('dp_cctv');
        if (!$row) return null;

        $all = $this->safeGet('dp_cctv');

        $indoor = $all->filter(function ($r) {
            return strtolower(trim($r->indoor_outdoor ?? '')) === 'indoor';
        })->sum('total_camera');

        $outdoor = $all->filter(function ($r) {
            return strtolower(trim($r->indoor_outdoor ?? '')) === 'outdoor';
        })->sum('total_camera');

        return [
            "indoor" => (int) $indoor,
            "outdoor" => (int) $outdoor,
            "merk" => $row->merk ?? null,
            "recording_caps" => $row->recording_caps ?? null,
            "record_duration" => $row->record_duration ?? null,
            "jumlah" => (int) ($all->count()),
        ];
    }

    private function getPACProfile()
    {
        $rows = $this->safeGet('dp_pac');
        if ($rows->count() < 1) return null;

        $upFlow = [];
        $downFlow = [];
        $inrow = [];

        $totalKapasitas = 0;
        $upper10 = 0;
        $under10 = 0;

        foreach ($rows as $r) {

            $kw = is_numeric($r->kw ?? null) ? (float)$r->kw : 0;
            $totalKapasitas += $kw;

            $flow = strtolower(trim($r->flow_type ?? ''));

            $flow = str_replace(['-','_'],' ',$flow);

            $acLabel = ($r->brand ?? "AC") . "(" . $kw . " KW)";


            if (strpos($flow,'up') !== false) {

                $upFlow[] = $acLabel;

            }
            elseif (strpos($flow,'down') !== false) {

                $downFlow[] = $acLabel;

            }
            elseif (
                strpos($flow,'row') !== false
                || strpos($flow,'inrow') !== false
                || strpos($flow,'front') !== false
            ) {

                $inrow[] = $acLabel;

            }


            if (!empty($r->installed)) {

                $year = (int) substr($r->installed,0,4);

                if ($year > 0) {

                    $age = date('Y') - $year;

                    if ($age >= 10)
                        $upper10++;
                    else
                        $under10++;
                }
            }
        }


        $totalLoad = round($totalKapasitas * 0.78);

        $occupancy = 0;

        if ($totalKapasitas > 0) {
            $occupancy = round(($totalLoad / $totalKapasitas) * 100,2);
        }


        return [

            "FlowType" => [

                "up_flow" => [
                    "jumlah" => count($upFlow),
                    "ac" => $upFlow
                ],

                "down_flow" => [
                    "jumlah" => count($downFlow),
                    "ac" => $downFlow
                ],

                "inrow" => [
                    "jumlah" => count($inrow)
                ]

            ],

            "total_kapasitas" => (int)$totalKapasitas,

            "setpoint" => "22 - 25",

            "total_load" => (int)$totalLoad,

            "age" => [
                "upper10" => $upper10,
                "under10" => $under10
            ],

            "occupancy" => $occupancy,

            "total_pac" => $rows->count()

        ];
    }
    private function getUPSProfile()
    {
        $rows = $this->safeGet('dp_ups');
        if ($rows->count() < 1) return null;

        $totalCapacity = 0;
        $totalLoad = 0;
        $totalBank = 0;
        $totalAh = 0;
        $totalBatteryCap = 0;
        $totalBatteryQty = 0;
        $totalNE = 0;

        foreach ($rows as $r) {

            $totalCapacity += is_numeric($r->capacity_ups_kva ?? null)
                ? (float)$r->capacity_ups_kva : 0;

            $totalLoad += is_numeric($r->load_ups_kva ?? null)
                ? (float)$r->load_ups_kva : 0;

            $totalBank += is_numeric($r->total_bank ?? null)
                ? (float)$r->total_bank : 0;

            $totalAh += is_numeric($r->ah ?? null)
                ? (float)$r->ah : 0;

            $totalBatteryCap += is_numeric($r->battery_cap ?? null)
                ? (float)$r->battery_cap : 0;

            $totalBatteryQty += is_numeric($r->qt_battery ?? null)
                ? (float)$r->qt_battery : 0;

            $totalNE += is_numeric($r->jumlah_ne ?? null)
                ? (float)$r->jumlah_ne : 0;
        }

        $occupancy = 0;

        if ($totalCapacity > 0) {
            $occupancy = round(($totalLoad / $totalCapacity) * 100,2);
        }


        return [

            "total_capacity" => round($totalCapacity,2),

            "total_load" => round($totalLoad,2),

            "total_bank" => (int)$totalBank,

            "total_ah" => round($totalAh,2),

            "total_battery_cap" => round($totalBatteryCap,2),

            "qt_battery" => (int)$totalBatteryQty,

            "occupancy" => $occupancy,

            "total_ne" => (int)$totalNE,

            "total_system" => $rows->count()

        ];
    }

private function getRECTProfile()
{
    $rows = $this->safeGet('dp_rectifier');
    if ($rows->count() < 1) return null;

    $totalCapacity = 0;
    $totalLoad = 0;
    $totalBank = 0;
    $totalAh = 0;
    $totalBatteryCap = 0;
    $totalNE = 0;

    foreach ($rows as $r) {

        $totalCapacity += is_numeric($r->rec_capacity ?? null)
            ? (float)$r->rec_capacity : 0;

        $totalLoad += is_numeric($r->total_load ?? null)
            ? (float)$r->total_load : 0;

        $totalBank += is_numeric($r->jumlah_bank ?? null)
            ? (float)$r->jumlah_bank : 0;

        $totalAh += is_numeric($r->battery_capacity_ah ?? null)
            ? (float)$r->battery_capacity_ah : 0;

        $totalBatteryCap += is_numeric($r->battery_cap ?? null)
            ? (float)$r->battery_cap : 0;

        $totalNE += is_numeric($r->jumlah_ne ?? null)
            ? (float)$r->jumlah_ne : 0;
    }

    $occupancy = 0;

    if ($totalCapacity > 0) {
        $occupancy = round(($totalLoad / $totalCapacity) * 100, 2);
    }


    return [

        "total_capacity" => round($totalCapacity,2),

        "total_load" => round($totalLoad,2),

        "total_bank" => (int)$totalBank,

        "total_ah" => round($totalAh,2),

        "total_battery_cap" => round($totalBatteryCap,2),

        "occupancy" => $occupancy,

        "total_ne" => $totalNE > 0 ? (int)$totalNE : $rows->count(),

        "total_system" => $rows->count()

    ];
}
    private function getPLNProfile()
    {
        $rows = $this->safeGet('dp_power');
        if ($rows->count() < 1) return null;

        $row = $rows->first();

        return [
            "kapasitas" => $row->capacity_kva ?? null,
            "kapasitas_terpakai" => $row->load_kva ?? null,
            "occupancy" => (is_numeric($row->capacity_kva ?? null) && (float)$row->capacity_kva > 0)
                ? round(((float)$row->load_kva / (float)$row->capacity_kva) * 100, 2)
                : 0,
            "supply" => $row->operation_aging ?? null,
            "tagihan_listrik" => $row->keterangan ?? null,
        ];
    }

    private function getTRAFOProfile()
    {
        $rows = $this->safeGet('dp_trafo');
        if ($rows->count() < 1) return null;

        $total = 0;
        $capacity = 0;

        foreach ($rows as $r) {
            $t = $r->total ?? 0;
            $t = is_numeric($t) ? (float)$t : 0;
            $total += $t;

            $c = $r->capacity ?? 0;
            $c = is_numeric($c) ? (float)$c : 0;
            $capacity += $c;
        }

        return [
            "jumlah" => (int) $rows->count(),
            "capacity" => round($capacity, 2),
            "occupancy" => ($capacity > 0 ? round(($total / $capacity) * 100, 2) : 0),
        ];
    }

    private function getGENSETProfile()
    {
        $rows = $this->safeGet('dp_genset');
        if ($rows->count() < 1) return null;

        $result = [];
        $i = 1;

        foreach ($rows as $r) {
            $result[(string)$i] = [
                "merk" => $r->brand ?? null,
                "capacity" => $r->capacity_kva ?? null,
                "load" => $r->load_kva ?? null,
                "remarks" => $r->remarks ?? ("Genset " . $i),
            ];
            $i++;
        }

        return $result;
    }

    private function getBBMProfile()
    {
        try {

            $g1 = DB::connection($this->connection)->table('genset1')->orderByDesc('id')->first();
            $g2 = DB::connection($this->connection)->table('genset2')->orderByDesc('id')->first();

            if (!$g1 && !$g2) return null;

            $kapasitas = 12000;

            $cmToLiterHarian = function ($h) {
                if ($h === null || !is_numeric($h)) return 0;

                $R = 60;
                $L = 220;

                if ($h <= 0) return 0;
                if ($h >= (2 * $R)) $h = 2 * $R;

                $part1 = $R * $R * acos(($R - $h) / $R);
                $part2 = ($R - $h) * sqrt((2 * $R * $h) - ($h * $h));

                $V = ($part1 - $part2) * $L;
                return round($V / 1000, 2);
            };

            $cmToLiterBulanan = function ($h) {
                if ($h === null || !is_numeric($h)) return 0;

                $R = 60;
                $L = 220;
                $a = 30;

                if ($h <= 0) return 0;
                if ($h >= (2 * $R)) $h = 2 * $R;

                $part1 = $R * $R * acos(($R - $h) / $R);
                $part2 = ($R - $h) * sqrt((2 * $R * $h) - ($h * $h));

                $V = ($part1 - $part2) * ($L + (2 * $a / (3 * $R)));
                return round($V / 1000, 2);
            };

            $literBulanan = 0;
            $literHarian1 = 0;
            $literHarian2 = 0;

            if ($g1) {
                $literBulanan = $cmToLiterBulanan($g1->tanki_bulanan ?? 0);
                $literHarian1 = $cmToLiterHarian($g1->tangki_harian ?? 0);
            }

            if ($g2) {
                $literHarian2 = $cmToLiterHarian($g2->tangki_harian ?? 0);
            }

            $literTotal = round($literBulanan + $literHarian1 + $literHarian2, 2);

            $occupancy = 0;
            if ($kapasitas > 0) {
                $occupancy = round(($literTotal / $kapasitas) * 100, 2);
            }

            $literPerJam = 50;

            $backupTime = 0;
            if ($literPerJam > 0) {
                $backupTime = round($literTotal / $literPerJam, 2);
            }

            return [
                "kapasitas" => (int)$kapasitas,
                "liter_total" => $literTotal,
                "occupancy" => $occupancy,
                "backup_time" => $backupTime
            ];
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function getSPACEProfile()
    {
        $rows = $this->safeGet('dp_space');
        if ($rows->count() < 1) return null;

        $totalSpace = 0;
        $spacePerangkat = 0;
        $spaceCommon = 0;
        $totalRuangPerangkat = 0;

        $lantaiMap = [];

        foreach ($rows as $r) {
            $luas = $r->luas_m2 ?? 0;
            $luas = is_numeric($luas) ? (float)$luas : 0;
            $totalSpace += $luas;

            $terpakai = $r->terpakai_m2 ?? 0;
            $terpakai = is_numeric($terpakai) ? (float)$terpakai : 0;
            $spacePerangkat += $terpakai;

            $tidakTerpakai = $r->tidakterpakai_m2 ?? 0;
            $tidakTerpakai = is_numeric($tidakTerpakai) ? (float)$tidakTerpakai : 0;
            $spaceCommon += $tidakTerpakai;

            if (!empty($r->Ruang)) {
                $totalRuangPerangkat++;
            }

            $lantai = $r->Lantai ?? null;
            if ($lantai) {
                if (!isset($lantaiMap[$lantai])) {
                    $lantaiMap[$lantai] = 0;
                }
                $lantaiMap[$lantai] += 1;
            }
        }

        $totalRuanganLantai = [];
        foreach ($lantaiMap as $lantai => $jumlah) {
            $totalRuanganLantai["total_ruangan_lantai_" . $lantai] = $jumlah;
        }

        return array_merge([
            "total_space" => round($totalSpace, 2),
            "space_perangkat" => round($spacePerangkat, 2),
            "space_common_area" => round($spaceCommon, 2),
            "total_ruang_perangkat" => (int)$totalRuangPerangkat,
            "total_common_area" => (int)$rows->count(),
        ], $totalRuanganLantai);
    }

    private function getFSSProfile()
    {
        $rows = $this->safeGet('dp_fss');
        if ($rows->count() < 1) return null;

        $row = $rows->first();

        $floors = [];

        foreach ($rows as $r) {

            if (!empty($r->total_floor)) {

                $lantai = trim((string)$r->total_floor);

                if ($lantai !== "") {

                    $floors[] = "Lantai : " . $lantai;

                }
            }
        }

        $floors = array_values(array_unique($floors));

        return [

            "brand" => $row->brand ?? null,

            "floor" => $floors,

            "jumlah" => $rows->count()

        ];
    }
    private function getAPARProfile()
    {
        $rows = $this->safeGet('dp_apar');
        if ($rows->count() < 1) return null;

        $aktif = 0;
        $tidakAktif = 0;

        $brands = [];
        $types = [];

        foreach ($rows as $r) {
            $status = strtolower(trim($r->Status ?? ''));

            if ($status === 'aktif') $aktif++;
            else $tidakAktif++;

            if (!empty($r->Brand)) $brands[] = $r->Brand;
            if (!empty($r->Type)) $types[] = $r->Type;
        }

        $brands = array_values(array_unique($brands));
        $types = array_values(array_unique($types));

        return [
            "aktiv" => $aktif,
            "tidak_aktiv" => $tidakAktif,
            "Brand" => $brands,
            "Type" => $types,
            "jumlah" => (int)$rows->count(),
        ];
    }

    private function getISSUEProfile()
    {
        try {
            return DB::connection($this->connection)
                ->table('issues')
                ->orderBy('id', 'asc')
                ->get()
                ->map(function ($r) {
                    return [
                        "id" => $r->id ?? null,
                        "issue" => $r->issue ?? null,
                        "analisa" => $r->analisa ?? null,
                        "risk" => $r->risk ?? null,
                        "solution" => $r->solution ?? null,
                        "keterangan" => $r->keterangan ?? null,
                        "status" => $r->status ?? null,
                        "profile_affected" => $r->profile_affected ?? null,
                    ];
                })
                ->toArray();
        } catch (\Throwable $e) {
            return [];
        }
    }
    private function getISSUEBuildingProfile()
    {
        try {
            return DB::connection($this->connection)
                ->table('issues')
                ->whereRaw("LOWER(TRIM(profile_affected)) = 'building'")
                ->orderBy('id', 'asc')
                ->get()
                ->map(function ($r) {
                    return [
                        "id" => $r->id ?? null,
                        "issue" => $r->issue ?? null,
                        "analisa" => $r->analisa ?? null,
                        "risk" => $r->risk ?? null,
                        "solution" => $r->solution ?? null,
                        "keterangan" => $r->keterangan ?? null,
                        "status" => $r->status ?? null,
                        "profile_affected" => $r->profile_affected ?? null,
                    ];
                })
                ->toArray();
        } catch (\Throwable $e) {
            return [];
        }
    }

    public function profiles()
    {
        $start = microtime(true);

        try {

            $profiles = [
                "CCTV" => $this->getCCTVProfile(),
                "PAC" => $this->getPACProfile(),
                "UPS" => $this->getUPSProfile(),
                "REC" => $this->getRECTProfile(),
                "PLN" => $this->getPLNProfile(),
                "TRAVO" => $this->getTRAFOProfile(),
                "GENSET" => $this->getGENSETProfile(),
                "BBM" => $this->getBBMProfile(),
                "SPACE" => $this->getSPACEProfile(),
                "FSS" => $this->getFSSProfile(),
                "APAR" => $this->getAPARProfile(),
                "ISSUE" => $this->getISSUEProfile(),
                "ISSUE_BUILDING" => $this->getISSUEBuildingProfile(),
            ];

            $siteRow = $this->safeFirst('dp_cctv');
            $siteName = $siteRow->site_name ?? "TTC Paniki";

            $totalProfiles = 0;
            foreach ($profiles as $key => $val) {
                if ($val !== null && $val !== [] && $val !== "") {
                    $totalProfiles++;
                }
            }

            return response()->json([
                "success" => true,
                "message" => "All profile data retrieved successfully",
                "data" => array_merge($profiles, [
                    "timestamp" => Carbon::now()->format('Y-m-d H:i:s'),
                    "site" => $siteName
                ]),
                "total_profiles" => $totalProfiles,
                "response_time" => round(microtime(true) - $start, 15)
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to generate profiles",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
