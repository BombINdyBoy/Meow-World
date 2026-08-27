"use client";

import React, { useState, useEffect } from 'react';
import { X, Sparkles, FileText, Download, ShieldCheck } from 'lucide-react';
import { DigitalCertificate, Pet } from '@/types';
import { generateQRCodeDataUrl, getCertTypeLabel } from '@/utils/certGenerator';

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
  const [viewMode, setViewMode] = useState<'overlay' | 'original'>('overlay');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (cert) {
      generateQRCodeDataUrl(cert.verification_qr_payload).then(setQrCodeUrl);
    }
  }, [cert]);

  if (!isOpen || !cert) return null;

  const typeInfo = getCertTypeLabel(cert.cert_type);

  const handleDownload = () => {
    alert(`ดาวน์โหลดใบรับรอง ${cert.certificate_no} ความละเอียดสูงสำเร็จแล้ว!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8D28A] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8D28A] flex items-center justify-between bg-[#FCF8EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B89320] text-white flex items-center justify-center shadow-md">
              <span className="text-lg">👑</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#845E1B]">
                  {cert.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white text-[#C89933] border border-[#E8D28A]">
                  {cert.certificate_no}
                </span>
              </div>
              <p className="text-xs text-[#8C867E]">
                {pet?.name ? `สัตว์เลี้ยง: ${pet.name}` : ''} • ออกโดย {cert.issuing_authority}
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

        {/* View Toggle Bar */}
        <div className="px-6 py-3 bg-[#FAF7F2] border-b border-[#E8E2D9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('overlay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'overlay'
                  ? 'bg-[#C89933] text-white shadow-xs'
                  : 'bg-white text-[#59554F] border border-[#E8E2D9]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meow World Certificate Overlay</span>
            </button>

            <button
              onClick={() => setViewMode('original')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'original'
                  ? 'bg-[#1F1E1D] text-white shadow-xs'
                  : 'bg-white text-[#59554F] border border-[#E8E2D9]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ภาพเอกสารจริงต้นฉบับ</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#C89933] text-[#C89933] hover:bg-[#FCF8EE] text-xs font-bold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด PNG</span>
          </button>
        </div>

        {/* Certificate Display Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="relative rounded-3xl p-5 sm:p-7 cert-gold-frame overflow-hidden shadow-xl">
            {viewMode === 'overlay' ? (
              <>
                {/* Watermark */}
                <div className="absolute inset-0 watermark-pattern opacity-60 pointer-events-none"></div>

                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                <div className="absolute top-2 right-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                <div className="absolute bottom-2 left-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>
                <div className="absolute bottom-2 right-2 text-[#C89933] text-lg font-serif select-none pointer-events-none">⚜</div>

                {/* Title */}
                <div className="relative z-10 text-center pb-4 border-b border-[#E8D28A]/80">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#845E1B] tracking-tight">
                    MEOW WORLD DIGITAL CERTIFICATE
                  </h2>
                  <p className="text-[11px] font-mono text-[#A4781E] uppercase tracking-widest mt-0.5">
                    Official Certified Record
                  </p>
                </div>

                {/* Body Details */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-5">
                  {/* Real Scanned Document Layer */}
                  <div className="md:col-span-6 relative rounded-2xl overflow-hidden border-2 border-[#E8D28A] shadow-md bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.original_doc_url}
                      alt="Physical Scanned Document"
                      className="w-full h-56 sm:h-64 object-cover filter contrast-[1.05]"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold border border-[#E8D28A] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                      <span>VERIFIED DOC</span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white flex items-center justify-between text-[11px]">
                      <span className="font-mono">ORIGINAL SCAN PHOTO</span>
                      <span className="text-[#E8D28A] font-bold">AUTHENTICATED</span>
                    </div>
                  </div>

                  {/* Metadata Sheet */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-[#E8D28A] shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-[#A4781E] font-bold">
                          TYPE
                        </span>
                        <span className="text-xs font-bold text-[#845E1B]">
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                        <span className="text-[10px] text-[#8C867E]">ชื่อสัตว์เลี้ยง:</span>
                        <strong className="text-xs text-[#1F1E1D]">{pet?.name || 'น้องแมว'}</strong>
                      </div>

                      {pet?.breed && (
                        <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                          <span className="text-[10px] text-[#8C867E]">สายพันธุ์:</span>
                          <span className="text-xs text-[#59554F] font-medium">{pet.breed}</span>
                        </div>
                      )}

                      {pet?.microchip_id && (
                        <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                          <span className="text-[10px] text-[#8C867E]">ไมโครชิป:</span>
                          <span className="text-xs font-mono font-bold text-[#1F1E1D]">{pet.microchip_id}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-[#F0EAE2] pt-1.5">
                        <span className="text-[10px] text-[#8C867E]">หน่วยงานผู้ออก:</span>
                        <span className="text-xs text-[#59554F] truncate max-w-[160px]">
                          {cert.issuing_authority}
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="p-3 rounded-2xl bg-white/90 border border-[#E8D28A] flex items-center gap-3">
                      {qrCodeUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={qrCodeUrl}
                          alt="QR Verification"
                          className="w-16 h-16 rounded-lg border border-[#E8D28A] shrink-0"
                        />
                      )}
                      <div className="min-w-0 text-[11px]">
                        <div className="flex items-center gap-1 text-[#845E1B] font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#C89933]" />
                          <span>Official QR Proof</span>
                        </div>
                        <p className="font-mono text-[10px] text-[#8C867E] truncate mt-0.5">
                          {cert.certificate_no}
                        </p>
                        <p className="font-mono text-[9px] text-[#BDB7AE] truncate">
                          {cert.security_hash}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 pt-3 border-t border-[#E8D28A]/80 flex flex-wrap items-center justify-between text-[10px] text-[#845E1B] font-mono">
                  <span>ISSUED: {cert.issue_date}</span>
                  <span>AUTHORITY: {cert.issuing_authority}</span>
                  <span>SECURED BY MEOW WORLD HEART EDITION</span>
                </div>
              </>
            ) : (
              /* Original Document Photo */
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8D28A]">
                  <span className="font-serif font-bold text-sm text-[#845E1B]">
                    ภาพเอกสารจริงต้นฉบับ (Original Physical Document)
                  </span>
                  <span className="text-xs font-mono text-[#8C867E]">
                    {cert.issue_date}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-[#E8D28A] max-h-[480px] bg-black/5 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cert.original_doc_url} alt="Original Document" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#E8E2D9] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1F1E1D] text-white text-xs font-bold hover:bg-[#383532] transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
