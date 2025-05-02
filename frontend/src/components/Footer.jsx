// src/components/Footer.js
import LanguageToggle from './LanguageToggle';

const Footer = () => (
  <footer style={{ backgroundColor: '#333', color: '#fff', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    {/* Left: Language Toggle */}
    <LanguageToggle />

    {/* Right: Footer Text */}
    <div>© {new Date().getFullYear()} Your Company. All rights reserved.</div>
  </footer>
);

export default Footer;
