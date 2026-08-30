export type SpeciesType = 'cat' | 'dog' | 'bird' | 'rabbit' | 'hamster' | 'other';

export interface SpeciesConfig {
  id: SpeciesType;
  name: string;
  nameThai: string;
  icon: string;
  features: SpeciesFeature[];
  color: string;
}

export interface SpeciesFeature {
  key: string;
  name: string;
  nameThai: string;
  icon: string;
  description: string;
}

// Species configurations
export const SPECIES_CONFIG: Record<SpeciesType, SpeciesConfig> = {
  cat: {
    id: 'cat',
    name: 'Cat',
    nameThai: 'แมว',
    icon: '🐱',
    color: 'bg-orange-100 text-orange-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัวของแมว' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
      { key: 'certificate', name: 'Certificate', nameThai: 'ใบรับรอง', icon: '📜', description: 'ใบรับรองสุขภาพ' },
    ],
  },
  dog: {
    id: 'dog',
    name: 'Dog',
    nameThai: 'สุนัข',
    icon: '🐕',
    color: 'bg-blue-100 text-blue-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัวของสุนัข' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
      { key: 'walk_tracker', name: 'Walk Tracker', nameThai: 'บันทึกการเดิน', icon: '🚶', description: 'ติดตามการเดินออกกำลังกาย' },
      { key: 'training_log', name: 'Training Log', nameThai: 'บันทึกการฝึก', icon: '🎯', description: 'บันทึกการฝึกอบรม' },
      { key: 'vaccination', name: 'Vaccination', nameThai: 'วัคซีน', icon: '💉', description: 'บันทึกวัคซีน' },
    ],
  },
  bird: {
    id: 'bird',
    name: 'Bird',
    nameThai: 'นก',
    icon: '🐦',
    color: 'bg-green-100 text-green-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัวของนก' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
      { key: 'flight_log', name: 'Flight Log', nameThai: 'บันทึกการบิน', icon: '🪶', description: 'ติดตามการบิน' },
      { key: 'cage_setup', name: 'Cage Setup', nameThai: 'ตั้งค่ากรง', icon: '🏠', description: 'ตั้งค่าสภาพแวดล้อม' },
    ],
  },
  rabbit: {
    id: 'rabbit',
    name: 'Rabbit',
    nameThai: 'กระต่าย',
    icon: '🐰',
    color: 'bg-pink-100 text-pink-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัวของกระต่าย' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
      { key: 'housing_setup', name: 'Housing Setup', nameThai: 'ตั้งค่าที่อยู่', icon: '🏡', description: 'ตั้งค่าสภาพแวดล้อม' },
      { key: 'diet_planner', name: 'Diet Planner', nameThai: 'แผนอาหาร', icon: '🥬', description: 'วางแผนอาหาร' },
    ],
  },
  hamster: {
    id: 'hamster',
    name: 'Hamster',
    nameThai: 'แฮมสเตอร์',
    icon: '🐹',
    color: 'bg-yellow-100 text-yellow-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัว' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
    ],
  },
  other: {
    id: 'other',
    name: 'Other',
    nameThai: 'อื่นๆ',
    icon: '🐾',
    color: 'bg-gray-100 text-gray-700',
    features: [
      { key: 'passport', name: 'Passport', nameThai: 'พาสปอร์ต', icon: '📋', description: 'ข้อมูลส่วนตัว' },
      { key: 'life_journey', name: 'Life Journey', nameThai: 'เส้นทางชีวิต', icon: '📸', description: 'บันทึกความทรงจำ' },
    ],
  },
};

export function getSpeciesConfig(species: string): SpeciesConfig {
  const key = species.toLowerCase() as SpeciesType;
  return SPECIES_CONFIG[key] || SPECIES_CONFIG.other;
}

export function getSpeciesList(): SpeciesConfig[] {
  return Object.values(SPECIES_CONFIG);
}
