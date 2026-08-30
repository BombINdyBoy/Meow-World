'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FlagName } from '@/types/feature-flags';

export function useFeatureFlag(flagName: FlagName): boolean {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlag() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('feature_flags')
          .select('is_enabled')
          .eq('flag_name', flagName)
          .single();

        if (error) {
          console.error('Feature flag check failed:', error);
          setIsEnabled(false);
        } else {
          setIsEnabled(data?.is_enabled ?? false);
        }
      } catch (err) {
        console.error('Feature flag error:', err);
        setIsEnabled(false);
      } finally {
        setLoading(false);
      }
    }

    checkFlag();
  }, [flagName]);

  return isEnabled;
}

export function useFeatureFlags(flags: FlagName[]): Record<FlagName, boolean> {
  const [flagsState, setFlagsState] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFlags() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('feature_flags')
          .select('flag_name, is_enabled')
          .in('flag_name', flags);

        if (error) {
          console.error('Feature flags check failed:', error);
        } else if (data) {
          const flagsMap: Record<string, boolean> = {};
          data.forEach((flag) => {
            flagsMap[flag.flag_name] = flag.is_enabled;
          });
          setFlagsState(flagsMap);
        }
      } catch (err) {
        console.error('Feature flags error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkFlags();
  }, [flags.join(',')]);

  // Return with all flags, default to false if not found
  const result: Record<string, boolean> = {};
  flags.forEach((flag) => {
    result[flag] = flagsState[flag] ?? false;
  });

  return result as Record<FlagName, boolean>;
}
