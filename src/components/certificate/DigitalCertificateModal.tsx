"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
} from 'lucide-react';
import { CertificateType, DigitalCertificate, Pet, UserProfile } from '@/types';
import {
  generateCertNumber,
  generateSecurityHash,
  generateQRCodeDataUrl,
  getCertTypeLabel,
} from '@/utils/certGenerator';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  selectedPetId?: string;
  user: UserProfile;
  onSaveCertificate: (cert: DigitalCertificate) => void;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  pets,
  selectedPetId,
  onSaveCertificate,
}) => {
  const [step, setStep] = useState<'upload' | 'details' | 'preview'>('upload');
  const [petId, setPetId] = useState<string>(() => selectedPetId || pets[0]?.id || '');
  const [certType, setCertType] = useState<CertificateType>('pedigree');
  const [title, setTitle] = useState<string>(() => getCertTypeLabel('pedigree').label);
  const [certNo, setCertNo] = useState<string>(() => generateCertNumber('pedigree'));
  const [issuingAuthority, setIssuingAuthority] = useState<string>(
    'World Cat Federation (WCF) & Meow World Official'
  );
  const [issueDate, setIssueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [originalDocUrl, setOriginalDocUrl] = useState<string>('');
  const [securityHash] = useState<string>(() => generateSecurityHash());
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [sireName, setSireName] = useState('');
  const [damName, setDamName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [viewMode, setViewMode] = useState<'overlay' | 'original'>('overlay');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const certContainerRef = useRef<HTMLDivElement>(null);

  // Generate QR code whenever cert number changes
  useEffect(() => {
    if (certNo) {
      const payload = `https://meowworld.life/verify/${certNo}?hash=${securityHash.slice(7, 15)}`;
      generateQRCodeDataUrl(payload).then(setQrCodeDataUrl);
    }
  }, [certNo, securityHash]);

  if (!isOpen) return null;

  const activePet = pets.find((p) => p.id === (petId || selectedPetId)) || pets[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalDocUrl(event.target?.result as string);
      setStep('details');
    };
    reader.readAsDataURL(file);
  };

  const handleUseSampleDoc = () => {
    const sampleUrls: Record<CertificateType, string> = {
      pedigree: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80',
      vaccine: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
      microchip: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
      adoption: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=80',
      health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      general: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    };
    setOriginalDocUrl(sampleUrls[certType]);
    setStep('details');
  };

  const handleGenerateCertificate = () => {
    if (!originalDocUrl) return;
    setStep('preview');
  };

  const handleSave = () => {
    const newCert: DigitalCertificate = {
      id: `cert-${Date.now()}`,
      pet_id: petId || activePet?.id || '',
      cert_type: certType,
      title: title || getCertTypeLabel(certType).label,
      certificate_no: certNo,
      issuing_authority: issuingAuthority,
      issue_date: issueDate,
      expiry_date: expiryDate || undefined,
      original_doc_url: originalDocUrl,
      security_hash: securityHash,
      verification_qr_payload: `https://meowworld.life/verify/${certNo}`,
      metadata: {
        sire_name: sireName || undefined,
        dam_name: damName || undefined,
        doctor_name: doctorName || undefined,
        clinic_name: clinicName || undefined,
      },
      created_at: new Date().toISOString(),
    };

    onSaveCertificate(newCert);
    onClose();
  };

  const handleDownload = () => {
    alert('บันทึกรูปภาพใบรับรองดิจิทัล Meow World Digital Certificate สำเร็จแล้ว!');
  };

  const certTypeInfo = getCertTypeLabel(certType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B89320] text-white flex items-center justify-center shadow-md">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">Meow World Digital Certificate</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCF8EE] text-[#C89933] border border-[#C89933]/30">
                  Official Layer
                </span>
              </div>
              <p className="text-xs text-[#8C867E]">
                แปลงเอกสารจริงเป็นใบรับรองดิจิทัล พร้อมกรอบทอง ลายน้ำ และ QR Code ตรวจสอบ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867E] hover:text-[#1F1E1D] hover:bg-[#E8E2D9]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between px-8 py-3 bg-[#FAF7F2] border-b border-[#E8E2D9] text-xs font-bold">
          <button
            onClick={() => setStep('upload')}
            className={`flex items-center gap-1.5 ${
              step === 'upload' ? 'text-[#E06D53]' : 'text-[#8C867E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>ถ่ายรูปเอกสารจริง</span>
          </button>
          <div className="w-12 h-0.5 bg-[#E8E2D9]"></div>

          <button
            onClick={() => originalDocUrl && setStep('details')}
            disabled={!originalDocUrl}
            className={`flex items-center gap-1.5 ${
              step === 'details' ? 'text-[#E06D53]' : 'text-[#8C867E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
              2
            </span>
            <span>ระบุข้อมูลใบรับรอง</span>
          </button>
          <div className="w-12 h-0.5 bg-[#E8E2D9]"></div>

          <button
            onClick={() => originalDocUrl && setStep('preview')}
            disabled={!originalDocUrl}
            className={`flex items-center gap-1.5 ${
              step === 'preview' ? 'text-[#C89933]' : 'text-[#8C867E]'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[10px]">
              3
            </span>
            <span>Generate ครอบทับเอกสาร</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: UPLOAD PHYSICAL DOCUMENT */}
          {step === 'upload' && (
            <div className="space-y-6">
              <div className="text-center max-w-md mx-auto space-y-1">
                <h4 className="font-serif font-bold text-lg text-[#1F1E1D]">
                  ถ่ายรูปหรืออัปโหลดเอกสารฉบับจริง
                </h4>
                <p className="text-xs text-[#59554F]">
                  เช่น ใบเพ็ดดีกรี (Pedigree), สมุดวัคซีน, ใบลงทะเบียนไมโครชิป หรือเอกสารรับเลี้ยง
                </p>
              </div>

              {/* Upload Dropzone */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#C89933]/50 hover:border-[#C89933] bg-[#FCF8EE]/40 hover:bg-[#FCF8EE] rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-[#E8D28A] flex items-center justify-center text-[#C89933] group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1F1E1D]">
                    คลิกเพื่อถ่ายรูปด้วยกล้อง หรืออัปโหลดไฟล์ภาพเอกสาร
                  </p>
                  <p className="text-xs text-[#8C867E] mt-1">รองรับไฟล์ JPG, PNG, HEIC (ขนาดไม่เกิน 15MB)</p>
                </div>
              </div>

              {/* Alternative sample test doc */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
                <div className="text-xs">
                  <span className="font-bold text-[#1F1E1D]">ไม่มีเอกสารตัวจริงอยู่ใกล้ตัว?</span>
                  <p className="text-[#8C867E]">ใช้ภาพเอกสารตัวอย่างเพื่อทดสอบสร้าง Certificate ทันที</p>
                </div>
                <button
                  type="button"
                  onClick={handleUseSampleDoc}
                  className="px-4 py-2 rounded-xl bg-white border border-[#C89933] text-[#C89933] hover:bg-[#FCF8EE] text-xs font-bold transition-colors"
                >
                  ใช้เอกสารตัวอย่าง
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FILL CERTIFICATE DETAILS */}
          {step === 'details' && (
            <div className="space-y-5">
              {/* Pet & Certificate Type Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">
                    สัตว์เลี้ยงเจ้าของเอกสาร:
                  </label>
                  <select
                    value={petId}
                    onChange={(e) => setPetId(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
                  >
                    {pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        🐾 {p.name} ({p.breed || p.species})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">
                    ประเภทเอกสาร / ใบรับรอง:
                  </label>
                  <select
                    value={certType}
                    onChange={(e) => {
                      const newType = e.target.value as CertificateType;
                      setCertType(newType);
                      setTitle(getCertTypeLabel(newType).label);
                      setCertNo(generateCertNumber(newType));
                      setIssuingAuthority(
                        newType === 'pedigree'
                          ? 'World Cat Federation (WCF) & Meow World Official'
                          : newType === 'vaccine'
                          ? 'Meow Care Animal Hospital Bangkok'
                          : 'National Animal Registry & Meow World'
                      );
                    }}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
                  >
                    <option value="pedigree">👑 ใบรับรองสายพันธุ์ & เพ็ดดีกรี (Pedigree)</option>
                    <option value="vaccine">💉 ใบรับรองการฉีดวัคซีน & สุขภาพ (Vaccine)</option>
                    <option value="microchip">📡 ใบลงทะเบียนไมโครชิป (Microchip)</option>
                    <option value="adoption">🏠 ใบรับรองการรับอุปการะ (Adoption)</option>
                    <option value="health">🩺 ใบตรวจสุขภาพประจำปี (Health Exam)</option>
                    <option value="general">📜 ใบรับรอง Meow World Official</option>
                  </select>
                </div>
              </div>

              {/* Title & Certificate Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">ชื่อเอกสารใบรับรอง:</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">
                    เลขทะเบียน / Certificate No.:
                  </label>
                  <input
                    type="text"
                    value={certNo}
                    onChange={(e) => setCertNo(e.target.value)}
                    required
                    className="w-full text-xs font-mono font-bold p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
                  />
                </div>
              </div>

              {/* Authority & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">หน่วยงานผู้ออกเอกสาร:</label>
                  <input
                    type="text"
                    value={issuingAuthority}
                    onChange={(e) => setIssuingAuthority(e.target.value)}
                    placeholder="เช่น WCF / คลินิก"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">วันที่ออกเอกสาร:</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1F1E1D] mb-1">วันหมดอายุ (ถ้ามี):</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Sub-fields based on Certificate Type */}
              {certType === 'pedigree' && (
                <div className="p-4 rounded-2xl bg-[#FCF8EE] border border-[#E8D28A] space-y-3">
                  <span className="text-xs font-bold text-[#A4781E]">ข้อมูลสายเลือด (Pedigree Lineage)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ชื่อพ่อพันธุ์ (Sire Name)"
                      value={sireName}
                      onChange={(e) => setSireName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-white border border-[#E8D28A] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="ชื่อแม่พันธุ์ (Dam Name)"
                      value={damName}
                      onChange={(e) => setDamName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-white border border-[#E8D28A] outline-none"
                    />
                  </div>
                </div>
              )}

              {certType === 'vaccine' && (
                <div className="p-4 rounded-2xl bg-[#F0F5FF] border border-[#B8D0FF] space-y-3">
                  <span className="text-xs font-bold text-[#2A5298]">ข้อมูลสัตวแพทย์ผู้ฉีดวัคซีน</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ชื่อสัตวแพทย์ (เช่น น.สพ. ดร. ฟ้าประทาน)"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-white border border-[#B8D0FF] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="ชื่อคลินิก / โรงพยาบาลสัตว์"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-white border border-[#B8D0FF] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Scanned Document Thumbnail Preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalDocUrl}
                  alt="Original Document Thumbnail"
                  className="w-16 h-16 rounded-xl object-cover border border-[#E8E2D9]"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-bold text-[#1F1E1D]">ภาพเอกสารจริงที่อัปโหลด</span>
                  <p className="text-[#8C867E] truncate">พร้อมสำหรับการประทับตราและครอบกรอบดิจิทัล</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D9] text-xs font-bold text-[#59554F] hover:bg-[#F3EFEA]"
                >
                  เปลี่ยนภาพ
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & GENERATE OVERLAY CERTIFICATE */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Overlay vs Original View Switcher */}
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('overlay')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      viewMode === 'overlay'
                        ? 'bg-[#C89933] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#59554F] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Meow World Digital Overlay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('original')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      viewMode === 'original'
                        ? 'bg-[#1F1E1D] text-white shadow-xs'
                        : 'bg-[#FAF7F2] text-[#59554F] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ภาพเอกสารจริงต้นฉบับ</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D9] text-xs font-bold text-[#1F1E1D] hover:bg-[#FAF7F2] shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด PNG</span>
                  </button>
                </div>
              </div>

              {/* The Certified Visual Frame / Overlay Wrapper */}
              <div
                ref={certContainerRef}
                className="relative rounded-3xl p-5 sm:p-7 cert-gold-frame overflow-hidden shadow-xl"
              >
                {viewMode === 'overlay' ? (
                  <>
                    {/* Watermark Background Pattern */}
                    <div className="absolute inset-0 watermark-pattern opacity-60 pointer-events-none"></div>

                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                    <div className="absolute top-2 right-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                    <div className="absolute bottom-2 left-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                    <div className="absolute bottom-2 right-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>

                    {/* Certificate Top Header */}
                    <div className="relative z-10 text-center pb-4 border-b border-[#E8D28A]/80">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-xl">👑</span>
                        <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#845E1B] tracking-tight">
                          MEOW WORLD DIGITAL CERTIFICATE
                        </h2>
                        <span className="text-xl">👑</span>
                      </div>
                      <p className="text-[11px] font-mono text-[#A4781E] uppercase tracking-widest">
                        Official Certified & Encrypted Digital Asset
                      </p>
                    </div>

                    {/* Certificate Body: Split between Real Scanned Document Overlay and Pet Credentials */}
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-5">
                      {/* Physical Scanned Document Inside Certified Glass Frame */}
                      <div className="md:col-span-6 relative rounded-2xl overflow-hidden border-2 border-[#E8D28A] shadow-md bg-black/5 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={originalDocUrl}
                          alt="Physical Document Underneath"
                          className="w-full h-56 sm:h-64 object-cover filter contrast-[1.05]"
                        />

                        {/* Digital Hologram & Verification Seal Overlay on the document */}
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold border border-[#E8D28A] flex items-center gap-1 shadow-md">
                          <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                          <span>VERIFIED DOC</span>
                        </div>

                        {/* Diagonal Official Watermark Ribbon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                          <div className="rotate-[-25deg] border-4 border-[#C89933] px-6 py-2 rounded-xl text-[#C89933] font-serif font-black text-xl tracking-widest uppercase">
                            MEOW WORLD OFFICIAL
                          </div>
                        </div>

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white flex items-center justify-between text-[11px]">
                          <span className="font-mono">ORIGINAL SCAN PHOTO</span>
                          <span className="text-[#E8D28A] font-bold">100% AUTHENTIC</span>
                        </div>
                      </div>

                      {/* Right Details: Pet Identity & Registry Specs */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#E8D28A] shadow-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-[#A4781E] font-bold">
                              CERTIFICATE TITLE
                            </span>
                            <span className="text-xs font-bold text-[#845E1B]">
                              {certTypeInfo.icon} {title}
                            </span>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                            <span className="text-[10px] text-[#8C867E]">ชื่อสัตว์เลี้ยง:</span>
                            <strong className="text-xs text-[#1F1E1D]">{activePet?.name}</strong>
                          </div>

                          <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                            <span className="text-[10px] text-[#8C867E]">สายพันธุ์ / สี:</span>
                            <span className="text-xs text-[#59554F] font-medium">
                              {activePet?.breed || activePet?.species}
                            </span>
                          </div>

                          {activePet?.microchip_id && (
                            <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                              <span className="text-[10px] text-[#8C867E]">เลขไมโครชิป:</span>
                              <span className="text-xs font-mono font-bold text-[#1F1E1D]">
                                {activePet.microchip_id}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                            <span className="text-[10px] text-[#8C867E]">หน่วยงานผู้ออก:</span>
                            <span className="text-xs text-[#59554F] truncate max-w-[160px]">
                              {issuingAuthority}
                            </span>
                          </div>
                        </div>

                        {/* QR Code & Security Stamp */}
                        <div className="p-3 rounded-2xl bg-white/90 border border-[#E8D28A] flex items-center gap-3">
                          {qrCodeDataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={qrCodeDataUrl}
                              alt="Verification QR"
                              className="w-16 h-16 rounded-lg border border-[#E8D28A] shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-[#FAF7F2] rounded-lg"></div>
                          )}

                          <div className="min-w-0 text-[11px]">
                            <div className="flex items-center gap-1 text-[#845E1B] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#C89933]" />
                              <span>สแกนเพื่อตรวจสอบความถูกต้อง</span>
                            </div>
                            <p className="font-mono text-[10px] text-[#8C867E] truncate mt-0.5">
                              {certNo}
                            </p>
                            <p className="font-mono text-[9px] text-[#BDB7AE] truncate">
                              {securityHash}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Footer */}
                    <div className="relative z-10 pt-3 border-t border-[#E8D28A]/80 flex flex-wrap items-center justify-between text-[10px] text-[#845E1B] font-mono">
                      <span>ISSUED: {issueDate}</span>
                      <span>AUTHORITY: {issuingAuthority}</span>
                      <span>SECURED BY MEOW WORLD HEART EDITION</span>
                    </div>
                  </>
                ) : (
                  /* Original Document Full View */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8D28A]">
                      <span className="font-serif font-bold text-sm text-[#845E1B]">
                        ภาพเอกสารจริงต้นฉบับ (Original Physical Document)
                      </span>
                      <span className="text-xs font-mono text-[#8C867E]">
                        บันทึกเมื่อ: {new Date().toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-[#E8D28A] max-h-[480px] bg-black/5 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={originalDocUrl} alt="Original Document Full" className="w-full h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex items-center justify-between">
          {step === 'upload' ? (
            <div></div>
          ) : step === 'details' ? (
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#59554F] hover:bg-[#E8E2D9]/60"
            >
              ย้อนกลับ
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep('details')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#59554F] hover:bg-[#E8E2D9]/60"
            >
              แก้ไขข้อมูล
            </button>
          )}

          <div className="flex items-center gap-2">
            {step === 'details' && (
              <button
                type="button"
                onClick={handleGenerateCertificate}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89320] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Digital Certificate</span>
              </button>
            )}

            {step === 'preview' && (
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#E06D53] hover:bg-[#CC573C] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E06D53]/20 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>บันทึกเข้าสู่ Passport ของน้อง</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
