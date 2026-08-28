"use client";

import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Sparkles,
  Plus,
  Edit2,
  Syringe,
} from 'lucide-react';
import { DigitalCertificate, JourneyEvent, Pet, UserProfile, UserRole } from '@/types';
import { calculateAge, getCertTypeLabel, generateCertNumber } from '@/utils/certGenerator';
import { CertificateCard } from '../certificate/CertificateCard';

interface PassportViewProps {
  pets: Pet[];
  selectedPetId: string;
  onSelectPet: (petId: string) => void;
  certificates: DigitalCertificate[];
  events: JourneyEvent[];
  currentUser: UserProfile;
  userRole: UserRole;
  onAddNewPet: () => void;
  onUpdatePet: (updatedPet: Pet) => void;
  onOpenNewCert: (petId: string) => void;
  onViewCert: (cert: DigitalCertificate) => void;
  onOpenNewPost: () => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  pets,
  selectedPetId,
  onSelectPet,
  certificates,
  events,
  currentUser,
  userRole,
  onAddNewPet,
  onUpdatePet,
  onOpenNewCert,
  onViewCert,
  onOpenNewPost,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'certs' | 'health' | 'journey' | 'edit'>('overview');
  const [editForm, setEditForm] = useState<Partial<Pet>>({});

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const petCerts = certificates.filter((c) => c.pet_id === activePet?.id);
  const petEvents = events.filter((e) => e.pet_id === activePet?.id);
  const healthEvents = petEvents.filter((e) => e.event_type === 'medical' || e.event_type === 'vaccine');

  const canEdit = userRole === 'owner' || userRole === 'editor';

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePet) return;
    onUpdatePet({
      ...activePet,
      ...editForm,
    });
    alert('บันทึกการแก้ไขข้อมูลพาสปอร์ตเรียบร้อยแล้ว!');
    setActiveSubTab('overview');
  };

  if (!activePet) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E2D9] max-w-xl mx-auto p-8 space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FDEEEB] text-[#E06D53] flex items-center justify-center text-3xl mx-auto">
          🐾
        </div>
        <h3 className="font-serif font-bold text-xl text-[#1F1E1D]">ยังไม่มีพาสปอร์ตในบ้านนี้</h3>
        <p className="text-xs text-[#8C867E]">
          เริ่มต้นสร้างบัตรประจำตัวพาสปอร์ตดิจิทัลตัวแรก เพื่อบันทึกสุขภาพและความทรงจำ
        </p>
        <button
          onClick={onAddNewPet}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#E06D53] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E06D53]/20"
        >
          <Plus className="w-4 h-4" />
          <span>สร้าง Passport สัตว์เลี้ยง</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Pet Switcher Strip */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                pet.id === activePet.id
                  ? 'bg-[#1F1E1D] text-white shadow-sm'
                  : 'bg-white text-[#59554F] border border-[#E8E2D9] hover:border-[#1F1E1D]'
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-[#E8E2D9] shrink-0">
                {pet.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#1F1E1D]">
                    {pet.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <span>{pet.name}</span>
            </button>
          ))}
        </div>

        {canEdit && (
          <button
            onClick={onAddNewPet}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFEA] border border-[#E8E2D9] text-xs font-bold text-[#E06D53] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มพาสปอร์ต</span>
          </button>
        )}
      </div>

      {/* Main Passport Card & Identity Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1F1E1D] to-[#2D2A26] text-white p-6 sm:p-8 shadow-xl border border-[#383532]">
        {/* Subtle Background Pattern */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial from-[#E06D53]/15 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Core Bio */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-[#E8D28A] shadow-lg bg-[#383532] shrink-0">
              {activePet.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activePet.avatar_url} alt={activePet.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-3xl font-bold text-[#E06D53]">
                  {activePet.name.slice(0, 1)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8D28A]/20 text-[#E8D28A] border border-[#E8D28A]/40 uppercase tracking-wider">
                  OFFICIAL PET PASSPORT
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white/80 border border-white/10">
                  สิทธิ์: {userRole === 'owner' ? 'เจ้าของ (Owner)' : userRole === 'editor' ? 'ผู้ดูแล (Editor)' : 'ผู้เข้าชม (Viewer)'}
                </span>
              </div>

              {/* Unique Passport ID */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-mono text-[#BDB7AE]">Passport ID:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E8D28A]/10 text-[#E8D28A] border border-[#E8D28A]/30">
                  MW-PET-{new Date(activePet.created_at).getFullYear()}-{activePet.id.slice(0, 8).toUpperCase()}
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[#FAF7F2]">
                {activePet.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#BDB7AE] mt-0.5">
                {activePet.species} • {activePet.breed || 'ไม่ระบุสายพันธุ์'}
                {activePet.color_marking && ` (${activePet.color_marking})`}
              </p>

              {activePet.microchip_id && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#E8D28A]">
                  <span>📡 Microchip:</span>
                  <span className="font-bold">{activePet.microchip_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] font-mono text-[#BDB7AE] uppercase">อายุ</span>
              <strong className="text-xs sm:text-sm text-white">{calculateAge(activePet.birth_date)}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] font-mono text-[#BDB7AE] uppercase">น้ำหนัก</span>
              <strong className="text-xs sm:text-sm text-white">{activePet.weight ? `${activePet.weight} kg` : '-'}</strong>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-[10px] font-mono text-[#BDB7AE] uppercase">ใบรับรอง</span>
              <strong className="text-xs sm:text-sm text-[#E8D28A]">{petCerts.length} ฉบับ</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Passport Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D9] gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'overview'
              ? 'bg-white text-[#1F1E1D] shadow-xs border border-[#E8E2D9]'
              : 'text-[#8C867E] hover:text-[#1F1E1D]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#E06D53]" />
          <span>บัตรประจำตัว (Identity Card)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('certs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'certs'
              ? 'bg-white text-[#C89933] shadow-xs border border-[#E8D28A]'
              : 'text-[#8C867E] hover:text-[#C89933]'
          }`}
        >
          <Award className="w-4 h-4 text-[#C89933]" />
          <span>Digital Certificates ({petCerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('health')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'health'
              ? 'bg-white text-[#1F1E1D] shadow-xs border border-[#E8E2D9]'
              : 'text-[#8C867E] hover:text-[#1F1E1D]'
          }`}
        >
          <Syringe className="w-4 h-4 text-[#6B8E68]" />
          <span>ประวัติวัคซีน & สุขภาพ ({healthEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('journey')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
            activeSubTab === 'journey'
              ? 'bg-white text-[#1F1E1D] shadow-xs border border-[#E8E2D9]'
              : 'text-[#8C867E] hover:text-[#1F1E1D]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Life Journey ({petEvents.length})</span>
        </button>

        {canEdit && (
          <button
            onClick={() => {
              setEditForm(activePet);
              setActiveSubTab('edit');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              activeSubTab === 'edit'
                ? 'bg-white text-[#1F1E1D] shadow-xs border border-[#E8E2D9]'
                : 'text-[#8C867E] hover:text-[#1F1E1D]'
            }`}
          >
            <Edit2 className="w-4 h-4 text-[#59554F]" />
            <span>แก้ไขข้อมูล</span>
          </button>
        )}
      </div>

      {/* SUB TAB 1: IDENTITY CARD & SPECS */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity Information Sheet */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#1F1E1D] border-b border-[#F0EAE2] pb-3">
              ข้อมูลประจำตัวสัตว์เลี้ยง
            </h3>

            <dl className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <dt className="text-[#8C867E]">ชื่อเต็ม</dt>
                <dd className="font-bold text-sm text-[#1F1E1D] mt-0.5">{activePet.name}</dd>
              </div>

              <div>
                <dt className="text-[#8C867E]">ชนิด / ชนิดสัตว์</dt>
                <dd className="font-bold text-sm text-[#1F1E1D] mt-0.5">{activePet.species}</dd>
              </div>

              <div>
                <dt className="text-[#8C867E]">สายพันธุ์</dt>
                <dd className="font-bold text-sm text-[#1F1E1D] mt-0.5">{activePet.breed || 'ไม่ระบุ'}</dd>
              </div>

              <div>
                <dt className="text-[#8C867E]">เพศ & การทำหมัน</dt>
                <dd className="font-bold text-sm text-[#1F1E1D] mt-0.5">
                  {activePet.gender === 'male' ? 'เพศผู้ (Male)' : activePet.gender === 'female' ? 'เพศเมีย (Female)' : 'ไม่ระบุ'}
                  {activePet.is_spayed ? ' • ทำหมันแล้ว' : ' • ยังไม่ทำหมัน'}
                </dd>
              </div>

              <div>
                <dt className="text-[#8C867E]">วันเกิด</dt>
                <dd className="font-mono font-bold text-[#1F1E1D] mt-0.5">{activePet.birth_date || 'ไม่ระบุ'}</dd>
              </div>

              <div>
                <dt className="text-[#8C867E]">น้ำหนักล่าสุด</dt>
                <dd className="font-mono font-bold text-[#1F1E1D] mt-0.5">{activePet.weight ? `${activePet.weight} กิโลกรัม` : 'ไม่ระบุ'}</dd>
              </div>
            </dl>

            {activePet.notes && (
              <div className="pt-3 border-t border-[#F0EAE2]">
                <span className="text-xs text-[#8C867E] block mb-1">บันทึกนิสัยและความชอบ:</span>
                <p className="text-xs text-[#59554F] bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E2D9]">
                  {activePet.notes}
                </p>
              </div>
            )}
          </div>

          {/* Quick Certificate & Health Highlights */}
          <div className="space-y-4">
            {/* Certificate Highlight Box */}
            <div className="bg-gradient-to-br from-[#FAF6E9] to-white rounded-3xl border border-[#E8D28A] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C89933]" />
                  <h3 className="font-serif font-bold text-base text-[#845E1B]">
                    Meow World Digital Certificates
                  </h3>
                </div>
                {canEdit && (
                  <button
                    onClick={() => onOpenNewCert(activePet.id)}
                    className="text-xs font-bold text-[#C89933] hover:underline"
                  >
                    + ออกใบรับรอง
                  </button>
                )}
              </div>

              {petCerts.length > 0 ? (
                <div className="space-y-2.5">
                  {petCerts.slice(0, 2).map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => onViewCert(cert)}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#E8D28A]/60 hover:border-[#C89933] cursor-pointer transition-colors shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base">{getCertTypeLabel(cert.cert_type).icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1F1E1D] truncate">{cert.title}</div>
                          <div className="text-[10px] font-mono text-[#8C867E]">{cert.certificate_no}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#C89933] shrink-0">ดูเอกสาร →</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-white/60 rounded-2xl border border-dashed border-[#E8D28A]">
                  <p className="text-xs text-[#8C867E]">ยังไม่มี Digital Certificate สำหรับ {activePet.name}</p>
                  {canEdit && (
                    <button
                      onClick={() => onOpenNewCert(activePet.id)}
                      className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C89933] text-white text-xs font-bold shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>สร้าง Digital Certificate แรก</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Record Health Button */}
            <div className="p-4 rounded-3xl bg-[#EBF1E8] border border-[#6B8E68]/30 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-[#2D452B]">มีบันทึกสุขภาพหรือวัคซีนใหม่?</span>
                <p className="text-[#59554F]">เก็บประวัติการรักษาและวัคซีนในสมุดสุขภาพประจำตัว</p>
              </div>
              <button
                onClick={onOpenNewPost}
                className="px-3.5 py-2 rounded-xl bg-[#6B8E68] text-white text-xs font-bold hover:bg-[#567554] shadow-xs shrink-0"
              >
                + บันทึกสุขภาพ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: DIGITAL CERTIFICATES GALLERY */}
      {activeSubTab === 'certs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">
                คลังใบรับรองดิจิทัล ({petCerts.length})
              </h3>
              <p className="text-xs text-[#8C867E]">
                เอกสารจริงที่ผ่านการครอบทับด้วย Meow World Official Digital Certificate และตราประทับ
              </p>
            </div>

            {canEdit && (
              <button
                onClick={() => onOpenNewCert(activePet.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B89320] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ สแกน & ออก Certificate ใหม่</span>
              </button>
            )}
          </div>

          {petCerts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {petCerts.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  cert={cert}
                  pet={activePet}
                  onView={onViewCert}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#E8D28A] p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FCF8EE] text-[#C89933] flex items-center justify-center text-2xl mx-auto border border-[#E8D28A]">
                👑
              </div>
              <h4 className="font-serif font-bold text-base text-[#1F1E1D]">ยังไม่มีใบรับรองดิจิทัล</h4>
              <p className="text-xs text-[#8C867E] max-w-sm mx-auto">
                ถ่ายรูปใบเพ็ดดีกรี ใบวัคซีน หรือเอกสารไมโครชิปจริง เพื่อสร้าง Meow World Digital Certificate
              </p>
              {canEdit && (
                <button
                  onClick={() => onOpenNewCert(activePet.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C89933] text-white text-xs font-bold shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ถ่ายรูปสร้าง Certificate ทันที</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: HEALTH & VACCINES */}
      {activeSubTab === 'health' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0EAE2] pb-3">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">ประวัติวัคซีนและการรักษา</h3>
              <p className="text-xs text-[#8C867E]">บันทึกโดยสัตวแพทย์และผู้ดูแลร่วมในบ้าน</p>
            </div>
            <button
              onClick={onOpenNewPost}
              className="px-3.5 py-1.5 rounded-xl bg-[#6B8E68] text-white text-xs font-bold hover:bg-[#567554]"
            >
              + บันทึกวัคซีน/พบแพทย์
            </button>
          </div>

          <div className="space-y-3">
            {healthEvents.length > 0 ? (
              healthEvents.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#EBF1E8] text-[#6B8E68] flex items-center justify-center font-bold text-lg shrink-0">
                    {evt.event_type === 'vaccine' ? '💉' : '🏥'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-[#1F1E1D]">{evt.title}</h4>
                      <time className="text-xs font-mono text-[#E06D53]">{evt.event_date}</time>
                    </div>
                    <p className="text-xs text-[#59554F] mt-1">{evt.description}</p>
                    <span className="text-[10px] text-[#8C867E] block mt-1">
                      บันทึกโดย: {evt.author_name || currentUser.displayName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-[#8C867E] py-8">
                ยังไม่มีบันทึกการฉีดวัคซีนหรือพบแพทย์สำหรับ {activePet.name}
              </p>
            )}
          </div>
        </div>
      )}

      {/* SUB TAB 4: LIFE JOURNEY MOMENTS */}
      {activeSubTab === 'journey' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">
              ไทม์ไลน์ช่วงเวลาของ {activePet.name} ({petEvents.length})
            </h3>
            <button
              onClick={onOpenNewPost}
              className="px-4 py-2 rounded-xl bg-[#E06D53] text-white text-xs font-bold shadow-xs"
            >
              + บันทึกช่วงเวลา
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {petEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-3xl border border-[#E8E2D9] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#E06D53] font-mono">{event.event_date}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] font-bold text-[#59554F]">
                    {event.event_type}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-base text-[#1F1E1D]">{event.title}</h4>
                {event.description && <p className="text-xs text-[#59554F] line-clamp-3">{event.description}</p>}
                {event.image_url && (
                  <div className="h-40 rounded-2xl overflow-hidden bg-[#FAF7F2]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB TAB 5: EDIT PASSPORT */}
      {activeSubTab === 'edit' && canEdit && (
        <form onSubmit={handleEditSubmit} className="bg-white rounded-3xl border border-[#E8E2D9] p-6 shadow-sm space-y-4 max-w-2xl">
          <h3 className="font-serif font-bold text-lg text-[#1F1E1D] border-b border-[#F0EAE2] pb-3">
            แก้ไขข้อมูลประจำตัวพาสปอร์ต
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">ชื่อสัตว์เลี้ยง:</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">สายพันธุ์:</label>
              <input
                type="text"
                value={editForm.breed || ''}
                onChange={(e) => setEditForm({ ...editForm, breed: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none focus:border-[#E06D53]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">วันเกิด:</label>
              <input
                type="date"
                value={editForm.birth_date || ''}
                onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">น้ำหนัก (กิโลกรัม):</label>
              <input
                type="number"
                step="0.01"
                value={editForm.weight || ''}
                onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">หมายเลขไมโครชิป (Microchip ID):</label>
              <input
                type="text"
                value={editForm.microchip_id || ''}
                onChange={(e) => setEditForm({ ...editForm, microchip_id: e.target.value })}
                className="w-full text-xs font-mono p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1F1E1D] mb-1">สีและลักษณะเด่น:</label>
              <input
                type="text"
                value={editForm.color_marking || ''}
                onChange={(e) => setEditForm({ ...editForm, color_marking: e.target.value })}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EAE2]">
            <button
              type="button"
              onClick={() => setActiveSubTab('overview')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#59554F] hover:bg-[#FAF7F2]"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1F1E1D] text-white text-xs font-bold hover:bg-[#383532]"
            >
              บันทึกการแก้ไข
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
