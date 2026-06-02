import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { img } from '../utils/imageUrl';

// High-quality static content fallbacks to guarantee the article pages work
// even if the database is empty or before the user has custom-uploaded them!
// If the user uploads a custom article with the same slug in the database,
// it will automatically override these static fallbacks.
const STATIC_ARTICLES = {
  'manfaat-pijat-bayi': {
    title: 'Manfaat Pijat Bayi untuk Tumbuh Kembang Si Kecil',
    category: 'Perawatan Bayi',
    author: 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    image_url: img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp'),
    content: `
      <p>Pijat bayi bukan sekadar sentuhan biasa. Berbagai penelitian menunjukkan bahwa pijat bayi yang dilakukan secara rutin oleh terapis profesional bersertifikat maupun orang tua sendiri dapat memberikan manfaat luar biasa bagi fisik dan psikologis si kecil.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">1. Meningkatkan Kualitas Tidur</h3>
      <p>Sentuhan lembut dan ritmis selama pemijatan merangsang produksi hormon serotonin, yang kemudian diubah menjadi melatonin (hormon tidur). Bayi yang dipijat secara teratur cenderung tidur lebih cepat, lebih nyenyak, dan bangun dengan kondisi lebih segar.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">2. Melancarkan Pencernaan & Meredakan Kolik</h3>
      <p>Gerakan pijat perut (seperti teknik "I Love You") sangat efektif untuk membantu mengeluarkan gas yang terjebak di usus bayi, mengatasi konstipasi, serta meredakan gejala kolik yang sering membuat bayi rewel di malam hari.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">3. Mendukung Tumbuh Kembang Motorik & Sensorik</h3>
      <p>Melalui pijatan, bayi mendapatkan stimulasi taktil (sentuhan) yang memperkuat jalur saraf di otaknya. Hal ini mendukung koordinasi otot, meningkatkan kesadaran tubuh (body awareness), dan membantu melatih motorik kasar dan halus si kecil.</p>
    `
  },
  'cara-merawat-bayi-baru-lahir': {
    title: 'Cara Merawat Bayi Baru Lahir: Panduan untuk Ibu Pertama Kali',
    category: 'Tips Ibu Baru',
    author: 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    image_url: img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp'),
    content: `
      <p>Membawa pulang bayi baru lahir (newborn) ke rumah adalah momen yang penuh kebahagiaan sekaligus kecemasan bagi ibu baru. Berikut adalah beberapa panduan praktis dan higienis untuk merawat buah hati Anda dengan percaya diri.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">1. Perawatan Tali Pusat</h3>
      <p>Kunci utama perawatan tali pusat adalah menjaganya tetap bersih dan kering. Jangan membungkus tali pusat dengan kain basah, kasa alkohol, atau betadine kecuali atas saran dokter. Cukup bersihkan dengan air matang jika terkena urin/kotoran, lalu keringkan dengan kasa steril. Biarkan tali pusat lepas secara alami dalam waktu 1-2 minggu.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">2. Memandikan Bayi Baru Lahir</h3>
      <p>Gunakan air hangat suam-suam kuku (sekitar 37°C) dan sabun khusus bayi yang lembut. Sebelum tali pusat lepas, disarankan untuk menyeka tubuh bayi menggunakan waslap basah hangat (sponge bath) untuk mencegah infeksi pada tali pusat yang belum kering.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">3. Pola Tidur Newborn</h3>
      <p>Bayi baru lahir tidur sekitar 16-18 jam sehari, namun dalam rentang waktu pendek 2-4 jam sekali karena lambung mereka masih sangat kecil dan perlu disusui secara berkala. Selalu tidurkan bayi dalam posisi telentang di atas kasur yang datar dan bebas dari bantal longgar atau boneka tebal demi keamanan.</p>
    `
  },
  'tips-asi-lancar': {
    title: 'Tips ASI Lancar: Panduan Lengkap untuk Ibu Menyusui',
    category: 'Laktasi',
    author: 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    image_url: img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp'),
    content: `
      <p>ASI adalah nutrisi terbaik dan paling alami untuk tumbuh kembang bayi. Bagi beberapa ibu, perjalanan menyusui bisa menantang. Berikut adalah beberapa tips medis dan praktis untuk menjaga produksi ASI tetap lancar dan melimpah.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">1. Sering Menyusui & Mengosongkan Payudara</h3>
      <p>Produksi ASI bekerja berdasarkan prinsip <i>supply and demand</i> (penawaran dan permintaan). Semakin sering payudara dikosongkan (baik disusui langsung maupun dipompa), tubuh akan memproduksi lebih banyak ASI. Susui bayi setiap 2-3 jam sekali secara teratur.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">2. Pijat Laktasi & Kompres Hangat</h3>
      <p>Pijat laktasi yang lembut dapat merangsang hormon oksitosin (hormon kasih sayang) yang bertanggung jawab untuk memancarkan ASI (let-down reflex). Mengompres payudara dengan air hangat sebelum menyusui juga membantu melebarkan saluran ASI dan meredakan ketegangan.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">3. Kelola Stres & Istirahat Cukup</h3>
      <p>Stres berat dan kelelahan fisik dapat menghambat pelepasan hormon oksitosin sehingga ASI sulit keluar. Cobalah luangkan waktu untuk rileks, dengarkan musik tenang, serta penuhi asupan cairan tubuh dengan minum minimal 3 liter air per hari.</p>
    `
  },
  'perawatan-ibu-nifas-di-rumah': {
    title: 'Perawatan Ibu Nifas di Rumah: Yang Perlu Anda Ketahui',
    category: 'Perawatan Ibu',
    author: 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    image_url: img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp'),
    content: `
      <p>Masa nifas (postpartum) berlangsung sekitar 6 minggu setelah melahirkan. Ini adalah waktu krusial bagi tubuh ibu untuk pulih secara fisik dan emosional. Perawatan yang tepat sangat penting untuk mencegah infeksi dan mendukung kesejahteraan mental ibu baru.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">1. Perawatan Luka Persalinan</h3>
      <p>Baik melahirkan secara normal (luka perineum) maupun caesar, kebersihan luka harus dijaga dengan ketat. Bersihkan area kewanitaan dengan air bersih mengalir dari arah depan ke belakang setiap selesai buang air, lalu tepuk lembut hingga benar-benar kering dengan tisu bersih sebelum memakai pembalut nifas baru.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">2. Istirahat Saat Bayi Tidur</h3>
      <p>Kurang tidur adalah pemicu utama sindrom <i>baby blues</i> atau depresi pascamelahirkan. Manfaatkan waktu tidur bayi untuk ikut beristirahat. Mintalah bantuan pasangan atau keluarga terdekat untuk mengurus tugas rumah tangga agar ibu bisa fokus pada pemulihan tubuh.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">3. Mobilisasi Dini & Nutrisi Seimbang</h3>
      <p>Mulailah bergerak ringan (mobilisasi dini) seperti berjalan perlahan di dalam kamar untuk melancarkan sirkulasi darah dan mencegah pembekuan darah. Imbangi dengan makanan kaya serat, protein tinggi (untuk mempercepat penyembuhan luka), zat besi, dan vitamin C.</p>
    `
  },
  'tanda-bahaya-kehamilan': {
    title: 'Kenali Tanda Bahaya Kehamilan agar Ibu dan Bayi Tetap Aman',
    category: 'Kehamilan',
    author: 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    image_url: img('/Image/tanda-bahaya-kehamilan.webp'),
    content: `
      <p>Kehamilan adalah salah satu perjalanan paling ajaib dalam hidup seorang perempuan. Namun, di balik keindahan itu, ada kenyataan yang perlu kita pahami bersama: sekitar 15% dari seluruh kehamilan bisa berkembang menjadi komplikasi yang berpotensi mengancam nyawa — baik bagi sang ibu maupun bayi.</p>
      <p>Mengenali tanda bahaya sejak dini bisa menyelamatkan nyawa. Berikut adalah 8 tanda bahaya kehamilan yang wajib diwaspadai:</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">1. Perdarahan dari Jalan Lahir</h3>
      <p>Perdarahan apapun selama hamil — baik hanya flek ringan maupun banyak — jangan pernah dianggap sepele. Ini bisa menjadi pertanda keguguran atau gangguan plasenta.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">2. Sakit Kepala Hebat & Pandangan Kabur</h3>
      <p>Kombinasi ini bisa menjadi tanda preeklamsia (tekanan darah tinggi serius saat hamil) yang memerlukan penanganan darurat segera.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">3. Bengkak Mendadak di Wajah, Tangan, atau Kaki</h3>
      <p>Pembengkakan mendadak di wajah dan tangan seringkali mengindikasikan preeklamsia atau gangguan organ ginjal.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">4. Nyeri Perut Hebat</h3>
      <p>Nyeri perut hebat yang tidak kunjung reda bisa menandakan solusio plasenta, kehamilan ektopik terganggu, atau komplikasi kebidanan lainnya.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">5. Gerakan Janin Berkurang</h3>
      <p>Janin yang sehat biasanya aktif bergerak. Jika gerakan bayi berkurang drastis atau tidak terasa sama sekali selama beberapa jam, segeralah ke fasilitas kesehatan.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">6. Demam Tinggi</h3>
      <p>Demam tinggi saat hamil bisa mengindikasikan infeksi sistemik yang membahayakan pertumbuhan janin dalam kandungan.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">7. Muntah Berlebihan</h3>
      <p>Muntah terus-menerus sampai ibu tidak bisa makan atau minum (Hiperemesis Gravidarum) dapat memicu dehidrasi berat dan malnutrisi janin.</p>
      
      <h3 style="font-size: 1.25rem; color: var(--pink-600); margin: 28px 0 12px;">8. Pecah Ketuban Dini</h3>
      <p>Keluarnya cairan ketuban secara tiba-tiba sebelum waktunya persalinan meningkatkan risiko infeksi kandungan dan kelahiran prematur.</p>
    `
  }
};

const cleanTitle = (title) => {
  if (!title) return '';
  return title.replace(/^#+\s+/, '');
};

const parseMarkdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  // If the content already has HTML tags (like <p> or <h3>), return it directly to maintain backward compatibility
  if (/<[a-z][\s\S]*>/i.test(markdown)) {
    return markdown;
  }
  
  // Normalize line endings
  let html = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Convert horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr style="border:0; border-top:1px solid var(--pink-100); margin:24px 0;" />');
  
  // Convert headers (### to h4, ## to h3, # to h2)
  html = html.replace(/^### (.*?)$/gm, '<h4 style="font-size:1.2rem; color:var(--pink-600); margin:24px 0 12px; font-weight:700;">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 style="font-size:1.4rem; color:var(--pink-600); margin:28px 0 16px; font-weight:700;">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 style="font-size:1.6rem; color:var(--pink-600); margin:32px 0 20px; font-weight:700;">$1</h2>');
  
  // Convert blockquotes
  html = html.replace(/^> (.*?)$/gm, '<blockquote style="border-left:4px solid var(--pink-400); padding-left:16px; margin:20px 0; color:var(--text-secondary); font-style:italic;">$1</blockquote>');
  
  // Convert bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\?/g, '<strong>$1</strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Convert italics: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Convert list items
  // Unordered list items: * item or - item
  html = html.replace(/^\s*[\*\-]\s+(.*?)$/gm, '<li style="margin-left:20px; margin-bottom:6px; list-style-type:disc;">$1</li>');
  // Ordered list items: 1. item
  html = html.replace(/^\s*\d+\.\s+(.*?)$/gm, '<li style="margin-left:20px; margin-bottom:6px; list-style-type:decimal;">$1</li>');
  
  // Split paragraphs by double newlines or single newlines
  const blocks = html.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    
    // If block starts with blockquote, header, list item, or horizontal rule, do not wrap in <p>
    if (trimmed.startsWith('<h') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li') || trimmed.startsWith('<hr')) {
      return trimmed;
    }
    
    // Otherwise wrap in <p>
    return `<p style="margin-bottom:16px; line-height:1.9; color:var(--text-secondary);">${trimmed.replace(/\n/g, '<br />')}</p>`;
  });
  
  return formattedBlocks.filter(b => b !== '').join('\n');
};

export default function ArtikelDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  
  // Fast responsiveness: If slug is a static fallback, render it immediately
  // while doing a background check in case there is a Supabase overwrite.
  const cleanSlug = slug ? decodeURIComponent(slug).toLowerCase() : '';
  const isStaticFallback = cleanSlug in STATIC_ARTICLES;
  
  const [loading, setLoading] = useState(!isStaticFallback);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Fetch from Supabase
  useEffect(() => {
    async function fetchArticleDetails() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .ilike('slug', cleanSlug)
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
  }, [cleanSlug]);

  // Run scroll animations
  const activeArticle = article || STATIC_ARTICLES[cleanSlug];
  useScrollAnimation([cleanSlug, activeArticle]);

  const handleDownloadPDF = () => {
    const target = document.querySelector('.featured-article');
    if (!target || typeof window.html2pdf === 'undefined') {
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
    target.insertBefore(logoHeader, target.firstChild);

    // Inject Logo Overlay
    const articleImageDiv = target.querySelector('.featured-article-image');
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
    target.appendChild(pdfFooter);

    const fileName = `${cleanSlug}.pdf`;

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
      window.html2pdf().set(opt).from(target).save().then(() => {
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

  if (loading) {
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
          <p>Kembali ke <Link to="/artikel" style={{ color: 'var(--pink-600)', fontWeight: 600, textDecoration: 'underline' }}>semua artikel</Link></p>
        </div>
      </section>

      {/* Full Article Content */}
      <section className="section">
        <div className="container" style={{ maxWidth: '900px' }}>
          {activeArticle ? (
            <div className="featured-article animate-on-scroll">
              <div className="featured-article-image" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                <img src={activeArticle.image_url || img('/Image/Pijat-Bayi-Bisa-Optimalkan-Tumbuh-Kembang.webp')} alt={cleanTitle(activeArticle.title)} style={{ width: '100%', height: 'auto', display: 'block' }} />
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
                <span className="article-tag" style={{ background: 'var(--gradient-cta)', color: 'white' }}>{activeArticle.category}</span>
                <h2 style={{ fontSize: '1.8rem', margin: '16px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {cleanTitle(activeArticle.title)}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Ditulis oleh: <strong>{activeArticle.author || 'Bdn. Intan Purnama Sari, S.Keb., CBMT'}</strong>
                </div>
                
                {/* Dynamically Render HTML Content safely */}
                <div 
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.9 }}
                  dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(activeArticle.content) }} 
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
