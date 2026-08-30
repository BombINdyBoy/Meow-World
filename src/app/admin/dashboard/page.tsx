'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalPets: number;
  totalEvents: number;
  totalHomes: number;
  totalNests: number;
  totalPosts: number;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
  icon: string;
}

interface FeatureUsage {
  name: string;
  icon: string;
  count: number;
  percentage: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPets: 0,
    totalEvents: 0,
    totalHomes: 0,
    totalNests: 0,
    totalPosts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
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
      await loadDashboard();
    }
    init();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    try {
      // นับจำนวนผู้ใช้ทั้งหมด
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // นับจำนวนบ้าน
      const { count: totalHomes } = await supabase
        .from('homes')
        .select('*', { count: 'exact', head: true });

      // นับจำนวนสัตว์เลี้ยง
      const { count: totalPets } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true });

      // นับจำนวน Life Journey Events
      const { count: totalEvents } = await supabase
        .from('life_journey_events')
        .select('*', { count: 'exact', head: true });

      // นับจำนวนรัง
      const { count: totalNests } = await supabase
        .from('nests')
        .select('*', { count: 'exact', head: true });

      // นับจำนวนโพสต์ชุมชน
      const { count: totalPosts } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true });

      // นับผู้ใช้ที่ active (มี activity ใน 7 วันที่ผ่านมา)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: activeUsers } = await supabase
        .from('life_journey_events')
        .select('author_id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo);

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalPets: totalPets || 0,
        totalEvents: totalEvents || 0,
        totalHomes: totalHomes || 0,
        totalNests: totalNests || 0,
        totalPosts: totalPosts || 0,
      });

      // สร้างข้อมูล Feature Usage
      setFeatureUsage([
        { name: 'สร้างสัตว์เลี้ยง', icon: '🐱', count: totalPets || 0, percentage: totalUsers ? Math.round(((totalPets || 0) / totalUsers) * 100) : 0 },
        { name: 'บันทึกความทรงจำ', icon: '📸', count: totalEvents || 0, percentage: totalPets ? Math.round(((totalEvents || 0) / totalPets) * 100) : 0 },
        { name: 'สร้างรัง', icon: '🪺', count: totalNests || 0, percentage: totalHomes ? Math.round(((totalNests || 0) / totalHomes) * 100) : 0 },
        { name: 'โพสต์ชุมชน', icon: '🏘️', count: totalPosts || 0, percentage: totalUsers ? Math.round(((totalPosts || 0) / totalUsers) * 100) : 0 },
      ]);

      // ดึงกิจกรรมล่าสุด
      const { data: recentEvents } = await supabase
        .from('life_journey_events')
        .select('event_type, content, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = (recentEvents || []).map((event) => ({
        type: event.event_type || 'memory',
        description: event.content || 'บันทึกความทรงจำใหม่',
        time: formatTimeAgo(event.created_at),
        icon: getEventIcon(event.event_type),
      }));

      setRecentActivity(activities);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📊</div>
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm mb-4"
          >
            ← กลับหน้าหลัก
          </button>
          <h1 className="text-3xl font-bold text-gray-900">📊 แดชบอร์ดผู้บริหาร</h1>
          <p className="text-gray-500 mt-1">ดูแล Meow World ด้วยตัวคนเดียว</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="👥"
            label="ผู้ใช้ทั้งหมด"
            value={stats.totalUsers}
            color="bg-blue-50 text-blue-700"
          />
          <StatCard
            icon="🟢"
            label="ใช้งานอยู่ (7 วัน)"
            value={stats.activeUsers}
            color="bg-green-50 text-green-700"
          />
          <StatCard
            icon="🐱"
            label="สัตว์เลี้ยง"
            value={stats.totalPets}
            color="bg-orange-50 text-orange-700"
          />
          <StatCard
            icon="📸"
            label="ความทรงจำ"
            value={stats.totalEvents}
            color="bg-purple-50 text-purple-700"
          />
        </div>

        {/* Feature Usage */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📈 การใช้งานฟีเจอร์</h2>
          <div className="space-y-4">
            {featureUsage.map((feature) => (
              <div key={feature.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <span>{feature.icon}</span>
                    {feature.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {feature.count} ครั้ง ({feature.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(feature.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🕐 กิจกรรมล่าสุด</h2>
            {recentActivity.length === 0 ? (
              <p className="text-gray-400 text-center py-4">ยังไม่มีกิจกรรม</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">💡 สิ่งที่ควรทำ</h2>
            <div className="space-y-3">
              {stats.totalUsers === 0 && (
                <TipCard
                  icon="👋"
                  title="ยังไม่มีผู้ใช้"
                  description="ลองเชิญเพื่อนมาทดลองใช้"
                  action={() => router.push('/login')}
                />
              )}
              {stats.totalPets === 0 && stats.totalUsers > 0 && (
                <TipCard
                  icon="🐱"
                  title="ยังไม่มีสัตว์เลี้ยง"
                  description="ผู้ใช้ยังไม่ได้เพิ่มสัตว์เลี้ยง"
                  action={() => router.push('/pets')}
                />
              )}
              {stats.totalEvents === 0 && stats.totalPets > 0 && (
                <TipCard
                  icon="📸"
                  title="ยังไม่มีความทรงจำ"
                  description="ผู้ใช้ยังไม่ได้บันทึกเรื่องราว"
                  action={() => router.push('/pets')}
                />
              )}
              {stats.activeUsers < stats.totalUsers && stats.totalUsers > 0 && (
                <TipCard
                  icon="😴"
                  title={`${stats.totalUsers - stats.activeUsers} คนไม่ได้ใช้งาน`}
                  description="ลองส่ง notification หรือ email เตือน"
                />
              )}
              {stats.totalUsers > 0 && stats.activeUsers > 0 && (
                <TipCard
                  icon="🎉"
                  title="มีผู้ใช้ active แล้ว!"
                  description={`${stats.activeUsers} คนใช้งานอยู่ในสัปดาห์นี้`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Feature Flags Quick Access */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">⚙️ ฟีเจอร์ที่เปิดอยู่</h2>
            <button
              onClick={() => router.push('/admin/flags')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              จัดการทั้งหมด →
            </button>
          </div>
          <FeatureFlagsPreview />
        </div>
      </div>
    </div>
  );
}

// === Components ===

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      <div className="text-sm opacity-75">{label}</div>
    </div>
  );
}

function TipCard({ icon, title, description, action }: { icon: string; title: string; description: string; action?: () => void }) {
  return (
    <div
      onClick={action}
      className={`flex items-start gap-3 p-3 bg-gray-50 rounded-xl ${action ? 'cursor-pointer hover:bg-gray-100' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function FeatureFlagsPreview() {
  const supabase = createClient();
  const [flags, setFlags] = useState<{ flag_name: string; is_enabled: boolean }[]>([]);

  useEffect(() => {
    async function loadFlags() {
      const { data } = await supabase
        .from('feature_flags')
        .select('flag_name, is_enabled')
        .order('flag_name');
      setFlags(data || []);
    }
    loadFlags();
  }, []);

  if (flags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {flags.map((flag) => (
        <div
          key={flag.flag_name}
          className={`px-3 py-1 rounded-full text-sm ${
            flag.is_enabled
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {flag.is_enabled ? '✅' : '❌'} {flag.flag_name}
        </div>
      ))}
    </div>
  );
}

// === Helpers ===

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'เมื่อสักครู่';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
  return date.toLocaleDateString('th-TH');
}

function getEventIcon(eventType: string | null): string {
  switch (eventType) {
    case 'medical': return '🏥';
    case 'vaccine': return '💉';
    case 'milestone': return '🎯';
    case 'memory': return '📸';
    default: return '📸';
  }
}
