import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

const cleanTitle = (title) => {
  if (!title) return '';
  return title.replace(/^#+\s+/, '');
};

const stripMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/`/g, '');
};

export default function Artikel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fetch Articles
  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          setArticles(data);
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Run scroll animations
  useScrollAnimation([articles]);

  const handleDownloadPDF = () => {
    const article = document.querySelector('.featured-article');
    if (!article || typeof window.html2pdf === 'undefined') {
      alert('Sistem ekspor PDF sedang bersiap, silakan coba beberapa saat lagi.');
      return;
    }

    setPdfLoading(true);
    const currentScrollY = window.scrollY;

    // Temporarily scroll to top to prevent html2canvas blank page scrolling bug!
    window.scrollTo(0, 0);

    // Hide PDF button
    const btn = document.querySelector('.btn-download-pdf');
    if (btn) btn.style.display = 'none';

    // Inject Logo Header
    const logoHeader = document.createElement('div');
    logoHeader.id = 'pdf-logo-header';
    logoHeader.style.cssText = 'display: flex; align-items: center; padding: 20px 28px; border-bottom: 2px solid #e8a0b4; background: white;';
    logoHeader.innerHTML = `
      <img src="${img('/Image/LOGO INTAN MIRACLE colour italic.webp')}" style="height: 45px; margin-right: 14px;">
      <div>
        <div style="font-size: 0.78rem; color: #999; margin-top: 2px;">www.intanmiracle.com</div>
      </div>
    `;
    article.insertBefore(logoHeader, article.firstChild);

    // Inject Logo Overlay
    const articleImageDiv = article.querySelector('.featured-article-image');
    if (articleImageDiv) {
      const logoOverlay = document.createElement('img');
      logoOverlay.id = 'pdf-logo-overlay';
      logoOverlay.src = img('/Image/LOGO INTAN MIRACLE colour italic.webp');
      logoOverlay.style.cssText = 'position: absolute; top: 12px; left: 12px; height: 40px; background: rgba(255,255,255,0.85); padding: 6px 10px; border-radius: 8px; z-index: 5;';
      articleImageDiv.style.position = 'relative';
      articleImageDiv.appendChild(logoOverlay);
    }

    // Inject Footer
    const pdfFooter = document.createElement('div');
    pdfFooter.id = 'pdf-footer';
    pdfFooter.style.cssText = 'padding: 16px 28px; border-top: 2px solid #e8a0b4; text-align: center; color: #999; font-size: 0.8rem; background: white;';
    pdfFooter.innerHTML = '© 2026 Intan Miracle Care — Layanan perawatan ibu dan bayi profesional';
    article.appendChild(pdfFooter);

    const fileName = 'perawatan-ibu-dan-bayi-sentuhan-cinta.pdf';

    const opt = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    setTimeout(() => {
      window.html2pdf().set(opt).from(article).save().then(() => {
        cleanup();
      }).catch((err) => {
        console.error('PDF Error:', err);
        cleanup();
        alert('Gagal membuat PDF. Silakan coba lagi.');
      });
    }, 400);

    function cleanup() {
      const header = document.getElementById('pdf-logo-header');
      if (header) header.remove();
      const overlay = document.getElementById('pdf-logo-overlay');
      if (overlay) overlay.remove();
      const footer = document.getElementById('pdf-footer');
      if (footer) footer.remove();

      if (btn) btn.style.display = '';
      setPdfLoading(false);

      // Restore original scroll position
      window.scrollTo(0, currentScrollY);
    }
  };

  // Static Fallback Articles
  const fallbackArticles = [
    {
      slug: 'manfaat-pijat-bayi',
      category: 'Perawatan Bayi',
      title: 'Manfaat Pijat Bayi untuk Tumbuh Kembang Si Kecil',
      summary: 'Pijat bayi bukan sekadar sentuhan biasa. Berbagai penelitian menunjukkan bahwa pijat bayi yang dilakukan secara rutin dapat membantu meningkatkan kualitas tidur, melancarkan pencernaan, dan memperkuat ikatan emosional.',
      colorClass: 'pink-bg',
      icon: '👶'
    },
    {
      slug: 'cara-merawat-bayi-baru-lahir',
      category: 'Tips Ibu Baru',
      title: 'Cara Merawat Bayi Baru Lahir: Panduan untuk Ibu Pertama Kali',
      summary: 'Merawat bayi baru lahir bisa terasa menantang, terutama bagi ibu yang baru pertama kali. Namun dengan pengetahuan yang tepat, Anda bisa merawat si kecil dengan percaya diri dan penuh kasih sayang.',
      colorClass: 'mint-bg',
      icon: '🤱'
    },
    {
      slug: 'tips-asi-lancar',
      category: 'Laktasi',
      title: 'Tips ASI Lancar: Panduan Lengkap untuk Ibu Menyusui',
      summary: 'ASI adalah nutrisi terbaik untuk bayi. Namun, tidak sedikit ibu yang mengalami kendala dalam menyusui. Berikut tips agar ASI tetap lancar dan produksi ASI optimal.',
      colorClass: 'peach-bg',
      icon: '🍼'
    },
    {
      slug: 'perawatan-ibu-nifas-di-rumah',
      category: 'Perawatan Ibu',
      title: 'Perawatan Ibu Nifas di Rumah: Yang Perlu Anda Ketahui',
      summary: 'Masa nifas adalah periode pemulihan penting bagi ibu setelah melahirkan. Perawatan yang tepat di masa ini sangat berpengaruh pada kesehatan jangka panjang ibu.',
      colorClass: 'lavender-bg',
      icon: '💆‍♀️'
    },
    {
      slug: 'tanda-bahaya-kehamilan',
      category: 'Kehamilan',
      title: 'Kenali Tanda Bahaya Kehamilan agar Ibu dan Bayi Tetap Aman',
      summary: 'Kehamilan adalah momen paling indah dalam hidup seorang ibu — namun tahukah Anda bahwa sekitar 15% kehamilan dapat berkembang menjadi komplikasi serius? Mengenali tanda bahaya sejak dini bisa menyelamatkan nyawa.',
      image_url: img('/Image/tanda-bahaya-kehamilan.webp')
    }
  ];

  const dbFeaturedArticle = articles.find(art => art.is_featured) || articles[0];
  const gridArticles = articles.length > 0
    ? articles.filter(art => art.id !== dbFeaturedArticle.id)
    : fallbackArticles;

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Ruang Edukasi untuk Ibu</h1>
          <p>Kami berbagi tips, edukasi, dan informasi seputar perawatan ibu dan bayi agar Anda lebih percaya diri dalam merawat buah hati</p>
        </div>
      </section>

      {/* Featured Article Section */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {articles.length > 0 ? (
            // Dynamic Featured Article from Database
            <div className="featured-article animate-on-scroll">
              <div className="featured-article-image">
                <img src={dbFeaturedArticle.image_url} alt={cleanTitle(dbFeaturedArticle.title)} />
              </div>
              <div className="featured-article-body" style={{ position: 'relative' }}>
                <button 
                  onClick={handleDownloadPDF} 
                  className="btn-download-pdf" 
                  title="Download PDF"
                  disabled={pdfLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{pdfLoading ? '...' : 'PDF'}</span>
                </button>
                <span className="article-tag" style={{ background: 'var(--gradient-cta)', color: 'white' }}>⭐ Artikel Utama</span>
                <h2 style={{ fontSize: '1.8rem', margin: '16px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {cleanTitle(dbFeaturedArticle.title)}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Ditulis oleh: <strong>{dbFeaturedArticle.author || 'Terapis Intan Miracle'}</strong>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '24px' }}>
                  {stripMarkdown(dbFeaturedArticle.summary)}
                </p>
                <Link to={`/artikel/${dbFeaturedArticle.slug}`} className="btn btn-primary" style={{ display: 'inline-flex', padding: '10px 24px', textDecoration: 'none', fontWeight: 600 }}>
                  Baca Selengkapnya →
                </Link>
              </div>
            </div>
          ) : (
            // Original Hardcoded Fallback Featured Article
            <div className="featured-article animate-on-scroll">
              <div className="featured-article-image">
                <img src={img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp')} alt="Pijat bayi - sentuhan lembut ibu" />
              </div>
              <div className="featured-article-body" style={{ position: 'relative' }}>
                <button 
                  onClick={handleDownloadPDF} 
                  className="btn-download-pdf" 
                  title="Download PDF"
                  disabled={pdfLoading}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{pdfLoading ? '...' : 'PDF'}</span>
                </button>
                <span className="article-tag" style={{ background: 'var(--gradient-cta)', color: 'white' }}>✨ Artikel Utama</span>
                <h2 style={{ fontSize: '1.8rem', margin: '16px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  Perawatan Ibu dan Bayi dengan Sentuhan Penuh Cinta: Manfaat Fisik, Emosional, dan Perkembangan
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Perawatan ibu dan bayi bukan sekadar layanan relaksasi — ini adalah bagian penting dari perjalanan kesehatan dan ikatan emosional antara ibu dan buah hati. Sentuhan lembut yang dilakukan melalui pijat dan terapi perawatan dapat membawa manfaat yang telah didukung by riset kesehatan dan praktik klinis.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>💗 Mengapa Sentuhan Itu Penting?</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Sentuhan adalah salah satu bentuk komunikasi paling awal antara ibu dan bayi. Melalui pijat bayi, ibu tidak hanya menyentuh kulit tubuh si kecil, tetapi juga membangun hubungan emosional dan kenyamanan yang mendalam. Sebuah studi menunjukkan bahwa pijat bayi yang dilakukan secara teratur dapat meningkatkan keterikatan emosional antara ibu dan bayi serta membantu menyesuaikan emosi dan interaksi antara mereka setelah melahirkan.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>👶 Manfaat Pijat dan Perawatan untuk Bayi</h3>

                <div style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid var(--pink-400)' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>1. Mendukung Perkembangan Fisik</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Pijat bayi dapat membantu sirkulasi darah dan membantu pemulihan saluran pencernaan, yang berkontribusi dalam pertumbuhan badan bayi serta merangsang sistem sensorik tubuhnya.
                  </p>
                </div>
                <div style={{ background: 'var(--mint)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #86efac' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>2. Perbaikan Pola Tidur dan Relaksasi</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Studi kesehatan menunjukkan bahwa pijat dapat membantu bayi merasa lebih tenang dan rileks, memungkinkan mereka tidur lebih nyenyak dan nyaman. Tidur yang cukup merupakan bagian krusial dari proses pertumbuhan dan perkembangan otak bayi.
                  </p>
                </div>
                <div style={{ background: 'var(--lavender)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px', borderLeft: '4px solid #c4b5fd' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>3. Mengurangi Stres dan Cegah Gejala Rewel</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Pijat dapat menurunkan hormon stres pada bayi dan membantu meredakan ketegangan otot, yang sering dikaitkan dengan kolik atau gumpalan gas pada saluran pencernaan bayi.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>💆‍♀️ Manfaat untuk Ibu Pasca Melahirkan</h3>

                <div style={{ background: 'var(--peach)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #fdba74' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>1. Dukung Pemulihan Fisik</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Perawatan setelah melahirkan seperti pijat ibu nifas dan terapi relaksasi dapat membantu mengurangi ketegangan tubuh, memperlancar aliran darah, and membantu tubuh kembali pulih setelah proses persalinan.
                  </p>
                </div>
                <div style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid var(--pink-400)' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>2. Regulasi Hormon dan Mood</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Sentuhan lembut dan teknik pijat yang tepat tidak hanya menyentuh fisik, tetapi juga dapat membantu menstabilkan hormon setelah melahirkan, yang membantu mengurangi kecemasan dan tekanan emosional yang sering terjadi di masa nifas.
                  </p>
                </div>
                <div style={{ background: '#fef3c7', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px', borderLeft: '4px solid #fbbf24' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>3. Meningkatkan Produksi ASI</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Interaksi sentuhan melalui pijat yang lembut dapat membantu merangsang hormon untuk mendukung produksi ASI, sesuatu yang telah dicatat dalam riset tentang teknik pijat dan laktasi.
                  </p>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>🤝 Peran Sentuhan dalam Ikatan Ibu-Bayi</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Lebih dari sekadar manfaat fisik, sentuhan dan pijat bayi memainkan peran besar dalam ikatan emosional antara ibu dan anak. Penelitian menunjukkan bahwa bayi yang menerima sentuhan lembut secara rutin menunjukkan tingkat keterikatan emosional yang lebih kuat dan perilaku positif ketika tumbuh besar, serta juga membantu ibu merasa lebih percaya diri dalam merawat buah hati mereka.
                </p>

                <div style={{ background: 'var(--gradient-cta)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginTop: '28px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '10px' }}>💝 Kesimpulan: Sentuhan Adalah Bahasa Kasih Sayang</h3>
                  <p style={{ color: 'rgba(255,255,255,0.92)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Perawatan ibu dan bayi melalui pijat dan terapi bukanlah sekadar layanan estetika atau relaksasi. Ini adalah praktek yang memperkuat ikatan emosional, mendukung perkembangan biologis bayi, dan membantu pemulihan fisik serta kesejahteraan ibu setelah melahirkan. Dengan pendekatan yang tepat, sentuhan lembut bukan hanya bermanfaat — tetapi bisa menjadi fondasi awal bagi kesehatan seumur hidup ibu dan bayi.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid List of Other Articles */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header animate-on-scroll">
            <h2>Artikel Lainnya</h2>
            <p>Tips dan edukasi seputar perawatan ibu dan bayi</p>
          </div>
          <div className="grid-2" id="articlesPageContainer" style={{ gap: '36px' }}>
            {gridArticles.map((art, i) => {
              const bgStyle = art.image_url 
                ? { background: `url('${art.image_url}') center/cover no-repeat`, fontSize: 0, minHeight: '200px' }
                : null;
              const colorClass = art.colorClass || 'pink-bg';
              const icon = art.icon || '📰';

              return (
                <div className="article-card animate-on-scroll" key={i}>
                  {bgStyle ? (
                    <div className="article-thumb" style={bgStyle}></div>
                  ) : (
                    <div className={`article-thumb ${colorClass}`}>{icon}</div>
                  )}
                  <div className="article-body">
                    <span className="article-tag">{art.category}</span>
                    <h3>{cleanTitle(art.title)}</h3>
                    <p className="article-excerpt">{stripMarkdown(art.summary)}</p>
                    <Link to={`/artikel/${art.slug}`} className="read-more" style={{ textDecoration: 'none' }}>
                      Baca selengkapnya →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Butuh Konsultasi Lebih Lanjut?</h2>
          <p>Tim kami siap membantu menjawab pertanyaan seputar perawatan ibu dan bayi.</p>
          <Link to="/reservasi" className="btn btn-lg">👉 Hubungi Kami</Link>
        </div>
      </section>
    </div>
  );
}
