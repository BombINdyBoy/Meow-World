export interface Pet {
  id: string;
  home_id: string;
  name: string;
  nickname?: string | null;
  species: string;
  breed?: string | null;
  gender?: string | null;
  birth_date?: string | null;
  color?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
  // Optional fields added via migration
  weight?: number | null;
  updated_at?: string | null;
}

export interface PetFormData {
  name: string;
  species: string;
  nickname?: string;
  breed?: string;
  gender?: string;
  birth_date?: string;
  color?: string;
  weight?: number;
}

export interface LifeJourneyEvent {
  id: string;
  home_id: string;
  pet_id: string | null;
  author_id: string | null;
  content?: string | null;
  event_type: string;
  media_urls?: string[] | null;
  participant_ids?: string[] | null;
  created_at: string;
  // Fields from form (mapped to content/event_type)
  event_date?: string;
  title?: string;
  description?: string;
}

export interface LifeJourneyEventFormData {
  event_date: string;
  event_type: string;
  title: string;
  description?: string;
}
