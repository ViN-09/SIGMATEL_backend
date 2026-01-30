<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class Alarm extends Controller
{
    protected $connection = 'mysql2';

    public function getAlarms(Request $request)
    {
        try {
            if (!Schema::connection($this->connection)->hasTable('dp_alarm')) {
                return response()->json([
                    'error' => 'Table dp_alarm not found'
                ], 404);
            }

            $limit = $request->input('limit', 25);
            $page = $request->input('page', 1);
            $date = $request->input('date', null);

            $query = DB::connection($this->connection)->table('dp_alarm');

            if ($date) {
                $query->whereDate('date', $date);
            }

            $total = $query->count();

            $alarms = $query
                ->orderBy('date', 'desc')
                ->offset(($page - 1) * $limit)
                ->limit($limit)
                ->get();

            return response()->json([
                'data' => $alarms,
                'pagination' => [
                    'total' => $total,
                    'per_page' => (int) $limit,
                    'current_page' => (int) $page,
                    'total_pages' => ceil($total / $limit),
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
