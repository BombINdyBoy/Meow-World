"use client";

import React, { useState, useEffect } from 'react';
import { X, Download, Sparkles } from 'lucide-react';
import { DigitalCertificate, Pet } from '@/types';
import { getCertTypeLabel } from '@/utils/certGenerator';
import { getCertTemplate } from '@/utils/certTemplates';
import { CertificateFlipCard } from './CertificateFlipCard';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cert: DigitalCertificate | null;
  pet?: Pet;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  isOpen,
  onClose,
  cert,
  pet,
}) => {
  if (!isOpen || !cert) return null;

  const typeInfo = getCertTypeLabel(cert.cert_type);
  const template = getCertTemplate(cert.cert_type);

  const handleDownload = () => {
    alert(`ดาวน์โหลดใบรับรอง ${cert.certificate_no} ความละเอียดสูงสำเร็จแล้ว!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ borderColor: template.borderColor, borderWidth: '2px' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{
            background: `linear-gradient(135deg, ${template.gradientFrom}, ${template.gradientTo})`,
            borderColor: `${template.borderColor}60`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shadow-md text-lg"
              style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.accentColor})` }}
            >
              {template.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg" style={{ color: template.accentColor }}>
                  {cert.title}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                  style={{ background: template.secondaryColor, color: template.accentColor, border: `1px solid ${template.borderColor}` }}
                >
                  {cert.certificate_no}
                </span>
              </div>
              <p className="text-xs text-[#8C867E]">
                {pet?.name ? `สัตว์เลี้ยง: ${pet.name}` : ''} • ออกโดย {cert.issuing_authority}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: template.secondaryColor, color: template.accentColor, border: `1px solid ${template.borderColor}` }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลด</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#8C867E] hover:text-[#1F1E1D] hover:bg-[#E8E2D9]/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Flip Card Display Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <CertificateFlipCard cert={cert} pet={pet} />
        </div>

        {/* Footer with Certificate Type Badge */}
        <div
          className="px-6 py-3 border-t flex items-center justify-between"
          style={{ background: `${template.gradientFrom}CC`, borderColor: `${template.borderColor}40` }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: template.primaryColor }} />
            <span className="text-xs font-bold" style={{ color: template.accentColor }}>
              {typeInfo.icon} {typeInfo.label}
            </span>
          </div>
          <span className="text-[10px] font-mono" style={{ color: template.primaryColor }}>
            MEOW WORLD HEART EDITION • {cert.security_hash.slice(0, 16)}...
          </span>
        </div>
      </div>
    </div>
  );
};
