import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Autoralli.ee disainisüsteem — Estonian Rally Championship brand.
 *
 * Tokenid tulevad otse `Autoralli_Brand_Guidelines_v1.pdf` failist (12/Implementation).
 * Standard Mode on hele ja toimetuslik, Race Mode (tumesinine) on reserveeritud
 * otseülekande vaadetele, mida see projekt praegu ei ehita (tulemused tulevad
 * partneri API-st, vt claude.md andmereeglid).
 */
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: '#0D71B8', // championship blue — ainus aktsent
        black: '#0A0A0A', // track black
        white: '#FFFFFF', // snow white
        mist: '#F4F6F8', // tõstetud pind, heledal taustal
        line: '#D8E0E7', // äärejooned heledal taustal
        slate: '#52606D', // teisene tekst
        midnight: '#06121C', // tume pind (jalus, Race Mode)
        live: '#D92D20',
        caution: '#F2A900',
        success: '#087A4B',
      },
      fontFamily: {
        display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        // `font-mono` jääb utiliidina alles (ajad, sildid), aga jookseb
        // Barlow' tabelnumbritel — eraldi monospace-fonti enam ei laeta.
        mono: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        shell: '1400px',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      transitionTimingFunction: {
        forward: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
