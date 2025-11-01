import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';

// ---------------------------------------------------------------
// [Bank Pertanyaan - 5 Ronde]
// ---------------------------------------------------------------
const wouldYouRather = [
  { a: "Nonton film horor bareng tiap malam Jumat", b: "Jalan-jalan ke pantai tiap Minggu pagi" },
  { a: "Bisa baca pikiran pasangan", b: "Bisa mengulang waktu 10 detik" },
  { a: "Selalu jujur walau menyakitkan", b: "Bohong demi kebaikan" },
  { a: "LDR 1 tahun tapi chat tiap hari", b: "Ketemu tiap hari tapi nggak boleh ngobrol" },
  { a: "Punya 10 anjing bareng", b: "Punya 1 kucing bareng" },
  { a: "Bangun rumah kecil tapi penuh cinta", b: "Punya rumah mewah tapi jarang ketemu" },
  { a: "Nikah sederhana tapi intim", b: "Nikah megah tapi penuh tamu random" },
  { a: "Punya anak kembar 2", b: "Punya anak tunggal yang super manja" },
  { a: "Masak bareng tiap malam", b: "Cuci piring bareng sambil nyanyi" },
  { a: "Pasangan bangunin kamu tiap pagi", b: "Kamu yang selalu nyiapin sarapan buat pasangan" },
  { a: "Liburan honeymoon ke pegunungan dingin", b: "Staycation di pantai tropis 5 hari" },
  { a: "Main board game tiap malam minggu", b: "Movie marathon tiap weekend" },
  { a: "Pasangan super romantis tapi pelupa", b: "Pasangan cuek tapi selalu inget detail kecil" },
  { a: "Punya dapur besar buat masak bareng", b: "Punya balkon luas buat nongkrong berdua" },
  { a: "Ngurus bayi semalaman sendirian", b: "Bangunin anak sekolah tiap pagi" },
  { a: "Nginep di tenda waktu liburan keluarga", b: "Nginep di hotel mewah tapi sibuk meeting" },
  { a: "Pasangan selalu nungguin kamu pulang kerja", b: "Kamu selalu nungguin pasangan pulang kerja" },
  { a: "Bisa teleport ke tempat favorit kalian", b: "Bisa pause waktu pas lagi pelukan" },
  { a: "Punya usaha kecil bareng", b: "Kerja di tempat berbeda tapi selalu lunch bareng" },
  { a: "Gagal masak bareng tapi ngakak seharian", b: "Masakan sukses tapi malah tegang seharian" },
];

// ---------------------------------------------------------------

// --- 🔽 KOMPONEN PlayerTurn KITA PINDAH KE LUAR SINI 🔽 ---
// Didefinisikan di luar biar state-nya nggak reset pas ngetik
const PlayerTurn = ({ 
    title, // Judul (e.g., "Giliran Player 1 Menebak")
    currentRound, // "Ronde X"
    totalRounds,  // "dari Y"
    question,     // { a: "...", b: "..." }
    choice,       // 'a' or 'b'
    reason,       // "alesan..."
    onAnswer,     // fn(choice)
    onReason,     // fn(text)
    onSubmit,     // fn(event)
    error         // "pesan error"
}) => {
    return (
        <form onSubmit={onSubmit} className="text-center">
            <h3 className="text-lg font-semibold text-gray-500">Ronde {currentRound + 1} dari {totalRounds}</h3>
            <h2 className="text-2xl font-bold my-4">{title}</h2>
            
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">{error}</div>}
            
            <div className="space-y-4 text-left">
                <button type="button" onClick={() => onAnswer('a')} className={`w-full p-4 rounded-lg transition-all ${choice === 'a' ? 'bg-pink-500 text-white scale-105 shadow-lg' : 'bg-pink-100 hover:bg-pink-200'}`}>
                    {question.a}
                </button>
                <button type="button" onClick={() => onAnswer('b')} className={`w-full p-4 rounded-lg transition-all ${choice === 'b' ? 'bg-pink-500 text-white scale-105 shadow-lg' : 'bg-pink-100 hover:bg-pink-200'}`}>
                    {question.b}
                </button>
            </div>
            
            <textarea
                value={reason}
                onChange={(e) => onReason(e.target.value)} // <-- INI SEKARANG AMAN
                placeholder="Kasih alesan singkat dong... (Opsional)"
                className="w-full mt-6 rounded-md shadow-sm border-gray-300"
                rows="2"
            />
            
            <button type="submit" disabled={!choice} className="mt-6 px-8 py-3 bg-blue-500 text-white font-bold rounded-lg disabled:bg-gray-300">
                Kunci Jawaban
            </button>
        </form>
    );
};
// --- 🔼 BATAS KOMPONEN PlayerTurn 🔼 ---


// --- KOMPONEN UTAMA DIMULAI DI SINI ---
export default function WouldYouRather({ auth }) {
    // State alur game
    const [gameStage, setGameStage] = useState('setup'); // setup, modeSelect, p1Turn, passScreen, p2Turn, roundReveal, gameOver
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [gameMode, setGameMode] = useState(''); 
    const [error, setError] = useState('');

    // State ronde
    const [currentRound, setCurrentRound] = useState(0);
    const [score, setScore] = useState(0);
    
    // State jawaban
    const [p1Choice, setP1Choice] = useState(null);
    const [p1Reason, setP1Reason] = useState('');
    const [p2Choice, setP2Choice] = useState(null);
    const [p2Reason, setP2Reason] = useState('');
    
    // State untuk mode 'tebak'
    const [guesser, setGuesser] = useState(null); 
    const [answerer, setAnswerer] =useState(null); 
    
    // --- FUNGSI-FUNGSI GAME ---

    // 1. Mulai game (dari 'setup')
    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError('');
            setGameStage('modeSelect'); 
        } else {
            setError('Isi dulu kedua nama pemain!');
        }
    };

    // 2. Pilih mode main (dari 'modeSelect')
    const handleModeSelect = (mode) => {
        setGameMode(mode);
        setCurrentRound(0);
        setScore(0);
        setGuesser(player1);
        setAnswerer(player2);
        setGameStage('p1Turn'); 
    };

    // 3. P1 Submit jawaban (dari 'p1Turn')
    const handleP1Submit = (e) => {
        e.preventDefault();
        if (!p1Choice) {
            setError('Pilih salah satu dulu, dong!');
            return;
        }
        setError('');
        setGameStage('passScreen'); 
    };

    // 4. P2 siap main (dari 'passScreen')
    const handleP2Ready = () => {
        setError(''); // Hapus error dari P1 (jika ada)
        setGameStage('p2Turn'); 
    };

    // 5. P2 Submit jawaban (dari 'p2Turn')
    const handleP2Submit = (e) => {
        e.preventDefault();
        if (!p2Choice) {
            setError('Pilih salah satu dulu, dong!');
            return;
        }
        setError('');
        
        let roundWon = false;
        if (gameMode === 'kompak') {
            if (p1Choice === p2Choice) roundWon = true;
        } else { 
            if (p1Choice === p2Choice) roundWon = true;
        }
        if (roundWon) {
            setScore(prev => prev + 1);
        }

        setGameStage('roundReveal'); 
    };
    
    // 6. Lanjut ronde berikutnya (dari 'roundReveal')
    const handleNextRound = () => {
        if (currentRound < questions.length - 1) {
            setCurrentRound(prev => prev + 1);
            setP1Choice(null); 
            setP1Reason('');
            setP2Choice(null);
            setP2Reason('');
            
            if (gameMode === 'tebak') {
                const oldGuesser = guesser;
                setGuesser(answerer);
                setAnswerer(oldGuesser);
            }
            
            setGameStage('p1Turn'); 
        } else {
            setGameStage('gameOver');
        }
    };
    
    // 7. Main lagi (dari 'gameOver')
    const handlePlayAgain = () => {
        setGameStage('setup');
        setPlayer1('');
        setPlayer2('');
        setError('');
    };
    
    // --- RENDER KONTEN GAME ---
    const renderGameContent = () => {
        const q = questions[currentRound]; 
        const p1Name = (gameMode === 'kompak') ? player1 : guesser;
        const p2Name = (gameMode === 'kompak') ? player2 : answerer;

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

            // TAHAP 2: PILIH MODE
            case 'modeSelect':
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Pilih Mode Main</h3>
                        <div className="space-y-4">
                            <button onClick={() => handleModeSelect('kompak')} className="w-full p-6 bg-green-100 rounded-lg shadow-md hover:scale-105 transition-transform">
                                <h4 className="text-xl font-bold">🎯 Uji Kekompakan</h4>
                                <p>Apakah kalian akan memilih hal yang sama?</p>
                            </button>
                            <button onClick={() => handleModeSelect('tebak')} className="w-full p-6 bg-blue-100 rounded-lg shadow-md hover:scale-105 transition-transform">
                                <h4 className="text-xl font-bold">💭 Seberapa Kenal?</h4>
                                <p>Satu pemain menebak pilihan pasangannya.</p>
                            </button>
                        </div>
                    </div>
                );

            // TAHAP 3: GILIRAN P1
            case 'p1Turn':
                let p1Title = '';
                if (gameMode === 'kompak') {
                    p1Title = `Giliran ${player1} memilih...`;
                } else {
                    p1Title = (guesser === player1) ? `Giliran ${player1} MENEBAK...` : `Giliran ${player1} MENJAWAB...`;
                }
                
                return <PlayerTurn 
                    title={p1Title}
                    currentRound={currentRound}
                    totalRounds={questions.length}
                    question={q}
                    choice={p1Choice}
                    reason={p1Reason}
                    onAnswer={(choice) => setP1Choice(choice)}
                    onReason={(text) => setP1Reason(text)}
                    onSubmit={handleP1Submit}
                    error={error}
                />;
            
            // TAHAP 4: OPER HP
            case 'passScreen':
                return (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">🤫</div>
                        <h3 className="text-2xl font-bold mb-4">Jawaban {p1Name} Disimpan!</h3>
                        <p className="text-lg mb-8">Sekarang, kasih HP-nya ke {p2Name}.</p>
                        <button onClick={handleP2Ready} className="px-8 py-3 bg-pink-500 text-white font-bold rounded-lg">
                            Aku Siap! (Giliran {p2Name})
                        </button>
                    </div>
                );

            // TAHAP 5: GILIRAN P2
            case 'p2Turn':
                let p2Title = '';
                if (gameMode === 'kompak') {
                    p2Title = `Giliran ${player2} memilih...`;
                } else {
                    p2Title = (guesser === player2) ? `Giliran ${player2} MENEBAK...` : `Giliran ${player2} MENJAWAB...`;
                }

                return <PlayerTurn 
                    title={p2Title}
                    currentRound={currentRound}
                    totalRounds={questions.length}
                    question={q}
                    choice={p2Choice}
                    reason={p2Reason}
                    onAnswer={(choice) => setP2Choice(choice)}
                    onReason={(text) => setP2Reason(text)}
                    onSubmit={handleP2Submit}
                    error={error}
                />;

            // TAHAP 6: HASIL RONDE
            case 'roundReveal':
                const isWin = (gameMode === 'kompak' && p1Choice === p2Choice) || (gameMode === 'tebak' && p1Choice === p2Choice);
                return (
                    <div className="text-center">
                        <div className="text-6xl my-6">{isWin ? '💘' : '💥'}</div>
                        <h3 className="text-3xl font-bold mb-6">{isWin ? (gameMode === 'kompak' ? "Kompak!" : "Tebakan Benar!") : (gameMode === 'kompak' ? "Beda Pilihan!" : "Meleset!")}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-left">
                            {/* Jawaban P1 */}
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <span className="font-bold">{p1Name}</span> memilih:
                                <p className="text-lg font-semibold mt-1">{p1Choice === 'a' ? q.a : q.b}</p>
                                {p1Reason ? <p className="text-sm italic mt-2 text-gray-600">"{p1Reason}"</p> : <p className="text-sm italic mt-2 text-gray-500">(Nggak ngasih alesan)</p>}
                            </div>
                            {/* Jawaban P2 */}
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <span className="font-bold">{p2Name}</span> memilih:
                                <p className="text-lg font-semibold mt-1">{p2Choice === 'a' ? q.a : q.b}</p>
                                {p2Reason ? <p className="text-sm italic mt-2 text-gray-600">"{p2Reason}"</p> : <p className="text-sm italic mt-2 text-gray-500">(Nggak ngasih alesan)</p>}
                            </div>
                        </div>

                        <button onClick={handleNextRound} className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg">
                            {currentRound < questions.length - 1 ? "Lanjut Ronde Berikutnya" : "Lihat Skor Akhir"}
                        </button>
                    </div>
                );

            // TAHAP 7: GAME OVER
            case 'gameOver':
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">Permainan Selesai!</h3>
                        <div className="p-6 bg-blue-100 rounded-lg shadow-inner mb-6">
                            <h4 className="text-lg font-semibold">Skor Akhir {gameMode === 'kompak' ? "Kekompakan" : "Tebakan"}:</h4>
                            <p className="text-6xl font-bold my-3">{score} / {questions.length}</p>
                            <p className="text-lg italic">Ga masalah beda pilihan, yang penting tetap satu arah jalan pulang. 💕</p>
                        </div>
                        
                        <button onClick={handlePlayAgain} className="px-6 py-2 bg-pink-500 text-white font-bold rounded-lg mr-4">
                            Main Lagi?
                        </button>
                        <Link href={route('game.menu')} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg">
                            Kembali ke Menu
                        </Link>
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
                        🤔 Would You Rather
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
            <Head title="Would You Rather" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
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