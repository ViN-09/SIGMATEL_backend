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

            $key = 'Tables_in_' . $dbName;

            $summary = [];
            $detail = [];

            foreach ($tables as $tbl) {

                $tableName = $tbl->$key;

                if (!str_starts_with($tableName,'dp_') && $tableName!='dpotensi')
                    continue;

                $rows = DB::connection($this->connection)
                    ->table($tableName)
                    ->get();

                $summary[]=[
                    "nama_tabel"=>$tableName,
                    "length"=>$rows->count()
                ];

                $detail[$tableName]=$rows;
            }

            return response()->json([

                "message"=>"success",

                "data_potesi_list"=>$summary,

                "datapotensi"=>$detail

            ]);

        } catch (\Throwable $e){

            return response()->json([

                "success"=>false,
                "message"=>$e->getMessage()

            ],500);

        }
    }
        public function crudDapot(Request $request)
        {
            try {

                $action = strtolower(trim($request->input('action')));
                $table  = trim($request->input('table'));
                $data   = $request->input('data',[]);
                $id     = $request->input('id');


                /*
                =========================
                VALIDASI TABEL
                =========================
                */

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



                /*
                =========================
                CREATE
                =========================
                */

                if($action=="create"){

                    if(empty($data)){
                        return response()->json([
                            "success"=>false,
                            "message"=>"Data tidak boleh kosong"
                        ],400);
                    }



                    /*
                    AMBIL STRUKTUR TABEL
                    */

                    $columns = DB::connection($this->connection)
                    ->select("
                        SELECT COLUMN_NAME,
                            IS_NULLABLE,
                            DATA_TYPE,
                            EXTRA
                        FROM information_schema.columns
                        WHERE table_schema=?
                        AND table_name=?
                    ",[
                        DB::connection($this->connection)->getDatabaseName(),
                        $table
                    ]);



                    /*
                    DETEKSI AUTO_INCREMENT
                    */

                    $autoIncrement=false;

                    foreach($columns as $col){

                        if($col->COLUMN_NAME=="id" &&
                        strpos($col->EXTRA,'auto_increment')!==false){

                            $autoIncrement=true;
                        }
                    }



                    /*
                    AUTO ID JIKA BUKAN AUTO_INCREMENT
                    */

                    if(!$autoIncrement){

                        if(!isset($data['id'])){

                            $lastId = DB::connection($this->connection)
                                ->table($table)
                                ->max('id');

                            $data['id'] = $lastId ? $lastId+1 : 1;
                        }

                    }



                    /*
                    AUTO FILL FIELD WAJIB
                    */

                    foreach($columns as $col){

                        $name=$col->COLUMN_NAME;
                        $nullable=$col->IS_NULLABLE;
                        $type=$col->DATA_TYPE;


                        if(!isset($data[$name]) && $nullable=="NO"){

                            if($name=="id")
                                continue;


                            if(in_array($type,['int','bigint','decimal','float','double']))
                                $data[$name]=0;


                            elseif(in_array($type,['date']))
                                $data[$name]='2000-01-01';


                            else
                                $data[$name]='-';

                        }

                    }



                    DB::connection($this->connection)
                        ->table($table)
                        ->insert($data);


                    return response()->json([
                        "success"=>true,
                        "message"=>"Data berhasil ditambahkan"
                    ]);

                }



                /*
                =========================
                UPDATE
                =========================
                */

                if($action=="update"){

                    if(!$id){

                        return response()->json([
                            "success"=>false,
                            "message"=>"ID wajib diisi"
                        ],400);

                    }


                    DB::connection($this->connection)
                        ->table($table)
                        ->where('id',$id)
                        ->update($data);


                    return response()->json([
                        "success"=>true,
                        "message"=>"Data berhasil diupdate"
                    ]);

                }



                /*
                =========================
                DELETE
                =========================
                */

                if($action=="delete"){

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