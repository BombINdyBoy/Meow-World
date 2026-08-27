export type UserRole = 'owner' | 'editor' | 'viewer';

export interface UserProfile {
  id: string;
  email?: string;
  displayName: string;
  avatarUrl?: string;
  avatar_url?: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed: string | null;
  gender?: 'male' | 'female' | 'unknown';
  birth_date: string | null;
  weight: number | null;
  avatar_url?: string;
  microchip_id?: string;
  color_marking?: string;
  is_spayed?: boolean;
  notes?: string;
  created_at: string;
}

export type EventCategory =
  | 'memory' // บันทึกความทรงจำ / รูป / วิดีโอ
  | 'birth' // แรกเกิด / ภาพถ่ายตั้งแต่วัยเด็ก
  | 'passport' // การสร้างพาสปอร์ตประจำตัว
  | 'milestone' // ก้าวสำคัญ / วันแรกที่มาถึงบ้าน
  | 'medical' // ตรวจสุขภาพ / พบแพทย์
  | 'vaccine' // ฉีดวัคซีน / ถ่ายพยาธิ
  | 'certificate' // การได้รับใบรับรองดิจิทัล Meow World
  | 'birthday' // วันเกิด / งานฉลอง
  | 'grooming'; // กรูมมิ่ง / อาบน้ำตัดขน

export interface JourneyComment {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  created_at: string;
}

export interface JourneyEvent {
  id: string;
  pet_id?: string; // Main pet ID (for single pet reference)
  tagged_pet_ids?: string[]; // Multiple tagged pets in this event
  tagged_user_ids?: string[]; // Tagged co-owners / caretakers
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  event_date: string;
  event_type: EventCategory;
  title: string;
  description: string | null;
  image_url?: string;
  video_url?: string; // Direct video or video stream embed
  certificate_id?: string; // If auto-generated from Digital Certificate
  likes_count?: number;
  is_liked?: boolean;
  comments?: JourneyComment[];
  location?: string;
  created_at: string;
}

export interface Family {
  id: string;
  name: string;
  owner_id: string;
  address?: string;
  cover_image?: string;
  created_at: string;
}

export interface FamilyMember {
  family_id: string;
  user_id: string;
  display_name: string;
  email?: string;
  avatar_url?: string;
  avatarUrl?: string;
  role: UserRole;
  joined_at: string;
}

export interface PetShare {
  pet_id: string;
  family_id: string;
  permission: 'view' | 'edit';
}

export type CertificateType = 'pedigree' | 'vaccine' | 'microchip' | 'adoption' | 'health' | 'general';

export interface DigitalCertificate {
  id: string;
  pet_id: string;
  cert_type: CertificateType;
  title: string;
  certificate_no: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date?: string;
  original_doc_url: string; // The photo of the real physical document
  generated_cert_url?: string; // The Meow World layered certificate composite
  security_hash: string;
  verification_qr_payload: string;
  metadata?: {
    sire_name?: string;
    dam_name?: string;
    registry_org?: string;
    doctor_name?: string;
    clinic_name?: string;
    vaccine_batch?: string;
  };
  created_at: string;
}

export interface InviteToken {
  token: string;
  family_id: string;
  family_name: string;
  role: UserRole;
  created_by: string;
  created_by_name: string;
  expires_at: string;
  is_used: boolean;
}
