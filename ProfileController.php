<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{
    public function profiles()
    {
        $start = microtime(true);


$cctvIndoor = DB::table('dp_cctv')
    ->where('indoor_outdoor', 'Indoor')
    ->count();

$cctvOutdoor = DB::table('dp_cctv')
    ->where('indoor_outdoor', 'Outdoor')
    ->count();

$cctvTotal = DB::table('dp_cctv')->count();

$cctvInfo = DB::table('dp_cctv')->first();

$cctv = [
    "indoor" => $cctvIndoor,
    "outdoor" => $cctvOutdoor,
    "merk" => $cctvInfo->merk ?? null,
    "recording_caps" => $cctvInfo->recording_caps ?? null,
    "record_duration" => $cctvInfo->record_duration ?? null,
    "jumlah" => $cctvTotal
];

$upsRows = DB::table('dp_ups')->get();

$totalCapacity = $upsRows->sum(function ($row) {
    return (float) $row->capacity_ups_kva;
});

$totalLoad = $upsRows->sum(function ($row) {
    return (float) $row->load_ups_kva;
});

$totalBank = $upsRows->sum(function ($row) {
    return (float) $row->total_bank;
});

$totalAh = $upsRows->sum(function ($row) {
    return (float) $row->ah;
});

$totalBatteryCap = $upsRows->sum(function ($row) {
    return (float) $row->battery_cap;
});

$totalQtBattery = $upsRows->sum(function ($row) {
    return (float) $row->qt_battery;
});

$totalNe = $upsRows->sum(function ($row) {
    return (float) $row->jumlah_ne;
});

$totalSystem = $upsRows->count();

$occupancy = $totalCapacity > 0
    ? round(($totalLoad / $totalCapacity) * 100, 2)
    : 0;

$upsData = [
    "total_capacity" => $totalCapacity,
    "total_load" => $totalLoad,
    "total_bank" => $totalBank,
    "total_ah" => $totalAh,
    "total_battery_cap" => $totalBatteryCap,
    "qt_battery" => $totalQtBattery,
    "occupancy" => $occupancy,
    "total_ne" => $totalNe,
    "total_system" => $totalSystem
];

$recRows = DB::table('dp_rectifier')->get();

$totalCapacityRec = $recRows->sum('rec_capacity');

$totalLoadRec = $recRows->sum('total_load_real');

$totalBankRec = $recRows->sum('jumlah_bank');

$totalAhRec = $recRows->sum('battery_ah');

$totalBatteryCapRec = $recRows->sum('battery_capacity_ah');

$totalNeRec = $recRows->count();

$totalSystemRec = $recRows->count();

$occupancyRec = $totalCapacityRec > 0
    ? round(($totalLoadRec / $totalCapacityRec) * 100, 2)
    : 0;

$recData = [
    "total_capacity" => (float) $totalCapacityRec,
    "total_load" => (float) $totalLoadRec,
    "total_bank" => (int) $totalBankRec,
    "total_ah" => (int) $totalAhRec,
    "total_battery_cap" => (int) $totalBatteryCapRec,
    "occupancy" => $occupancyRec,
    "total_ne" => (int) $totalNeRec,
    "total_system" => (int) $totalSystemRec
];

$pln = DB::table('dp_power')->first();

$kapasitas = (float) ($pln->capacity_kva ?? 0);
$kapasitasTerpakai = (float) ($pln->load_kva ?? 0);

$occupancyPln = $kapasitas > 0
    ? round(($kapasitasTerpakai / $kapasitas) * 100, 2)
    : 0;

$plnData = [
    "kapasitas" => $kapasitas,
    "kapasitas_terpakai" => $kapasitasTerpakai,
    "occupancy" => $occupancyPln,
    "supply" => $pln->service_status ?? null,
    "tagihan_listrik" => $pln->keterangan ?? null
];

$trafoRows = DB::table('dp_trafo')->get();

$jumlahTrafo = $trafoRows->sum(function ($row) {
    return (int) $row->total;
});

$totalCapacityTrafo = $trafoRows->sum(function ($row) {
    return (float) $row->capacity;
});

$occupancyTrafo = 0;

$trafoData = [
    "jumlah" => $jumlahTrafo,
    "capacity" => $totalCapacityTrafo,
    "occupancy" => $occupancyTrafo
];

$gensetRows = DB::table('dp_genset')->get();

$gensetData = [];

foreach ($gensetRows as $row) {

    $gensetData[$row->id] = [
        "merk" => $row->brand ?? null,
        "capacity" => (float) $row->capacity_kva ?? 0,
        "load" => (float) $row->load_kva ?? 0,
        "remarks" => $row->model ?? null
    ];
}


$genset1 = DB::table('genset1')
    ->orderBy('date', 'desc')
    ->first();

$genset2 = DB::table('genset2')
    ->orderBy('date', 'desc')
    ->first();

$tanki1 = ($genset1 && isset($genset1->tanki_harian))
    ? (float) $genset1->tanki_harian
    : 0;

$tanki2 = ($genset2 && isset($genset2->tanki_harian))
    ? (float) $genset2->tanki_harian
    : 0;

$totalLiter = $tanki1 + $tanki2;

$kapasitasTangki = 22500;

$occupancyBBM = $kapasitasTangki > 0
    ? round(($totalLiter / $kapasitasTangki) * 100, 2)
    : 0;

$konsumsiPerJam = 50;
$backupTime = $konsumsiPerJam > 0
    ? round($totalLiter / $konsumsiPerJam, 2)
    : 0;

$bbmData = [
    "kapasitas" => $kapasitasTangki,
    "liter_total" => $totalLiter,
    "occupancy" => $occupancyBBM,
    "backup_time" => $backupTime
];

$spaceRows = DB::table('dp_space')->get();

$totalSpace = $spaceRows->sum(function ($row) {
    return (float) $row->luas_m2;
});

$spacePerangkat = $spaceRows->sum(function ($row) {
    return (float) $row->terpakai_m2;
});

$spaceCommon = $spaceRows->sum(function ($row) {
    return (float) $row->tidakterpakai_m2;
});

$totalRuangan = $spaceRows->count();

$groupLantai = $spaceRows->groupBy('Lantai');

$totalSpaceL1 = isset($groupLantai['1'])
    ? collect($groupLantai['1'])->sum(fn($r) => (float)$r->luas_m2)
    : 0;

$totalSpaceL2 = isset($groupLantai['2'])
    ? collect($groupLantai['2'])->sum(fn($r) => (float)$r->luas_m2)
    : 0;

$totalSpaceL3 = isset($groupLantai['3'])
    ? collect($groupLantai['3'])->sum(fn($r) => (float)$r->luas_m2)
    : 0;

$totalRuanganL1 = isset($groupLantai['1']) ? count($groupLantai['1']) : 0;
$totalRuanganL2 = isset($groupLantai['2']) ? count($groupLantai['2']) : 0;
$totalRuanganL3 = isset($groupLantai['3']) ? count($groupLantai['3']) : 0;

$spaceData = [
    "total_space" => round($totalSpace, 2),
    "space_perangkat" => round($spacePerangkat, 2),
    "space_common_area" => round($spaceCommon, 2),
    "total_ruang_perangkat" => $totalRuangan,
    "total_common_area" => $totalRuangan,
    "total_space_lantai_1" => round($totalSpaceL1, 2),
    "total_space_lantai_2" => round($totalSpaceL2, 2),
    "total_space_lantai_3" => round($totalSpaceL3, 2),
    "total_ruangan_lantai_1" => $totalRuanganL1,
    "total_ruangan_lantai_2" => $totalRuanganL2,
    "total_ruangan_lantai_3" => $totalRuanganL3,
    "total_ruangan" => $totalRuangan
];

$fssRows = DB::table('dp_fss')->get();

$totalFss = $fssRows->sum(function ($row) {
    return (int) ($row->qty ?? 0);
});

$brandFss = $fssRows->pluck('brand')
    ->filter()
    ->unique()
    ->values()
    ->toArray();

$floorFss = $fssRows->pluck('floor')
    ->filter()
    ->unique()
    ->map(function ($floor) {
        return "Lantai " . $floor;
    })
    ->values()
    ->toArray();

$fss = [
    "brand" => $brandFss[0] ?? null,
    "floor" => $floorFss,
    "jumlah" => $totalFss
];

$aparRows = DB::table('dp_apar')->get();

$aktif = $aparRows->where('Status', 'Aktif')->count();
$tidakAktif = $aparRows->where('Status', '!=', 'Aktif')->count();

$brands = $aparRows->pluck('Brand')
    ->filter()
    ->unique()
    ->values();

$types = $aparRows->pluck('Type')
    ->filter()
    ->unique()
    ->values();

$jumlah = $aparRows->count();

$aparData = [
    "aktif" => $aktif,
    "tidak_aktif" => $tidakAktif,
    "Brand" => $brands,
    "Type" => $types,
    "jumlah" => $jumlah
];

$issueRows = DB::table('issues')->get();

$issueData = $issueRows->map(function ($row) {
    return [
        "id" => $row->id,
        "issue" => $row->issue,
        "analisa" => $row->analisa,
        "risk" => $row->risk,
        "solution" => $row->solution,
        "keterangan" => $row->keterangan,
        "status" => $row->status,
        "profile_affected" => $row->profile_affected
    ];
});

        $data = [
            "CCTV" => $cctv,
            "PAC" => [],
            "UPS" => $upsData,
            "REC" => $recData,
            "PLN" => $plnData,
            "TRAVO" => $trafoData,
            "GENSET" => $gensetData,
            "BBM" => $bbmData,
            "SPACE" => $spaceData,
            "FSS" => $fss,
            "APAR" => $aparData,
            "ISSUE" => $issueData,
            "ISSUE_BUILDING" => []
        ];

        $responseTime = microtime(true) - $start;

        return response()->json([
            "success" => true,
            "message" => "All profile data retrieved successfully",
            "data" => $data,
            "timestamp" => now(),
            "site" => "TTC Paniki",
            "total_profiles" => count($data),
            "response_time" => round($responseTime, 4)
        ]);
    }
}
