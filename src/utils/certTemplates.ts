import { CertificateType } from '@/types';

export interface CertTemplate {
  // Visual identity
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  bgPattern: string;

  // Typography
  headerFont: string;
  headerSize: string;

  // Decorative elements
  icon: string;
  cornerOrnament: string;
  sealLabel: string;
  watermarkText: string;
  watermarkRotation: string;

  // Layout style
  frameStyle: 'double-border' | 'ornate' | 'minimal' | 'holographic' | 'embossed' | 'classic';

  // Authority info
  defaultAuthority: string;
  registryCode: string;

  // Certificate-specific decorations
  decorations: string[];
}

const templates: Record<CertificateType, CertTemplate> = {
  pedigree: {
    primaryColor: '#D4AF37',
    secondaryColor: '#F5E6B8',
    accentColor: '#8B6914',
    gradientFrom: '#FFF9E6',
    gradientTo: '#FDF2CC',
    borderColor: '#D4AF37',
    bgPattern: 'radial-gradient(rgba(212, 175, 55, 0.06) 1px, transparent 1px)',
    headerFont: 'Playfair Display',
    headerSize: '28px',
    icon: '👑',
    cornerOrnament: '⚜',
    sealLabel: 'WCF REGISTERED',
    watermarkText: 'PEDIGREE CERTIFIED',
    watermarkRotation: '-30deg',
    frameStyle: 'ornate',
    defaultAuthority: 'World Cat Federation (WCF) & Meow World Official',
    registryCode: 'PED',
    decorations: ['crown', 'laurel', 'gold-seal'],
  },

  vaccine: {
    primaryColor: '#2563EB',
    secondaryColor: '#DBEAFE',
    accentColor: '#1E40AF',
    gradientFrom: '#F0F7FF',
    gradientTo: '#E0EFFF',
    borderColor: '#3B82F6',
    bgPattern: 'linear-gradient(135deg, rgba(59, 130, 246, 0.04) 25%, transparent 25%)',
    headerFont: 'Playfair Display',
    headerSize: '26px',
    icon: '💉',
    cornerOrnament: '✚',
    sealLabel: 'VACCINATION VERIFIED',
    watermarkText: 'HEALTH PROTECTED',
    watermarkRotation: '-25deg',
    frameStyle: 'double-border',
    defaultAuthority: 'Meow Care Animal Hospital Bangkok',
    registryCode: 'VAC',
    decorations: ['shield', 'cross', 'blue-seal'],
  },

  microchip: {
    primaryColor: '#059669',
    secondaryColor: '#D1FAE5',
    accentColor: '#065F46',
    gradientFrom: '#F0FDF9',
    gradientTo: '#E6FAF0',
    borderColor: '#10B981',
    bgPattern: 'repeating-linear-gradient(45deg, rgba(16, 185, 129, 0.03) 0px, rgba(16, 185, 129, 0.03) 2px, transparent 2px, transparent 8px)',
    headerFont: 'Playfair Display',
    headerSize: '26px',
    icon: '📡',
    cornerOrnament: '◈',
    sealLabel: 'ISO MICROCHIP REGISTERED',
    watermarkText: 'DIGITAL IDENTITY',
    watermarkRotation: '-20deg',
    frameStyle: 'holographic',
    defaultAuthority: 'National Animal Registry & Meow World',
    registryCode: 'MCP',
    decorations: ['signal', 'chip', 'green-seal'],
  },

  adoption: {
    primaryColor: '#DB2777',
    secondaryColor: '#FCE7F3',
    accentColor: '#9D174D',
    gradientFrom: '#FFF5F9',
    gradientTo: '#FFE8F1',
    borderColor: '#EC4899',
    bgPattern: 'radial-gradient(ellipse at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
    headerFont: 'Playfair Display',
    headerSize: '26px',
    icon: '🏠',
    cornerOrnament: '♥',
    sealLabel: 'LOVED & ADOPTED',
    watermarkText: 'FOREVER HOME',
    watermarkRotation: '-15deg',
    frameStyle: 'embossed',
    defaultAuthority: 'Meow World Adoption Center',
    registryCode: 'ADP',
    decorations: ['heart', 'paw', 'pink-seal'],
  },

  health: {
    primaryColor: '#7C3AED',
    secondaryColor: '#EDE9FE',
    accentColor: '#5B21B6',
    gradientFrom: '#FAF5FF',
    gradientTo: '#F3ECFF',
    borderColor: '#8B5CF6',
    bgPattern: 'conic-gradient(from 45deg, rgba(139, 92, 246, 0.04) 0%, transparent 25%, rgba(139, 92, 246, 0.04) 50%, transparent 75%)',
    headerFont: 'Playfair Display',
    headerSize: '26px',
    icon: '🩺',
    cornerOrnament: '✦',
    sealLabel: 'HEALTH EXAMINED',
    watermarkText: 'VETERINARY CERTIFIED',
    watermarkRotation: '-28deg',
    frameStyle: 'minimal',
    defaultAuthority: 'Royal Veterinary Hospital & Meow World',
    registryCode: 'HLT',
    decorations: ['stethoscope', 'cross', 'purple-seal'],
  },

  general: {
    primaryColor: '#EA580C',
    secondaryColor: '#FFF7ED',
    accentColor: '#9A3412',
    gradientFrom: '#FFFBF5',
    gradientTo: '#FFF3E6',
    borderColor: '#F97316',
    bgPattern: 'linear-gradient(60deg, rgba(249, 115, 22, 0.04) 0%, transparent 50%, rgba(249, 115, 22, 0.04) 100%)',
    headerFont: 'Playfair Display',
    headerSize: '26px',
    icon: '📜',
    cornerOrnament: '❖',
    sealLabel: 'MEOW WORLD OFFICIAL',
    watermarkText: 'OFFICIAL DOCUMENT',
    watermarkRotation: '-22deg',
    frameStyle: 'classic',
    defaultAuthority: 'Meow World Official Registry',
    registryCode: 'CRT',
    decorations: ['scroll', 'stamp', 'orange-seal'],
  },
};

export function getCertTemplate(type: CertificateType): CertTemplate {
  return templates[type] || templates.general;
}

export function getCertFrameStyle(type: CertificateType): string {
  const template = getCertTemplate(type);

  switch (template.frameStyle) {
    case 'ornate':
      return `
        border: 4px double ${template.borderColor};
        box-shadow:
          0 0 0 2px ${template.secondaryColor},
          0 20px 40px -10px rgba(212, 175, 55, 0.25),
          inset 0 0 30px rgba(212, 175, 55, 0.05);
      `;
    case 'holographic':
      return `
        border: 3px solid ${template.borderColor};
        background: linear-gradient(135deg, ${template.gradientFrom} 0%, #FFFFFF 40%, ${template.gradientTo} 100%);
        box-shadow:
          0 0 0 1px ${template.borderColor}40,
          0 15px 35px -5px rgba(16, 185, 129, 0.2),
          0 0 60px -20px rgba(16, 185, 129, 0.15);
      `;
    case 'embossed':
      return `
        border: 3px solid ${template.borderColor};
        box-shadow:
          0 1px 0 ${template.borderColor},
          0 2px 0 ${template.secondaryColor},
          0 15px 35px -5px rgba(219, 39, 119, 0.2);
        text-shadow: 0 1px 0 rgba(255,255,255,0.8);
      `;
    case 'minimal':
      return `
        border: 2px solid ${template.borderColor};
        box-shadow: 0 10px 30px -10px rgba(124, 58, 237, 0.2);
      `;
    case 'classic':
      return `
        border: 4px double ${template.borderColor};
        box-shadow:
          0 0 0 1px ${template.secondaryColor},
          0 20px 40px -10px rgba(234, 88, 12, 0.2);
      `;
    case 'double-border':
    default:
      return `
        border: 4px double ${template.borderColor};
        box-shadow:
          0 0 0 2px ${template.secondaryColor},
          0 20px 40px -10px rgba(37, 99, 235, 0.2);
      `;
  }
}
