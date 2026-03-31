<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class IssueController extends Controller
{
    protected $connection = 'mysql2';
    private function getIssue()
    {
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
    }

    public function index()
    {
        try {
            return response()->json([
                "success" => true,
                "data" => $this->getIssue()
            ]);
        } catch (\Throwable $e) {
            Log::error("get issue error: " . $e->getMessage());

            return response()->json([
                "success" => false,
                "message" => "Gagal mengambil data issue"
            ], 500);
        }
    }

    public function add(Request $request)
    {
        try {

            $data = $request->all();

            if (empty($data['issue']) || empty($data['profile_affected'])) {
                return response()->json([
                    "success" => false,
                    "message" => "Issue dan Profile Affected wajib diisi"
                ], 400);
            }

            DB::connection($this->connection)
                ->table('issues')
                ->insert([
                    "profile_affected" => $data['profile_affected'] ?? null,
                    "issue" => $data['issue'] ?? null,
                    "analisa" => $data['analisa'] ?? null,
                    "risk" => $data['risk'] ?? null,
                    "solution" => $data['solution'] ?? null,
                    "keterangan" => $data['keterangan'] ?? null,
                    "status" => $data['status'] ?? "Open",
                ]);

            return response()->json([
                "success" => true,
                "message" => "Issue berhasil ditambahkan"
            ]);

        } catch (\Throwable $e) {

            Log::error("add issue error: " . $e->getMessage());

            return response()->json([
                "success" => false,
                "message" => "Gagal menambahkan issue"
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {

            if (!$id) {
                return response()->json([
                    "success" => false,
                    "message" => "ID wajib diisi"
                ], 400);
            }

            $data = $request->only(['status', 'keterangan']);

            DB::connection($this->connection)
                ->table('issues')
                ->where('id', $id)
                ->update([
                    "status" => $data['status'] ?? null,
                    "keterangan" => $data['keterangan'] ?? null,
                ]);

            return response()->json([
                "success" => true,
                "message" => "Issue berhasil diupdate"
            ]);

        } catch (\Throwable $e) {

            Log::error("update issue error: " . $e->getMessage());

            return response()->json([
                "success" => false,
                "message" => "Gagal update issue"
            ], 500);
        }
    }
    
    public function delete($id)
    {
        try {

            if (!$id) {
                return response()->json([
                    "success" => false,
                    "message" => "ID wajib diisi"
                ], 400);
            }

            DB::connection($this->connection)
                ->table('issues')
                ->where('id', $id)
                ->delete();

            return response()->json([
                "success" => true,
                "message" => "Issue berhasil dihapus"
            ]);

        } catch (\Throwable $e) {

            Log::error("delete issue error: " . $e->getMessage());

            return response()->json([
                "success" => false,
                "message" => "Gagal menghapus issue"
            ], 500);
        }
    }
}