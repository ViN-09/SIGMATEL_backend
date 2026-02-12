<?php

namespace App\Http\Controllers\ttc_paniki_controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class VisitorsController extends Controller
{
    protected $connection = 'mysql';

    public function registvisitor(Request $request)
    {
        try {
            // ============================
            // AMBIL DATA JSON SECARA PAKSA
            // ============================
            $data = $request->json()->all();

            if (empty($data)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request body kosong / JSON tidak terbaca',
                ], 400);
            }

            // ============================
            // VALIDASI
            // ============================
            $validator = Validator::make($data, [
                'name'      => 'required|string|max:255',
                'company'   => 'required|string|max:255',
                'phone'     => 'required|string|max:20',
                'idType'    => 'required|string|max:50',
                'idNumber'  => 'required|string|max:100',
                'visitId'   => 'required|string|max:50',
                'activity'  => 'required|string',
                'workspace' => 'required|string|max:255',
                'signature' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors'  => $validator->errors(),
                ], 422);
            }

            // ============================
            // PROSES SIGNATURE BASE64
            // ============================
            $signatureData = str_replace('data:image/png;base64,', '', $data['signature']);
            $signatureData = str_replace(' ', '+', $signatureData);
            $decoded = base64_decode($signatureData);

            if ($decoded === false) {
                return response()->json([
                    'success' => false,
                    'message' => 'Signature invalid',
                ], 400);
            }

            $signatureName = 'signature_' . time() . '.png';
            Storage::disk('public')->put('signatures/' . $signatureName, $decoded);

            // ============================
            // INSERT DATABASE
            // ============================
            $now = Carbon::now();

            $id = DB::connection($this->connection)
                ->table('visitors')
                ->insertGetId([
                    'name'            => $data['name'],
                    'company'         => $data['company'],
                    'phone'           => $data['phone'],
                    'id_type'         => $data['idType'],
                    'id_number'       => $data['idNumber'],
                    'visit_id'        => $data['visitId'],
                    'activity'        => $data['activity'],
                    'ruang_kerja'     => $data['workspace'],
                    'signature'       => $signatureName,
                    'status'          => 'pending',

                    // ✅ FIX: biar gak error "doesn't have default value"
                    'dokumentasi_in'  => null,
                    'dokumentasi_out' => null,

                    'created_at'      => $now,
                    'updated_at'      => $now,
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Visitor registered successfully',
                'data' => [
                    'id'              => $id,
                    'name'            => $data['name'],
                    'company'         => $data['company'],
                    'phone'           => $data['phone'],
                    'id_type'         => $data['idType'],
                    'id_number'       => $data['idNumber'],
                    'visit_id'        => $data['visitId'],
                    'activity'        => $data['activity'],
                    'ruang_kerja'     => $data['workspace'],
                    'signature'       => $signatureName,
                    'status'          => 'pending',
                    'dokumentasi_in'  => null,
                    'dokumentasi_out' => null,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error($e);

            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update status + upload dokumentasi IN/OUT
     * Endpoint: POST /api/ttc_paniki/visitors/{id}/update-status
     * Body: multipart/form-data
     * - status: approved | selesai | rejected
     * - dokumentasi_in: (file) optional
     * - dokumentasi_out: (file) optional
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $visitor = DB::connection($this->connection)
                ->table('visitors')
                ->where('id', $id)
                ->first();

            if (!$visitor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Visitor tidak ditemukan',
                ], 404);
            }

            $status = $request->input('status');

            if (!$status) {
                return response()->json([
                    'success' => false,
                    'message' => 'Status wajib dikirim',
                ], 422);
            }

            // status yang diizinkan (silakan sesuaikan)
            $allowed = ['approved', 'selesai', 'rejected', 'pending'];
            if (!in_array($status, $allowed, true)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Status tidak valid',
                ], 422);
            }

            $update = [
                'status'     => $status,
                'updated_at' => Carbon::now(),
            ];

            // ✅ FIX: key harus "dokumentasi_in"
            if ($request->hasFile('dokumentasi_in')) {
                $file = $request->file('dokumentasi_in');

                if (!$file->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'File dokumentasi_in tidak valid',
                    ], 422);
                }

                $filename = 'in_' . time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                $file->storeAs('public/visitors', $filename);
                $update['dokumentasi_in'] = $filename;
            }

            // ✅ FIX: key harus "dokumentasi_out"
            if ($request->hasFile('dokumentasi_out')) {
                $file = $request->file('dokumentasi_out');

                if (!$file->isValid()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'File dokumentasi_out tidak valid',
                    ], 422);
                }

                $filename = 'out_' . time() . '_' . preg_replace('/\s+/', '_', $file->getClientOriginalName());
                $file->storeAs('public/visitors', $filename);
                $update['dokumentasi_out'] = $filename;
            }

            DB::connection($this->connection)
                ->table('visitors')
                ->where('id', $id)
                ->update($update);

            return response()->json([
                'success' => true,
                'message' => 'Status berhasil diupdate',
                'data'    => $update,
            ], 200);

        } catch (\Exception $e) {
            Log::error($e);

            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
