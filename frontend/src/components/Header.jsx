const Header = () => (
    <header style={{ backgroundColor: '#333', color: '#fff', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Logo */}
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Logo
        </div>

        {/* Center: Menu */}
        <nav>
            <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0, padding: 0 }}>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>About</a></li>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Services</a></li>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a></li>
            </ul>
        </nav>
    </header>
);

export default Header;
