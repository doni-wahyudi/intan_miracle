import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

export default function ArtikelDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fetch from Supabase
  useEffect(() => {
    async function fetchArticleDetails() {
      try {
        const { data, error } = await supabase
          .from('articles')
          .eq('slug', slug)
          .single();
        if (!error && data) {
          setArticle(data);
        }
      } catch (err) {
        console.error('Error fetching article detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticleDetails();
  }, [slug]);

  // Run scroll animations
  useScrollAnimation([slug, article]);

  const handleDownloadPDF = () => {
    const target = document.querySelector('.featured-article');
    if (!target || typeof window.html2pdf === 'undefined') {
      alert('Sistem ekspor PDF sedang bersiap, silakan coba beberapa saat lagi.');
      return;
    }

    setPdfLoading(true);

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
    target.insertBefore(logoHeader, target.firstChild);

    // Inject Logo Overlay
    const imgDiv = target.querySelector('.featured-article-image');
    let logoOverlay = null;
    if (imgDiv) {
      logoOverlay = document.createElement('img');
      logoOverlay.id = 'pdf-logo-overlay';
      logoOverlay.src = img('/Image/LOGO INTAN MIRACLE colour italic.webp');
      logoOverlay.style.cssText = 'position: absolute; top: 12px; left: 12px; height: 40px; background: rgba(255,255,255,0.85); padding: 6px 10px; border-radius: 8px; z-index: 5;';
      imgDiv.style.position = 'relative';
      imgDiv.appendChild(logoOverlay);
    }

    // Inject Footer
    const pdfFooter = document.createElement('div');
    pdfFooter.id = 'pdf-footer';
    pdfFooter.style.cssText = 'padding: 16px 28px; border-top: 2px solid #e8a0b4; text-align: center; color: #999; font-size: 0.8rem; background: white;';
    pdfFooter.innerHTML = '© 2026 Intan Miracle Care — Layanan perawatan ibu dan bayi profesional';
    target.appendChild(pdfFooter);

    const fileName = `${slug}.pdf`;

    const opt = {
      margin: [5, 5, 5, 5],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        logging: false,
        scrollY: 0,
        windowWidth: target.scrollWidth,
        allowTaint: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    setTimeout(() => {
      window.html2pdf().set(opt).from(target).save().then(() => {
        cleanup();
      }).catch((err) => {
        console.error('PDF Error:', err);
        cleanup();
        alert('Gagal membuat PDF. Silakan coba lagi.');
      });
    }, 300);

    function cleanup() {
      const header = document.getElementById('pdf-logo-header');
      if (header) header.remove();
      const overlay = document.getElementById('pdf-logo-overlay');
      if (overlay) overlay.remove();
      const footer = document.getElementById('pdf-footer');
      if (footer) footer.remove();

      if (btn) btn.style.display = '';
      setPdfLoading(false);
    }
  };

  // If slug is "tanda-bahaya-kehamilan" and not found in Supabase yet, show original static detail page
  const showStaticTandaBahaya = slug === 'tanda-bahaya-kehamilan' && !article;

  if (loading && !showStaticTandaBahaya) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: 'var(--pink-600)' }}>Memuat Artikel...</h2>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Ruang Edukasi untuk Ibu</h1>
          <p>Kembali ke <Link to="/artikel" style={{ color: 'white', textDecoration: 'underline' }}>semua artikel</Link></p>
        </div>
      </section>

      {/* Full Article Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {showStaticTandaBahaya ? (
            <div className="featured-article animate-on-scroll">
              <div className="featured-article-image">
                <img src={img('/Image/tanda-bahaya-kehamilan.webp')} alt="Ibu hamil - tanda bahaya kehamilan" />
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
                <span className="article-tag" style={{ background: 'var(--gradient-cta)', color: 'white' }}>🤰 Kehamilan</span>
                <h2 style={{ fontSize: '1.8rem', margin: '16px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  Kenali Tanda Bahaya Kehamilan agar Ibu dan Bayi Tetap Aman
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Kehamilan adalah salah satu perjalanan paling ajaib dalam hidup seorang perempuan. Setiap tendangan kecil, setiap detak jantung yang terdengar di USG, semuanya terasa seperti keajaiban. 💕 Namun, di balik keindahan itu, ada kenyataan yang perlu kita pahami bersama: <strong>sekibar 15% dari seluruh kehamilan bisa berkembang menjadi komplikasi</strong> yang berpotensi mengancam nyawa — baik bagi sang ibu maupun bayi.
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Angka itu mungkin terdengar kecil, tapi bayangkan jika kita bisa <em>mencegahnya</em> hanya dengan mengenali gejalanya lebih awal. Itulah mengapa pemeriksaan antenatal (ANC) yang rutin dan kesadaran akan tanda-tanda bahaya kehamilan sangat, sangat penting. Bukan untuk menakut-nakuti — melainkan untuk <strong>memberdayakan setiap ibu dan keluarga</strong> agar bisa bertindak cepat saat dibutuhkan.
                </p>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>🚨 Apa Itu "Tanda Bahaya" Kehamilan?</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Sederhananya, tanda bahaya kehamilan adalah <strong>gejala-gejala yang muncul dan menandakan adanya kemungkinan masalah serius</strong> pada ibu atau bayi. Ini bukan gejala biasa yang bisa diabaikan. Jika salah satu muncul, langkah terbaik adalah segera menghubungi bidan atau datang ke fasilitas kesehatan terdekat. <em>Lebih baik waspada daripada terlambat!</em> 🏥
                </p>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>🔎 8 Tanda Bahaya yang Wajib Diwaspadai</h3>

                {/* 1 */}
                <div style={{ background: '#fef2f2', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #f87171' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>1. 🩸 Perdarahan dari Jalan Lahir</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Perdarahan apapun selama hamil — baik hanya flek ringan maupun banyak — <strong>jangan pernah dianggap sepele</strong>. Ini bisa menjadi pertanda keguguran, gangguan plasenta, atau kondisi lain yang memerlukan pemeriksaan segera. Jangan tunggu sampai perdarahan bertambah banyak!
                  </p>
                </div>

                {/* 2 */}
                <div style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid var(--pink-400)' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>2. 🤕 Sakit Kepala Hebat, Pandangan Kabur, atau Sensitif Cahaya</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Kalau tiga gejala ini muncul bersamaan, waspadalah! Kombinasi ini bisa menjadi tanda <strong>preeklamsia</strong> — yaitu tekanan darah tinggi yang serius saat hamil. Jika tidak ditangani, preeklamsia bisa memicu kejang (<em>eklampsia</em>) dan komplikasi berat lainnya yang membahayakan nyawa ibu dan bayi. ⚠️
                  </p>
                </div>

                {/* 3 */}
                <div style={{ background: 'var(--mint)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #86efac' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>3. 🫲 Bengkak Mendadak di Wajah, Tangan, atau Kaki</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Pembengkakan ringan di kaki saat hamil memang wajar, tapi kalau bengkaknya <strong>muncul tiba-tiba</strong> — terutama di wajah dan tangan — dan disertai sakit kepala atau mual, ini bisa mengindikasikan masalah tekanan darah atau gangguan ginjal. Segera konsultasi ya, Bun!
                  </p>
                </div>

                {/* 4 */}
                <div style={{ background: 'var(--lavender)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #c4b5fd' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>4. 😣 Nyeri Perut Hebat atau Perut Kencang Terus-Menerus</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Rasa nyeri yang tidak kunjung hilang atau justru semakin parah <strong>bukan hal yang normal</strong> dan jangan ditahan-tahan. Ini bisa mengindikasikan kehamilan ektopik, solusio plasenta, atau kondisi darurat lainnya. Jika perut terasa "berbeda dari biasanya", segera periksa ke tenaga kesehatan.
                  </p>
                </div>

                {/* 5 */}
                <div style={{ background: 'var(--peach)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #fdba74' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>5. 👶 Gerakan Janin Berkuran atau Tidak Terasa</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Setiap ibu hamil pasti menanti-nanti momen si kecil menendang atau bergerak di dalam perut. Biasanya, janin aktif bergerak secara teratur. Namun, bila Anda merasakan <strong>penurunan signifikan dalam gerakan bayi</strong>, hal ini bisa menandakan stres janin atau masalah lain dan <strong>wajib segera dilaporkan</strong> ke tenaga kesehatan. 💙
                  </p>
                </div>

                {/* 6 */}
                <div style={{ background: '#fef3c7', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #fbbf24' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>6. 🌡️ Demam Tinggi</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Demam tinggi saat hamil bisa menjadi tanda adanya <strong>infeksi</strong> yang tidak hanya membahayakan ibu, tetapi juga janin di dalam kandungan. Infeksi yang tidak segera diobati bisa memicu komplikasi serius — jadi jangan ragu untuk langsung ke faskes jika suhu tubuh melonjak!
                  </p>
                </div>

                {/* 7 */}
                <div style={{ background: '#fef2f2', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #f87171' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>7. 🤢 Muntah Terus-Menerus Sampai Tak Bisa Makan/Minum</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Morning sickness memang umum, tapi kalau muntahnya sudah <strong>berlebihan dan berkelanjutan</strong> hingga Anda tidak bisa makan atau minum sama sekali, kondisi ini bisa menyebabkan dehidrasi, kekurangan gizi, dan ketidakseimbangan elektrolit — yang semuanya berbahaya bagi ibu dan janin.
                  </p>
                </div>

                {/* 8 */}
                <div style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '20px', borderLeft: '4px solid var(--pink-400)' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px' }}>8. 💧 Keluar Air dari Jalan Lahir Sebelum Waktunya</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Keluar air ketuban sebelum waktunya bisa menjadi tanda <strong>ketuban pecah dini (KPD)</strong>. Kondisi ini meningkatkan risiko infeksi dan persalinan prematur. Jika Anda merasakan cairan yang keluar secara tiba-tiba dan tidak bisa ditahan, segera ke rumah sakit — jangan menunggu!
                  </p>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--pink-600)', margin: '28px 0 12px' }}>🧠 Mengapa Penting Mengenal Tanda Bahaya Ini?</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Sayangnya, berbagai studi menunjukkan bahwa <strong>banyak ibu hamil dan keluarganya belum mengetahui dengan baik</strong> tanda-tanda bahaya kehamilan. Padahal, kesadaran ini bisa menjadi pembeda antara penanganan tepat waktu dan komplikasi serius — bahkan kematian maternal. 😢
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px' }}>
                  Kabar baiknya? Dengan <strong>pendidikan kesehatan yang baik</strong> serta pemeriksaan antenatal secara rutin, ibu hamil dapat lebih cepat mengenali gejala-gejala yang mengkhawatirkan dan mendapatkan pertolongan. Bagikan informasi ini kepada ibu hamil di sekitar Anda — karena <em>berbagi pengetahuan bisa menyelamatkan nyawa!</em> 🙌
                </p>

                {/* Kesimpulan */}
                <div style={{ background: 'var(--gradient-cta)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginTop: '28px' }}>
                  <h3 style={{ fontSize: '1.15rem', color: 'white', marginBottom: '10px' }}>📌 Kesimpulan: Waspada Demi Keselamatan Ibu & Bayi</h3>
                  <p style={{ color: 'rgba(255,255,255,0.92)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                    Kehamilan adalah masa yang penuh kebahagiaan, tetapi juga memerlukan kewaspadaan ekstra. Mengenal tanda bahaya — seperti perdarahan, sakit kepala hebat, gerakan janin yang menurun, atau demam tinggi — sangat penting untuk keselamatan ibu dan buah hati. <strong>Jika mengalami salah satu dari gejala tersebut, jangan pernah menunda untuk menghubungi bidan atau fasilitas kesehatan.</strong> Karena pemeriksaan dini bisa menyelamatkan nyawa. 💝
                  </p>
                </div>
              </div>
            </div>
          ) : article ? (
            <div className="featured-article animate-on-scroll">
              <div className="featured-article-image" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                <img src={article.image_url} alt={article.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
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
                <span className="article-tag" style={{ background: 'var(--gradient-cta)', color: 'white' }}>{article.category}</span>
                <h2 style={{ fontSize: '1.8rem', margin: '16px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {article.title}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Ditulis oleh: <strong>{article.author || 'Terapis Intan Miracle'}</strong>
                </div>
                
                {/* Dynamically Render HTML Content safely */}
                <div 
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
              </div>
            </div>
          ) : (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <h2>Artikel Tidak Ditemukan 😟</h2>
              <p style={{ marginTop: '12px' }}>Silakan kembali ke <Link to="/artikel" style={{ color: 'var(--pink-600)' }}>halaman edukasi</Link></p>
            </div>
          )}
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
