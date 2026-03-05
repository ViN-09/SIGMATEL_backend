<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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
                'data_potensi_list' => $summary,
                'datapotensi' => $detail
            ]);

        } catch (\Exception $e) {
            Log::error("Error getAllDataPotensi: " . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function fullDapot()
    {
        try {

            $tables = DB::connection($this->connection)->select('SHOW TABLES');
            $dbName = DB::connection($this->connection)->getDatabaseName();
            $key    = 'Tables_in_' . $dbName;

            $summary = [];
            $detail  = [];

            foreach ($tables as $tbl) {

                $tableName = $tbl->$key;

                if (!str_starts_with($tableName,'dp_') && $tableName!='dpotensi')
                    continue;

                $rows = DB::connection($this->connection)
                    ->table($tableName)
                    ->get();

                $summary[] = [
                    "nama_tabel"=>$tableName,
                    "length"=>$rows->count()
                ];

                $detail[$tableName] = $rows;
            }

            return response()->json([

                "success"=>true,

                "message"=>"success",

                "data_potesi_list"=>$summary,

                "datapotensi"=>$detail

            ]);

        } catch (\Throwable $e){

            Log::error("fullDapot error : ".$e->getMessage());

            return response()->json([

                "success"=>false,

                "message"=>$e->getMessage(),

                "data_potesi_list"=>[],

                "datapotensi"=>(object)[]

            ],500);

        }
    }

    public function crudDapot(Request $request)
    {
        try {

            $action = strtolower(trim($request->input('action') ?? $request->input('mode')));
            $table  = trim($request->input('table'));
            $data   = $request->input('data', []);
            $id     = $request->input('id');


            if(!$table){
                return response()->json([
                    "success"=>false,
                    "message"=>"Nama tabel wajib diisi"
                ],400);
            }

            if(!str_starts_with($table,'dp_')){
                return response()->json([
                    "success"=>false,
                    "message"=>"Tabel tidak diizinkan"
                ],403);
            }

            if(!Schema::connection($this->connection)->hasTable($table)){
                return response()->json([
                    "success"=>false,
                    "message"=>"Table tidak ditemukan"
                ],404);
            }

            if($action == "add")   $action = "create";
            if($action == "edit")  $action = "update";

            if($action == "create"){

                if(empty($data)){
                    $data = $request->except(['action','mode','table','id','user_id']);
                }

                if(!isset($data['id'])){

                    $lastId = DB::connection($this->connection)
                        ->table($table)
                        ->max('id');

                    $data['id'] = $lastId ? $lastId + 1 : 1;
                }

                DB::connection($this->connection)
                    ->table($table)
                    ->insert($data);

                return response()->json([
                    "success"=>true,
                    "message"=>"Data berhasil ditambahkan"
                ]);
            }

            if($action == "update"){

                if(!$id){
                    return response()->json([
                        "success"=>false,
                        "message"=>"ID wajib diisi"
                    ],400);
                }

                unset($data['id']);

                DB::connection($this->connection)
                    ->table($table)
                    ->where('id',$id)
                    ->update($data);

                return response()->json([
                    "success"=>true,
                    "message"=>"Data berhasil diupdate"
                ]);
            }

            if($action == "delete"){

                if(!$id){
                    return response()->json([
                        "success"=>false,
                        "message"=>"ID wajib diisi"
                    ],400);
                }

                DB::connection($this->connection)
                    ->table($table)
                    ->where('id',$id)
                    ->delete();

                return response()->json([
                    "success"=>true,
                    "message"=>"Data berhasil dihapus"
                ]);
            }


            return response()->json([
                "success"=>false,
                "message"=>"Action tidak dikenal"
            ],400);


        } catch (\Throwable $e){

            Log::error("crudDapot error : ".$e->getMessage());

            return response()->json([
                "success"=>false,
                "message"=>$e->getMessage()
            ],500);

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