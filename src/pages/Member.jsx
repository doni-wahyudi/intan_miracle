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
  const [authMsg, setAuthMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  // Profile states
  const [namaIbu, setNamaIbu] = useState('');
  const [namaBayi, setNamaBayi] = useState('');
  const [usiaBayi, setUsiaBayi] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Run scroll animations
  useScrollAnimation([session, activeTab]);

  // Check session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user);
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
        setWhatsapp(data.whatsapp || '');
        setAlamat(data.alamat || '');
      }
    } catch (err) {
      console.error('Error fetching member profile:', err);
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

    const profileData = {
      id: user.id,
      nama_ibu: namaIbu,
      nama_bayi: namaBayi,
      usia_bayi: usiaBayi,
      whatsapp,
      alamat,
    };

    const { error } = await supabase
      .from('members')
      .upsert(profileData);

    setSaveLoading(false);

    if (error) {
      alert('❌ Gagal menyimpan profil: ' + error.message);
    } else {
      alert('✅ Profil berhasil diperbarui!');
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
    setWhatsapp('');
    setAlamat('');
    setAuthMsg({ text: '', type: '' });
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

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Member Area</h1>
          <p>Kelola profil dan nikmati kemudahan reservasi</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!session ? (
            /* Auth Login/Register View */
            <div className="auth-card animate-on-scroll" style={{ maxWidth: '500px', margin: '0 auto' }}>
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
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Masuk Sekarang</button>
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
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Daftar Member</button>
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
          ) : (
            /* Logged In Profile View */
            <div className="profile-card animate-on-scroll" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2>Halo, <span id="displayNamaIbu">{namaIbu || 'Member'}</span>! 👋</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>{session.user.email}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      ⚙️ Buka Dashboard Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="btn btn-secondary">Keluar</button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="form-card">
                <h3>📝 Lengkapi Profil Anda</h3>
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
                  {saveLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
