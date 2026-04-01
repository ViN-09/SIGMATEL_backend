<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ttc_paniki_controllers\data_potensi as DataPotensi2Paniki;
use App\Http\Controllers\ttc_paniki_controllers\checklist as CheckListPaniki2;
use App\Http\Controllers\ttc_paniki_controllers\summary_pue as SummaryPuePaniki;
use App\Http\Controllers\ttc_paniki_controllers\VisitorsController;
use App\Http\Controllers\ttc_paniki_controllers\UserController;
use App\Http\Controllers\ttc_paniki_controllers\ProfilesController;
use App\Http\Controllers\ttc_paniki_controllers\RequestTableStructureController;
use App\Http\Controllers\ttc_paniki_controllers\IssueController;

Route::get('/user/stafflist/{site}/{jabatan}', [UserController::class, 'staffList']);


Route::prefix('ttc_paniki')->group(function () {

    Route::prefix('data_potensi')->group(function () {
        Route::get('/fullDapot', [DataPotensi2Paniki::class, 'getAllDataPotensi']);
    });

    Route::prefix('checklist2')->group(function () {
        Route::get('/dialyActivityList/{ym}', [CheckListPaniki2::class, 'dialyActivityListByMonth']);
        Route::get('/pullreport/{id}/{type}', [CheckListPaniki2::class, 'pullReport']);
        Route::get('/dialyActivityList', [CheckListPaniki2::class, 'dialyActivityList']);
        Route::post('/cereateReportID', [CheckListPaniki2::class, 'cereateReportID']);
        Route::post('/cereateReport', [CheckListPaniki2::class, 'createReport']);

        Route::get('/requestTableStructure/{form}', [RequestTableStructureController::class, 'requestTableStructure']);
    });

    Route::prefix('summary_pue')->group(function () {
        Route::get('/data_report/{type}/{startDate?}/{endDate?}', [SummaryPuePaniki::class, 'tableReportList']);
    });

    Route::post('/visitor/registry', [VisitorsController::class, 'registvisitor']);
    Route::get('/visitor', [VisitorsController::class, 'index']);
    Route::get('/visitor/waiting', [VisitorsController::class, 'waiting']);
    Route::post('/visitor/{id}/update-status', [VisitorsController::class, 'updateStatus']);

    Route::prefix('user')->group(function () {
        Route::get('/{id}', [UserController::class, 'show']);
    });

    Route::get('/profiles', [ProfilesController::class, 'profiles']);
    
    Route::get('/issue', [IssueController::class, 'index']);

});

Route::prefix('ttc_paniki')->group(function () {

    // GET (sudah ada)
    Route::get('/issue', [IssueController::class, 'index']);

    // CREATE
    Route::post('/issue/add', [IssueController::class, 'store']);

    // UPDATE
    Route::put('/issue/update/{id}', [IssueController::class, 'update']);

});