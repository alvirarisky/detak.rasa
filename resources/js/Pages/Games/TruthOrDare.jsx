import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";

// ---------------------------------------------------------------
// [Bank Pertanyaan "Wild" 🔥]
// ---------------------------------------------------------------
const allQuestions = {
    truth: {
        soft: [
            "Hal kecil apa dari aku yang paling sering bikin kamu senyum?",
            "Kapan pertama kali kamu sadar kamu beneran sayang sama aku?",
            "Menurutmu, apa 'theme song' hubungan kita?",
            "Apa kenangan favoritmu tentang kita berdua?",
            "Kalau harus jelasin aku ke orang lain, kamu bakal bilang aku tuh kayak apa?",
            "Kapan terakhir kali kamu ngerasa bersyukur banget punya aku?",
            "Apa kebiasaan kecilku yang paling kamu kangenin kalo lagi ga bareng?",
            "Hal kecil apa yang kamu pengen aku tetep lakuin terus, walau kita udah tua nanti?",
        ],
        funny: [
            "Apa hal paling konyol yang pernah kita lakukan bareng?",
            "Kalau kita tukeran badan seharian, apa hal pertama yang kamu lakukan?",
            "Ceritakan satu kebiasaan aneh dari aku yang kamu anggap lucu.",
            "Siapa yang lebih mungkin menang kalo kita lomba masak Indomie?",
            "Kalo aku tiba-tiba jadi anak kecil, kamu bakal ngapain biar aku berhenti ngambek?",
            "Kebiasaan aku yang paling kamu pengen ‘hapus’ tapi ujungnya malah kamu kangen apa?",
            "Pernah ga kamu pura-pura sabar padahal pengen cubit aku banget?",
            "Siapa yang lebih drama antara kita, dan kenapa kamu yakin itu aku?",
        ],
        deep: [
            "Apa ketakutan terbesarmu dalam hubungan kita?",
            "Kapan kamu paling merasa 'terhubung' sama aku?",
            "Apa satu hal yang ingin kamu ubah dari masa lalu kita?",
            "Apa arti 'cinta' buat kamu, setelah kenal aku?",
            "Apa hal tersulit buat kamu waktu harus sabar ngadepin aku?",
            "Pernah ga kamu takut aku beneran ninggalin kamu waktu kita lagi dingin-dingin?",
            "Menurutmu, apa yang bikin hubungan kita tetep bisa jalan meskipun dua-duanya keras kepala?",
            "Hal apa dari aku yang bikin kamu terus yakin, ‘ya ini orangnya’?",
        ],
        wild: [
            "Apa fantasi terliarmu tentang kita berdua?",
            "Di bagian tubuhku mana yang paling kamu suka cium?",
            "Ceritain satu mimpi 'nakal' tentang aku yang pernah kamu alami.",
            "Apa hal paling 'berani' yang pengen kamu lakukan bareng aku di kamar tidur?",
            "Bayangin kita lagi di kamar gelap cuma ada lilin, hal pertama yang pengen kamu lakuin apa?",
            "Ada ga momen dimana kamu ngerasa aku bener-bener bikin kamu kehilangan kontrol?",
            "Bagian dari tubuhku yang paling kamu suka... tapi jangan jawab yang biasa, pilih yang unexpected.",
            "Kalau aku bilang ‘aku mau kamu sekarang’, apa yang bakal kamu lakuin duluan?",
        ],
    },
    dare: {
        soft: [
            "Tatap mata aku selama 30 detik tanpa boleh ketawa.",
            "Kasih aku pelukan dari belakang dan bilang 3 hal yang kamu suka dari aku.",
            "Kirim voice note 'aku kangen' ke aku sekarang juga.",
            "Cium keningku selama 5 detik.",
            "Tulis satu kalimat manis di catatan HP-ku tanpa aku lihat.",
            "Peluk aku sambil bilang ‘aku sayang kamu banget, sumpah’ dan tahan 10 detik.",
            "Ambil satu lagu yang bikin kamu inget aku dan nyanyiin potongan liriknya pelan ke aku.",
            "Pilih salah satu jari aku, terus cium di sana selama 3 detik.",
        ],
        funny: [
            "Tiru gaya aku waktu lagi marah atau ngambek selama 15 detik.",
            "Dance lagu TikTok yang lagi viral sekarang, 10 detik aja!",
            "Coba rayu aku pakai 3 gombalan paling jayus yang kamu tahu.",
            "Bikin muka paling jelek yang kamu bisa sekarang.",
            "Coba tiruin gaya aku waktu lagi manja minta perhatian.",
            "Ngomong ‘aku cinta kamu’ tapi gaya ngomongnya kayak penjahat sinetron.",
            "Lakuin satu rayuan cringe yang bikin aku pengen lempar bantal.",
            "Buat ekspresi paling absurd kamu waktu aku tiba-tiba bilang ‘aku kangen’.",
        ],
        deep: [
            "Tulis satu hal yang kamu janji akan lakukan buat hubungan kita ke depan.",
            "Putar satu lagu yang paling menggambarkan perasaanmu ke aku saat ini.",
            "Ceritakan satu rahasia kecil yang belum pernah kamu bilang ke siapapun.",
            "Bisikin satu hal yang kamu takut bilang, tapi pengen aku tahu.",
            "Tulis 3 hal yang kamu janji bakal lakuin buat bikin hubungan kita lebih sehat.",
            "Bisikin satu hal yang kamu takut aku tahu tapi pengen aku ngerti.",
            "Ambil HP-ku, kirim satu chat random yang kamu tulis ke diri kamu sendiri dari nomorku.",
            "Liat aku 10 detik tanpa ngomong, terus jujur bilang apa yang kamu rasain sekarang.",
        ],
        wild: [
            "Kasih aku ciuman 10 detik, di tempat yang bukan bibir.",
            "Bisikkan sesuatu yang 'panas' di telingaku.",
            "Goda aku tanpa menyentuh selama 1 menit penuh.",
            "Bisikin tiga hal yang kamu pengen aku lakuin nanti malam.",
            "Pilih satu bagian tubuhku yang boleh kamu cium sekarang, dan lakuin.",
            "Pegang tanganku, tarik pelan, terus bilang satu kalimat paling menggoda yang kepikiran.",
            "Main ‘goda tanpa sentuh’ selama 30 detik — bikin aku nyerah duluan baru berhenti.",
        ],
    },
};

const categories = [
    { key: "soft", emoji: "💞", title: "Soft & Sweet", color: "bg-pink-200" },
    { key: "funny", emoji: "😂", title: "Funny Chaos", color: "bg-yellow-200" },
    { key: "deep", emoji: "🌙", title: "Deep Talk", color: "bg-indigo-200" },
    { key: "wild", emoji: "🔥", title: "Wild", color: "bg-red-300" },
];
// ---------------------------------------------------------------

export default function TruthOrDare({ auth }) {
    // State game
    const [gameStage, setGameStage] = useState("setup"); // setup, pick, spin, showSpinResult, result
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [error, setError] = useState("");

    // State untuk wheel
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinResult, setSpinResult] = useState("truth");

    // State untuk hasil
    const [currentTurn, setCurrentTurn] = useState(""); // Hasil T/D
    const [currentCategory, setCurrentCategory] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState("");

    // Efek untuk simulasi spin wheel
    useEffect(() => {
        let spinInterval;
        if (isSpinning) {
            spinInterval = setInterval(() => {
                setSpinResult((prev) => (prev === "truth" ? "dare" : "truth"));
            }, 75);
        }
        return () => clearInterval(spinInterval);
    }, [isSpinning]);

    // Fungsi untuk memulai game
    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError("");
            setCurrentPlayer(player1);
            setGameStage("pick");
        } else {
            setError("Isi dulu kedua nama pemain, dong!");
        }
    };

    // Fungsi saat pemain memilih kategori
    const handleCategorySelect = (category) => {
        setCurrentCategory(category);
        setGameStage("spin");
    };

    // --- PERUBAHAN DI SINI ---
    // Fungsi untuk "Spin the wheel"
    const handleSpin = () => {
        setIsSpinning(true);
        setError("");

        setTimeout(() => {
            // 1. Tentukan hasil
            const finalResult = Math.random() < 0.5 ? "truth" : "dare";
            setIsSpinning(false);
            setCurrentTurn(finalResult);

            // 2. Langsung ambil pertanyaan dan simpan
            const question = getRandomQuestion(
                finalResult,
                currentCategory.key
            );
            setCurrentQuestion(question);

            // 3. Pindah ke stage baru untuk nunjukkin hasil spin
            setGameStage("showSpinResult"); // <-- PINDAH KE STAGE BARU
        }, Math.random() * 1000 + 2000);
    };

    // --- FUNGSI BARU ---
    // Fungsi untuk tombol "Lihat Pertanyaan"
    const handleShowQuestion = () => {
        setGameStage("result"); // Tinggal pindah stage
    };
    // -------------------

    // Fungsi untuk lanjut ke ronde berikutnya
    const handleNextRound = () => {
        setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
        setGameStage("spin"); // Kembali ke spin
        setCurrentQuestion("");
        setCurrentTurn("");
    };

    // Fungsi untuk ganti tema
    const handleChangeTheme = () => {
        setGameStage("pick");
        setError("");
    };

    // Fungsi untuk mengambil pertanyaan random
    const getRandomQuestion = (type, category) => {
        const questions = allQuestions[type][category];
        return questions[Math.floor(Math.random() * questions.length)];
    };

    // Render konten game berdasarkan 'gameStage'
    const renderGameContent = () => {
        switch (gameStage) {
            // TAHAP 1: SETUP (Isi Nama)
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
                            type="text" // Koma & typo e.garet sudah dibenerin
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
                            Mulai!
                        </button>
                    </form>
                );

            // TAHAP 2: PICK (Pilih Card Tema)
            case "pick":
                return (
                    <div className="text-center">
                        <h3 className="text-3xl font-bold mb-2">
                            Pilih Tema Permainan
                        </h3>
                        <p className="text-lg mb-6">
                            Tema ini akan dipakai sampai kamu ganti nanti.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => handleCategorySelect(cat)}
                                    className={`p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 ${cat.color}`}
                                >
                                    <div className="text-3xl mb-2">
                                        {cat.emoji}
                                    </div>
                                    <div className="font-bold text-gray-800">
                                        {cat.title}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            // TAHAP 3: SPIN (Nentuin T/D)
            case "spin":
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">
                            Giliran{" "}
                            <span className="text-pink-600">
                                {currentPlayer}
                            </span>
                            !
                        </h3>
                        <p className="text-lg mb-4">
                            Tema:{" "}
                            <span className="font-bold">
                                {currentCategory?.title}
                            </span>{" "}
                            {currentCategory?.emoji}
                        </p>
                        <p className="text-lg mb-4">
                            Sekarang, SPIN untuk Truth or Dare!
                        </p>

                        <div
                            className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center text-white font-bold text-4xl mb-6 transition-all duration-100
                            ${isSpinning ? "animate-spin" : ""}
                            ${
                                spinResult === "truth"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }
                        `}
                        >
                            {spinResult.toUpperCase()}
                        </div>

                        {error && (
                            <div className="p-3 bg-blue-100 text-blue-700 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className={`px-10 py-5 bg-yellow-400 text-gray-900 font-bold rounded-full text-2xl shadow-lg transition-transform transform hover:scale-110
                                       disabled:bg-gray-400 disabled:scale-100 disabled:cursor-wait`}
                        >
                            {isSpinning ? "MUTER..." : "SPIN!"}
                        </button>

                        <button
                            onClick={handleChangeTheme}
                            disabled={isSpinning}
                            className="block w-full text-center mt-6 text-sm text-gray-500 hover:text-gray-800 disabled:text-gray-300"
                        >
                            Ganti Tema
                        </button>
                    </div>
                );

            // --- TAHAP BARU: TAMPILKAN HASIL SPIN ---
            case "showSpinResult":
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-2">
                            Giliran{" "}
                            <span className="text-pink-600">
                                {currentPlayer}
                            </span>
                            !
                        </h3>
                        <p className="text-lg mb-6">
                            Tema:{" "}
                            <span className="font-bold">
                                {currentCategory?.title}
                            </span>{" "}
                            {currentCategory?.emoji}
                        </p>

                        <div
                            className={`w-48 h-48 mx-auto rounded-full flex items-center justify-center text-white font-bold text-4xl mb-6 
                            ${
                                currentTurn === "truth"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                            }
                        `}
                        >
                            {currentTurn.toUpperCase()}!
                        </div>

                        <h2 className="text-3xl font-bold mb-6">
                            Kamu dapat {currentTurn.toUpperCase()}!
                        </h2>

                        <button
                            onClick={handleShowQuestion} // <-- Tombol baru
                            className="px-10 py-5 bg-blue-500 text-white font-bold rounded-full text-2xl shadow-lg transition-transform transform hover:scale-110"
                        >
                            Lihat Pertanyaan
                        </button>

                        <button
                            onClick={handleChangeTheme}
                            className="block w-full text-center mt-6 text-sm text-gray-500 hover:text-gray-800"
                        >
                            Ganti Tema
                        </button>
                    </div>
                );

            // TAHAP 5: RESULT (Lihat Pertanyaan)
            case "result":
                return (
                    <div className="text-center">
                        <div
                            className={`p-6 rounded-lg shadow-lg ${currentCategory.color} mb-6`}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {currentCategory.emoji} {currentCategory.title}{" "}
                                {currentTurn === "truth" ? "Truth" : "Dare"}
                            </h3>
                            <p className="text-2xl font-semibold text-gray-900">
                                "{currentQuestion}"
                            </p>
                        </div>
                        <p className="text-lg font-semibold italic text-pink-700 mb-6">
                            "Selesai! Sekarang peluk dulu lawan mainmu 💕"
                        </p>
                        <button
                            onClick={handleNextRound}
                            className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg"
                        >
                            Lanjut Ronde Berikutnya
                        </button>
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
                        🎲 Truth or Dare
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
            <Head title="Truth or Dare" />

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
