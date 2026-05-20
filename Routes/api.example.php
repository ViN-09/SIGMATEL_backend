<?php

//Controler Paniki
use App\Http\Controllers\ttc_paniki_controllers\data_potensi as DataPotensi2Paniki;
use App\Http\Controllers\ttc_paniki_controllers\checklist as CheckListPaniki2;
use App\Http\Controllers\ttc_paniki_controllers\fixedCeklsit as Fixedceklist;
use App\Http\Controllers\ttc_paniki_controllers\ProfilesController as resumePaniki;
use App\Http\Controllers\ttc_paniki_controllers\VisitorsController as VisitorPaniki;
use App\Http\Controllers\ttc_paniki_controllers\summary_pue as SummaryPuePaniki;
use App\Http\Controllers\ttc_paniki_controllers\IssueController as  IssuePaniki;
use App\Http\Controllers\ttc_paniki_controllers\RequestTableStructureController;
use App\Http\Controllers\ttc_paniki_controllers\DataDashboard as DataDashboard;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\user\login as loginall;
use App\Http\Controllers\user\user as userall;
use App\Http\Controllers\user\userrequest as userrequestall;


Route::prefix('user')->group(function () {
    Route::post('/login/try', [loginall::class, 'cekLogin']);
    Route::get('/user/{id}', [userall::class, 'show']);
    Route::get('/', [userall::class, 'index']);
    Route::get('/{id}', [userall::class, 'show']);
    Route::post('/', [userall::class, 'store']);
    Route::put('/{id}', [userall::class, 'update']);
    Route::delete('/{id}', [userall::class, 'destroy']);
    Route::post('/cekpass', [userall::class, 'cekpass']);
    Route::post('/{id}/update-password', [userall::class, 'updatePassword']);
    Route::get('/stafflist/{site}/{jabatan}', [userrequestall::class, 'stafflist']);//

});

Route::prefix('ttc_paniki')->group(function () {

    Route::prefix('data_potensi2')->group(function () {
        Route::get('/fullDapot', [DataPotensi2Paniki::class, 'getAllDataPotensi']);
        Route::post('/crudDapot', [DataPotensi2Paniki::class, 'crudDapot']);
    });

     Route::prefix('checklist2')->group(function () {
        Route::get('/dialyActivityList/{monthYear?}', [Fixedceklist::class, 'showDialyActivity']);
        Route::get('/pullreport/{id}/{type}', [Fixedceklist::class, 'getReport']);
        Route::get('/requestTableStructure/{table}', [Fixedceklist::class, 'requestTableStructure']);
        Route::get('/stafflist/{jabatan}', [Fixedceklist::class, 'stafflist']);//otw ganti
        Route::post('/cereateReportID', [Fixedceklist::class, 'cereateReportID']);
        Route::post('/cereateReport', [Fixedceklist::class, 'createReport']);

    });

       Route::prefix('data_potensi')->group(function () {
        Route::get('/puedashboard/{tanggal}/{jenis}', [DataDashboard::class, 'puedatadashboard']);
    });

    Route::prefix('summary_pue')->group(function () {
        Route::get('/data_report/{type}/{startDate?}/{endDate?}', [SummaryPuePaniki::class, 'tableReportList']);
    });

    Route::get('/profiles', [resumePaniki::class, 'profiles']);
    Route::get('/hello', [resumePaniki::class, 'hello']);

    Route::prefix('visitor')->group(function () {
        Route::post('/registry', [VisitorPaniki::class, 'registvisitor']);
        Route::get('/waiting', [VisitorPaniki::class, 'waiting']);
        Route::post('/visitors/{id}/update-status', [VisitorPaniki::class, 'updateStatus']);
        Route::get('/visitors/completed', [VisitorPaniki::class, 'completed']);
    });

    Route::prefix('issue')->group(function () {
        Route::get('/', [IssuePaniki::class, 'index']);
        Route::post('/add', [IssuePaniki::class, 'store']);
        Route::put('/update/{id}', [IssuePaniki::class, 'update']);
    });


});
