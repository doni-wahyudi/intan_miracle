import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { img } from '../utils/imageUrl';

export default function Admin() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Tab State
  const [currentTab, setCurrentTab] = useState('reservasi');
  const [mobileSidebarActive, setMobileSidebarActive] = useState(false);

  // Data Listing States
  const [reservations, setReservations] = useState([]);
  const [members, setMembers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // Stats
  const [stats, setStats] = useState({ totalRes: 0, pendingRes: 0, monthRes: 0 });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editId, setEditId] = useState(null);

  // Dynamic Form Field States
  const [formFields, setFormFields] = useState({});

  // Uploading State
  const [uploading, setUploading] = useState(false);

  // Admin Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Verify Admin Access
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = (session) => {
    setSession(session);
    if (session) {
      const adminEmails = ['intanmiracle@gmail.com', 'admin@intanmiracle.com'];
      if (adminEmails.includes(session.user.email.toLowerCase())) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
    setAuthLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      loadTabInitialData(currentTab);
    }
  }, [currentTab, isAdmin]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError(error.message);
      } else {
        const adminEmails = ['intanmiracle@gmail.com', 'admin@intanmiracle.com'];
        if (!adminEmails.includes(data.user.email.toLowerCase())) {
          setLoginError('Akses ditolak: Akun Anda bukan Administrator.');
          await supabase.auth.signOut();
        }
      }
    } catch (err) {
      setLoginError(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle image upload to Supabase Storage
  const handleImageUpload = async (e, bucketName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('❌ Hanya file gambar yang diperbolehkan!');
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      updateField('image_url', publicUrlData.publicUrl);
      alert('✅ Gambar berhasil diunggah!');
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('❌ Gagal mengunggah gambar: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const loadTabInitialData = (tab) => {
    switch (tab) {
      case 'reservasi':
        fetchReservations();
        break;
      case 'member':
        fetchMembers();
        break;
      case 'artikel':
        fetchArticles();
        break;
      case 'layanan':
        fetchServices();
        break;
      case 'galeri':
        fetchGallery();
        break;
      case 'testimoni':
        fetchTestimonials();
        break;
      case 'sertifikat':
        fetchCertificates();
        break;
      default:
        break;
    }
  };

  // --- API CALLS: READ ---
  const fetchReservations = async () => {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setReservations(data);
      // Calculate Stats
      const total = data.length;
      const pending = data.filter(r => r.status === 'pending').length;
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      const month = data.filter(r => {
        const d = new Date(r.created_at);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      }).length;
      setStats({ totalRes: total, pendingRes: pending, monthRes: month });
    }
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (!error && data) setMembers(data);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    if (!error && data) setArticles(data);
  };

  const fetchServices = async () => {
    const { data, error } = await supabase.from('services').select('*').order('category', { ascending: true }).order('name', { ascending: true });
    if (!error && data) setServices(data);
  };

  const fetchGallery = async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (!error && data) setGallery(data);
  };

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error && data) setTestimonials(data);
  };

  const fetchCertificates = async () => {
    const { data, error } = await supabase.from('certificates').select('*').order('sort_order', { ascending: true });
    if (!error && data) setCertificates(data);
  };

  // --- API CALLS: CREATE / UPDATE ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let tableName = '';
    
    switch (currentTab) {
      case 'artikel': tableName = 'articles'; break;
      case 'layanan': tableName = 'services'; break;
      case 'galeri': tableName = 'gallery'; break;
      case 'testimoni': tableName = 'testimonials'; break;
      case 'sertifikat': tableName = 'certificates'; break;
      default: return;
    }

    const dataPayload = { ...formFields };
    
    // Auto populate slug for articles if not custom specified
    if (currentTab === 'artikel' && !dataPayload.slug && dataPayload.title) {
      dataPayload.slug = dataPayload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    }

    let error = null;
    if (modalMode === 'add') {
      const { error: err } = await supabase.from(tableName).insert(dataPayload);
      error = err;
    } else {
      const { error: err } = await supabase.from(tableName).update(dataPayload).eq('id', editId);
      error = err;
    }

    if (error) {
      alert('❌ Error: ' + error.message);
    } else {
      alert(`✅ Berhasil ${modalMode === 'add' ? 'menambah' : 'menyimpan'} data!`);
      setModalOpen(false);
      loadTabInitialData(currentTab);
    }
  };

  // --- API CALLS: DELETE ---
  const handleDeleteItem = async (tableName, id) => {
    if (!window.confirm('Yakin ingin menghapus item ini secara permanen?')) return;
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) {
      alert('❌ Gagal menghapus: ' + error.message);
    } else {
      alert('✅ Item berhasil dihapus!');
      loadTabInitialData(currentTab);
    }
  };

  // --- RESERVATION STATUS UPDATER ---
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase.from('reservations').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert('❌ Gagal memperbarui status: ' + error.message);
    } else {
      fetchReservations();
    }
  };

  // --- MODAL TRIGGER HELPERS ---
  const openAddModal = () => {
    setModalMode('add');
    setEditId(null);
    // Initialize blank fields based on active tab
    const initial = {};
    if (currentTab === 'artikel') {
      initial.title = ''; initial.slug = ''; initial.category = 'Perawatan Bayi';
      initial.summary = ''; initial.content = ''; initial.image_url = '';
    } else if (currentTab === 'layanan') {
      initial.name = ''; initial.category = 'baby'; initial.price = 0;
      initial.description = ''; initial.duration = ''; initial.icon = '🌸';
    } else if (currentTab === 'galeri') {
      initial.image_url = ''; initial.caption = '';
    } else if (currentTab === 'testimoni') {
      initial.author_name = ''; initial.category = 'Pijat Bayi'; initial.content = '';
      initial.stars = 5; initial.avatar_initials = 'IB'; initial.avatar_bg = 'var(--pink-400)';
    } else if (currentTab === 'sertifikat') {
      initial.image_url = ''; initial.title = ''; initial.sort_order = 0;
    }
    setFormFields(initial);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setEditId(item.id);
    // Strip timestamps/ids for direct payload edit
    const payload = { ...item };
    delete payload.id;
    delete payload.created_at;
    setFormFields(payload);
    setModalOpen(true);
  };

  const updateField = (key, value) => {
    setFormFields(prev => ({ ...prev, [key]: value }));
  };

  // --- TAB CONFIGURATION ---
  const tabMeta = {
    reservasi: { title: 'Reservasi Masuk', subtitle: 'Kelola dan konfirmasi semua janji temu ibu & bayi', hasAdd: false },
    member: { title: 'Pengelolaan Member', subtitle: 'Lihat daftar ibu yang terdaftar sebagai member eksklusif', hasAdd: false },
    artikel: { title: 'Daftar Artikel Edukasi', subtitle: 'Kelola konten edukasi dan tips perawatan ibu & anak', hasAdd: true },
    layanan: { title: 'Manajemen Layanan', subtitle: 'Atur paket terapi, pijat, serta biaya layanan', hasAdd: true },
    galeri: { title: 'Galeri Kegiatan', subtitle: 'Kelola dokumentasi foto kebahagiaan ibu & bayi', hasAdd: true },
    testimoni: { title: 'Ulasan & Testimoni', subtitle: 'Kelola testimoni kehangatan pelanggan di website', hasAdd: true },
    sertifikat: { title: 'Sertifikat & Lisensi', subtitle: 'Kelola dokumentasi bukti kompetensi profesionalisme owner', hasAdd: true },
    database: { title: 'Setup Database Helper', subtitle: 'Inisialisasi tabel Supabase untuk fitur dinamis', hasAdd: false }
  };

  // Format Helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/member');
  };

  // If loading session
  if (authLoading) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center', minHeight: '100vh', background: '#fcf8f9' }}>
        <h2 style={{ color: 'var(--pink-600)' }}>Memverifikasi Akses Admin...</h2>
      </div>
    );
  }

  // If not logged in, show Admin Login form
  if (!session) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#fcf8f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-card" style={{ maxWidth: '420px', width: '100%', margin: '0 auto', padding: '40px', background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.05)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src={img('/Image/LOGO INTAN MIRACLE colour italic.webp')} alt="Intan Miracle Logo" style={{ maxHeight: '60px', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Dashboard Admin</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Masuk dengan kredensial Administrator Anda</p>
          </div>
          <form onSubmit={handleAdminLogin}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Email Admin</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="admin@intanmiracle.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kata Sandi</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            {loginError && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '16px', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>
                ❌ {loginError}
              </p>
            )}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loginLoading}>
              {loginLoading ? 'Memproses Masuk...' : 'Masuk Dashboard'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/" style={{ color: 'var(--pink-600)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>🌐 Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  // If logged in but NOT admin (e.g. member email is active)
  if (!isAdmin) {
    return (
      <div style={{ padding: '100px 20px', minHeight: '100vh', background: '#fcf8f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto', padding: '40px', background: 'white', borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.1)', textAlign: 'center', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.05)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Akses Terbatas</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '12px 0 24px', lineHeight: 1.6, fontSize: '0.95rem' }}>
            Akun Anda (<strong>{session.user.email}</strong>) tidak memiliki izin akses Administrator.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={async () => { await supabase.auth.signOut(); }} className="btn btn-primary">
              🚪 Keluar & Gunakan Akun Lain
            </button>
            <Link to="/" className="btn btn-secondary">🌐 Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  const activeMeta = tabMeta[currentTab];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: '#fcf8f9' }}>
      
      {/* Sidebar Overlay (Mobile) */}
      {mobileSidebarActive && (
        <div className="sidebar-overlay active" onClick={() => setMobileSidebarActive(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarActive ? 'active' : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-brand">
          <img src={img('/Image/LOGO INTAN MIRACLE colour italic.webp')} alt="Intan Miracle Logo" />
        </div>
        <div className="sidebar-menu">
          <button className={`menu-item ${currentTab === 'reservasi' ? 'active' : ''}`} onClick={() => { setCurrentTab('reservasi'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">📅</span> Reservasi Masuk
          </button>
          <button className={`menu-item ${currentTab === 'member' ? 'active' : ''}`} onClick={() => { setCurrentTab('member'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">👥</span> Kelola Member
          </button>
          <button className={`menu-item ${currentTab === 'artikel' ? 'active' : ''}`} onClick={() => { setCurrentTab('artikel'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">📰</span> Kelola Artikel
          </button>
          <button className={`menu-item ${currentTab === 'layanan' ? 'active' : ''}`} onClick={() => { setCurrentTab('layanan'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">🌸</span> Kelola Layanan
          </button>
          <button className={`menu-item ${currentTab === 'galeri' ? 'active' : ''}`} onClick={() => { setCurrentTab('galeri'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">📸</span> Kelola Galeri
          </button>
          <button className={`menu-item ${currentTab === 'testimoni' ? 'active' : ''}`} onClick={() => { setCurrentTab('testimoni'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">💬</span> Kelola Testimoni
          </button>
          <button className={`menu-item ${currentTab === 'sertifikat' ? 'active' : ''}`} onClick={() => { setCurrentTab('sertifikat'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">📜</span> Kelola Sertifikat
          </button>
          <button className={`menu-item ${currentTab === 'database' ? 'active' : ''}`} onClick={() => { setCurrentTab('database'); setMobileSidebarActive(false); }}>
            <span className="menu-icon">🛠️</span> Setup Database
          </button>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>Keluar</button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="admin-main" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <header className="admin-header">
          <button className="mobile-toggle" onClick={() => setMobileSidebarActive(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="header-title">
            <h1>{activeMeta.title}</h1>
            <p>{activeMeta.subtitle}</p>
          </div>
          <div className="header-actions">
            {activeMeta.hasAdd && (
              <button onClick={openAddModal} className="btn btn-primary">
                ➕ Tambah {activeMeta.title.replace('Daftar ', '').replace('Manajemen ', '').replace('Ulasan & ', '')}
              </button>
            )}
            <Link to="/" className="btn btn-secondary">🌐 Beranda</Link>
          </div>
        </header>

        <div className="admin-content" style={{ padding: '40px' }}>
          
          {/* 1. RESERVASI TAB */}
          {currentTab === 'reservasi' && (
            <div className="tab-panel active">
              {/* Stats Row */}
              <div className="admin-stats">
                <div className="admin-stat-card">
                  <div className="stat-icon">📈</div>
                  <div className="stat-info">
                    <h3>Total Reservasi</h3>
                    <p>{stats.totalRes}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>⌛</div>
                  <div className="stat-info">
                    <h3>Pending</h3>
                    <p style={{ color: '#d97706' }}>{stats.pendingRes}</p>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon" style={{ background: '#dbeafe', color: '#1d4ed8' }}>📅</div>
                  <div className="stat-info">
                    <h3>Bulan Ini</h3>
                    <p style={{ color: '#1d4ed8' }}>{stats.monthRes}</p>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="admin-card">
                <div className="card-header">
                  <h2>Daftar Janji Temu Terbaru</h2>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Jadwal</th>
                        <th>Klien (Mom & Baby)</th>
                        <th>WhatsApp & Alamat</th>
                        <th>Layanan</th>
                        <th>Status</th>
                        <th>Ubah Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>Belum ada reservasi masuk.</td>
                        </tr>
                      ) : (
                        reservations.map((res) => (
                          <tr key={res.id}>
                            <td>
                              <strong>{formatDate(res.tanggal)}</strong><br />
                              <small style={{ color: 'var(--text-muted)', fontWeight: 500 }}>⏰ {res.jam}</small>
                            </td>
                            <td>
                              <strong>{res.nama_ibu}</strong><br />
                              <small style={{ color: 'var(--text-secondary)' }}>👶 {res.nama_bayi || '-'} ({res.usia_bayi || '-'})</small>
                            </td>
                            <td>
                              <a href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink-600)', fontWeight: 600, textDecoration: 'none' }}>
                                💬 {res.whatsapp}
                              </a><br />
                              <small style={{ display: 'block', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }} title={res.alamat}>📍 {res.alamat}</small>
                            </td>
                            <td><span style={{ fontWeight: 500 }}>{res.layanan}</span></td>
                            <td><span className={`status-badge status-${res.status}`}>{res.status}</span></td>
                            <td>
                              <select 
                                className="status-select" 
                                value={res.status} 
                                onChange={(e) => handleStatusChange(res.id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirm</option>
                                <option value="completed">Done</option>
                                <option value="cancelled">Cancel</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. MEMBER TAB */}
          {currentTab === 'member' && (
            <div className="tab-panel active">
              <div className="admin-card">
                <div className="card-header">
                  <h2>Member Terdaftar</h2>
                </div>
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID Member</th>
                        <th>Nama Ibu</th>
                        <th>Data Si Kecil</th>
                        <th>WhatsApp</th>
                        <th>Alamat Rumah</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>Belum ada member terdaftar.</td>
                        </tr>
                      ) : (
                        members.map((mem) => (
                          <tr key={mem.id}>
                            <td><span style={{ fontFamily: 'monospace' }}>{mem.id.substring(0, 8)}...</span></td>
                            <td><strong>{mem.nama_ibu || 'Member Baru'}</strong></td>
                            <td>{mem.nama_bayi || '-'} <small style={{ color: 'var(--text-muted)' }}>({mem.usia_bayi || '-'})</small></td>
                            <td>
                              <a href={`https://wa.me/${(mem.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink-600)', fontWeight: 600, textDecoration: 'none' }}>
                                💬 {mem.whatsapp || '-'}
                              </a>
                            </td>
                            <td><small style={{ display: 'block', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={mem.alamat}>{mem.alamat || '-'}</small></td>
                            <td>
                              <button onClick={() => handleDeleteItem('members', mem.id)} className="btn btn-secondary btn-small btn-danger">Hapus</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. ARTIKEL TAB */}
          {currentTab === 'artikel' && (
            <div className="tab-panel active">
              <div className="admin-grid" style={{ padding: 0 }}>
                {articles.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Belum ada artikel terbit.</div>
                ) : (
                  articles.map((art) => (
                    <div className="data-card" key={art.id}>
                      <div className="card-image-wrapper">
                        <img src={art.image_url} alt={art.title} />
                        <span className="card-tag">{art.category}</span>
                      </div>
                      <div className="card-content">
                        <div className="card-meta">✍️ {art.author} | 📅 {formatDate(art.created_at)}</div>
                        <h3>{art.title}</h3>
                        <p>{art.summary.substring(0, 100)}...</p>
                        <div className="card-footer-actions">
                          <button onClick={() => openEditModal(art)} className="btn btn-secondary btn-small btn-warning">✏️ Edit</button>
                          <button onClick={() => handleDeleteItem('articles', art.id)} className="btn btn-secondary btn-small btn-danger">🗑️ Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 4. LAYANAN TAB */}
          {currentTab === 'layanan' && (
            <div className="tab-panel active">
              <div className="admin-grid" style={{ padding: 0 }}>
                {services.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Belum ada layanan terdaftar.</div>
                ) : (
                  services.map((srv) => (
                    <div className="data-card" key={srv.id}>
                      <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ fontSize: '1.8rem' }}>{srv.icon || '🌸'}</span>
                          <span className="card-tag" style={{ position: 'static', textTransform: 'uppercase' }}>{srv.category === 'baby' ? 'Bayi' : 'Ibu'}</span>
                        </div>
                        <h3>{srv.name}</h3>
                        <div className="card-price">Rp{parseInt(srv.price).toLocaleString('id-ID')}</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{srv.description}</p>
                        <div className="card-meta">⏱️ Durasi: {srv.duration || '-'}</div>
                        <div className="card-footer-actions">
                          <button onClick={() => openEditModal(srv)} className="btn btn-secondary btn-small btn-warning">✏️ Edit</button>
                          <button onClick={() => handleDeleteItem('services', srv.id)} className="btn btn-secondary btn-small btn-danger">🗑️ Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 5. GALERI TAB */}
          {currentTab === 'galeri' && (
            <div className="tab-panel active">
              <div className="admin-grid" style={{ padding: 0 }}>
                {gallery.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Belum ada foto galeri terdaftar.</div>
                ) : (
                  gallery.map((item) => (
                    <div className="data-card" key={item.id}>
                      <div className="card-image-wrapper" style={{ height: '220px' }}>
                        <img src={item.image_url} alt="Foto Galeri" />
                      </div>
                      <div className="card-content" style={{ padding: '16px' }}>
                        <p style={{ fontWeight: 500, fontSize: '0.85rem', marginBottom: '12px' }}>{item.caption || '-'}</p>
                        <div className="card-footer-actions">
                          <button onClick={() => handleDeleteItem('gallery', item.id)} className="btn btn-secondary btn-small btn-danger" style={{ width: '100%' }}>🗑️ Hapus Foto</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 6. TESTIMONI TAB */}
          {currentTab === 'testimoni' && (
            <div className="tab-panel active">
              <div className="admin-grid" style={{ padding: 0 }}>
                {testimonials.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Belum ada testimoni klien.</div>
                ) : (
                  testimonials.map((tst) => (
                    <div className="data-card" key={tst.id}>
                      <div className="card-content">
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                          <div className="testi-avatar-preview" style={{ background: tst.avatar_bg || 'var(--pink-400)' }}>
                            {tst.avatar_initials || 'IB'}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{tst.author_name}</h4>
                            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>🌟 {tst.category}</small>
                          </div>
                        </div>
                        <div style={{ color: '#f59e0b', marginBottom: '10px' }}>{'★'.repeat(tst.stars || 5)}</div>
                        <p style={{ fontSize: '0.85rem', lineHeight: 1.5, fontStyle: 'italic' }}>"{tst.content}"</p>
                        <div className="card-footer-actions">
                          <button onClick={() => openEditModal(tst)} className="btn btn-secondary btn-small btn-warning">✏️ Edit</button>
                          <button onClick={() => handleDeleteItem('testimonials', tst.id)} className="btn btn-secondary btn-small btn-danger">🗑️ Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 7. SERTIFIKAT TAB */}
          {currentTab === 'sertifikat' && (
            <div className="tab-panel active">
              <div className="admin-grid" style={{ padding: 0 }}>
                {certificates.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Belum ada sertifikat owner terdaftar.</div>
                ) : (
                  certificates.map((cert) => (
                    <div className="data-card" key={cert.id}>
                      <div className="card-image-wrapper" style={{ height: '220px', background: '#fff' }}>
                        <img src={cert.image_url} alt={cert.title} style={{ objectFit: 'contain', padding: '10px' }} />
                      </div>
                      <div className="card-content" style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '0.95rem', marginBottom: '6px' }}>{cert.title}</h3>
                        <div className="card-meta">Order Urutan: <strong>{cert.sort_order}</strong></div>
                        <div className="card-footer-actions">
                          <button onClick={() => openEditModal(cert)} className="btn btn-secondary btn-small btn-warning">✏️ Edit</button>
                          <button onClick={() => handleDeleteItem('certificates', cert.id)} className="btn btn-secondary btn-small btn-danger">🗑️ Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 8. DATABASE SETUP TAB */}
          {currentTab === 'database' && (
            <div className="tab-panel active">
              <div className="admin-card sql-box-wrapper" style={{ padding: '32px' }}>
                <p className="sql-desc">Supabase membutuhkan skema tabel dan kebijakan Row Level Security (RLS) di bawah ini untuk beroperasi secara dinamis. Silakan salin SQL dan jalankan di SQL Editor dashboard Supabase Anda.</p>
                <div className="sql-code-container" style={{ position: 'relative', background: '#1e1e1e', padding: '24px', borderRadius: '16px' }}>
                  <button 
                    onClick={(e) => {
                      const preElement = e.currentTarget.parentElement.querySelector('pre');
                      navigator.clipboard.writeText(preElement.innerText);
                      alert('✅ SQL disalin!');
                    }} 
                    className="copy-btn"
                  >
                    📋 Salin SQL
                  </button>
                  <pre className="sql-code">
{`-- ============================================
-- INTAN MIRACLE CARE — Database Setup Schema
-- Run this in your Supabase SQL Editor to initialize.
-- ============================================

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT NOT NULL,
    author TEXT DEFAULT 'Bdn. Intan Purnama Sari, S.Keb., CBMT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC NOT NULL,
    description TEXT NOT NULL,
    duration TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create gallery table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    stars INTEGER DEFAULT 5,
    avatar_initials TEXT,
    avatar_bg TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 6. Setup Storage Buckets
-- ============================================

-- Create public storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('articles', 'articles', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage Buckets
-- Drop existing policies if they exist first
DROP POLICY IF EXISTS "Public Read Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Insert Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Objects" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Objects" ON storage.objects;

-- Allow public select/read access to these buckets
CREATE POLICY "Public Read Objects" ON storage.objects
  FOR SELECT TO public USING (bucket_id IN ('articles', 'gallery', 'certificates'));

-- Allow authenticated users to perform insert, update, delete
CREATE POLICY "Admin Insert Objects" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('articles', 'gallery', 'certificates'));

CREATE POLICY "Admin Update Objects" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates'));

CREATE POLICY "Admin Delete Objects" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id IN ('articles', 'gallery', 'certificates'));
`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* --- ADD / EDIT MODAL --- */}
      {modalOpen && (
        <div className="modal active" onClick={() => setModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'Tambah Data Baru' : 'Ubah Data'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleFormSubmit}>
              <div className="modal-body" style={{ padding: '32px' }}>
                
                {/* --- ARTIVEL FORM FIELDS --- */}
                {currentTab === 'artikel' && (
                  <>
                    <div className="form-group">
                      <label>Judul Artikel</label>
                      <input type="text" className="form-control" value={formFields.title || ''} onChange={(e) => updateField('title', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Slug URL (Opsional)</label>
                      <input type="text" className="form-control" placeholder="Contoh: tips-pijat-bayi-newborn" value={formFields.slug || ''} onChange={(e) => updateField('slug', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Kategori</label>
                      <select className="form-control" value={formFields.category || ''} onChange={(e) => updateField('category', e.target.value)}>
                        <option value="Perawatan Bayi">Perawatan Bayi</option>
                        <option value="Tips Ibu Baru">Tips Ibu Baru</option>
                        <option value="Laktasi">Laktasi</option>
                        <option value="Perawatan Ibu">Perawatan Ibu</option>
                        <option value="Kehamilan">Kehamilan</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ringkasan Pendek</label>
                      <input type="text" className="form-control" value={formFields.summary || ''} onChange={(e) => updateField('summary', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Gambar Banner</label>
                      {formFields.image_url && (
                        <div style={{ marginBottom: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', width: '120px', height: '80px' }}>
                          <img src={formFields.image_url} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'articles')}
                            disabled={uploading}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--pink-600)' }}>⏳ Sedang mengunggah ke bucket 'articles'...</span>}
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Atau tempel URL gambar di sini" 
                          value={formFields.image_url || ''} 
                          onChange={(e) => updateField('image_url', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Isi Lengkap Artikel (Mendukung HTML)</label>
                      <textarea className="form-control" rows="6" value={formFields.content || ''} onChange={(e) => updateField('content', e.target.value)} required></textarea>
                    </div>
                  </>
                )}

                {/* --- LAYANAN FORM FIELDS --- */}
                {currentTab === 'layanan' && (
                  <>
                    <div className="form-group">
                      <label>Nama Layanan</label>
                      <input type="text" className="form-control" value={formFields.name || ''} onChange={(e) => updateField('name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Kategori</label>
                      <select className="form-control" value={formFields.category || ''} onChange={(e) => updateField('category', e.target.value)}>
                        <option value="baby">Bayi</option>
                        <option value="mom">Ibu</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Biaya (IDR)</label>
                      <input type="number" className="form-control" value={formFields.price || 0} onChange={(e) => updateField('price', parseFloat(e.target.value))} required />
                    </div>
                    <div className="form-group">
                      <label>Deskripsi Layanan</label>
                      <textarea className="form-control" rows="3" value={formFields.description || ''} onChange={(e) => updateField('description', e.target.value)} required></textarea>
                    </div>
                    <div className="form-group">
                      <label>Durasi (Opsional)</label>
                      <input type="text" className="form-control" placeholder="Contoh: 60 Menit" value={formFields.duration || ''} onChange={(e) => updateField('duration', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Icon Emoji</label>
                      <input type="text" className="form-control" placeholder="Contoh: 👶" value={formFields.icon || ''} onChange={(e) => updateField('icon', e.target.value)} required />
                    </div>
                  </>
                )}

                {/* --- GALERI FORM FIELDS --- */}
                {currentTab === 'galeri' && (
                  <>
                    <div className="form-group">
                      <label>Gambar Galeri</label>
                      {formFields.image_url && (
                        <div style={{ marginBottom: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', width: '100px', height: '100px' }}>
                          <img src={formFields.image_url} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'gallery')}
                            disabled={uploading}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--pink-600)' }}>⏳ Sedang mengunggah ke bucket 'gallery'...</span>}
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Atau tempel URL gambar di sini" 
                          value={formFields.image_url || ''} 
                          onChange={(e) => updateField('image_url', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Caption Foto (Opsional)</label>
                      <input type="text" className="form-control" value={formFields.caption || ''} onChange={(e) => updateField('caption', e.target.value)} />
                    </div>
                  </>
                )}

                {/* --- TESTIMONI FORM FIELDS --- */}
                {currentTab === 'testimoni' && (
                  <>
                    <div className="form-group">
                      <label>Nama Penulis</label>
                      <input type="text" className="form-control" value={formFields.author_name || ''} onChange={(e) => updateField('author_name', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Kategori Layanan</label>
                      <input type="text" className="form-control" placeholder="Contoh: Pijat Bayi, Laktasi Massage" value={formFields.category || ''} onChange={(e) => updateField('category', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Bintang Rating</label>
                      <input type="number" min="1" max="5" className="form-control" value={formFields.stars || 5} onChange={(e) => updateField('stars', parseInt(e.target.value, 10))} required />
                    </div>
                    <div className="form-group">
                      <label>Inisial Avatar</label>
                      <input type="text" maxLength="2" className="form-control" placeholder="Contoh: AS" value={formFields.avatar_initials || ''} onChange={(e) => updateField('avatar_initials', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Warna Background Avatar</label>
                      <input type="text" className="form-control" placeholder="Contoh: var(--pink-400) atau #f87171" value={formFields.avatar_bg || ''} onChange={(e) => updateField('avatar_bg', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Isi Ulasan / Testimoni</label>
                      <textarea className="form-control" rows="4" value={formFields.content || ''} onChange={(e) => updateField('content', e.target.value)} required></textarea>
                    </div>
                  </>
                )}

                {/* --- SERTIFIKAT FORM FIELDS --- */}
                {currentTab === 'sertifikat' && (
                  <>
                    <div className="form-group">
                      <label>Judul Sertifikat</label>
                      <input type="text" className="form-control" value={formFields.title || ''} onChange={(e) => updateField('title', e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label>Gambar Sertifikat</label>
                      {formFields.image_url && (
                        <div style={{ marginBottom: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', width: '120px', height: '80px', background: '#fff' }}>
                          <img src={formFields.image_url} alt="Pratinjau" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'certificates')}
                            disabled={uploading}
                            style={{ fontSize: '0.85rem' }}
                          />
                        </div>
                        {uploading && <span style={{ fontSize: '0.8rem', color: 'var(--pink-600)' }}>⏳ Sedang mengunggah ke bucket 'certificates'...</span>}
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Atau tempel URL gambar di sini" 
                          value={formFields.image_url || ''} 
                          onChange={(e) => updateField('image_url', e.target.value)} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Urutan Urut (Mulai dari 0)</label>
                      <input type="number" className="form-control" value={formFields.sort_order || 0} onChange={(e) => updateField('sort_order', parseInt(e.target.value, 10))} required />
                    </div>
                  </>
                )}

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
