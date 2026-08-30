'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { FeatureFlag } from '@/types/feature-flags';

const FLAG_LABELS: Record<string, { icon: string; label: string; description: string }> = {
  home_mode: { icon: '🏠', label: 'Home Mode', description: 'หน้าหลัก - แสดงบ้านและสัตว์เลี้ยง' },
  nest_system: { icon: '🪺', label: 'Nest System', description: 'รังส่วนตัว - แต่ละคนมีรังของตัวเอง' },
  decoration: { icon: '🎨', label: 'Decoration', description: 'ตกแต่งบ้าน - ต้นไม้, ม้านั่ง, บ่อปลา' },
  community: { icon: '🏘️', label: 'Community', description: 'ชุมชน - แชร์เรื่องราวร่วมกัน' },
  vet_market: { icon: '🏪', label: 'Vet Market', description: 'ตลาดสัตวแพทย์ - ซื้อขายสินค้า' },
  family_package: { icon: '💾', label: 'Family Package', description: 'พื้นที่จัดเก็บ - ครอบครัวใช้ร่วมกัน' },
};

export default function FeatureFlagsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await loadFlags();
    }
    init();
  }, []);

  async function loadFlags() {
    setLoading(true);
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('flag_name');

    if (error) {
      console.error('Load flags error:', error);
    } else {
      setFlags(data || []);
    }
    setLoading(false);
  }

  async function toggleFlag(flagName: string, currentValue: boolean) {
    const { error } = await supabase
      .from('feature_flags')
      .update({ is_enabled: !currentValue, updated_at: new Date().toISOString() })
      .eq('flag_name', flagName);

    if (error) {
      console.error('Toggle flag error:', error);
    } else {
      await loadFlags();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm mb-4"
          >
            ← กลับหน้าหลัก
          </button>
          <h1 className="text-2xl font-bold text-gray-900">⚙️ Feature Flags</h1>
          <p className="text-gray-500 mt-1">เปิด/ปิดฟีเจอร์โดยไม่ต้อง deploy ใหม่</p>
        </div>

        <div className="space-y-4">
          {flags.map((flag) => {
            const info = FLAG_LABELS[flag.flag_name] || {
              icon: '🔧',
              label: flag.flag_name,
              description: flag.description || '',
            };

            return (
              <div
                key={flag.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{info.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{info.label}</h3>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFlag(flag.flag_name, flag.is_enabled)}
                    className={`
                      relative w-14 h-8 rounded-full transition-colors duration-200
                      ${flag.is_enabled ? 'bg-green-500' : 'bg-gray-300'}
                    `}
                  >
                    <span
                      className={`
                        absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                        ${flag.is_enabled ? 'translate-x-7' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    Status:{' '}
                    <span className={flag.is_enabled ? 'text-green-600' : 'text-gray-500'}>
                      {flag.is_enabled ? 'ON' : 'OFF'}
                    </span>
                  </span>
                  <span>Updated: {new Date(flag.updated_at).toLocaleDateString('th-TH')}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-blue-900 mb-2">💡 วิธีใช้</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• กด toggle เพื่อเปิด/ปิดฟีเจอร์แต่ละตัว</li>
            <li>• ฟีเจอร์ที่ปิดอยู่จะไม่แสดงในหน้าเว็บ</li>
            <li>• ไม่ต้อง deploy ใหม่ — เปลี่ยนทันที!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
