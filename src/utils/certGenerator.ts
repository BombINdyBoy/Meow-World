import QRCode from 'qrcode';
import { CertificateType } from '@/types';

export function calculateAge(birthDateStr: string | null): string {
  if (!birthDateStr) return 'ไม่ระบุวันเกิด';
  const birth = new Date(birthDateStr);
  const now = new Date();
  if (isNaN(birth.getTime())) return 'ไม่ระบุวันเกิด';

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  if (now.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  if (years > 0 && months > 0) return `${years} ขวบ ${months} เดือน`;
  if (years > 0) return `${years} ขวบ`;
  if (months > 0) return `${months} เดือน`;
  
  const diffDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  return `${Math.max(1, diffDays)} วัน`;
}

export function generateCertNumber(type: CertificateType): string {
  const prefixMap: Record<CertificateType, string> = {
    pedigree: 'PED',
    vaccine: 'VAC',
    microchip: 'MCP',
    adoption: 'ADP',
    health: 'HLT',
    general: 'CRT',
  };
  const prefix = prefixMap[type] || 'CRT';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `MW-${prefix}-${year}-${randomNum}`;
}

export function generateSecurityHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SHA256:${hash}`;
}

export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 256,
      color: {
        dark: '#2A241F',
        light: '#FFFFFF',
      },
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function getCertTypeLabel(type: CertificateType): { label: string; enLabel: string; color: string; icon: string } {
  switch (type) {
    case 'pedigree':
      return { label: 'ใบรับรองสายพันธุ์ & เพ็ดดีกรี', enLabel: 'Official Certified Pedigree', color: '#D4AF37', icon: '👑' };
    case 'vaccine':
      return { label: 'ใบรับรองการฉีดวัคซีน & สุขภาพ', enLabel: 'Vaccination & Health Record', color: '#3B82F6', icon: '💉' };
    case 'microchip':
      return { label: 'ใบลงทะเบียนหมายเลขไมโครชิป', enLabel: 'ISO Microchip Identity Cert', color: '#10B981', icon: '📡' };
    case 'adoption':
      return { label: 'ใบรับรองการรับอุปการะเลี้ยงดู', enLabel: 'Official Adoption Certificate', color: '#EC4899', icon: '🏠' };
    case 'health':
      return { label: 'ใบตรวจสุขภาพประจำปี', enLabel: 'Veterinary Health Examination', color: '#8B5CF6', icon: '🩺' };
    default:
      return { label: 'ใบรับรอง Meow World Official', enLabel: 'Meow World Official Registry', color: '#E06D53', icon: '📜' };
  }
}
