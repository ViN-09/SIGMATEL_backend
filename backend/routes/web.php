<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/', function () {
    return view('welcome');
});

// Route khusus untuk PDF preview
Route::get('/storage/pdf-preview/{filename}', function ($filename) {
    $path = 'layout/' . $filename;
    
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }

    $filePath = Storage::disk('public')->path($path);
    
    $response = response()->file($filePath, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $filename . '"'
    ]);

    // Tambahkan header CORS
    $response->headers->set('Access-Control-Allow-Origin', '*');
    $response->headers->set('Access-Control-Allow-Methods', 'GET');

    return $response;
});

// Route fallback untuk file lainnya
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    return response()->file($fullPath);
})->where('path', '.*');