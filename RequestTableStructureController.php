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

        return response()->json([
            "report_info" => $reportInfo
        ]);
    }
}