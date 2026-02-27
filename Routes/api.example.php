<?php

use App\Http\Controllers\ttc_paniki_controllers\checklist as CheckListPaniki2;
use App\Http\Controllers\ttc_paniki_controllers\data_potensi as DataPotensi2Paniki;
use App\Http\Controllers\ttc_paniki_controllers\ProfilesController;
use App\Http\Controllers\ttc_paniki_controllers\summary_pue as SummaryPuePaniki;
use App\Http\Controllers\ttc_paniki_controllers\UserController;
use App\Http\Controllers\ttc_paniki_controllers\VisitorsController;
use Illuminate\Support\Facades\Route;

Route::prefix('ttc_paniki')->group(function () {

    Route::prefix('data_potensi')->group(function () {
        Route::get('/fullDapot', [DataPotensi2Paniki::class, 'getAllDataPotensi']);
    });

    Route::prefix('checklist2')->group(function () {
        Route::get('/dialyActivityList/{ym}', [CheckListPaniki2::class, 'dialyActivityListByMonth']);
        Route::get('/pullreport/{id}/{type}', [CheckListPaniki2::class, 'pullReport']);
        Route::get('/dialyActivityList', [CheckListPaniki2::class, 'dialyActivityList']);
    });

    Route::prefix('summary_pue')->group(function () {
        Route::get('/data_report/{type}/{startDate?}/{endDate?}', [SummaryPuePaniki::class, 'tableReportList']);
    });

    // visitors
        Route::post('/visitor/registry', [VisitorsController::class, 'registvisitor']);
        Route::get('/visitor', [VisitorsController::class, 'index']);
        Route::get('/visitor/waiting', [VisitorsController::class, 'waiting']);
        Route::get('/visitor/completed', [VisitorsController::class, 'completed']);
        Route::post('/visitor/{id}/update-status', [VisitorsController::class, 'updateStatus']);
        Route::post('/visitor/visitors/{id}/update-status', [VisitorsController::class, 'updateStatus']);

    Route::prefix('data_potensi2')->group(function () {
        Route::get('fullDapot', [data_potensi::class, 'fullDapot']);
        Route::post('crudDapot', [data_potensi::class, 'crudDapot']);

    });
    
    Route::prefix('user')->group(function () {
        Route::get('/{id}', [UserController::class, 'show']);
    });

        Route::get('/stafflist/{jabatan}', [UserController::class, 'staffList']);

        Route::get('/profiles', [ProfilesController::class, 'profiles']);
});
