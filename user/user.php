<?php

namespace App\Http\Controllers\user;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

Carbon::setLocale('id');

class user extends Controller
{
    protected $connection = 'mysql3';

    // ✔ Ambil semua data user_bio
    public function index()
    {
        $data = DB::connection($this->connection)
            ->table('user_bio')
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // ✔ Ambil user berdasarkan ID
    public function show($id)
    {
        $data = DB::connection($this->connection)
            ->table('user_bio')
            ->where('id', $id)
            ->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    // ✔ Tambah user baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Nama'     => 'required|string',
            'jabatan'  => 'required|string',
            'tl'       => 'required|string',
            'Alamat'   => 'required|string',
            'noTELP'   => 'required|string',
            'email'    => 'required|email',
            'gambar'   => 'nullable|string',
            'idx'      => 'nullable|string'
        ]);

        $id = DB::connection($this->connection)
            ->table('user_bio')
            ->insertGetId($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil ditambahkan',
            'id' => $id
        ]);
    }

    // ✔ Update user berdasarkan ID
    public function update(Request $request, $id)
{
    // Validasi
    $validated = $request->validate([
        'Nama'     => 'nullable|string',
        'jabatan'  => 'nullable|string',
        'tl'       => 'nullable|string',
        'Alamat'   => 'nullable|string',
        'noTELP'   => 'nullable|string',
        'email'    => 'nullable|email',
        'gambar'   => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:2048',
    ]);

    // Ambil data user lama
    $user = DB::connection($this->connection)
        ->table('user_bio')
        ->where('id', $id)
        ->first();

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ]);
    }

    // Jika upload gambar baru
    if ($request->hasFile('gambar')) {

        // Hapus gambar lama
        if ($user->gambar && Storage::disk('public')->exists('profile_picture/' . $user->gambar)) {
            Storage::disk('public')->delete('profile_picture/' . $user->gambar);
        }

        // Upload gambar baru
        $file = $request->file('gambar');
        $filename = time() . '_' . $file->getClientOriginalName();

        $file->storeAs('profile_picture', $filename, 'public');

        // Set nama file ke kolom
        $validated['gambar'] = $filename;
    } 
    else {
        // Jangan timpa kolom gambar
        unset($validated['gambar']);
    }

    // Simpan perubahan
    DB::connection($this->connection)
        ->table('user_bio')
        ->where('id', $id)
        ->update($validated);

    return response()->json([
        'success' => true,
        'message' => 'User berhasil diperbarui'
    ]);
}



    // ✔ Hapus user berdasarkan ID
    public function destroy($id)
    {
        $deleted = DB::connection($this->connection)
            ->table('user_bio')
            ->where('id', $id)
            ->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus'
        ]);
    }

    public function cekpass(Request $request)
{
    try {
        if (!$request->id || !$request->password) {
            return response()->json([
                'valid' => false,
                'message' => 'ID atau password tidak dikirim'
            ], 400);
        }

        $user = DB::connection($this->connection)
            ->table('user')
            ->where('id', $request->id)
            ->first();

        if (!$user) {
            return response()->json([
                'valid' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        if (!isset($user->password)) {
            return response()->json([
                'valid' => false,
                'message' => 'Kolom password tidak ditemukan di tabel user_bio'
            ], 500);
        }

        // 🔥 DEBUG — LIHAT PASSWORD YANG MASUK
        \Log::info('CEKPASS DEBUG', [
            'input_password' => $request->password,
            'db_password'    => $user->password
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'valid' => false,
                'message' => 'Password salah'
            ], 200);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Password benar'
        ], 200);

    } catch (\Exception $e) {
        \Log::error("ERROR cekpass: " . $e->getMessage());

        return response()->json([
            'valid' => false,
            'message' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
}

public function updatePassword(Request $request, $id)
{
    try {
        // Validasi input
        $request->validate([
            'newpass' => 'required|string|min:3'
        ]);

        // Ambil data user
        $user = DB::connection($this->connection)
            ->table('user')
            ->where('id', $id)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan'
            ], 404);
        }

        // Hash password baru
        $hashed = Hash::make($request->newpass);

        // Update ke DB
        DB::connection($this->connection)
            ->table('user')
            ->where('id', $id)
            ->update([
                'password' => $hashed
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui'
        ], 200);

    } catch (\Exception $e) {
        \Log::error("ERROR updatePassword: " . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Server error: ' . $e->getMessage()
        ], 500);
    }
}

public function stafflist($jabatan)
    {
        $data = DB::connection($this->connection)
            ->table('user_bio')
            ->select('id', 'Nama')
            ->where('jabatan', $jabatan)
            ->get()
            ->prepend(['id' => '-', 'Nama' => '-']);

        return response()->json($data);
    }

private function fetchUserBio($username)
    {
        $bio = DB::connection($this->connection)
            ->table('user_bio')
            ->where('id', $username) // join pake user_activity.username ↔ user_bio.id
            ->select('Nama', 'gambar')
            ->first();

        if (!$bio) {
            return null;
        }

        // Ambil kata pertama dari Nama
        $firstName = explode(' ', trim($bio->Nama))[0];

        return [
            'nama'   => $firstName,
            'gambar' => $bio->gambar,
        ];
    }



}
