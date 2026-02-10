<?php
namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class VisitorsController extends Controller
{
    // Menampilkan daftar pengunjung
    public function getVisitors()
    {
        try {
            $data = DB::table('visitors')->get();

            return response()->json([
                'success' => true,
                'message' => 'List of visitors waiting for approval',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            Log::error("Error getVisitors: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Menambah pengunjung baru
    public function addVisitor(Request $request)
    {
        try {
            // Validasi data request
            $request->validate([
                'name' => 'required|string',
                'company' => 'required|string',
                'phone' => 'required|string',
                'id_type' => 'required|string',
                'id_number' => 'required|string',
                'visit_id' => 'required|string',
                'activity' => 'required|string',
                'status' => 'required|string',
                'signature' => 'nullable|string', // Pastikan signature adalah base64 string
            ]);

            // Menyimpan file signature jika ada
            $signaturePath = null;
            if ($request->signature) {
                // Decode base64 string
                $signatureData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->signature));
                $signaturePath = 'signatures/' . uniqid() . '.png';
                Storage::disk('public')->put($signaturePath, $signatureData);
            }

            // Menyimpan data visitor ke dalam tabel visitors
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
                'signature' => $signaturePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Visitor added successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error("Error addVisitor: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error adding visitor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
