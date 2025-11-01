import { Link, Head } from '@inertiajs/react';

// Komponen SVG Hati
const HeartIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

// 1. TAMBAHKAN 'auth' DI SINI
export default function Landing({ auth, canLogin, canRegister }) {

    // 2. BIKIN LOGIKA TOMBOL PINTER
    // Cek apakah 'auth.user' ada (artinya sudah login)
    const destination = auth.user ? route('game.menu') : route('login');

    return (
        <>
            <Head title="Selamat Datang di Detak Rasa" />
            
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 to-blue-200">
                
                <div className="text-center text-white p-8 rounded-lg">
                    
                    <HeartIcon className="w-24 h-24 text-pink-500 mx-auto mb-6 animate-heartbeat" />

                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Setiap detak menyimpan cerita.
                    </h1>
                    <p className="text-xl text-gray-700 mb-10">
                        Hari ini, ayo kita kenali detak itu — bersama.
                    </p>

                    {/* 3. GUNAKAN 'destination' DI SINI */}
                    <Link
                        href={destination}
                        className="inline-block px-8 py-4 bg-white text-pink-500 font-bold rounded-full shadow-lg transition-transform transform hover:scale-110"
                    >
                        💞 Mulai Perjalanan
                    </Link>

                </div>
            </div>
        </>
    );
}