import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react'; // <-- Import Link udah bener
import GameCard from '@/Components/GameCard';
import { route } from 'ziggy-js';

export default function GameMenu({ auth }) {
    
    // Ini data untuk 6 kartu game kamu
    const games = [
        { emoji: '🎲', title: 'Truth or Dare', desc: 'Berani jujur atau jujur berani?', href: route('game.truth-or-dare') },
        { emoji: '🧠', title: 'Telepati Pasangan', desc: 'Seberapa nyatu pikiran kalian?', href: route('game.telepati') },
        { emoji: '🤔', title: 'Would You Rather', desc: 'Pilih mana? Tapi jangan nyesel ya 😏', href: route('game.wyr') },
        { emoji: '💓', title: 'Heart Meter', desc: 'Ukur detak kalian, lihat apakah sinkron.', href: route('game.heart-meter') },
        { emoji: '🎁', title: 'Pick a Memory', desc: 'Buka kenangan, satu kartu sekali rasa.', href: route('game.memory') },
        { emoji: '🫶', title: 'Compatibility Spin', desc: 'Seberapa cocok kalian hari ini?', href: route('game.spin') },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Enam Detak Cerita</h2>}
        >
            <Head title="Menu Game" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* --- INI GRID KARTU --- */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {games.map((game) => (
                                    <GameCard
                                        key={game.title}
                                        href={game.href}
                                        emoji={game.emoji}
                                        title={game.title}
                                        desc={game.desc}
                                    />
                                ))}

                            </div> 
                            {/* --- BATAS GRID KARTU --- */}

                            {/* --- TOMBOL SUMMARY (DI LUAR GRID) --- */}
                            <div className="text-center mt-10 pt-6 border-t">
                                <Link
                                    href={route('game.summary')}
                                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                                >
                                    🌙 Lihat Love Summary Kalian!
                                </Link>
                            </div>
                            {/* --- BATAS TOMBOL SUMMARY --- */}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}