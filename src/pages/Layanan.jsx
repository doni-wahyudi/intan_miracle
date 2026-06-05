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
  
  const fallbackLactationServices = [
    {
      icon: '👩‍🍼',
      name: 'Konsultasi Menyusui',
      description: 'Meliputi evaluasi menyusui, pelekatan, dan teknik menyusui yang benar.',
      price: 245000,
      price_clinic: 450000
    },
    {
      icon: '🍼',
      name: 'Pijat Laktasi',
      description: 'Pemijatan payudara untuk membantu melancarkan ASI, disertai konsultasi menyusui.',
      price: 150000
    },
    {
      icon: '🍱',
      name: 'Paket Lengkap',
      description: 'Konsultasi menyusui + pijat laktasi + perah ASI.',
      price: 600000
    },
    {
      icon: '🏠',
      name: 'Paket Lengkap (Homecare)',
      description: 'Layanan lengkap yang dilakukan langsung di rumah: konsultasi, pijat laktasi, dan perah ASI.',
      price: 650000
    }
  ];

  const formatPrice = (price) => {
    return `Rp${parseInt(price, 10).toLocaleString('id-ID')}`;
  };

  // Determine active lists
  const babyServicesAll = dbServices.filter(s => s.category === 'baby');
  
  // Only include baby services without packages in age-based services list
  const babyServices = babyServicesAll.filter(srv => {
    try {
      const pkgs = Array.isArray(srv.packages)
        ? srv.packages
        : (typeof srv.packages === 'string' && srv.packages.trim() ? JSON.parse(srv.packages) : []);
      return pkgs.length === 0;
    } catch (_) { return true; }
  });

  // Baby services that have packages
  const babyServicesPackages = babyServicesAll.filter(srv => {
    try {
      const pkgs = Array.isArray(srv.packages)
        ? srv.packages
        : (typeof srv.packages === 'string' && srv.packages.trim() ? JSON.parse(srv.packages) : []);
      return pkgs.length > 0;
    } catch (_) { return false; }
  });

  const momServices = dbServices.filter(s => s.category === 'mom');
  const lactationServices = dbServices.filter(s => s.category === 'lactation');
  const newbornServices = dbServices.filter(s => s.category === 'newborn');

  const finalBabyServices = babyServices.length > 0 ? babyServices : fallbackBabyServices;
  const finalMomServices = momServices.length > 0 ? momServices : fallbackMomServices;
  const finalLactationServices = lactationServices.length > 0 ? lactationServices : fallbackLactationServices;

  // Newborn Care fallback
  const fallbackNewbornServices = [
    {
      icon: '👶',
      name: 'Perawatan Bayi Baru Lahir (Homecare)',
      description: 'Layanan kunjungan ke rumah untuk perawatan bayi baru lahir, meliputi: Perawatan tali pusat, Memandikan bayi, Baby massage, Jemur bayi newborn, Potong kuku bayi, Cukur bayi.',
      packages: [
        { label: 'Paket 3 Hari', price: 350000 },
        { label: 'Paket 5 Hari', price: 605000 },
        { label: 'Paket 7 Hari', price: 825000 },
        { label: 'Paket 10 Hari', price: 1145000 },
        { label: 'Paket 15 Hari', price: 1655000 },
        { label: 'Paket 20 Hari', price: 2260000 },
        { label: 'Paket 30 Hari', price: 3255000 },
      ]
    }
  ];

  const finalNewbornServices = newbornServices.length > 0 ? newbornServices : fallbackNewbornServices;

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
                  ) : (parseFloat(srv.price_age_0_1) > 0 || parseFloat(srv.price_age_1_2) > 0 || parseFloat(srv.price_age_2_plus) > 0) ? (
                    <div className="price-row" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                      {/* Homecare Prices */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pink-700)', minWidth: '90px' }}>🏠 Homecare:</span>
                        <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--pink-50)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">0-1th:</span> {formatPrice(srv.price_age_0_1)}</div>
                        <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--pink-50)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">1-2th:</span> {formatPrice(srv.price_age_1_2)}</div>
                        <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'var(--pink-50)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">&gt;2th:</span> {formatPrice(srv.price_age_2_plus)}</div>
                      </div>
                      
                      {/* Clinic Care Prices */}
                      {parseFloat(srv.price_clinic_age_0_1) > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--pink-700)', minWidth: '90px' }}>🏥 Clinic Care:</span>
                          <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(236, 72, 153, 0.08)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">0-1th:</span> {formatPrice(srv.price_clinic_age_0_1)}</div>
                          <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(236, 72, 153, 0.08)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">1-2th:</span> {formatPrice(srv.price_clinic_age_1_2)}</div>
                          <div className="simple-price" style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(236, 72, 153, 0.08)', color: 'var(--pink-700)', borderRadius: 'var(--radius-full)' }}><span className="price-label">&gt;2th:</span> {formatPrice(srv.price_clinic_age_2_plus)}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="price-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: srv.customList ? '20px' : '12px' }}>
                      <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--pink-50)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                        🏠 Homecare: {formatPrice(srv.price)}
                      </div>
                      {srv.price_clinic > 0 && (
                        <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.08)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                          🏥 Clinic: {formatPrice(srv.price_clinic)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Render any baby services from DB that have packages (homecare-grid style) */}
            {babyServicesPackages.map((srv, i) => {
              let pkgs = [];
              try {
                pkgs = Array.isArray(srv.packages) ? srv.packages : JSON.parse(srv.packages);
              } catch (_) {}
              return (
                <div className="homecare-container animate-on-scroll" key={`pkg-${i}`}>
                  <div className="homecare-header">
                    <div className="service-detail-icon">{srv.icon || '👶'}</div>
                    <div className="homecare-title-info">
                      <h3>{srv.name}</h3>
                      <p>{srv.description}</p>
                    </div>
                  </div>
                  <div className="homecare-grid">
                    {pkgs.map((pkg, pi) => (
                      <div className="homecare-item" key={pi}>
                        <div className="homecare-icon">🏠</div>
                        <div className="homecare-info">
                          <span className="homecare-days">{pkg.label}</span>
                          <span className="homecare-price">{formatPrice(pkg.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Perawatan Bayi Baru Lahir */}
      <section className="section section-alt">
        <div className="container">
          <div className="service-category-header animate-on-scroll">
            <h2>👶 Perawatan Bayi Baru Lahir</h2>
            <p>Layanan perawatan dan pendampingan terbaik untuk buah hati yang baru lahir</p>
          </div>
          <div id="newbornServicesContainer" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {finalNewbornServices.map((srv, i) => {
              let pkgs = [];
              try {
                pkgs = Array.isArray(srv.packages) ? srv.packages : (typeof srv.packages === 'string' && srv.packages.trim() ? JSON.parse(srv.packages) : []);
              } catch (_) {}

              return (
                <div className="homecare-container animate-on-scroll" key={i}>
                  <div className="homecare-header">
                    <div className="service-detail-icon">{srv.icon || '👶'}</div>
                    <div className="homecare-title-info">
                      <h3>{srv.name}</h3>
                      <p>{srv.description}</p>
                    </div>
                  </div>
                  {pkgs.length > 0 ? (
                    <div className="homecare-grid" style={{ padding: '0 24px 24px' }}>
                      {pkgs.map((pkg, pi) => (
                        <div className="homecare-item" key={pi}>
                          <div className="homecare-icon">🏠</div>
                          <div className="homecare-info">
                            <span className="homecare-days">{pkg.label}</span>
                            <span className="homecare-price">{formatPrice(pkg.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="price-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px', padding: '0 24px 24px' }}>
                      <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--pink-50)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                        🏠 Homecare: {formatPrice(srv.price)}
                      </div>
                      {srv.price_clinic > 0 && (
                        <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.08)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                          🏥 Clinic: {formatPrice(srv.price_clinic)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pelayanan Ibu */}
      <section className="section">
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
                  <div className="price-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--pink-50)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                      🏠 Homecare: {formatPrice(srv.price)}
                    </div>
                    {srv.price_clinic > 0 && (
                      <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.08)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                        🏥 Clinic: {formatPrice(srv.price_clinic)}
                      </div>
                    )}
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
          <div className="grid-2" id="lactationServicesContainer">
            {finalLactationServices.map((srv, i) => (
              <div className="service-detail animate-on-scroll" key={i}>
                <div className="service-detail-icon">{srv.icon || '🤱'}</div>
                <div className="service-info">
                  <h3>{srv.name}</h3>
                  <p>{srv.description}</p>
                  <div className="price-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                    <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--pink-50)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                      🏠 Homecare: {formatPrice(srv.price)}
                    </div>
                    {srv.price_clinic > 0 && (
                      <div className="simple-price" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(236, 72, 153, 0.08)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', color: 'var(--pink-700)', fontWeight: 600 }}>
                        🏥 Clinic: {formatPrice(srv.price_clinic)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
