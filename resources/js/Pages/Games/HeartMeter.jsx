import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";

// ---------------------------------------------------------------
// [Bank Kuis Heart Meter - 4 Pertanyaan]
// ---------------------------------------------------------------
const questions = [
  { id: 'q1', text: "Hari ini aku lebih ngerasa...", a: "Tenang dan santai 🌿", b: "Capek tapi masih kuat 💪" },
  { id: 'q2', text: "Kayaknya kamu hari ini lebih ke...", a: "Mood-nya stabil dan chill 😌", b: "Lagi overthinking dikit 🤔" },
  { id: 'q3', text: "Sekarang aku pengen...", a: "Ngobrol hal random aja 🗣️", b: "Diem bareng tapi nyaman 🤝" },
  { id: 'q4', text: "Kayaknya kamu lagi pengen...", a: "Ngobrol hal random aja 🗣️", b: "Diem bareng tapi nyaman 🤝" },
  { id: 'q5', text: "Kalau lagi beda pendapat, aku lebih milih...", a: "Ngomong pelan tapi jelas 🕊️", b: "Diam dulu biar tenang 🌧️" },
  { id: 'q6', text: "Kayaknya kamu lebih ke...", a: "Ngomong pelan tapi jelas 🕊️", b: "Diam dulu biar tenang 🌧️" },
  { id: 'q7', text: "Kalau besok pagi bareng, aku pengen...", a: "Ngopi sambil bahas hal kecil ☕", b: "Tidur lagi, biar tenang dikit 💤" },
  { id: 'q8', text: "Kayaknya kamu bakal pilih...", a: "Ngopi sambil bahas hal kecil ☕", b: "Tidur lagi, biar tenang dikit 💤" },
];

// ---------------------------------------------------------------

// --- Helper function (UDAH DIBENERIN) ---
const getAnswerText = (questionId, choice) => {
    const q = questions.find((q) => q.id === questionId);
    if (!q) return "";
    if (choice === "a") return q.a; // Kalo 'a'
    if (choice === "b") return q.b; // Kalo 'b'
    return "(Belum dijawab)"; // Kalo kosong
};

// --- Komponen Kuis (UDAH DIBENERIN) ---
const QuizForm = ({ title, answers, setAnswers, onSubmit, submitText }) => {
    const handleSelect = (id, choice) => {
        setAnswers((prev) => ({ ...prev, [id]: choice }));
    };

    const isComplete = Object.keys(answers).length === questions.length;

    return (
        <form onSubmit={onSubmit} className="text-left">
            <h3 className="text-2xl font-bold mb-6 text-center">{title}</h3>
            <div className="space-y-6">
                {questions.map((q) => (
                    <div key={q.id}>
                        <label className="block font-medium mb-2">
                            {q.text}
                        </label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => handleSelect(q.id, "a")}
                                className={`w-1/2 p-4 rounded-lg transition-all text-center
                                    ${
                                        answers[q.id] === "a"
                                            ? "bg-pink-500 text-white scale-105 shadow-lg"
                                            : "bg-pink-100 hover:bg-pink-200"
                                    }
                                `}
                            >
                                {q.a}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSelect(q.id, "b")}
                                className={`w-1/2 p-4 rounded-lg transition-all text-center
                                    ${
                                        answers[q.id] === "b"
                                            ? "bg-blue-500 text-white scale-105 shadow-lg"
                                            : "bg-blue-100 hover:bg-blue-200"
                                    }
                                `}
                            >
                                {q.b}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="submit"
                disabled={!isComplete}
                className="mt-8 w-full px-8 py-3 bg-green-500 text-white font-bold rounded-lg disabled:bg-gray-300"
            >
                {submitText} {/* <-- UDAH PAKE PROP DINAMIS */}
            </button>
        </form>
    );
};
// --- Batas Komponen Kuis ---

export default function HeartMeter({ auth }) {
    // State alur game
    const [gameStage, setGameStage] = useState("setup");
    const [player1, setPlayer1] = useState("");
    const [player2, setPlayer2] = useState("");
    const [error, setError] = useState("");

    // State jawaban
    const [p1Answers, setP1Answers] = useState({});
    const [p2Answers, setP2Answers] = useState({});

    // State hasil
    const [syncScore, setSyncScore] = useState(0);
    const [resultData, setResultData] = useState({ text: "", color: "" });
    const [meterWidth, setMeterWidth] = useState("0%");

    // --- FUNGSI-FUNGSI GAME ---

    const handleStartGame = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            setError("");
            setGameStage("p1Turn");
        } else {
            setError("Isi dulu kedua nama pemain!");
        }
    };

    const handleP1Submit = (e) => {
        e.preventDefault();
        setGameStage("passScreen");
    };

    const handleP2Ready = () => {
        setGameStage("p2Turn");
    };

    const handleP2Submit = (e) => {
        e.preventDefault();

        let score = 0;
        if (p1Answers.q2 === p2Answers.q1) score++;
        if (p2Answers.q2 === p1Answers.q1) score++;
        if (p1Answers.q4 === p2Answers.q3) score++;
        if (p2Answers.q4 === p1Answers.q3) score++;

        setSyncScore(score);

        // --- INI DIA FIX-NYA ---
        let finalResultData; // 1. Bikin variabelnya DULU

        if (score === 4) {
            finalResultData = {
                text: "Perfectly in Sync!",
                color: "bg-green-500",
                emoji: "💞",
            }; // 2. Isi variabelnya
        } else if (score >= 2) {
            finalResultData = {
                text: "Close Enough!",
                color: "bg-yellow-500",
                emoji: "💫",
            }; // 2. Isi variabelnya
        } else {
            finalResultData = {
                text: "Signal Delay!",
                color: "bg-red-500",
                emoji: "💬",
            }; // 2. Isi variabelnya
        }

        // 3. SEKARANG baru kita PAKE variabel itu
        localStorage.setItem(
            "heartMeterResult",
            `${finalResultData.emoji} ${finalResultData.text}`
        );
        setResultData(finalResultData); // Simpan ke state
        setGameStage("result"); // Lanjut ke 'tampilkan hasil'
        // --- BATAS FIX ---
    };

    useEffect(() => {
        if (gameStage === "result") {
            const percentage = (syncScore / 4) * 100;
            setTimeout(() => {
                setMeterWidth(`${percentage}%`);
            }, 300);
        }
    }, [gameStage, syncScore]);

    const handlePlayAgain = () => {
        setGameStage("setup");
        setPlayer1("");
        setPlayer2("");
        setError("");
        setP1Answers({});
        setP2Answers({});
        setSyncScore(0);
        setMeterWidth("0%");
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
                            Mulai Ukur!
                        </button>
                    </form>
                );

            // TAHAP 2: GILIRAN P1
            case "p1Turn":
                return (
                    <QuizForm
                        title={`Giliran ${player1}`}
                        answers={p1Answers}
                        setAnswers={setP1Answers}
                        onSubmit={handleP1Submit}
                        submitText="Kunci Jawaban" // <-- Pake prop
                    />
                );

            // TAHAP 3: OPER HP
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

            // TAHAP 4: GILIRAN P2
            case "p2Turn":
                return (
                    <QuizForm
                        title={`Giliran ${player2}`}
                        answers={p2Answers}
                        setAnswers={setP2Answers}
                        onSubmit={handleP2Submit}
                        submitText="Lihat Hasil!" // <-- Pake prop
                    />
                );

            // TAHAP 5: HASIL
            case "result":
                const p1TebakP2_Vibe = p1Answers.q2 === p2Answers.q1;
                const p2TebakP1_Vibe = p2Answers.q2 === p1Answers.q1;
                const p1TebakP2_Mau = p1Answers.q4 === p2Answers.q3;
                const p2TebakP1_Mau = p2Answers.q4 === p1Answers.q3;

                return (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                            Heart Meter Kalian:
                        </h3>

                        <div className="w-full bg-gray-200 rounded-full h-8 shadow-inner overflow-hidden mb-4">
                            <div
                                className={`h-8 rounded-full transition-all duration-1000 ease-out ${resultData.color}`}
                                style={{ width: meterWidth }}
                            ></div>
                        </div>

                        <div
                            className={`p-6 ${resultData.color} bg-opacity-20 rounded-lg mb-8`}
                        >
                            <div className="text-6xl mb-2">
                                {resultData.emoji}
                            </div>
                            <h2 className="text-4xl font-bold mb-2">
                                {resultData.text}
                            </h2>
                            <p className="text-xl font-semibold">
                                Skor Sinkronisasi: {syncScore} / 4
                            </p>
                            {syncScore === 4 && (
                                <p className="mt-2">
                                    Kalian tuh kayak dua lagu di playlist yang
                                    sama. Nyambung terus!
                                </p>
                            )}
                            {syncScore >= 2 && syncScore < 4 && (
                                <p className="mt-2">
                                    Beda dikit gapapa, kan harmoni juga butuh
                                    variasi.
                                </p>
                            )}
                            {syncScore < 2 && (
                                <p className="mt-2">
                                    Masih buffering, tapi tetep connect kok.
                                    Coba pelukan dulu!
                                </p>
                            )}
                        </div>

                        <h4 className="text-xl font-bold mt-8 mb-4">
                            Detail Jawaban Kalian:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 text-left">
                            {/* Kolom Player 1 */}
                            <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                                <h5 className="font-bold text-lg mb-2">
                                    {player1}
                                </h5>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Vibe-ku hari ini:
                                    </p>
                                    <p className="font-medium">
                                        "{getAnswerText("q1", p1Answers.q1)}"
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Lagi pengen:
                                    </p>
                                    <p className="font-medium text-pink-600">
                                        "{getAnswerText("q3", p1Answers.q3)}"
                                    </p>
                                </div>
                                <hr className="my-2" />
                                <div>
                                    <p className="text-sm font-semibold">
                                        Tebakanku soal {player2}:
                                    </p>
                                    <p>
                                        Vibe-nya: "
                                        {getAnswerText("q2", p1Answers.q2)}"{" "}
                                        {p1TebakP2_Vibe ? "✅" : "❌"}
                                    </p>
                                    <p>
                                        Pengennya: "
                                        {getAnswerText("q4", p1Answers.q4)}"{" "}
                                        {p1TebakP2_Mau ? "✅" : "❌"}
                                    </p>
                                </div>
                            </div>

                            {/* Kolom Player 2 */}
                            <div className="p-4 bg-gray-100 rounded-lg space-y-3">
                                <h5 className="font-bold text-lg mb-2">
                                    {player2}
                                </h5>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Vibe-ku hari ini:
                                    </p>
                                    <p className="font-medium">
                                        "{getAnswerText("q1", p2Answers.q1)}"
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">
                                        Lagi pengen:
                                    </p>
                                    <p className="font-medium text-pink-600">
                                        "{getAnswerText("q3", p2Answers.q3)}"
                                    </p>
                                </div>
                                <hr className="my-2" />
                                <div>
                                    <p className="text-sm font-semibold">
                                        Tebakanku soal {player1}:
                                    </p>
                                    <p>
                                        Vibe-nya: "
                                        {getAnswerText("q2", p2Answers.q2)}"{" "}
                                        {p2TebakP1_Vibe ? "✅" : "❌"}
                                    </p>
                                    <p>
                                        Pengennya: "
                                        {getAnswerText("q4", p2Answers.q4)}"{" "}
                                        {p2TebakP1_Mau ? "✅" : "❌"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePlayAgain}
                            className="mt-6 px-6 py-2 bg-pink-500 text-white font-bold rounded-lg mr-4"
                        >
                            Main Lagi?
                        </button>
                        <Link
                            href={route("game.menu")}
                            className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg"
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
                        💓 Heart Meter
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
            <Head title="Heart Meter" />

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
