import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Tentang from './pages/Tentang';
import Layanan from './pages/Layanan';
import Galeri from './pages/Galeri';
import Artikel from './pages/Artikel';
import ArtikelDetail from './pages/ArtikelDetail';
import Testimoni from './pages/Testimoni';
import Member from './pages/Member';
import Reservasi from './pages/Reservasi';
import Admin from './pages/Admin';
import Akses from './pages/Akses';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/admin.html');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Support legacy static HTML paths for seamless SEO migration */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/tentang" element={<Tentang />} />
        <Route path="/tentang.html" element={<Navigate to="/tentang" replace />} />
        <Route path="/layanan" element={<Layanan />} />
        <Route path="/layanan.html" element={<Navigate to="/layanan" replace />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/galeri.html" element={<Navigate to="/galeri" replace />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel.html" element={<Navigate to="/artikel" replace />} />
        <Route path="/artikel/:slug" element={<ArtikelDetail />} />
        <Route path="/artikel-tanda-bahaya-kehamilan.html" element={<Navigate to="/artikel/tanda-bahaya-kehamilan" replace />} />
        <Route path="/testimoni" element={<Testimoni />} />
        <Route path="/testimoni.html" element={<Navigate to="/testimoni" replace />} />
        <Route path="/member" element={<Member />} />
        <Route path="/member.html" element={<Navigate to="/member" replace />} />
        <Route path="/reservasi" element={<Reservasi />} />
        <Route path="/reservasi.html" element={<Navigate to="/reservasi" replace />} />
        <Route path="/akses" element={<Akses />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
        
        {/* Fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
