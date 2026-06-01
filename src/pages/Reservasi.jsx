import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';

const CLINIC_ADDRESS = 'Jl. Kranggan Gg. Ili No.135, RT.003/RW.3, Jatirangga, Kec. Jatisampurna, Kota Bks, Jawa Barat 17434';

const TIME_SLOTS = [
  { label: 'Reservasi 1', time: '08:00' },
  { label: 'Reservasi 2', time: '11:00' },
  { label: 'Reservasi 3', time: '14:00' },
  { label: 'Reservasi 4', time: '17:00' },
];

export default function Reservasi() {
  const [tipeLayanan, setTipeLayanan] = useState('homecare');
  const [namaIbu, setNamaIbu] = useState('');
  const [namaBayi, setNamaBayi] = useState('');
  const [usiaBayi, setUsiaBayi] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [layanan, setLayanan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [alamat, setAlamat] = useState('');
  const [catatan, setCatatan] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  // UI state
  const [submitStatus, setSubmitStatus] = useState('📩 Kirim Reservasi');
  const [loading, setLoading] = useState(false);

  // Run scroll animations
  useScrollAnimation([tipeLayanan]);

  // Prefill Member Info
  useEffect(() => {
    async function checkAndPrefillMember() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('members')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setNamaIbu(profile.nama_ibu || '');
          setNamaBayi(profile.nama_bayi || '');
          setUsiaBayi(profile.usia_bayi || '');
          setJenisKelamin(profile.jenis_kelamin_bayi || '');
          setWhatsapp(profile.whatsapp || '');
          setAlamat(profile.alamat || '');
        }
      }
    }
    checkAndPrefillMember();
  }, []);

  // Fetch booked slots for the selected date
  useEffect(() => {
    if (!tanggal) {
      setBookedSlots([]);
      return;
    }
    async function fetchBookedSlots() {
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('jam')
          .eq('tanggal', tanggal)
          .neq('status', 'cancelled')
          .neq('status', 'rejected');

        if (!error && data) {
          const booked = data.map(r => r.jam);
          setBookedSlots(booked);
          if (jam && booked.includes(jam)) {
            setJam('');
          }
        }
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    }
    fetchBookedSlots();
  }, [tanggal, jam]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus('⌛ Memproses Reservasi...');

    // Save to Database
    let userId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) userId = session.user.id;
    } catch (err) {
      console.error(err);
    }

    const finalAlamat = tipeLayanan === 'clinic' ? CLINIC_ADDRESS : alamat;
    const tipeLabel = tipeLayanan === 'homecare' ? 'Homecare Service' : 'Clinic Care Service';

    const reservationData = {
      user_id: userId,
      nama_ibu: namaIbu,
      nama_bayi: namaBayi,
      usia_bayi: usiaBayi,
      jenis_kelamin: jenisKelamin,
      tipe_layanan: tipeLayanan,
      whatsapp,
      layanan,
      tanggal,
      jam,
      alamat: finalAlamat,
      catatan
    };

    const { error } = await supabase
      .from('reservations')
      .insert(reservationData);

    if (error) {
      console.error('Error saving reservation:', error);
    }

    // WA Message
    const message =
`Halo Intan Miracle! 🌸

🏥 Tipe Layanan  : ${tipeLabel}
👤 Nama Ibu     : ${namaIbu}
👶 Nama Bayi    : ${namaBayi || '-'}
🍼 Usia Bayi    : ${usiaBayi || '-'}
🚻 Jenis Kelamin: ${jenisKelamin || '-'}
✨ Layanan      : ${layanan}
📅 Tanggal      : ${tanggal}
⏰ Jam          : ${jam}
📍 Alamat       : ${finalAlamat}
📝 Catatan      : ${catatan || '-'}

Terima kasih! ✨`;

    const waNumber = '6285267474943';
    const waURL = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // Set Success State
    setTimeout(() => {
      setSubmitStatus('✅ Reservasi Berhasil!');
      
      // Reset form
      setNamaIbu('');
      setNamaBayi('');
      setUsiaBayi('');
      setJenisKelamin('');
      setWhatsapp('');
      setLayanan('');
      setTanggal('');
      setJam('');
      setAlamat('');
      setCatatan('');
      setLoading(false);

      // Open WhatsApp
      window.open(waURL, '_blank');

      setTimeout(() => {
        setSubmitStatus('📩 Kirim Reservasi');
      }, 5000);
    }, 1000);
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="text-gradient">Reservasi</h1>
          <p>Reservasi mudah, perawatan penuh kasih</p>
        </div>
      </section>

      {/* Reservation Section */}
      <section className="section">
        <div className="container">
          <div className="reservation-wrapper">
            {/* Form */}
            <div className="form-card animate-on-scroll">
              <h3>📅 Form Reservasi</h3>
              <p>Isi data di bawah ini untuk memulai reservasi layanan</p>
              
              <form onSubmit={handleFormSubmit}>
                {/* Service Type Toggle */}
                <div className="form-group">
                  <label>🏥 Tipe Layanan</label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setTipeLayanan('homecare')}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: `2px solid ${tipeLayanan === 'homecare' ? 'var(--pink-500)' : 'var(--pink-200)'}`,
                        background: tipeLayanan === 'homecare' ? 'var(--pink-50)' : 'white',
                        color: tipeLayanan === 'homecare' ? 'var(--pink-700)' : 'var(--text-secondary)',
                        fontWeight: tipeLayanan === 'homecare' ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      🏠 Homecare Service
                      <br />
                      <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.8 }}>Terapis datang ke rumah Anda</small>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipeLayanan('clinic')}
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-lg)',
                        border: `2px solid ${tipeLayanan === 'clinic' ? 'var(--pink-500)' : 'var(--pink-200)'}`,
                        background: tipeLayanan === 'clinic' ? 'var(--pink-50)' : 'white',
                        color: tipeLayanan === 'clinic' ? 'var(--pink-700)' : 'var(--text-secondary)',
                        fontWeight: tipeLayanan === 'clinic' ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        lineHeight: 1.4,
                      }}
                    >
                      🏥 Clinic Care Service
                      <br />
                      <small style={{ fontWeight: 400, fontSize: '0.75rem', opacity: 0.8 }}>Anda datang ke klinik kami</small>
                    </button>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="namaIbu">👤 Nama Ibu</label>
                    <input 
                      type="text" 
                      id="namaIbu" 
                      placeholder="Masukkan nama lengkap" 
                      value={namaIbu}
                      onChange={(e) => setNamaIbu(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="namaBayi">👶 Nama Bayi</label>
                    <input 
                      type="text" 
                      id="namaBayi" 
                      placeholder="Masukkan nama bayi"
                      value={namaBayi}
                      onChange={(e) => setNamaBayi(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="usiaBayi">🍼 Usia Bayi</label>
                    <input 
                      type="text" 
                      id="usiaBayi" 
                      placeholder="Contoh: 3 bulan"
                      value={usiaBayi}
                      onChange={(e) => setUsiaBayi(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="jenisKelamin">🚻 Jenis Kelamin Bayi</label>
                    <select 
                      id="jenisKelamin" 
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value)}
                    >
                      <option value="">— Pilih —</option>
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="whatsapp">📞 Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      id="whatsapp" 
                      placeholder="08xx-xxxx-xxxx"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="layanan">✨ Pilih Layanan</label>
                    <select 
                      id="layanan" 
                      value={layanan}
                      onChange={(e) => setLayanan(e.target.value)}
                      required
                    >
                      <option value="" disabled>— Pilih layanan —</option>
                      <optgroup label="👶 Pelayanan Bayi">
                        <option value="Baby Massage">Baby Massage</option>
                        <option value="Baby Gym">Baby Gym</option>
                        <option value="Baby Swim">Baby Swim</option>
                        <option value="Baby Spa">Baby Spa (Massage + Gym + Swim)</option>
                        <option value="Baby Therapy Massage">Baby Therapy Massage</option>
                        <option value="Cukur Bayi">Cukur Bayi</option>
                        <option value="Tindik Bayi">Tindik Bayi</option>
                        <option value="Perawatan Bayi Baru Lahir (Homecare)">Perawatan Bayi Baru Lahir (Homecare)</option>
                      </optgroup>
                      <optgroup label="🤍 Pelayanan Ibu">
                        <option value="Pijat Ibu Hamil">Pijat Ibu Hamil</option>
                        <option value="Pijat Ibu Nifas">Pijat Ibu Nifas</option>
                        <option value="Bengkung">Bengkung</option>
                      </optgroup>
                      <optgroup label="🤱 Konselor Laktasi">
                        <option value="Konsultasi Menyusui">Konsultasi Menyusui</option>
                        <option value="Pijat Laktasi">Pijat Laktasi</option>
                        <option value="Paket Lengkap Laktasi">Paket Lengkap</option>
                        <option value="Paket Lengkap Laktasi (Homecare)">Paket Lengkap (Homecare)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tanggal">📅 Tanggal</label>
                    <input 
                      type="date" 
                      id="tanggal" 
                      value={tanggal}
                      min={today}
                      onChange={(e) => setTanggal(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>⏰ Pilih Jam</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                      {TIME_SLOTS.map((slot) => {
                        const isBooked = bookedSlots.includes(slot.time);
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setJam(slot.time)}
                            style={{
                              padding: '12px 8px',
                              borderRadius: 'var(--radius-md)',
                              border: isBooked 
                                ? '2px solid var(--pink-100)'
                                : `2px solid ${jam === slot.time ? 'var(--pink-500)' : 'var(--pink-200)'}`,
                              background: isBooked
                                ? '#f3f4f6'
                                : jam === slot.time ? 'var(--pink-50)' : 'white',
                              color: isBooked
                                ? '#9ca3af'
                                : jam === slot.time ? 'var(--pink-700)' : 'var(--text-secondary)',
                              fontWeight: jam === slot.time ? 700 : 500,
                              cursor: isBooked ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.85rem',
                              textAlign: 'center',
                              textDecoration: isBooked ? 'line-through' : 'none',
                              opacity: isBooked ? 0.7 : 1,
                            }}
                          >
                            <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{slot.time}</div>
                            <small style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                              {isBooked ? '🚫 Penuh' : slot.label}
                            </small>
                          </button>
                        );
                      })}
                    </div>
                    {/* Hidden required input for form validation */}
                    <input 
                      type="hidden" 
                      value={jam} 
                      required 
                    />
                    {!jam && (
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                        Silakan pilih salah satu slot waktu di atas
                      </small>
                    )}
                  </div>
                </div>

                {/* Address - only for Homecare */}
                {tipeLayanan === 'homecare' && (
                  <div className="form-group">
                    <label htmlFor="alamat">📍 Alamat Lengkap</label>
                    <textarea 
                      id="alamat" 
                      rows="3" 
                      placeholder="Masukkan alamat lengkap untuk layanan ke rumah"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                    ></textarea>
                  </div>
                )}

                {/* Clinic address info */}
                {tipeLayanan === 'clinic' && (
                  <div style={{
                    background: 'var(--pink-50)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px 20px',
                    border: '1px solid var(--pink-200)',
                    marginBottom: '16px',
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>
                    <strong style={{ color: 'var(--pink-700)' }}>📍 Lokasi Klinik:</strong><br />
                    {CLINIC_ADDRESS}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="catatan">📝 Catatan Khusus</label>
                  <textarea 
                    id="catatan" 
                    rows="2" 
                    placeholder="Catatan tambahan (opsional)"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg" 
                  disabled={loading || !jam}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {submitStatus}
                </button>
              </form>
            </div>

            {/* Side Instructions card — Dynamic based on service type */}
            <div>
              <div className="procedure-card animate-on-scroll" style={{ marginBottom: '28px' }}>
                <h3>📋 Prosedur Reservasi</h3>
                <div className="procedure-steps">
                  <div className="procedure-step">
                    <div className="step-number">1</div>
                    <div>
                      <h4>Isi Formulir</h4>
                      <p>Lengkapi data diri dan pilih layanan yang diinginkan</p>
                    </div>
                  </div>
                  <div className="procedure-step">
                    <div className="step-number">2</div>
                    <div>
                      <h4>Konfirmasi Admin</h4>
                      <p>Admin kami akan menghubungi Anda via WhatsApp untuk konfirmasi</p>
                    </div>
                  </div>
                  <div className="procedure-step">
                    <div className="step-number">3</div>
                    <div>
                      {tipeLayanan === 'homecare' ? (
                        <>
                          <h4>Terapis Datang</h4>
                          <p>Terapis akan datang ke alamat Anda sesuai jadwal yang disepakati</p>
                        </>
                      ) : (
                        <>
                          <h4>Datang ke Klinik</h4>
                          <p>Silakan datang ke klinik kami di:<br /><strong style={{ color: 'var(--pink-600)', fontSize: '0.85rem' }}>{CLINIC_ADDRESS}</strong></p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="procedure-step">
                    <div className="step-number">4</div>
                    <div>
                      <h4>Pembayaran</h4>
                      <p>Pembayaran dilakukan setelah layanan selesai</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Card */}
              <div className="animate-on-scroll" style={{ background: 'var(--pink-50)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--pink-200)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💡</div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '8px', color: 'var(--pink-700)' }}>Informasi Penting</h4>
                <ul style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.9' }}>
                  <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Layanan tersedia setiap hari</li>
                  <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Reservasi minimal H-1</li>
                  <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Pembatalan gratis H-1</li>
                  <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Slot waktu: 08:00, 11:00, 14:00, 17:00</li>
                  {tipeLayanan === 'homecare' && (
                    <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Tersedia layanan ke rumah</li>
                  )}
                  {tipeLayanan === 'clinic' && (
                    <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Pasien datang langsung ke lokasi klinik</li>
                  )}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
