/** Tailwind CSS production configuration for Buddhi Labs.
 *  Brand tokens are identical to the former Play-CDN config (assets/js/tailwind.config.js, now retired).
 *  Colours derive from the official logo: background #023530, foreground #FFFFFF. See README "Brand color system". */
module.exports = {
  content: ['./*.html', './assets/js/main.js', './assets/js/contact-form.js', './scripts/safelist.txt'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0B5A50', 50: '#F0F7F5', 100: '#DCEDE9', 200: '#BBDBD4', 300: '#8FC3B9', 400: '#5FA99C', 500: '#3A8B7E', 600: '#1F6E62', 700: '#0B5A50', 800: '#064238', 900: '#023530', 950: '#01221F' },
        accent:  { DEFAULT: '#2FA391', 50: '#EEFAF7', 100: '#D3F2EB', 200: '#A9E4D9', 300: '#79D1C1', 400: '#4DBBA8', 500: '#2FA391', 600: '#1F8676', 700: '#186B5F' },
        gray:    { 50: '#F4F9F8', 100: '#E6F0EE', 200: '#CFE0DC', 300: '#AABBB9', 400: '#86A09C', 500: '#5D7976', 600: '#436966', 700: '#2E4E4A', 800: '#1B3835', 900: '#0F2320', 950: '#071614' }
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(2, 53, 48, 0.04), 0 8px 24px -8px rgba(2, 53, 48, 0.14)',
        'card-hover': '0 4px 8px rgba(2, 53, 48, 0.06), 0 20px 40px -12px rgba(2, 53, 48, 0.28)'
      },
      backgroundImage: { 'brand-dots': 'radial-gradient(rgba(255,255,255,0.14) 1.2px, transparent 1.3px)' }
    }
  },
  plugins: []
};
