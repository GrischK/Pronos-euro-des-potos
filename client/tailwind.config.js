const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            animation: {
                "meteor-effect": "meteor 5s linear infinite",
            },
            keyframes: {
                meteor: {
                    "0%": {transform: "rotate(215deg) translateX(0)", opacity: "1"},
                    "70%": {opacity: "1"},
                    "100%": {
                        transform: "rotate(215deg) translateX(-500px)",
                        opacity: "0",
                    },
                },
            },
        },
    },
    plugins: [
        // rest of the code
        addVariablesForColors,
    ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({addBase, theme}) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}