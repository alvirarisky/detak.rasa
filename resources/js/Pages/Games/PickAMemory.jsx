import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';

// ---------------------------------------------------------------
// [Bank 9 Prompt Kenangan]
// ---------------------------------------------------------------
const pickMemoryPrompts = [
  "Momen kecil yang masih kamu inget banget sampai sekarang?",
  "Hal paling random yang pernah kalian lakuin tapi malah jadi lucu banget?",
  "Waktu kapan kalian ngerasa paling nyatu sebagai tim?",
  "Kencan pertama versi kamu tuh kayak gimana ceritanya?",
  "Apa hal pertama yang bikin kamu tertarik sama dia?",
  "Pernah nggak ada momen awkward tapi malah jadi sweet?",
  "Kalimat atau ucapan dari dia yang masih keinget sampai sekarang?",
  "Momen apa yang pengen kamu ulang kalau bisa balik ke masa itu?",
  "Hal paling sederhana yang bisa langsung bikin kamu inget dia?",
];
// Fungsi untuk 'mengocok' array dan mengambil 9
const getInitialCards = () => {
    // Kita 'map' jadi objek yang siap pakai
    return initialPrompts.map((prompt, index) => ({
        id: index,
        prompt: prompt,
        isFlipped: false,
        answer1: '',
        answer2: '',
    }));
};
// ---------------------------------------------------------------


export default function PickAMemory({ auth }) {
    // State alur game
    const [gameStage, setGameStage] = useState('setup'); // setup, playing, allDone
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [error, setError] = useState('');
    
    // State kartu
    const [cards, setCards] = useState(getInitialCards());
    
    // State untuk Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [tempAnswer1, setTempAnswer1] = useState(''); // Jawaban di modal
    const [tempAnswer2, setTempAnswer2] = useState(''); // Jawaban di modal

    // --- FUNGSI-FUNGSI GAME ---

    // 1. Mulai game (dari 'setup')
    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError('');
            setCards(getInitialCards()); // Reset kartu tiap main baru
            setGameStage('playing'); 
        } else {
            setError('Isi dulu kedua nama pemain!');
        }
    };

    // 2. Saat kartu diklik (dari 'playing')
    const handleCardClick = (clickedCard) => {
        if (clickedCard.isFlipped) return; // Jangan lakukan apa-apa kalo udah kebuka

        setSelectedCard(clickedCard);
        // Muat jawaban lama (kalo ada, tapi harusnya gaada)
        setTempAnswer1(clickedCard.answer1);
        setTempAnswer2(clickedCard.answer2);
        setModalIsOpen(true); // Buka modal
    };
    
    // 3. Saat modal ditutup (tanpa simpan)
    const handleCloseModal = () => {
        setModalIsOpen(false);
        setSelectedCard(null);
    };

    // 4. Saat simpan jawaban (dari 'modal')
    const handleSaveMemory = (e) => {
        e.preventDefault();
        
        // Update kartu di state 'cards'
        const updatedCards = cards.map(card => {
            if (card.id === selectedCard.id) {
                return { 
                    ...card, 
                    isFlipped: true, // Tandai sebagai 'terbuka'
                    answer1: tempAnswer1,
                    answer2: tempAnswer2,
                };
            }
            return card;
        });
        
        setCards(updatedCards);
        handleCloseModal(); // Tutup modal

        // Cek apakah semua kartu sudah kebuka
        const allFlipped = updatedCards.every(card => card.isFlipped);
        if (allFlipped) {
            setGameStage('allDone'); // Game selesai!
        }
    };

    // 5. Main lagi (dari 'allDone' atau 'setup')
    const handlePlayAgain = () => {
        setGameStage('setup');
        setPlayer1('');
        setPlayer2('');
        setError('');
    };

    // 6. Fungsi Download (dari 'allDone')
    const handleDownload = () => {
        let content = "Detak Rasa - Kenangan Kalian\n";
        content += "==================================\n\n";
        
        cards.forEach((card, index) => {
            content += `Kenangan #${index + 1}: ${card.prompt}\n`;
            content += `   - ${player1} bilang: ${card.answer1 || '(Tidak diisi)'}\n`;
            content += `   - ${player2} bilang: ${card.answer2 || '(Tidak diisi)'}\n\n`;
        });
        
        content += "==================================\n";
        content += "Dibuat dengan cinta. 💕";
        
        // Buat file virtual & trigger download
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "kenangan_detak_rasa.txt";
        document.body.appendChild(element); // Wajib di Chrome
        element.click();
    };

    // --- RENDER KONTEN GAME ---
    const renderGameContent = () => {
        switch (gameStage) {
            // TAHAP 1: SETUP
            case 'setup':
                return (
                    <form onSubmit={handleStartGame} className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Masukkan Nama Kalian</h3>
                        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>}
                        <input type="text" placeholder="Nama Kamu" value={player1} onChange={(e) => setPlayer1(e.target.value)} className="w-full max-w-xs mb-2 rounded-md shadow-sm" required />
                        <input type="text" placeholder="Nama Pacarku" value={player2} onChange={(e) => setPlayer2(e.target.value)} className="w-full max-w-xs mb-4 rounded-md shadow-sm" required />
                        <br />
                        <button type="submit" className="px-6 py-2 bg-pink-500 text-white font-bold rounded-lg">Mulai!</button>
                    </form>
                );

            // TAHAP 2: PLAYING (Grid Kartu)
            case 'playing':
                return (
                    <div className="grid grid-cols-3 gap-4">
                        {cards.map((card) => (
                            <button
                                key={card.id}
                                onClick={() => handleCardClick(card)}
                                disabled={card.isFlipped} // Mati kalo udah kebuka
                                className={`aspect-square rounded-lg shadow-md flex items-center justify-center
                                            transition-all transform 
                                            ${card.isFlipped 
                                                ? 'bg-gray-200 text-green-500 scale-95' // Tampilan udah kebuka
                                                : 'bg-pink-100 hover:bg-pink-200 hover:scale-105' // Tampilan tertutup
                                            }`}
                            >
                                <span className="text-5xl">{card.isFlipped ? '✅' : '🎁'}</span>
                            </button>
                        ))}
                    </div>
                );

            // TAHAP 5: GAME OVER
            case 'allDone':
                return (
                    <div className="text-left">
                        <h3 className="text-2xl font-bold text-center mb-6">Kalian baru aja nulis ulang kenangan kalian — satu detak sekali rasa.</h3>
                        
                        {/* Tampilkan semua jawaban */}
                        <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                            {cards.map((card) => (
                                <div key={card.id} className="p-4 bg-white shadow rounded">
                                    <p className="font-bold text-gray-800">{card.prompt}</p>
                                    <p className="text-sm text-pink-700 mt-2">
                                        <span className="font-semibold">{player1}:</span> "{card.answer1 || '...'}"
                                    </p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        <span className="font-semibold">{player2}:</span> "{card.answer2 || '...'}"
                                    </p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-8">
                            <button onClick={handleDownload} className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg mr-4">
                                💾 Download Kenangan
                            </button>
                            <button onClick={handlePlayAgain} className="px-6 py-3 bg-pink-500 text-white font-bold rounded-lg">
                                Main Lagi?
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        🎁 Pick a Memory
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
            <Head title="Pick a Memory" />

            {/* --- MODAL UNTUK NULIS JAWABAN --- */}
            {modalIsOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <form onSubmit={handleSaveMemory}>
                            <h3 className="text-xl font-bold mb-4">{selectedCard.prompt}</h3>
                            
                            {/* Textarea Player 1 */}
                            <div className="mb-4">
                                <label className="block font-medium mb-1">{player1}</label>
                                <textarea
                                    value={tempAnswer1}
                                    onChange={(e) => setTempAnswer1(e.target.value)}
                                    className="w-full rounded-md shadow-sm border-gray-300"
                                    rows="3"
                                    placeholder={`Jawaban ${player1}...`}
                                />
                            </div>
                            
                            {/* Textarea Player 2 */}
                            <div>
                                <label className="block font-medium mb-1">{player2}</label>
                                <textarea
                                    value={tempAnswer2}
                                    onChange={(e) => setTempAnswer2(e.target.value)}
                                    className="w-full rounded-md shadow-sm border-gray-300"
                                    rows="3"
                                    placeholder={`Jawaban ${player2}...`}
                                />
                            </div>
                            
                            <div className="mt-6 flex justify-end space-x-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                                    Batal
                                </button>
                                <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded-lg">
                                    Simpan Kenangan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* --- BATAS MODAL --- */}

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {renderGameContent()}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}