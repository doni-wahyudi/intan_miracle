import React from 'react';
import { Link } from 'react-router-dom';

export default function Akses() {
  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, var(--pink-50) 0%, #fff 100%)',
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -15px rgba(236, 72, 153, 0.12), 0 0 50px 0 rgba(0, 0, 0, 0.01)',
        border: '1px solid rgba(236, 72, 153, 0.1)',
        padding: '48px 36px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Title */}
        <h2 className="text-gradient" style={{ fontSize: '1.8rem', marginBottom: '12px', fontWeight: 800 }}>
          Akses Cepat Layanan
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '36px' }}>
          Selamat datang di Intan Miracle Care! 🌸 Silakan pilih menu di bawah ini untuk memulai langkah Anda:
        </p>

        {/* Menu Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Reservasi */}
          <Link to="/reservasi" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                background: 'white',
                border: '2px solid rgba(236, 72, 153, 0.12)',
                padding: '24px',
                borderRadius: '20px',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--pink-400)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.08)';
                const arrow = e.currentTarget.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(6px)';
                const title = e.currentTarget.querySelector('.card-title');
                if (title) title.style.color = 'var(--pink-600)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.12)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.02)';
                const arrow = e.currentTarget.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(0)';
                const title = e.currentTarget.querySelector('.card-title');
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                  border: '1px solid rgba(236, 72, 153, 0.1)'
                }}>
                  📅
                </div>
                <div>
                  <h3 className="card-title" style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    margin: '0 0 6px 0', 
                    color: '#1f2937',
                    transition: 'color 0.3s ease'
                  }}>
                    Reservasi Layanan
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Pesan jadwal terapi, pijat bayi, spa, atau homecare dengan mudah.
                  </p>
                </div>
              </div>
              <div className="arrow-icon" style={{
                fontSize: '1.5rem',
                color: 'var(--pink-500)',
                fontWeight: 'bold',
                transition: 'transform 0.3s ease',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                →
              </div>
            </div>
          </Link>

          {/* Card 2: Member Area */}
          <Link to="/member" style={{ textDecoration: 'none' }}>
            <div 
              style={{
                background: 'white',
                border: '2px solid rgba(236, 72, 153, 0.12)',
                padding: '24px',
                borderRadius: '20px',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(236, 72, 153, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'var(--pink-400)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(236, 72, 153, 0.08)';
                const arrow = e.currentTarget.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(6px)';
                const title = e.currentTarget.querySelector('.card-title');
                if (title) title.style.color = 'var(--pink-600)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.12)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.02)';
                const arrow = e.currentTarget.querySelector('.arrow-icon');
                if (arrow) arrow.style.transform = 'translateX(0)';
                const title = e.currentTarget.querySelector('.card-title');
                if (title) title.style.color = '#1f2937';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  flexShrink: 0,
                  border: '1px solid rgba(236, 72, 153, 0.1)'
                }}>
                  💎
                </div>
                <div>
                  <h3 className="card-title" style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    margin: '0 0 6px 0', 
                    color: '#1f2937',
                    transition: 'color 0.3s ease'
                  }}>
                    Member Area
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    Masuk / daftar member eksklusif untuk mendapatkan program diskon.
                  </p>
                </div>
              </div>
              <div className="arrow-icon" style={{
                fontSize: '1.5rem',
                color: 'var(--pink-500)',
                fontWeight: 'bold',
                transition: 'transform 0.3s ease',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center'
              }}>
                →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

