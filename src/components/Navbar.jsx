import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { img } from '../utils/imageUrl';

export default function Navbar() {
  const [menuActive, setMenuActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuActive(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMenu = () => {
    const nextState = !menuActive;
    setMenuActive(nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  const closeMenu = () => {
    setMenuActive(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img src={img('/Image/LOGO INTAN MIRACLE colour italic.webp')} alt="Intan Miracle Logo" className="logo-image" />
          </Link>
          
          <div className={`navbar-nav ${menuActive ? 'active' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Beranda</NavLink>
            <NavLink to="/tentang" className={({ isActive }) => isActive ? 'active' : ''}>Tentang Kami</NavLink>
            <NavLink to="/layanan" className={({ isActive }) => isActive ? 'active' : ''}>Layanan</NavLink>
            <NavLink to="/galeri" className={({ isActive }) => isActive ? 'active' : ''}>Galeri</NavLink>
            <NavLink to="/artikel" className={({ isActive }) => isActive ? 'active' : ''}>Artikel</NavLink>
            <NavLink to="/testimoni" className={({ isActive }) => isActive ? 'active' : ''}>Testimoni</NavLink>
            <NavLink to="/member" className={({ isActive }) => isActive ? 'active' : ''}>Member</NavLink>
            <NavLink to="/reservasi" className="nav-cta">Reservasi</NavLink>
          </div>

          <button 
            className={`hamburger ${menuActive ? 'active' : ''}`} 
            onClick={toggleMenu} 
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div 
          className={`nav-overlay ${menuActive ? 'active' : ''}`} 
          onClick={closeMenu}
        ></div>
      </nav>
    </>
  );
}
