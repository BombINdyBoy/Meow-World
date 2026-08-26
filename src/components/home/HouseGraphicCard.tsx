"use client";

import React from 'react';
import { Users, QrCode, Plus, ChevronRight, Home as HomeIcon } from 'lucide-react';
import { Family, FamilyMember, Pet } from '@/types';
import { calculateAge } from '@/utils/certGenerator';

interface HouseGraphicCardProps {
  family: Family;
  members: FamilyMember[];
  pets: Pet[];
  onOpenMembersModal: () => void;
  onOpenQRInviteModal: () => void;
  onSelectPet: (petId: string) => void;
  onAddNewPet: () => void;
}

export const HouseGraphicCard: React.FC<HouseGraphicCardProps> = ({
  family,
  members,
  pets,
  onOpenMembersModal,
  onOpenQRInviteModal,
  onSelectPet,
  onAddNewPet,
}) => {
  const ownerMember = members.find((m) => m.role === 'owner') || members[0];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#E7EFE4] via-[#F1F6EE] to-[#FAF7F2] border border-[#D8E4D3] shadow-lg shadow-[#6B8E68]/10 mb-8 p-6 sm:p-8 transition-all">
      {/* Decorative Warm Ambient Glow & Clouds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-[#FCECD8]/80 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-radial from-[#E2EFE0]/70 to-transparent rounded-full blur-xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: House Illustration & Graphic Interface */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/3] flex items-center justify-center">
            {/* House Graphic SVG */}
            <svg
              viewBox="0 0 400 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-xl select-none"
            >
              {/* Ground & Grass */}
              <ellipse cx="200" cy="290" rx="180" ry="25" fill="#C9DECA" />
              <ellipse cx="200" cy="285" rx="160" ry="18" fill="#DCECDD" />

              {/* Chimney & Smoke */}
              <rect x="270" y="70" width="36" height="70" rx="4" fill="#C87A65" />
              <rect x="266" y="66" width="44" height="10" rx="3" fill="#A85844" />
              {/* Smoke bubbles */}
              <circle cx="288" cy="50" r="9" fill="#FFFFFF" opacity="0.6" className="animate-float" />
              <circle cx="296" cy="32" r="13" fill="#FFFFFF" opacity="0.4" style={{ animationDelay: '1s' }} className="animate-float" />
              <circle cx="310" cy="14" r="16" fill="#FFFFFF" opacity="0.25" style={{ animationDelay: '2s' }} className="animate-float" />

              {/* House Main Body */}
              <rect x="90" y="130" width="220" height="145" rx="12" fill="#FFFFFF" stroke="#E3DCD1" strokeWidth="3" />

              {/* Roof (Terracotta Gable) */}
              <path
                d="M60 135 L200 45 L340 135 C345 138 340 145 330 145 L70 145 C60 145 55 138 60 135 Z"
                fill="#E06D53"
                stroke="#C85338"
                strokeWidth="3"
              />
              {/* Roof Accent Lines */}
              <path d="M200 45 L200 145" stroke="#C85338" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="200" cy="95" r="16" fill="#FAF5ED" stroke="#E06D53" strokeWidth="3" />
              <text x="200" y="100" textAnchor="middle" fontSize="14" fill="#E06D53">🐾</text>

              {/* Wooden Balcony & Texture */}
              <rect x="105" y="145" width="190" height="8" fill="#F4EFE6" />

              {/* Warm Glowing Windows */}
              <g className="animate-glow">
                {/* Left Window */}
                <rect x="115" y="165" width="46" height="50" rx="8" fill="#FFEAB6" stroke="#E8D28A" strokeWidth="2.5" />
                <line x1="138" y1="165" x2="138" y2="215" stroke="#E8D28A" strokeWidth="2" />
                <line x1="115" y1="190" x2="161" y2="190" stroke="#E8D28A" strokeWidth="2" />
                {/* Cat silhouette in window */}
                <path d="M125 210 C125 198 135 198 135 210 Z" fill="#6B513C" />
                <polygon points="127,200 130,194 133,200" fill="#6B513C" />
              </g>

              <g className="animate-glow" style={{ animationDelay: '1.2s' }}>
                {/* Right Window */}
                <rect x="239" y="165" width="46" height="50" rx="8" fill="#FFEAB6" stroke="#E8D28A" strokeWidth="2.5" />
                <line x1="262" y1="165" x2="262" y2="215" stroke="#E8D28A" strokeWidth="2" />
                <line x1="239" y1="190" x2="285" y2="190" stroke="#E8D28A" strokeWidth="2" />
              </g>

              {/* House Main Door */}
              <rect x="175" y="180" width="50" height="95" rx="8" fill="#6B8E68" stroke="#4F6D4C" strokeWidth="3" />
              <rect x="182" y="190" width="36" height="35" rx="4" fill="#88A985" />
              <circle cx="215" cy="232" r="3.5" fill="#FCECD8" />
              {/* Door welcome mat */}
              <rect x="168" y="272" width="64" height="6" rx="3" fill="#D9A86C" />

              {/* Decorative Flowers / Pots */}
              <circle cx="85" cy="265" r="14" fill="#8EA885" />
              <circle cx="95" cy="255" r="12" fill="#7A9A76" />
              <circle cx="315" cy="265" r="14" fill="#8EA885" />
              <circle cx="305" cy="255" r="12" fill="#7A9A76" />
              {/* Blossoms */}
              <circle cx="88" cy="258" r="4" fill="#E06D53" />
              <circle cx="312" cy="258" r="4" fill="#E06D53" />
            </svg>

            {/* Cozy Floating Badge */}
            <div className="absolute -bottom-2 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#D8E4D3] shadow-sm flex items-center gap-1.5 text-[11px] font-semibold text-[#2D452B]">
              <span className="w-2 h-2 rounded-full bg-[#6B8E68] animate-ping"></span>
              <span>สถานะบ้าน: อบอุ่น & ปลอดภัย</span>
            </div>
          </div>
        </div>

        {/* Right Side: Family House Controls & Sub-menu */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {/* Header Info */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#6B8E68] text-white text-[11px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-xs">
                  <HomeIcon className="w-3 h-3" />
                  House Mode
                </span>
                <span className="text-xs text-[#59554F] font-medium">
                  เจ้าของ: <strong className="text-[#1F1E1D]">{ownerMember?.display_name || 'คุณ'}</strong>
                </span>
              </div>

              {/* Sub-menu Actions for House */}
              <div className="flex items-center gap-2">
                {/* View Co-owners Button */}
                <button
                  onClick={onOpenMembersModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F3EFEA] border border-[#D8E4D3] text-[#1F1E1D] text-xs font-bold shadow-xs hover:shadow-sm transition-all active:scale-95"
                  title="ดูรายชื่อและจัดการสิทธิ์ผู้เลี้ยงร่วมในบ้าน"
                >
                  <Users className="w-3.5 h-3.5 text-[#6B8E68]" />
                  <span>ผู้เลี้ยงร่วม ({members.length})</span>
                </button>

                {/* QR Invite Token Button */}
                <button
                  onClick={onOpenQRInviteModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#E06D53] to-[#C85338] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#E06D53]/20 transition-all active:scale-95"
                  title="สร้าง QR Token สำหรับเชิญผู้อื่นมาเป็นผู้เลี้ยงร่วมในบ้าน"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>สร้าง QR เชิญ</span>
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1E1D] tracking-tight mb-1">
              {family.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#59554F] max-w-xl">
              พื้นที่บันทึกความทรงจำและดูแลสัตว์เลี้ยงร่วมกันในครอบครัว ข้อมูลเป็นส่วนตัว ปลอดภัย และเข้าถึงได้เฉพาะผู้เลี้ยงร่วมที่ได้รับอนุญาต
            </p>
          </div>

          {/* Household Pets Section (`สัตว์เลี้ยงทั้งหมดในบ้าน`) */}
          <div className="mt-6 pt-5 border-t border-[#D8E4D3]/70">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-sm sm:text-base text-[#1F1E1D]">
                  สัตว์เลี้ยงในบ้าน ({pets.length})
                </span>
                <span className="text-[11px] text-[#8C867E]">
                  คลิกเพื่อดู Passport ประจำตัว
                </span>
              </div>

              <button
                onClick={onAddNewPet}
                className="flex items-center gap-1 text-xs font-bold text-[#E06D53] hover:text-[#C85338] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>เพิ่มน้องแมว</span>
              </button>
            </div>

            {/* Pet Horizontal Grid / Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => onSelectPet(pet.id)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 hover:bg-white border border-[#D8E4D3] hover:border-[#E06D53] hover:shadow-md transition-all text-left group active:scale-[0.98]"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-[#F3EFEA]">
                    {pet.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#E06D53]">
                        {pet.name.slice(0, 1)}
                      </div>
                    )}
                    {pet.gender === 'male' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-500 rounded-full text-[8px] text-white flex items-center justify-center">♂</span>
                    )}
                    {pet.gender === 'female' && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-pink-500 rounded-full text-[8px] text-white flex items-center justify-center">♀</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-[#1F1E1D] truncate group-hover:text-[#E06D53] transition-colors">
                        {pet.name}
                      </h4>
                      <ChevronRight className="w-3.5 h-3.5 text-[#BDB7AE] group-hover:text-[#E06D53] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#8C867E] truncate">
                      {pet.breed || pet.species}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F3EFEA] text-[#59554F]">
                        {calculateAge(pet.birth_date)}
                      </span>
                      {pet.weight && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F3EFEA] text-[#59554F]">
                          {pet.weight} kg
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}

              {pets.length === 0 && (
                <div className="col-span-3 text-center py-6 bg-white/60 rounded-2xl border border-dashed border-[#D8E4D3]">
                  <p className="text-xs text-[#8C867E]">ยังไม่มีสัตว์เลี้ยงในบ้านนี้</p>
                  <button
                    onClick={onAddNewPet}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E06D53] text-white text-xs font-bold shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>สร้าง Passport ตัวแรก</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
