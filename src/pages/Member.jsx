import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Member() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [authMsg, setAuthMsg] = useState({ text: '', type: '' });

  // Profile states
  const [namaIbu, setNamaIbu] = useState('');
  const [namaBayi, setNamaBayi] = useState('');
  const [usiaBayi, setUsiaBayi] = useState('');
  const [jenisKelaminBayi, setJenisKelaminBayi] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [memberNumber, setMemberNumber] = useState('');
  const [memberStatus, setMemberStatus] = useState('pending'); // 'pending' | 'verified' | 'rejected'

  // Member programs & settings
  const [memberPrograms, setMemberPrograms] = useState([]);
  const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/B4m4y2p4zuL062gH93Vaue');

  // Run scroll animations
  useScrollAnimation([session, activeTab, loading, editMode]);

  // Check session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
        fetchMemberPrograms();
        fetchWhatsappLink();
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
        fetchMemberPrograms();
        fetchWhatsappLink();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setNamaIbu(data.nama_ibu || '');
        setNamaBayi(data.nama_bayi || '');
        setUsiaBayi(data.usia_bayi || '');
        setJenisKelaminBayi(data.jenis_kelamin_bayi || '');
        setWhatsapp(data.whatsapp || '');
        setAlamat(data.alamat || '');
        setMemberNumber(data.member_number || '');
        setMemberStatus(data.status || 'pending');
        // Profile is "filled" if at least nama_ibu is set
        setHasProfile(!!data.nama_ibu);

        // Sync email if missing in DB
        if (!data.email && user.email) {
          supabase.from('members').update({ email: user.email }).eq('id', user.id).then();
        }
      } else {
        setHasProfile(false);
      }
    } catch (err) {
      console.error('Error fetching member profile:', err);
      setHasProfile(false);
    }
  };

  const fetchMemberPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('member_programs')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (!error && data) setMemberPrograms(data);
    } catch (err) {
      console.error('Error fetching member programs:', err);
    }
  };

  const fetchWhatsappLink = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'whatsapp_link')
        .single();
      if (!error && data && data.value) setWhatsappLink(data.value);
    } catch (err) {
      console.error('Error fetching whatsapp link:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMsg({ text: '', type: '' });
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthMsg({ text: '❌ ' + error.message, type: 'error' });
    } else {
      setAuthMsg({ text: '✅ Berhasil masuk!', type: 'success' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMsg({ text: '', type: '' });

    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
    });

    if (error) {
      setAuthMsg({ text: '❌ ' + error.message, type: 'error' });
    } else {
      setAuthMsg({ text: '✅ Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.', type: 'success' });
      setRegEmail('');
      setRegPassword('');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    const user = session?.user;
    if (!user) return;

    let finalMemberNumber = memberNumber;
    if (!finalMemberNumber) {
      finalMemberNumber = String(Math.floor(100000 + Math.random() * 900000));
    }

    const profileData = {
      id: user.id,
      email: user.email,
      nama_ibu: namaIbu,
      nama_bayi: namaBayi,
      usia_bayi: usiaBayi,
      jenis_kelamin_bayi: jenisKelaminBayi,
      whatsapp,
      alamat,
      member_number: finalMemberNumber,
      status: memberStatus || 'pending'
    };

    const { error } = await supabase
      .from('members')
      .upsert(profileData);

    setSaveLoading(false);

    if (error) {
      alert('❌ Gagal menyimpan profil: ' + error.message);
    } else {
      alert('✅ Profil berhasil diperbarui! Pendaftaran member Anda akan ditinjau oleh Admin.');
      setMemberNumber(finalMemberNumber);
      setMemberStatus('pending');
      setHasProfile(true);
      setEditMode(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setEmail('');
    setPassword('');
    setNamaIbu('');
    setNamaBayi('');
    setUsiaBayi('');
    setJenisKelaminBayi('');
    setWhatsapp('');
    setAlamat('');
    setAuthMsg({ text: '', type: '' });
    setHasProfile(false);
    setEditMode(false);
    setMemberPrograms([]);
    setWhatsappLink('');
    setMemberNumber('');
    setMemberStatus('pending');
  };

  const adminEmails = ['intanmiracle@gmail.com', 'admin@intanmiracle.com'];
  const isAdmin = session && adminEmails.includes(session.user.email.toLowerCase());

  if (loading) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ color: 'var(--pink-600)' }}>Memuat Member Area...</h2>
      </div>
    );
  }

  // Profile info row helper
  const InfoRow = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--pink-100)' }}>
      <span style={{ fontSize: '1.2rem', minWidth: '28px', textAlign: 'center' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.95rem', color: value ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 500 }}>{value || 'Belum diisi'}</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Member Area</h1>
          <p>Kelola profil dan nikmati keuntungan member eksklusif</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!session ? (
            /* Auth Login/Register View */
            <div className="auth-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
              <div className="auth-tabs">
                <button 
                  className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('login'); setAuthMsg({ text: '', type: '' }); }}
                >
                  Masuk
                </button>
                <button 
                  className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('register'); setAuthMsg({ text: '', type: '' }); }}
                >
                  Daftar
                </button>
              </div>

              {activeTab === 'login' ? (
                /* Login Form */
                <form onSubmit={handleLogin} className="auth-form">
                  <h3>Selamat Datang Kembali</h3>
                  <div className="form-group">
                    <label htmlFor="loginEmail">Email</label>
                    <input 
                      type="email" 
                      id="loginEmail" 
                      placeholder="email@contoh.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="loginPassword">Kata Sandi</label>
                    <input 
                      type="password" 
                      id="loginPassword" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Masuk</button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegister} className="auth-form">
                  <h3>Daftar Member Baru</h3>
                  <div className="form-group">
                    <label htmlFor="regEmail">Email</label>
                    <input 
                      type="email" 
                      id="regEmail" 
                      placeholder="email@contoh.com" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="regPassword">Kata Sandi</label>
                    <input 
                      type="password" 
                      id="regPassword" 
                      placeholder="Min. 6 karakter" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Daftar Member</button>
                </form>
              )}

              {authMsg.text && (
                <p 
                  style={{ 
                    marginTop: '15px', 
                    textAlign: 'center', 
                    fontSize: '0.9rem',
                    color: authMsg.type === 'error' ? 'red' : 'green' 
                  }}
                >
                  {authMsg.text}
                </p>
              )}
            </div>
          ) : !hasProfile || editMode ? (
            /* Profile Edit Form — shown for new members or when editing */
            <div className="profile-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2>{!hasProfile ? '👋 Selamat Datang, Member Baru!' : '✏️ Edit Profil'}</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>{session.user.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {hasProfile && (
                    <button onClick={() => setEditMode(false)} className="btn btn-secondary">← Kembali</button>
                  )}
                  <button onClick={handleLogout} className="btn btn-secondary">Keluar</button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="form-card">
                <h3>📝 {!hasProfile ? 'Lengkapi Profil Anda' : 'Perbarui Profil'}</h3>
                <p style={{ marginBottom: '20px' }}>Data ini akan otomatis terisi saat Anda melakukan reservasi.</p>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profNamaIbu">👤 Nama Ibu</label>
                    <input 
                      type="text" 
                      id="profNamaIbu" 
                      placeholder="Nama lengkap Anda"
                      value={namaIbu}
                      onChange={(e) => setNamaIbu(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profNamaBayi">👶 Nama Bayi</label>
                    <input 
                      type="text" 
                      id="profNamaBayi" 
                      placeholder="Nama si kecil"
                      value={namaBayi}
                      onChange={(e) => setNamaBayi(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profUsiaBayi">🍼 Usia Bayi</label>
                    <input 
                      type="text" 
                      id="profUsiaBayi" 
                      placeholder="Contoh: 3 bulan"
                      value={usiaBayi}
                      onChange={(e) => setUsiaBayi(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profJenisKelamin">🚻 Jenis Kelamin Bayi</label>
                    <select
                      id="profJenisKelamin"
                      value={jenisKelaminBayi}
                      onChange={(e) => setJenisKelaminBayi(e.target.value)}
                    >
                      <option value="">— Pilih —</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profWhatsapp">📞 Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      id="profWhatsapp" 
                      placeholder="08xx-xxxx-xxxx"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="profAlamat">📍 Alamat Lengkap</label>
                  <textarea 
                    id="profAlamat" 
                    rows="3" 
                    placeholder="Alamat lengkap untuk layanan ke rumah"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={saveLoading}>
                  {saveLoading ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </form>
            </div>
          ) : (
            /* Logged In Dashboard View — Display-only profile + Programs + Telegram */
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* Header */}
              <div className="profile-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ marginBottom: '4px' }}>Halo, <span style={{ color: 'var(--pink-600)' }}>{namaIbu || 'Member'}</span>! 👋</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{session.user.email}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={handleLogout} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>🚪 Keluar</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Profile Info Card */}
                <div className="profile-card" style={{ gridColumn: 'span 1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>📋 Informasi Profil</h3>
                    <button 
                      onClick={() => setEditMode(true)} 
                      className="btn btn-secondary" 
                      style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                  {memberNumber && <InfoRow icon="🆔" label="ID Member" value={`IM-${memberNumber}`} />}
                  <InfoRow icon="👤" label="Nama Ibu" value={namaIbu} />
                  <InfoRow icon="👶" label="Nama Bayi" value={namaBayi} />
                  <InfoRow icon="🍼" label="Usia Bayi" value={usiaBayi} />
                  <InfoRow icon="🚻" label="Jenis Kelamin Bayi" value={jenisKelaminBayi} />
                  <InfoRow icon="📞" label="WhatsApp" value={whatsapp} />
                  <InfoRow icon="📍" label="Alamat" value={alamat} />
                </div>

                {/* Quick Actions + Telegram */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Quick Actions Card */}
                  <div className="profile-card">
                    <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>⚡ Aksi Cepat</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Link to="/reservasi" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        📅 Reservasi Sekarang
                      </Link>
                      <Link to="/layanan" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        ✨ Lihat Layanan
                      </Link>
                      <a href="https://wa.me/6285267474943" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        💬 Hubungi Kami
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp Group Card (Gated) */}
                  {(memberStatus === 'verified' || isAdmin) && whatsappLink && (
                    <div style={{
                      background: 'linear-gradient(135deg, #25d36615, #25d36608)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '28px',
                      border: '1px solid #25d36630',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💬</div>
                      <h3 style={{ fontSize: '1.1rem', color: '#25D366', marginBottom: '8px' }}>Join Grup WhatsApp</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                        Bergabung di grup WhatsApp eksklusif kami untuk info terbaru, tips, dan promo khusus member!
                      </p>
                      <a 
                        href={whatsappLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#25D366',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        💬 Gabung Sekarang
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Status Banners */}
              {memberStatus === 'pending' && !isAdmin && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--pink-50), #fff)',
                  border: '1px solid var(--pink-200)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>⏳</span>
                  <div>
                    <h4 style={{ color: 'var(--pink-700)', marginBottom: '4px', margin: 0, fontSize: '1.05rem' }}>Akun Sedang Diverifikasi</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      Pendaftaran member Anda sedang ditinjau oleh Admin. Keuntungan program khusus member dan akses Grup WhatsApp akan terbuka otomatis setelah akun Anda disetujui.
                    </p>
                  </div>
                </div>
              )}

              {memberStatus === 'rejected' && !isAdmin && (
                <div style={{
                  background: 'linear-gradient(135deg, #fef2f2, #fff)',
                  border: '1px solid #fee2e2',
                  borderRadius: 'var(--radius-xl)',
                  padding: '24px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>❌</span>
                  <div>
                    <h4 style={{ color: '#dc2626', marginBottom: '4px', margin: 0, fontSize: '1.05rem' }}>Verifikasi Belum Berhasil</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      Mohon maaf, pengajuan member Anda belum disetujui oleh admin. Silakan periksa kembali data profil Anda dan perbarui jika terdapat kekeliruan.
                    </p>
                  </div>
                </div>
              )}

              {/* Member Programs Section — Gated */}
              {(memberStatus === 'verified' || isAdmin) && (
                <div style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>🎁 Program Khusus Member</h3>
                  {memberPrograms.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                      {memberPrograms.map((prog) => (
                        <div key={prog.id} style={{
                          background: 'white',
                          borderRadius: 'var(--radius-xl)',
                          padding: '28px',
                          border: '1px solid var(--pink-200)',
                          boxShadow: '0 4px 16px rgba(236, 72, 153, 0.06)',
                          position: 'relative',
                          overflow: 'hidden',
                        }}>
                          {prog.discount_percent > 0 && (
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              right: '16px',
                              background: 'linear-gradient(135deg, var(--pink-500), var(--pink-600))',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}>
                              Diskon {prog.discount_percent}%
                            </div>
                          )}
                          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎉</div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '8px', color: 'var(--text-primary)', paddingRight: prog.discount_percent > 0 ? '80px' : '0' }}>{prog.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{prog.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      background: 'var(--pink-50)',
                      borderRadius: 'var(--radius-xl)',
                      padding: '40px',
                      textAlign: 'center',
                      border: '1px dashed var(--pink-200)',
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌟</div>
                      <h4 style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Belum ada program member aktif saat ini</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Nantikan program eksklusif dari Intan Miracle untuk Anda!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
