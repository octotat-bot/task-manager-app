import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const CreativeHeader = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate parallax effect for decorations
  const getParallaxStyle = (factor) => {
    const x = (mousePosition.x - window.innerWidth / 2) * factor;
    const y = (mousePosition.y - window.innerHeight / 2) * factor;
    return { transform: `translate(${x}px, ${y}px)` };
  };

  return (
    <header className={`creative-header ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-content">
        <div className="header-left">
          <div className="title-container">
            <h1 className="animated-title">
              <span className="title-letter">T</span>
              <span className="title-letter">a</span>
              <span className="title-letter">s</span>
              <span className="title-letter">k</span>
              <span className="title-spacer"></span>
              <span className="title-letter">M</span>
              <span className="title-letter">a</span>
              <span className="title-letter">n</span>
              <span className="title-letter">a</span>
              <span className="title-letter">g</span>
              <span className="title-letter">e</span>
              <span className="title-letter">r</span>
            </h1>
            <div className="title-underline"></div>
          </div>
          <p className="subtitle">Organize your life, one task at a time</p>
          <div className="header-features">
            <span className="feature-badge">Smart Sorting</span>
            <span className="feature-badge">Date Tracking</span>
            <span className="feature-badge">Easy Filtering</span>
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={toggleTheme} 
            className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
            aria-label="Toggle theme"
            onFocus={(e) => e.currentTarget.blur()}
          >
            <div className="toggle-track">
              <div className="toggle-scene"></div>
              <div className="toggle-stars">
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
                <div className="star"></div>
              </div>
              <div className="toggle-thumb">
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
                <div className="sun-ray"></div>
              </div>
              <div className="cloud"></div>
              <div className="cloud"></div>
            </div>
          </button>
        </div>
      </div>
      <div className="header-decoration">
        <div 
          className="decoration-circle" 
          style={getParallaxStyle(-0.02)}
        ></div>
        <div 
          className="decoration-circle decoration-circle-2" 
          style={getParallaxStyle(-0.01)}
        ></div>
        <div 
          className="decoration-line" 
          style={getParallaxStyle(0.02)}
        ></div>
        <div 
          className="decoration-square" 
          style={getParallaxStyle(0.03)}
        ></div>
        <div 
          className="decoration-dots"
          style={getParallaxStyle(-0.015)}
        ></div>
      </div>
      <div className="header-waves">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            className="wave wave1"
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path 
            className="wave wave2"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </header>
  );
};

export default CreativeHeader; 