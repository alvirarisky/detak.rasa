<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Tambahkan ini
use Inertia\Response; // <-- Tambahkan ini

class GameController extends Controller
{
    // 🎲 Truth or Dare
    public function truthOrDare(): Response
    {
        // Ini akan panggil file: resources/js/Pages/Games/TruthOrDare.jsx
        return Inertia::render('Games/TruthOrDare');
    }

    // 🧠 Telepati
    public function telepati(): Response
    {
        return Inertia::render('Games/Telepati'); // (file-nya belum kita buat)
    }

    // 🤔 Would You Rather
    public function wouldYouRather(): Response
    {
        return Inertia::render('Games/WouldYouRather'); // (file-nya belum kita buat)
    }

    // 💓 Heart Meter
    public function heartMeter(): Response
    {
        return Inertia::render('Games/HeartMeter'); // (file-nya belum kita buat)
    }

    // 🎁 Pick a Memory
    public function pickAMemory(): Response
    {
        return Inertia::render('Games/PickAMemory'); // (file-nya belum kita buat)
    }


    // ... (fungsi compatibilitySpin kamu)
    public function compatibilitySpin(): Response
    {
        return Inertia::render('Games/CompatibilitySpin');
    }

    // 👇 --- TAMBAHKAN FUNGSI INI --- 👇
    // 🌙 Ending Page
    public function summary(): Response
    {
        return Inertia::render('Games/Summary');
    }
}