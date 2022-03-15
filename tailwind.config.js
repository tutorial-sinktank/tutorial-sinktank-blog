module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}'],
    content: [],
    theme: {
        extends: {
            colors: {
                "white": "#ffffff",
                "black": "#000000",
            },
            fontFamily: {
                sans: ['Zen Kaku Gothic Antique', 'sans-serif'],
                serif: ['Nanum Myeongjo', 'Noto Serif TC', 'serif'],
                mono: ['Fira Mono', 'monospace']
            }
        }
    },
    plugins: [],
}
