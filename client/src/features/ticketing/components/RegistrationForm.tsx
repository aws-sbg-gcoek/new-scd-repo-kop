import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PassType } from '../hooks/usePassTypes';
import { compressImageToBase64 } from '../../../utils/registrationStore';

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  district: string;
  collegeName: string;
  prnRollNo: string;
  degree: string;
  branch: string;
  academicYear: string;
  idProofName?: string;
  idProofBase64?: string;
}

interface Props {
  selectedPass: PassType;
  initialData?: Partial<RegistrationFormData>;
  loading: boolean;
  error: string | null;
  onSubmit: (data: RegistrationFormData) => void;
  onBack: () => void;
}

const DISTRICT_COLLEGES: Record<string, string[]> = {
  Kolhapur: [
    'Government College of Engineering Karad (GCOEK)',
    'Shivaji University (DOT), Kolhapur',
    'D.Y. Patil College of Engineering and Technology, Kolhapur',
    "KIT's College of Engineering (Autonomous), Kolhapur",
    "DKTE Society's Textile and Engineering Institute, Ichalkaranji",
    'Sanjeevan Engineering and Technology Institute, Panhala',
    'Bharati Vidyapeeth College of Engineering, Kolhapur',
    'Government Polytechnic, Kolhapur',
    'Sharad Institute of Technology College of Engineering, Yadrav',
    'Tatyasaheb Kore Institute of Engineering & Technology, Warananagar',
    'Other / College not listed',
  ],
  Pune: [
    'COEP Technological University, Pune',
    'Pune Institute of Computer Technology (PICT)',
    'Vishwakarma Institute of Technology (VIT)',
    'MIT World Peace University (MIT-WPU)',
    'Cummins College of Engineering for Women',
    'Army Institute of Technology (AIT)',
    'Pimpri Chinchwad College of Engineering (PCCOE)',
    'Sinhgad College of Engineering (SCOE)',
    'Other / College not listed',
  ],
  Mumbai: [
    'Veermata Jijabai Technological Institute (VJTI)',
    'Sardar Patel Institute of Technology (SPIT)',
    'K. J. Somaiya College of Engineering',
    'Thadomal Shahani Engineering College (TSEC)',
    'Dwarkadas J. Sanghvi College of Engineering (DJSCE)',
    'Father Conceicao Rodrigues College of Engineering (FCRCE)',
    'Other / College not listed',
  ],
  Sangli: [
    'Walchand College of Engineering, Sangli',
    'Padmabhooshan Vasantraodada Patil Institute of Technology (PVPIT)',
    'Nanasaheb Mahadik College of Engineering, Peth',
    'Other / College not listed',
  ],
  Satara: [
    'Government College of Engineering, Karad',
    'Karmaveer Bhaurao Patil College of Engineering, Satara',
    'Rayat Shikshan Sanstha Institutes',
    'Other / College not listed',
  ],
  Solapur: [
    'Walchand Institute of Technology (WIT), Solapur',
    'N.K. Orchid College of Engineering and Technology',
    'Brahmdevdada Mane Institute of Technology',
    'Other / College not listed',
  ],
  Other: [
    'Other Maharashtra Engineering College',
    'Other University / Institute outside Maharashtra',
  ],
};

const DEGREES = [
  'B.Tech / B.E.',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'M.Tech / M.E.',
  'B.Sc (Computer Science / IT)',
  'M.Sc (Computer Science / IT)',
  'Diploma in Engineering',
  'Other Degree / Program',
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Information Technology (IT)',
  'Computer Science & Business Systems (CSBS)',
  'Electronics & Telecommunication (E&TC)',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Robotics & Automation',
  'Other Specialization',
];

const ACADEMIC_YEARS = ['1st Yr', '2nd Yr', '3rd Yr', '4th Yr', 'PG'];

export function RegistrationForm({ selectedPass, initialData, loading, error, onSubmit, onBack }: Props) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    district: initialData?.district || 'Kolhapur',
    collegeName: initialData?.collegeName || DISTRICT_COLLEGES.Kolhapur[0],
    prnRollNo: initialData?.prnRollNo || '',
    degree: initialData?.degree || DEGREES[0],
    branch: initialData?.branch || BRANCHES[0],
    academicYear: initialData?.academicYear || '3rd Yr',
    idProofName: initialData?.idProofName || '',
    idProofBase64: initialData?.idProofBase64 || '',
  });

  const [customCollege, setCustomCollege] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState(false);

  const handleDistrictChange = (district: string) => {
    const colleges = DISTRICT_COLLEGES[district] || DISTRICT_COLLEGES.Other;
    setFormData((prev) => ({
      ...prev,
      district,
      collegeName: colleges[0],
    }));
  };

  const handleIdProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    setUploadingId(true);
    try {
      const base64 = await compressImageToBase64(file, 800, 800, 0.7);
      setFormData((prev) => ({
        ...prev,
        idProofName: file.name,
        idProofBase64: base64,
      }));
    } catch (err) {
      console.error(err);
      alert('Failed to process image');
    } finally {
      setUploadingId(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid Email Address is required';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Valid 10-digit mobile number is required';
    }
    if (!formData.prnRollNo.trim()) {
      errors.prnRollNo = 'College PRN / Roll Number is required';
    }
    if (formData.collegeName.includes('Other') && !customCollege.trim()) {
      errors.collegeName = 'Please enter your college name';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const finalCollege = formData.collegeName.includes('Other') ? customCollege.trim() : formData.collegeName;
    onSubmit({
      ...formData,
      collegeName: finalCollege,
      phone: cleanPhone.slice(-10),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Pass summary top pill */}
      <div className="flex items-center justify-between p-3.5 mb-6 border border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-8 shrink-0" style={{ backgroundColor: selectedPass.badge_color }} />
          <div>
            <p className="font-sans font-black italic text-sm uppercase tracking-tight text-white">
              {selectedPass.name}
            </p>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
              Selected Tier
            </p>
          </div>
        </div>
        <span className="font-mono text-lg text-aws-orange font-bold">₹{selectedPass.price}</span>
      </div>

      {error && (
        <div className="p-3 mb-6 border border-f1-red/30 bg-f1-red/10 text-f1-red text-xs font-mono flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Full Name */}
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: '' });
            }}
            placeholder="e.g. Rohan Sharma"
            className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
          />
          {fieldErrors.fullName && <p className="text-f1-red text-[10px] font-mono mt-1">{fieldErrors.fullName}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: '' });
              }}
              placeholder="e.g. rohan@example.com"
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
            />
            {fieldErrors.email && <p className="text-f1-red text-[10px] font-mono mt-1">{fieldErrors.email}</p>}
            <p className="text-[9px] font-mono text-white/30 mt-1">Ticket pass will be delivered to this email.</p>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setFormData({ ...formData, phone: digits });
                if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
              }}
              placeholder="e.g. 9823456781"
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors font-mono"
            />
            {fieldErrors.phone && <p className="text-f1-red text-[10px] font-mono mt-1">{fieldErrors.phone}</p>}
          </div>
        </div>

        {/* District & College */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              District / Region <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.district}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
            >
              {Object.keys(DISTRICT_COLLEGES).map((d) => (
                <option key={d} value={d} className="bg-[#111] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              College / Institution <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.collegeName}
              onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors truncate"
            >
              {(DISTRICT_COLLEGES[formData.district] || DISTRICT_COLLEGES.Other).map((c) => (
                <option key={c} value={c} className="bg-[#111] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.collegeName.includes('Other') && (
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-aws-orange mb-1.5 font-bold">
              Specify College Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={customCollege}
              onChange={(e) => setCustomCollege(e.target.value)}
              placeholder="Enter your college / institute full name"
              className="w-full bg-[#111] border border-aws-orange/40 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* PRN, Degree, Branch & Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              PRN / Roll Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.prnRollNo}
              onChange={(e) => {
                setFormData({ ...formData, prnRollNo: e.target.value });
                if (fieldErrors.prnRollNo) setFieldErrors({ ...fieldErrors, prnRollNo: '' });
              }}
              placeholder="e.g. 2201045"
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors font-mono"
            />
            {fieldErrors.prnRollNo && <p className="text-f1-red text-[10px] font-mono mt-1">{fieldErrors.prnRollNo}</p>}
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              Degree / Program <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
            >
              {DEGREES.map((d) => (
                <option key={d} value={d} className="bg-[#111] text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              Branch / Specialization <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors truncate"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b} className="bg-[#111] text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
              Academic Year <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full bg-[#111] border border-white/15 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-aws-orange focus:outline-none transition-colors"
            >
              {ACADEMIC_YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#111] text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student ID Proof Upload */}
        <div className="pt-2">
          <label className="block font-mono text-[10px] uppercase tracking-widest text-white/50 mb-1.5 font-bold">
            Student College ID Proof (Recommended)
          </label>
          <div className="border border-dashed border-white/20 p-4 text-center hover:border-aws-orange/50 transition-colors bg-white/[0.02]">
            <input
              type="file"
              id="studentIdUpload"
              accept="image/*"
              className="hidden"
              onChange={handleIdProofUpload}
            />
            <label htmlFor="studentIdUpload" className="cursor-pointer flex flex-col items-center gap-1.5">
              <Upload size={18} className="text-aws-orange" />
              {uploadingId ? (
                <span className="font-mono text-xs text-aws-orange">Compressing ID proof...</span>
              ) : formData.idProofName ? (
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                  <CheckCircle2 size={14} /> {formData.idProofName}
                </div>
              ) : (
                <>
                  <span className="font-mono text-xs text-white/70">Click to upload Student ID or Fee Receipt</span>
                  <span className="font-mono text-[9px] text-white/30">PNG, JPG up to 8MB</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-3 border border-white/20 text-white/60 text-xs font-mono uppercase tracking-widest hover:bg-white/5 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-5 py-3 bg-f1-red text-white text-xs font-mono uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
          >
            Continue to Payment (₹{selectedPass.price})
          </button>
        </div>
      </form>
    </motion.div>
  );
}
