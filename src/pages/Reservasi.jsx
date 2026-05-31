import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Reservasi() {
  const [namaIbu, setNamaIbu] = useState('');
  const [namaBayi, setNamaBayi] = useState('');
  const [usiaBayi, setUsiaBayi] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [layanan, setLayanan] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [jam, setJam] = useState('');
  const [alamat, setAlamat] = useState('');
  const [catatan, setCatatan] = useState('');

  // UI state
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMin, setSelectedMin] = useState('00');
  const [submitStatus, setSubmitStatus] = useState(' Kirim Reservasi');
  const [loading, setLoading] = useState(false);

  const hourColRef = useRef(null);
  const minColRef = useRef(null);

  // Run scroll animations
  useScrollAnimation();

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
          setWhatsapp(profile.whatsapp || '');
          setAlamat(profile.alamat || '');
        }
      }
    }
    checkAndPrefillMember();
  }, []);

  // Time picker options
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const mins = ['00', '15', '30', '45'];

  const handleHourScroll = () => {
    if (!hourColRef.current) return;
    const index = Math.round(hourColRef.current.scrollTop / 44);
    if (hours[index]) {
      setSelectedHour(hours[index]);
    }
  };

  const handleMinScroll = () => {
    if (!minColRef.current) return;
    const index = Math.round(minColRef.current.scrollTop / 44);
    if (mins[index]) {
      setSelectedMin(mins[index]);
    }
  };

  const selectHourOption = (h, index) => {
    setSelectedHour(h);
    if (hourColRef.current) {
      hourColRef.current.scrollTo({ top: index * 44, behavior: 'smooth' });
    }
  };

  const selectMinOption = (m, index) => {
    setSelectedMin(m);
    if (minColRef.current) {
      minColRef.current.scrollTo({ top: index * 44, behavior: 'smooth' });
    }
  };

  const confirmTime = () => {
    setJam(`${selectedHour}:${selectedMin}`);
    setTimePickerOpen(false);
  };

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

    const reservationData = {
      user_id: userId,
      nama_ibu: namaIbu,
      nama_bayi: namaBayi,
      usia_bayi: usiaBayi,
      whatsapp,
      layanan,
      tanggal,
      jam,
      alamat,
      catatan
    };

    const { error } = await supabase
      .from('reservations')
      .insert(reservationData);

    if (error) {
      console.error('Error saving reservation:', error);
    }

    // WA Message structure exactly matching original
    const message =
`Halo Intan Miracle! 🌸

👤 Nama Ibu     : ${namaIbu}
👶 Nama Bayi    : ${namaBayi || '-'}
🍼 Usia Bayi    : ${usiaBayi || '-'}
✨ Layanan      : ${layanan}
📅 Tanggal      : ${tanggal}
⏰ Jam          : ${jam}
📍 Alamat       : ${alamat}
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="tanggal">📅 Tanggal</label>
                    <input 
                      type="date" 
                      id="tanggal" 
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group" style={{ position: 'relative' }}>
                    <label htmlFor="jam">⏰ Jam</label>
                    <input 
                      type="text" 
                      id="jam" 
                      placeholder="Pilih jam" 
                      readOnly 
                      value={jam}
                      onClick={() => setTimePickerOpen(true)}
                      style={{ cursor: 'pointer' }}
                      required
                    />

                    {/* Custom Scrollable Time Picker Modal */}
                    {timePickerOpen && (
                      <div className="time-picker-modal active" onClick={() => setTimePickerOpen(false)}>
                        <div className="time-picker-content" onClick={(e) => e.stopPropagation()}>
                          <div className="time-picker-header">
                            <h4>Pilih Jam Layanan</h4>
                            <button type="button" className="close-picker" onClick={() => setTimePickerOpen(false)}>&times;</button>
                          </div>
                          <div className="time-scroller-wrapper">
                            <div className="time-selection-indicator"></div>
                            
                            <div 
                              className="time-column" 
                              id="hourColumn" 
                              ref={hourColRef}
                              onScroll={handleHourScroll}
                            >
                              {hours.map((h, i) => (
                                <div 
                                  className={`time-option ${selectedHour === h ? 'active' : ''}`}
                                  key={i}
                                  onClick={() => selectHourOption(h, i)}
                                >
                                  {h}
                                </div>
                              ))}
                            </div>
                            
                            <div className="time-column-divider">:</div>
                            
                            <div 
                              className="time-column" 
                              id="minColumn" 
                              ref={minColRef}
                              onScroll={handleMinScroll}
                            >
                              {mins.map((m, i) => (
                                <div 
                                  className={`time-option ${selectedMin === m ? 'active' : ''}`}
                                  key={i}
                                  onClick={() => selectMinOption(m, i)}
                                >
                                  {m}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button 
                            type="button" 
                            className="btn btn-primary confirm-time"
                            onClick={confirmTime}
                            style={{ width: '100%', marginTop: '20px', padding: '10px' }}
                          >
                            Pilih Waktu
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                  disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                >
                  {submitStatus}
                </button>
              </form>
            </div>

            {/* Side Instructions card */}
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
                      <h4>Terapis Datang</h4>
                      <p>Terapis akan datang ke alamat Anda sesuai jadwal yang disepakati</p>
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
                  <li style={{ paddingLeft: '20px', position: 'relative' }}><span style={{ position: 'absolute', left: 0 }}>•</span>Tersedia layanan ke rumah</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
