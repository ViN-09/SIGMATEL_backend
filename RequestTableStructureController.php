<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RequestTableStructureController extends Controller
{

    private function normalizeField($field)
    {
        return $field === 'petugasME1' ? 'petugasME' : $field;
    }

    public function requestTableStructure($form)
    {
        $tableName = 'report_info';

        $latest = DB::table($tableName)
                    ->orderBy('no_report', 'desc')
                    ->first();

        $columns = DB::select("SHOW COLUMNS FROM {$tableName}");

        $reportInfo = [];

        foreach ($columns as $column) {

            $field = $this->normalizeField($column->Field);

            if ($field == 'no_report') {
                continue;
            }

            $type = strtoupper(strtok($column->Type, '('));

            $latestValue = "-";

            if ($latest && isset($latest->{$column->Field})) {
                $latestValue = $latest->{$column->Field} ?? "-";
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

            $lvmdp1_latest = DB::table('report_lvmdp1')->orderBy('id_report_lvmdp1', 'desc')->first();
            $lvmdp1_columns = DB::select("SHOW COLUMNS FROM report_lvmdp1");

            $report_lvmdp1 = [];

            foreach ($lvmdp1_columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id_report_lvmdp1') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($lvmdp1_latest && isset($lvmdp1_latest->{$column->Field})) {
                    $latestValue = $lvmdp1_latest->{$column->Field} ?? "-";
                }

                $report_lvmdp1[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            $lvmdp2_latest = DB::table('report_lvmdp2')->orderBy('id_report_lvmdp2', 'desc')->first();
            $lvmdp2_columns = DB::select("SHOW COLUMNS FROM report_lvmdp2");

            $report_lvmdp2 = [];

            foreach ($lvmdp2_columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id_report_lvmdp2') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($lvmdp2_latest && isset($lvmdp2_latest->{$column->Field})) {
                    $latestValue = $lvmdp2_latest->{$column->Field} ?? "-";
                }

                $report_lvmdp2[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            $trafo_latest = DB::table('load_trafo')->orderBy('id', 'desc')->first();
            $trafo_columns = DB::select("SHOW COLUMNS FROM load_trafo");

            $load_trafo = [];

            foreach ($trafo_columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($trafo_latest && isset($trafo_latest->{$column->Field})) {
                    $latestValue = $trafo_latest->{$column->Field} ?? "-";
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

            $latest = DB::table('trafof_c')->orderBy('id', 'desc')->first();
            $columns = DB::select("SHOW COLUMNS FROM trafof_c");

            $trafoc_c = [];

            foreach ($columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($latest && isset($latest->{$column->Field})) {
                    $latestValue = $latest->{$column->Field} ?? "-";
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

            $kwh_latest = DB::table('report_kwh')->orderBy('id_report_kwh', 'desc')->first();
            $kwh_columns = DB::select("SHOW COLUMNS FROM report_kwh");

            $report_kwh = [];

            foreach ($kwh_columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id_report_kwh') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($kwh_latest && isset($kwh_latest->{$column->Field})) {
                    $latestValue = $kwh_latest->{$column->Field} ?? "-";
                }

                $report_kwh[] = [
                    "Field" => $field,
                    "Type" => $type,
                    "latestValue" => $latestValue
                ];
            }

            $suhu_latest = DB::table('report_suhu')->orderBy('id_report_suhu', 'desc')->first();
            $suhu_columns = DB::select("SHOW COLUMNS FROM report_suhu");

            $report_suhu = [];

            foreach ($suhu_columns as $column) {

                $field = $this->normalizeField($column->Field);
                if ($field == 'id_report_suhu') continue;

                $type = strtoupper(strtok($column->Type, '('));
                $latestValue = "-";

                if ($suhu_latest && isset($suhu_latest->{$column->Field})) {
                    $latestValue = $suhu_latest->{$column->Field} ?? "-";
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

            $result = [];

            $rectifierTables = ['rec1', 'rec2', 'rec3', 'rec4'];

            foreach ($rectifierTables as $table) {

                if (!Schema::hasTable($table)) continue;

                $latest = DB::table($table)
                            ->orderBy('id', 'desc')
                            ->first();

                if (!$latest) continue;

                $columns = DB::select("SHOW COLUMNS FROM {$table}");

                $unit = [];

                foreach ($columns as $column) {

                    $field = $this->normalizeField($column->Field);
                    if ($field == 'id') continue;

                    $type = strtoupper(strtok($column->Type, '('));

                    $unit[] = [
                        "Field" => $field,
                        "Type" => $type,
                        "latestValue" => $latest->{$column->Field} ?? "-"
                    ];
                }

                $result[$table] = $unit;
            }



            $upsTables = ['ups1', 'ups2'];

            foreach ($upsTables as $table) {

                if (!Schema::hasTable($table)) continue;

                $latest = DB::table($table)
                            ->orderBy('id', 'desc')
                            ->first();

                if (!$latest) continue;

                $columns = DB::select("SHOW COLUMNS FROM {$table}");

                $unit = [];

                foreach ($columns as $column) {

                    $field = $this->normalizeField($column->Field);
                    if ($field == 'id') continue;

                    $type = strtoupper(strtok($column->Type, '('));

                    $unit[] = [
                        "Field" => $field,
                        "Type" => $type,
                        "latestValue" => $latest->{$column->Field} ?? "-"
                    ];
                }

                $result[$table] = $unit;
            }



            $dcpduTables = ['dcpdu_1', 'dcpdu_2'];

            foreach ($dcpduTables as $table) {

                if (!Schema::hasTable($table)) continue;

                $latest = DB::table($table)
                            ->orderBy('id', 'desc')
                            ->first();

                if (!$latest) continue;

                $columns = DB::select("SHOW COLUMNS FROM {$table}");

                $unit = [];

                foreach ($columns as $column) {

                    $field = $this->normalizeField($column->Field);
                    if ($field == 'id') continue;

                    $type = strtoupper(strtok($column->Type, '('));

                    $unit[] = [
                        "Field" => $field,
                        "Type" => $type,
                        "latestValue" => $latest->{$column->Field} ?? "-"
                    ];
                }

                $result[$table] = $unit;
            }

            return response()->json($result);
        }

        if ($form === 'cooling_system' || $form === 'coling_system') {

            try {

                $tables = [
                    'pac1','pac2','pac3','pac4','pac5',
                    'pac6','pac7','pac8','pac9','pac10',
                    'pac11','pac12','pac13','pac14','pac15'
                ];

                $result = [];

                foreach ($tables as $table) {

                    if (!Schema::hasTable($table)) continue;

                    $row = DB::table($table)
                            ->orderBy('id', 'desc')
                            ->first();

                    if (!$row) continue;

                    $columns = DB::select("SHOW COLUMNS FROM {$table}");

                    $unit = [];

                    foreach ($columns as $column) {

                        $field = $column->Field;

                        if ($field == 'id') continue;

                        $type = strtoupper(strtok($column->Type, '('));

                        $unit[] = [
                            "Field" => $field,
                            "Type" => $type,
                            "latestValue" => $row->$field ?? "-"
                        ];
                    }

                    $result[$table] = $unit;
                }

                return response()->json($result);

            } catch (\Throwable $e) {

                return response()->json([
                    "error" => $e->getMessage()
                ]);
            }
        }

    return response()->json([
        "message" => "Form not found",
        "form" => $form
    ], 404);
        }
}