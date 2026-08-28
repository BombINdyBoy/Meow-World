"use client";

import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Download, KeyRound, ArrowRight } from 'lucide-react';
import { Family, UserRole, UserProfile } from '@/types';
import { generateQRCodeDataUrl } from '@/utils/certGenerator';

interface QRInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family;
  createdBy: UserProfile;
  currentUserName: string;
}

export const QRInviteModal: React.FC<QRInviteModalProps> = ({
  isOpen,
  onClose,
  family,
  createdBy,
  currentUserName,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [role, setRole] = useState<UserRole>('editor');
  const [expiresInDays, setExpiresInDays] = useState<number>(7);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>('');
  const [joinStatus, setJoinStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [inviteToken] = useState<string>(() => `MW-FAM-${family.id.slice(-4).toUpperCase()}-9X7A`);

  // Generate QR code asynchronously
  useEffect(() => {
    if (!isOpen) return;

    const payload = JSON.stringify({
      app: 'MeowWorld',
      type: 'family_invite',
      familyId: family.id,
      familyName: family.name,
      role,
      token: inviteToken,
      invitedBy: createdBy,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
    });

    let isMounted = true;
    generateQRCodeDataUrl(payload).then((url) => {
      if (isMounted) setQrCodeDataUrl(url);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, family.id, family.name, role, expiresInDays, createdBy, inviteToken]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputToken.trim()) return;
    // TODO: Implement actual join logic with Supabase
    setJoinStatus({ success: true, message: 'เข้าร่วมบ้านสำเร็จ! กำลังอัปเดตข้อมูล...' });
    setTimeout(() => {
      setJoinStatus(null);
      setInputToken('');
      onClose();
    }, 1500);
  };

  const handleDownloadQR = () => {
    if (!qrCodeDataUrl) return;
    const link = document.createElement('a');
    link.download = `MeowWorld-Invite-${family.name.replace(/\s+/g, '-')}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E2D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E06D53] to-[#C85338] text-white flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1F1E1D]">QR Token สำหรับผู้เลี้ยงร่วม</h3>
              <p className="text-xs text-[#8C867E]">เชิญหรือเข้าร่วมบ้านด้วยระบบ Token ดิจิทัล</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C867E] hover:text-[#1F1E1D] hover:bg-[#E8E2D9]/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8E2D9] bg-[#FAF7F2] p-1.5 mx-6 mt-4 rounded-2xl">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-[#1F1E1D] shadow-xs'
                : 'text-[#8C867E] hover:text-[#1F1E1D]'
            }`}
          >
            สร้าง QR Token เชิญ
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'join'
                ? 'bg-white text-[#1F1E1D] shadow-xs'
                : 'text-[#8C867E] hover:text-[#1F1E1D]'
            }`}
          >
            เข้าร่วมบ้านด้วย Token
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'create' ? (
            <>
              {/* Configuration Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#59554F] mb-1">สิทธิ์ที่มอบให้:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs font-semibold rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-2.5 outline-none focus:border-[#E06D53]"
                  >
                    <option value="editor">ผู้ดูแลร่วม (บันทึก & ดูแลสัตว์เลี้ยงได้)</option>
                    <option value="viewer">ผู้เข้าชม (ดูข้อมูลได้อย่างเดียว)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#59554F] mb-1">อายุของ Token:</label>
                  <select
                    value={expiresInDays}
                    onChange={(e) => setExpiresInDays(Number(e.target.value))}
                    className="w-full text-xs font-semibold rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-2.5 outline-none focus:border-[#E06D53]"
                  >
                    <option value={1}>หมดอายุใน 24 ชั่วโมง</option>
                    <option value={7}>หมดอายุใน 7 วัน</option>
                    <option value={30}>หมดอายุใน 30 วัน</option>
                  </select>
                </div>
              </div>

              {/* QR Code Presentation Box */}
              <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF7F2] border border-[#E8E2D9] shadow-inner space-y-3">
                <div className="relative p-3 bg-white rounded-2xl shadow-md border border-[#E8E2D9]">
                  {qrCodeDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrCodeDataUrl} alt="Invite QR Code" className="w-44 h-44 rounded-lg select-none" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-[#8C867E]">
                      กำลังสร้าง QR Code...
                    </div>
                  )}
                  {/* Meow World Emblem in center */}
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full border border-[#E8E2D9] flex items-center justify-center text-base shadow-sm pointer-events-none">
                    🐾
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-[#8C867E]">ให้ผู้ร่วมดูแลสแกน QR Code นี้ผ่านกล้องมือถือ</span>
                  <div className="mt-1 font-mono font-bold text-xs text-[#1F1E1D] bg-[#E8E2D9]/50 px-3 py-1 rounded-full inline-block">
                    {inviteToken}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFEA] border border-[#E8E2D9] text-xs font-bold text-[#1F1E1D] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-[#8C867E]" />}
                  <span>{copied ? 'คัดลอกรหัส Token แล้ว!' : 'คัดลอกรหัส Token'}</span>
                </button>

                <button
                  onClick={handleDownloadQR}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1F1E1D] text-white hover:bg-[#383532] text-xs font-bold transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>บันทึก QR</span>
                </button>
              </div>
            </>
          ) : (
            /* Join House Tab */
            <form onSubmit={handleJoinSubmit} className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-[#EBF1E8] border border-[#6B8E68]/30 flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-[#6B8E68] shrink-0 mt-0.5" />
                <p className="text-xs text-[#2D452B]">
                  หากคุณได้รับ QR Token หรือรหัสเชิญจากเจ้าของบ้านอื่น สามารถกรอกรหัสเพื่อเข้าเป็นผู้ดูแลร่วมในบ้านนั้นได้ทันที
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1F1E1D] mb-1.5">
                  รหัส QR Token:
                </label>
                <input
                  type="text"
                  placeholder="เช่น MW-FAM-VILLA-A892"
                  value={inputToken}
                  onChange={(e) => setInputToken(e.target.value)}
                  required
                  className="w-full text-sm font-mono uppercase px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9] outline-none focus:border-[#E06D53]"
                />
              </div>

              {joinStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    joinStatus.success
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {joinStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#E06D53] hover:bg-[#CC573C] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#E06D53]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <span>ยืนยันเข้าร่วมบ้าน</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
