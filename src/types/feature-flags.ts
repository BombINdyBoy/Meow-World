export interface FeatureFlag {
  id: string;
  flag_name: string;
  description: string | null;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[] | null;
  created_at: string;
  updated_at: string;
}

export type FlagName =
  | 'home_mode'
  | 'nest_system'
  | 'decoration'
  | 'community'
  | 'vet_market'
  | 'family_package';
