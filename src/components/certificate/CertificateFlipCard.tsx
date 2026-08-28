"use client";

import React, { useState, useEffect } from 'react';
import { RotateCw, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { DigitalCertificate, Pet } from '@/types';
import { generateQRCodeDataUrl, getCertTypeLabel } from '@/utils/certGenerator';
import { getCertTemplate, getCertFrameStyle } from '@/utils/certTemplates';

interface CertificateFlipCardProps {
  cert: DigitalCertificate;
  pet?: Pet;
  qrCodeUrl?: string;
}

export const CertificateFlipCard: React.FC<CertificateFlipCardProps> = ({
  cert,
  pet,
  qrCodeUrl: externalQrUrl,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(externalQrUrl || '');
  const [rotation, setRotation] = useState(0);

  const template = getCertTemplate(cert.cert_type);
  const typeInfo = getCertTypeLabel(cert.cert_type);

  useEffect(() => {
    if (!externalQrUrl && cert) {
      generateQRCodeDataUrl(cert.verification_qr_payload).then(setQrCodeUrl);
    }
  }, [cert, externalQrUrl]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Flip Instruction */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2 text-xs text-[#59554F]">
          <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] flex items-center justify-center text-[10px]">
            👆
          </span>
          <span>แตะเพื่อพลิกดูเอกสารจริงด้านหลัง</span>
        </div>
        <button
          onClick={handleRotate}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E8E2D9] text-xs text-[#59554F] hover:bg-[#F3EFEA]"
        >
          <RotateCw className="w-3 h-3" />
          <span>หมุน</span>
        </button>
      </div>

      {/* Flip Card Container */}
      <div
        className="relative w-full aspect-[4/3] cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${isFlipped ? 180 : 0}deg) rotate(${rotation}deg)`,
          }}
        >
          {/* FRONT: Digital Certificate Overlay */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <div
              className="w-full h-full p-5 sm:p-7 cert-gold-frame overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${template.gradientFrom} 0%, #FFFFFF 50%, ${template.gradientTo} 100%)`,
                borderColor: template.borderColor,
              }}
            >
              {/* Watermark Pattern */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: template.bgPattern,
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Rotating Watermark Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] overflow-hidden">
                <div
                  className="text-[60px] sm:text-[80px] font-serif font-black whitespace-nowrap uppercase tracking-[0.3em]"
                  style={{
                    color: template.primaryColor,
                    transform: `rotate(${template.watermarkRotation})`,
                  }}
                >
                  {template.watermarkText}
                </div>
              </div>

              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 text-lg select-none pointer-events-none" style={{ color: template.primaryColor }}>
                {template.cornerOrnament}
              </div>
              <div className="absolute top-3 right-3 text-lg select-none pointer-events-none" style={{ color: template.primaryColor }}>
                {template.cornerOrnament}
              </div>
              <div className="absolute bottom-3 left-3 text-lg select-none pointer-events-none" style={{ color: template.primaryColor }}>
                {template.cornerOrnament}
              </div>
              <div className="absolute bottom-3 right-3 text-lg select-none pointer-events-none" style={{ color: template.primaryColor }}>
                {template.cornerOrnament}
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="text-center pb-3 border-b-2" style={{ borderColor: `${template.primaryColor}80` }}>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-2xl">{template.icon}</span>
                    <h2
                      className="font-serif font-bold text-lg sm:text-xl tracking-tight"
                      style={{ color: template.accentColor, fontSize: template.headerSize }}
                    >
                      MEOW WORLD DIGITAL CERTIFICATE
                    </h2>
                    <span className="text-2xl">{template.icon}</span>
                  </div>
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest"
                    style={{ color: template.primaryColor }}
                  >
                    {template.sealLabel} • {cert.certificate_no}
                  </p>
                </div>

                {/* Body */}
                <div className="flex-1 grid grid-cols-12 gap-3 items-center py-3">
                  {/* Scanned Document */}
                  <div className="col-span-5 relative rounded-xl overflow-hidden border-2 shadow-md bg-black/5" style={{ borderColor: template.borderColor }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.original_doc_url}
                      alt="Physical Document"
                      className="w-full h-32 sm:h-40 object-cover"
                    />

                    {/* Hologram Seal */}
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-white text-[9px] font-bold flex items-center gap-1 shadow-md"
                      style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.accentColor})` }}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>VERIFIED</span>
                    </div>

                    {/* Diagonal Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <div
                        className="rotate-[-25deg] border-2 px-4 py-1 rounded-lg font-serif font-black text-sm tracking-widest uppercase"
                        style={{ borderColor: template.primaryColor, color: template.primaryColor }}
                      >
                        OFFICIAL
                      </div>
                    </div>

                    {/* Bottom Label */}
                    <div
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-white flex items-center justify-between text-[9px]"
                    >
                      <span className="font-mono">ORIGINAL SCAN</span>
                      <span className="font-bold" style={{ color: template.secondaryColor }}>100% AUTHENTIC</span>
                    </div>
                  </div>

                  {/* Right Panel: Details */}
                  <div className="col-span-7 space-y-2">
                    {/* Certificate Info */}
                    <div
                      className="p-2.5 rounded-xl border shadow-xs space-y-1.5"
                      style={{
                        background: `${template.gradientFrom}CC`,
                        borderColor: `${template.borderColor}60`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono uppercase font-bold" style={{ color: template.primaryColor }}>
                          TYPE
                        </span>
                        <span className="text-[11px] font-bold" style={{ color: template.accentColor }}>
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                        <span className="text-[9px] text-[#8C867E]">ชื่อสัตว์เลี้ยง:</span>
                        <strong className="text-[11px] text-[#1F1E1D]">{pet?.name || 'น้องแมว'}</strong>
                      </div>

                      {pet?.breed && (
                        <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                          <span className="text-[9px] text-[#8C867E]">สายพันธุ์:</span>
                          <span className="text-[11px] text-[#59554F] font-medium">{pet.breed}</span>
                        </div>
                      )}

                      {pet?.microchip_id && (
                        <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                          <span className="text-[9px] text-[#8C867E]">ไมโครชิป:</span>
                          <span className="text-[10px] font-mono font-bold text-[#1F1E1D]">{pet.microchip_id}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                        <span className="text-[9px] text-[#8C867E]">ออกโดย:</span>
                        <span className="text-[10px] text-[#59554F] truncate max-w-[120px]">
                          {cert.issuing_authority}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                        <span className="text-[9px] text-[#8C867E]">วันที่ออก:</span>
                        <span className="text-[10px] font-mono" style={{ color: template.accentColor }}>{cert.issue_date}</span>
                      </div>

                      {cert.expiry_date && (
                        <div className="flex items-center justify-between border-t pt-1" style={{ borderColor: `${template.borderColor}30` }}>
                          <span className="text-[9px] text-[#8C867E]">หมดอายุ:</span>
                          <span className="text-[10px] font-mono text-red-500">{cert.expiry_date}</span>
                        </div>
                      )}
                    </div>

                    {/* QR Code */}
                    {qrCodeUrl && (
                      <div
                        className="p-2 rounded-xl border flex items-center gap-2"
                        style={{
                          background: `${template.gradientFrom}EE`,
                          borderColor: `${template.borderColor}50`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={qrCodeUrl}
                          alt="QR Verification"
                          className="w-12 h-12 rounded-lg shrink-0 border"
                          style={{ borderColor: `${template.borderColor}40` }}
                        />
                        <div className="min-w-0 text-[10px]">
                          <div className="flex items-center gap-1 font-bold" style={{ color: template.accentColor }}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>QR Verified</span>
                          </div>
                          <p className="font-mono text-[9px] text-[#8C867E] truncate">{cert.certificate_no}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="pt-2 border-t flex flex-wrap items-center justify-between text-[9px] font-mono"
                  style={{ borderColor: `${template.borderColor}60`, color: template.accentColor }}
                >
                  <span>ISSUED: {cert.issue_date}</span>
                  <span>{template.sealLabel}</span>
                  <span>MEOW WORLD HEART EDITION</span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK: Original Physical Document */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div
              className="w-full h-full p-5 overflow-hidden flex flex-col"
              style={{
                background: `linear-gradient(135deg, ${template.gradientFrom} 0%, #FFFFFF 100%)`,
                border: `4px double ${template.borderColor}`,
                boxShadow: `0 20px 40px -10px rgba(0,0,0,0.2)`,
              }}
            >
              {/* Back Header */}
              <div className="flex items-center justify-between pb-3 border-b-2" style={{ borderColor: `${template.primaryColor}60` }}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: template.primaryColor }} />
                  <span className="font-serif font-bold text-sm" style={{ color: template.accentColor }}>
                    เอกสารจริงต้นฉบับ
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: template.secondaryColor, color: template.accentColor }}>
                  Original Document
                </span>
              </div>

              {/* Document Image */}
              <div className="flex-1 flex items-center justify-center py-3">
                <div className="relative rounded-2xl overflow-hidden border-2 max-h-full" style={{ borderColor: template.borderColor }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.original_doc_url}
                    alt="Original Physical Document"
                    className="w-full max-h-[300px] object-contain"
                  />

                  {/* Verified Badge */}
                  <div
                    className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-white text-[10px] font-bold flex items-center gap-1 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.accentColor})` }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED BY MEOW WORLD</span>
                  </div>
                </div>
              </div>

              {/* Back Footer */}
              <div
                className="pt-2 border-t text-center text-[9px]"
                style={{ borderColor: `${template.primaryColor}40`, color: template.primaryColor }}
              >
                <p className="font-mono">
                  📋 {cert.certificate_no} • Security: {cert.security_hash.slice(0, 20)}...
                </p>
                <p className="mt-1 opacity-60">
                  เอกสารนี้ได้รับการยืนยันความถูกต้องโดย Meow World Digital Certificate System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flip Status Indicator */}
      <div className="flex items-center justify-center mt-3 gap-2">
        <div
          className="px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all duration-300"
          style={{
            background: isFlipped ? `${template.secondaryColor}` : '#FAF7F2',
            color: isFlipped ? template.accentColor : '#59554F',
            border: `1px solid ${isFlipped ? template.borderColor : '#E8E2D9'}`,
          }}
        >
          {isFlipped ? (
            <>
              <FileText className="w-3 h-3" />
              <span>เอกสารจริงต้นฉบับ</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3 h-3" />
              <span>Meow World Digital Certificate</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
