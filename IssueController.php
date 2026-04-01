<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

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

    private function getIssueBuilding()
    {
        return DB::connection($this->connection)
            ->table('issues')
            ->whereRaw("LOWER(TRIM(profile_affected)) = 'building'")
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
        return response()->json([
            "data" => $this->getIssue()
        ]);
    }

    public function store(Request $request)
{
    $id = DB::connection($this->connection)
        ->table('issues')
        ->insertGetId([
            "issue" => $request->issue,
            "analisa" => $request->analisa,
            "risk" => $request->risk,
            "solution" => $request->solution,
            "keterangan" => $request->keterangan,
            "status" => $request->status ?? "Open",
            "profile_affected" => $request->profile_affected,
        ]);

    return response()->json([
        "message" => "Issue berhasil ditambahkan",
        "id" => $id
    ]);
}
public function update(Request $request, $id)
{
    DB::connection($this->connection)
        ->table('issues')
        ->where('id', $id)
        ->update([
            "status" => $request->status,
            "keterangan" => $request->keterangan,
        ]);

    return response()->json([
        "message" => "Issue berhasil diupdate"
    ]);
}
public function delete($id)
{
    DB::connection($this->connection)
        ->table('issues')
        ->where('id', $id)
        ->delete();

    return response()->json([
        "message" => "Issue berhasil dihapus"
    ]);
}
    }