<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RequestTableStructureController extends Controller
{
    public function requestTableStructure($form)
    {
        $tableName = 'report_info';

        $latest = DB::table($tableName)
                    ->orderBy('no_report', 'desc')
                    ->first();

        $columns = DB::select("SHOW COLUMNS FROM {$tableName}");

        $reportInfo = [];

        foreach ($columns as $column) {

            $field = $column->Field;

            if ($field == 'no_report') {
                continue;
            }

            $type = strtoupper(strtok($column->Type, '('));

            $latestValue = "-";

            if ($latest && isset($latest->$field)) {
                $latestValue = $latest->$field ?? "-";
            }

            $reportInfo[] = [
                "Field" => $field,
                "Type" => $type,
                "latestValue" => $latestValue
            ];
        }

        if ($form == 'staffform') {
            return response()->json([
                "report_info" => $reportInfo
            ]);
        }

        if ($form == 'power') {

            $lvmdp1_latest = DB::table('report_lvmdp1')
                                ->orderBy('id_report_lvmdp1', 'desc')
                                ->first();

            $lvmdp1_columns = DB::select("SHOW COLUMNS FROM report_lvmdp1");

            $report_lvmdp1 = [];

            foreach ($lvmdp1_columns as $column) {

                $field = $column->Field;

                if ($field == 'id_report_lvmdp1') {
                    continue;
                }

                $type = strtoupper(strtok($column->Type, '('));

                $latestValue = "-";

                if ($lvmdp1_latest && isset($lvmdp1_latest->$field)) {
                    $latestValue = $lvmdp1_latest->$field ?? "-";
                }

                $report_lvmdp1[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            $lvmdp2_latest = DB::table('report_lvmdp2')
                                ->orderBy('id_report_lvmdp2', 'desc')
                                ->first();

            $lvmdp2_columns = DB::select("SHOW COLUMNS FROM report_lvmdp2");

            $report_lvmdp2 = [];

            foreach ($lvmdp2_columns as $column) {

                $field = $column->Field;

                if ($field == 'id_report_lvmdp2') {
                    continue;
                }

                $type = strtoupper(strtok($column->Type, '('));

                $latestValue = "-";

                if ($lvmdp2_latest && isset($lvmdp2_latest->$field)) {
                    $latestValue = $lvmdp2_latest->$field ?? "-";
                }

                $report_lvmdp2[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            $trafo_latest = DB::table('load_trafo')
                                ->orderBy('id', 'desc')
                                ->first();

            $trafo_columns = DB::select("SHOW COLUMNS FROM load_trafo");

            $load_trafo = [];

            foreach ($trafo_columns as $column) {

                $field = $column->Field;

                if ($field == 'id') {
                    continue;
                }

                $type = strtoupper(strtok($column->Type, '('));

                $latestValue = "-";

                if ($trafo_latest && isset($trafo_latest->$field)) {
                    $latestValue = $trafo_latest->$field ?? "-";
                }

                $load_trafo[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            return response()->json([
                "report_lvmdp1" => $report_lvmdp1,
                "report_lvmdp2" => $report_lvmdp2,
                "load_trafo"    => $load_trafo
            ]);
        }

if ($form == 'property') {

    $latest = DB::table('trafof_c')
            ->orderBy('id', 'desc')
            ->first();

$columns = DB::select("SHOW COLUMNS FROM trafof_c");

    $trafoc_c = [];

    foreach ($columns as $column) {

        $field = $column->Field;

        if ($field == 'id') {
            continue;
        }

        $type = strtoupper(strtok($column->Type, '('));

        $latestValue = "-";

        if ($latest && isset($latest->$field)) {
            $latestValue = $latest->$field ?? "-";
        }

        $trafoc_c[] = [
            "Field" => $field,
            "Type" => $type,
            "latestValue" => $latestValue
        ];
    }

    return response()->json([
        "trafoc_c" => $trafoc_c
    ]);
}

if ($form == 'suhu_kwh') {

    // ======================
    // REPORT KWH
    // ======================

    $kwh_latest = DB::table('report_kwh')
                    ->orderBy('id_report_kwh', 'desc')
                    ->first();

    $kwh_columns = DB::select("SHOW COLUMNS FROM report_kwh");

    $report_kwh = [];

    foreach ($kwh_columns as $column) {

        $field = $column->Field;

        if ($field == 'id_report_kwh') {
            continue;
        }

        $type = strtoupper(strtok($column->Type, '('));

        $latestValue = "-";

        if ($kwh_latest && isset($kwh_latest->$field)) {
            $latestValue = $kwh_latest->$field ?? "-";
        }

        $report_kwh[] = [
            "Field" => $field,
            "Type" => $type,
            "latestValue" => $latestValue
        ];
    }


    // ======================
    // REPORT SUHU
    // ======================

    $suhu_latest = DB::table('report_suhu')
                    ->orderBy('id_report_suhu', 'desc')
                    ->first();

    $suhu_columns = DB::select("SHOW COLUMNS FROM report_suhu");

    $report_suhu = [];

    foreach ($suhu_columns as $column) {

        $field = $column->Field;

        if ($field == 'id_report_suhu') {
            continue;
        }

        $type = strtoupper(strtok($column->Type, '('));

        $latestValue = "-";

        if ($suhu_latest && isset($suhu_latest->$field)) {
            $latestValue = $suhu_latest->$field ?? "-";
        }

        $report_suhu[] = [
            "Field" => $field,
            "Type" => $type,
            "latestValue" => $latestValue
        ];
    }

    return response()->json([
        "report_kwh"  => $report_kwh,
        "report_suhu" => $report_suhu
    ]);
}

if ($form == 'it_load') {

    /*
    |--------------------------------------------------------------------------
    | RECTIFIER
    |--------------------------------------------------------------------------
    */
    $rectifiers = DB::table('report_rectifier')
                    ->orderBy('id', 'asc')
                    ->get();

    $rectifierData = [];
    $rectifierColumns = DB::select("SHOW COLUMNS FROM report_rectifier");

    $recIndex = 1;

    foreach ($rectifiers as $row) {

        $unit = [];

        foreach ($rectifierColumns as $column) {

            $field = $column->Field;
            if ($field == 'id') continue;

            $type = strtoupper(strtok($column->Type, '('));

            $unit[] = [
                "Field" => $field,
                "Type" => $type,
                "latestValue" => $row->$field ?? "-"
            ];
        }

        $rectifierData["rec" . $recIndex] = $unit;
        $recIndex++;
    }


    /*
    |--------------------------------------------------------------------------
    | UPS
    |--------------------------------------------------------------------------
    */
    $upsRows = DB::table('report_ups')
                ->orderBy('id', 'asc')
                ->get();

    $upsData = [];
    $upsColumns = DB::select("SHOW COLUMNS FROM report_ups");

    $upsIndex = 1;

    foreach ($upsRows as $row) {

        $unit = [];

        foreach ($upsColumns as $column) {

            $field = $column->Field;
            if ($field == 'id') continue;

            $type = strtoupper(strtok($column->Type, '('));

            $unit[] = [
                "Field" => $field,
                "Type" => $type,
                "latestValue" => $row->$field ?? "-"
            ];
        }

        $upsData["ups" . $upsIndex] = $unit;
        $upsIndex++;
    }


    /*
    |--------------------------------------------------------------------------
    | DCPDU
    |--------------------------------------------------------------------------
    */
    $dcpduRows = DB::table('report_dcpdu')
                    ->orderBy('id', 'asc')
                    ->get();

    $dcpduData = [];
    $dcpduColumns = DB::select("SHOW COLUMNS FROM report_dcpdu");

    $dcpduIndex = 1;

    foreach ($dcpduRows as $row) {

        $unit = [];

        foreach ($dcpduColumns as $column) {

            $field = $column->Field;
            if ($field == 'id') continue;

            $type = strtoupper(strtok($column->Type, '('));

            $unit[] = [
                "Field" => $field,
                "Type" => $type,
                "latestValue" => $row->$field ?? "-"
            ];
        }

        $dcpduData["dcpdu_" . $dcpduIndex] = $unit;
        $dcpduIndex++;
    }


    return response()->json([
        "rectifier" => $rectifierData,
        "ups"       => $upsData,
        "dcpdu"     => $dcpduData
    ]);
}

        return response()->json([
            "message" => "Form not found"
        ], 404);
    }
}