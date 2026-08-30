export interface Nest {
  id: string;
  home_id: string;
  owner_id: string;
  nest_name: string;
  description: string | null;
  theme: string;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NestWithPets extends Nest {
  pets?: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    avatar_url: string | null;
  }[];
}
