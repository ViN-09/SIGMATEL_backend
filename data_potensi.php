<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

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

        } catch (\Throwable $e) {

            Log::error("generateDatapotensi error: ".$e->getMessage());

            return response()->json([
                "error"=>$e->getMessage()
            ],500);
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
                ->select('COLUMN_NAME','DATA_TYPE')
                ->where('TABLE_NAME',$table)
                ->where('TABLE_SCHEMA',DB::connection($this->connection)->getDatabaseName())
                ->get();

            return response()->json($columns);

        } catch (\Throwable $e) {

            Log::error("generateColumns error: ".$e->getMessage());

            return response()->json([
                "error"=>$e->getMessage()
            ],500);
        }
    }

    public function listDpTables()
    {
        $tables = DB::connection($this->connection)->select('SHOW TABLES');

        $dbName = DB::connection($this->connection)->getDatabaseName();

        $key = 'Tables_in_'.$dbName;

        $result = [];

        foreach($tables as $tbl){

            $tableName = $tbl->$key;

            if(str_starts_with($tableName,'dp_')){

                $result[] = [
                    "nama_tabel"=>$tableName,
                    "length"=>DB::connection($this->connection)
                        ->table($tableName)
                        ->count()
                ];
            }
        }

        return response()->json($result);
    }

public function fullDapot()
{
    try{

        $tables = DB::connection($this->connection)->select('SHOW TABLES');
        $dbName = DB::connection($this->connection)->getDatabaseName();
        $key = 'Tables_in_'.$dbName;

        $summary = [];
        $detail  = [];

        foreach($tables as $tbl){

            $tableName = $tbl->$key;

            if(!str_starts_with($tableName,'dp_') && $tableName!='dpotensi')
                continue;

            try {

                $rows = DB::connection($this->connection)
                    ->table($tableName)
                    ->get();

                $summary[]=[
                    "nama_tabel"=>$tableName,
                    "length"=>$rows->count()
                ];

                $detail[$tableName] = $rows;

            } catch (\Throwable $e) {

                Log::error("Table error ".$tableName." : ".$e->getMessage());

                $summary[]=[
                    "nama_tabel"=>$tableName,
                    "length"=>0
                ];

                $detail[$tableName] = [];
            }
        }

        return response()->json([
            "success"=>true,
            "message"=>"success",
            "data_potesi_list"=>$summary,
            "datapotensi"=>$detail
        ]);

    }catch(\Throwable $e){

        Log::error("fullDapot error: ".$e->getMessage());

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
    try{

        $action = strtolower($request->input('action') ?? $request->input('mode'));
        $table  = $request->input('table');
        $id     = $request->input('id');
        $data   = $request->input('data', []);

        if(!$table){
            return response()->json([
                "success"=>false,
                "message"=>"Nama tabel wajib diisi"
            ],400);
        }

        if(!Schema::connection($this->connection)->hasTable($table)){
            return response()->json([
                "success"=>false,
                "message"=>"Table tidak ditemukan"
            ],404);
        }

        $columns = Schema::connection($this->connection)
            ->getColumnListing($table);

        $filteredData = [];

        foreach($data as $key=>$value){

            if(in_array($key,$columns)){

                if($value === "" || $value === "0000-00-00"){
                    $value = null;
                }

                $filteredData[$key] = $value;
            }
        }

        if($action=="add" || $action=="create"){

            if(!isset($filteredData['id'])){
                if($id){
                    $filteredData['id'] = $id;
                }else{
                    $filteredData['id'] = uniqid();
                }
            }

            $columnsInfo = DB::connection($this->connection)
                ->select("SHOW COLUMNS FROM `$table`");

            $insertData = [];

            foreach($columnsInfo as $col){

                $field = $col->Field;

                if(isset($filteredData[$field])){

                    $insertData[$field] = $filteredData[$field];

                }else{

                    if($col->Null == "NO"){

                        if(str_contains($col->Type,'int') || str_contains($col->Type,'float')){
                            $insertData[$field] = 0;
                        }
                        elseif(str_contains($col->Type,'date')){
                            $insertData[$field] = null;
                        }
                        else{
                            $insertData[$field] = "";
                        }

                    }

                }
            }

            DB::connection($this->connection)
                ->table($table)
                ->insert($insertData);

            return response()->json([
                "success"=>true,
                "message"=>"Data berhasil ditambahkan",
                "id"=>$filteredData['id']
            ]);
        }

        if($action=="edit" || $action=="update"){

            if(!$id){
                return response()->json([
                    "success"=>false,
                    "message"=>"ID wajib diisi"
                ],400);
            }

            unset($filteredData['id']);

            DB::connection($this->connection)
                ->table($table)
                ->where("id",$id)
                ->update($filteredData);

            return response()->json([
                "success"=>true,
                "message"=>"Data berhasil diupdate"
            ]);
        }

        if($action=="delete"){

            if(!$id){
                return response()->json([
                    "success"=>false,
                    "message"=>"ID wajib diisi"
                ],400);
            }

            DB::connection($this->connection)
                ->table($table)
                ->where("id",$id)
                ->delete();

            return response()->json([
                "success"=>true,
                "message"=>"Data berhasil dihapus"
            ]);
        }

        return response()->json([
            "success"=>false,
            "message"=>"Mode tidak dikenal"
        ],400);

    }catch(\Throwable $e){

        Log::error("crudDapot error: ".$e->getMessage());

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

            DB::connection($this->connection)
                ->table($table)
                ->where('id', $id)
                ->update($data);

            return response()->json([
                "success"=>true,
                "message"=>"Update successful"
            ]);

        } catch (\Throwable $e) {

            Log::error("updateDatapotensi error: ".$e->getMessage());

            return response()->json([
                "error"=>$e->getMessage()
            ],500);
        }
    }

    private function getChecklistData($table_name,$kolom_name,$value)
    {
        return DB::connection($this->connection)
            ->table($table_name)
            ->where($kolom_name,$value)
            ->first();
    }

}