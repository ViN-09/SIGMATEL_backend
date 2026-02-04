<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VisitorsController extends Controller
{
    
    public function getVisitors()
    {
        try {
            
            $data = DB::table('visitors')->get();

            return response()->json($data); 

        } catch (\Exception $e) {
           
            Log::error("Error getVisitors: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    
    public function addVisitor(Request $request)
    {
        try {
            
            $request->validate([
                'name' => 'required|string',
                'company' => 'required|string',
                'phone' => 'required|string',
                'id_type' => 'required|string',
                'id_number' => 'required|string',
                'visit_id' => 'required|string',
                'activity' => 'required|string',
                'status' => 'required|string',
            ]);

            
            DB::table('visitors')->insert([
                'name' => $request->name,
                'company' => $request->company,
                'phone' => $request->phone,
                'id_type' => $request->id_type,
                'id_number' => $request->id_number,
                'visit_id' => $request->visit_id,
                'activity' => $request->activity,
                'created_at' => now(),
                'updated_at' => now(),
                'status' => $request->status,
            ]);

            return response()->json(['message' => 'Visitor added successfully'], 201);

        } catch (\Exception $e) {
            Log::error("Error addVisitor: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
