/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Overriding Tailwind's built-in scales (rather than inventing new
        // keys) means every existing `bg-slate-50`, `text-emerald-600`,
        // `border-amber-200` etc. across the app picks up the new palette
        // automatically — no need to touch component markup.

        // "Paper & ink" — warm, slightly greenish-gray, deliberately NOT the
        // cream/terracotta or near-black/neon looks that read as generic
        // AI-dashboard defaults.
        slate: {
          50: '#F4F3EE',
          100: '#EAE7DE',
          200: '#DAD6C9',
          300: '#C3BDAC',
          400: '#9C9484',
          500: '#78715F',
          600: '#5B5546',
          700: '#453F33',
          800: '#2E2A22',
          900: '#201D18',
        },
        // Primary accent: brass / goldenrod ink, like a highlighter or a
        // brass paper-fastener — not the indigo/violet every AI dashboard
        // reaches for.
        brand: {
          50: '#FBF3E3',
          100: '#F5E4BE',
          200: '#ECCB8A',
          300: '#E0AF5C',
          400: '#CE9640',
          500: '#B8863B',
          600: '#9C6F2E',
          700: '#7D5824',
          800: '#5E421B',
          900: '#402D12',
        },
        // Deep pine — used wherever the app previously used emerald
        // (success states, "strengths", easy difficulty). Reads like
        // rubber-stamp ink rather than a stock-chart green.
        emerald: {
          50: '#EAF1EE',
          100: '#CFE0D8',
          200: '#A3C4B6',
          300: '#75A794',
          400: '#4F8973',
          500: '#3F6B5E',
          600: '#325549',
          700: '#274036',
          800: '#1B2C25',
          900: '#101B16',
        },
        // Muted ochre — used wherever the app previously used amber
        // (medium difficulty, warnings). Distinct enough from `brand` to
        // stay legible as a separate signal.
        amber: {
          50: '#FBF1DE',
          100: '#F5DFAF',
          200: '#EAC372',
          300: '#DCA83E',
          400: '#C99323',
          500: '#B37F1B',
          600: '#8F6516',
          700: '#6C4C10',
          800: '#49330B',
          900: '#271B06',
        },
        // Brick red — used wherever the app previously used rose (hard
        // difficulty, destructive actions, low scores). Warm and inky
        // rather than a bright alert-red.
        rose: {
          50: '#F7E9E4',
          100: '#EDC9BB',
          200: '#DFA48C',
          300: '#CD7B5C',
          400: '#B85B3B',
          500: '#A8432F',
          600: '#8A3626',
          700: '#6C2A1D',
          800: '#4E1E15',
          900: '#33130D',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1B1815',
        },
      },
      fontFamily: {
        // Body copy: a clean, slightly technical humanist sans — evokes a
        // typed transcript rather than a marketing-site sans.
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        // Headings only (applied via a base `h1,h2,h3` rule): a display
        // serif with real character, used sparingly.
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        // Scores, timers, category tags, eyebrows — a monospace, like text
        // typed on an index card.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // A hairline + soft drop, like a card resting on a desk — not a
        // diffuse "floating panel" glow.
        card: '0 1px 0 rgba(32, 29, 24, 0.04), 0 6px 16px -8px rgba(32, 29, 24, 0.18)',
        'card-hover': '0 1px 0 rgba(32, 29, 24, 0.04), 0 12px 28px -8px rgba(184, 134, 59, 0.28)',
      },
      borderRadius: {
        // Index-card corners: barely rounded, not the pillowy "xl2" blob
        // radius common to AI-generated SaaS UI.
        xl2: '0.5rem',
      },
    },
  },
  plugins: [],
};
