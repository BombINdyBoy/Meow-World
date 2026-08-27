"use client";

import React, { useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { DigitalCertificate, Pet, UserRole } from '@/types';
import { CertificateCard } from './CertificateCard';

interface CertificateListViewProps {
  certificates: DigitalCertificate[];
  pets: Pet[];
  userRole: UserRole;
  onOpenNewCert: (petId?: string) => void;
  onViewCert: (cert: DigitalCertificate) => void;
}

export const CertificateListView: React.FC<CertificateListViewProps> = ({
  certificates,
  pets,
  userRole,
  onOpenNewCert,
  onViewCert,
}) => {
  const [selectedPetFilter, setSelectedPetFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const canCreate = userRole === 'owner' || userRole === 'editor';

  const filteredCerts = certificates.filter((cert) => {
    const matchesPet = selectedPetFilter === 'all' || cert.pet_id === selectedPetFilter;
    const matchesType = selectedTypeFilter === 'all' || cert.cert_type === selectedTypeFilter;
    return matchesPet && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#FAF6E9] via-[#FFFDF9] to-[#F5EED8] border border-[#E8D28A] p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C89933] text-white">
              VERIFIED REPOSITORY
            </span>
            <span className="text-xs text-[#845E1B] font-bold">Meow World Official</span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#845E1B] tracking-tight">
            Meow World Digital Certificates
          </h2>

          <p className="text-xs sm:text-sm text-[#59554F] leading-relaxed">
            แปลงภาพถ่ายเอกสารจริง (เช่น ใบเพ็ดดีกรี, สมุดวัคซีน, ทะเบียนไมโครชิป) เป็นใบรับรองดิจิทัลลิขสิทธิ์ Meow World พร้อมตรา QR Code ตรวจสอบความแท้จริงได้ตลอด 24 ชั่วโมง
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => onOpenNewCert()}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89320] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#C89933]/20 transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>สแกน & ออก Certificate ใหม่</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8E2D9]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Pet Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#59554F]">
            <span className="font-bold">สัตว์เลี้ยง:</span>
            <select
              value={selectedPetFilter}
              onChange={(e) => setSelectedPetFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] outline-none"
            >
              <option value="all">สัตว์เลี้ยงทั้งหมด ({pets.length})</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  🐾 {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#59554F]">
            <span className="font-bold">ประเภท:</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D9] outline-none"
            >
              <option value="all">ทุกประเภท</option>
              <option value="pedigree">👑 ใบรับรองสายพันธุ์ (Pedigree)</option>
              <option value="vaccine">💉 สมุดวัคซีน & สุขภาพ</option>
              <option value="microchip">📡 ไมโครชิป</option>
              <option value="adoption">🏠 ใบรับรองการรับเลี้ยง</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-[#8C867E]">
          แสดง {filteredCerts.length} จากทั้งหมด {certificates.length} ฉบับ
        </span>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCerts.map((cert) => {
            const pet = pets.find((p) => p.id === cert.pet_id);
            return (
              <CertificateCard
                key={cert.id}
                cert={cert}
                pet={pet}
                onView={onViewCert}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#E8D28A] max-w-lg mx-auto p-8 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#FCF8EE] text-[#C89933] flex items-center justify-center text-3xl mx-auto border border-[#E8D28A]">
            👑
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">ไม่พบเอกสารใบรับรองดิจิทัล</h3>
          <p className="text-xs text-[#8C867E]">
            ยังไม่มีใบรับรองตามเงื่อนไขที่เลือก ถ่ายรูปเอกสารจริงเพื่อออกใบรับรองดิจิทัล
          </p>
          {canCreate && (
            <button
              onClick={() => onOpenNewCert()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#C89933] text-white text-xs font-bold shadow-xs mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>สร้าง Digital Certificate</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
