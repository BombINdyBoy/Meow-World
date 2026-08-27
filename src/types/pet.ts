export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: string;
  breed?: string | null;
  birth_date?: string | null;
  weight?: number | null;
  created_at: string;
  updated_at: string;
}

export interface PetFormData {
  name: string;
  species: string;
  breed?: string;
  birth_date?: string;
  weight?: number;
}

export interface LifeJourneyEvent {
  id: string;
  pet_id: string;
  event_date: string;
  event_type: 'medical' | 'vaccine' | 'milestone' | 'memory' | string;
  title: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LifeJourneyEventFormData {
  event_date: string;
  event_type: string;
  title: string;
  description?: string;
}
