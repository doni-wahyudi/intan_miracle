import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

export default function Tentang() {
  const [certs, setCerts] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [therapists, setTherapists] = useState([]);
  const [loadingTherapists, setLoadingTherapists] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const [lightboxAlt, setLightboxAlt] = useState('');

  const certTrackRef = useRef(null);
  const countersRef = useRef([]);

  // Touch and Drag State
  const startX = useRef(0);
  const isDragging = useRef(false);
  const autoplayTimer = useRef(null);

  // Fallback Certificates
  const fallbackCerts = [
    { image_url: img('/Sertifikat/Tangkapan Layar 2026-05-31 pukul 10.05.30.webp'), title: 'Sertifikat CBMT - Certified Baby & Mom Therapist' },
    { image_url: img('/Sertifikat/Tangkapan Layar 2026-05-31 pukul 10.06.26.webp'), title: 'Sertifikat Standarisasi Midwifery Update' },
    { image_url: img('/Sertifikat/Tangkapan Layar 2026-05-31 pukul 10.05.58.webp'), title: 'Sertifikat Standarisasi Asuhan Persalinan Normal (APN)' },
    { image_url: img('/Sertifikat/Tangkapan Layar 2026-05-31 pukul 10.06.54.webp'), title: 'Sertifikat Miracle Touch Holistic EFT' },
    { image_url: img('/Sertifikat/WhatsApp Image 2026-05-31 at 08.58.03.webp'), title: 'Sertifikat Pencegahan & Penanganan Stunting' }
  ];

  // Fallback Therapists
  const fallbackTherapists = [
    {
      name: 'Bdn. Risa Amelia, A.Md.Keb.',
      role: 'Spesialis Baby Massage & Kids Spa',
      image_url: img('/Image/PP 2.webp'),
    },
    {
      name: 'Siti Rahmawati, S.Tr.Keb.',
      role: 'Spesialis Perawatan Ibu Pasca Melahirkan & Laktasi',
      image_url: img('/Image/Foto Owner.webp'),
    },
    {
      name: 'Fatimah Zahra, A.Md.Keb.',
      role: 'Terapis Pijat Bayi & Pediatric Massage',
      image_url: img('/Image/PP 2.webp'),
    }
  ];

  const activeTherapists = therapists.length > 0 ? therapists : fallbackTherapists;
  const activeCerts = certs.length > 0 ? certs : fallbackCerts;

  // Fetch Certificates & Therapists
  useEffect(() => {
    async function fetchCertificates() {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setCerts(data);
        }
      } catch (err) {
        console.error('Error fetching certificates:', err);
      } finally {
        setLoadingCerts(false);
      }
    }
    async function fetchTherapists() {
      try {
        const { data, error } = await supabase
          .from('therapists')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setTherapists(data);
        }
      } catch (err) {
        console.error('Error fetching therapists:', err);
      } finally {
        setLoadingTherapists(false);
      }
    }
    fetchCertificates();
    fetchTherapists();
  }, []);

  // Run scroll animations
  useScrollAnimation([certs]);

  // Autoplay functionality
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeCerts.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [activeCerts.length]);

  // Next / Prev slide handlers
  const nextSlide = () => {
    stopAutoplay();
    setCurrentSlide(prev => (prev + 1) % activeCerts.length);
    startAutoplay();
  };

  const prevSlide = () => {
    stopAutoplay();
    setCurrentSlide(prev => (prev - 1 + activeCerts.length) % activeCerts.length);
    startAutoplay();
  };

  // Drag and Swipe logic
  const handleDragStart = (xPos) => {
    startX.current = xPos;
    isDragging.current = true;
    stopAutoplay();
  };

  const handleDragEnd = (endX) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else {
      startAutoplay();
    }
  };

  // Lightbox handlers
  const openLightbox = (src, alt) => {
    setLightboxSrc(src);
    setLightboxAlt(alt);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
    stopAutoplay();
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
    startAutoplay();
  };

  // Counter animations
  useEffect(() => {
    const targets = countersRef.current;
    if (targets.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const targetVal = parseInt(targetEl.getAttribute('data-count'), 10);
          let currentVal = 0;
          const increment = targetVal / 40;

          const timer = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetVal) {
              currentVal = targetVal;
              clearInterval(timer);
            }
            targetEl.textContent = Math.floor(currentVal) + '+';
          }, 30);

          observer.unobserve(targetEl);
        }
      });
    }, { threshold: 0.5 });

    targets.forEach(target => {
      if (target) observer.observe(target);
    });

    return () => {
      targets.forEach(target => {
        if (target) observer.unobserve(target);
      });
    };
  }, []);

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Tentang Kami</h1>
          <p>Mengenal lebih dekat Intan Miracle dan komitmen kami untuk ibu dan bayi</p>
        </div>
      </section>

      {/* Siapa Kami */}
      <section className="section">
        <div className="container">
          <div className="about-intro">
            <div className="about-intro-visual animate-on-scroll">
              <div className="about-blob"></div>
              <img src={img('/Image/PP 2.webp')} alt="Intan Miracle Profil" className="about-photo" />
            </div>
            <div className="about-text animate-on-scroll">
              <h2>Siapa Kami</h2>
              <p>
                <strong>Intan Miracle</strong> adalah layanan Mom and Baby Care yang berfokus pada
                kesehatan, kenyamanan, dan pemulihan ibu serta stimulasi tumbuh kembang bayi melalui metode
                perawatan yang aman dan profesional.
              </p>
              <p style={{ marginTop: '16px' }}>
                Kami percaya bahwa setiap ibu dan bayi berhak mendapatkan perawatan terbaik. Dengan terapis
                berpengalaman dan pendekatan penuh empati, kami hadir sebagai mitra terpercaya di masa-masa
                paling berharga dalam hidup Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Owner & Terapis */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Pendiri & Terapis</h2>
            <p>Kenali sosok di balik Intan Miracle</p>
          </div>
          <div className="owner-profile animate-on-scroll">
            <div className="owner-photo-wrapper">
              <div className="owner-photo-frame">
                <img src={img('/Image/Foto Owner.webp')} alt="Bdn. Intan Purnama Sari, S.Keb., CBMT" className="owner-photo" />
              </div>
              <div className="owner-badge">
                <span>👩‍⚕️</span> Certified Baby & Mom Therapist
              </div>
            </div>
            <div className="owner-bio">
              <h3>Bdn. Intan Purnama Sari, S.Keb., CBMT</h3>
              <div className="owner-title">Owner & Lead Therapist — Intan Miracle</div>
              <p>
                <strong>Bdn. Intan Purnama Sari, S.Keb., CBMT</strong> adalah bidan profesional sejak 2017 yang juga memegang sertifikasi Certified Baby and Mom Therapist sejak 2019. Dengan pengalaman menangani lebih dari 1.000 tindakan, beliau sangat ahli dalam pelayanan kebidanan medis mulai dari persalinan, pemeriksaan kehamilan, perawatan ibu nifas, hingga layanan imunisasi, KB, dan tindik steril.
              </p>
              <p>
                Selain tindakan medis kebidanan, Bidan Intan juga merupakan spesialis dalam terapi relaksasi ibu dan anak, seperti pijat bayi, baby spa, serta pijat laktasi untuk kelancaran ASI. Kombinasi antara ilmu kebidanan resmi dan keahlian terapi bersertifikat ini menjadikannya sosok terpercaya yang siap memberikan perawatan terbaik, aman, dan penuh kasih sayang untuk Anda dan Si Kecil.
              </p>
              <div className="owner-highlights">
                <div className="owner-highlight-item">
                  <span className="highlight-icon">🎓</span>
                  <span>Bidan Profesional sejak 2017</span>
                </div>
                <div className="owner-highlight-item">
                  <span className="highlight-icon">📜</span>
                  <span>Sertifikasi CBMT sejak 2019</span>
                </div>
                <div className="owner-highlight-item">
                  <span className="highlight-icon">💪</span>
                  <span>1.000+ Tindakan Berhasil</span>
                </div>
                <div className="owner-highlight-item">
                  <span className="highlight-icon">💗</span>
                  <span>Penuh Kasih Sayang</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terapis Grid */}
          <div style={{ marginTop: '56px' }}>
            <h3 className="animate-on-scroll" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-primary)' }}>Tim Terapis Profesional Kami</h3>
            <p className="animate-on-scroll" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>Terapis bersertifikat dan berdedikasi tinggi untuk melayani Anda dan buah hati</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
              {activeTherapists.map((tp, idx) => (
                <div key={idx} className="animate-on-scroll" style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.05)',
                  border: '1px solid var(--pink-100)',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  padding: '24px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(236, 72, 153, 0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(236, 72, 153, 0.05)';
                }}
                >
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '3px solid var(--pink-200)' }}>
                    <img src={tp.image_url || img('/Image/PP 2.webp')} alt={tp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '6px' }}>{tp.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--pink-600)', fontWeight: 600, margin: 0 }}>{tp.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sertifikat */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Sertifikat & Lisensi</h2>
            <p>Bukti kompetensi dan profesionalisme dalam memberikan layanan terbaik</p>
          </div>
          <div className="cert-carousel animate-on-scroll">
            <div 
              className="cert-track" 
              ref={certTrackRef}
              style={{ 
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: isDragging.current ? 'none' : 'transform 0.5s ease-in-out'
              }}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseUp={(e) => handleDragEnd(e.clientX)}
              onMouseLeave={() => { if (isDragging.current) { isDragging.current = false; startAutoplay(); } }}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
            >
              {activeCerts.map((cert, index) => (
                <div 
                  className="cert-slide" 
                  key={index}
                  onClick={() => openLightbox(cert.image_url, cert.title)}
                >
                  <img src={cert.image_url} alt={cert.title} draggable="false" />
                </div>
              ))}
            </div>
            
            <button className="cert-nav cert-prev" onClick={prevSlide} aria-label="Sebelumnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="cert-nav cert-next" onClick={nextSlide} aria-label="Berikutnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            <div className="cert-dots">
              {activeCerts.map((_, index) => (
                <button
                  key={index}
                  className={`cert-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => {
                    stopAutoplay();
                    setCurrentSlide(index);
                    startAutoplay();
                  }}
                  aria-label={`Sertifikat ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="cert-lightbox active" onClick={closeLightbox}>
          <button className="cert-lightbox-close" onClick={closeLightbox} aria-label="Tutup">&times;</button>
          <img src={lightboxSrc} alt={lightboxAlt} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Visi & Misi */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Visi & Misi Kami</h2>
            <p>Fondasi yang menjadi landasan setiap layanan kami</p>
          </div>
          <div className="vision-mission">
            <div className="vm-card animate-on-scroll">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔭</div>
              <h3>Visi</h3>
              <p>Menjadi sahabat terbaik ibu dalam merawat dan mendampingi bayi di masa awal kehidupan.</p>
            </div>
            <div className="vm-card animate-on-scroll">
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎯</div>
              <h3>Misi</h3>
              <ul>
                <li>Memberikan perawatan berkualitas dan aman</li>
                <li>Mengedepankan pendekatan lembut dan penuh empati</li>
                <li>Mendukung pemulihan ibu setelah melahirkan</li>
                <li>Membantu tumbuh kembang bayi secara optimal</li>
                <li>Memberikan edukasi dasar perawatan bayi kepada orang tua</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai Kami */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Nilai-Nilai Kami</h2>
            <p>Prinsip yang kami pegang teguh dalam setiap layanan</p>
          </div>
          <div className="values-grid">
            <div className="value-item animate-on-scroll">
              <div className="value-icon">💗</div>
              <h4>Cinta</h4>
            </div>
            <div className="value-item animate-on-scroll">
              <div className="value-icon">🛡️</div>
              <h4>Keamanan</h4>
            </div>
            <div className="value-item animate-on-scroll">
              <div className="value-icon">👩‍⚕️</div>
              <h4>Profesionalisme</h4>
            </div>
            <div className="value-item animate-on-scroll">
              <div className="value-icon">✨</div>
              <h4>Kenyamanan</h4>
            </div>
            <div className="value-item animate-on-scroll">
              <div className="value-icon">🤍</div>
              <h4>Kepercayaan</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section-pink">
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div className="animate-on-scroll">
              <div 
                ref={el => countersRef.current[0] = el}
                style={{ fontSize: '2.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: 'var(--pink-600)' }}
                data-count="500"
              >
                0+
              </div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '8px' }}>Ibu & Bayi Terlayani</p>
            </div>
            <div className="animate-on-scroll">
              <div 
                ref={el => countersRef.current[1] = el}
                style={{ fontSize: '2.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: 'var(--pink-600)' }}
                data-count="15"
              >
                0+
              </div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '8px' }}>Layanan Tersedia</p>
            </div>
            <div className="animate-on-scroll">
              <div 
                ref={el => countersRef.current[2] = el}
                style={{ fontSize: '2.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: 'var(--pink-600)' }}
                data-count="6"
              >
                0+
              </div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '8px' }}>Tahun Pengalaman</p>
            </div>
            <div className="animate-on-scroll">
              <div 
                ref={el => countersRef.current[3] = el}
                style={{ fontSize: '2.5rem', fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: 'var(--pink-600)' }}
                data-count="100"
              >
                0+
              </div>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 500, marginTop: '8px' }}>Testimoni Positif</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Siap Merasakan Perawatan Terbaik?</h2>
          <p>Hubungi kami sekarang dan rasakan perbedaannya.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Reservasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
