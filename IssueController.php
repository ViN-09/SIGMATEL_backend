<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

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
            "issue" => $this->getIssue(),
            "issue_building" => $this->getIssueBuilding()
        ]);
    }
}