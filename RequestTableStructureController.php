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

        return response()->json([
            "message" => "Form not found"
        ], 404);
    }
}