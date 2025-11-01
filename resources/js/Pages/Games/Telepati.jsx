import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";

// ---------------------------------------------------------------
// [Bank "Pertanyaan" / Prompt untuk 5 Ronde]
// ---------------------------------------------------------------
const prompts = [
    "Tempat date favorit yang paling berkesan buat kalian?",
    "Satu kata yang paling menggambarkan hubungan kalian?",
    "Makanan apa yang paling sering kalian debat — tapi ujungnya tetep makan bareng?",
    "Film atau series yang paling 'kita banget' buat ditonton berdua?",
    "Panggilan sayang paling absurd tapi cuma kalian yang ngerti?",
    "Kalimat yang sering diucapin salah satu dari kalian sampai bosen tapi kangen kalau nggak denger?",
    "Siapa yang lebih dulu minta maaf waktu abis debat kecil?",
    "Hal random yang selalu bikin kalian ngakak bareng tanpa alasan jelas?",
    "Kalimat gombalan paling khas yang selalu berhasil bikin salah satunya senyum?",
    "Kalau lagi capek, siapa yang biasanya mulai manja duluan?",
    "Lagu yang langsung bikin inget momen bareng?",
    "Hal kecil yang kalau hilang, bakal bikin hubungan kalian berasa aneh?",
    "Kalimat terakhir yang sering dipake sebelum tidur?",
    "Kebiasaan siapa yang awalnya ngeselin tapi sekarang malah ngangenin?",
    "Tempat staycation impian kalian selanjutnya?",
];
// ---------------------------------------------------------------

export default function Telepati({ auth }) {
    // State untuk alur game
    const [gameStage, setGameStage] = useState("setup"); // setup, roundStart, roundReveal, gameOver
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [error, setError] = useState("");

    // State untuk ronde
    const [currentRound, setCurrentRound] = useState(0); // Index 0-4
    const [score, setScore] = useState(0);
    const [answer1, setAnswer1] = useState("");
    const [answer2, setAnswer2] = useState("");

    // State untuk hasil ronde
    const [isMatch, setIsMatch] = useState(false);
    const [lastAnswer1, setLastAnswer1] = useState("");
    const [lastAnswer2, setLastAnswer2] = useState("");

    // --- FUNGSI-FUNGSI GAME ---

    // 1. Memulai game (dari 'setup')
    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError("");
            setCurrentRound(0); // Mulai dari ronde pertama
            setScore(0);
            setGameStage("roundStart"); // Lanjut ke ronde 1
        } else {
            setError("Isi dulu kedua nama pemain!");
        }
    };

    // 2. Submit jawaban (dari 'roundStart')
    const handleAnswersSubmit = (e) => {
        e.preventDefault();

        const cleanAnswer1 = answer1.toLowerCase().trim();
        const cleanAnswer2 = answer2.toLowerCase().trim();

        // Simpan jawaban untuk ditampilkan
        setLastAnswer1(answer1);
        setLastAnswer2(answer2);

        // Cek apakah sama
        if (cleanAnswer1 === cleanAnswer2) {
            setIsMatch(true);
            setScore((prevScore) => prevScore + 1); // Tambah skor
        } else {
            setIsMatch(false);
        }

        setGameStage("roundReveal"); // Lanjut ke 'tampilkan hasil'
    };

    // 3. Lanjut ke ronde berikutnya (dari 'roundReveal')
    const handleNextRound = () => {
        // Reset jawaban
        setAnswer1("");
        setAnswer2("");

        if (currentRound < prompts.length - 1) {
            // Kalo belum ronde terakhir
            setCurrentRound((prevRound) => prevRound + 1);
            setGameStage("roundStart"); // Kembali ke 'mulai ronde'
        } else {
            // Kalo udah ronde terakhir
            localStorage.setItem(
                "telepatiResult",
                `${score}/${prompts.length}`
            );
            setGameStage("gameOver"); // Selesai!
        }
    };

    // 4. Main lagi (dari 'gameOver')
    const handlePlayAgain = () => {
        setGameStage("setup");
        setPlayer1("");
        setPlayer2("");
        setError("");
    };

    // 5. Pesan lucu berdasarkan skor
    const getScoreMessage = () => {
        if (score === 5) return "💘 Kalian Beneran Sehati! Sempurna!";
        if (score >= 3)
            return "Cukup buat ngasih kode lewat tatapan aja. Keren!";
        if (score >= 1)
            return "Masih nyambung lah ya, walau beda frekuensi dikit 😆";
        return "Gak nyambung blas! Tapi gapapa, yang penting sayang! 😂";
    };

    // --- RENDER KONTEN GAME ---

    const renderGameContent = () => {
        switch (gameStage) {
            // TAHAP 1: SETUP
            case "setup":
                return (
                    <form onSubmit={handleStartGame} className="text-center">
                        <h3 className="text-xl font-semibold mb-4">
                            Masukkan Nama Kalian
                        </h3>
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
                                {error}
                            </div>
                        )}
                        <input
                            type="text"
                            placeholder="Nama Kamu"
                            value={player1}
                            onChange={(e) => setPlayer1(e.target.value)}
                            className="w-full max-w-xs mb-2 rounded-md shadow-sm"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nama Pacarku"
                            value={player2}
                            onChange={(e) => setPlayer2(e.target.value)}
                            className="w-full max-w-xs mb-4 rounded-md shadow-sm"
                            required
                        />
                        <br />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-pink-500 text-white font-bold rounded-lg"
                        >
                            Mulai Telepati
                        </button>
                    </form>
                );

            // TAHAP 2: RONDE DIMULAI (MENEBAK)
            case "roundStart":
                return (
                    <form
                        onSubmit={handleAnswersSubmit}
                        className="text-center"
                    >
                        <h3 className="text-lg font-semibold text-gray-500">
                            Ronde {currentRound + 1} dari {prompts.length}
                        </h3>
                        <p className="text-2xl font-bold my-4">
                            "{prompts[currentRound]}"
                        </p>

                        <div className="grid grid-cols-2 gap-4 my-6">
                            {/* Input Player 1 */}
                            <div>
                                <label className="block font-medium mb-1">
                                    {player1}
                                </label>
                                <input
                                    type="password" // <-- Trik biar ••••••
                                    placeholder="Ketik jawabanmu..."
                                    value={answer1}
                                    onChange={(e) => setAnswer1(e.target.value)}
                                    className="w-full rounded-md shadow-sm text-center"
                                    required
                                />
                            </div>
                            {/* Input Player 2 */}
                            <div>
                                <label className="block font-medium mb-1">
                                    {player2}
                                </label>
                                <input
                                    type="password" // <-- Trik biar ••••••
                                    placeholder="Ketik jawabanmu..."
                                    value={answer2}
                                    onChange={(e) => setAnswer2(e.target.value)}
                                    className="w-full rounded-md shadow-sm text-center"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg
                                       disabled:bg-gray-300"
                            disabled={!answer1 || !answer2} // Mati kalo salah satu kosong
                        >
                            Kirim Jawaban
                        </button>
                    </form>
                );

            // TAHAP 3: HASIL RONDE
            case "roundReveal":
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-gray-500">
                            Hasil Ronde {currentRound + 1}
                        </h3>
                        <p className="text-2xl font-bold my-4">
                            "{prompts[currentRound]}"
                        </p>

                        {/* Animasi Hasil */}
                        <div className="text-6xl my-6">
                            {isMatch ? "💘" : "💥"}
                        </div>

                        {/* Tampilkan Jawaban */}
                        <div className="grid grid-cols-2 gap-4 my-6 text-lg">
                            <div className="p-3 bg-gray-100 rounded">
                                <span className="font-bold">{player1}</span>{" "}
                                menjawab:
                                <p className="text-xl font-semibold">
                                    {lastAnswer1}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-100 rounded">
                                <span className="font-bold">{player2}</span>{" "}
                                menjawab:
                                <p className="text-xl font-semibold">
                                    {lastAnswer2}
                                </p>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold mb-6">
                            {isMatch ? "Telepati Aktif!" : "Frekuensi Beda!"}
                        </h4>

                        <button
                            onClick={handleNextRound}
                            className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg"
                        >
                            {currentRound < prompts.length - 1
                                ? "Lanjut Ronde Berikutnya"
                                : "Lihat Skor Akhir"}
                        </button>
                    </div>
                );

            // TAHAP 4: GAME OVER
            case "gameOver":
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Permainan Selesai!
                        </h3>

                        <div className="p-6 bg-blue-100 rounded-lg shadow-inner mb-6">
                            <h4 className="text-lg font-semibold">
                                Skor Telepati Kalian:
                            </h4>
                            <p className="text-6xl font-bold my-3">
                                {score} / {prompts.length}
                            </p>
                            <p className="text-lg italic">
                                {getScoreMessage()}
                            </p>
                        </div>

                        <button
                            onClick={handlePlayAgain}
                            className="px-6 py-2 bg-pink-500 text-white font-bold rounded-lg mr-4"
                        >
                            Main Lagi?
                        </button>
                        <Link
                            href={route("game.menu")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg"
                        >
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
                        🧠 Telepati Pasangan
                    </h2>
                    <Link
                        href={route("game.menu")}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                    >
                        &larr; Kembali ke Menu
                    </Link>
                </div>
            }
        >
            <Head title="Telepati Pasangan" />

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
