import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Layanan() {
  const [dbServices, setDbServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Services from Supabase
  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data && data.length > 0) {
          setDbServices(data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Run scroll animations
  useScrollAnimation([dbServices]);

  // Static Fallback Baby Services (Only shown if dbServices is empty)
  const fallbackBabyServices = [
    {
      icon: '👶',
      name: 'Baby Massage',
      description: 'Pijatan lembut untuk membantu bayi lebih rileks, tidur lebih nyenyak, dan mendukung pertumbuhan fisik.',
      customPrice: (
        <div className="price-row">
          <div className="simple-price"><span className="price-label">Usia 0-1th:</span> Rp100.000</div>
          <div className="simple-price"><span className="price-label">Usia 1-2th:</span> Rp125.000</div>
          <div className="simple-price"><span className="price-label">Usia &gt;2th:</span> Rp150.000</div>
        </div>
      )
    },
    {
      icon: '🤸',
      name: 'Baby Gym',
      description: 'Latihan gerak ringan yang membantu merangsang motorik dan kekuatan otot bayi.',
      price: 50000
    },
    {
      icon: '🏊',
      name: 'Baby Swim',
      description: 'Aktivitas renang khusus bayi yang menyenangkan sekaligus membantu melatih pernapasan dan koordinasi tubuh.',
      price: 70000
    },
    {
      icon: '✨',
      name: 'Baby Spa (Massage + Gym + Swim)',
      description: 'Paket lengkap perawatan bayi untuk relaksasi dan stimulasi tumbuh kembang.',
      price: 150000
    },
    {
      icon: '🩹',
      name: 'Baby Therapy Massage',
      description: 'Pijatan khusus untuk membantu mengatasi keluhan umum pada bayi seperti Diare, Kolik, Konstipasi, Batuk Pilek, Nafsu Makan, dan Bayi Prematur.',
      price: 80000,
      customList: (
        <div className="therapy-list">
          <span className="therapy-item">Diare</span>
          <span className="therapy-item">Kolik / Kembung</span>
          <span className="therapy-item">Konstipasi</span>
          <span className="therapy-item">Batuk Pilek</span>
          <span className="therapy-item">Nafsu Makan</span>
          <span className="therapy-item">Bayi Prematur</span>
        </div>
      )
    },
    {
      icon: '✂️',
      name: 'Cukur Bayi',
      description: 'Dilakukan dengan alat steril dan teknik yang aman untuk bayi.',
      price: 80000
    },
    {
      icon: '👂',
      name: 'Tindik Bayi',
      description: 'Proses tindik yang higienis, cepat, and minim trauma bagi bayi.',
      price: 80000
    }
  ];

  // Static Fallback Mom Services (Only shown if dbServices is empty)
  const fallbackMomServices = [
    {
      icon: '🤰',
      name: 'Pijat Ibu Hamil',
      description: 'Membantu mengurangi pegal, memperlancar sirkulasi darah, dan membuat ibu lebih rileks selama kehamilan.',
      price: 200000
    },
    {
      icon: '💆‍♀️',
      name: 'Pijat Ibu Nifas',
      description: 'Mendukung pemulihan tubuh setelah melahirkan serta membantu ibu lebih nyaman saat masa nifas.',
      price: 200000
    },
    {
      icon: '🎀',
      name: 'Bengkung',
      description: 'Perawatan tradisional untuk membantu mengencangkan perut dan postur tubuh setelah melahirkan.',
      price: 100000
    }
  ];

  const formatPrice = (price) => {
    return `Rp${parseInt(price, 10).toLocaleString('id-ID')}`;
  };

  // Determine active lists
  const babyServices = dbServices.filter(s => s.category === 'baby');
  const momServices = dbServices.filter(s => s.category === 'mom');

  const finalBabyServices = babyServices.length > 0 ? babyServices : fallbackBabyServices;
  const finalMomServices = momServices.length > 0 ? momServices : fallbackMomServices;

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Layanan Kami</h1>
          <p>Perawatan lengkap untuk kesehatan dan kenyamanan ibu serta tumbuh kembang bayi</p>
        </div>
      </section>

      {/* Pelayanan Bayi */}
      <section className="section">
        <div className="container">
          <div className="service-category-header animate-on-scroll">
            <h2>👶 Pelayanan Bayi</h2>
            <p>Stimulasi dan relaksasi terbaik untuk tumbuh<br className="br-mobile" /> kembang buah hati</p>
          </div>
          <div id="babyServicesContainer">
            {finalBabyServices.map((srv, i) => (
              <div className="service-detail animate-on-scroll" key={i}>
                <div className="service-detail-icon">{srv.icon || '👶'}</div>
                <div className="service-info">
                  <h3>{srv.name}</h3>
                  <p>{srv.description}</p>
                  {srv.customList}
                  {srv.customPrice ? (
                    srv.customPrice
                  ) : (
                    <div className="price-row" style={srv.customList ? { marginTop: '20px' } : {}}>
                      <div className="simple-price">
                        {srv.duration ? <span className="price-label">{srv.duration}:</span> : ''} {formatPrice(srv.price)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Perawatan Bayi Baru Lahir (Homecare) - Statically Hardcoded to match HTML */}
            <div className="homecare-container animate-on-scroll">
              <div className="homecare-header">
                <div className="service-detail-icon">👶</div>
                <div className="homecare-title-info">
                  <h3>Perawatan Bayi Baru Lahir (Homecare)</h3>
                  <p>Layanan kunjungan ke rumah untuk perawatan bayi baru lahir, meliputi: Perawatan tali pusat, Memandikan bayi, Baby massage, Jemur bayi newborn, Potong kuku bayi, Cukur bayi.</p>
                </div>
              </div>

              <div className="homecare-grid">
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 3 Hari</span>
                    <span className="homecare-price">Rp350.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 5 Hari</span>
                    <span className="homecare-price">Rp605.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 7 Hari</span>
                    <span className="homecare-price">Rp825.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 10 Hari</span>
                    <span className="homecare-price">Rp1.145.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 15 Hari</span>
                    <span className="homecare-price">Rp1.655.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 20 Hari</span>
                    <span className="homecare-price">Rp2.260.000</span>
                  </div>
                </div>
                <div className="homecare-item">
                  <div className="homecare-icon">🏠</div>
                  <div className="homecare-info">
                    <span className="homecare-days">Paket 30 Hari</span>
                    <span className="homecare-price">Rp3.255.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pelayanan Ibu */}
      <section className="section section-alt">
        <div className="container">
          <div className="service-category-header animate-on-scroll">
            <h2>🤍 Pelayanan Ibu <br className="br-mobile" /> (Mom Care)</h2>
            <p>Pemulihan dan relaksasi intensif untuk ibu hebat</p>
          </div>
          <div className="grid-2" id="momServicesContainer">
            {finalMomServices.map((srv, i) => (
              <div className="service-detail animate-on-scroll" key={i}>
                <div className="service-detail-icon">{srv.icon || '🤍'}</div>
                <div className="service-info">
                  <h3>{srv.name}</h3>
                  <p>{srv.description}</p>
                  <div className="price-row">
                    <div className="simple-price">
                      {srv.duration ? <span className="price-label">{srv.duration}:</span> : ''} {formatPrice(srv.price)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Konselor Laktasi */}
      <section className="section">
        <div className="container">
          <div className="service-category-header animate-on-scroll">
            <h2>🤱 Konselor Laktasi</h2>
            <p>Dukungan penuh untuk perjalanan menyusui yang lancar</p>
          </div>

          <div className="service-detail animate-on-scroll">
            <div className="service-detail-icon">👩‍🍼</div>
            <div className="service-info">
              <h3>Konsultasi Menyusui</h3>
              <p>Meliputi evaluasi menyusui, pelekatan, dan teknik menyusui yang benar.</p>
              <div className="price-row">
                <div className="simple-price">Rp245k - Rp450k</div>
              </div>
            </div>
          </div>

          <div className="service-detail animate-on-scroll">
            <div className="service-detail-icon">🍼</div>
            <div className="service-info">
              <h3>Pijat Laktasi</h3>
              <p>Pemijatan payudara untuk membantu melancarkan ASI, disertai konsultasi menyusui.</p>
              <div className="price-row">
                <div className="simple-price">Rp150.000</div>
              </div>
            </div>
          </div>

          <div className="service-detail animate-on-scroll">
            <div className="service-detail-icon">🍱</div>
            <div className="service-info">
              <h3>Paket Lengkap</h3>
              <p>Konsultasi menyusui + pijat laktasi + perah ASI.</p>
              <div className="price-row">
                <div className="simple-price">Rp600.000</div>
              </div>
            </div>
          </div>

          <div className="service-detail animate-on-scroll">
            <div className="service-detail-icon">🏠</div>
            <div className="service-info">
              <h3>Paket Lengkap (Homecare)</h3>
              <p>Layanan lengkap yang dilakukan langsung di rumah: konsultasi, pijat laktasi, dan perah ASI.</p>
              <div className="price-row">
                <div className="simple-price">Rp650.000</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Butuh Perawatan untuk Ibu atau Bayi?</h2>
          <p>Hubungi kami untuk konsultasi gratis <br className="br-mobile" /> dan reservasi layanan.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Reservasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
