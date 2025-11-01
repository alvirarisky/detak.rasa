<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Ini akan memanggil file: resources/js/Pages/Landing.jsx
    return Inertia::render('Landing', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('landing');

Route::get('/menu', function () {
    return Inertia::render('GameMenu'); // Panggil GameMenu.jsx
})->middleware(['auth', 'verified'])->name('game.menu');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/game/truth-or-dare', [GameController::class, 'truthOrDare'])->name('game.truth-or-dare');
    Route::get('/game/telepati', [GameController::class, 'telepati'])->name('game.telepati');
    Route::get('/game/would-you-rather', [GameController::class, 'wouldYouRather'])->name('game.wyr');
    Route::get('/game/heart-meter', [GameController::class, 'heartMeter'])->name('game.heart-meter');
    Route::get('/game/pick-a-memory', [GameController::class, 'pickAMemory'])->name('game.memory');
    Route::get('/game/compatibility-spin', [GameController::class, 'compatibilitySpin'])->name('game.spin');
    Route::get('/game/summary', [GameController::class, 'summary'])->name('game.summary');
});

require __DIR__ . '/auth.php';
