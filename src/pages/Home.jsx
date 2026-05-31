import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTesti, setLoadingTesti] = useState(true);
  const countersRef = useRef([]);

  // Fetch Testimonials
  useEffect(() => {
    async function fetchHomeTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);
        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (err) {
        console.error('Error fetching home testimonials:', err);
      } finally {
        setLoadingTesti(false);
      }
    }
    fetchHomeTestimonials();
  }, []);

  // Run scroll animation hook
  useScrollAnimation([testimonials]);

  // Counter animation
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

  // Static Fallback Testimonials
  const fallbackTestimonials = [
    {
      stars: 5,
      content: 'Bayi saya jadi lebih tenang dan tidurnya nyenyak setelah rutin dipijat oleh terapis Intan Miracle.',
      author_name: 'Ibu Anisa',
      category: 'Pijat Bayi',
      avatar_initials: 'AS',
      avatar_bg: 'var(--mint)'
    },
    {
      stars: 5,
      content: 'Saya merasa sangat terbantu di masa nifas. Badan lebih ringan dan nyaman setelah dipijat.',
      author_name: 'Ibu Ratna',
      category: 'Pijat Ibu Nifas',
      avatar_initials: 'RW',
      avatar_bg: 'var(--pink-400)'
    },
    {
      stars: 5,
      content: 'Terapisnya sabar dan profesional. Si kecil senang sekali setiap kali sesi baby spa!',
      author_name: 'Ibu Dina',
      category: 'Baby Spa',
      avatar_initials: 'DL',
      avatar_bg: 'var(--peach)'
    },
    {
      stars: 5,
      content: 'Setelah laktasi massage, ASI saya terasa lebih lancar dan tidak terlalu tegang. Sangat merekomendasikan!',
      author_name: 'Ibu Alda',
      category: 'Laktasi Massage',
      avatar_initials: 'AL',
      avatar_bg: 'var(--peach)'
    },
    {
      stars: 5,
      content: 'ASI langsung lancar kembali setelah laktasi massage. Tekniknya lembut tapi efektif. Sangat membantu!',
      author_name: 'Ibu Fitri',
      category: 'Laktasi Massage',
      avatar_initials: 'FM',
      avatar_bg: 'var(--sage)'
    },
    {
      stars: 5,
      content: 'Perawatan luka persalinan sangat higienis dan teliti. Luka jahitan saya sembuh lebih cepat dari perkiraan.',
      author_name: 'Ibu Sarah',
      category: 'Perawatan Luka',
      avatar_initials: 'SP',
      avatar_bg: 'var(--pink-400)'
    }
  ];

  const activeTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-slider-track">
          <div className="hero-content">
            <div className="hero-badge">
              <span>💗</span> Mom & Baby Care Terpercaya
            </div>
            <h1>Perawatan <span className="highlight">Aman dan Nyaman</span> untuk Ibu dan Bayi</h1>
            <p className="hero-subtitle animate-on-scroll">
              Intan Miracle hadir untuk menemani masa emas<br className="br-mobile" /> ibu dan bayi dengan perawatan
              profesional,<br className="br-mobile" /> aman, dan nyaman.
            </p>
            <div className="hero-buttons">
              <Link to="/reservasi" className="btn btn-primary btn-lg">
                ➡️ Reservasi Sekarang
              </Link>
              <Link to="/layanan" className="btn btn-secondary btn-lg">
                ➡️ Lihat Layanan
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <div className="hero-blob"></div>
              <img src={img('/Image/IMG_3317.webp')} alt="Intan Miracle - Terapis Profesional" className="hero-photo" />
            </div>
            <div className="hero-float-card card-1">
              <div className="float-icon pink">💆‍♀️</div>
              <div>
                <strong>Terapis Profesional</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Berpengalaman & Terlatih</small>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <div className="float-icon mint"></div>
              <div>
                <strong>Layanan ke Rumah</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Nyaman & Praktis</small>
              </div>
            </div>
            <div className="hero-float-card card-3">
              <div className="float-icon lavender">🛡️</div>
              <div>
                <strong>Produk Aman</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Hypoallergenic</small>
              </div>
            </div>
            <div className="hero-float-card card-4">
              <div className="float-icon peach">🤲</div>
              <div>
                <strong>Teknik Lembut</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Aman untuk Bayi</small>
              </div>
            </div>
            <div className="hero-float-card card-5">
              <div className="float-icon gold">🕐</div>
              <div>
                <strong>Jadwal Fleksibel</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Sesuai Waktu Anda</small>
              </div>
            </div>
            <div className="hero-float-card card-6">
              <div className="float-icon rose">💰</div>
              <div>
                <strong>Harga Terjangkau</strong>
                <br /><small style={{ color: 'var(--text-muted)' }}>Kualitas Premium</small>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero Slider Pagination */}
        <div className="hero-slider-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
        </div>
      </section>

      {/* Momen Intan Miracle */}
      <section className="section momen-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Momen Intan Miracle</h2>
            <p>Intipan kecil dari pelayanan penuh kasih kami untuk<br className="br-mobile" /> ibu dan buah hati</p>
          </div>
          <div className="momen-grid">
            <div className="gallery-item animate-on-scroll">
              <img src={img('/Image/Galeri Intan Miracle Est 2019/1.webp')} alt="Momen Intan Miracle 1" />
              <div className="gallery-overlay"></div>
            </div>
            <div className="gallery-item animate-on-scroll">
              <img src={img('/Image/Galeri Intan Miracle Est 2019/5.webp')} alt="Momen Intan Miracle 5" />
              <div className="gallery-overlay"></div>
            </div>
            <div className="gallery-item animate-on-scroll">
              <img src={img('/Image/Galeri Intan Miracle Est 2019/15.webp')} alt="Momen Intan Miracle 15" />
              <div className="gallery-overlay"></div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }} className="animate-on-scroll">
            <Link to="/galeri" className="btn btn-secondary">📸 Lihat Semua Galeri</Link>
          </div>
        </div>
      </section>

      {/* Mengapa Memilih Intan Miracle? */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Mengapa Memilih Intan Miracle?</h2>
          </div>
          <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            <div className="animate-on-scroll">
              <div style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center' }}>
                <div style={{ marginBottom: '24px', overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
                  <img 
                    src={img('/Image/Melahirkan.webp')} 
                    alt="Pelayanan Intan Miracle"
                    style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-lg)' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ background: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>👩‍⚕️ Profesional</span>
                  <span style={{ background: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>🛡️ Aman</span>
                  <span style={{ background: 'white', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>✨ Nyaman</span>
                </div>
              </div>
            </div>
            <div className="animate-on-scroll">
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
                Kami memahami bahwa masa setelah melahirkan adalah fase paling penting bagi ibu dan bayi. Di <strong style={{ color: 'var(--pink-600)' }}>Intan Miracle</strong>, setiap sentuhan dilakukan dengan teknik yang tepat, lembut, dan penuh empati untuk mendukung kesehatan, kenyamanan, dan tumbuh kembang bayi secara optimal.
              </p>
              <Link to="/tentang" className="btn btn-secondary" style={{ marginTop: '24px' }}>Selengkapnya →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Unggulan */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Layanan Spesial untuk<br className="br-mobile" /> Ibu & Buah Hati</h2>
            <p>Perawatan terbaik yang dirancang khusus untuk kebutuhan ibu dan bayi</p>
          </div>
          <div className="grid-3">
            {/* Pelayanan Bayi */}
            <div className="card animate-on-scroll">
              <div className="card-icon" style={{ background: 'var(--mint)' }}>👶</div>
              <h3>Pelayanan Bayi</h3>
              <p>Baby Massage, Swim, Gym, Spa, hingga perawatan khusus newborn di rumah.</p>
            </div>
            {/* Pelayanan Ibu */}
            <div className="card animate-on-scroll">
              <div className="card-icon" style={{ background: 'var(--pink-100)' }}>🤍</div>
              <h3>Pelayanan Ibu</h3>
              <p>Pijat Ibu Hamil, Ibu Nifas, and Bengkung tradisional untuk pemulihan optimal.</p>
            </div>
            {/* Konselor Laktasi */}
            <div className="card animate-on-scroll">
              <div className="card-icon" style={{ background: 'var(--peach)' }}>🤱</div>
              <h3>Konselor Laktasi</h3>
              <p>Konsultasi menyusui dan Pijat Laktasi untuk kelancaran nutrisi buah hati.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }} className="animate-on-scroll">
            <Link to="/layanan" className="btn btn-primary">➡️ Lihat Semua Layanan</Link>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Mengapa Kami Dipercaya?</h2>
            <p>Komitmen kami untuk memberikan perawatan terbaik bagi ibu dan buah hati</p>
          </div>
          <div className="grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="feature-item animate-on-scroll">
              <div className="feature-check">✔</div>
              <div>
                <h4>Terapis Berpengalaman</h4>
                <p>Terlatih dan tersertifikasi profesional</p>
              </div>
            </div>
            <div className="feature-item animate-on-scroll">
              <div className="feature-check">✔</div>
              <div>
                <h4>Teknik Aman</h4>
                <p>Sesuai usia dan kondisi bayi</p>
              </div>
            </div>
            <div className="feature-item animate-on-scroll">
              <div className="feature-check">✔</div>
              <div>
                <h4>Perawatan Personal</h4>
                <p>Disesuaikan kebutuhan masing-masing</p>
              </div>
            </div>
            <div className="feature-item animate-on-scroll">
              <div className="feature-check">✔</div>
              <div>
                <h4>Produk Ramah Bayi</h4>
                <p>Aman dan hypoallergenic</p>
              </div>
            </div>
            <div className="feature-item animate-on-scroll">
              <div className="feature-check">✔</div>
              <div>
                <h4>Layanan ke Rumah</h4>
                <p>Praktis tanpa perlu keluar rumah</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Testimoni Singkat */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Apa Kata Mereka?</h2>
            <p>Testimoni nyata dari para ibu yang mempercayakan perawatannya kepada kami</p>
          </div>
          <div className="grid-3" id="testimonialsHomeContainer">
            {activeTestimonials.map((tst, i) => (
              <div className="testimonial-card animate-on-scroll" key={i}>
                <div className="testimonial-stars">{'★'.repeat(tst.stars || 5)}</div>
                <div className="quote-icon">"</div>
                <p>{tst.content}</p>
                <div className="author">
                  <div className="author-avatar" style={{ background: tst.avatar_bg || 'var(--pink-400)' }}>
                    {tst.avatar_initials || 'IB'}
                  </div>
                  <div className="author-info">
                    <h4>{tst.author_name}</h4>
                    <span>{tst.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }} className="animate-on-scroll">
            <Link to="/testimoni" className="btn btn-secondary">Lihat Semua Testimoni →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Karena ibu yang tenang dan<br className="br-mobile" /> bayi yang nyaman</h2>
          <p>adalah awal dari keluarga yang bahagia.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Reservasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
