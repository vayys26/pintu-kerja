/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  User, 
  Bell, 
  MapPin, 
  ChevronRight, 
  CheckCircle, 
  Heart, 
  X,
  Play,
  MessageSquare,
  BookOpen,
  Filter,
  ArrowRight,
  Camera,
  Send,
  Navigation as NavigationIcon,
  LogOut,
  Upload,
  ChevronLeft
} from 'lucide-react';
import { Job, ViewState, TabState, UserProfile, Application, UserRole, Experience, Message } from './types';
import { MOCK_JOBS, CATEGORIES, THEME, MOCK_CANDIDATES } from './constants';

// --- Components ---

const RoleSelection = ({ onSelect, onLogin }: { onSelect: (role: UserRole) => void; onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-navy mb-2">Selamat Datang!</h2>
      <p className="text-slate-500 mb-12">Pilih bagaimana Anda ingin menggunakan Pintu Kerja.</p>
      
      <div className="space-y-4">
        <button 
          onClick={() => onSelect('applicant')}
          className="w-full p-8 rounded-3xl border-2 border-slate-100 hover:border-navy bg-slate-50 transition-all flex flex-col items-center gap-4 group"
        >
          <div className="w-16 h-16 bg-navy/10 rounded-2xl flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
            <User className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-navy text-xl">Saya Mencari Kerja</h3>
            <p className="text-slate-500 text-sm mt-1">Temukan peluang karir impian Anda.</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('employer')}
          className="w-full p-8 rounded-3xl border-2 border-slate-100 hover:border-yellow bg-slate-50 transition-all flex flex-col items-center gap-4 group"
        >
          <div className="w-16 h-16 bg-yellow/10 rounded-2xl flex items-center justify-center group-hover:bg-yellow group-hover:text-navy transition-all">
            <Briefcase className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-navy text-xl">Saya Mencari Karyawan</h3>
            <p className="text-slate-500 text-sm mt-1">Temukan talenta terbaik untuk tim Anda.</p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-center">
        <p className="text-slate-500 text-sm">Sudah punya akun?</p>
        <button 
          onClick={onLogin}
          className="mt-2 text-navy font-bold hover:underline"
        >
          Masuk Sekarang
        </button>
      </div>
    </div>
  );
};

const Login: React.FC<{ onLogin: (userData: Partial<UserProfile>) => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'applicant' as UserRole
  });

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-white p-8 flex flex-col justify-center">
      <button onClick={onBack} className="absolute top-8 left-8 p-2 bg-slate-50 rounded-xl text-navy">
        <ChevronRight className="w-6 h-6 rotate-180" />
      </button>

      <h2 className="text-3xl font-bold text-navy mb-2">Masuk</h2>
      <p className="text-slate-500 mb-8">Gunakan email dan kata sandi Anda.</p>

      <div className="space-y-4">
        <div className="flex bg-slate-50 p-1 rounded-2xl mb-4">
          <button 
            onClick={() => setFormData({...formData, role: 'applicant'})}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.role === 'applicant' ? 'bg-white text-navy shadow-sm' : 'text-slate-400'}`}
          >
            Pelamar
          </button>
          <button 
            onClick={() => setFormData({...formData, role: 'employer'})}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${formData.role === 'employer' ? 'bg-white text-navy shadow-sm' : 'text-slate-400'}`}
          >
            Pencari Karyawan
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="email@contoh.com"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Kata Sandi / Kode</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            placeholder="••••••••"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>
      </div>

      <button
        disabled={!formData.email || !formData.password}
        onClick={() => onLogin({ email: formData.email, role: formData.role, name: formData.email.split('@')[0] })}
        className={`w-full py-4 rounded-2xl font-bold text-lg mt-8 transition-all ${
          formData.email && formData.password ? 'bg-navy text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Masuk
      </button>
    </motion.div>
  );
};

const ApplicantRegistration: React.FC<{ onComplete: (userData: Partial<UserProfile>) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    interests: [] as string[],
    location: 'Mendeteksi lokasi...',
  });

  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
      const data = await response.json();
      if (data && data.display_name) {
        // Extract city/district for a cleaner string
        const address = data.address;
        const city = address.city || address.town || address.village || address.municipality || address.state_district || '';
        const state = address.state || '';
        const locationStr = city ? `${city}, ${state}` : data.display_name;
        setLocation(locationStr);
      } else {
        setLocation('Lokasi tidak dikenal');
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocation('Jakarta, Indonesia (Manual)');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchLocationName(latitude, longitude);
        },
        () => setLocation('Jakarta, Indonesia (Manual)')
      );
    } else {
      setLocation('Jakarta, Indonesia (Manual)');
    }
  }, []);

  const setLocation = (loc: string) => setFormData(prev => ({ ...prev, location: loc }));

  const toggleInterest = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(id) 
        ? prev.interests.filter(i => i !== id) 
        : prev.interests.length < 3 ? [...prev.interests, id] : prev.interests
    }));
  };

  if (step === 1) {
    return (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-white p-8 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center gap-2 p-2 pr-4 bg-slate-50 rounded-xl text-navy hover:bg-slate-100 transition-colors font-bold text-sm">
            <ChevronRight className="w-5 h-5 rotate-180" /> Kembali
          </button>
          <div className="w-10" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-navy mt-4">Data Diri Pelamar</h2>
          <p className="text-slate-500 mt-2">Lengkapi data diri Anda untuk mulai mencari kerja.</p>
          
          <div className="space-y-4 mt-8">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Contoh: Budi Santoso"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="budi@email.com"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Kata Sandi / Kode</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
          </div>
        </div>
        <button
          disabled={!formData.name || !formData.email}
          onClick={() => setStep(2)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            formData.name && formData.email ? 'bg-navy text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Lanjutkan <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 p-2 pr-4 bg-slate-50 rounded-xl text-navy hover:bg-slate-100 transition-colors font-bold text-sm">
          <ChevronRight className="w-5 h-5 rotate-180" /> Kembali
        </button>
        <div className="w-10" />
      </div>

      <div className="flex-1">
        <h2 className="text-3xl font-bold text-navy mt-4">Pilih Minatmu</h2>
        <p className="text-slate-500 mt-2">Pilih hingga 3 kategori untuk mendapatkan rekomendasi terbaik.</p>
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleInterest(cat.id)}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                formData.interests.includes(cat.id) 
                ? 'border-navy bg-navy text-white' 
                : 'border-slate-100 bg-slate-50 text-slate-600'
              }`}
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="font-semibold">{cat.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-navy" />
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 font-bold uppercase">Lokasi Anda</p>
            <input 
              value={formData.location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent font-bold text-navy w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      <button
        disabled={formData.interests.length === 0}
        onClick={() => onComplete(formData)}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          formData.interests.length > 0 ? 'bg-yellow text-navy shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Daftar Sekarang <CheckCircle className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

const EmployerRegistration: React.FC<{ onComplete: (userData: Partial<UserProfile>, firstJob?: any) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    password: '',
    location: 'Jakarta, Indonesia',
  });
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'Full-time'
  });

  const handleFinish = async () => {
    setIsUploading(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onComplete(companyData, jobData);
    setIsUploading(false);
  };

  if (step === 1) {
    return (
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-white p-8 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center gap-2 p-2 pr-4 bg-slate-50 rounded-xl text-navy hover:bg-slate-100 transition-colors font-bold text-sm">
            <ChevronRight className="w-5 h-5 rotate-180" /> Kembali
          </button>
          <div className="w-10" />
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-navy mt-4">Informasi Perusahaan</h2>
          <p className="text-slate-500 mt-2">Lengkapi detail tempat kerja Anda.</p>
          
          <div className="space-y-4 mt-8">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Nama Perusahaan / Toko</label>
              <input 
                type="text" 
                value={companyData.name}
                onChange={e => setCompanyData({...companyData, name: e.target.value})}
                placeholder="Contoh: PT Maju Bersama"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Email Bisnis</label>
              <input 
                type="email" 
                value={companyData.email}
                onChange={e => setCompanyData({...companyData, email: e.target.value})}
                placeholder="hr@perusahaan.com"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Kata Sandi / Kode</label>
              <input 
                type="password" 
                value={companyData.password}
                onChange={e => setCompanyData({...companyData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Lokasi Kantor</label>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  value={companyData.location}
                  onChange={e => setCompanyData({...companyData, location: e.target.value})}
                  className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy/5"
                />
                <button 
                  onClick={async () => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        try {
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                          const data = await res.json();
                          if (data && data.display_name) {
                            const address = data.address;
                            const city = address.city || address.town || address.village || address.municipality || address.state_district || '';
                            const state = address.state || '';
                            setCompanyData(prev => ({ ...prev, location: city ? `${city}, ${state}` : data.display_name }));
                          }
                        } catch (e) {}
                      });
                    }
                  }}
                  className="p-4 bg-navy text-white rounded-2xl"
                >
                  <MapPin className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          disabled={!companyData.name || !companyData.email}
          onClick={() => setStep(2)}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
            companyData.name && companyData.email ? 'bg-navy text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Lanjutkan ke Detail Lowongan <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="min-h-screen bg-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 p-2 pr-4 bg-slate-50 rounded-xl text-navy hover:bg-slate-100 transition-colors font-bold text-sm">
          <ChevronRight className="w-5 h-5 rotate-180" /> Kembali
        </button>
        <div className="w-10" />
      </div>

      <div className="flex-1">
        <h2 className="text-3xl font-bold text-navy mt-4">Detail Lowongan</h2>
        <p className="text-slate-500 mt-2">Masukkan posisi yang sedang Anda cari.</p>
        
        <div className="space-y-4 mt-8">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Posisi Jabatan</label>
            <input 
              type="text" 
              value={jobData.title}
              onChange={e => setJobData({...jobData, title: e.target.value})}
              placeholder="Contoh: Kasir, Admin, Designer"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Deskripsi Pekerjaan</label>
            <textarea 
              rows={3}
              value={jobData.description}
              onChange={e => setJobData({...jobData, description: e.target.value})}
              placeholder="Jelaskan tugas utama..."
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Gaji (Opsional)</label>
            <input 
              type="text" 
              value={jobData.salary}
              onChange={e => setJobData({...jobData, salary: e.target.value})}
              placeholder="Rp 4jt - 6jt"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            />
          </div>
        </div>
      </div>

      <button
        disabled={!jobData.title || !jobData.description || isUploading}
        onClick={handleFinish}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
          jobData.title && jobData.description && !isUploading ? 'bg-yellow text-navy shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {isUploading ? (
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-navy border-t-transparent rounded-full"
          />
        ) : (
          <>Selesai & Pasang Lowongan <CheckCircle className="w-5 h-5" /></>
        )}
      </button>
    </motion.div>
  );
};

const PostJobForm: React.FC<{ onBack: () => void; onSubmit: (job: any) => void }> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    category: 'Tech',
    description: '',
    requirements: '',
    benefits: ''
  });

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto p-6 pb-24"
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-navy">Pasang Lowongan</h2>
        <div className="w-10" />
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Posisi Jabatan</label>
          <input 
            type="text" 
            placeholder="Contoh: Senior UI Designer"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Nama Perusahaan / Tempat Kerja</label>
          <input 
            type="text" 
            placeholder="Nama perusahaan Anda"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            onChange={e => setFormData({...formData, company: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Lokasi</label>
            <input 
              type="text" 
              placeholder="Jakarta, Bandung, dll"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Gaji (Opsional)</label>
            <input 
              type="text" 
              placeholder="Rp 5jt - 10jt"
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
              onChange={e => setFormData({...formData, salary: e.target.value})}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Deskripsi & Detail Pekerjaan</label>
          <textarea 
            rows={4}
            placeholder="Jelaskan tanggung jawab dan detail pekerjaan..."
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Persyaratan</label>
          <textarea 
            rows={3}
            placeholder="Keahlian, pengalaman, atau kualifikasi..."
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
            onChange={e => setFormData({...formData, requirements: e.target.value})}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 max-w-md mx-auto">
        <button 
          onClick={() => onSubmit(formData)}
          className="w-full py-4 bg-navy text-white rounded-2xl font-bold shadow-lg shadow-navy/20 flex items-center justify-center gap-2"
        >
          Publikasikan Lowongan <CheckCircle className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const EmployerDashboard = ({ jobs, applications, onPostJob, showToast, onChat, onSeeAll }: { jobs: Job[]; applications: Application[]; onPostJob: () => void; showToast: (msg: string) => void; onChat: () => void; onSeeAll: () => void }) => {
  return (
    <div className="space-y-8">
      <div className="bg-navy p-6 rounded-3xl text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Dashboard HR</h2>
          <p className="text-sm opacity-80">Kelola lowongan dan temukan talenta terbaik.</p>
          <button 
            onClick={onPostJob}
            className="mt-6 bg-yellow text-navy px-6 py-3 rounded-xl font-bold flex items-center gap-2"
          >
            <Briefcase className="w-5 h-5" /> Pasang Lowongan Baru
          </button>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-400 text-xs font-bold uppercase mb-1">Lowongan Aktif</h4>
          <p className="text-3xl font-bold text-navy">{jobs.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h4 className="text-slate-400 text-xs font-bold uppercase mb-1">Total Pelamar</h4>
          <p className="text-3xl font-bold text-navy">{applications.length + 12}</p>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-navy text-lg">Lowongan Anda</h3>
          <button 
            onClick={onSeeAll}
            className="text-navy text-sm font-bold hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        <div className="space-y-4">
          {jobs.slice(0, 3).map(job => (
            <div 
              key={job.id} 
              onClick={() => showToast(`Mengelola lowongan: ${job.title}`)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center cursor-pointer hover:border-navy/20 transition-all"
            >
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-navy" />
                </div>
                <div>
                  <h4 className="font-bold text-navy">{job.title}</h4>
                  <p className="text-slate-400 text-xs">5 Pelamar Baru</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          ))}
        </div>
      </section>

              <section>
                <h3 className="font-bold text-navy text-lg mb-4">Pelamar Terbaru</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      onClick={() => showToast(`Membuka profil kandidat #${i+100}`)}
                      className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center cursor-pointer hover:border-navy/20 transition-all"
                    >
                      <img src={`https://picsum.photos/seed/user${i+10}/100/100`} className="w-12 h-12 rounded-full" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <h4 className="font-bold text-navy text-sm">Kandidat #{i+100}</h4>
                        <p className="text-slate-400 text-xs">UI/UX Designer • 2th Pengalaman</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onChat();
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Kandidat berhasil diterima!');
                          }}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
    </div>
  );
};

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-navy flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="w-32 h-32 border-4 border-yellow rounded-2xl flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-yellow"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
          />
          <Briefcase className="w-16 h-16 text-white relative z-10" />
        </div>
      </motion.div>
      <motion.h1 
        className="mt-6 text-white text-3xl font-bold tracking-widest uppercase"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        PINTU KERJA
      </motion.h1>
      <motion.p
        className="text-yellow/80 mt-2 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Buka Peluangmu Sekarang
      </motion.p>
    </motion.div>
  );
};

const JobDetail: React.FC<{ job: Job; onBack: () => void; onApply: () => void; isSaved: boolean; onToggleSave: () => void }> = ({ job, onBack, onApply, isSaved, onToggleSave }) => {
  const openInGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.coordinates) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${job.coordinates.lat},${job.coordinates.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location + ' ' + job.company)}`, '_blank');
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 bg-white z-50 overflow-y-auto pb-24"
    >
      <div className="relative h-64">
        <img src={job.logo} className="w-full h-full object-cover blur-sm opacity-20" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg text-navy flex items-center gap-1"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
      </div>

      <div className="px-8 -mt-20 relative z-10">
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-8">
          <div className="flex justify-between items-start">
            <img src={job.logo} className="w-20 h-20 rounded-2xl shadow-md" referrerPolicy="no-referrer" />
            {job.verified && (
              <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Terverifikasi
              </div>
            )}
          </div>
          <h2 className="text-3xl font-bold text-navy mt-6">{job.title}</h2>
          <p className="text-slate-500 text-lg font-medium">{job.company}</p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={openInGoogleMaps}
              className="bg-slate-50 px-4 py-2 rounded-xl text-navy text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors border border-slate-100"
            >
              <MapPin className="w-4 h-4 text-navy" /> {job.location}
              <span className="text-[10px] bg-navy/5 px-2 py-0.5 rounded-full font-bold">BUKA MAPS</span>
            </button>
            <div className="bg-slate-50 px-4 py-2 rounded-xl text-slate-600 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {job.type}
            </div>
            <div className="bg-yellow/10 text-navy px-4 py-2 rounded-xl text-sm font-bold">
              {job.salary}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-navy mb-4">Deskripsi Pekerjaan</h3>
            <p className="text-slate-600 leading-relaxed">
              {job.description}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-navy mb-4">Persyaratan</h3>
            <ul className="space-y-3">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600">
                  <div className="w-2 h-2 bg-yellow rounded-full mt-2 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-navy p-6 rounded-3xl text-white">
            <h4 className="font-bold text-lg mb-2">Benefit Perusahaan</h4>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm opacity-90">
                <CheckCircle className="w-4 h-4 text-yellow" /> Asuransi Kesehatan
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <CheckCircle className="w-4 h-4 text-yellow" /> Bonus Tahunan
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <CheckCircle className="w-4 h-4 text-yellow" /> Jam Kerja Fleksibel
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <CheckCircle className="w-4 h-4 text-yellow" /> Pelatihan & Kursus
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-4 z-50 max-w-md mx-auto">
        <button 
          onClick={onToggleSave}
          className={`p-4 rounded-2xl transition-all ${isSaved ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}
        >
          <Heart className={`w-6 h-6 ${isSaved ? 'fill-red-500' : ''}`} />
        </button>
        <button 
          onClick={onApply}
          className="flex-1 py-4 bg-navy text-white rounded-2xl font-bold shadow-lg shadow-navy/20 flex items-center justify-center gap-2"
        >
          Lamar Sekarang <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const PintuKursus: React.FC<{ onBack: () => void; showToast: (msg: string) => void }> = ({ onBack, showToast }) => {
  const courses = [
    { id: '1', title: 'Mastering React & Tailwind', instructor: 'Alex Rivera', duration: '12 Jam', price: 'Gratis', rating: 4.8, image: 'https://picsum.photos/seed/course1/400/200' },
    { id: '2', title: 'UI/UX Design Fundamentals', instructor: 'Sarah Chen', duration: '8 Jam', price: 'Rp 150.000', rating: 4.9, image: 'https://picsum.photos/seed/course2/400/200' },
    { id: '3', title: 'Digital Marketing 101', instructor: 'Budi Pratama', duration: '10 Jam', price: 'Gratis', rating: 4.7, image: 'https://picsum.photos/seed/course3/400/200' },
    { id: '4', title: 'Backend with Node.js', instructor: 'Kevin Smith', duration: '15 Jam', price: 'Rp 200.000', rating: 4.6, image: 'https://picsum.photos/seed/course4/400/200' },
  ];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="min-h-screen bg-slate-50 flex flex-col z-50 fixed inset-0">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
        <h3 className="font-bold text-navy">Pintu Kursus</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        <div className="bg-navy p-6 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Tingkatkan Skill-mu!</h2>
            <p className="text-xs opacity-80">Pelajari materi terbaru dari para ahli di bidangnya.</p>
          </div>
          <BookOpen className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {['Semua', 'Desain', 'Coding', 'Bisnis', 'Marketing'].map(cat => (
            <button key={cat} className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 whitespace-nowrap">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm group">
              <img src={course.image} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-navy leading-tight">{course.title}</h4>
                  <span className="text-xs font-bold text-emerald-500">{course.price}</span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{course.instructor} • {course.duration}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3 text-yellow fill-yellow" />
                    <span className="text-xs font-bold text-navy">{course.rating}</span>
                  </div>
                  <button 
                    onClick={() => showToast('Pendaftaran kursus berhasil! Silakan cek email Anda.')}
                    className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const MyJobs: React.FC<{ jobs: Job[]; onBack: () => void; onEdit: (job: Job) => void }> = ({ jobs, onBack, onEdit }) => {
  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="min-h-screen bg-slate-50 flex flex-col z-50 fixed inset-0">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
        <h3 className="font-bold text-navy">Lowongan Anda</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {jobs.length > 0 ? jobs.map(job => (
          <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h4 className="font-bold text-navy">{job.title}</h4>
                <p className="text-slate-400 text-xs">{job.type} • {job.postedAt}</p>
              </div>
            </div>
            <button onClick={() => onEdit(job)} className="p-2 bg-slate-50 text-navy rounded-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 italic">Belum ada lowongan yang dipasang.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PostJob: React.FC<{ onBack: () => void; onSubmit: (job: Job) => void; user: UserProfile }> = ({ onBack, onSubmit, user }) => {
  const [formData, setFormData] = useState<Partial<Job>>({
    title: '',
    company: user.name,
    location: user.location || '',
    salary: '',
    type: 'Full-time',
    category: 'Teknologi',
    description: '',
    requirements: [''],
    logo: `https://picsum.photos/seed/${user.name}/100/100`,
    verified: true,
    postedAt: 'Baru saja'
  });

  const addRequirement = () => {
    setFormData(prev => ({ ...prev, requirements: [...(prev.requirements || []), ''] }));
  };

  const updateRequirement = (index: number, value: string) => {
    const newReqs = [...(formData.requirements || [])];
    newReqs[index] = value;
    setFormData(prev => ({ ...prev, requirements: newReqs }));
  };

  const removeRequirement = (index: number) => {
    const newReqs = (formData.requirements || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, requirements: newReqs }));
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="min-h-screen bg-white p-8 flex flex-col z-50 fixed inset-0">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
        <h3 className="font-bold text-navy flex-1 text-center pr-12">Pasang Lowongan</h3>
        <button 
          onClick={() => {
            if (!formData.title || !formData.description) return;
            onSubmit({ ...formData, id: Date.now().toString() } as Job);
          }}
          className={`font-bold ${formData.title && formData.description ? 'text-navy' : 'text-slate-300'}`}
        >
          Simpan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-8 no-scrollbar">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Judul Pekerjaan</label>
          <input 
            type="text" 
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            placeholder="Contoh: Senior Frontend Developer"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Tipe</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Rentang Gaji</label>
          <input 
            type="text" 
            value={formData.salary}
            onChange={e => setFormData({...formData, salary: e.target.value})}
            placeholder="Contoh: Rp 8jt - 12jt"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Lokasi</label>
          <input 
            type="text" 
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="Contoh: Jakarta Selatan"
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Deskripsi Pekerjaan</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Jelaskan tanggung jawab dan detail pekerjaan..."
            className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Persyaratan</label>
            <button onClick={addRequirement} className="text-navy text-xs font-bold">+ Tambah</button>
          </div>
          <div className="space-y-3">
            {formData.requirements?.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text" 
                  value={req}
                  onChange={e => updateRequirement(index, e.target.value)}
                  placeholder={`Syarat #${index + 1}`}
                  className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy/5"
                />
                {formData.requirements!.length > 1 && (
                  <button onClick={() => removeRequirement(index)} className="p-4 text-red-500">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LocationConnection: React.FC<{ 
  location: string; 
  onBack: () => void; 
  jobs: Job[]; 
  candidates: any[];
  setSelectedJob: (job: Job) => void;
  setView: (view: ViewState) => void;
}> = ({ location, onBack, jobs, candidates, setSelectedJob, setView }) => {
  const filteredJobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(j.location.toLowerCase()));
  const filteredCandidates = candidates.filter(c => c.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(c.location.toLowerCase()));

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="min-h-screen bg-slate-50 flex flex-col z-50 fixed inset-0">
      <div className="p-6 bg-white border-b border-slate-100 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
        <div>
          <h3 className="font-bold text-navy">Terhubung di {location}</h3>
          <p className="text-xs text-slate-500">{filteredJobs.length} Lowongan • {filteredCandidates.length} Kandidat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section>
          <h4 className="font-bold text-navy mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-navy" /> Lowongan di Sekitar
          </h4>
          <div className="space-y-4">
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center shadow-sm">
                <img src={job.logo} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h5 className="font-bold text-navy text-sm">{job.title}</h5>
                  <p className="text-slate-500 text-xs">{job.company}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-navy font-bold text-[10px]">{job.salary}</p>
                    <p className="text-[10px] text-slate-400">{job.type}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedJob(job);
                      setView('detail');
                    }}
                    className="px-3 py-1 bg-navy/5 text-navy text-[10px] rounded-lg font-bold hover:bg-navy/10 transition-colors"
                  >
                    Detail
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic">Belum ada lowongan di area ini.</p>
            )}
          </div>
        </section>

        <section>
          <h4 className="font-bold text-navy mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-navy" /> Kandidat di Sekitar
          </h4>
          <div className="space-y-4">
            {filteredCandidates.length > 0 ? filteredCandidates.map(candidate => (
              <div key={candidate.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center shadow-sm">
                <img src={candidate.avatar} className="w-12 h-12 rounded-full border-2 border-slate-50" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <h5 className="font-bold text-navy text-sm">{candidate.name}</h5>
                  <p className="text-slate-500 text-xs">{candidate.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-navy font-bold text-[10px]">{candidate.experience}</p>
                  <button className="mt-1 px-3 py-1 bg-navy text-white text-[10px] rounded-lg font-bold">Hubungi</button>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm italic">Belum ada kandidat di area ini.</p>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const JobCard: React.FC<{ job: Job; onApply: () => void; onSkip: () => void; onClick: () => void; onLocationClick: (loc: string) => void; isSaved: boolean; onToggleSave: () => void }> = ({ job, onApply, onSkip, onClick, onLocationClick, isSaved, onToggleSave }) => {
  const openInGoogleMaps = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLocationClick(job.location);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) onApply();
        if (info.offset.x < -100) onSkip();
      }}
      onClick={onClick}
      className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative cursor-pointer"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div className="flex items-center gap-2">
            {job.verified && (
              <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Terverifikasi
              </div>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
              className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300'}`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold text-navy">{job.title}</h3>
          <p className="text-slate-500 font-medium">{job.company}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <button 
            onClick={openInGoogleMaps}
            className="bg-slate-100 text-navy px-3 py-1 rounded-lg text-sm flex items-center gap-1 hover:bg-slate-200 transition-colors"
          >
            <MapPin className="w-3 h-3" /> {job.location}
          </button>
          <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm">
            {job.type}
          </div>
          <div className="bg-yellow/20 text-navy px-3 py-1 rounded-lg text-sm font-bold">
            {job.salary}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-navy mb-2">Persyaratan:</h4>
          <ul className="space-y-1">
            {job.requirements.slice(0, 3).map((req, i) => (
              <li key={i} className="text-slate-600 text-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow rounded-full" /> {req}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <button 
            onClick={onSkip}
            className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" /> Abaikan
          </button>
          <button 
            onClick={onApply}
            className="flex-[2] py-4 rounded-2xl bg-navy text-white font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all flex items-center justify-center gap-2"
          >
            Buka Pintu <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
        Diposting {job.postedAt}
      </div>
    </motion.div>
  );
};

const Navigation = ({ activeTab, setActiveTab }: { activeTab: TabState; setActiveTab: (t: TabState) => void }) => {
  const tabs: { id: TabState; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Lobi', icon: Briefcase },
    { id: 'explore', label: 'Eksplor', icon: Search },
    { id: 'applications', label: 'Pintu Saya', icon: Bell },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-40">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all ${
            activeTab === tab.id ? 'text-navy scale-110' : 'text-slate-400'
          }`}
        >
          <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'fill-navy/10' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div layoutId="nav-dot" className="w-1 h-1 bg-yellow rounded-full mt-0.5" />
          )}
        </button>
      ))}
    </div>
  );
};

const ApplyForm: React.FC<{ job: Job; onBack: () => void; onSubmit: (data: any) => void }> = ({ job, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    cv: null as File | null,
    ijazah: null as File | null,
    foto: null as File | null,
    dokumenLain: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const FileInput = ({ label, field, icon: Icon }: { label: string; field: string; icon: any }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-navy block">{label}</label>
      <div className="relative">
        <input 
          type="file" 
          onChange={(e) => handleFileChange(e, field)}
          className="hidden" 
          id={`file-${field}`}
        />
        <label 
          htmlFor={`file-${field}`}
          className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-navy/20 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-navy">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-navy truncate">
              {(formData as any)[field] ? (formData as any)[field].name : `Pilih file ${label}`}
            </p>
            <p className="text-[10px] text-slate-400">PDF, JPG, PNG (Maks 5MB)</p>
          </div>
          <Upload className="w-4 h-4 text-slate-300" />
        </label>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      className="min-h-screen bg-white flex flex-col z-50 fixed inset-0 overflow-y-auto"
    >
      <div className="p-6 border-b border-slate-100 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          <span className="text-xs font-bold">Kembali</span>
        </button>
        <div>
          <h3 className="font-bold text-navy">Lamar Pekerjaan</h3>
          <p className="text-xs text-slate-400 truncate w-48">{job.title} • {job.company}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 pb-24">
        <div className="bg-navy/5 p-4 rounded-2xl border border-navy/10">
          <p className="text-xs text-navy/70 leading-relaxed">
            Pastikan semua dokumen yang Anda unggah sudah benar dan terbaru untuk meningkatkan peluang Anda diterima.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-navy block">Surat Lamaran (Opsional)</label>
          <textarea 
            value={formData.coverLetter}
            onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
            placeholder="Tuliskan alasan mengapa Anda tertarik dengan posisi ini..."
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-navy/20 min-h-[120px]"
          />
        </div>

        <FileInput label="CV / Resume" field="cv" icon={Briefcase} />
        <FileInput label="Ijazah Terakhir" field="ijazah" icon={BookOpen} />
        <FileInput label="Foto Terbaru" field="foto" icon={Camera} />
        <FileInput label="Dokumen Penting Lainnya" field="dokumenLain" icon={NavigationIcon} />

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-slate-100 max-w-md mx-auto">
          <button 
            type="submit"
            className="w-full py-4 bg-navy text-white font-bold rounded-2xl shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all flex items-center justify-center gap-2"
          >
            Kirim Lamaran <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProfile>({
    name: '',
    title: 'Fresh Graduate UI Designer',
    interests: [],
    bio: 'Semangat belajar hal baru dan menciptakan desain yang berdampak.',
    completionScore: 75,
    role: 'applicant',
    location: 'Jakarta, Indonesia',
    isLoggedIn: false,
    experience: [
      { id: '1', company: 'Toko Berkah', position: 'Admin Gudang', period: '2022 - 2023' }
    ]
  });

  const [view, setView] = useState<ViewState>('splash');
  const [lastView, setLastView] = useState<ViewState>('main');
  const [activeTab, setActiveTab] = useState<TabState>('home');
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  
  // Sort jobs by location relevance
  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => {
      const userLoc = user.location?.toLowerCase() || '';
      const aLoc = a.location?.toLowerCase() || '';
      const bLoc = b.location?.toLowerCase() || '';
      
      if (!aLoc && !bLoc) return 0;
      if (!aLoc) return 1;
      if (!bLoc) return -1;

      const aMatch = userLoc && (userLoc.includes(aLoc) || aLoc.includes(userLoc));
      const bMatch = userLoc && (userLoc.includes(bLoc) || bLoc.includes(userLoc));
      
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [jobs, user.location]);

  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJobCategory, setSelectedJobCategory] = useState<string | null>(null);
  const [selectedCandidateCategory, setSelectedCandidateCategory] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [candidateSearch, setCandidateSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    experience: '',
    salaryMin: '',
    salaryMax: ''
  });

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'HR PT Maju', text: 'Halo, apakah besok bisa interview?', time: '10:30', isMe: false },
    { id: '2', sender: 'Saya', text: 'Bisa pak, jam berapa ya?', time: '10:35', isMe: true }
  ]);

  const refreshLocation = async () => {
    if (!navigator.geolocation) {
      showToast('Geolokasi tidak didukung browser Anda');
      return;
    }

    showToast('Mendeteksi lokasi akurat...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
          const data = await response.json();
          if (data && data.display_name) {
            const address = data.address;
            const city = address.city || address.town || address.village || address.municipality || address.state_district || '';
            const state = address.state || '';
            const locationStr = city ? `${city}, ${state}` : data.display_name;
            setUser(prev => ({ ...prev, location: locationStr }));
            showToast(`Lokasi diperbarui: ${locationStr}`);
          }
        } catch (error) {
          showToast('Gagal mendapatkan nama lokasi');
        }
      },
      () => showToast('Gagal mengakses GPS Anda')
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleSelect = (role: UserRole) => {
    setUser({ ...user, role });
    setView(role === 'applicant' ? 'applicant-reg' : 'employer-reg');
  };

  const handleOnboardingComplete = (userData: Partial<UserProfile>, firstJob?: any) => {
    setUser({ ...user, ...userData, isLoggedIn: true });
    
    if (firstJob) {
      handlePostJob(firstJob);
    } else {
      setView('main');
    }

    if (user.role === 'employer' || userData.role === 'employer') {
      setActiveTab('home');
    }
  };

  const handlePostJob = (jobData: any) => {
    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      title: jobData.title,
      company: jobData.company,
      location: jobData.location,
      salary: jobData.salary || 'Kompetitif',
      type: jobData.type,
      category: jobData.category,
      description: jobData.description,
      requirements: jobData.requirements.split('\n'),
      logo: `https://picsum.photos/seed/${jobData.company}/100/100`,
      verified: true,
      postedAt: 'Baru saja'
    };
    setJobs([newJob, ...jobs]);
    showToast('Lowongan berhasil dipasang!');
    setView('main');
    setActiveTab('home');
  };

  const handleApply = (jobToApply?: Job) => {
    const job = jobToApply || sortedJobs[currentJobIndex];
    if (!job) return;
    setSelectedJob(job);
    setLastView(view);
    setView('apply-form');
  };

  const handleLocationClick = (loc: string) => {
    setSelectedLocation(loc);
    setView('location-connection');
  };

  const completeApplication = (formData: any) => {
    if (!selectedJob) return;

    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId: selectedJob.id,
      status: 'Terkirim',
      appliedAt: 'Baru saja'
    };
    setApplications([newApp, ...applications]);
    
    showToast(`Lamaran ke ${selectedJob.company} berhasil dikirim!`);
    
    // Reset state
    const wasFromDetail = view === 'detail';
    if (!wasFromDetail) {
      setCurrentJobIndex(prev => prev + 1);
    }
    
    setSelectedJob(null);
    setView('main');
  };

  const handleSkip = () => {
    setCurrentJobIndex(prev => prev + 1);
  };

  const handleToggleSave = (jobId: string) => {
    setSavedJobs(prev => {
      const isSaved = prev.includes(jobId);
      if (isSaved) {
        showToast('Lowongan dihapus dari favorit');
        return prev.filter(id => id !== jobId);
      } else {
        showToast('Lowongan disimpan ke favorit');
        return [...prev, jobId];
      }
    });
  };

  const openDetail = (job: Job) => {
    setSelectedJob(job);
    setView('detail');
  };

  const toggleRole = () => {
    const newRole = user.role === 'applicant' ? 'employer' : 'applicant';
    setUser({ ...user, role: newRole });
    setActiveTab(newRole === 'employer' ? 'employer-dashboard' : 'home');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {view === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setView('role-selection')} />
        )}

        {view === 'role-selection' && (
          <motion.div key="role" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoleSelection onSelect={handleRoleSelect} onLogin={() => setView('login')} />
          </motion.div>
        )}

        {view === 'login' && (
          <Login 
            key="login"
            onLogin={(data) => {
              setUser({ ...user, ...data, isLoggedIn: true });
              setView('main');
              showToast(`Selamat datang kembali, ${data.name}!`);
            }}
            onBack={() => setView('role-selection')}
          />
        )}

        {view === 'applicant-reg' && (
          <ApplicantRegistration 
            key="app-reg" 
            onComplete={handleOnboardingComplete} 
            onBack={() => setView('role-selection')}
          />
        )}

        {view === 'employer-reg' && (
          <EmployerRegistration 
            key="emp-reg" 
            onComplete={handleOnboardingComplete} 
            onBack={() => setView('role-selection')}
          />
        )}

        {view === 'location-connection' && selectedLocation && (
          <LocationConnection 
            key="location-connection"
            location={selectedLocation}
            onBack={() => setView('main')}
            jobs={jobs}
            candidates={MOCK_CANDIDATES}
            setSelectedJob={setSelectedJob}
            setView={setView}
          />
        )}

        {view === 'post-job' && (
          <PostJob 
            onBack={() => setView('main')}
            user={user}
            onSubmit={(newJob) => {
              setJobs([newJob, ...jobs]);
              showToast('Lowongan berhasil dipasang!');
              setView('main');
            }}
          />
        )}

        {view === 'detail' && selectedJob && (
          <JobDetail 
            key="detail"
            job={selectedJob} 
            onBack={() => setView('main')} 
            onApply={() => handleApply(selectedJob)} 
            isSaved={savedJobs.includes(selectedJob.id)}
            onToggleSave={() => handleToggleSave(selectedJob.id)}
          />
        )}

        {view === 'apply-form' && selectedJob && (
          <ApplyForm 
            key="apply-form"
            job={selectedJob}
            onBack={() => setView(lastView)}
            onSubmit={completeApplication}
          />
        )}

        {view === 'edit-profile' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="min-h-screen bg-white p-8 flex flex-col z-50 fixed inset-0">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('main')} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-xs font-bold">Kembali</span>
              </button>
              <h3 className="font-bold text-navy flex-1 text-center pr-12">Edit Profil</h3>
              <button 
                onClick={() => {
                  showToast('Profil berhasil diperbarui!');
                  setView('main');
                }}
                className="text-navy font-bold"
              >
                Simpan
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 pb-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <img 
                    src={`https://picsum.photos/seed/${user.name || 'user1'}/200/200`} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-slate-50" 
                    referrerPolicy="no-referrer" 
                  />
                  <button 
                    onClick={() => showToast('Fitur ganti foto profil segera hadir!')}
                    className="absolute bottom-0 right-0 bg-navy text-white p-2 rounded-full border-2 border-white"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={user.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Judul Profesional</label>
                  <input 
                    type="text" 
                    value={user.title}
                    onChange={e => setUser({...user, title: e.target.value})}
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Bio Singkat</label>
                  <textarea 
                    rows={3}
                    value={user.bio}
                    onChange={e => setUser({...user, bio: e.target.value})}
                    placeholder="Ceritakan sedikit tentang diri Anda..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1 focus:outline-none focus:ring-2 focus:ring-navy/5"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Lokasi</label>
                  <div className="flex gap-2 mt-1">
                    <input 
                      type="text" 
                      value={user.location}
                      onChange={e => setUser({...user, location: e.target.value})}
                      className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy/5"
                    />
                    <button 
                      onClick={refreshLocation}
                      className="p-4 bg-navy text-white rounded-2xl hover:bg-navy/90 transition-colors"
                      title="Deteksi Lokasi Otomatis"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'chat' && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="min-h-screen bg-white flex flex-col z-50 fixed inset-0">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              <button onClick={() => setView('main')} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-xs font-bold">Kembali</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">HR</div>
                <div>
                  <h4 className="font-bold text-navy text-sm">HR PT Maju Bersama</h4>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                    msg.isMe ? 'bg-navy text-white rounded-tr-none' : 'bg-white text-navy rounded-tl-none'
                  }`}>
                    {msg.text}
                    <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-white/60' : 'text-slate-400'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Tulis pesan..."
                className="flex-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const text = (e.target as HTMLInputElement).value;
                    if (!text) return;
                    setMessages([...messages, { id: Date.now().toString(), sender: 'Saya', text, time: 'Sekarang', isMe: true }]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button className="p-4 bg-navy text-white rounded-2xl">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {view === 'edit-experience' && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="min-h-screen bg-white p-8 flex flex-col z-50 fixed inset-0">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('main')} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
                <ChevronLeft className="w-6 h-6" />
                <span className="text-xs font-bold">Kembali</span>
              </button>
              <h3 className="font-bold text-navy flex-1 text-center pr-12">{editingExperience?.id ? 'Edit' : 'Tambah'} Pengalaman</h3>
              <button 
                onClick={() => {
                  if (!editingExperience?.company || !editingExperience?.position) {
                    showToast('Lengkapi data pengalaman!');
                    return;
                  }
                  
                  const newExp = editingExperience.id 
                    ? user.experience.map(e => e.id === editingExperience.id ? editingExperience : e)
                    : [...user.experience, { ...editingExperience, id: Date.now().toString() }];
                  
                  setUser({ ...user, experience: newExp });
                  showToast('Pengalaman berhasil disimpan!');
                  setView('main');
                }}
                className="text-navy font-bold"
              >
                Simpan
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Nama Perusahaan</label>
                <input 
                  type="text" 
                  value={editingExperience?.company || ''}
                  onChange={e => setEditingExperience(prev => ({ ...prev!, company: e.target.value }))}
                  placeholder="Contoh: PT Maju Jaya"
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Posisi / Jabatan</label>
                <input 
                  type="text" 
                  value={editingExperience?.position || ''}
                  onChange={e => setEditingExperience(prev => ({ ...prev!, position: e.target.value }))}
                  placeholder="Contoh: Staff Admin"
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Periode Kerja</label>
                <input 
                  type="text" 
                  value={editingExperience?.period || ''}
                  onChange={e => setEditingExperience(prev => ({ ...prev!, period: e.target.value }))}
                  placeholder="Contoh: 2022 - 2024"
                  className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-1"
                />
              </div>
              
              {editingExperience?.id && (
                <button 
                  onClick={() => {
                    setUser({ ...user, experience: user.experience.filter(e => e.id !== editingExperience.id) });
                    showToast('Pengalaman berhasil dihapus');
                    setView('main');
                  }}
                  className="w-full py-4 text-red-500 font-bold border-2 border-red-50 rounded-2xl hover:bg-red-50 transition-colors"
                >
                  Hapus Pengalaman
                </button>
              )}
            </div>
          </motion.div>
        )}

        {view === 'main' && (
          <motion.div key="main" className="pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <header className="p-6 flex justify-between items-center bg-white sticky top-0 z-30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-navy font-bold text-lg leading-none">PINTU KERJA</h1>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <p className="text-slate-400 text-[10px] font-medium truncate max-w-[120px]">{user.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => showToast('Tidak ada notifikasi baru')}
                  className="relative p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-navy" />
                </button>
                <img 
                  src={`https://picsum.photos/seed/${user.name || 'user1'}/100/100`} 
                  className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 cursor-pointer"
                  referrerPolicy="no-referrer"
                  onClick={() => setActiveTab('profile')}
                />
              </div>
            </header>

            {/* Content based on Tab */}
            <main className="p-6">
              {user.role === 'employer' ? (
                <>
                  {(activeTab === 'home' || activeTab === 'applications' || activeTab === 'employer-dashboard') && (
                    <EmployerDashboard 
                      jobs={jobs.filter(j => j.company === user.name || j.postedAt === 'Baru saja')} 
                      applications={applications} 
                      onPostJob={() => setView('post-job')}
                      showToast={showToast}
                      onChat={() => setView('chat')}
                      onSeeAll={() => setView('my-jobs')}
                    />
                  )}
                  {activeTab === 'explore' && (
                    <div>
                      <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          value={candidateSearch}
                          onChange={(e) => setCandidateSearch(e.target.value)}
                          placeholder="Cari kandidat (misal: Frontend Developer)..."
                          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/5"
                        />
                      </div>

                      <section className="mb-8">
                        <h3 className="font-bold text-navy mb-4">Kategori Kandidat</h3>
                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                          {CATEGORIES.map(cat => (
                            <button 
                              key={cat.id} 
                              onClick={() => {
                                setCandidateSearch(cat.name);
                                showToast(`Mencari kandidat kategori: ${cat.name}`);
                              }}
                              className={`flex-shrink-0 px-6 py-3 rounded-xl border border-slate-100 shadow-sm font-medium flex items-center gap-2 transition-all ${
                                candidateSearch === cat.name ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-navy/20'
                              }`}
                            >
                              <span>{cat.icon}</span> {cat.name}
                            </button>
                          ))}
                        </div>
                      </section>

                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-navy">
                          {candidateSearch ? `Hasil Pencarian: ${candidateSearch}` : 'Kandidat Unggulan'}
                        </h3>
                        {candidateSearch && (
                          <button 
                            onClick={() => setCandidateSearch('')}
                            className="text-navy text-xs font-bold"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        {MOCK_CANDIDATES.filter(c => {
                          const matchesSearch = !candidateSearch || 
                            c.name.toLowerCase().includes(candidateSearch.toLowerCase()) || 
                            c.title.toLowerCase().includes(candidateSearch.toLowerCase()) ||
                            c.skills.some(s => s.toLowerCase().includes(candidateSearch.toLowerCase()));
                          
                          const matchesExperience = !filters.experience || c.experience === filters.experience;
                          
                          return matchesSearch && matchesExperience;
                        }).map(candidate => (
                          <div 
                            key={candidate.id} 
                            onClick={() => showToast(`Membuka profil: ${candidate.name}`)}
                            className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center cursor-pointer hover:border-navy/20 transition-all shadow-sm"
                          >
                            <img src={candidate.avatar} className="w-14 h-14 rounded-full border-2 border-slate-50" referrerPolicy="no-referrer" />
                            <div className="flex-1">
                              <h4 className="font-bold text-navy text-sm">{candidate.name}</h4>
                              <p className="text-slate-500 text-xs font-medium">{candidate.title}</p>
                              <div className="flex gap-1 mt-1">
                                {candidate.skills.slice(0, 2).map(skill => (
                                  <span key={skill} className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full border border-slate-100 font-bold uppercase">{skill}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setView('chat');
                                }}
                                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              >
                                <MessageSquare className="w-5 h-5" />
                              </button>
                              <div className="text-right">
                                <p className="text-navy font-bold text-xs">{candidate.experience}</p>
                                <p className="text-[10px] text-slate-400">{candidate.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {MOCK_CANDIDATES.filter(c => {
                          const matchesSearch = !candidateSearch || 
                            c.name.toLowerCase().includes(candidateSearch.toLowerCase()) || 
                            c.title.toLowerCase().includes(candidateSearch.toLowerCase()) ||
                            c.skills.some(s => s.toLowerCase().includes(candidateSearch.toLowerCase()));
                          
                          const matchesExperience = !filters.experience || c.experience === filters.experience;
                          
                          return matchesSearch && matchesExperience;
                        }).length === 0 && (
                          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm">Tidak ada kandidat yang cocok.</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-8 bg-navy p-6 rounded-3xl text-white relative overflow-hidden">
                        <div className="relative z-10">
                          <h3 className="font-bold text-lg mb-2">Butuh bantuan mencari?</h3>
                          <p className="text-sm opacity-80 mb-4">Gunakan filter lanjutan untuk menemukan kandidat yang tepat.</p>
                          <button 
                            onClick={() => setIsFilterOpen(true)}
                            className="w-full py-3 bg-yellow text-navy rounded-xl font-bold flex items-center justify-center gap-2"
                          >
                            <Filter className="w-4 h-4" /> Filter Kandidat
                          </button>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                      </div>
                    </div>
                  )}
                  {activeTab === 'profile' && (
                    <div className="pb-8">
                      <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full border-4 border-yellow p-1">
                            <img 
                              src={`https://picsum.photos/seed/${user.name || 'user1'}/200/200`} 
                              className="w-full h-full rounded-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-navy mt-4">{user.name}</h2>
                        <p className="text-slate-500 text-sm">{user.role === 'employer' ? 'Employer Account' : user.title}</p>
                        
                        {user.bio && (
                          <p className="text-slate-400 text-xs text-center mt-3 px-8 leading-relaxed italic">
                            "{user.bio}"
                          </p>
                        )}
                        
                        <div className="mt-6 flex flex-col gap-3 w-full">
                          <button 
                            onClick={() => setView('edit-profile')}
                            className="w-full px-4 py-3 bg-navy text-white rounded-xl text-xs font-bold shadow-lg shadow-navy/20 flex items-center justify-center gap-2"
                          >
                            <User className="w-3 h-3" /> 
                            Edit Profil
                          </button>
                          
                          <button 
                            onClick={toggleRole}
                            className="w-full px-4 py-3 bg-navy/5 text-navy rounded-xl text-xs font-bold border border-navy/10 flex items-center justify-center gap-2"
                          >
                            <Briefcase className="w-3 h-3" /> 
                            Pindah ke Mode Pelamar
                          </button>
                          
                          <button 
                            onClick={() => {
                              setUser({ ...user, isLoggedIn: false });
                              setView('role-selection');
                              showToast('Berhasil keluar dari akun');
                            }}
                            className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center justify-center gap-2"
                          >
                            <LogOut className="w-3 h-3" /> 
                            Keluar dari Akun
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {activeTab === 'home' && (
                    <div className="flex flex-col items-center">
                      <div className="w-full mb-8">
                        <h2 className="text-2xl font-bold text-navy">Rekomendasi Utama</h2>
                        <p className="text-slate-500">Berdasarkan lokasi Anda di {user.location?.split(',')[0]}</p>
                      </div>

                      <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                        {currentJobIndex < sortedJobs.length ? (
                          <AnimatePresence mode="popLayout">
                            <JobCard 
                              key={sortedJobs[currentJobIndex].id}
                              job={sortedJobs[currentJobIndex]} 
                              onApply={handleApply}
                              onSkip={handleSkip}
                              onClick={() => openDetail(sortedJobs[currentJobIndex])}
                              onLocationClick={handleLocationClick}
                              isSaved={savedJobs.includes(sortedJobs[currentJobIndex].id)}
                              onToggleSave={() => handleToggleSave(sortedJobs[currentJobIndex].id)}
                            />
                          </AnimatePresence>
                        ) : (
                          <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
                            <div className="w-20 h-20 bg-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="w-10 h-10 text-navy" />
                            </div>
                            <h3 className="text-xl font-bold text-navy">Semua Pintu Terbuka!</h3>
                            <p className="text-slate-500 mt-2">Kamu telah melihat semua rekomendasi hari ini.</p>
                            <button 
                              onClick={() => setCurrentJobIndex(0)}
                              className="mt-6 text-navy font-bold underline"
                            >
                              Lihat lagi
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 w-full mt-12">
                        <div 
                          onClick={() => setView('courses')}
                          className="bg-navy p-4 rounded-2xl text-white cursor-pointer hover:bg-navy/90 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-yellow" />
                            <span className="text-xs font-bold uppercase tracking-wider">Pintu Kursus</span>
                          </div>
                          <p className="text-sm opacity-80">Tingkatkan skill untuk loker impianmu.</p>
                        </div>
                        <div 
                          onClick={() => setView('chat')}
                          className="bg-white p-4 rounded-2xl border border-slate-100 cursor-pointer hover:border-navy/20 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-navy" />
                            <span className="text-xs font-bold uppercase tracking-wider text-navy">Direct Chat</span>
                          </div>
                          <p className="text-sm text-slate-500">Hubungi HR secara langsung.</p>
                        </div>
                      </div>
                    </div>
                  )}

                   {activeTab === 'explore' && (
                    <div>
                      {user.role === 'employer' ? (
                        <div>
                          <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                              type="text" 
                              value={candidateSearch}
                              onChange={(e) => setCandidateSearch(e.target.value)}
                              placeholder="Cari kandidat (misal: Frontend Developer)..."
                              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/5"
                            />
                          </div>

                          <section className="mb-8">
                            <h3 className="font-bold text-navy mb-4">Kategori Kandidat</h3>
                            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                              <button 
                                onClick={() => setSelectedCandidateCategory(null)}
                                className={`flex-shrink-0 px-6 py-3 rounded-xl border border-slate-100 shadow-sm font-medium transition-all ${
                                  !selectedCandidateCategory ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-navy/20'
                                }`}
                              >
                                Semua
                              </button>
                              {CATEGORIES.map(cat => (
                                <button 
                                  key={cat.id} 
                                  onClick={() => {
                                    setSelectedCandidateCategory(cat.id);
                                    showToast(`Mencari kandidat kategori: ${cat.name}`);
                                  }}
                                  className={`flex-shrink-0 px-6 py-3 rounded-xl border border-slate-100 shadow-sm font-medium flex items-center gap-2 transition-all ${
                                    selectedCandidateCategory === cat.id ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-navy/20'
                                  }`}
                                >
                                  <span>{cat.icon}</span> {cat.name}
                                </button>
                              ))}
                            </div>
                          </section>

                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-navy">Kandidat Unggulan</h3>
                            <button className="text-navy text-sm font-bold hover:underline">Lihat Semua</button>
                          </div>
                          
                          <div className="space-y-4">
                            {MOCK_CANDIDATES.filter(c => {
                              const matchesSearch = c.name.toLowerCase().includes(candidateSearch.toLowerCase()) || 
                                                  c.title.toLowerCase().includes(candidateSearch.toLowerCase());
                              const matchesCategory = !selectedCandidateCategory || c.category === selectedCandidateCategory;
                              return matchesSearch && matchesCategory;
                            }).map(candidate => (
                              <div 
                                key={candidate.id} 
                                onClick={() => showToast(`Membuka profil: ${candidate.name}`)}
                                className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center cursor-pointer hover:border-navy/20 transition-all shadow-sm"
                              >
                                <img src={candidate.avatar} className="w-14 h-14 rounded-full border-2 border-slate-50" referrerPolicy="no-referrer" />
                                <div className="flex-1">
                                  <h4 className="font-bold text-navy text-sm">{candidate.name}</h4>
                                  <p className="text-slate-500 text-xs font-medium">{candidate.title}</p>
                                  <div className="flex gap-1 mt-1">
                                    {candidate.skills.slice(0, 2).map(skill => (
                                      <span key={skill} className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full border border-slate-100 font-bold uppercase">{skill}</span>
                                    ))}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-navy font-bold text-xs">{candidate.experience}</p>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLocationClick(candidate.location);
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-navy hover:underline"
                                  >
                                    {candidate.location}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 bg-navy p-6 rounded-3xl text-white relative overflow-hidden">
                            <div className="relative z-10">
                              <h3 className="font-bold text-lg mb-2">Butuh bantuan mencari?</h3>
                              <p className="text-sm opacity-80 mb-4">Gunakan filter lanjutan untuk menemukan kandidat yang tepat.</p>
                              <button 
                                onClick={() => {
                                  setIsFilterOpen(true);
                                  showToast('Membuka filter lanjutan...');
                                }}
                                className="w-full py-3 bg-yellow text-navy rounded-xl font-bold flex items-center justify-center gap-2"
                              >
                                <Filter className="w-4 h-4" /> Filter Kandidat
                              </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                          </div>

                          <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-navy">Kandidat Terdekat</h3>
                              <button 
                                onClick={() => handleLocationClick(user.location || 'Jakarta')}
                                className="text-navy text-sm font-bold hover:underline flex items-center gap-1"
                              >
                                <MapPin className="w-4 h-4" /> Lihat Sekitar
                              </button>
                            </div>
                            <div className="space-y-4">
                              {MOCK_CANDIDATES.filter(c => 
                                user.location && (user.location.includes(c.location) || c.location.includes(user.location))
                              ).slice(0, 3).map(candidate => (
                                <div 
                                  key={candidate.id} 
                                  onClick={() => showToast(`Membuka profil: ${candidate.name}`)}
                                  className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center cursor-pointer hover:border-navy/20 transition-all shadow-sm"
                                >
                                  <img src={candidate.avatar} className="w-12 h-12 rounded-full border-2 border-slate-50" referrerPolicy="no-referrer" />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-navy text-sm">{candidate.name}</h4>
                                    <p className="text-slate-500 text-[10px] font-medium">{candidate.title}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-navy font-bold text-[10px]">{candidate.experience}</p>
                                    <p className="text-[10px] text-slate-400">{candidate.location}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                              type="text" 
                              placeholder="Cari posisi atau perusahaan..."
                              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-navy/5"
                            />
                          </div>

                          <section className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-bold text-navy">Cari Lokasi di Peta</h3>
                              <button 
                                onClick={refreshLocation}
                                className="text-[10px] font-bold text-navy bg-yellow px-2 py-1 rounded-lg flex items-center gap-1"
                              >
                                <NavigationIcon className="w-3 h-3" /> GPS SAYA
                              </button>
                            </div>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && locationSearch) {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationSearch)}`, '_blank');
                                  }
                                }}
                                placeholder="Ketik kota atau daerah (misal: Bandung)..."
                                className="w-full pl-4 pr-12 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-navy/10"
                              />
                              <button 
                                onClick={() => {
                                  if (locationSearch) {
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationSearch)}`, '_blank');
                                  } else {
                                    showToast('Ketik lokasi terlebih dahulu');
                                  }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-navy text-white rounded-xl hover:bg-navy/90 transition-all"
                              >
                                <Search className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
                              {['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Bali'].map(city => (
                                <button 
                                  key={city}
                                  onClick={() => handleLocationClick(city)}
                                  className="px-4 py-2 bg-white border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:border-navy/20 transition-all whitespace-nowrap"
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          </section>

                          <h3 className="font-bold text-navy mb-4">Kategori Populer</h3>
                          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                            <button 
                              onClick={() => setSelectedJobCategory(null)}
                              className={`flex-shrink-0 px-6 py-3 rounded-xl border border-slate-100 shadow-sm font-medium transition-all ${
                                !selectedJobCategory ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-navy/20'
                              }`}
                            >
                              Semua
                            </button>
                            {CATEGORIES.map(cat => (
                              <button 
                                key={cat.id} 
                                onClick={() => {
                                  setSelectedJobCategory(cat.id);
                                  showToast(`Mencari kategori: ${cat.name}`);
                                }}
                                className={`flex-shrink-0 px-6 py-3 rounded-xl border border-slate-100 shadow-sm font-medium flex items-center gap-2 transition-all ${
                                  selectedJobCategory === cat.id ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 hover:border-navy/20'
                                }`}
                              >
                                <span>{cat.icon}</span> {cat.name}
                              </button>
                            ))}
                          </div>

                          <div className="mt-8">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-bold text-navy">
                                {selectedJobCategory ? `Loker: ${CATEGORIES.find(c => c.id === selectedJobCategory)?.name}` : 'Loker Terdekat'}
                              </h3>
                              <button 
                                onClick={() => handleLocationClick(user.location || 'Jakarta')}
                                className="text-navy text-sm font-bold hover:underline flex items-center gap-1"
                              >
                                <MapPin className="w-4 h-4" /> Lihat Sekitar
                              </button>
                            </div>
                            <div className="space-y-4">
                              {sortedJobs.filter(j => !selectedJobCategory || j.category.toLowerCase().includes(selectedJobCategory.toLowerCase())).slice(0, 5).map(job => (
                                <div 
                                  key={job.id} 
                                  onClick={() => openDetail(job)}
                                  className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 items-center cursor-pointer hover:border-navy/20 transition-all shadow-sm"
                                >
                                  <img src={job.logo} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                                  <div className="flex-1">
                                    <h4 className="font-bold text-navy text-sm">{job.title}</h4>
                                    <p className="text-slate-400 text-xs">{job.company} • {job.location}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-navy font-bold text-xs">{job.salary.split(' - ')[0]}</p>
                                    <p className="text-[10px] text-slate-400">{job.postedAt}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'applications' && (
                    <div>
                      <h2 className="text-2xl font-bold text-navy mb-6">Status Lamaran</h2>
                      {applications.length > 0 ? (
                        <div className="space-y-4">
                          {applications.map(app => {
                            const job = MOCK_JOBS.find(j => j.id === app.jobId);
                            return (
                              <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex gap-3 items-center">
                                    <img src={job?.logo} className="w-10 h-10 rounded-lg" referrerPolicy="no-referrer" />
                                    <div>
                                      <h4 className="font-bold text-navy">{job?.title}</h4>
                                      <p className="text-slate-400 text-xs">{job?.company}</p>
                                    </div>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    app.status === 'Terkirim' ? 'bg-blue-100 text-blue-600' :
                                    app.status === 'Review' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-emerald-100 text-emerald-600'
                                  }`}>
                                    {app.status}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-4 border-t border-slate-50">
                                  <span>Dikirim pada {app.appliedAt}</span>
                                  <button 
                                    onClick={() => showToast('Membuka detail lamaran...')}
                                    className="text-navy font-bold hover:underline"
                                  >
                                    Detail Lamaran
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-20">
                          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-10 h-10 text-slate-300" />
                          </div>
                          <h3 className="text-lg font-bold text-navy">Belum ada lamaran</h3>
                          <p className="text-slate-500 mt-2">Mulai buka pintumu dengan melamar pekerjaan yang sesuai!</p>
                          <button 
                            onClick={() => setActiveTab('home')}
                            className="mt-6 btn-primary mx-auto"
                          >
                            Cari Pekerjaan
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'profile' && (
                    <div className="pb-8">
                      <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full border-4 border-yellow p-1">
                            <img 
                              src="https://picsum.photos/seed/user1/200/200" 
                              className="w-full h-full rounded-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="absolute -bottom-2 -right-2 bg-navy text-white p-2 rounded-full border-2 border-white">
                            <Play className="w-3 h-3 fill-white" />
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-navy mt-4">{user.name}</h2>
                        <p className="text-slate-500 text-sm">{user.title}</p>
                        
                        <button 
                          onClick={toggleRole}
                          className="mt-4 px-4 py-2 bg-navy/5 text-navy rounded-xl text-xs font-bold border border-navy/10 flex items-center gap-2"
                        >
                          <Briefcase className="w-3 h-3" /> 
                          Pindah ke Mode Employer
                        </button>

                        <button 
                          onClick={() => {
                            setUser({ ...user, isLoggedIn: false });
                            setView('role-selection');
                            showToast('Berhasil keluar dari akun');
                          }}
                          className="mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2"
                        >
                          <LogOut className="w-3 h-3" /> 
                          Keluar dari Akun
                        </button>
                      </div>

                      {/* Completion Score */}
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-navy">Skor Kelengkapan CV</h4>
                          <span className="text-navy font-bold">{user.completionScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${user.completionScore}%` }}
                            className="h-full bg-yellow"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        {user.role === 'applicant' && (
                          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                            <div className="p-4 border-b border-slate-50 flex items-center gap-3">
                              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                                <Heart className="w-5 h-5" />
                              </div>
                              <span className="font-bold text-navy">Lowongan Disimpan</span>
                            </div>
                            <div className="p-4 space-y-4">
                              {savedJobs.length > 0 ? (
                                savedJobs.map(jobId => {
                                  const job = jobs.find(j => j.id === jobId);
                                  if (!job) return null;
                                  return (
                                    <div 
                                      key={job.id} 
                                      onClick={() => openDetail(job)}
                                      className="flex justify-between items-center cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
                                    >
                                      <div className="flex items-center gap-3">
                                        <img src={job.logo} className="w-10 h-10 rounded-lg" referrerPolicy="no-referrer" />
                                        <div>
                                          <h5 className="font-bold text-navy text-xs">{job.title}</h5>
                                          <p className="text-[10px] text-slate-400">{job.company}</p>
                                        </div>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-center text-slate-400 text-xs py-4 italic">Belum ada lowongan yang disimpan.</p>
                              )}
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => setView('edit-profile')}
                          className="w-full p-4 bg-white rounded-2xl border border-slate-100 flex justify-between items-center hover:border-navy/20 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-navy">Informasi Pribadi</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-300" />
                        </button>
                        
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                          <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <Briefcase className="w-5 h-5" />
                              </div>
                              <span className="font-bold text-navy">Pengalaman Kerja</span>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingExperience({ id: '', company: '', position: '', period: '' });
                                setView('edit-experience');
                              }}
                              className="text-navy text-xs font-bold"
                            >
                              + Tambah
                            </button>
                          </div>
                          <div className="p-4 space-y-4">
                            {user.experience.map(exp => (
                              <div key={exp.id} className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-navy text-sm">{exp.position}</h5>
                                  <p className="text-xs text-slate-400">{exp.company} • {exp.period}</p>
                                </div>
                                <button onClick={() => {
                                  setEditingExperience(exp);
                                  setView('edit-experience');
                                }}>
                                  <ChevronRight className="w-4 h-4 text-slate-300" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>

            <Navigation 
              activeTab={activeTab} 
              setActiveTab={(tab) => {
                setActiveTab(tab);
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-navy text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[100] flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-white rounded-t-[40px] p-8 pb-12"
            >
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setIsFilterOpen(false)} className="p-2 bg-slate-50 rounded-xl text-navy flex items-center gap-1">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-[10px] font-bold">Kembali</span>
                </button>
                <h3 className="text-xl font-bold text-navy text-center flex-1 pr-12">Filter Lanjutan</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Tipe Pekerjaan</label>
                  <div className="flex flex-wrap gap-2">
                    {['Full-time', 'Part-time', 'Freelance', 'Internship'].map(type => (
                      <button 
                        key={type} 
                        onClick={() => setFilters({...filters, type: filters.type === type ? '' : type})}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          filters.type === type 
                            ? 'bg-navy text-white border-navy shadow-md' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-navy hover:text-navy'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Rentang Gaji (Juta)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.salaryMin}
                      onChange={(e) => setFilters({...filters, salaryMin: e.target.value})}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-navy/5" 
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.salaryMax}
                      onChange={(e) => setFilters({...filters, salaryMax: e.target.value})}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-navy/5" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Pengalaman</label>
                  <div className="flex flex-wrap gap-2">
                    {['Fresh Graduate', '1-3 Tahun', '3-5 Tahun', '5+ Tahun'].map(exp => (
                      <button 
                        key={exp} 
                        onClick={() => setFilters({...filters, experience: filters.experience === exp ? '' : exp})}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                          filters.experience === exp 
                            ? 'bg-navy text-white border-navy shadow-md' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-navy hover:text-navy'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => {
                      setFilters({ type: '', experience: '', salaryMin: '', salaryMax: '' });
                      showToast('Filter direset');
                    }}
                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={() => {
                      setIsFilterOpen(false);
                      showToast('Filter berhasil diterapkan!');
                    }}
                    className="flex-[2] py-4 bg-navy text-white rounded-2xl font-bold shadow-lg shadow-navy/20"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
