import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

export default function Testimoni() {
  const [dbTestimonials, setDbTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Slider states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  
  const trackRef = useRef(null);
  
  // Drag states
  const startX = useRef(0);
  const isDragging = useRef(false);
  const autoplayTimer = useRef(null);

  // Fallback Testimonials
  const fallbackTestimonials = [
    {
      stars: 5,
      content: 'Bayi saya jadi lebih nyaman setelah dipijat oleh terapis dari Intan Miracle. Awalnya khawatir karena bayi masih kecil, tapi ternyata terapisnya sangat hati-hati dan profesional. Sekarang si kecil tidurnya lebih nyenyak dan jarang rewel. Sangat recommended untuk para ibu baru!',
      author_name: 'Ibu Anisa Sari',
      category: 'Pijat Bayi',
      avatar_initials: 'AS',
      avatar_bg: 'var(--mint)'
    },
    {
      stars: 5,
      content: 'Saya merasa sangat terbantu setelah melahirkan. Badan terasa pegal dan berat, tapi setelah dipijat oleh terapis Intan Miracle, badan jadi jauh lebih ringan dan nyaman. Terapisnya juga memberikan tips perawatan nifas yang sangat membantu. Terima kasih banyak!',
      author_name: 'Ibu Ratna Wulandari',
      category: 'Pijat Ibu Nifas',
      avatar_initials: 'RW',
      avatar_bg: 'var(--pink-400)'
    },
    {
      stars: 5,
      content: 'Pelayanannya lembut dan profesional. Si kecil senang sekali setiap kali sesi baby spa! Terapisnya sabar menangani bayi saya yang awalnya agak rewel. Setelah beberapa kali baby spa, bayi saya jadi lebih aktif dan nafsu makannya meningkat. Pasti akan rutin booking lagi.',
      author_name: 'Ibu Dina Lestari',
      category: 'Baby Spa',
      avatar_initials: 'DL',
      avatar_bg: 'var(--peach)'
    },
    {
      stars: 5,
      content: 'Saya sempat mengalami kendala ASI tidak lancar dan payudara bengkak. Setelah laktasi massage dengan Intan Miracle, ASI langsung lancar kembali. Tekniknya lembut tapi efektif. Sangat membantu ibu-ibu yang sedang berjuang menyusui!',
      author_name: 'Ibu Fitri Maharani',
      category: 'Laktasi Massage',
      avatar_initials: 'FM',
      avatar_bg: 'var(--sage)'
    },
    {
      stars: 5,
      content: 'Sangat bersyukur menemukan Intan Miracle. Perawatan luka persalinan yang mereka lakukan sangat higienis dan teliti. Luka jahitan saya sembuh lebih cepat dari yang diperkirakan. Terapisnya juga ramah dan membuat saya merasa nyaman selama proses perawatan.',
      author_name: 'Ibu Sarah Putri',
      category: 'Perawatan Luka Persalinan',
      avatar_initials: 'SP',
      avatar_bg: 'var(--pink-400)'
    },
    {
      stars: 5,
      content: 'Saya mengambil paket pijat untuk saya dan bayi saya. Hasilnya luar biasa! Bayi saya lebih tenang dan saya juga merasa lebih segar setelah masa nifas. Layanan ke rumah sangat memudahkan karena tidak perlu repot keluar rumah dengan bayi. Highly recommended!',
      author_name: 'Ibu Maya Handayani',
      category: 'Pijat Bayi & Ibu Nifas',
      avatar_initials: 'MH',
      avatar_bg: 'var(--mint)'
    },
    {
      stars: 5,
      content: 'Setelah laktasi massage, ASI saya terasa lebih lancar dan tidak terlalu tegang. Terapisnya sabar dan menjelaskan dengan baik. Sangat merekomendasikan layanan ini untuk ibu menyusui!',
      author_name: 'Ibu Alda Lestari',
      category: 'Laktasi Massage',
      avatar_initials: 'AL',
      avatar_bg: 'var(--peach)'
    }
  ];

  // Screenshot items (13 files)
  const screenshots = Array.from({ length: 13 }, (_, i) => img(`/Image/Testimoni Screenshoot/${i + 16}.webp`));

  // Fetch Testimonials
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setDbTestimonials(data);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  // Update visible items on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(1);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Run scroll animations
  useScrollAnimation([dbTestimonials]);

  // Autoplay slider
  const maxIndex = screenshots.length - visibleItems;

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [maxIndex]);

  const goToSlide = (index) => {
    stopAutoplay();
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    setCurrentIndex(index);
    startAutoplay();
  };

  const handleDragStart = (xPos) => {
    startX.current = xPos;
    isDragging.current = true;
    stopAutoplay();
  };

  const handleDragEnd = (endX) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = startX.current - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Next
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      } else {
        // Prev
        setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
      }
    }
    startAutoplay();
  };

  const activeTestimonials = dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;
  const gap = 20; // Matches style.css gap

  // Calculate slide displacement
  const getTransformStyle = () => {
    if (!trackRef.current) return {};
    const trackWidth = trackRef.current.parentElement.offsetWidth;
    const itemWidth = (trackWidth - (visibleItems - 1) * gap) / visibleItems;
    const moveX = currentIndex * (itemWidth + gap);
    return {
      transform: `translateX(-${moveX}px)`,
      transition: 'transform 0.5s ease-in-out'
    };
  };

  const numDots = screenshots.length - visibleItems + 1;

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Cerita Bahagia<br className="br-mobile" /> dari Para Ibu</h1>
          <p>Dengarkan langsung<br className="br-mobile" /> pengalaman para ibu yang telah<br className="br-mobile" /> mempercayakan perawatan<br className="br-mobile" /> kepada Intan Miracle</p>
        </div>
      </section>

      {/* Testimonials Large Grid */}
      <section className="section">
        <div className="container" id="testimonialsPageContainer" style={{ maxWidth: '900px' }}>
          {activeTestimonials.map((tst, i) => (
            <div className="testimonial-large animate-on-scroll" key={i}>
              <div className="quote-mark">"</div>
              <div className="testi-header">
                <div className="testi-avatar" style={{ background: tst.avatar_bg || 'var(--pink-400)' }}>
                  {tst.avatar_initials || 'IB'}
                </div>
                <div className="testi-meta">
                  <h4>{tst.author_name}</h4>
                  <span>{tst.category}</span>
                  <div className="stars">{'★'.repeat(tst.stars || 5)}</div>
                </div>
              </div>
              <blockquote>{tst.content}</blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshot Swiper */}
      <section className="screenshot-slider-section">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2 className="text-gradient">Momen Bahagia<br className="br-mobile" /> Bersama Ibu & Bayi</h2>
            <p>Kumpulan kesan positif dari percakapan hangat bersama para pelanggan kami</p>
          </div>

          <div className="screenshot-container animate-on-scroll">
            <div 
              className="screenshot-track" 
              ref={trackRef}
              style={getTransformStyle()}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseUp={(e) => handleDragEnd(e.clientX)}
              onMouseLeave={() => { if (isDragging.current) { isDragging.current = false; startAutoplay(); } }}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
            >
              {screenshots.map((src, i) => (
                <div className="screenshot-item" key={i}>
                  <img src={src} alt={`Testimoni chat ${i + 1}`} draggable="false" />
                </div>
              ))}
            </div>

            <div className="slider-dots">
              {Array.from({ length: numDots }).map((_, i) => (
                <div 
                  key={i}
                  className={`dot ${currentIndex === i ? 'active' : ''}`}
                  onClick={() => goToSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ingin Merasakan<br className="br-mobile" /> Pengalaman yang Sama?</h2>
          <p>Bergabunglah dengan ratusan ibu yang telah mempercayakan perawatan kepada kami.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Reservasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
