import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: '#0a0a0a',
          1: '#161616',
          2: '#1a0808',
        },
        red: {
          DEFAULT: '#C8102E',
          soft: 'rgba(200,16,46,.18)',
        },
        gold: {
          DEFAULT: '#FF6B1A',
          soft: 'rgba(255,107,26,.16)',
          hi: '#FFB347',
        },
        line: 'rgba(255,255,255,.08)',
        dim: 'rgba(255,255,255,.6)',
      },
      fontFamily: {
        display: ['Oswald', 'Impact', '"PingFang SC"', '"Arial Black"', 'sans-serif'],
        sans: ['Inter', '"Helvetica Neue"', '"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'monospace'],
      },
      backgroundImage: {
        'gold-fill': 'linear-gradient(180deg,#FFB347 0%,#FF6B1A 50%,#C8102E 100%)',
        'court':
          'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,107,26,.18) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 100%, rgba(200,16,46,.25) 0%, transparent 65%), linear-gradient(180deg, #0a0a0a 0%, #1a0808 100%)',
      },
      keyframes: {
        pulse_red: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,26,.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(255,107,26,0)' },
        },
      },
      animation: {
        'pulse-red': 'pulse_red 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
