<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dapot extends Model
{
    use HasFactory;

    protected $table = 'dp_cctv'; // Ini penting: override nama tabel
}
