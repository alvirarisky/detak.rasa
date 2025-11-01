import { Link } from '@inertiajs/react';

export default function GameCard({ href, emoji, title, desc }) {
    return (
        // Kita pakai <Link> agar seluruh kartu bisa diklik
        <Link
            href={href}
            className="block p-6 rounded-lg shadow-md 
                       bg-pink-100 
                       transition-all duration-300 
                       hover:scale-105 hover:shadow-xl hover:bg-pink-50
                       hover:animate-gentle-shake"
        >
            <div className="text-4xl mb-3">{emoji}</div>
            <h3 className="text-lg font-bold mb-1 text-gray-900">{title}</h3>
            <p className="text-sm text-gray-700">{desc}</p>
        </Link>
    );
}