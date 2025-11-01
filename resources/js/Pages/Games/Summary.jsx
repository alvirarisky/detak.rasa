import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';

export default function Summary({ auth }) {
    
    // State untuk nyimpen hasil dari Local Storage
    const [telepati, setTelepati] = useState(null);
    const [heartMeter, setHeartMeter] = useState(null);
    const [compatibility, setCompatibility] = useState(null);

    // useEffect akan jalan sekali pas halaman kebuka
    useEffect(() => {
        // Ambil data dari Local Storage
        const telRes = localStorage.getItem('telepatiResult');
        const hmRes = localStorage.getItem('heartMeterResult');
        const comRes = localStorage.getItem('compatibilityResult');

        // Set ke state biar bisa di-render
        if (telRes) setTelepati(telRes);
        if (hmRes) setHeartMeter(hmRes);
        if (comRes) setCompatibility(comRes);
    }, []); // Array kosong = "Jalankan sekali pas load"

    // Fungsi buat clear hasil (kalo 'Main Lagi')
    const handlePlayAgain = () => {
        localStorage.removeItem('telepatiResult');
        localStorage.removeItem('heartMeterResult');
        localStorage.removeItem('compatibilityResult');
        // Arahkan ke menu
        return route('game.menu');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        🌙 Detak Hari Ini (Summary)
                    </h2>
                    <Link 
                        href={route('game.menu')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                        &larr; Kembali ke Menu
                    </Link>
                </div>
            }
        >
            <Head title="Summary" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-center">

                            <h3 className="text-3xl font-bold mb-6">Love Summary Chart</h3>
                            
                            <div className="space-y-4 text-left">
                                {/* Hasil Telepati */}
                                <div className="p-4 bg-blue-100 rounded-lg shadow">
                                    <p className="font-bold text-blue-800">🧠 Telepati Pasangan</p>
                                    <p className="text-2xl font-semibold">
                                        {telepati ? `Skor: ${telepati}` : "(Belum dimainkan)"}
                                    </p>
                                </div>
                                
                                {/* Hasil Heart Meter */}
                                <div className="p-4 bg-pink-100 rounded-lg shadow">
                                    <p className="font-bold text-pink-800">💓 Heart Meter</p>
                                    <p className="text-2xl font-semibold">
                                        {heartMeter || "(Belum dimainkan)"}
                                    </p>
                                </div>
                                
                                {/* Hasil Compatibility Spin */}
                                <div className="p-4 bg-purple-100 rounded-lg shadow">
                                    <p className="font-bold text-purple-800">🫶 Compatibility Spin</p>
                                    <p className="text-2xl font-semibold">
                                        {compatibility || "(Belum dimainkan)"}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Pesan Penutup */}
                            <div className="mt-10 pt-6 border-t">
                                <p className="text-lg italic text-gray-700">
                                    “Cinta bukan soal sama terus, tapi soal nyoba nyatu tiap kali beda.
                                </p>
                                <p className="text-lg italic text-gray-700 mt-2">
                                    Hari ini, kalian udah ngelakuin itu — detak demi detak.”
                                </p>
                            </div>

                            {/* Tombol Akhir */}
                            <div className="mt-8">
                                <Link 
                                    href={handlePlayAgain()} 
                                    className="px-6 py-3 bg-pink-500 text-white font-bold rounded-lg mr-4"
                                >
                                    💌 Main Lagi (Reset Skor)
                                </Link>
                                {/* <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg">
                                    Kirim Pesan untuk Dia
                                </button> */}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}