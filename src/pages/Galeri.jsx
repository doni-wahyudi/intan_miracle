import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Galeri() {
  const [dbGallery, setDbGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Gallery Items
  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setDbGallery(data);
        }
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Run scroll animations
  useScrollAnimation([dbGallery]);

  // Static Fallback Images (1-16)
  const fallbackGallery = Array.from({ length: 16 }, (_, i) => ({
    image_url: `/Image/Galeri Intan Miracle Est 2019/${i + 1}.webp`,
    caption: `Kegiatan Intan Miracle ${i + 1}`
  }));

  const activeGallery = dbGallery.length > 0 ? dbGallery : fallbackGallery;

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Galeri Kegiatan</h1>
          <p>Kumpulan momen berharga dalam mendampingi ibu dan buah hati tercinta</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container">
          <div className="gallery-grid" id="galleryGridContainer">
            {activeGallery.map((item, i) => (
              <div className="gallery-item animate-on-scroll" key={i}>
                <img src={item.image_url} alt={item.caption || `Foto Galeri ${i + 1}`} />
                <div className="gallery-overlay"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-single-line">Dapatkan Perawatan Terbaik Si Kecil</h2>
          <p className="cta-single-line">Jadwalkan kunjungan terapis kami ke rumah Anda.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Reservasi Sekarang</Link>
        </div>
      </section>
    </div>
  );
}
