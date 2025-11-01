// tailwind.config.js

import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx", // Pastikan .jsx ada di sini
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            // TAMBAHKAN KODE DI BAWAH INI
            keyframes: {
                heartbeat: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                },
                "gentle-shake": {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "25%": { transform: "rotate(-1.5deg)" },
                    "75%": { transform: "rotate(1.5deg)" },
                },
            },
            animation: {
                heartbeat: "heartbeat 1.5s ease-in-out infinite",
                "gentle-shake": "gentle-shake 0.4s ease-in-out",
            },
            // BATAS KODE TAMBAHAN
        },
    },

    plugins: [forms],
};
