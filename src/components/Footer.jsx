import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Part 1: Logo */}
          <div className="footer-logo">
            <img src="/Image/PP 2.webp" alt="Intan Miracle Logo" className="logo-image-footer-large" />
          </div>

          {/* Part 2: Description & Social Media */}
          <div className="footer-about">
            <p className="footer-desc">
              Layanan perawatan ibu dan bayi profesional dengan sentuhan penuh cinta. Mendampingi masa emas ibu dan bayi
              Anda.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/intan.mica?igsh=MThmc2x5M2JscTh0cg==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ display: 'block', margin: 'auto' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://wa.me/6285267474943" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ display: 'block', margin: 'auto' }}><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.977h.004c4.368 0 7.927-3.56 7.93-7.93a7.898 7.898 0 0 0-2.33-5.594ZM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592Zm3.69-4.98c-.202-.101-1.194-.588-1.379-.653-.185-.066-.32-.097-.456.102-.136.2-.527.653-.646.79-.119.136-.239.153-.44.05-.201-.1-.85-.313-1.618-.997-.598-.533-1.002-1.191-1.119-1.392-.119-.202-.012-.311.089-.412.09-.09.201-.235.301-.35.1-.118.134-.197.201-.328.067-.132.034-.248-.016-.35-.05-.101-.457-1.1-.625-1.505-.164-.395-.343-.34-.471-.346-.12-.006-.257-.008-.393-.008a.723.723 0 0 0-.529.247c-.182.2-.693.677-.693 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.194-.488 1.362-1.058.168-.572.168-1.063.118-1.165-.05-.101-.186-.153-.389-.255Z"/></svg>
              </a>
              <a href="mailto:hello@intanmiracle.com" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style={{ display: 'block', margin: 'auto' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </a>
            </div>
          </div>

          {/* Part 3: Kontak Kami */}
          <div className="footer-contact-section">
            <h4>Kontak Kami</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                <span>
                  <a 
                    href="https://maps.google.com/?q=Jl.+Kranggan+Gg.+Ili+No.135,+Jatirangga,+Kec.+Jatisampurna,+Kota+Bekasi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.target.style.color = 'var(--pink-300)'}
                    onMouseOut={(e) => e.target.style.color = 'inherit'}
                  >
                    Jl. Kranggan Gg. Ili No.135, RT.003/RW.3, Jatirangga, Kec. Jatisampurna, Kota Bks, Jawa Barat 17434
                  </a>
                </span>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <span>
                  <a 
                    href="https://wa.me/6285267474943" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.target.style.color = 'var(--pink-300)'}
                    onMouseOut={(e) => e.target.style.color = 'inherit'}
                  >
                    0852-6747-4943
                  </a>
                </span>
              </li>
              <li>
                <span className="contact-icon">📧</span>
                <span>
                  <a 
                    href="mailto:hello@intanmiracle.com"
                    style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={(e) => e.target.style.color = 'var(--pink-300)'}
                    onMouseOut={(e) => e.target.style.color = 'inherit'}
                  >
                    hello@intanmiracle.com
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Intan Miracle. Dibuat dengan <span className="heart">♥</span> untuk ibu dan bayi Indonesia.
        </div>
      </div>
    </footer>
  );
}
