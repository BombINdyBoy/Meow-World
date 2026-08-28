"use client";

import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, Download, KeyRound, ArrowRight, UserPlus } from 'lucide-react';
// import { Family, UserRole, UserProfile } from '@/types'; // ถ้ามีไฟล์ types ให้เปิด comment
// import { generateQRCodeDataUrl } from '@/utils/certGenerator'; // ถ้ามีฟังก์ชันนี้

// --- Types (จำลองในกรณีที่ยังไม่มีไฟล์ types แยก หรือแก้ไขตามจริง) ---
type UserRole = 'owner' | 'editor' | 'viewer';
interface UserProfile {
  id: string;
  display_name?: string | null;
  avatar_url?: string | null;
}
interface Family {
  id: string;
  name: string;
}

interface QRInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family;
  createdBy: UserProfile;
  currentUserName: string;
  onJoinWithToken?: () => void; // เพิ่ม prop นี้แล้ว
}

export const QRInviteModal: React.FC<QRInviteModalProps> = ({
  isOpen,
  onClose,
  family,
  createdBy,
  currentUserName,
  onJoinWithToken,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [role, setRole] = useState<UserRole>('editor');
  const [expiresInDays, setExpiresInDays] = useState<number>(7);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [inputToken, setInputToken] = useState<string>('');
  const [joinStatus, setJoinStatus] = useState<{ success: boolean; message: string } | null>(null);
  
  // จำลอง Token (ในของจริงต้องเรียก API สร้าง)
  const [inviteToken] = useState<string>(() => `MW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  useEffect(() => {
    if (isOpen && activeTab === 'create') {
      // จำลองการสร้าง QR Code (ในของจริงใช้ generateQRCodeDataUrl)
      // const data = JSON.stringify({ familyId: family.id, token: inviteToken, role });
      // setQrCodeDataUrl(generateQRCodeDataUrl(data)); 
      
      // ใช้ Placeholder ชั่วคราว
      setQrCodeDataUrl(`https://api.qrserver.com/v1/create-qr-code/?