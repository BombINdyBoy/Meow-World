'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { NestCard } from '@/components/nests/NestCard';
import { NestWithPets } from '@/types/nest';

export default function NestsPage() {
  const router = useRouter();
  const supabase = createClient();
  const nestEnabled = useFeatureFlag('nest_system');

  const [nests, setNests] = useState<NestWithPets[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newNestName, setNewNestName] = useState('');
  const [newNestDesc, setNewNestDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      await loadNests(session.user.id);
    }
    init();
  }, []);

  async function loadNests(userId: string) {
    setLoading(true);

    // Get user's home
    const { data: homes } = await supabase
      .from('homes')
      .select('id')
      .eq('owner_id', userId)
      .limit(1);

    if (!homes || homes.length === 0) {
      setLoading(false);
      return;
    }

    const homeId = homes[0].id;

    // Get nests with pets
    const { data: nestsData } = await supabase
      .from('nests')
      .select(`
        *,
        pets:nests!pets_nest_id_fkey(id, name, species, breed, avatar_url)
      `)
      .eq('home_id', homeId)
      .order('created_at', { ascending: false });

    setNests((nestsData as NestWithPets[]) || []);
    setLoading(false);
  }

  async function createNest() {
    if (!user || !newNestName.trim()) return;
    setSubmitting(true);

    // Get user's home
    const { data: homes } = await supabase
      .from('homes')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (!homes || homes.length === 0) {
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from('nests').insert({
      home_id: homes[0].id,
      owner_id: user.id,
      nest_name: newNestName.trim(),
      description: newNestDesc.trim() || null,
    });

    if (!error) {
      setNewNestName('');
      setNewNestDesc('');
      setShowForm(false);
      await loadNests(user.id);
    }

    setSubmitting(false);
  }

  if (!nestEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">ฟีเจอร์นี้ยังไม่เปิดใช้งาน</h2>
          <p className="text-gray-500 mb-4">Nest System อยู่ระหว่างการพัฒนา</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="mb-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← กลับหน้าหลัก
        </button>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🪺 รังส่วนตัว</h1>
            <p className="text-gray-500 mt-1">สร้างรังสำหรับสัตว์เลี้ยงแต่ละตัว</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600"
            >
              + สร้างรังใหม่
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-gray-900 mb-4">สร้างรังใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อรัง *</label>
                <input
                  type="text"
                  value={newNestName}
                  onChange={(e) => setNewNestName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="เช่น รังของ arthur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <textarea
                  value={newNestDesc}
                  onChange={(e) => setNewNestDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={2}
                  placeholder="รังสำหรับ..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={createNest}
                  disabled={!newNestName.trim() || submitting}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                >
                  {submitting ? 'กำลังสร้าง...' : 'สร้างรัง'}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">กำลังโหลด...</div>
        ) : nests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🪺</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">ยังไม่มีรัง</h3>
            <p className="text-gray-500 mb-4">สร้างรังแรกสำหรับสัตว์เลี้ยงของคุณ</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600"
            >
              + สร้างรังแรก
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nests.map((nest) => (
              <NestCard
                key={nest.id}
                nest={nest}
                onSelect={(n) => router.push(`/nests/${n.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
