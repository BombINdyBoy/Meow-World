"use client";

import React from 'react';
import { ShieldCheck, Eye } from 'lucide-react';
import { DigitalCertificate, Pet } from '@/types';
import { getCertTypeLabel } from '@/utils/certGenerator';

interface CertificateCardProps {
  cert: DigitalCertificate;
  pet?: Pet;
  onView: (cert: DigitalCertificate) => void;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({ cert, pet, onView }) => {
  const typeInfo = getCertTypeLabel(cert.cert_type);

  return (
    <div
      onClick={() => onView(cert)}
      className="group relative rounded-3xl overflow-hidden bg-white border border-[#E8D28A]/70 hover:border-[#C89933] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner / Type Badge */}
      <div className="p-4 bg-gradient-to-r from-[#FAF6E9] to-[#FFFDF9] border-b border-[#E8D28A]/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{typeInfo.icon}</span>
          <span className="text-xs font-bold text-[#845E1B]">{typeInfo.label}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-[#C89933] border border-[#E8D28A]">
          VERIFIED
        </span>
      </div>

      {/* Embedded Document Preview & Meow World Stamp */}
      <div className="relative h-44 bg-[#FAF7F2] overflow-hidden">
        {/* Scanned Document Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.original_doc_url}
          alt={cert.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Certified Overlay Stamp */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold border border-[#E8D28A] flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
          <span>Digital Seal</span>
        </div>

        {/* Pet Name & Cert No */}
        <div className="absolute bottom-2.5 inset-x-3 text-white">
          <div className="text-xs font-bold truncate">{cert.title}</div>
          <div className="flex items-center justify-between text-[10px] text-[#E8D28A] font-mono mt-0.5">
            <span>{pet?.name || 'น้องแมว'}</span>
            <span>{cert.certificate_no}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 bg-white flex items-center justify-between text-[11px] text-[#59554F]">
        <div className="flex items-center gap-1 truncate max-w-[170px]">
          <span className="text-[#8C867E]">ออกโดย:</span>
          <span className="font-medium truncate">{cert.issuing_authority}</span>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-[#C89933] group-hover:underline">
          <Eye className="w-3.5 h-3.5" />
          <span>ดูใบรับรอง</span>
        </button>
      </div>
    </div>
  );
};
