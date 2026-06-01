import React from 'react';
import { Link } from 'react-router-dom';
import { img } from '../utils/imageUrl';

export default function Akses() {
  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, var(--pink-50) 0%, #fff 100%)',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: 'var(--radius-2xl)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid rgba(236, 72, 153, 0.1)',
        padding: '40px 30px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img 
            src={img('/Image/LOGO INTAN MIRACLE colour italic.webp')} 
            alt="Intan Miracle Logo" 
            style={{ maxHeight: '70px', objectFit: 'contain' }}
          />
        </div>

        {/* Title */}
        <h2 className="text-gradient" style={{ fontSize: '1.6rem', marginBottom: '8px', fontWeight: 800 }}>
          Akses Cepat Layanan
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Selamat datang di Intan Miracle Care! 🌸 Silakan pilih menu di bawah ini untuk memulai langkah Anda:
        </p>

        {/* Menu Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Reservasi */}
          <Link to="/reservasi" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                background: 'linear-gradient(135deg, var(--pink-500) 0%, var(--pink-600) 100%)',
                color: 'white',
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'left',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(236, 72, 153, 0.15)';
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>📅</span>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: 'white' }}>Reservasi Layanan</h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0, lineHeight: 1.4 }}>
                  Pesan jadwal terapi, pijat bayi, spa, atau homecare dengan mudah.
                </p>
              </div>
            </div>
          </Link>

          {/* Card 2: Member Area */}
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                background: 'white',
                border: '2px solid var(--pink-200)',
                color: 'var(--text-primary)',
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                textAlign: 'left',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'var(--pink-400)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(236, 72, 153, 0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--pink-200)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.02)';
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>💎</span>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--pink-600)' }}>Member Area</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Masuk / daftar member eksklusif untuk mendapatkan program diskon.
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: '36px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Intan Miracle Care. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}
