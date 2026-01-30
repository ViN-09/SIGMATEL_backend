<?php

namespace App\Http\Controllers\ttc_paniki_controllers_test;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;//Bombaya

class data_potensi extends Controller
{

    protected $connection = 'mysql2';

    public function hello()
    {
        return response()->json(['message' => 'Hello from Laravel!']);
    }

    public function generateDatapotensi($table)
    {
        try {
            if (!Schema::connection($this->connection)->hasTable($table)) {
                return response()->json(['error' => 'Table not found'], 404);
            }

            $data = DB::connection($this->connection)
                ->table($table)
                ->get();

            return response()->json($data);

        } catch (\Exception $e) {
            Log::error("Error generateDatapotensi: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function generateColumns($table)
    {
        try {
            if (!Schema::connection($this->connection)->hasTable($table)) {
                return response()->json(['error' => 'Table not found'], 404);
            }

            $columns = DB::connection($this->connection)
                ->table('information_schema.columns')
                ->select('COLUMN_NAME', 'DATA_TYPE')
                ->where('TABLE_NAME', $table)
                ->where('TABLE_SCHEMA', DB::connection($this->connection)->getDatabaseName())
                ->get();

            return response()->json($columns);

        } catch (\Exception $e) {
            Log::error("Error generateColumns: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function listDpTables()
    {
        $tables = DB::connection($this->connection)->select('SHOW TABLES');
        $dbName = DB::connection($this->connection)->getDatabaseName();
        $key = 'Tables_in_' . $dbName;

        $result = [];

        foreach ($tables as $tbl) {
            $tableName = $tbl->$key;

            if (str_starts_with($tableName, 'dp_')) {
                $result[] = [
                    'nama_tabel' => $tableName,
                    'length' => DB::connection($this->connection)
                        ->table($tableName)
                        ->count()
                ];
            }
        }

        return response()->json($result);
    }

public function getAllDataPotensi()
{
    try {
        $tables = DB::connection($this->connection)->select('SHOW TABLES');
        $dbName = DB::connection($this->connection)->getDatabaseName();
        $key    = 'Tables_in_' . $dbName;

        $summary = [];      
        $detail  = [];      

        foreach ($tables as $tbl) {
            $tableName = $tbl->$key;


            if (!str_starts_with($tableName, 'dp_') && $tableName !== 'dpotensi') {
                continue;
            }

            $rows  = DB::connection($this->connection)->table($tableName)->get();
            $count = $rows->count();

            $summary[] = [
                'nama_tabel' => $tableName,
                'length'     => $count
            ];

            $detail[$tableName] = $rows;
        }

        return response()->json([
            'message' => 'success',
            'data_potesi_list' => $summary,
            'datapotensi' => $detail
        ]);

    } catch (\Exception $e) {
        Log::error("Error getAllDataPotensi: " . $e->getMessage());
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
}



    public function updateDatapotensi(Request $request, $table)
    {
        try {
            if (!Schema::connection($this->connection)->hasTable($table)) {
                return response()->json(['error' => 'Table not found'], 404);
            }

            $id = $request->input('id');
            $data = $request->except('id');

            Log::info("Updating table {$table} where id={$id}", $data);

            DB::connection($this->connection)
                ->table($table)
                ->where('id', $id)
                ->update($data);

            return response()->json(['message' => 'Update successful']);

        } catch (\Exception $e) {
            Log::error("Error updateDatapotensi: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getChecklistData($table_name, $kolom_name, $value)
    {
        return DB::connection($this->connection)
            ->table($table_name)
            ->where($kolom_name, $value)
            ->first();
    }
}