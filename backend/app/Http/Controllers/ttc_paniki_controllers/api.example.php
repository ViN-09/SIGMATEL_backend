<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Route;
use Carbon\Carbon;

//Controler Trial
use App\Http\Controllers\ttc_paniki_controllers_test\data_potensi as DataPotensi2Paniki;
use App\Http\Controllers\ttc_paniki_controllers_test\checklist as CheckListPaniki2;
use App\Http\Controllers\ttc_paniki_controllers_test\summary_pue as SummaryPuePaniki;


/////////////////////////////////////////////////////////////////////////////Paniki/////////////////////////////////////////////////////////////////////////////////////////
Route::prefix('ttc_paniki')->group(function () {
    
    Route::prefix('data_potensi2')->group(function () {
        Route::get('/fullDapot', [DataPotensi2Paniki::class, 'getAllDataPotensi']);
    });
    Route::prefix('checklist2')->group(function () {

        Route::get('/dialyActivityList/{ym}', [CheckListPaniki2::class, 'dialyActivityListByMonth']);
        Route::get('/pullreport/{id}/{type}', [CheckListPaniki2::class, 'pullReport']);
        Route::get('dialyActivityList', [CheckListPaniki2::class, 'dialyActivityList']
        );

    });

    Route::prefix('summary_pue')->group(function () {
        Route::get('/data_report/{type}/{startDate?}/{endDate?}', [SummaryPuePaniki::class, 'tableReportList']);
    });
});





