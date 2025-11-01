import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";

// ---------------------------------------------------------------
// [Bank Kategori & Pertanyaan]
// ---------------------------------------------------------------
const questionsBank = {
    "Tipe Sayang": [
        "Kalau kamu nunjukin rasa sayang, biasanya lewat apa?",
        "Hal kecil apa yang bisa langsung bikin kamu ngerasa disayang?",
        "Lebih suka quality time berdua atau dikasih kejutan kecil?",
    ],
    "Respons Saat Marah": [
        "Kalau lagi sebel, kamu lebih suka ngomong langsung atau ngilang dulu?",
        "Biasanya butuh waktu berapa lama buat baikan?",
        "Apa yang paling ampuh bikin kamu luluh pas marah?",
    ],
    "Kebiasaan Bareng": [
        "Hal paling random yang sering kalian lakuin bareng?",
        "Siapa yang biasanya mulai duluan ngajak bercanda?",
        "Kalimat andalan yang sering muncul tiap ngobrol?",
    ],
    "Gaya Komunikasi": [
        "Kamu lebih suka chat tiap waktu atau cukup kabar penting aja?",
        "Kalau lagi beda pendapat, kamu tipe yang diskusi atau diam dulu?",
        "Hal yang kamu harapin dari cara dia ngobrol ke kamu?",
    ],
};

const resultLabels = [
    {
        emoji: "🔥",
        text: "Fire Couple!",
        desc: "Kalian dua-duanya punya energi tinggi dan chemistry yang kuat banget. Selalu rame, tapi seru — kayak dua orang yang nggak pernah kehabisan bahan ngobrol.",
    },
    {
        emoji: "🌊",
        text: "Chill Duo!",
        desc: "Kalian tuh pasangan yang kalem dan ngerti ritme masing-masing. Jarang drama, tapi selalu nyatu dalam hal-hal kecil yang berarti.",
    },
    {
        emoji: "🌸",
        text: "Soft Pair!",
        desc: "Hubungan kalian lembut tapi kuat — saling support tanpa ribut. Vibe-nya adem dan wholesome banget.",
    },
    {
        emoji: "⚡",
        text: "Dynamic Match!",
        desc: "Kalian beda tapi saling nyatuin. Kadang debat, tapi justru di situ chemistry-nya muncul.",
    },
];

// --- Komponen Form Jawaban (Pindah ke luar biar ngetik ga error) ---
const AnswerForm = ({
    title,
    question,
    answer,
    onAnswerChange,
    onSubmit,
    submitText,
    error,
}) => {
    return (
        <form onSubmit={onSubmit} className="text-left">
            <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>
            <div className="p-4 bg-gray-100 rounded-lg mb-4">
                <p className="font-semibold text-gray-500">
                    {question.category}
                </p>
                <p className="text-lg font-medium">{question.text}</p>
            </div>

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
                    {error}
                </div>
            )}

            <textarea
                value={answer}
                onChange={onAnswerChange}
                placeholder="Tulis jawabanmu di sini..."
                className="w-full rounded-md shadow-sm border-gray-300"
                rows="4"
            />

            <button
                type="submit"
                disabled={!answer} // Mati kalo jawaban kosong
                className="mt-6 w-full px-8 py-3 bg-blue-500 text-white font-bold rounded-lg disabled:bg-gray-300"
            >
                {submitText}
            </button>
        </form>
    );
};
// --- Batas Komponen ---

export default function CompatibilitySpin({ auth }) {
    // State alur game
    const [gameStage, setGameStage] = useState("setup"); // setup, spinScreen, p1Answering, passScreen, p2Answering, result
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [error, setError] = useState("");

    // State untuk wheel
    const [isSpinning, setIsSpinning] = useState(false);
    const [spinDisplay, setSpinDisplay] = useState("SPIN"); // Teks yg muter

    // State ronde
    const [currentQuestion, setCurrentQuestion] = useState(null); // { category, text }
    const [p1Answer, setP1Answer] = useState("");
    const [p2Answer, setP2Answer] = useState("");
    const [currentResultLabel, setCurrentResultLabel] = useState(null); // { emoji, text, desc }

    // --- Efek Animasi Spin ---
    useEffect(() => {
        let spinInterval;
        if (isSpinning) {
            const categories = Object.keys(questionsBank);
            let i = 0;
            spinInterval = setInterval(() => {
                i = (i + 1) % categories.length;
                setSpinDisplay(categories[i].toUpperCase() + "...");
            }, 100);
        }
        return () => clearInterval(spinInterval);
    }, [isSpinning]);

    // --- FUNGSI-FUNGSI GAME ---

    // 1. Mulai game (dari 'setup')
    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError("");
            setGameStage("spinScreen");
        } else {
            setError("Isi dulu kedua nama pemain!");
        }
    };

    // 2. Klik "SPIN!" (dari 'spinScreen')
    const handleSpin = () => {
        setIsSpinning(true);
        setError("");

        setTimeout(() => {
            const categories = Object.keys(questionsBank);
            const randomCategory =
                categories[Math.floor(Math.random() * categories.length)];

            const questions = questionsBank[randomCategory];
            const randomQuestion =
                questions[Math.floor(Math.random() * questions.length)];

            setCurrentQuestion({
                category: randomCategory,
                text: randomQuestion,
            });

            setIsSpinning(false);
            setGameStage("p1Answering");
        }, Math.random() * 1000 + 2000);
    };

    // 3. P1 Submit (dari 'p1Answering')
    const handleP1Submit = (e) => {
        e.preventDefault();
        if (!p1Answer) {
            setError("Jangan dikosongin dong jawabannya!");
            return;
        }
        setError("");
        setGameStage("passScreen");
    };

    // 4. P2 siap (dari 'passScreen')
    const handleP2Ready = () => {
        setError("");
        setGameStage("p2Answering");
    };

    // 5. P2 Submit (dari 'p2Answering')
    const handleP2Submit = (e) => {
        e.preventDefault();
        if (!p2Answer) {
            setError("Jangan dikosongin dong jawabannya!");
            return;
        }
        setError("");

        const randomLabel =
            resultLabels[Math.floor(Math.random() * resultLabels.length)];
        setCurrentResultLabel(randomLabel);

        // Simpen ke Local Storage buat Summary
        localStorage.setItem(
            "compatibilityResult",
            `${randomLabel.emoji} ${randomLabel.text}`
        );

        setGameStage("result");
    };

    // 6. Klik "Spin Lagi?" (dari 'result')
    const handleSpinAgain = () => {
        setP1Answer("");
        setP2Answer("");
        setCurrentQuestion(null);
        setCurrentResultLabel(null);
        setSpinDisplay("SPIN");
        setGameStage("spinScreen");
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
                            Mulai Spin!
                        </button>
                    </form>
                );

            // TAHAP 2: SPIN SCREEN
            case "spinScreen":
                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Siap nentuin takdir?
                        </h3>
                        <p className="text-lg mb-8">
                            Biarkan roda cinta berputar!
                        </p>

                        <div
                            className={`w-60 h-60 mx-auto rounded-full flex items-center justify-center p-4
                                        shadow-xl transition-all duration-300
                                        ${
                                            isSpinning
                                                ? "animate-spin bg-pink-300"
                                                : "bg-pink-500"
                                        }
                                    `}
                        >
                            <div className="w-full h-full rounded-full flex items-center justify-center bg-white text-pink-600">
                                <span className="font-bold text-3xl px-4">
                                    {isSpinning ? spinDisplay : "🫶"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleSpin}
                            disabled={isSpinning}
                            className={`mt-10 px-12 py-5 bg-yellow-400 text-gray-900 font-bold rounded-full text-3xl shadow-lg 
                                       transition-transform transform hover:scale-110
                                       disabled:bg-gray-400 disabled:scale-100 disabled:cursor-wait`}
                        >
                            {isSpinning ? "MUTER..." : "SPIN!"}
                        </button>
                    </div>
                );

            // TAHAP 3: GILIRAN P1
            case "p1Answering":
                return (
                    <AnswerForm
                        title={`Giliran ${player1}`}
                        question={currentQuestion}
                        answer={p1Answer}
                        onAnswerChange={(e) => setP1Answer(e.target.value)}
                        onSubmit={handleP1Submit}
                        submitText="Kunci Jawaban"
                        error={error}
                    />
                );

            // TAHAP 4: OPER HP
            case "passScreen":
                return (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-6">🤫</div>
                        <h3 className="text-2xl font-bold mb-4">
                            Jawaban {player1} Disimpan!
                        </h3>
                        <p className="text-lg mb-8">
                            Sekarang, kasih HP-nya ke {player2}.
                        </p>
                        <button
                            onClick={handleP2Ready}
                            className="px-8 py-3 bg-pink-500 text-white font-bold rounded-lg"
                        >
                            Aku Siap! (Giliran {player2})
                        </button>
                    </div>
                );

            // TAHAP 5: GILIRAN P2
            case "p2Answering":
                return (
                    <AnswerForm
                        title={`Giliran ${player2}`}
                        question={currentQuestion}
                        answer={p2Answer}
                        onAnswerChange={(e) => setP2Answer(e.target.value)}
                        onSubmit={handleP2Submit}
                        submitText="Lihat Hasil!"
                        error={error}
                    />
                );

            // TAHAP 6: HASIL
            case "result":
                return (
                    <div className="text-center">
                        <div className="p-6 bg-purple-100 rounded-lg shadow-inner mb-6">
                            <div className="text-6xl mb-2">
                                {currentResultLabel.emoji}
                            </div>
                            <h2 className="text-4xl font-bold">
                                {currentResultLabel.text}
                            </h2>
                            <p className="text-lg italic">
                                {currentResultLabel.desc}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-100 rounded-lg mb-4 text-left">
                            <p className="font-semibold text-gray-500">
                                {currentQuestion.category}
                            </p>
                            <p className="text-lg font-medium">
                                {currentQuestion.text}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-left">
                            <div className="p-3 bg-pink-50 rounded-lg">
                                <span className="font-bold">{player1}</span>{" "}
                                menjawab:
                                <p className="text-gray-700 mt-1">
                                    "{p1Answer}"
                                </p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <span className="font-bold">{player2}</span>{" "}
                                menjawab:
                                <p className="text-gray-700 mt-1">
                                    "{p2Answer}"
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSpinAgain}
                            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg mr-4"
                        >
                            Spin Lagi?
                        </button>
                        <Link
                            href={route("game.menu")}
                            className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg"
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
                        🫶 Compatibility Spin
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
            <Head title="Compatibility Spin" />

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
